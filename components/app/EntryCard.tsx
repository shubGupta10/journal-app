"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type EntryCardProps = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    mood?: string;
    createdAt: string;
};

export function EntryCard({
    id,
    title,
    content,
    tags,
    mood,
    createdAt,
}: EntryCardProps) {
    const date = format(new Date(createdAt), "dd MMM yyyy");
    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };
    const textContent = stripHtml(content);
    const preview =
        textContent.length > 120 ? textContent.slice(0, 120) + "…" : textContent;
    const router = useRouter();

    return (
   <motion.div
     whileHover={{ scale: 1.01 }}
     whileTap={{ scale: 0.99 }}
     transition={{ type: "spring", stiffness: 400, damping: 17 }}
   >
   <Card
  onClick={() => router.push(`/entries/show/${id}`)}
  className="
    group relative flex flex-col justify-between h-full
    bg-card
    border border-border
    rounded-xl
    cursor-pointer

    shadow-[-8px_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[-8px_8px_24px_rgba(0,0,0,0.7)]
    transition-all duration-200 ease-out
    hover:shadow-[-12px_12px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[-12px_12px_32px_rgba(0,0,0,0.9)]
    hover:-translate-y-0.5
  "
>
            <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-muted-foreground tracking-wide">
                        {date}
                    </p>

                    {mood && (
                        <Badge className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                            {mood}
                        </Badge>
                    )}
                </div>

                <CardTitle className="text-base font-semibold text-foreground leading-snug line-clamp-2">
                    {title || "Untitled Entry"}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-0 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {preview}
                </p>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="bg-secondary/20 text-secondary rounded-md px-2 py-0.5 text-xs font-normal"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-center justify-end gap-1 text-primary transition-colors group-hover:text-primary/80">
                    <span className="text-xs font-medium">Read entry</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </CardContent>
        </Card>
   </motion.div>

    );
}
