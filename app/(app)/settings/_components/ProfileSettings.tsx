"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileSettings() {
  const { data: session } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: session.user.username || "",
      });
    }
  }, [session]);

  const initials = useMemo(
    () => getInitials(session?.user?.name),
    [session?.user?.name]
  );

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await authClient.updateUser(
        {
          name: formData.name,
          username: formData.username,
        },
        {
          onSuccess: () => {
            toast.success("Profile updated", {
              description: "Your personal details have been saved.",
            });
            setIsUpdating(false);
          },
          onError: (ctx) => {
            toast.error("Update failed", {
              description: ctx.error.message,
            });
            setIsUpdating(false);
          },
        }
      );
    } catch (error) {
      setIsUpdating(false);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 px-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-background">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">
              {session?.user?.name || "Your name"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session?.user?.email || "you@example.com"}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Personal details</h2>
          <p className="text-xs text-muted-foreground">
            Update your personal information and account details.
          </p>
        </div>

        <form className="space-y-5 max-w-xl" onSubmit={handleUpdateProfile}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                autoComplete="username"
                disabled
                className="bg-muted/40 cursor-not-allowed opacity-70"
                title="Username changes are not supported yet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ""}
              readOnly
              className="bg-muted/40 cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed by your account provider and cannot be changed here.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}