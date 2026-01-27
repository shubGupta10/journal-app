import { NextRequest, NextResponse } from 'next/server';
import DbConnect from '@/lib/db/DbConnect';
import JournalEntryModel from '@/lib/models/journalEntryModel';
import { currentUser } from '@/lib/auth/currentUser';
import { IJournalEntry } from '@/types'; // Assuming IJournalEntry is defined in types.d.ts

export async function GET(req: NextRequest) {
  await DbConnect();

  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent entries for the current user, limit to 5 for the dashboard
    const entries: IJournalEntry[] = await JournalEntryModel.find({ userId: user.id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .limit(5)
      .lean(); // Use .lean() for faster query execution if not modifying documents

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ message: 'Failed to fetch journal entries', error }, { status: 500 });
  }
}