"use server";

import { JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import redis from "@/lib/redis";

export async function getALLEntriesByUserId(userId: string) {
  const cacheKey = `journal:entries:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached as any[];

  await connectDB();

  const entries = await JournalEntry.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const formatted = entries.map(entry => ({
    _id: entry._id.toString(),
    userId: entry.userId.toString(),
    title: entry.title,
    content: entry.content,
    tags: entry.tags,
    mood: entry.mood,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  await redis.set(cacheKey, formatted, { ex: 300 });
  return formatted;
}
