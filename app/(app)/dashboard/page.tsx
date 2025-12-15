"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getRecentEntries } from "@/actions/entries/getRecentEntries";
import { EntryCard } from "@/components/app/EntryCard";
import { getUserStreak, getLastEntry } from "@/actions/entries/getTodayOverview";
import {DailyQuote} from "@/components/app/DailyQuote";

export default function Dashboard() {
    const session = authClient.useSession();
    const user = session?.data?.user;
    const router = useRouter();

    const [recentEntries, setRecentEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [streak, setStreak] = useState<number | null>(null);
    const [lastEntry, setLastEntry] = useState<{
        title: string;
        updatedAt: string;
    } | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProgressData = async () => {
            const streakData = await getUserStreak(user.id);
            const lastEntryData = await getLastEntry(user.id);

            setStreak(streakData ? streakData.currentStreak : 0);
            setLastEntry(lastEntryData);
        };

        fetchProgressData();
    }, [user]);

    useEffect(() => {
        const fetchtheRecentEntries = async () => {
            const response = await getRecentEntries();
            setRecentEntries(response || []);
            setLoading(false);
        };

        fetchtheRecentEntries();
    }, [user]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col gap-16">
            <section className="flex flex-col gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                        Hi <span className="text-secondary">{user?.name}</span>
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                        Keep pushing your craft today.
                    </p>
                </div>

                <DailyQuote/>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Streak */}
                <div className="p-7 rounded-2xl border border-secondary/30 bg-secondary/10 space-y-5 hover:shadow-md transition">
                    <p className="text-xs uppercase tracking-wider text-secondary font-semibold">
                        Current streak
                    </p>
                    <div className="space-y-1">
                        <p className="text-5xl font-semibold tracking-tight text-foreground">
                            {streak ?? 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            day{streak === 1 ? "" : "s"} writing
                        </p>
                    </div>
                </div>

                {/* Last Entry */}
                <div className="p-7 rounded-2xl bg-card border border-border space-y-5 hover:shadow-md transition">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        Last entry
                    </p>

                    {lastEntry ? (
                        <div className="space-y-2">
                            <p className="text-lg font-medium leading-snug text-foreground line-clamp-2">
                                {lastEntry.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(lastEntry.updatedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No entries yet
                        </p>
                    )}
                </div>

                {/* Write Today */}
                <div className="p-7 rounded-2xl border border-primary/30 bg-primary/10 flex flex-col justify-between gap-6 hover:shadow-md transition">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                            Today’s log
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Add your thoughts, fixes, learnings or tasks.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/entries/new")}
                        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                        Add entry
                    </button>
                </div>
            </section>

            <section className="flex flex-col gap-8">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                    Recent entries
                </h2>

                {loading && (
                    <div className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            Loading recent entries…
                        </p>
                    </div>
                )}

                {!loading && recentEntries.length === 0 && (
                    <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card">
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            You have no entries yet. Click “Add entry” to create your first log.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentEntries.map((entry, index) => (
                        <EntryCard
                            key={entry.id || index}
                            id={entry._id}
                            title={entry.title}
                            content={entry.content}
                            tags={entry.tags}
                            mood={entry.mood}
                            createdAt={entry.createdAt}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
