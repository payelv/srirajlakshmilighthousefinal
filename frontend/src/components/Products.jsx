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
    <section id="collections" className="light bg-background text-foreground relative py-24 lg:py-32">
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
              <h3 className="font-sans text-lg font-bold tracking-wide mb-5">{sectionName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cats.map((c) => (
                  <CategoryCard key={c.id} label={c.name} image={c.image} to={`/category/${c.id}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ label, image, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card/40 backdrop-blur p-4 flex flex-col gap-4 card-hover"
    >
      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-secondary">
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <span className="text-sm font-semibold tracking-wide group-hover:text-amber-400 transition-colors">
        {label}
      </span>
    </Link>
  );
}
