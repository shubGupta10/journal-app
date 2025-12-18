import { Star } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
    className?: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
  className?: string;
}

const HeroSection = ({
  heading = "A quiet place to write, reflect deeply, and build clarity over time",
  description = "Build a daily journaling habit without pressure or noise. Capture your thoughts, track your streaks, and reflect on your days with intention. Your writing stays private, focused, and distraction-free. Just you and your thoughts, one day at a time.",
  button = {
    text: "Start journaling",
    url: "/auth/signUp",
  },
  reviews = {
    count: 1000,
    rating: 5.0,
    avatars: [
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp", alt: "User avatar" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp", alt: "User avatar" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp", alt: "User avatar" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp", alt: "User avatar" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp", alt: "User avatar" },
    ],
  },
  className,
}: Hero7Props) => {
  return (
    <section className={cn("relative overflow-hidden min-h-[100svh] flex items-center py-20 md:py-36", className)}>
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, var(--background) 50%, var(--primary) 100%)",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-6xl text-foreground">
            {heading}
          </h1>

          <p className="text-balance text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="mt-10 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a href={button.url}>{button.text}</a>
        </Button>

        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border border-border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>

          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-1 font-semibold text-foreground">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>

            <p className="text-left font-medium text-muted-foreground">
              trusted by {reviews.count}+ writers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;
