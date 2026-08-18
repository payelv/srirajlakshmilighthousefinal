import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { content } = useContent();
  const { hero, business, about } = content;

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-40 pb-28 lg:pt-48 lg:pb-36"
      style={{
        background:
          'radial-gradient(ellipse 90% 60% at 30% 0%, hsl(30 28% 12%) 0%, hsl(var(--background)) 55%, hsl(var(--background)) 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 82% 18%, rgba(184,134,63,.28), transparent 45%), radial-gradient(circle at 68% 30%, rgba(184,134,63,.14), transparent 40%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400 font-semibold">
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
            {hero.titleLine1}{' '}
            <span className="gold-gradient-text italic">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => scrollTo('#collections')}
              className="h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-black px-8 font-semibold text-sm group"
            >
              {hero.ctaPrimary}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollTo('#contact')}
              variant="outline"
              className="h-14 rounded-full border border-white/35 hover:bg-white/10 bg-transparent text-foreground px-8 font-semibold text-sm"
            >
              {hero.ctaSecondary}
            </Button>
          </div>

          <a
            href={`tel:${business.phone}`}
            className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-amber-400 transition-colors w-fit"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            {hero.ctaTertiary}
          </a>
        </div>

        <div className="relative mt-20 grid grid-cols-2 lg:grid-cols-4 border-t border-white/15 pt-9">
          {about.stats.map((s) => (
            <div key={s.label}>
              <b className="block font-serif text-3xl text-amber-400">
                {s.value.toLocaleString('en-IN')}
                {s.suffix}
              </b>
              <span className="text-sm text-foreground/55 tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
