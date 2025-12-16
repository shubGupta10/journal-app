"use server"

import { connectDB } from "@/lib/db/DbConnect";
import { JournalEntry } from "@/lib/models/journalEntryModel";
import { UserStreak } from "@/lib/models/userStreakModel";
import redis from "@/lib/redis";
import mongoose from "mongoose";
import { cache } from "react";

export const getUserStreak = cache(async (userId: string) => {
    if (!userId) return null;
    const cacheKey = `journal:user-streak:${userId}`;
    const cachedStreak = await redis.get(cacheKey);
    if (cachedStreak) {
        return cachedStreak as { currentStreak: number; lastEntryDate: string | null };
    }

    await connectDB();

    const userStreak = await UserStreak.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    })

    const formattedStreak = {
        currentStreak: userStreak?.currentStreak || 0,
        lastEntryDate: userStreak?.lastEntryDate || null,
    }
    await redis.set(cacheKey, formattedStreak, {
        ex: 60 * 5, // Cache for 5 minutes
    });
    return formattedStreak;
})


export const getLastEntry = cache(async (userId: string) => {
    if (!userId) return null;

    await connectDB();

    const entry = await JournalEntry.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    })
        .sort({ updatedAt: -1 })
        .lean();

    if (!entry) return null;

    return {
        _id: entry._id.toString(),
        title: entry.title || "Untitled entry",
        updatedAt: entry.updatedAt.toISOString(),
    };
});