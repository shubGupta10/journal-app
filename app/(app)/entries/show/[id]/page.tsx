"use client";

import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecentEntryById } from "@/actions/entries/getRecentEntries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteEntryButton from "@/app/(app)/entries/show/deleteEntry";

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

    const [showEntry, setShowEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchEntry = async () => {
            const response = await getRecentEntryById(id as string);
            setShowEntry(response);
            setLoading(false);
        };

        fetchEntry();
    }, [id, user]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto w-full px-4 py-32 flex flex-col items-center justify-center gap-4">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                <p className="text-base text-muted-foreground">Loading entry...</p>
            </div>
        );
    }

    if (!showEntry) {
        return (
            <div className="max-w-5xl mx-auto w-full px-4 py-32 flex flex-col items-center gap-6 border-2 border-dashed border-border rounded-3xl bg-card">
                <div className="space-y-3 text-center">
                    <h2 className="text-3xl font-semibold text-foreground">Entry not found</h2>
                    <p className="text-base text-muted-foreground max-w-md">
                        This entry doesn't exist or you don't have permission to view it.
                    </p>
                </div>
                <Button onClick={() => router.push("/dashboard")} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background">

            {/* TOP NAVIGATION BAR - FIXED */}
            <div className="sticky top-0 z-10 bg-background border-b-2 border-border">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="px-5 py-2 rounded-xl font-medium border-2 hover:bg-muted transition-colors"
                    >
                        ← Back
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/entries/edit/${id}`)}
                            className="px-5 py-2 rounded-xl font-medium border-2 hover:border-primary hover:text-primary transition-colors"
                        >
                            Edit
                        </Button>

                        <DeleteEntryButton id={showEntry._id} />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT SIDEBAR - METADATA */}
                    <aside className="lg:col-span-3 space-y-8">

                        {/* Date Created */}
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Created
                            </p>
                            <p className="text-sm text-foreground font-medium">
                                {formatDate(showEntry.createdAt)}
                            </p>
                        </div>

                        {/* Mood */}
                        {showEntry.mood && (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                    Mood
                                </p>
                                <Badge className="bg-primary text-primary-foreground border-2 border-primary px-4 py-1.5 rounded-full text-sm font-semibold">
                                    {showEntry.mood}
                                </Badge>
                            </div>
                        )}

                        {/* Tags */}
                        {showEntry.tags.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                    Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {showEntry.tags.map((tag, idx) => (
                                        <Badge
                                            key={idx}
                                            className="border-2 border-secondary bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Last Updated */}
                        <div className="space-y-2 pt-6 border-t-2 border-border">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Last Updated
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(showEntry.updatedAt)}
                            </p>
                        </div>
                    </aside>

                    {/* RIGHT MAIN CONTENT */}
                    <article className="lg:col-span-9 space-y-10">

                        {/* Title */}
                        {showEntry.title && (
                            <header className="border-l-4 border-primary pl-8 py-2">
                                <h1 className="text-5xl font-semibold tracking-tight text-foreground leading-tight">
                                    {showEntry.title}
                                </h1>
                            </header>
                        )}

                        {/* Content */}
                        <div className="bg-card border-2 border-border rounded-3xl p-10">
                            <div className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                                {showEntry.content}
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}