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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateNavbarColor = () => {
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
        pointer-events-none
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
          justify-center
          relative
        "
      >

        {/* DESKTOP NAVIGATION */}
        <div
          className="
            hidden
            lg:flex
            items-center
            justify-center
            gap-10
            pointer-events-auto
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
            pointer-events-auto
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

        {/* MOBILE MENU BUTTON */}
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
            pointer-events-auto
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
          className="
            lg:hidden
            absolute
            top-24
            left-0
            right-0
            bg-transparent
            pointer-events-auto
          "
        >
          <div className="px-6 py-4 flex flex-col items-end gap-4">

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
