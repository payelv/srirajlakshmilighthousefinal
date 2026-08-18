import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

// Keyword-based fallback grouping, used only when a category doesn't have
// its "Section" field filled in via the admin dashboard yet. Keeps the
// Collections layout grouped (matching the requested design) out of the box,
// while still respecting a manually-set c.section if one is present.
const FALLBACK_SECTIONS = [
  { name: 'Residential Lighting', match: /chandelier|pendant|ceiling|wall|decorative/i },
  { name: 'Functional & Smart', match: /\bled\b|spot|smart/i },
  { name: 'Outdoor & Garden', match: /outdoor|garden|gate/i },
  { name: 'Commercial & Architectural', match: /commercial|architectural/i },
];

function resolveSection(category) {
  if (category.section && category.section.trim()) return category.section.trim();
  const found = FALLBACK_SECTIONS.find((s) => s.match.test(category.name || category.id || ''));
  return found ? found.name : 'More Collections';
}

export default function Products() {
  const { content } = useContent();
  const { categories } = content;

  const groups = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      const key = resolveSection(c);
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
              <h3 className="text-center font-serif text-2xl lg:text-3xl mb-6">{sectionName}</h3>
              <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-wrap gap-x-8 gap-y-10 justify-center">
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
    <Link to={to} className="flex-shrink-0 w-[132px] text-center group">
      <div className="w-[110px] h-[110px] mx-auto rounded-full p-[3px] border-2 border-amber-500/60 bg-background group-hover:border-amber-400 group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_-8px_rgba(224,161,60,0.45)] transition-all duration-200">
        <img src={image} alt={label} className="w-full h-full object-cover rounded-full" />
      </div>
      <div className="mt-3 text-sm font-semibold tracking-wide uppercase text-foreground group-hover:text-amber-400">
        {label}
      </div>
    </Link>
  );
}
