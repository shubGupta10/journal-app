"use client";

import { useEffect, useState } from "react";

const QUOTES = [
    "Ship something tiny today.",
    "Consistency beats motivation.",
    "Write to think clearly.",
    "Small progress is still progress.",
    "Clarity comes from writing things down.",
    "Done is better than perfect.",
];

export function DailyQuote() {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const today = new Date().toDateString();
        const cached = localStorage.getItem("daily-quote-local");

        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date === today) {
                setQuote(parsed.quote);
                return;
            }
        }

        const nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

        setQuote(nextQuote);
        localStorage.setItem(
            "daily-quote-local",
            JSON.stringify({ quote: nextQuote, date: today })
        );
    }, []);

    return (
        <div className="border-l-2 border-primary pl-5 py-1">
            <p className="text-sm text-foreground italic font-light">
                “{quote}”
            </p>
        </div>
    );
}
