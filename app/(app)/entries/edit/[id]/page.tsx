"use client";

import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState, KeyboardEvent, FormEvent } from "react";
import { getRecentEntryById } from "@/actions/entries/getRecentEntries";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function EditEntryPage() {
    const { id } = useParams();
    const router = useRouter();

    const session = authClient.useSession();
    const user = session?.data?.user;

    const [formData, setFormData] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const presetTags = ["bug", "fix", "feature", "learning", "frontend", "backend", "refactor", "meeting"];

    // Load entry data
    useEffect(() => {
        if (!user) return;

        const fetchEntry = async () => {
            const response = await getRecentEntryById(id as string, user.id);
            setFormData(response);
            setLoading(false);
        };

        fetchEntry();
    }, [id, user]);

    const toggleTag = (tag: string) => {
        if (!formData) return;

        const exists = formData.tags.includes(tag);

        setFormData({
            ...formData,
            tags: exists
                ? formData.tags.filter((t) => t !== tag)
                : [...formData.tags, tag],
        });
    };

    const handleCustomTag = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!formData) return;

            const value = e.currentTarget.value.trim();
            if (!value) return;

            if (!formData.tags.includes(value)) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, value],
                });
            }

            e.currentTarget.value = "";
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/entries/update-entry", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            await response.json();
            router.push(`/entries/show/${formData._id}`);
        } catch (error) {
            console.error("Failed to update entry", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !formData) {
        return (
            <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading entry...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
            
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Entry</h1>
                    <p className="text-base text-muted-foreground font-medium">
                        Refine your thoughts and update your log.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push(`/entries/show/${id}`)}
                        className="hidden sm:flex font-semibold border-border hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px] font-bold shadow-sm"
                    >
                        {isSubmitting ? "Updating..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: METADATA */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="border border-border shadow-sm">
                        <CardHeader className="pb-4 border-b border-border bg-muted/20">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Entry Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6 pt-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Title</Label>
                                <Input
                                    value={formData.title}
                                    placeholder="Optional title..."
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-muted/30 border-input font-medium focus-visible:ring-primary focus-visible:border-primary transition-all"
                                />
                            </div>

                            {/* Mood */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Mood</Label>
                                <Input
                                    value={formData.mood}
                                    placeholder="e.g. Productive, Tired..."
                                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                    className="bg-muted/30 border-input font-medium focus-visible:ring-primary focus-visible:border-primary transition-all"
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-3 pt-2">
                                <Label className="text-sm font-semibold text-foreground">Tags</Label>

                                {/* Presets */}
                                <div className="flex flex-wrap gap-2">
                                    {presetTags.map((tag) => {
                                        const active = formData.tags.includes(tag);
                                        return (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className={`cursor-pointer px-3 py-1.5 text-xs font-semibold transition-all border select-none ${
                                                    active
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90"
                                                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted/50"
                                                }`}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        );
                                    })}
                                </div>

                                {/* Custom Input */}
                                <div className="pt-2">
                                    <Input
                                        placeholder="Add custom tag + Enter"
                                        onKeyDown={handleCustomTag}
                                        className="bg-muted/30 border-input text-sm h-10 focus-visible:ring-primary transition-all"
                                    />
                                </div>

                                {/* Selected Tags Display */}
                                {formData.tags.filter(t => !presetTags.includes(t)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border mt-2">
                                        {formData.tags.filter(t => !presetTags.includes(t)).map(tag => (
                                             <Badge
                                                key={tag}
                                                className="bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors px-3 py-1"
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag} <span className="ml-1.5 opacity-60 text-[10px]">✕</span>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: EDITOR */}
                <Card className="lg:col-span-8 border border-border shadow-md flex flex-col min-h-[600px] overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <CardHeader className="pb-0 pt-4 px-6 border-b border-border/40 bg-card">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Content Editor
                            </Label>
                            <span className="text-[10px] uppercase font-bold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                                Markdown Supported
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col bg-background">
                        <Textarea
                            value={formData.content}
                            placeholder="What did you build, learn or fix today?"
                            className="flex-1 w-full border-0 focus-visible:ring-0 resize-none p-8 text-base leading-7 text-foreground placeholder:text-muted-foreground/50"
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </CardContent>

                    {/* Mobile Only Action Buttons */}
                    <div className="p-4 border-t border-border bg-muted/10 flex sm:hidden gap-3">
                         <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push(`/entries/show/${id}`)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-primary-foreground"
                        >
                            Save
                        </Button>
                    </div>
                </Card>

            </form>
        </div>
    );
}