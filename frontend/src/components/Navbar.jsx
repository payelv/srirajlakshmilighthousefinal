import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Collections', href: '#collections' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { content } = useContent();

  const [open, setOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateNavbar = () => {
      const hero = document.querySelector('#home');

      if (!hero) return;

      const heroBottom = hero.getBoundingClientRect().bottom;

      // Glass effect starts after the hero
      setIsPastHero(heroBottom <= 80);

      const navbarY = 70;

      const sections = Array.from(
        document.querySelectorAll('section')
      );

      let activeSection = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (
          rect.top <= navbarY &&
          rect.bottom > navbarY
        ) {
          activeSection = section;
          break;
        }
      }

      if (!activeSection) return;

      const theme =
        activeSection.getAttribute('data-nav-theme');

      if (theme === 'dark') {
        setIsDarkBackground(true);
        return;
      }

      if (theme === 'light') {
        setIsDarkBackground(false);
        return;
      }

      const style =
        window.getComputedStyle(activeSection);

      const backgroundColor =
        style.backgroundColor;

      const rgb = backgroundColor.match(/\d+/g);

      if (rgb && rgb.length >= 3) {
        const r = Number(rgb[0]);
        const g = Number(rgb[1]);
        const b = Number(rgb[2]);

        const brightness =
          (r * 299 + g * 587 + b * 114) / 1000;

        setIsDarkBackground(brightness < 150);
      }
    };

    updateNavbar();

    window.addEventListener(
      'scroll',
      updateNavbar,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateNavbar
    );

    return () => {
      window.removeEventListener(
        'scroll',
        updateNavbar
      );

      window.removeEventListener(
        'resize',
        updateNavbar
      );
    };
  }, []);

  const scrollTo = (href) => {
    setOpen(false);

    if (location.pathname !== '/') {
      navigate('/');

      setTimeout(() => {
        const el = document.querySelector(href);

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 150);

      return;
    }

    const el = document.querySelector(href);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const textColor = isDarkBackground
    ? 'text-white'
    : 'text-black';

  const buttonColor = isDarkBackground
    ? 'bg-white text-black'
    : 'bg-black text-white';

  const underlineColor = isDarkBackground
    ? 'bg-white'
    : 'bg-black';

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-500

        ${
          isPastHero
            ? isDarkBackground
              ? 'bg-black/35 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
              : 'bg-white/35 backdrop-blur-xl border-b border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
            : 'bg-transparent border-b border-transparent'
        }
      `}
    >
      <nav
        className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-10
          h-24
          lg:h-28
          flex
          items-center
          relative
        "
      >

        {/* BUSINESS NAME */}
        <button
          onClick={() => scrollTo('#home')}
          className={`
            absolute
            left-6
            lg:left-10
            text-left
            ${textColor}
            transition-colors
            duration-500
            leading-tight
          `}
        >
          <span
            className="
              block
              font-serif
              text-2xl
              lg:text-3xl
              whitespace-nowrap
            "
          >
            {content.business.name}
          </span>

          <span
            className="
              block
              text-[9px]
              lg:text-[10px]
              tracking-[0.35em]
              opacity-70
              mt-1
              whitespace-nowrap
            "
          >
            {content.business.tagline}
          </span>
        </button>

        {/* DESKTOP NAVIGATION */}
        <div
          className="
            hidden
            lg:flex
            items-center
            justify-center
            gap-10
            mx-auto
          "
        >
          {LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`
                relative
                text-base
                font-medium
                ${textColor}
                transition-all
                duration-500
                group
              `}
            >
              {link.label}

              <span
                className={`
                  absolute
                  left-0
                  right-0
                  -bottom-1
                  h-px
                  ${underlineColor}
                  scale-x-0
                  group-hover:scale-x-100
                  transition-transform
                  duration-300
                  origin-left
                `}
              />
            </button>
          ))}
        </div>

        {/* VISIT SHOWROOM */}
        <div
          className="
            hidden
            sm:block
            absolute
            right-6
            lg:right-10
          "
        >
          <Button
            onClick={() => scrollTo('#contact')}
            className={`
              h-12
              lg:h-14
              text-base
              ${buttonColor}
              hover:opacity-80
              font-medium
              rounded-full
              px-7
              transition-all
              duration-500
            `}
          >
            Visit Showroom
          </Button>
        </div>

        {/* MOBILE MENU */}
        <button
          onClick={() => setOpen((value) => !value)}
          className={`
            lg:hidden
            absolute
            right-6
            w-12
            h-12
            flex
            items-center
            justify-center
            ${textColor}
            transition-colors
            duration-500
          `}
          aria-label="menu"
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div
          className={`
            lg:hidden
            ${
              isPastHero
                ? isDarkBackground
                  ? 'bg-black/40 backdrop-blur-xl'
                  : 'bg-white/40 backdrop-blur-xl'
                : 'bg-transparent'
            }
          `}
        >
          <div className="px-6 py-5 flex flex-col items-end gap-4">
            {LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`
                  text-lg
                  font-medium
                  ${textColor}
                  transition-colors
                  duration-500
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
