"use client";

import { useState, useEffect } from "react";
import { searchData } from "@/actions/entries/searchData";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/app/EntryCard";
import { Badge } from "@/components/ui/badge";

export default function EntriesClient({ initialEntries }: any) {
  const [entries] = useState(initialEntries);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    const timeout = setTimeout(async () => {
      const res = await searchData(query);
      setSearchResults(res || []);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const data = query ? searchResults : entries;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {query ? "Search Results" : "All Entries"}
          </h1>
          <p className="text-muted-foreground">
            {query
              ? "Search by title, tag, mood, or content."
              : "A complete history of your thoughts and logs."}
          </p>
        </div>

        {!searchLoading && data.length > 0 && (
          <Badge variant="secondary">
            {data.length} {data.length === 1 ? "entry" : "entries"}
          </Badge>
        )}
      </header>

      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search journal entries by title, tag, mood, or content..."
        className="h-12"
      />

      {searchLoading && (
        <div className="py-24 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}

      {!searchLoading && data.length === 0 && (
        <div className="py-24 text-center text-sm text-muted-foreground">
          {query ? "No matching entries found." : "No entries yet."}
        </div>
      )}

      {!searchLoading && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((entry: any) => (
            <EntryCard
              key={entry._id}
              id={entry._id}
              title={entry.title}
              content={entry.content}
              tags={entry.tags}
              mood={entry.mood}
              createdAt={entry.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
