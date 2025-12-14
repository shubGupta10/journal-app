"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTimelineEvents } from "@/actions/timeline/timelineEvents";

export default function TimeLine() {
    const [timelines, setTimelines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await getTimelineEvents();
                setTimelines(data);
                console.log("Here is data", data);

            } catch (error) {
                console.error("Error fetching timeline:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [])

    if (loading) {
        return <p className="text-muted-foreground">Loading timeline...</p>;
    }

    if (timelines.length === 0) {
        return (
            <div className="text-muted-foreground">
                No timeline activity yet.
            </div>
        );
    }

    return (
        <div className="space-y-20 pb-12">
            <h1 className="text-3xl font-semibold">Timeline</h1>

            {timelines.map((timeline) => (
                <div key={timeline.date} className="relative">

                    {/* Timeline container */}
                    <div className="relative">

                        {/* Vertical line */}
                        <div className="absolute left-1/2 top-0 h-full w-px bg-border hidden md:block" />

                        <div className="space-y-16">
                            {timeline.events.map((event: any) => {
                                const isLeft = event.position === "left";
                                const eventDate = new Date(event.createdAt);
                                const day = eventDate.getDate();
                                const ordinal = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';

                                return (
                                    <div
                                        key={event.id}
                                        className="relative"
                                    >
                                        {/* Desktop layout */}
                                        <div className="hidden md:flex items-start gap-6">
                                            {isLeft ? (
                                                <>
                                                    {/* Left: Date/Time */}
                                                    <div className="w-[calc(50%-0.75rem)] flex justify-end pr-10">
                                                        <div className="text-right pt-1">
                                                            <p className="text-base font-bold text-foreground">
                                                                {eventDate.toLocaleDateString([], {
                                                                    month: "short",
                                                                    day: "numeric"
                                                                })}
                                                                <sup className="text-xs font-normal">
                                                                    {ordinal}
                                                                </sup>
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {eventDate.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Center: Dot */}
                                                    <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-2 relative z-10" />

                                                    {/* Right: Card */}
                                                    <div className="w-[calc(50%-0.75rem)] pl-10">
                                                        <div 
                                                            onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                            className="bg-primary border-2 border-border rounded-lg p-6 shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                                                        >
                                                            <p className="text-xs uppercase tracking-wide text-primary-foreground font-semibold mb-2">
                                                                {event.type === "created"
                                                                    ? "Entry created"
                                                                    : "Entry updated"}
                                                            </p>
                                                            <h3 className="font-bold text-lg mb-3 text-primary-foreground leading-snug">
                                                                {event.title}
                                                            </h3>
                                                            {event.snapshot && (
                                                                <p className="text-sm text-primary-foreground leading-relaxed line-clamp-4">
                                                                    {event.snapshot}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Left: Card */}
                                                    <div className="w-[calc(50%-0.75rem)] flex justify-end pr-10">
                                                        <div 
                                                            onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                            className="bg-secondary border-2 border-border rounded-lg p-6 shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02] w-full"
                                                        >
                                                            <p className="text-xs uppercase tracking-wide text-secondary-foreground font-semibold mb-2">
                                                                {event.type === "created"
                                                                    ? "Entry created"
                                                                    : "Entry updated"}
                                                            </p>
                                                            <h3 className="font-bold text-lg mb-3 text-secondary-foreground leading-snug">
                                                                {event.title}
                                                            </h3>
                                                            {event.snapshot && (
                                                                <p className="text-sm text-secondary-foreground leading-relaxed line-clamp-4">
                                                                    {event.snapshot}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Center: Dot */}
                                                    <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-2 relative z-10" />

                                                    {/* Right: Date/Time */}
                                                    <div className="w-[calc(50%-0.75rem)] pl-10">
                                                        <div className="text-left pt-1">
                                                            <p className="text-base font-bold text-foreground">
                                                                {eventDate.toLocaleDateString([], {
                                                                    month: "short",
                                                                    day: "numeric"
                                                                })}
                                                                <sup className="text-xs font-normal">
                                                                    {ordinal}
                                                                </sup>
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {eventDate.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Mobile layout */}
                                        <div className="md:hidden">
                                            <div 
                                                onClick={() => router.push(`/entries/show/${event.entryId}`)}
                                                className="bg-primary border-2 border-border rounded-lg p-5 shadow-md hover:shadow-xl transition-all cursor-pointer active:scale-[0.98]"
                                            >
                                                <p className="text-xs uppercase tracking-wide text-primary-foreground font-semibold mb-2">
                                                    {event.type === "created"
                                                        ? "Entry created"
                                                        : "Entry updated"}
                                                </p>
                                                <h3 className="font-bold text-lg mb-3 text-primary-foreground leading-snug">
                                                    {event.title}
                                                </h3>
                                                {event.snapshot && (
                                                    <p className="text-sm text-primary-foreground leading-relaxed line-clamp-4 mb-4">
                                                        {event.snapshot}
                                                    </p>
                                                )}
                                                <p className="text-xs font-semibold text-primary-foreground pt-3 border-t border-primary-foreground">
                                                    {eventDate.toLocaleDateString([], {
                                                        month: "short",
                                                        day: "numeric"
                                                    })} • {eventDate.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}