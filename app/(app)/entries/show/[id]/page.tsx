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
            <div className="max-w-3xl mx-auto w-full min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading entry...</p>
            </div>
        );
    }

    if (!showEntry) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Entry not found</h2>
                <p className="text-muted-foreground mb-6">
                    This entry doesn't exist or you don't have permission to view it.
                </p>
                <Button onClick={() => router.push("/dashboard")} className="bg-primary">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full px-4 py-10">

            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-10">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="hover:bg-muted"
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

                    <DeleteEntryButton id={showEntry._id}
                    />
                </div>
            </div>

            {/* TITLE */}
            {showEntry.title && (
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    {showEntry.title}
                </h1>
            )}

            {/* META INFO */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                <span>Created: {formatDate(showEntry.createdAt)}</span>

                {showEntry.mood && (
                    <Badge className="bg-secondary text-secondary-foreground px-3 py-1">
                        Mood: {showEntry.mood}
                    </Badge>
                )}
            </div>

            {/* TAGS */}
            {showEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {showEntry.tags.map((tag, idx) => (
                        <Badge
                            key={idx}
                            className="border border-primary text-primary bg-primary/10 px-3 py-1"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            )}

            {/* CONTENT — READING MODE */}
            <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {showEntry.content}
            </div>

            {/* UPDATED AT */}
            <p className="text-xs text-muted-foreground mt-10">
                Last updated: {formatDate(showEntry.updatedAt)}
            </p>
        </div>
    );
}
