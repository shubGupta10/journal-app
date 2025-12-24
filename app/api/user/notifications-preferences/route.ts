import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import {getNextRunTimestamp} from "@/lib/notifications/schedule";

type PushSubscriptionPayload = {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
};

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { enabled, subscription } = body as {
            enabled: boolean;
            subscription?: PushSubscriptionPayload;
        };

        const userId = session.user.id;

        console.log("Saving notification preference:", { userId, enabled });

        // Save user preference
        await redis.hset("user_prefs", {
            [userId]: JSON.stringify({ enabled }),
        });

        // Save user email and name for notifications
        await redis.hset("user_emails", {
            [userId]: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
            }),
        });

        console.log("Saved to Redis successfully");

        if (enabled && subscription) {
            // Save subscription
            await redis.hset("user_subscriptions", {
                [userId]: JSON.stringify(subscription),
            });

            // Schedule notification for tomorrow at the same time
           const nextRun = getNextRunTimestamp("15:30");
            await redis.zadd("scheduled_notifications", {
                score: nextRun,
                member: userId,
            });
        } else if (!enabled) {
            // Remove from scheduled notifications if disabled
            await redis.zrem("scheduled_notifications", userId);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving notification preferences:", error);
        return NextResponse.json(
            { error: "Failed to save preferences" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        console.log("Fetching preferences for userId:", userId);

        const prefsData = await redis.hget("user_prefs", userId);
        
        console.log("User pref raw data:", prefsData);
        
        let prefs = { enabled: false };
        
        if (prefsData) {
            // Handle both string and object responses from Redis
            if (typeof prefsData === 'string') {
                prefs = JSON.parse(prefsData);
            } else {
                prefs = prefsData as { enabled: boolean };
            }
        }
        
        console.log("Parsed prefs:", prefs);
        

        return NextResponse.json({ enabled: prefs.enabled || false });
    } catch (error) {
        console.error("Error fetching notification preferences:", error);
        return NextResponse.json(
            { error: "Failed to fetch preferences" },
            { status: 500 }
        );
    }
}
