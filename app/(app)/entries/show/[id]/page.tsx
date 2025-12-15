"use client";

import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecentEntryById } from "@/actions/entries/getRecentEntries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteEntryButton from "@/app/(app)/entries/show/deleteEntry";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"; 

interface Entry {
    _id: string;
    userId: string;
    title?: string;
    content: string;
    tags: string[];
    mood?: string;
    createdAt: string;
    updatedAt: string;
}

export default function EntryShowPage() {
    const { id } = useParams();
    const router = useRouter();

    const session = authClient.useSession();
    const user = session?.data?.user;

    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchEntry = async () => {
            const response = await getRecentEntryById(id as string);
            setEntry(response);
            setLoading(false);
        };

        fetchEntry();
    }, [id, user]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-32 flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Retrieving entry...</p>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="max-w-4xl mx-auto py-32 flex flex-col items-center justify-center text-center space-y-6">
                <div className="bg-muted rounded-full p-4">
                    <span className="text-2xl">?</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Entry not found</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        This entry might have been deleted or you don't have permission to view it.
                    </p>
                </div>
                <Button onClick={() => router.push("/dashboard")} variant="default">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 space-y-8">
            {/* NAVIGATION BAR */}
            <nav className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent transition-colors group"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to List
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/entries/edit/${id}`)}
                        className="h-9 text-sm font-medium"
                    >
                        Edit Entry
                    </Button>
                    {/* Delete Button Wrapper */}
                    <DeleteEntryButton id={entry._id} />
                </div>
            </nav>

            {/* MAIN ENTRY CARD */}
            <Card className="border border-border shadow-sm overflow-hidden bg-card">
                
                {/* HEADER: CONTEXT & METADATA */}
                <CardHeader className="space-y-6 border-b border-border/40 bg-muted/5 px-8 py-8 md:px-12">
                    
                    {/* Top Row: Date & Mood */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            {/* Calendar Icon SVG */}
                            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="uppercase tracking-wider text-xs font-semibold">
                                {formatDate(entry.createdAt)}
                            </span>
                        </div>

                        {entry.mood && (
                            <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary border-0 px-3 py-1 text-xs font-bold shadow-sm rounded-md uppercase tracking-wide">
                                {entry.mood}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                        {entry.title || "Untitled Entry"}
                    </h1>
                </CardHeader>

                {/* BODY: CONTENT */}
                <CardContent className="px-8 py-10 md:px-12 md:py-12 bg-background min-h-[300px]">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-base md:text-lg leading-8 text-foreground/90 font-normal">
                            {entry.content}
                        </p>
                    </div>
                </CardContent>

                {/* FOOTER: TAGS & META */}
                <CardFooter className="bg-muted/10 border-t border-border/40 px-8 py-6 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
                            Tags:
                        </span>
                        {entry.tags.length > 0 ? (
                            entry.tags.map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground px-2.5 py-1 text-xs font-medium rounded-md transition-all"
                                >
                                    #{tag}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground italic">No tags</span>
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground opacity-70">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last updated {new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}