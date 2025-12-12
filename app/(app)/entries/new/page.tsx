"use client";

import { useState, KeyboardEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {useRouter} from "next/navigation";

export default function AddNewEntry() {
    const router = useRouter();
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        mood: string;
        tags: string[];
    }>({
        title: "",
        content: "",
        mood: "",
        tags: [],
    });

    const presetTags = ["bug", "fix", "feature", "learning", "frontend", "backend"];

    const toggleTag = (tag: string) => {
        setFormData((prev) => {
            const exists = prev.tags.includes(tag);
            return {
                ...prev,
                tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
            };
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/entries/create-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);
        setFormData({
            title: "",
            content: "",
            mood: "",
            tags: [],
        })
        router.push('/dashboard')
    };

    const handleCustomTag = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const input = e.currentTarget;
            const value = input.value.trim();

            if (value && !formData.tags.includes(value)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, value],
                }));
            }

            input.value = "";
        }
    };

    return (
        <div className="max-w-6xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-primary rounded-xl p-6">
                        <h1 className="text-3xl font-semibold text-primary-foreground">Add New Entry</h1>
                        <p className="text-primary-foreground/90 mt-2">
                            Write your thoughts, fixes, or learnings.
                        </p>
                    </div>

                    <div className="border-2 border-border bg-card rounded-xl p-8 space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-foreground font-medium text-base">Title</Label>
                            <Input
                                placeholder="Optional title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-12 text-base bg-muted"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-foreground font-medium text-base">Mood</Label>
                            <Input
                                placeholder="happy, tired, productive..."
                                value={formData.mood}
                                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                className="h-12 text-base bg-muted"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-foreground font-medium text-base">Tags</Label>

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

                            <Input
                                placeholder="Add custom tag (press Enter)…"
                                onKeyDown={handleCustomTag}
                                className="h-12 text-base bg-muted"
                            />
                        </div>
                    </div>

                    {formData.tags.length > 0 && (
                        <div className="bg-accent border-2 border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-3">Selected Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="bg-primary text-primary-foreground"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="border-2 border-border bg-card rounded-xl p-8 flex-1 flex flex-col">
                        <div className="flex flex-col gap-3 flex-1">
                            <Label className="text-foreground font-medium text-base">Content</Label>
                            <Textarea
                                placeholder="What did you build, learn or fix today?"
                                value={formData.content}
                                className="flex-1 min-h-[600px] resize-none text-base bg-muted"
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8"
                        >
                            Save Entry
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push('/dashboard')}
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