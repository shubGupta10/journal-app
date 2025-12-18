import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("py-24 border-t border-border", className)}>
      {/* width aligned with navbar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold text-foreground"
            >
              DayMark
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A quiet place to write, reflect, and keep track of your days.
              Private by default.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-foreground">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DayMark. All rights reserved.</p>

          <p className="text-xs">
            Built for focus, not attention.
          </p>
        </div>
      </div>
    </footer>
  );
}
