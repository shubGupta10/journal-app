"use client";

import { useEffect, useState } from "react";
import { getALLEntries } from "@/actions/entries/getRecentEntries";
import { authClient } from "@/lib/auth-client";
import { EntryCard } from "@/components/app/EntryCard";

export default function DisplayAllEntries() {
    const session = authClient.useSession();
    const user = session?.data?.user;

    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const fetchEntries = async () => {
            setLoading(true);
            const response = await getALLEntries();
            setEntries(response || []);
            setLoading(false);
        };

        fetchEntries();
    }, [user]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-12">

            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-foreground"></div>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">All Entries</h1>
                </div>
                <p className="text-base text-muted-foreground pl-6">
                    {!loading && entries.length > 0 && `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} found`}
                </p>
            </header>

            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                    <p className="text-base text-muted-foreground">Loading entries...</p>
                </div>
            )}

            {!loading && entries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 gap-6 border-2 border-dashed border-border rounded-3xl bg-card">
                    <div className="space-y-3 text-center">
                        <p className="text-lg text-muted-foreground font-medium">No entries found</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Start writing to see your entries here
                        </p>
                    </div>
                </div>
            )}

            {!loading && entries.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {entries.map((entry) => (
                        <EntryCard
                            key={entry._id}
                            id={entry._id}
                            title={entry.title}
                            content={entry.content}
                            tags={entry.tags}
                            mood={entry.mood}
                            createdAt={entry.createdAt}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}