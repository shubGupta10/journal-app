"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchData } from "@/actions/entries/searchData";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/app/EntryCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Filter, X } from "lucide-react";

export default function EntriesClient({ initialEntries }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries] = useState(initialEntries);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [filterMood, setFilterMood] = useState(searchParams.get("mood") || "all");
  const [filterTag, setFilterTag] = useState(searchParams.get("tag") || "all");

  // Extract unique moods and tags from entries
  const availableMoods = useMemo(() => {
    const moods = new Set<string>();
    entries.forEach((entry: any) => {
      if (entry.mood) moods.add(entry.mood);
    });
    return Array.from(moods).sort();
  }, [entries]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach((entry: any) => {
      if (entry.tags) entry.tags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [entries]);

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

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    // Apply mood filter
    if (filterMood !== "all") {
      filtered = filtered.filter((entry: any) => entry.mood === filterMood);
    }
    
    // Apply tag filter
    if (filterTag !== "all") {
      filtered = filtered.filter((entry: any) => 
        entry.tags && entry.tags.includes(filterTag)
      );
    }
    
    return filtered;
  }, [data, filterMood, filterTag]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "updated":
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return sorted;
    }
  }, [filteredData, sortBy]);

  const hasActiveFilters = filterMood !== "all" || filterTag !== "all";

  const clearFilters = () => {
    setFilterMood("all");
    setFilterTag("all");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {query ? "Search Results" : "All Entries"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {query
                ? "Search by title, tag, mood, or content."
                : "A complete history of your thoughts and logs."}
            </p>
          </div>

          {!searchLoading && sortedData.length > 0 && (
            <Badge variant="secondary" className="text-sm px-3 py-1.5">
              {sortedData.length} {sortedData.length === 1 ? "entry" : "entries"}
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search journal entries by title, tag, mood, or content..."
              className="h-11 pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] h-11">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          </div>

          <Select value={filterMood} onValueChange={setFilterMood}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Moods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {availableMoods.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  #{tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}

          {hasActiveFilters && (
            <div className="flex gap-2 ml-auto">
              {filterMood !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Mood: {filterMood}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilterMood("all")}
                  />
                </Badge>
              )}
              {filterTag !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Tag: #{filterTag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilterTag("all")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </header>

      {searchLoading && (
        <div className="py-32 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        </div>
      )}

      {!searchLoading && sortedData.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-base text-muted-foreground">
            {query ? "No matching entries found." : "No entries yet."}
          </p>
        </div>
      )}

      {!searchLoading && sortedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((entry: any) => (
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
