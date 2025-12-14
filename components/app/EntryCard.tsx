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
        <Card onClick={() => router.push(`/entries/show/${id}`)} className="border bg-card shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardHeader>
                {/* DATE */}
                <p className="text-xs text-muted-foreground">{date}</p>

                {/* TITLE */}
                <CardTitle className="text-lg font-semibold line-clamp-1">
                    {title || "Untitled Entry"}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">

                {/* PREVIEW */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {preview}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full"
                        >
                            #{tag}
                        </Badge>
                    ))}

                    {/* MOOD */}
                    {mood && (
                        <Badge className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                            {mood}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
