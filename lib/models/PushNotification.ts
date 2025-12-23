import { Schema, model, models, Document } from "mongoose";

export interface IPushSubscription extends Document {
    userId: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        endpoint: {
            type: String,
            required: true,
        },
        keys: {
            p256dh: {
                type: String,
                required: true,
            },
            auth: {
                type: String,
                required: true,
            },
        },
        enabled: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const PushSubscription =
    models.PushSubscription ||
    model<IPushSubscription>("PushSubscription", PushSubscriptionSchema);
