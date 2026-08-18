import React, { useEffect, useRef } from 'react';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';
import heroStorefront from './hero-storefront.jpg';

export default function Hero() {
  const { content } = useContent();
  const { hero, business } = content;

  const pinRef = useRef(null);
  const imgWrapRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    function onScroll() {
      const pin = pinRef.current;
      if (!pin) return;
      const rect = pin.getBoundingClientRect();
      const total = pin.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;

      const scale = 1 + progress * 0.35;
      if (imgWrapRef.current) imgWrapRef.current.style.transform = `scale(${scale})`;

      const fadeProgress = clamp(progress / 0.6, 0, 1);
      if (overlayRef.current) overlayRef.current.style.opacity = String(1 - fadeProgress * 0.3);
      if (textRef.current) {
        textRef.current.style.opacity = String(1 - fadeProgress);
        textRef.current.style.transform = `translateY(${-fadeProgress * 30}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = progress > 0.05 ? '0' : '0.85';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-background">
      <div ref={pinRef} className="relative" style={{ height: '220vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            ref={imgWrapRef}
            className="absolute -inset-[2%] w-[104%] h-[104%] will-change-transform"
            style={{ transformOrigin: '48% 55%' }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroStorefront})` }}
            />
          </div>

          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, hsl(var(--background) / 0.5) 0%, hsl(var(--background) / 0.38) 24%, hsl(var(--background) / 0.24) 42%, hsl(var(--background) / 0.06) 60%, hsl(var(--background) / 0.02) 72%), linear-gradient(0deg, hsl(var(--background) / 0.18), transparent 40%)',
            }}
          />

          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16 max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              {hero.eyebrow}
            </span>

            <h1 className="mt-8 font-serif font-bold uppercase text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-foreground">
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
              className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-amber-400 transition-colors w-fit"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              {hero.ctaTertiary}
            </a>
          </div>

          <div
            ref={hintRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/80"
          >
            <span className="text-[11px] tracking-[0.15em] uppercase">Scroll to enter</span>
            <div className="w-3 h-3 border-r-2 border-b-2 border-current rotate-45 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
