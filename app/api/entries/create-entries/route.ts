import {NextResponse, NextRequest} from "next/server";
import {IJournalEntry, JournalEntry} from "@/lib/models/journalEntryModel";
import {connectDB} from "@/lib/db/DbConnect";
import {auth} from "@/lib/auth/auth";
import {User} from "@/lib/models/userModel";

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

        const userDocument = await User.findById(user?.id);
        if (!userDocument) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const today = new Date().toISOString().split("T")[0];
        const lastDate = userDocument?.lastEntryDate;

        const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0];

        let newStreak = 1;

        if (lastDate === today) {
            newStreak = userDocument.currentStreak;
        } else if (lastDate === yesterday) {
            newStreak = userDocument.currentStreak + 1;
        }

        userDocument.currentStreak = newStreak;

        userDocument.lastEntryDate = today;
        await userDocument?.save();

        return NextResponse.json({entry: savedEntry}, {status: 201});
    } catch (error) {
        console.error("Error creating journal entry:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}