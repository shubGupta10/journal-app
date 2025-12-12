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
        <div className="space-y-8">

            <h1 className="text-2xl font-bold">All Entries</h1>

            {loading && <p className="text-muted-foreground">Loading entries...</p>}

            {!loading && entries.length === 0 && (
                <p className="text-muted-foreground">No entries found.</p>
            )}

            {!loading && entries.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
