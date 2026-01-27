import { NextRequest, NextResponse } from 'next/server';
import DbConnect from '@/lib/db/DbConnect';
import UserStreakModel from '@/lib/models/userStreakModel';
import { currentUser } from '@/lib/auth/currentUser';
import { IUserStreak } from '@/types'; // Assuming IUserStreak is defined in types.d.ts

export async function GET(req: NextRequest) {
  await DbConnect();

  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's streak data
    const userStreak: IUserStreak | null = await UserStreakModel.findOne({ userId: user.id }).lean();

    if (!userStreak) {
      // If no streak found, return a default/initial streak state
      return NextResponse.json({ streak: { currentStreak: 0, lastEntryDate: null } }, { status: 200 });
    }

    return NextResponse.json({ streak: userStreak }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return NextResponse.json({ message: 'Failed to fetch user streak', error }, { status: 500 });
  }
}