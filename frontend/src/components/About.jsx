import React, { useEffect, useRef, useState } from 'react';
import { Award, Users, Package, Trophy } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ICONS = { Award, Users, Package, Trophy };

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-serif text-5xl lg:text-6xl gold-gradient-text">
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

const statIcons = ['Award', 'Users', 'Package', 'Trophy'];

export default function About() {
  const { content } = useContent();
  const { about } = content;

  return (
    <section id="about" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center relative">
        <div>
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">{about.eyebrow}</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl leading-[1.05]">
            {about.title}{' '}
            <span className="gold-gradient-text italic">{about.titleAccent}</span>
          </h2>
          {about.body.map((p, i) => (
            <p key={`about-p-${i}-${p.slice(0, 20)}`} className="mt-6 text-muted-foreground leading-relaxed max-w-xl">
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            {about.chips.map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 text-xs tracking-widest uppercase text-amber-300"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {about.stats.map((s, i) => {
            const Icon = ICONS[statIcons[i]] || Award;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 lg:p-8 card-hover shine-border"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <Counter value={s.value} suffix={s.suffix} />
                <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
