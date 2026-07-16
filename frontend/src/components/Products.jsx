import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Button } from '../components/ui/button';

export default function Products() {
  const { content } = useContent();
  const { products, categories, business } = content;
  const [filter, setFilter] = useState('all');

  const featured = useMemo(() => {
    const base = products.filter((p) => p.featured !== false);
    if (filter === 'all') return base;
    return base.filter((p) => p.category === filter);
  }, [products, filter]);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const formatPrice = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <section id="products" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Featured Products</span>
            <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
              Shop the <span className="gold-gradient-text italic">Collection</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 no-scrollbar">
            <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterPill>
            {categories.slice(0, 6).map((c) => (
              <FilterPill key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.name}
              </FilterPill>
            ))}
          </div>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-20 text-center text-muted-foreground">
            No products yet. Admin can add products with prices and photos from the dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => {
              const enquiry = encodeURIComponent(
                `Hello ${business.name} Light House, I would like to enquire about "${p.name}" (${formatPrice(p.price)}).`
              );
              return (
                <div key={p.id} className="group rounded-2xl overflow-hidden border border-border bg-card/50 card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-[10px] tracking-widest uppercase text-amber-300 border border-amber-500/30">
                      {catMap[p.category] || 'Lighting'}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                      <div className="text-amber-400 font-semibold whitespace-nowrap">{formatPrice(p.price)}</div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="mt-5 flex items-center gap-2">
                      <a
                        href={`https://wa.me/${business.whatsapp}?text=${enquiry}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${business.phone}`}
                        className="h-10 w-10 rounded-full border border-border hover:border-amber-500/60 flex items-center justify-center"
                      >
                        <Phone className="w-4 h-4 text-amber-400" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black px-6 font-medium"
          >
            Enquire for full catalogue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-colors ${
        active
          ? 'bg-amber-500 border-amber-500 text-black'
          : 'border-border text-muted-foreground hover:text-amber-400 hover:border-amber-500/50'
      }`}
    >
      {children}
    </button>
  );
}
