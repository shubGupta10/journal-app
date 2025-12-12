import { ReactNode } from "react";
import AppNavbar from "@/components/app/navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-6xl mx-auto w-full px-4 py-10 space-y-10">
                {children}
            </main>
        </div>
    );
}