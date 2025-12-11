import {NextResponse, NextRequest} from "next/server";
import {IJournalEntry, JournalEntry} from "@/lib/models/journalEntryModel";
import {connectDB} from "@/lib/db/DbConnect";
import {auth} from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers: req.headers
        });
        const user = session?.user;
        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {title, content, mood, tags} = await req.json() as IJournalEntry;
        if(!title || !content || !mood) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const existingEntry = await JournalEntry.findOne({
            userId: user.id as string,
            title,
            content,
            mood
        });

        if(existingEntry) {
            return NextResponse.json({error: "Duplicate entry: An identical entry already exists"}, {status: 409});
        }

        const newEntry = new JournalEntry({
            userId: user.id as string,
            title,
            content,
            mood,
            tags: tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedEntry = await newEntry.save();

        return NextResponse.json({entry: savedEntry}, {status: 201});
    } catch (error) {
        console.error("Error creating journal entry:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}