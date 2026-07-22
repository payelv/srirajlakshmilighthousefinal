import React from 'react';
import { ArrowRight, Phone, Sparkles, MousePointer2 } from 'lucide-react';
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
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Background image with overlay */}
     <div className="absolute inset-0">
  <img
    src={hero.image}
    alt="Luxury chandelier interior"
    className="w-full h-full object-cover object-[65%_center] brightness-75"
  />

  {/* Dark glass overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* Left text protection */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

  {/* Bottom fade */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
</div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-32 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/5 backdrop-blur text-xs tracking-[0.25em] uppercase text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            {hero.eyebrow}
          </span>

<h1 className="mt-8 font-serif text-5xl sm:text-6xl lg:text-8xl leading-[1.02] text-white">
            {hero.titleLine1}
            <br />
            <span className="gold-gradient-text italic">{hero.titleAccent}</span>
          </h1>

<p className="mt-8 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => scrollTo('#collections')}
              className="h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black px-6 font-medium group"
            >
              {hero.ctaPrimary}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollTo('#contact')}
              variant="outline"
              className="h-12 rounded-full border-white/40 hover:border-amber-400 bg-white/10 hover:bg-amber-500/10 text-white px-6 backdrop-blur"
            >
              {hero.ctaSecondary}
            </Button>
            <a
              href={`tel:${business.phone}`}
              className="h-12 rounded-full border border-border hover:border-amber-500/60 flex items-center gap-2 px-6 text-sm text-foreground/90 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              {hero.ctaTertiary}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground">
        <MousePointer2 className="w-4 h-4 rotate-180 animate-bounce" />
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
      </div>
    </section>
  );
}
