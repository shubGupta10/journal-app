// app/api/user/delete-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import DbConnect from '@/lib/db/DbConnect';
import User from '@/lib/models/userModel';
import JournalEntry from '@/lib/models/journalEntryModel'; // Import JournalEntry model
import UserStreak from '@/lib/models/userStreakModel';     // Import UserStreak model
import { currentUser } from '@/lib/auth/currentUser';
import { signOut } from 'next-auth/react'; // Assuming NextAuth for signOut

export async function DELETE(req: NextRequest) {
  await DbConnect();

  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Cascade delete related data (Journal Entries and User Streaks)
    // This is a fallback/explicit deletion. A pre-remove hook on the User model (Step 2)
    // is a more robust way to handle this, but explicit deletion here adds redundancy.
    await JournalEntry.deleteMany({ userId: userId });
    await UserStreak.deleteMany({ userId: userId });

    // Invalidate the user's session on the server side if possible,
    // or rely on client-side signOut after successful deletion.
    // For NextAuth, the client-side signOut is usually sufficient.

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}