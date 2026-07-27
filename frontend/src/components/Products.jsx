import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function Products() {
  const { content } = useContent();
  const { categories } = content;

  const groups = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = c.section && c.section.trim() ? c.section.trim() : '__none__';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    return Array.from(map.entries());
  }, [categories]);

  return (
    <section id="collections" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Collections</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            Every Light, <span className="gold-gradient-text italic">Every Space</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Browse our full catalogue by category</p>
        </div>

        <div className="space-y-14">
          {groups.map(([sectionName, cats]) => (
            <div key={sectionName}>
              {sectionName !== '__none__' && (
                <h3 className="text-center font-serif text-2xl lg:text-3xl mb-6">{sectionName}</h3>
              )}
              <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-wrap gap-8 justify-center">
                {cats.map((c) => (
                  <CategoryCircle key={c.id} label={c.name} image={c.image} to={`/category/${c.id}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCircle({ label, image, to }) {
  return (
    <Link to={to} className="flex-shrink-0 w-[96px] text-center group">
      <div className="w-[80px] h-[80px] mx-auto rounded-full p-[3px] border-2 border-amber-500/60 group-hover:border-amber-400 transition-colors">
        <img src={image} alt={label} className="w-full h-full object-cover rounded-full" />
      </div>
      <div className="mt-2 text-[10px] tracking-wide uppercase text-muted-foreground group-hover:text-amber-400">
        {label}
      </div>
    </Link>
  );
}
