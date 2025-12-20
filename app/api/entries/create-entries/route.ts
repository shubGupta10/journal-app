import { NextResponse, NextRequest } from "next/server";
import { IJournalEntry, JournalEntry } from "@/lib/models/journalEntryModel";
import { connectDB } from "@/lib/db/DbConnect";
import { auth } from "@/lib/auth/auth";
import { User } from "@/lib/models/userModel";
import { UserStreak } from "@/lib/models/userStreakModel";
import { recordTimelineEvent } from "@/actions/timeline/timelineEvents";
import mongoose from "mongoose";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers: req.headers
        });
        const user = session?.user;
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, mood, tags } = await req.json() as IJournalEntry;
        if (!title || !content || !mood) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingEntry = await JournalEntry.findOne({
            userId: new mongoose.Types.ObjectId(user.id as string),
            title,
            content,
            mood
        });

        if (existingEntry) {
            return NextResponse.json({ error: "Duplicate entry: An identical entry already exists" }, { status: 409 });
        }

        const newEntry = new JournalEntry({
            userId: new mongoose.Types.ObjectId(user.id as string),
            title,
            content,
            mood,
            tags: tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedEntry = await newEntry.save();

        await recordTimelineEvent({
            userId: user.id,
            type: "created",
            entryId: savedEntry._id.toString(),
            title: savedEntry.title,
            snapshot: savedEntry.content,
        });

        const userId = new mongoose.Types.ObjectId(user?.id);
        const today = new Date().toISOString().split("T")[0];

        let userStreak = await UserStreak.findOne({ userId });

        if (!userStreak) {
            userStreak = new UserStreak({
                userId,
                currentStreak: 1,
                lastEntryDate: today,
            });
        } else {
            const lastDate = userStreak.lastEntryDate;
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

            if (lastDate === today) {
                userStreak.currentStreak = userStreak.currentStreak;
            } else if (lastDate === yesterday) {
                userStreak.currentStreak = (userStreak.currentStreak || 0) + 1;
            } else {
                userStreak.currentStreak = 1;
            }

            userStreak.lastEntryDate = today;
        }

        await userStreak.save();

        // Cache Invalidation
        const dashboardCacheKey = `journal:dashboard:${user.id}`;
        const streakCacheKey = `journal:user-streak:${user.id}`;
        const timelineCacheKey = `journal:timeline:${user.id}`;

        await Promise.all([
            redis.del(dashboardCacheKey),
            redis.del(streakCacheKey),
            redis.del(timelineCacheKey)
        ]);

        return NextResponse.json({ entry: savedEntry }, { status: 201 });
    } catch (error) {
        console.error("Error creating journal entry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}