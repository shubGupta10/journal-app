 "use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

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

  const initials = useMemo(
    () => getInitials(session?.user?.name ?? undefined),
    [session?.user?.name]
  );

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const username = session?.user?.username ?? "";

  return (
    <div className="space-y-8">
      <section className="space-y-4">

        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 px-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-background">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">
              {name || "Your name"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {email || "you@example.com"}
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

        <form
          className="space-y-5 max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                defaultValue={name}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your-username"
                defaultValue={username}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="bg-muted/40 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed by your account provider and cannot be changed here.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </section>
    </div>
  );
}


