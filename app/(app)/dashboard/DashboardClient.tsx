"use client";

import { useRouter } from "next/navigation";
import { EntryCard } from "@/components/app/EntryCard";
import { DailyQuote } from "@/components/app/DailyQuote";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStreakReflection } from "@/lib/utils/streakReflection";

export default function DashboardClient({ user, data }: any) {
  const router = useRouter();

  const { streak, lastEntry, recentEntries } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{user.name}</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Capture your thoughts, track your progress, and keep pushing forward.
          </p>
        </div>
        <DailyQuote />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col md:flex-row border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex-1 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Current Streak
            </span>
            <div className="mt-2">
              <span className="text-6xl font-extrabold tracking-tighter">
                {streak?.currentStreak ?? 0}
              </span>
              <span className="ml-3 text-lg text-muted-foreground">days</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              {getStreakReflection(streak?.currentStreak ?? 0)}
            </p>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Latest Activity
            </span>

            {lastEntry ? (
              <div className="space-y-3">
                <h3 className="text-xl font-bold leading-tight line-clamp-2">
                  {lastEntry.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(lastEntry.updatedAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No entries yet
              </p>
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-8 border border-border bg-card shadow-sm">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              New Log
            </span>
            <h3 className="text-xl font-bold">Write Today</h3>
            <p className="text-sm text-muted-foreground">
              Don't break the chain. Document your day now.
            </p>
          </div>
          <Button onClick={() => router.push("/entries/new")} className="mt-6">
            Create Entry
          </Button>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold">Recent Entries</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEntries.map((entry: any) => (
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
      </section>
    </div>
  );
}
