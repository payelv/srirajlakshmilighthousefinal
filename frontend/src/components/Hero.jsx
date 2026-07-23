import React from 'react';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { content } = useContent();
  const { hero, business } = content;

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Text content */}
        <div className="flex-1 max-w-xl fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs tracking-[0.25em] uppercase text-amber-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-8 font-serif font-bold uppercase text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            {hero.titleLine1}
            <br />
            <span className="gold-gradient-text italic normal-case">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => scrollTo('#collections')}
              className="h-14 rounded-full bg-foreground hover:bg-foreground/90 text-background px-8 font-semibold uppercase tracking-wide text-sm group"
            >
              {hero.ctaPrimary}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollTo('#contact')}
              variant="outline"
              className="h-14 rounded-full border-2 border-foreground/80 hover:border-foreground bg-transparent text-foreground px-8 font-semibold uppercase tracking-wide text-sm"
            >
              {hero.ctaSecondary}
            </Button>
          </div>

          <a
            href={`tel:${business.phone}`}
            className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-amber-600 transition-colors"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            {hero.ctaTertiary}
          </a>
        </div>

        {/* Image */}
        <div className="flex-1 w-full max-w-xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={hero.image}
              alt="Luxury chandelier interior"
              className="w-full h-[420px] sm:h-[480px] lg:h-[540px] object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
