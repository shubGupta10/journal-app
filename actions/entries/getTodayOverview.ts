"use server"

import { connectDB } from "@/lib/db/DbConnect";
import { JournalEntry } from "@/lib/models/journalEntryModel";
import { UserStreak } from "@/lib/models/userStreakModel";
import mongoose from "mongoose";
import { cache } from "react";

export const getUserStreak = cache(async (userId: string) => {
    if (!userId) return null;

    await connectDB();

    const userStreak = await UserStreak.findOne({
        userId: new mongoose.Types.ObjectId(userId),
    })

    return {
        currentStreak: userStreak?.currentStreak || 0,
        lastEntryDate: userStreak?.lastEntryDate || null,
    }
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