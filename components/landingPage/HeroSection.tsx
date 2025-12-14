'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Search } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative w-full px-6 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            A quiet place to write and reflect
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Build a daily writing habit without distractions
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[140px]">
              <Link href="/signup">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[140px]">
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Today, March 15
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Started the morning with coffee and clarity. Reflected on what
              matters most.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Yesterday, March 14
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Grateful for small moments. A reminder to slow down and be
              present.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Search className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              March 10
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Thoughts on growth and change. Revisiting old ideas with fresh
              perspective.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
