"use server"

import {connectDB} from "@/lib/db/DbConnect";
import {TimelineEvent} from "@/lib/models/timelineEvent";
import {cache} from "react";
import {auth} from "@/lib/auth/auth";
import mongoose from "mongoose";


type TimelineGroup = {
    date: string;        // YYYY-MM-DD
    label: string;       // Today / Yesterday / Jan 10, 2025
    events: Array<{
        id: string;
        type: string;
        entryId?: string;
        title?: string;
        snapshot?: string;
        createdAt: string;
    }>;
};

type TimelineEventInput = {
    userId: string;
    type: "created" | "updated";
    entryId: string;
    title?: string;
    snapshot?: string;
};

export async function recordTimelineEvent({userId, type, entryId, title, snapshot,}: TimelineEventInput) {
    try {
        if (!userId || !type || !entryId) {
            console.log("Timeline event skipped - missing required fields:", {userId, type, entryId});
            return;
        }

        await connectDB();

        const contentPreview = snapshot
            ? snapshot.replace(/\n/g, " ").slice(0, 150)
            : "No content preview available";

        const event = await TimelineEvent.create({
            userId: new mongoose.Types.ObjectId(userId),
            entryId: new mongoose.Types.ObjectId(entryId),
            type,
            title: title || "Untitled Entry",
            snapshot: contentPreview,
        });

    } catch (error) {
        console.error("Timeline event failed:", error);
        throw error;
    }
}

export const getTimelineEvents = cache(async (): Promise<TimelineGroup[]> => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await import("next/headers").then(h => h.headers()),
        })

        const user = session?.user;

        if(!user) {
            console.log("No user found, returning empty array");
            return [];
        }

        const events = await TimelineEvent.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .lean();

        const groupedByDate: Record<string, any> = {};

        for( const event of events){
            const extractedDate = new Date(event.createdAt)
                .toISOString()
                .split("T")[0];

            if(!groupedByDate[extractedDate]){
                groupedByDate[extractedDate] = {
                    date: extractedDate,


                    //human redable label
                    label: new Date(extractedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),

                    events: [],
                }
            }


            groupedByDate[extractedDate].events.push({
                id: event._id.toString(),
                type: event.type,
                entryId: event.entryId?.toString(),
                title: event.title,
                snapshot: event.snapshot?.slice(0, 150),
                createdAt: event.createdAt.toISOString(),
            });
        }

        //assign position
        for(const extractedDate in groupedByDate){
            groupedByDate[extractedDate].events =
                groupedByDate[extractedDate].events.map((event: any, index: number) => ({
                    ...event,
                    // Even index → left, odd index → right
                    position: index % 2 === 0 ? "left" : "right",
                }));
        }

        const result = Object.values(groupedByDate);
        console.log(`Returning ${result.length} grouped dates`);
        return result;
    } catch (error) {
        console.error("❌ Error fetching timeline events:", error);
        return [];
    }
})