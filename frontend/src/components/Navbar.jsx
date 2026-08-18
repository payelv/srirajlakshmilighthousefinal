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
    const sections = Array.from(
      document.querySelectorAll('section')
    );

    const updateNavbarColor = () => {
      const navbarPointY = 80;

      let activeSection = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (
          rect.top <= navbarPointY &&
          rect.bottom >= navbarPointY
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

    updateNavbarColor();

    window.addEventListener(
      'scroll',
      updateNavbarColor,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateNavbarColor
    );

    return () => {
      window.removeEventListener(
        'scroll',
        updateNavbarColor
      );

      window.removeEventListener(
        'resize',
        updateNavbarColor
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
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        bg-transparent
        transition-colors
        duration-500
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
          className={`
            flex
            items-center
            gap-4
            ${textColor}
            transition-colors
            duration-500
          `}
        >
          <span
            className="
              w-16
              h-16
              lg:w-20
              lg:h-20
              rounded-full
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Lightbulb
              className={`
                w-8
                h-8
                lg:w-10
                lg:h-10
                ${textColor}
                transition-colors
                duration-500
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
                duration-500
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
                duration-500
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
                transition-all
                duration-500
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

          {/* MOBILE MENU */}
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
              duration-500
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
                  duration-500
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
