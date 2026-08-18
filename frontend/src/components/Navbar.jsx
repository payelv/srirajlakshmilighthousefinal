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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`light fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-all duration-500 text-foreground ${
        scrolled
          ? 'bg-white/60 border-b border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
          : 'bg-white/30 border-b border-white/20'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-24 lg:h-28 flex items-center justify-between">
        <button onClick={() => scrollTo('#home')} className="flex items-center gap-4 group">
          <span className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-500/5 group-hover:bg-amber-500/15 transition-colors shrink-0">
            <Lightbulb className="w-8 h-8 lg:w-10 lg:h-10 text-amber-400" />
          </span>
          <span className="leading-tight text-left">
            <span className="block font-serif text-3xl lg:text-4xl text-foreground">{content.business.name}</span>
            <span className="block text-xs lg:text-sm tracking-[0.35em] text-foreground/70">
              {content.business.tagline}
            </span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-10">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-base font-medium text-foreground hover:text-amber-400 transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => scrollTo('#contact')}
            className="hidden sm:inline-flex h-12 lg:h-14 text-base bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-full px-7"
          >
            Visit Showroom
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-12 h-12 rounded-full border border-border flex items-center justify-center"
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-white/70 backdrop-blur-2xl border-t border-white/40">
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-left text-lg text-foreground/90 py-2 border-b border-border/50"
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
