'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    quote:
      'Finally, a journaling app that gets out of my way. No feature bloat, just writing.',
    author: 'Sarah Chen',
    role: 'Designer',
  },
  {
    quote:
      "I've tried a dozen apps. This is the first one I've used every single day for months.",
    author: 'Michael Torres',
    role: 'Teacher',
  },
  {
    quote:
      'The simplicity is what makes it work. I open it, write, and move on with my day.',
    author: 'Emma Larsson',
    role: 'Engineer',
  },
  {
    quote:
      'Writing daily finally feels natural. This app removed every excuse.',
    author: 'Daniel Kim',
    role: 'Product Manager',
  },
  {
    quote:
      'It feels calm. No pressure. Just a place to think clearly.',
    author: 'Ava Patel',
    role: 'Writer',
  },
];

const VISIBLE_COUNT = 3;

export function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + VISIBLE_COUNT < testimonials.length;

  const visibleTestimonials = testimonials.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  return (
    <section className="py-32 bg-muted/30" id="testimonials">
      {/* width aligned with navbar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header + Controls */}
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            What people are saying
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => canGoLeft && setStartIndex(startIndex - 1)}
              disabled={!canGoLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full
                  border border-border
                  bg-background/80 backdrop-blur
                  text-foreground
                  shadow-sm
                  hover:shadow-md hover:bg-accent
                  active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => canGoRight && setStartIndex(startIndex + 1)}
              disabled={!canGoRight}
              className="flex h-10 w-10 items-center justify-center rounded-full
                   border border-border
                   bg-background/80 backdrop-blur
                   text-foreground
                   shadow-sm
                   hover:shadow-md hover:bg-accent
                   active:scale-95
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
                delay: index * 0.05,
              }}
              className=" flex h-full flex-col
                    rounded-2xl
                    border border-border
                    bg-card
                    shadow-sm
                    transition-all
                    hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex flex-1 flex-col justify-between p-8">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09L5.245 11.18.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.27 1.123 6.91z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </p>
              </div>

              {/* Bottom: Author */}
              <div className="border-t border-border px-8 py-4">
                <p className="text-sm font-medium text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>

          ))}
        </div>
      </div>
    </section>
  );
}
