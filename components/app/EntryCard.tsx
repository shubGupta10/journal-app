import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

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
    const preview =
        content.length > 120 ? content.slice(0, 120) + "…" : content;
    const router = useRouter();

    return (
        <Card
            onClick={() => router.push(`/entries/show/${id}`)}
            className="border-2 border-border bg-card rounded-2xl hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
        >
            <CardHeader className="space-y-3 pb-4">
                {/* DATE */}
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {date}
                </p>

                {/* TITLE */}
                <CardTitle className="text-xl font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {title || "Untitled Entry"}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">

                {/* PREVIEW */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {preview}
                </p>

                {/* TAGS & MOOD */}
                {(tags.length > 0 || mood) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-border">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="bg-secondary text-secondary-foreground border-2 border-secondary px-3 py-1 rounded-full text-xs font-semibold"
                            >
                                #{tag}
                            </Badge>
                        ))}

                        {/* MOOD */}
                        {mood && (
                            <Badge className="bg-primary text-primary-foreground border-2 border-primary px-3 py-1 rounded-full text-xs font-semibold">
                                {mood}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}