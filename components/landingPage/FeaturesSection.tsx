'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  BookText,
  Calendar,
  Lock,
  Search,
  Sparkles,
  Timer,
} from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: Timer,
    title: 'Daily writing streak',
    description: 'Build momentum with a simple daily counter',
  },
  {
    icon: BookText,
    title: 'Clean reading view',
    description: 'Distraction-free interface that lets words breathe',
  },
  {
    icon: Calendar,
    title: 'Timeline of entries',
    description: 'Navigate through your past thoughts easily',
  },
  {
    icon: Search,
    title: 'Search across entries',
    description: 'Find specific moments and ideas instantly',
  },
  {
    icon: Lock,
    title: 'Private by default',
    description: 'Your words stay yours, always',
  },
  {
    icon: Sparkles,
    title: 'No distractions',
    description: 'Just you and the blank page',
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="features"
      ref={ref}
      className="w-full px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Intentionally simple features
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
