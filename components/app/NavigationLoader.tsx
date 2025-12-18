"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href && !anchor.target) {
        const url = new URL(anchor.href);
        // Only show loader for internal navigation
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setLoading(true);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4 bg-background/95 p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <Spinner size="lg" className="text-primary" />
        <p className="text-sm font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
}
