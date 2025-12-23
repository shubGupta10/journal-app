import { NextRequest, NextResponse } from "next/server";
import webpush, { PushSubscription } from "web-push";
import redis from "@/lib/redis";
import { sendEmail } from "@/lib/email/sendEmail";
import { User } from "@/lib/models/userModel";
import { dayMarkDailyReminderTemplate } from "@/lib/email/template";
import { getNextRunTimestamp } from "@/lib/notifications/schedule";

type UserPrefs = {
    enabled: boolean;
};

type WebPushSendError = Error & {
    statusCode?: number;
};

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("x-cron-secret");

    if (authHeader !== process.env.CRON_SECRET) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = Date.now();

    const dueUsers = await redis.zrange(
        "scheduled_notifications",
        0,
        now,
        { byScore: true }
    );

    if (dueUsers.length === 0) {
        return NextResponse.json({ message: "No notifications due." });
    }

    for (const userId of dueUsers) {
        if (typeof userId !== "string") continue;

        const subscription = await redis.hget<PushSubscription>(
            "user_subscriptions",
            userId
        );

        const prefsRaw = await redis.hget<string>("user_prefs", userId);
        const prefs: UserPrefs | null = prefsRaw ? JSON.parse(prefsRaw) : null;

        if (!subscription || !prefs?.enabled) {
            await redis.zrem("scheduled_notifications", userId);
            continue;
        }

        try {
            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: "Daily Journal",
                    body: "A quiet moment to write, if you want.",
                    url: "/dashboard",
                })
            );

            
        } catch (err) {
            const error = err as WebPushSendError;

            if (error.statusCode === 404 || error.statusCode === 410) {
                await redis.hdel("user_subscriptions", userId);
                await redis.zrem("scheduled_notifications", userId);
                continue;
            }

            throw error;
        }

        try {
            const fetchUser = await User.findById(userId).select("email name").lean();

            await sendEmail({
                from: `DayMark <${process.env.EMAIL_USER}>`,
                to: fetchUser?.email as string,
                subject: "Your Daily Journal Reminder",
                html: dayMarkDailyReminderTemplate(fetchUser?.name || undefined),
            })
        } catch (error) {
            console.error("Failed to send email reminder to userId:", userId, error);
        }

        const nextRun = getNextRunTimestamp("20:00");
        await redis.zadd("scheduled_notifications", {
            score: nextRun,
            member: userId,
        });
    }

    return NextResponse.json({ processed: dueUsers.length });
}
