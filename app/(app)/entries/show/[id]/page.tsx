"use client"

import {authClient} from "@/lib/auth-client";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRecentEntryById} from "@/actions/entries/getRecentEntries";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

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
    const params = useParams();
    const id = params.id as string;

    const session = authClient.useSession();
    const user = session?.data?.user;

    const router = useRouter();
    const [showEntry, setShowEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!user) return;

        const fetchEntry = async () => {
            setLoading(true);
            const response = await getRecentEntryById(id)
            setShowEntry(response);
            setLoading(false);
        }
        fetchEntry();
    }, [id, user])


    if (loading) {
        return (
            <div className="max-w-4xl mx-auto w-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading entry...</p>
                </div>
            </div>
        );
    }

    if (!showEntry) {
        return (
            <div className="max-w-4xl mx-auto w-full">
                <div className="bg-card border-2 border-foreground/20 rounded-xl p-12 text-center">
                    <h2 className="text-2xl font-semibold mb-2">Entry not found</h2>
                    <p className="text-muted-foreground mb-6">
                        This entry doesn't exist or you don't have permission to view it.
                    </p>
                    <Button onClick={() => router.push('/dashboard')} className="bg-primary text-primary-foreground">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                        className="hover:bg-muted"
                    >
                        ← Back
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/entries/${id}/edit`)}
                            className="hover:bg-muted"
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="bg-card border-2 border-foreground/20 rounded-xl p-8 space-y-6">
                    {showEntry.title && (
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">{showEntry.title}</h1>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Created:</span>
                            <span>{formatDate(showEntry.createdAt)}</span>
                        </div>
                        {showEntry.mood && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Mood:</span>
                                <Badge className="bg-secondary text-secondary-foreground">
                                    {showEntry.mood}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {showEntry.tags && showEntry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {showEntry.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    className="bg-primary text-primary-foreground"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-border pt-6">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                {showEntry.content}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                        Last updated: {formatDate(showEntry.updatedAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}