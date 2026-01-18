import { NextResponse } from 'next/server';
import { deleteEntriesByUserId } from '@/lib/database'; // Assuming a database utility function exists

export async function DELETE(request: Request) {
    try {
        // Assume user authentication is handled and userId is available
        // const userId = getUserIdFromAuth(request); // Placeholder for auth logic
        const userId = 'current_user_id'; // Replace with actual user ID retrieval

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await deleteEntriesByUserId(userId);

        return NextResponse.json({ message: 'All entries deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting all entries:', error);
        return NextResponse.json({ message: 'Failed to delete all entries' }, { status: 500 });
    }
}