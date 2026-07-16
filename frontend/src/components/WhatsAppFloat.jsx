import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function WhatsAppFloat() {
  const { content } = useContent();
  const wa = content.business.whatsapp;
  const msg = encodeURIComponent(
    `Hello ${content.business.name} Light House, I would like to enquire about your lighting products.`
  );

  return (
    <a
      href={`https://wa.me/${wa}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
      <span className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
        <MessageCircle className="w-6 h-6" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-background border border-border rounded-full px-4 py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
