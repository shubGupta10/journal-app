"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteEntryButton from "../deleteEntry";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

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

export default function EntryShowPage({ entry }: { entry: Entry }) {
  const router = useRouter();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-8">
      <nav className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="pl-0 hover:bg-transparent"
        >
          ← Back
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/entries/edit/${entry._id}`)}
          >
            Edit Entry
          </Button>
          <DeleteEntryButton id={entry._id} />
        </div>
      </nav>

      <Card className="border border-border shadow-sm bg-card overflow-hidden">
        <CardHeader className="space-y-4 border-b border-border/40 bg-muted/5 px-8 py-8">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {formatDate(entry.createdAt)}
            </span>

            {entry.mood && (
              <Badge className="uppercase text-xs font-bold">
                {entry.mood}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {entry.title || "Untitled Entry"}
          </h1>
        </CardHeader>

        <CardContent className="px-8 py-10 bg-background">
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-base md:text-lg leading-8"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </CardContent>

        <CardFooter className="border-t border-border/40 bg-muted/10 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2 items-center">
            {entry.tags.length ? (
              entry.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs font-medium"
                >
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="italic">No tags</span>
            )}
          </div>

          <span className="opacity-70">
            Updated{" "}
            {new Date(entry.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
