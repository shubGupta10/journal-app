import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserStreak extends Document {
    userId: mongoose.Types.ObjectId;
    currentStreak: number;
    lastEntryDate: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserStreakSchema: Schema<IUserStreak> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        lastEntryDate: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const UserStreak: Model<IUserStreak> = mongoose.models.UserStreak || mongoose.model<IUserStreak>("UserStreak", UserStreakSchema);
