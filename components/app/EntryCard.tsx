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
            className="group flex flex-col justify-between h-full bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer"
        >
            <CardHeader className="space-y-4 pb-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {date}
                    </p>
                    {mood && (
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary border-0 rounded-md px-2.5 py-0.5 text-xs font-medium shadow-sm">
                            {mood}
                        </Badge>
                    )}
                </div>

                <CardTitle className="text-lg font-bold text-foreground leading-tight tracking-tight">
                    {title || "Untitled Entry"}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {preview}
                </p>

                {/* Tags Section */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0 rounded-md px-2 py-1 text-xs font-medium"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Visual Button - Rendered as a div to prevent logical conflict with Card onClick */}
                <div className="mt-2 w-full rounded-md bg-primary py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm group-hover:bg-primary/90 transition-colors">
                    Open Entry
                </div>
            </CardContent>
        </Card>
    );
}