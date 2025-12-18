"use server";

import { getUserStreak, getLastEntry } from "@/actions/entries/getTodayOverview";
import { JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import redis from "@/lib/redis";

export async function getDashboardData(userId: string) {
  const cacheKey = `journal:dashboard:${userId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return cached as {
      streak: { currentStreak: number; lastEntryDate: string | null };
      lastEntry: { title: string; updatedAt: string } | null;
      recentEntries: any[];
    };
  }

  await connectDB();

  const [streak, lastEntry, recentEntriesRaw] = await Promise.all([
    getUserStreak(userId),
    getLastEntry(userId),
    JournalEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const recentEntries = recentEntriesRaw.map(entry => ({
    _id: entry._id.toString(),
    userId: entry.userId.toString(),
    title: entry.title,
    content: entry.content,
    tags: entry.tags,
    mood: entry.mood,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  const data = {
    streak,
    lastEntry,
    recentEntries,
  };

  await redis.set(cacheKey, data, { ex: 300 });

  return data;
}
