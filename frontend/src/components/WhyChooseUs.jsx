import React from 'react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function WhyChooseUs() {
  const { content } = useContent();
  const items = content.whyUs;

  return (
    <section className="light bg-background text-foreground relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Why Choose Us</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            The Rajlaxmi <span className="gold-gradient-text italic">difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl border border-border overflow-hidden">
          {items.map((it) => {
            const Icon = Icons[it.icon] || Icons.Sparkles;
            return (
              <div key={it.title} className="bg-card p-7">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-base">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
