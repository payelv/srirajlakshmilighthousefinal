import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function ProductPage() {
  const { id } = useParams();
  const { content } = useContent();
  const { products, categories, business } = content;
  const [imgIdx, setImgIdx] = useState(0);
  const [colourIdx, setColourIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === id);
  const category = product ? categories.find((c) => c.id === product.category) : null;

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  if (!product) {
    return (
      <div className="App">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-40 text-center text-muted-foreground">
          Product not found. <Link to="/" className="text-amber-400 underline">Go home</Link>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.image];
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);
  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);

  const waLink = () => {
    const colourText = product.colours && product.colours.length ? ` - Colour: ${product.colours[colourIdx]}` : '';
    const enquiry = encodeURIComponent(
      `Hello ${business.name} Light House, I would like to enquire about "${product.name}" (${formatPrice(product.price)}) x${qty}${colourText}.`
    );
    return `https://wa.me/${business.whatsapp}?text=${enquiry}`;
  };

  return (
    <div className="App">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24">
        <div className="text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          {category ? (
            <React.Fragment>
              {category.section ? ` / ${category.section}` : ''} /{' '}
              <Link to={`/category/${category.id}`} className="hover:text-amber-400">{category.name}</Link>
            </React.Fragment>
          ) : ''} / {product.name}
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <React.Fragment>
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-black" />
                </button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-amber-400' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              {product.mrp && product.mrp > product.price && (
                <span className="text-muted-foreground line-through text-lg">{formatPrice(product.mrp)}</span>
              )}
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            </div>
            {product.colours && product.colours.length > 0 && (
              <div className="mb-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Colour</div>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((c, i) => (
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
            <div className="flex items-center gap-3 mb-6">
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="w-16 h-11 rounded-lg border border-border bg-background/60 text-center"
              />
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-colors max-w-[240px]"
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
            <div className="border-t border-border pt-4 text-sm text-muted-foreground mb-6">
              Category: {category ? category.name : 'Lighting'}
            </div>
            {product.description && (
              <div className="border-t border-border pt-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Additional Information</div>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
