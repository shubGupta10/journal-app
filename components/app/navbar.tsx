"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    Menu,
    X,
    Calendar,
    List,
    Activity,
    Search,
    LogOut,
    Settings,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { data: session } = authClient.useSession();
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: Calendar },
        { href: "/entries", label: "Entries", icon: List },
        { href: "/timeline", label: "Timeline", icon: Activity },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
            <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">

            <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-foreground">Journal</span>
                    </Link>
                </div>

                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                                    isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">

                    {session?.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    {getInitials(session.user.name)}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer w-full flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <button
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-b border-border bg-background animate-in slide-in-from-top-1">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                                        isActive ? "text-primary bg-accent/50" : "text-muted-foreground"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}