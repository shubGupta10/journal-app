"use client";

import { useState, KeyboardEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ChevronDown, Trash2 } from "lucide-react";
import TEMPLATES from "@/styles/templates";

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const presetTags = ["bug", "fix", "feature", "learning", "frontend", "backend", "refactor", "meeting"];

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
        setIsSubmitting(true);

        try {
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
            });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const insertTemplate = (text: string) => {
        setFormData((prev) => ({
            ...prev,
            content: prev.content ? `${prev.content}\n\n${text}` : text,
        }))
    }

    const clearContent = () => {
        setFormData((prev) => ({
            ...prev,
            content: "",
        }))
    }

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
        <div className="max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">New Log</h1>
                    <p className="text-base text-muted-foreground font-medium">
                        Document your progress, fixes, or daily learnings.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="hidden sm:flex font-semibold border-border hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px] font-bold shadow-sm"
                    >
                        {isSubmitting ? "Saving..." : "Save Entry"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="border border-border shadow-sm">
                        <CardHeader className="pb-4 border-b border-border bg-muted/20">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Entry Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6 pt-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Title</Label>
                                <Input
                                    placeholder="e.g. Fixed Auth Component"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-muted/30 border-input font-medium focus-visible:ring-primary focus-visible:border-primary transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Mood</Label>
                                <Input
                                    placeholder="e.g. Productive, Tired..."
                                    value={formData.mood}
                                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                                    className="bg-muted/30 border-input font-medium focus-visible:ring-primary focus-visible:border-primary transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-sm font-semibold text-foreground">Tags</Label>

                                <div className="flex flex-wrap gap-2">
                                    {presetTags.map((tag) => {
                                        const active = formData.tags.includes(tag);
                                        return (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className={`cursor-pointer px-3 py-1.5 text-xs font-semibold transition-all border select-none ${active
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

                                <div className="pt-2">
                                    <Input
                                        placeholder="Add custom tag + Enter"
                                        onKeyDown={handleCustomTag}
                                        className="bg-muted/30 border-input text-sm h-10 focus-visible:ring-primary transition-all"
                                    />
                                </div>

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

                <Card className="lg:col-span-8 border border-border shadow-md flex flex-col min-h-[600px] overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <CardHeader className="pb-0 pt-4 px-6 border-b border-border/40 bg-card">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Content Editor
                            </Label>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearContent}
                                    disabled={!formData.content}
                                    className="text-xs text-muted-foreground hover:text-destructive gap-1.5 disabled:opacity-30"
                                    title="Clear all content"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Clear
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            Insert template
                                            <ChevronDown className="h-3 w-3 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem
                                            onClick={() => insertTemplate(TEMPLATES.daily)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">Daily reflection</span>
                                                <span className="text-xs text-muted-foreground">What you worked on today</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => insertTemplate(TEMPLATES.bug)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">Bug / Issue</span>
                                                <span className="text-xs text-muted-foreground">Document a fix or solution</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => insertTemplate(TEMPLATES.decision)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">Decision / Learning</span>
                                                <span className="text-xs text-muted-foreground">Capture context and reasoning</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col bg-background">
                        <Textarea
                            placeholder="What did you build, learn, or fix today?"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="flex-1 w-full border-0 focus-visible:ring-0 resize-none p-8 text-base leading-7 text-foreground placeholder:text-muted-foreground/50"
                        />
                    </CardContent>

                    <div className="p-4 border-t border-border bg-muted/10 flex sm:hidden gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push('/dashboard')}
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