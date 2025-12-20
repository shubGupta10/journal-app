import { NextResponse, NextRequest } from "next/server";
import { IJournalEntry, JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import { auth } from "@/lib/auth/auth";
import redis from "@/lib/redis";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers: req.headers
        })
        const user = session?.user;
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { _id } = await req.json();

        if (!_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const entry = await JournalEntry.findOne({ _id, userId: user.id });
        if (!entry) {
            return NextResponse.json({ error: "Entry not found or unauthorized" }, { status: 404 });
        }

        await JournalEntry.deleteOne({ _id, userId: user.id });

        // Cache Invalidation
        const dashboardCacheKey = `journal:dashboard:${user.id}`;
        const streakCacheKey = `journal:user-streak:${user.id}`;
        const timelineCacheKey = `journal:timeline:${user.id}`;
        const entryCacheKey = `journal:entry:${_id}`;

        await Promise.all([
            redis.del(dashboardCacheKey),
            redis.del(streakCacheKey),
            redis.del(timelineCacheKey),
            redis.del(entryCacheKey)
        ]);

        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}