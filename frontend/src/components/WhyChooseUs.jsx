import React, { useEffect, useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function WhyChooseUs() {
  const { content } = useContent();
  const items = content.whyUs;
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll using requestAnimationFrame for smooth continuous motion.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;
    let last = performance.now();
    const speed = 40; // px/sec
    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        track.scrollLeft += speed * dt;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft -= track.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const list = [...items, ...items]; // duplicate for seamless loop

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Why Choose Us</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            The Rajlaxmi <span className="gold-gradient-text italic">difference</span>
          </h2>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-hidden no-scrollbar px-6 lg:px-10"
        >
          {list.map((it, i) => {
            const Icon = Icons[it.icon] || Icons.Sparkles;
            return (
              <div
                key={`${it.title}-${i}`}
                className="group flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl border border-border bg-card/40 backdrop-blur p-7 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-serif text-xl">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
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
