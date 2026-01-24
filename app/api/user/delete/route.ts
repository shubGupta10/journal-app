import { NextRequest, NextResponse } from 'next/server';
import DbConnect from '@/lib/db/DbConnect'; // Connects to MongoDB
import User from '@/lib/models/userModel'; // User Mongoose model
import JournalEntry from '@/lib/models/journalEntryModel'; // JournalEntry Mongoose model
import UserStreak from '@/lib/models/userStreakModel'; // UserStreak Mongoose model
import { getCurrentUser } from '@/lib/auth/currentUser'; // Utility to get authenticated user

/**
 * Handles DELETE requests to delete the authenticated user's account and associated data.
 * @param req The NextRequest object.
 * @returns A NextResponse indicating success or failure.
 */
export async function DELETE(req: NextRequest) {
  await DbConnect(); // Establish database connection

  try {
    const currentUser = await getCurrentUser(); // Get the currently authenticated user

    // 1. Authentication Check
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = currentUser._id; // The ID of the user to be deleted

    // 2. Delete Associated Data (Journal Entries and User Streaks)
    // This is crucial for data integrity and privacy (e.g., "right to be forgotten").
    await JournalEntry.deleteMany({ userId: userId });
    console.log(`[DELETE USER] Deleted all journal entries for user: ${userId}`);

    await UserStreak.deleteMany({ userId: userId });
    console.log(`[DELETE USER] Deleted all user streaks for user: ${userId}`);

    // 3. Delete the User Account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // This case should ideally not be reached if currentUser._id is valid,
      // but it's a good safeguard.
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`[DELETE USER] User account deleted successfully: ${userId}`);

    // Note: For NextAuth.js, server-side session invalidation might be complex
    // or not directly supported for a specific user. The client-side signOut
    // will handle clearing the session cookie.

    return NextResponse.json(
      { message: 'User account and all associated data deleted successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[DELETE USER] Error deleting user account:', error);
    return NextResponse.json(
      { message: 'Error deleting user account', error: error.message },
      { status: 500 }
    );
  }
}