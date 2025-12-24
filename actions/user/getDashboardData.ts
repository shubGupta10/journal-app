"use server";

import { getUserStreak, getLastEntry } from "@/actions/entries/getTodayOverview";
import { JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import redis from "@/lib/redis";
import { cache } from "react";

export const getDashboardData = cache(async (userId: string) => {
  const cacheKey = `journal:dashboard:${userId}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached as {
        streak: { currentStreak: number; lastEntryDate: string | null };
        lastEntry: { title: string; updatedAt: string } | null;
        recentEntries: any[];
      };
    }
  } catch (redisError) {
    console.warn("Redis cache read failed, continuing without cache:", redisError);
  }

  await connectDB();

  const [streak, lastEntry, recentEntriesRaw] = await Promise.all([
    getUserStreak(userId),
    getLastEntry(userId),
    JournalEntry.find(
      { userId },
      {
        title: 1,
        content: { $substrCP: ["$content", 0, 200] }, // Fetch only first 200 chars
        tags: 1,
        mood: 1,
        createdAt: 1,
        updatedAt: 1
      } as any
    )
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const recentEntries = recentEntriesRaw.map((entry: any) => ({
    _id: entry._id.toString(),
    userId: entry.userId ? entry.userId.toString() : userId, // userId might not be projected if we are strict, but it's fine
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

  try {
    await redis.set(cacheKey, data, { ex: 300 });
  } catch (redisError) {
    console.warn("Redis cache write failed:", redisError);
  }

  return data;
});
