"use server"

import {cache} from 'react'
import {JournalEntry} from "@/lib/models/journalEntryModel";
import {currentUser} from "@/lib/auth/currentUser";
import {connectDB} from "@/lib/db/DbConnect";

export const getRecentEntries = cache(async () => {
    const user = await currentUser();
    console.log("Here is current User", user)

    await connectDB()

    const entries = await JournalEntry.find({
        userId: user?.id,
    })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    return entries;
})