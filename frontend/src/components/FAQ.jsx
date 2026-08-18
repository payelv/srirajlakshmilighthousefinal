import React from 'react';
import { Plus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useContent } from '../context/ContentContext';

export default function FAQ() {
  const { content } = useContent();
  return (
    <section className="light bg-background text-foreground relative py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">FAQ</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            Questions, <span className="gold-gradient-text italic">answered</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {content.faqs.map((f, i) => (
            <AccordionItem
              key={f.q || `faq-${i}`}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card/40 backdrop-blur px-6 data-[state=open]:border-amber-500/40"
            >
              <AccordionTrigger className="font-serif text-lg text-left hover:no-underline py-5">
                <span>{f.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
