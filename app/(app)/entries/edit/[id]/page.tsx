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

    const presetTags = ["bug", "fix", "feature", "learning", "frontend", "backend"];

    // Load entry data
    useEffect(() => {
        if (!user) return;

        const fetchEntry = async () => {
            const response = await getRecentEntryById(id as string);
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

        const response = await fetch("/api/entries/update-entry", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        router.push(`/entries/show/${formData._id}`);
    };

    if (loading || !formData) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <p className="text-muted-foreground">Loading entry…</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT SECTION */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* HEADER BANNER */}
                    <div className="bg-primary rounded-xl p-6">
                        <h1 className="text-3xl font-semibold text-primary-foreground">Edit Entry</h1>
                        <p className="text-primary-foreground/90 mt-2">
                            Update your thoughts, fixes, or learnings.
                        </p>
                    </div>

                    {/* TITLE, MOOD, TAGS */}
                    <div className="border-2 border-border bg-card rounded-xl p-8 space-y-6">

                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-foreground font-medium text-base">Title</Label>
                            <Input
                                value={formData.title}
                                placeholder="Optional title..."
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-12 text-base bg-muted"
                            />
                        </div>

                        {/* Mood */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-foreground font-medium text-base">Mood</Label>
                            <Input
                                value={formData.mood}
                                placeholder="happy, tired, productive..."
                                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                className="h-12 text-base bg-muted"
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-3">
                            <Label className="text-foreground font-medium text-base">Tags</Label>

                            {/* Preset tags */}
                            <div className="flex gap-2 flex-wrap">
                                {presetTags.map((tag) => {
                                    const active = formData.tags.includes(tag);
                                    return (
                                        <Badge
                                            key={tag}
                                            variant={active ? "default" : "outline"}
                                            className={`cursor-pointer px-4 py-2 ${
                                                active
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            }`}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    );
                                })}
                            </div>

                            {/* Custom tag input */}
                            <Input
                                placeholder="Add custom tag (press Enter)…"
                                onKeyDown={handleCustomTag}
                                className="h-12 text-base bg-muted"
                            />
                        </div>
                    </div>

                    {/* Selected Tags */}
                    {formData.tags.length > 0 && (
                        <div className="bg-accent border-2 border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-3">Selected Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <Badge key={tag} className="bg-primary text-primary-foreground">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* Content box */}
                    <div className="border-2 border-border bg-card rounded-xl p-8 flex-1 flex flex-col">
                        <div className="flex flex-col gap-3 flex-1">
                            <Label className="text-foreground font-medium text-base">Content</Label>

                            <Textarea
                                value={formData.content}
                                placeholder="What did you build, learn or fix today?"
                                className="flex-1 min-h-[600px] resize-none text-base bg-muted"
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8"
                        >
                            Save Changes
                        </Button>

                        <Button
                            type="button"
                            onClick={() => router.push(`/entries/show/${id}`)}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium px-6"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}
