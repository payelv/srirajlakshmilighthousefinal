import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const PAGE_SIZE = 24;

export default function CategoryPage() {
  const { catId } = useParams();
  const { content } = useContent();
  const { categories, products } = content;
  const [shown, setShown] = useState(PAGE_SIZE);

  const category = categories.find((c) => c.id === catId);

  const filtered = useMemo(
    () => products.filter((p) => p.category === catId),
    [products, catId]
  );
  const visible = filtered.slice(0, shown);

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  if (!category) {
    return (
      <div className="App">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-40 text-center text-muted-foreground">
          Category not found. <Link to="/" className="text-amber-400 underline">Go home</Link>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24">
        <div className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          {category.section ? ` / ${category.section}` : ''} / {category.name}
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl mb-4">{category.name}</h1>
        <div className="text-sm text-muted-foreground mb-10">
          Showing 1–{visible.length} of {filtered.length} results
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-20 text-center text-muted-foreground">
            No products found in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visible.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group rounded-2xl overflow-hidden border border-border bg-card/50 card-hover block"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{category.name}</div>
                  <h3 className="font-serif text-lg leading-tight">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    {p.mrp && p.mrp > p.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(p.mrp)}</span>
                    )}
                    <span className="text-amber-400 font-semibold">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </Link>
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
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
