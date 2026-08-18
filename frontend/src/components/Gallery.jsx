import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Gallery() {
  const { content } = useContent();
  const items = content.gallery;
  const [active, setActive] = useState(null);

  return (
    <section id="gallery" className="light bg-background text-foreground relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Gallery</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            Spaces we've <span className="gold-gradient-text italic">illuminated</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((g, i) => (
            <button
              key={g.title + i}
              onClick={() => setActive(g)}
              className={`group relative overflow-hidden rounded-2xl border border-border card-hover ${
                i % 5 === 0 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-square'
              }`}
            >
              <img
                src={g.image}
                alt={g.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-amber-300 opacity-90">View</div>
                  <div className="font-serif text-lg text-white mt-1">{g.title}</div>
                </div>
                <span className="w-9 h-9 rounded-full border border-amber-400/60 bg-amber-500/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-amber-200" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-6"
          onClick={() => setActive(null)}
        >
          <button className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/30 text-white flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active.image} alt={active.title} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <div className="mt-4 text-center font-serif text-2xl text-white">{active.title}</div>
          </div>
        </div>
      )}
    </section>
  );
}
