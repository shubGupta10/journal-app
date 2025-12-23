"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = theme === "dark";

  // Load current notification preference
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/user/notifications-preferences");
        if (res.ok) {
          const data = await res.json();
          setNotificationsEnabled(data.enabled || false);
        }
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      // Request permission first
      if (!("Notification" in window)) {
        toast.error("Notifications are not supported in this browser");
        return;
      }

      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          toast.error("Notification permission denied");
          return;
        }

        // Register service worker and get subscription
        const registration = await navigator.serviceWorker.ready;
        
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          toast.error("Notification system not configured");
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        });

        // Save to backend
        const res = await fetch("/api/user/notifications-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enabled: true,
            subscription: subscription.toJSON(),
          }),
        });

        if (res.ok) {
          setNotificationsEnabled(true);
          toast.success("Daily reminders enabled");
        } else {
          throw new Error("Failed to save preferences");
        }
      } catch (error) {
        console.error("Error enabling notifications:", error);
        toast.error("Failed to enable notifications");
        setNotificationsEnabled(false);
      }
    } else {
      // Disable notifications
      try {
        const res = await fetch("/api/user/notifications-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: false }),
        });

        if (res.ok) {
          setNotificationsEnabled(false);
          toast.success("Daily reminders disabled");
        } else {
          throw new Error("Failed to save preferences");
        }
      } catch (error) {
        console.error("Error disabling notifications:", error);
        toast.error("Failed to disable notifications");
      }
    }
  };

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

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Notifications</h2>
          <p className="text-xs text-muted-foreground">
            Manage gentle reminders to help you maintain your journaling habit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-border bg-muted/40 px-4 py-4">
          <div className="space-y-1 flex-1">
            <Label htmlFor="daily-reminder" className="text-sm font-medium">
              Daily writing reminder
            </Label>
            <p className="text-xs text-muted-foreground">
              Get a gentle reminder to write, once per day. Only if you want.
            </p>
          </div>
          <div className="shrink-0">
            <Switch
              id="daily-reminder"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
}


