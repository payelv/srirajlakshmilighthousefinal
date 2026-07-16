import React from 'react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function WhyChooseUs() {
  const { content } = useContent();
  const items = content.whyUs;

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Why Choose Us</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            The Rajlaxmi <span className="gold-gradient-text italic">difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it) => {
            const Icon = Icons[it.icon] || Icons.Sparkles;
            return (
              <div
                key={it.title}
                className="group rounded-2xl border border-border bg-card/40 backdrop-blur p-6 lg:p-7 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-serif text-lg">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
