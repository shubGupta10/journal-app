'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BookText,
  Calendar,
  Lock,
  Search,
  Sparkles,
  Timer,
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

const features: Feature[] = [
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
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section id="features" ref={ref} className="py-32">
      {/* width aligned with navbar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Everything you need
          </h2>
          <p className="mt-4 text-muted-foreground">
            Intentionally simple features that help you write consistently
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 32 }
                }
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                  delay: index * 0.08,
                }}
                className="flex gap-6 md:block"
              >
                {/* Icon */}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted md:size-12">
                  <Icon className="size-5 text-foreground" />
                </span>

                {/* Content */}
                <div>
                  <h3 className="font-medium text-foreground md:mb-2 md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
