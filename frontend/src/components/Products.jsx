import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const PAGE_SIZE = 9;

export default function Products() {
  const { content } = useContent();
  const { products, categories, business } = content;
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [colourIdx, setColourIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const formatPrice = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = activeCat === 'all' || p.category === activeCat;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [products, activeCat, query]);

  const visible = filtered.slice(0, shown);

  const openProduct = (p) => {
    setSelected(p);
    setImgIdx(0);
    setColourIdx(0);
    setQty(1);
  };
  const closeProduct = () => setSelected(null);

  const images = selected ? (selected.images && selected.images.length ? selected.images : [selected.image]) : [];

  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);
  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);

  let touchStartX = null;
  const onTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40) prevImg();
    else if (dx < -40) nextImg();
    touchStartX = null;
  };

  const waLink = (p) => {
    const colourText = p.colours && p.colours.length ? ` - Colour: ${p.colours[colourIdx]}` : '';
    const enquiry = encodeURIComponent(
      `Hello ${business.name} Light House, I would like to enquire about "${p.name}" (${formatPrice(p.price)}) x${qty}${colourText}.`
    );
    return `https://wa.me/${business.whatsapp}?text=${enquiry}`;
  };

  return (
    <section id="collections" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Collections</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            Every Light, <span className="gold-gradient-text italic">Every Space</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Browse by category or search across our full catalogue</p>
        </div>

        <div className="flex justify-center mb-8">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
            placeholder="Search products..."
            className="w-full max-w-sm h-11 px-5 rounded-full border border-border bg-background/60 text-sm text-center focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex gap-7 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <CategoryCircle
            active={activeCat === 'all'}
            label="All"
            image={categories[0]?.image}
            onClick={() => { setActiveCat('all'); setShown(PAGE_SIZE); }}
          />
          {categories.map((c) => (
            <CategoryCircle
              key={c.id}
              active={activeCat === c.id}
              label={c.name}
              image={c.image}
              onClick={() => { setActiveCat(c.id); setShown(PAGE_SIZE); }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="font-serif text-xl lg:text-2xl">
            {activeCat === 'all' ? 'All Products' : catMap[activeCat]}
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{visible.length}</span> of {filtered.length}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-20 text-center text-muted-foreground">
            No products found. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p) => (
              <div
                key={p.id}
                onClick={() => openProduct(p)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card/50 card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-[10px] tracking-widest uppercase text-amber-300 border border-amber-500/30">
                    {catMap[p.category] || 'Lighting'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    {p.mrp && p.mrp > p.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(p.mrp)}</span>
                    )}
                    <span className="text-amber-400 font-semibold">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {shown < filtered.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShown((s) => s + PAGE_SIZE)}
              className="h-12 px-8 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={closeProduct}>
          <div
            className="bg-card w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProduct}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/90 border border-border flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div
              className="relative aspect-[4/3] overflow-hidden bg-muted"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img src={images[imgIdx]} alt={selected.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-black" />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-amber-400' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="p-6">
              <div className="text-xs text-muted-foreground mb-2">
                Home / {catMap[selected.category]} / {selected.name}
              </div>
              <h2 className="font-serif text-2xl mb-3">{selected.name}</h2>
              <div className="flex items-center gap-3 mb-4">
                {selected.mrp && selected.mrp > selected.price && (
                  <span className="text-muted-foreground line-through">{formatPrice(selected.mrp)}</span>
                )}
                <span className="text-2xl font-semibold">{formatPrice(selected.price)}</span>
              </div>
              {selected.colours && selected.colours.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Colour</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.colours.map((c, i) => (
                      <button
                        key={c}
                        onClick={() => setColourIdx(i)}
                        className={`px-4 py-1.5 rounded-full text-xs border ${i === colourIdx ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-5">
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-16 h-11 rounded-lg border border-border bg-background/60 text-center"
                />
                <a
                  href={waLink(selected)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp us
                </a>
                <a
                  href={`tel:${business.phone}`}
                  className="h-11 w-11 rounded-full border border-border hover:border-amber-500/60 flex items-center justify-center flex-shrink-0"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                </a>
              </div>
              <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                Category: {catMap[selected.category]}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CategoryCircle({ active, label, image, onClick }) {
  return (
    <button onClick={onClick} className="flex-shrink-0 w-[84px] text-center group">
      <div className={`w-[72px] h-[72px] mx-auto rounded-full p-[3px] border-2 transition-colors ${active ? 'border-amber-500' : 'border-border group-hover:border-amber-500/50'}`}>
        <img src={image} alt={label} className="w-full h-full object-cover rounded-full" />
      </div>
      <div className={`mt-2 text-[10px] tracking-wide uppercase ${active ? 'text-amber-400' : 'text-muted-foreground'}`}>
        {label}
      </div>
    </button>
  );
}
