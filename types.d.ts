import { Document } from 'mongoose';

// Existing types might be here...

// Define the interface for a Journal Entry, matching lib/models/journalEntryModel.ts
export interface IJournalEntry extends Document {
  userId: string;
  content: string;
  mood: string; // Example field, adjust based on actual model
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for User Streak, matching lib/models/userStreakModel.ts
export interface IUserStreak extends Document {
  userId: string;
  currentStreak: number;
  lastEntryDate: Date | null;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add other global types as needed
