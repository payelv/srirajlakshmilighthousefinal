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

      {/* Marquee pill row */}
      <div className="relative overflow-hidden mb-14">
        <div className="flex gap-4 w-max scroll-marquee">
          {[...cats, ...cats].map((c, i) => {
            const Icon = Icons[c.icon] || Icons.Lightbulb;
            return (
              <div
                key={`${c.id}-${i}`}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card/60 backdrop-blur whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span className="font-serif text-base">{c.name}</span>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c) => {
          const Icon = Icons[c.icon] || Icons.Lightbulb;
          return (
            <a
              key={c.id}
              href="#products"
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border card-hover"
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-between">
                <div>
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-3 backdrop-blur">
                    <Icon className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="font-serif text-lg text-white">{c.name}</div>
                </div>
                <Icons.ArrowUpRight className="w-5 h-5 text-amber-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
