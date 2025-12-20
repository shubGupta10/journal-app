"use server";

import { JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import redis from "@/lib/redis";

type SortType = "newest" | "oldest" | "title";

type FilterOptions = {
  mood?: string;
  tag?: string;
};

export async function getALLEntriesByUserId(
  userId: string,
  sort: SortType,
  filters: FilterOptions = {}
) {
  const cacheKey = `journal:entries:${userId}:${sort}:${filters.mood || "all"}:${filters.tag || "all"}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached as any[];

  await connectDB();

  let sortQuery: any = { createdAt: -1 };
  if (sort === "oldest") {
    sortQuery = { createdAt: 1 };
  }
  if (sort === "title") {
    sortQuery = { title: 1 };
  }


  let filterQuery: any = { userId };
  if (filters.mood) {
    filterQuery.mood = filters.mood
  }
  if (filters.tag) {
    filterQuery.tags = { $in: [filters.tag] };
  }

  const entries = await JournalEntry.find(
    filterQuery,
    {
      title: 1,
      content: { $substrCP: ["$content", 0, 200] },
      tags: 1,
      mood: 1,
      createdAt: 1,
      updatedAt: 1,
      userId: 1,
    } as any
  )
    .sort(sortQuery)
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
