'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

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
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="w-full bg-muted/30 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            What people are saying
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-8 shadow-sm"
            >
              <p className="mb-6 text-base leading-relaxed text-foreground">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-border pt-6">
                <p className="font-medium text-foreground">
                  {testimonial.author}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
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
