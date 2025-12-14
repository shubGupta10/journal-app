'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Eye, Target, TrendingUp } from 'lucide-react';
import { useRef } from 'react';

const reasons = [
  {
    icon: Eye,
    title: 'Clarity',
    description: 'Writing helps you understand your own thoughts',
  },
  {
    icon: Target,
    title: 'Consistency',
    description: 'A simple ritual that builds over time',
  },
  {
    icon: TrendingUp,
    title: 'Reflection',
    description: "Look back and see how far you've come",
  },
];

export function WhySection() {
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
            Why journal?
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-sm">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-medium text-foreground">
                  {reason.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
