'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="w-full px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Start writing today
        </h2>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          No commitment required. Just open the page and write.
        </p>

        <div className="mt-10">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
