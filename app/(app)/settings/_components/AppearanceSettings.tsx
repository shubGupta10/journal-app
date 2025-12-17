"use client";

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Theme preference</h2>
          <p className="text-xs text-muted-foreground">
            Switch between light and dark modes to customize your journal's appearance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-border bg-muted/40 px-4 py-4">
          <div className="space-y-1 flex-1">
            <Label className="text-sm font-medium">
              {isDark ? "Dark mode" : "Light mode"}
            </Label>
            <p className="text-xs text-muted-foreground">
              {isDark
                ? "Comfortable for low-light environments and late-night journaling."
                : "Bright and clear for daytime journaling and focused writing."}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              type="button"
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


