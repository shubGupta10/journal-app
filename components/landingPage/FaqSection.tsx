'use client';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is my writing private?',
    answer:
      'Yes. Your journal entries are private by default. We do not read, analyze, or share your content.',
  },
  {
    id: 'faq-2',
    question: 'Do I need to write every day?',
    answer:
      'No. The app encourages consistency, not pressure. Write when it feels right.',
  },
  {
    id: 'faq-3',
    question: 'Can I access my entries later?',
    answer:
      'Absolutely. All your past entries are organized and always accessible.',
  },
  {
    id: 'faq-4',
    question: 'Is this app free to use?',
    answer:
      'Yes. The core journaling experience is free, with optional upgrades planned later.',
  },
  {
    id: 'faq-5',
    question: 'Is this meant for long writing sessions?',
    answer:
      'It works for both quick thoughts and longer reflections. No rules, no pressure.',
  },
];

export function FaqSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-32', className)}>
      {/* width aligned with navbar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Centered header */}
        <div className="mb-16 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clear answers to common questions about writing with intention.
          </p>
        </div>

        {/* Centered accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible>
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-border"
              >
                <AccordionTrigger
                  className="
                    py-6 text-left text-base font-medium text-foreground
                    hover:no-underline
                  "
                >
                  {item.question}
                </AccordionTrigger>

                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
