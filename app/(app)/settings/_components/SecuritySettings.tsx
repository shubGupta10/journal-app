"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function SecuritySettings() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match", {
        description: "Please ensure both new password fields are identical.",
      });
      return;
    }

    setIsChangingPassword(true);

    await authClient.changePassword(
      {
        newPassword: passwords.new,
        currentPassword: passwords.current,
        revokeOtherSessions: true,
      },
      {
        onSuccess: () => {
          setIsChangingPassword(false);
          setPasswords({ current: "", new: "", confirm: "" });
          toast.success("Password updated", {
            description: `Changed on ${new Date().toLocaleString()}`,
          });
        },
        onError: (ctx) => {
          setIsChangingPassword(false);
          toast.error("Update failed", {
            description: ctx.error.message,
            action: {
              label: "Retry",
              onClick: () => setIsChangingPassword(false),
            },
          });
        },
      }
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    await authClient.deleteUser(
      {
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
          toast.success("Account deleted", {
            description: "We're sorry to see you go.",
          });
        },
        onError: (ctx) => {
          setIsDeleting(false);
          toast.error("Deletion failed", {
            description: ctx.error.message,
          });
        },
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Change password</h2>
          <p className="text-xs text-muted-foreground">
            Update your password regularly to keep your journal secure.
          </p>
        </div>

        <form className="space-y-5 max-w-xl" onSubmit={handlePasswordChange}>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save password
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
          <p className="text-xs text-muted-foreground">
            Permanently delete your account and all of your journal entries. This
            action cannot be undone.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 flex-1">
              <Label className="text-sm font-medium text-foreground">
                Delete account
              </Label>
              <p className="text-xs text-muted-foreground">
                Once deleted, all your data will be permanently removed from our
                servers.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="shrink-0"
                >
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and remove all of
                    your journal entries.{" "}
                    <span className="font-bold text-destructive">
                      This action cannot be undone.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>
    </div>
  );
}