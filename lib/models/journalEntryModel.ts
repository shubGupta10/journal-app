import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJournalEntry extends Document {
    userId: mongoose.Types.ObjectId;
    title?: string;
    content: string;
    tags: string[];
    mood?: string;
    createdAt: Date;
    updatedAt: Date;
}

const JournalEntrySchema: Schema<IJournalEntry> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 150,
        },

        content: {
            type: String,
            required: true,
            minlength: 5,
        },

        tags: {
            type: [String],
            default: [],
        },

        mood: {
            type: String,
            trim: true,
            default: "neutral",
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for fetching user entries sorted by date
JournalEntrySchema.index({ userId: 1, createdAt: -1 });
JournalEntrySchema.index({ userId: 1, updatedAt: -1 });

export const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);
