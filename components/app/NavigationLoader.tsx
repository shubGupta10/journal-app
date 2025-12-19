"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSkeleton } from "./skeletons/DashboardSkeleton";
import { EntriesSkeleton } from "./skeletons/EntriesSkeleton";
import { TimelineSkeleton } from "./skeletons/TimelineSkeleton";
import { SettingsSkeleton } from "./skeletons/SettingsSkeleton";

export function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const [targetPath, setTargetPath] = useState<string>("");
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
          setTargetPath(url.pathname);
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

  const renderSkeleton = () => {
    if (targetPath.includes("/dashboard")) {
      return <DashboardSkeleton />;
    } else if (targetPath.includes("/entries")) {
      return <EntriesSkeleton />;
    } else if (targetPath.includes("/timeline")) {
      return <TimelineSkeleton />;
    } else if (targetPath.includes("/settings")) {
      return <SettingsSkeleton />;
    }
    return <DashboardSkeleton />;
  };

  return (
    <div className="fixed inset-0 z-40 bg-background animate-in fade-in duration-200">
      {renderSkeleton()}
    </div>
  );
}
