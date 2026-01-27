// lib/models/userModel.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import JournalEntry from './journalEntryModel'; // Import JournalEntry model
import UserStreak from './userStreakModel';     // Import UserStreak model

export interface IUser extends Document {
  id: string; // NextAuth uses 'id' for the user ID
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  // Add any other user-specific fields here
}

const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false, // Password might not be required if using OAuth providers
  },
  // Add any other user-specific fields here
}, { timestamps: true });

// Add a pre-remove hook to cascade delete related data
UserSchema.pre('remove', async function(next) {
  const user = this as IUser;
  console.log(`Deleting all journal entries and streaks for user ${user._id}`);
  await JournalEntry.deleteMany({ userId: user._id });
  await UserStreak.deleteMany({ userId: user._id });
  next();
});

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
