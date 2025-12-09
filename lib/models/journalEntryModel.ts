import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJournalEntry extends Document {
    userId: mongoose.Types.ObjectId;
    title?: string;
    content: string;
    tags: string[];
    mood?: "neutral" | "productive" | "blocked" | "tired";
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
            enum: ["neutral", "productive", "blocked", "tired"],
            default: "neutral",
        },
    },
    {
        timestamps: true,
    }
);

export const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);
