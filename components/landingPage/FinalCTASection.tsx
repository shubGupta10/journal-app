'use client';

import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  return (
    <section ref={ref} className="py-32">
      {/* navbar-aligned width */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="
            flex w-full flex-col gap-12
            rounded-2xl
            bg-muted/40
            p-8
            md:p-12
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          {/* Text */}
          <div className="max-w-xl">
            <h3 className="mb-4 text-2xl font-medium tracking-tight text-foreground md:text-4xl">
              Start writing today
            </h3>
            <p className="text-muted-foreground md:text-lg">
              No pressure. No audience. Just a quiet place to think and write
              honestly, one day at a time.
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <motion.button
              onClick={() => {
                setIsNavigating(true);
                router.push("/auth/signup");
              }}
              disabled={isNavigating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="min-w-[180px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Start your first entry"
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
