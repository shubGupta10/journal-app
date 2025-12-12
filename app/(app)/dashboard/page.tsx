"use client"

import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";
import {useEffect, useState} from "react";
import {getRecentEntries} from "@/actions/entries/getRecentEntries";
import {EntryCard} from "@/components/app/EntryCard";

export default function Dashboard() {
    const session = authClient.useSession();
    const user = session?.data?.user;
    const router = useRouter();
    const [recentEntries, setRecentEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchtheRecentEntries = async () => {
            const response = await getRecentEntries();
            setRecentEntries(response || []);
            console.log('recent entries:', response);
            setLoading(false);
        }
        fetchtheRecentEntries();
    }, [user])

    return (
        <div className="w-full flex flex-col gap-8">

            {/* 1) HEADER SECTION */}
            <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Hi {user?.name} 👋</h1>
                        <p className="text-muted-foreground">
                            Keep pushing your craft today.
                        </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-gray-300" />
                </div>

                <p className="text-sm text-muted-foreground italic">
                    “Ship something tiny today.”
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border rounded-xl bg-card space-y-3">
                    <h2 className="font-semibold">Your Dev Progress</h2>

                    {/* Streak placeholder */}
                    <div className="h-6 bg-gray-200 rounded w-1/2" />

                    {/* Last Entry placeholder */}
                    <div className="h-6 bg-gray-200 rounded w-3/4" />

                    {/* Divider */}
                    <div className="border-t pt-3" />

                    {/* Quote placeholder */}
                    <div className="h-4 bg-gray-200 rounded w-2/3" />

                    {/* COMMENT: We'll fill this with real data later */}
                </div>

                {/* Right Column — Add Entry */}
                <div className="p-5 border rounded-xl bg-card flex flex-col justify-between">
                    <div>
                        <h2 className="font-semibold mb-2">Write Today’s Log</h2>
                        <p className="text-sm text-muted-foreground">
                            Add your thoughts, fixes, learnings or tasks.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/entries/new')}
                        className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium w-fit"
                    >
                        Add Entry +
                    </button>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="font-semibold text-lg">Recent Entries</h2>

                {loading && (
                    <p className="text-sm text-muted-foreground">Loading recent entries...</p>
                )}

                {!loading && recentEntries.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        You have no entries yet. Click “Add Entry +” to create your first log.
                    </p>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {recentEntries.map((entry, index) => (
                        <EntryCard
                            key={entry.id || index}
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
