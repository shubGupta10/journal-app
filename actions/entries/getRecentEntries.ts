"use server"

import {cache} from 'react'
import {JournalEntry} from "@/lib/models/journalEntryModel";
import {currentUser} from "@/lib/auth/currentUser";
import {connectDB} from "@/lib/db/DbConnect";

export const getRecentEntries = cache(async () => {
    const user = await currentUser();
    await connectDB()

    const entries = await JournalEntry.find({
        userId: user?.id,
    })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    return entries.map(entry => ({
        _id: entry._id.toString(),
        userId: entry.userId.toString(),
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
    }));
})

export const getRecentEntryById = cache(async (id: string) => {
        const user = await  currentUser();
        await connectDB();

        const singleEntry = await JournalEntry.findOne({
            _id: id,
            userId: user?.id,
        }).lean();

        if(!singleEntry) return null;

    return {
        _id: singleEntry._id.toString(),
        userId: singleEntry.userId.toString(),
        title: singleEntry.title,
        content: singleEntry.content,
        tags: singleEntry.tags,
        mood: singleEntry.mood,
        createdAt: singleEntry.createdAt.toISOString(),
        updatedAt: singleEntry.updatedAt.toISOString(),
    };
})