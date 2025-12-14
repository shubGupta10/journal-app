import {NextResponse, NextRequest} from "next/server";
import {JournalEntry} from "@/lib/models/journalEntryModel";
import {connectDB} from "@/lib/db/DbConnect";
import {auth} from "@/lib/auth/auth";
import {recordTimelineEvent} from "@/actions/timeline/timelineEvents";
import mongoose from "mongoose";

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: req.headers
        })

        const user = session?.user;
        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {_id, title, content, mood, tags} = await req.json() as {
            _id?: string;
            title?: string;
            content?: string;
            mood?: string;
            tags?: string[];
        };

        if(!_id || !title || !content || !mood) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const entry = await JournalEntry.findOne({ _id, userId: new mongoose.Types.ObjectId(user.id as string)});
        if(!entry){
            return NextResponse.json({error: "Entry not found or unauthorized"}, {status: 404});
        }

        entry.title = title;
        entry.content = content;
        entry.mood = mood;
        entry.tags = tags || [];
        entry.updatedAt = new Date();

        const updatedEntry = await entry.save();

        try {
            await recordTimelineEvent({
                userId: user.id,
                type: "updated",
                entryId: updatedEntry._id.toString(),
                title: updatedEntry.title,
                snapshot: updatedEntry.content,
            });
        } catch (timelineError) {
            console.error("Failed to record timeline event, but entry was updated:", timelineError);
        }

        return NextResponse.json({entry: updatedEntry}, {status: 200});
    }catch (error) {
        console.error("Error updating journal entry:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}