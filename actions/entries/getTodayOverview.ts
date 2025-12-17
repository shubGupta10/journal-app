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

    if (!userStreak || !userStreak.lastEntryDate) {
        const result = {
            currentStreak: 0,
            lastEntryDate: null,
        };
        await redis.set(cacheKey, result, {
            ex: 60 * 5, // Cache for 5 minutes
        });
        return result;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

    let finalStreak = userStreak.currentStreak;
    let finalDate = userStreak.lastEntryDate;

    if (userStreak.lastEntryDate !== today && userStreak.lastEntryDate !== yesterday) {
        finalStreak = 0;
        finalDate = "";

        userStreak.currentStreak = 0;
        userStreak.lastEntryDate = "";
        await userStreak.save();
    }

    const result = {
        curentStreak: finalStreak,
        lastEntryDate: finalDate
    };

    await redis.set(cacheKey, result, {
        ex: 60 * 5, // Cache for 5 minutes
    });
    return result;
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