"use server"

import { cache } from 'react'
import { JournalEntry } from "@/lib/models/journalEntryModel";
import { currentUser } from "@/lib/auth/currentUser";
import { connectDB } from "@/lib/db/DbConnect";
import redis from '@/lib/redis';

export const getRecentEntries = cache(async () => {
    const user = await currentUser();
    if (!user) return null;
    const cacheKey = `journal:recent-entries:${user.id}`;
    const cachedEntries = await redis.get(cacheKey);
    if (cachedEntries) {
        return cachedEntries as any[];
    }

    await connectDB()

    const entries = await JournalEntry.find({
        userId: user?.id,
    })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    const formattedEntries = entries.map(entry => ({
        _id: entry._id.toString(),
        userId: entry.userId.toString(),
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
    }));
    await redis.set(cacheKey, formattedEntries, {
        ex: 60 * 5, // Cache for 5 minutes
    });
    return formattedEntries;
})

export const getRecentEntryById = cache(async (id: string) => {
    const user = await currentUser();
    if (!user) return null;

    const cacheKey = `journal:entry:${id}`;
    const cachedEntry = await redis.get(cacheKey);
    if (cachedEntry) {
        return cachedEntry as any;
    }

    await connectDB();

    const singleEntry = await JournalEntry.findOne({
        _id: id,
        userId: user?.id,
    }).lean();

    if (!singleEntry) return null;

    const formattedEntry = {
        _id: singleEntry._id.toString(),
        userId: singleEntry.userId.toString(),
        title: singleEntry.title,
        content: singleEntry.content,
        tags: singleEntry.tags,
        mood: singleEntry.mood,
        createdAt: singleEntry.createdAt.toISOString(),
        updatedAt: singleEntry.updatedAt.toISOString(),
    };

    await redis.set(cacheKey, formattedEntry, {
        ex: 60 * 5, // Cache for 5 minutes
    });

    return formattedEntry;
})

export const getALLEntries = cache(async () => {
    const user = await currentUser();
    if (!user) return null;

    const cacheKey = `journal:entries:${user.id}`
    const cacheEntries = await redis.get(cacheKey);
    if (cacheEntries) {
        return cacheEntries as any[];
    }


    await connectDB();

    const entries = await JournalEntry.find({
        userId: user?.id,
    })
        .sort({ createdAt: -1 })
        .lean();

    const formattedEntries = entries.map(entry => ({
        _id: entry._id.toString(),
        userId: entry.userId.toString(),
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
    }))

    await redis.set(cacheKey, formattedEntries, {
        ex: 60 * 5, // Cache for 5 minutes
    })
    return formattedEntries;
})