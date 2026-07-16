import React from 'react';
import { Lightbulb, Instagram, Facebook, Youtube, MessageCircle, Phone, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const { business } = content;

  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-500/5">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-xl">{business.name}</span>
              <span className="block text-[10px] tracking-[0.35em] text-muted-foreground">{business.tagline}</span>
            </span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
            Kochi's trusted wholesale dealer in premium chandeliers, LED lights, and decorative fittings for homes, hotels, offices and commercial spaces.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Youtube, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-border hover:border-amber-500/60 flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {['Home', 'About', 'Products', 'Collections', 'Gallery', 'Contact'].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-amber-400 transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 mb-4">Reach Us</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-amber-400" /><a href={`tel:${business.phone}`}>{business.phone}</a></li>
            <li className="flex items-start gap-2"><MessageCircle className="w-4 h-4 mt-0.5 text-emerald-400" /><a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a></li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-amber-400" /><span className="break-all">{business.email}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {business.name} Light House. Illuminating Kerala since 2003.
      </div>
    </footer>
  );
}
