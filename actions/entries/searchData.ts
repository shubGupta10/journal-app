"use server"

import {currentUser} from "@/lib/auth/currentUser";
import {connectDB} from "@/lib/db/DbConnect";
import {JournalEntry} from "@/lib/models/journalEntryModel";

export const searchData = async (query: string) => {
    if(!query || query.trim().length == 0) return [];

    const user = await currentUser();
    if(!user) return [];

    await connectDB();

    const regex = new RegExp(query, 'i');

    const entries = await JournalEntry.find({
        userId: user?.id,
        $or: [
            { title: { $regex: regex} },
            { content: { $regex: regex} },
            { mood: { $regex: regex} },
            { tags: { $regex: regex} },
        ]
    })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    return entries.map((entry) => ({
        _id: entry._id.toString(),
        userId: entry.userId.toString(),
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
    }))
}