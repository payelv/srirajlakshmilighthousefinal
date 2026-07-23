import React, { useEffect, useState } from 'react';
import { Lightbulb, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../context/ContentContext';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Collections', href: '#collections' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { content, theme, toggleTheme } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-background/70 border-b border-border/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button onClick={() => scrollTo('#home')} className="flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-500/5 group-hover:bg-amber-500/15 transition-colors">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </span>
          <span className="leading-tight text-left">
            <span className="block font-serif text-lg text-foreground">{content.business.name}</span>
            <span className="block text-[10px] tracking-[0.35em] text-muted-foreground">
              {content.business.tagline}
            </span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-foreground/80 hover:text-amber-400 transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-amber-500/60 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          <Button
            onClick={() => scrollTo('#contact')}
            className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-full px-5"
          >
            Visit Showroom
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 rounded-full border border-border flex items-center justify-center"
            aria-label="menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-left text-foreground/90 py-2 border-b border-border/50"
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
