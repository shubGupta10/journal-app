"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTimelineEvents } from "@/actions/timeline/timelineEvents";
import { Badge } from "@/components/ui/badge";

export default function TimeLine() {
    const [timelines, setTimelines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await getTimelineEvents();
                setTimelines(data);
            } catch (error) {
                console.error("Error fetching timeline:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Loading timeline...</p>
            </div>
        );
    }

    if (timelines.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center border-2 border-dashed border-border rounded-xl bg-muted/5">
                <p className="text-muted-foreground font-medium">No timeline activity found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6">

            <div className="text-start space-y-2 mb-16">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Timeline</h1>
                <p className="text-base text-muted-foreground">Your journey, documented step by step.</p>
            </div>

            <div className="flex flex-col">
                {timelines.map((group, groupIdx) => {
                    const groupDate = new Date(group.date);
                    const groupMonthYear = groupDate.toLocaleString("en-US", { month: 'long', year: 'numeric' });

                    const prevGroup = timelines[groupIdx - 1];
                    const prevMonthYear = prevGroup
                        ? new Date(prevGroup.date).toLocaleString("en-US", { month: 'long', year: 'numeric' })
                        : null;

                    const isNewMonth = groupMonthYear !== prevMonthYear;

                    return (
                        <div key={group.date || groupIdx} className={`relative ${isNewMonth ? 'mt-12' : 'mt-6'}`}>

                            {isNewMonth && (
                                <div className="sticky top-6 z-30 flex justify-center mb-10">
                                    <span className="bg-background border border-border px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm ring-4 ring-background">
                                        {groupMonthYear}
                                    </span>
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block -translate-x-1/2" />

                                <div className="absolute left-5 top-0 bottom-0 w-px bg-border md:hidden" />

                                <div className="space-y-12">
                                    {group.events.map((event: any) => {
                                        const isLeft = event.position === "left";
                                        const eventDate = new Date(event.createdAt);

                                        return (
                                            <div key={event.id} className="relative group">

                                                <div className="hidden md:flex items-center justify-between w-full">

                                                    <div className={`w-[calc(50%-2.5rem)] flex ${isLeft ? 'justify-end' : 'justify-start'}`}>
                                                        {!isLeft ? (
                                                            <div
                                                                onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                                className="w-full bg-secondary text-secondary-foreground border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                                                            >
                                                                <div className="absolute top-1/2 -right-3 w-4 h-4 bg-secondary transform -translate-y-1/2 rotate-45 border-r border-t border-border/50" />

                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                                                                        {event.type === "created" ? "New Entry" : "Update"}
                                                                    </span>
                                                                    <span className="text-xs font-semibold opacity-70">
                                                                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg font-bold leading-tight mb-2">{event.title}</h3>
                                                                {event.snapshot && (
                                                                    <p className="text-sm opacity-90 line-clamp-3 leading-relaxed">
                                                                        {event.snapshot}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-right pr-6 py-4">
                                                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                                                    {eventDate.getDate()}
                                                                </div>
                                                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                                                                    {eventDate.toLocaleDateString([], { weekday: 'long' })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0">
                                                        <div className={`w-4 h-4 rounded-full border-[3px] bg-background ${isLeft ? 'border-primary' : 'border-secondary'} group-hover:scale-125 transition-transform duration-300 shadow-sm`} />
                                                    </div>

                                                    <div className={`w-[calc(50%-2.5rem)] flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                                                        {isLeft ? (
                                                            <div
                                                                onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                                className="w-full bg-primary text-primary-foreground border border-primary/20 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                                                            >
                                                                <div className="absolute top-1/2 -left-3 w-4 h-4 bg-primary transform -translate-y-1/2 -rotate-45 border-l border-t border-primary/20" />

                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">
                                                                        {event.type === "created" ? "New Entry" : "Update"}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-primary-foreground/70">
                                                                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg font-bold leading-tight mb-2 text-primary-foreground">
                                                                    {event.title}
                                                                </h3>
                                                                {event.snapshot && (
                                                                    <p className="text-sm text-primary-foreground/90 line-clamp-3 leading-relaxed">
                                                                        {event.snapshot}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-left pl-6 py-4">
                                                                <div className="text-3xl font-bold tracking-tight text-foreground">
                                                                    {eventDate.getDate()}
                                                                </div>
                                                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                                                                    {eventDate.toLocaleDateString([], { weekday: 'long' })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="md:hidden flex gap-6 pl-5 relative">
                                                    <div className="absolute left-0 top-6 w-px h-full flex justify-center">
                                                        <div className="w-3 h-3 rounded-full bg-background border-[3px] border-primary z-10 -translate-x-[5px]" />
                                                    </div>

                                                    <div
                                                        onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                        className={`flex-1 p-5 rounded-xl border shadow-sm active:scale-[0.98] transition-transform cursor-pointer ${event.type === 'created'
                                                                ? 'bg-primary text-primary-foreground border-primary/20'
                                                                : 'bg-secondary text-secondary-foreground border-border'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold opacity-90">
                                                                    {eventDate.getDate()} {eventDate.toLocaleDateString([], { month: 'short' })}
                                                                </span>
                                                                <span className="text-[10px] font-medium opacity-60 uppercase">
                                                                    {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <Badge variant="outline" className={`text-[10px] border-white/20 ${event.type === 'created' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                                                                {event.type === "created" ? "New" : "Edit"}
                                                            </Badge>
                                                        </div>

                                                        <h3 className="font-bold text-lg mb-1 leading-tight">
                                                            {event.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}