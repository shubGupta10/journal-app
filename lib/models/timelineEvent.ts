import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimelineEvent extends Document {
    userId: mongoose.Types.ObjectId;
    entryId: mongoose.Types.ObjectId;
    title: string;
    type: "created" | "updated";
    snapshot?: string;
    createdAt: Date;
}

const TimelineEventSchema: Schema<ITimelineEvent> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        entryId: {
            type: Schema.Types.ObjectId,
            ref: "JournalEntry",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 100,
        },

        type: {
            type: String,
            enum: ["created", "updated"],
            required: true,
        },

        snapshot: {
            type: String,
            required: false,
            default: "No content available",
            maxlength: 200,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Compound index for optimal sorting of user timeline events
TimelineEventSchema.index({ userId: 1, createdAt: -1 });

export const TimelineEvent: Model<ITimelineEvent> = mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>("TimelineEvent", TimelineEventSchema);
