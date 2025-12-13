"use server"

import {connectDB} from "@/lib/db/DbConnect";
import {TimelineEvent} from "@/lib/models/timelineEvent";

type TimelineEventInput = {
    userId: string;
    type: "ENTRY_CREATED" | "ENTRY_UPDATED";
    entryId: string;
    title?: string;
    content?: string;
    createdAt?: Date;
};

export async function recordTimelineEvent({
    userId,
    type,
    entryId,
    title,
    content,
    createdAt
}: TimelineEventInput) {
    try {
        if(!userId || !type || !entryId) return;

        await connectDB();

        const contentPreview = content ? content.replace(/\n/g, " ").slice(0, 150) : "";

        await TimelineEvent.create({
            userId,
            entryId,
            type,
            title: title || "Untitled Entry",
            snapshot: contentPreview,
            createdAt: createdAt || new Date(),
        })
    }catch (error){
        console.error("Timeline event failed:", error);
    }
}