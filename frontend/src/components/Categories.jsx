import React from 'react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Categories() {
  const { content } = useContent();
  const cats = content.categories;

  return (
    <section id="collections" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-14">
        <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Categories</span>
        <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
          Every Light,{' '}
          <span className="gold-gradient-text italic">Every Space</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Twelve curated categories covering every corner of your home or project.
        </p>
      </div>

      {/* Single continuous marquee */}
      <div className="relative overflow-hidden">
        <div className="flex gap-4 w-max scroll-marquee">
          {[...cats, ...cats].map((c, i) => {
            const Icon = Icons[c.icon] || Icons.Lightbulb;
            return (
              <div
                key={`row-${c.id}-${i}`}
                className="flex items-center gap-3 px-7 py-4 rounded-full border border-border bg-card/60 backdrop-blur whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span className="font-serif text-lg">{c.name}</span>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
