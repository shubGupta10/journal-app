"use client";

import { useEffect, useState } from "react";
import { getALLEntries } from "@/actions/entries/getRecentEntries";
import { searchData } from "@/actions/entries/searchData";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/app/EntryCard";
import { Badge } from "@/components/ui/badge"; 

export default function DisplayAllEntries() {
    const session = authClient.useSession();
    const user = session?.data?.user;

    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

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

    // Handle search
    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);

        const timeout = setTimeout(async () => {
            const res = await searchData(query);
            setSearchResults(res || []);
            setSearchLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="w-full max-w-7xl mx-auto px-6  flex flex-col gap-10">
            
            {/* HEADER SECTION - Aligned with Dashboard style */}
            <header className="flex flex-col gap-4 border-b border-border/40 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {query ? "Search Results" : "All Entries"}
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {query ? "Search by title, tag, mood, or content." : "A complete history of your thoughts and logs."}
                        </p>
                    </div>
                    
                    {/* Count Badge */}
                    {!loading && !searchLoading && (query ? searchResults.length : entries.length) > 0 && (
                        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/50 text-secondary-foreground">
                            {query ? searchResults.length : entries.length} {(query ? searchResults.length : entries.length) === 1 ? 'entry' : 'entries'}
                        </Badge>
                    )}
                </div>
            </header>

            {/* SEARCH BAR */}
            <div className="w-full">
                <Input
                    type="text"
                    placeholder="Search journal entries by title, tag, mood, or content..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-12 text-base border-2 border-border bg-background
                           focus-visible:ring-2 focus-visible:ring-primary
                           focus-visible:border-primary rounded-lg"
                />
            </div>

            {/* LOADING STATE */}
            {(loading || searchLoading) && (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce" />
                        <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce [animation-delay:-.3s]" />
                        <div className="h-4 w-4 rounded-full bg-primary/50 animate-bounce [animation-delay:-.5s]" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
                        {query ? "Searching..." : "Retrieving your history..."}
                    </p>
                </div>
            )}

            {/* NO RESULTS FOR SEARCH */}
            {!searchLoading && query.length > 0 && searchResults.length === 0 && (
                <p className="text-muted-foreground bg-muted/30 border border-border rounded-lg p-6">
                    No matching entries found.
                </p>
            )}

            {/* EMPTY STATE FOR ALL ENTRIES */}
            {!loading && !query && entries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-border bg-muted/5 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No entries found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        You haven't created any logs yet. Your entire history will appear here once you start writing.
                    </p>
                </div>
            )}

            {/* ENTRIES GRID - Show search results or all entries */}
            {!loading && !searchLoading && ((query && searchResults.length > 0) || (!query && entries.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(query ? searchResults : entries).map((entry) => (
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