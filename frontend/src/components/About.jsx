import React from 'react';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about } = content;

  return (
    <section id="about" className="light bg-background text-foreground relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center relative">
        <div>
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">{about.eyebrow}</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-5xl leading-[1.15]">
            {about.title}{' '}
            <span className="gold-gradient-text italic">{about.titleAccent}</span>
          </h2>
          {about.body.map((p, i) => (
            <p key={`about-p-${i}-${p.slice(0, 20)}`} className="mt-5 text-muted-foreground leading-relaxed max-w-xl">
              {p}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
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

        <div
          className="relative aspect-square lg:aspect-[1/1.05] rounded-2xl overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, rgba(184,134,63,.9), transparent 45%), radial-gradient(circle at 70% 70%, rgba(24,21,19,.9), transparent 55%), linear-gradient(160deg,#241f1a,#0f0d0b)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-8xl">
            ◈
          </div>
        </div>
      </div>
    </section>
  );
}
