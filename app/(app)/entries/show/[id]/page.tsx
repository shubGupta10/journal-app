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
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-24 text-center">
                <p className="text-sm text-muted-foreground">Loading entry…</p>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="max-w-6xl mx-auto py-24 text-center">
                <h2 className="text-2xl font-semibold mb-2">Entry not found</h2>
                <p className="text-muted-foreground mb-6">
                    This entry doesn’t exist or you don’t have access.
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                    Back to dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-10">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-muted-foreground hover:text-foreground"
                >
                    ← Back
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/entries/edit/${id}`)}
                    >
                        Edit
                    </Button>
                    <DeleteEntryButton id={entry._id} />
                </div>
            </div>

            {/* Entry canvas */}
            <section className="bg-card border border-border rounded-2xl px-8 py-10 md:px-12 md:py-12 space-y-10">
                {/* Header */}
                <header className="space-y-4">
                    {entry.title && (
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                            {entry.title}
                        </h1>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(entry.createdAt)}</span>

                        {entry.mood && (
                            <Badge className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 text-xs font-medium">
                                {entry.mood}
                            </Badge>
                        )}
                    </div>
                </header>

                {/* Content */}
                <article className="max-w-3xl text-foreground leading-relaxed whitespace-pre-wrap text-base">
                    {entry.content}
                </article>

                {/* Tags */}
                {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                        {entry.tags.map((tag, idx) => (
                            <Badge
                                key={idx}
                                className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-xs font-medium"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <p className="text-xs text-muted-foreground pt-6 border-t border-border">
                    Last updated · {formatDate(entry.updatedAt)}
                </p>
            </section>
        </div>
    );
}
