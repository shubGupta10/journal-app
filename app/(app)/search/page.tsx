"use client";

import { Input } from "@/components/ui/input";
import {searchData} from "@/actions/entries/searchData";
import { useEffect, useState } from "react";
import { EntryCard } from "@/components/app/EntryCard";

export default function SearchPage() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);

        const timeout = setTimeout(async () => {
            const res = await searchData(query);
            setResults(res || []);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="max-w-6xl mx-auto w-full px-4 py-10 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
                <p className="text-muted-foreground">
                    Search by title, tag, mood, or content.
                </p>
            </div>

            {/* SEARCH BAR */}
            <div className="w-full">
                <Input
                    type="text"
                    placeholder="Search journal entries..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-12 text-base border-2 border-border bg-background
                           focus-visible:ring-2 focus-visible:ring-primary
                           focus-visible:border-primary rounded-lg"
                />
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-muted-foreground text-sm">Searching…</p>
            )}

            {/* NO RESULTS */}
            {!loading && query.length > 0 && results.length === 0 && (
                <p className="text-muted-foreground bg-muted/30 border border-border rounded-lg p-6">
                    No matching entries found.
                </p>
            )}

            {/* RESULTS */}
            {!loading && results.length > 0 && (
                <div className="space-y-3">
                    <h2 className="font-medium text-lg">Results</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((entry) => (
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
                </div>
            )}
        </div>
    );
}
