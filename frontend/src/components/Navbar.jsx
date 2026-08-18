import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lightbulb, Menu, X } from 'lucide-react';
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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkBackground = () => {
      const navbarHeight = 100;

      // Find the element directly behind the navbar
      const element = document.elementFromPoint(
        window.innerWidth / 2,
        navbarHeight / 2
      );

      if (!element) return;

      let current = element;

      // Look for a section with a background
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);

        const backgroundColor = style.backgroundColor;
        const backgroundImage = style.backgroundImage;

        if (
          backgroundColor &&
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'transparent'
        ) {
          const rgb = backgroundColor.match(/\d+/g);

          if (rgb && rgb.length >= 3) {
            const [r, g, b] = rgb.map(Number);

            // Calculate brightness
            const brightness =
              (r * 299 + g * 587 + b * 114) / 1000;

            setIsDarkBackground(brightness < 150);
            return;
          }
        }

        // If the section has an image, assume dark for better visibility
        if (
          backgroundImage &&
          backgroundImage !== 'none'
        ) {
          setIsDarkBackground(true);
          return;
        }

        current = current.parentElement;
      }

      // Default
      setIsDarkBackground(true);
    };

    checkBackground();

    window.addEventListener('scroll', checkBackground);
    window.addEventListener('resize', checkBackground);

    return () => {
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
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

  const hoverColor = isDarkBackground
    ? 'hover:text-white/70'
    : 'hover:text-black/60';

  const borderColor = isDarkBackground
    ? 'border-white/30'
    : 'border-black/30';

  const buttonClass = isDarkBackground
    ? 'bg-white text-black hover:bg-white/90'
    : 'bg-black text-white hover:bg-black/90';

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        bg-transparent
        transition-colors
        duration-300
      "
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
          justify-between
        "
      >

        {/* LOGO */}
        <button
          onClick={() => scrollTo('#home')}
          className={`flex items-center gap-4 group ${textColor}`}
        >
          <span
            className={`
              w-16
              h-16
              lg:w-20
              lg:h-20
              rounded-full
              flex
              items-center
              justify-center
              shrink-0
              border
              ${borderColor}
              transition-colors
              duration-300
            `}
          >
            <Lightbulb
              className={`
                w-8
                h-8
                lg:w-10
                lg:h-10
                ${textColor}
                transition-colors
                duration-300
              `}
            />
          </span>

          <span className="leading-tight text-left">
            <span
              className={`
                block
                font-serif
                text-3xl
                lg:text-4xl
                ${textColor}
                transition-colors
                duration-300
              `}
            >
              {content.business.name}
            </span>

            <span
              className={`
                block
                text-xs
                lg:text-sm
                tracking-[0.35em]
                ${textColor}
                opacity-70
                transition-colors
                duration-300
              `}
            >
              {content.business.tagline}
            </span>
          </span>
        </button>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-10">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className={`
                text-base
                font-medium
                ${textColor}
                ${hoverColor}
                transition-colors
                duration-300
                relative
                group
              `}
            >
              {l.label}

              <span
                className={`
                  absolute
                  -bottom-1
                  left-0
                  right-0
                  h-px
                  ${isDarkBackground ? 'bg-white' : 'bg-black'}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* SHOWROOM BUTTON */}
          <Button
            onClick={() => scrollTo('#contact')}
            className={`
              hidden
              sm:inline-flex
              h-12
              lg:h-14
              text-base
              ${buttonClass}
              font-medium
              rounded-full
              px-7
              transition-colors
              duration-300
            `}
          >
            Visit Showroom
          </Button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen((o) => !o)}
            className={`
              lg:hidden
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              ${textColor}
              transition-colors
              duration-300
            `}
            aria-label="menu"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-transparent">
          <div className="px-6 py-6 flex flex-col gap-4">

            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`
                  text-left
                  text-lg
                  ${textColor}
                  py-3
                  transition-colors
                  duration-300
                `}
              >
                {l.label}
              </button>
            ))}

          </div>
        </div>
      )}
    </header>
  );
}
