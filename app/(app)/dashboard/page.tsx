"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getRecentEntries } from "@/actions/entries/getRecentEntries";
import { EntryCard } from "@/components/app/EntryCard";
import { getUserStreak, getLastEntry } from "@/actions/entries/getTodayOverview";
import { DailyQuote } from "@/components/app/DailyQuote";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Using Card component for consistency

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
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-10">
            {/* HEADER */}
            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        Capture your thoughts, track your progress, and keep pushing forward.
                    </p>
                </div>
                <DailyQuote />
            </section>

            {/* OVERVIEW SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* IMPROVED: STREAK & LAST ENTRY WIDGET */}
                <Card className="lg:col-span-2 flex flex-col md:flex-row border border-border bg-card shadow-sm overflow-hidden">
                    
                    {/* LEFT PANE: STREAK METRIC */}
                    <div className="flex-1 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border hover:bg-muted/5 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Current Streak
                            </span>
                            {/* Optional: Fire icon or visual accent could go here */}
                        </div>
                        <div className="mt-2">
                            <span className="text-6xl font-extrabold tracking-tighter text-foreground">
                                {streak ?? 0}
                            </span>
                            <span className="ml-3 text-lg font-medium text-muted-foreground">
                                days
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground font-medium">
                            {streak && streak > 0 
                                ? "You're building momentum. Keep it up!" 
                                : "Start your streak today by writing an entry."}
                        </p>
                    </div>

                    {/* RIGHT PANE: CONTEXTUAL LAST ENTRY */}
                    <div className="flex-1 p-8 flex flex-col justify-center hover:bg-muted/5 transition-colors relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 md:group-hover:bg-primary/50 transition-colors" />
                        
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            Latest Activity
                        </span>

                        {lastEntry ? (
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold leading-tight text-foreground line-clamp-2">
                                    {lastEntry.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                        {new Date(lastEntry.updatedAt).toLocaleDateString("en-US", { weekday: 'long' })}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {new Date(lastEntry.updatedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center h-full space-y-2">
                                <p className="text-lg font-semibold text-foreground">No entries yet</p>
                                <p className="text-sm text-muted-foreground">Your recent activity will appear here.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* ACTION CARD */}
                <Card className="flex flex-col justify-between p-8 border border-border bg-card shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200">
                    <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">
                            New Log
                        </span>
                        <h3 className="text-xl font-bold text-foreground">Write Today</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Don't break the chain. Document your day now.
                        </p>
                    </div>
                    <div className="pt-6">
                        <Button 
                            onClick={() => router.push("/entries/new")}
                            className="w-full h-11 text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
                        >
                            Create Entry
                        </Button>
                    </div>
                </Card>
            </section>

            {/* RECENT ENTRIES GRID */}
            <section className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Recent Entries
                    </h2>
                </div>

                {loading && (
                    <div className="py-20 text-center">
                        <p className="text-sm text-muted-foreground animate-pulse">Loading entries...</p>
                    </div>
                )}

                {!loading && recentEntries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/5 text-center">
                        <p className="text-base font-medium text-foreground mb-2">It's quiet here</p>
                        <p className="text-sm text-muted-foreground max-w-xs mb-6">
                            Start writing to see your timeline populate.
                        </p>
                        <Button variant="outline" onClick={() => router.push("/entries/new")}>
                            Start Writing
                        </Button>
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