import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';
import heroStorefront from './hero-storefront.jpg';

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

      if (p < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <b
      ref={ref}
      className="block font-serif text-3xl text-amber-400"
    >
      {display.toLocaleString('en-IN')}
      {suffix}
    </b>
  );
}

export default function Hero() {
  const { content } = useContent();
  const { hero, business, about } = content;

  const scrollTo = (id) => {
    const el = document.querySelector(id);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      data-nav-theme="dark"
      className="
        relative
        overflow-hidden
        pt-40
        pb-28
        lg:pt-48
        lg:pb-36
      "
    >
      {/* HERO IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero.image || heroStorefront})`,
        }}
      />

      {/* DARK OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, hsl(20 14% 4% / 0.42) 0%, hsl(20 14% 4% / 0.55) 60%, hsl(20 14% 4% / 0.68) 100%), radial-gradient(circle at 82% 18%, rgba(184,134,63,.18), transparent 45%)',
        }}
      />

      {/* BOTTOM FADE */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-2/3
          pointer-events-none
          bg-gradient-to-t
          from-background
          via-background/60
          to-transparent
        "
      />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        <div className="max-w-3xl mx-auto text-center">

          <span className="text-xs tracking-[0.35em] uppercase text-amber-400 font-semibold">
            {hero.eyebrow}
          </span>

          <h1
            className="
              mt-6
              font-serif
              text-4xl
              sm:text-5xl
              lg:text-6xl
              leading-[1.1]
              text-foreground
            "
          >
            {hero.titleLine1}{' '}

            <span className="gold-gradient-text italic">
              {hero.titleAccent}
            </span>
          </h1>

          <p
            className="
              mt-6
              mx-auto
              text-base
              sm:text-lg
              text-muted-foreground
              max-w-lg
              leading-relaxed
            "
          >
            {hero.subtitle}
          </p>

          <div
            className="
              mt-9
              flex
              flex-wrap
              items-center
              justify-center
              gap-4
            "
          >
            <Button
              onClick={() => scrollTo('#collections')}
              className="
                h-14
                rounded-full
                bg-amber-500
                hover:bg-amber-400
                text-black
                px-8
                font-semibold
                text-sm
                group
              "
            >
              {hero.ctaPrimary}

              <ArrowRight
                className="
                  w-4
                  h-4
                  ml-2
                  group-hover:translate-x-1
                  transition-transform
                "
              />
            </Button>

            <Button
              onClick={() => scrollTo('#contact')}
              variant="outline"
              className="
                h-14
                rounded-full
                border
                border-white/35
                hover:bg-white/10
                bg-transparent
                text-foreground
                px-8
                font-semibold
                text-sm
              "
            >
              {hero.ctaSecondary}
            </Button>
          </div>

          <a
            href={`tel:${business.phone}`}
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              gap-2
              text-sm
              text-foreground/80
              hover:text-amber-400
              transition-colors
              w-fit
              mx-auto
            "
          >
            <Phone className="w-4 h-4 text-amber-500" />

            {hero.ctaTertiary}
          </a>

        </div>

        {/* STATS */}
        <div
          className="
            relative
            mt-20
            grid
            grid-cols-2
            lg:grid-cols-4
            border-t
            border-white/15
            pt-9
            text-center
          "
        >
          {about.stats.map((s) => (
            <div key={s.label}>
              <Counter
                value={s.value}
                suffix={s.suffix}
              />

              <span className="text-sm text-foreground/55 tracking-wide">
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
