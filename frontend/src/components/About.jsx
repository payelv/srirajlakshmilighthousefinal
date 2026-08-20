import React from 'react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about, whyUs = [] } = content;

  return (
    <section id="about" className="light bg-background text-foreground relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* ABOUT INTRO */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center relative">
        <span className="text-xs tracking-[0.35em] uppercase text-amber-400">{about.eyebrow}</span>
        <h2 className="mt-4 font-serif text-4xl lg:text-5xl leading-[1.15]">
          {about.title}{' '}
          <span className="gold-gradient-text italic">{about.titleAccent}</span>
        </h2>
        {about.body.map((p, i) => (
          <p key={`about-p-${i}-${p.slice(0, 20)}`} className="mt-5 text-muted-foreground leading-relaxed">
            {p}
          </p>
        ))}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {about.chips.map((c) => (
            <span
              key={c}
              className="px-4 py-2 rounded-full bg-amber-500/10 text-xs font-semibold tracking-widest uppercase text-amber-700"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* WHY RAJLAXMI - auto-scrolling feature strip */}
      {whyUs.length > 0 && (
        <div className="relative mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-10">
            <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Why Choose Us</span>
            <h3 className="mt-4 font-serif text-3xl lg:text-4xl">
              The Rajlaxmi <span className="gold-gradient-text italic">difference</span>
            </h3>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-5 w-max scroll-marquee">
              {[...whyUs, ...whyUs].map((it, i) => {
                const Icon = Icons[it.icon] || Icons.Sparkles;
                return (
                  <div
                    key={`why-${it.title}-${i}`}
                    className="w-72 flex-shrink-0 rounded-2xl border border-border bg-card/60 backdrop-blur p-7"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <h4 className="font-semibold text-base">{it.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </div>
      )}
    </section>
  );
}
