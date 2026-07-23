import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lightbulb, LogOut, Home, Save, Trash2, Plus, Loader2,
  Package, MapPin, Info, FileText, LayoutGrid, Images, HelpCircle, Inbox,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '../components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { useContent } from '../context/ContentContext';
import { useToast } from '../hooks/use-toast';
import { enquiryApi } from '../api';
import ImageUploadField from '../components/ImageUploadField';

export default function AdminDashboard() {
  const nav = useNavigate();
  const { content, updateContent } = useContent();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const logout = () => {
    localStorage.removeItem('srl-token');
    localStorage.removeItem('srl-admin-email');
    nav('/admin');
  };

  const doSave = async (patch) => {
    setSaving(true);
    const res = await updateContent(patch);
    setSaving(false);
    if (res.ok) toast({ title: 'Changes saved', description: 'Live on the website now.' });
    else toast({ title: 'Save failed', description: res.error || 'Try again.' });
    return res;
  };

  // Re-sync local editors when content refreshes from backend
  useEffect(() => { setBiz(content.business); }, [content.business]);
  useEffect(() => { setHero(content.hero); }, [content.hero]);
  useEffect(() => { setAbout(content.about); }, [content.about]);
  useEffect(() => { setProducts(content.products); }, [content.products]);
  useEffect(() => { setCats(content.categories); }, [content.categories]);
  useEffect(() => { setGallery(content.gallery); }, [content.gallery]);
  useEffect(() => { setFaqs(content.faqs); }, [content.faqs]);

  // ---- Business ----
  const [biz, setBiz] = useState(content.business);
  const saveBiz = () => doSave({ business: biz });

  // ---- Hero ----
  const [hero, setHero] = useState(content.hero);
  const saveHero = () => doSave({ hero });

  // ---- About ----
  const [about, setAbout] = useState(content.about);
  const saveAbout = () => doSave({ about });

  // ---- Products ----
  const [products, setProducts] = useState(content.products);
  const updateProduct = (id, patch) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removeProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const addProduct = () =>
    setProducts((prev) => [
      {
        id: `p${Date.now()}`,
        name: 'New Product',
        category: content.categories[0]?.id || 'chandeliers',
        price: 0,
        image: '',
        description: '',
        featured: true,
      },
      ...prev,
    ]);
  const saveProducts = () => doSave({ products });

  // ---- Categories ----
  const [cats, setCats] = useState(content.categories);
  const updateCat = (id, patch) => setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCat = (id) => setCats((prev) => prev.filter((c) => c.id !== id));
  const addCat = () =>
    setCats((prev) => [...prev, { id: `cat${Date.now()}`, name: 'New Category', icon: 'Lightbulb', image: '' }]);
  const saveCats = () => doSave({ categories: cats });

  // ---- Gallery ----
  const [gallery, setGallery] = useState(content.gallery);
  const updateGal = (i, patch) => setGallery((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const removeGal = (i) => setGallery((prev) => prev.filter((_, idx) => idx !== i));
  const addGal = () => setGallery((prev) => [...prev, { title: 'New Space', image: '' }]);
  const saveGallery = () => doSave({ gallery });

  // ---- FAQs ----
  const [faqs, setFaqs] = useState(content.faqs);
  const updateFaq = (i, patch) => setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const removeFaq = (i) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  const addFaq = () => setFaqs((prev) => [...prev, { q: 'New question', a: 'Answer here.' }]);
  const saveFaqs = () => doSave({ faqs });

  // ---- Enquiries ----
  const [enquiries, setEnquiries] = useState([]);
  const [enqLoading, setEnqLoading] = useState(false);
  const loadEnquiries = useCallback(async () => {
    setEnqLoading(true);
    try {
      const rows = await enquiryApi.list();
      setEnquiries(rows);
    } catch (e) {
      toast({ title: 'Failed to load enquiries', description: e?.message });
    } finally {
      setEnqLoading(false);
    }
  }, [toast]);
  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);
  const removeEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await enquiryApi.remove(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      toast({ title: 'Delete failed', description: e?.message });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-500/5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </span>
            <div>
              <div className="font-serif text-lg leading-tight">Admin Dashboard</div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Sri Rajlaxmi Light House</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border hover:border-amber-500/60 text-sm">
              <Home className="w-4 h-4" /> View Site
            </Link>
            {saving && (
              <span className="hidden sm:inline-flex items-center gap-2 text-xs text-amber-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </span>
            )}
            <Button onClick={logout} className="h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-sm">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="flex flex-wrap gap-2 bg-card/40 border border-border p-1 rounded-full h-auto">
            <TabTrig value="business" icon={<MapPin className="w-4 h-4" />} label="Business" />
            <TabTrig value="hero" icon={<FileText className="w-4 h-4" />} label="Hero" />
            <TabTrig value="about" icon={<Info className="w-4 h-4" />} label="About" />
            <TabTrig value="categories" icon={<LayoutGrid className="w-4 h-4" />} label="Categories" />
            <TabTrig value="products" icon={<Package className="w-4 h-4" />} label="Products" />
            <TabTrig value="gallery" icon={<Images className="w-4 h-4" />} label="Gallery" />
            <TabTrig value="faqs" icon={<HelpCircle className="w-4 h-4" />} label="FAQs" />
            <TabTrig value="enquiries" icon={<Inbox className="w-4 h-4" />} label="Enquiries" />
          </TabsList>

          {/* BUSINESS */}
          <TabsContent value="business" className="mt-8">
            <SectionCard title="Business & Contact Details" onSave={saveBiz}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name" value={biz.name} onChange={(v) => setBiz({ ...biz, name: v })} />
                <Field label="Tagline" value={biz.tagline} onChange={(v) => setBiz({ ...biz, tagline: v })} />
                <Field label="Phone" value={biz.phone} onChange={(v) => setBiz({ ...biz, phone: v })} />
                <Field label="WhatsApp (digits only)" value={biz.whatsapp} onChange={(v) => setBiz({ ...biz, whatsapp: v })} />
                <Field label="Email" value={biz.email} onChange={(v) => setBiz({ ...biz, email: v })} />
                <Field label="Location" value={biz.location} onChange={(v) => setBiz({ ...biz, location: v })} />
                <Field label="Short Address" value={biz.shortAddress} onChange={(v) => setBiz({ ...biz, shortAddress: v })} className="md:col-span-2" />
                <Field label="Full Address" value={biz.address} onChange={(v) => setBiz({ ...biz, address: v })} className="md:col-span-2" />
                <Field label="Maps Search Query" value={biz.mapsQuery} onChange={(v) => setBiz({ ...biz, mapsQuery: v })} className="md:col-span-2" />
                <Field label="Hours (short)" value={biz.hours} onChange={(v) => setBiz({ ...biz, hours: v })} />
                <Field label="Hours (full)" value={biz.hoursFull} onChange={(v) => setBiz({ ...biz, hoursFull: v })} />
              </div>
            </SectionCard>
          </TabsContent>

          {/* HERO */}
          <TabsContent value="hero" className="mt-8">
            <SectionCard title="Hero Section" onSave={saveHero}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Hero Image</label>
                  <div className="mt-2">
                    <ImageUploadField
                      value={hero.image}
                      onChange={(v) => setHero({ ...hero, image: v })}
                      placeholder="Hero image URL or upload"
                    />
                  </div>
                </div>
                <Field label="Title Line 1" value={hero.titleLine1} onChange={(v) => setHero({ ...hero, titleLine1: v })} className="md:col-span-2" />
                <Field label="Title Accent" value={hero.titleAccent} onChange={(v) => setHero({ ...hero, titleAccent: v })} className="md:col-span-2" />
                <FieldArea label="Subtitle" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} className="md:col-span-2" />
                <Field label="Primary CTA" value={hero.ctaPrimary} onChange={(v) => setHero({ ...hero, ctaPrimary: v })} />
                <Field label="Secondary CTA" value={hero.ctaSecondary} onChange={(v) => setHero({ ...hero, ctaSecondary: v })} />
                <Field label="Tertiary CTA" value={hero.ctaTertiary} onChange={(v) => setHero({ ...hero, ctaTertiary: v })} />
              </div>
            </SectionCard>
          </TabsContent>

          {/* ABOUT */}
          <TabsContent value="about" className="mt-8">
            <SectionCard title="About Section" onSave={saveAbout}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Eyebrow" value={about.eyebrow} onChange={(v) => setAbout({ ...about, eyebrow: v })} />
                <div />
                <Field label="Title" value={about.title} onChange={(v) => setAbout({ ...about, title: v })} />
                <Field label="Title Accent" value={about.titleAccent} onChange={(v) => setAbout({ ...about, titleAccent: v })} />
                <FieldArea label="Paragraph 1" value={about.body[0]} onChange={(v) => setAbout({ ...about, body: [v, about.body[1]] })} className="md:col-span-2" />
                <FieldArea label="Paragraph 2" value={about.body[1]} onChange={(v) => setAbout({ ...about, body: [about.body[0], v] })} className="md:col-span-2" />
                <Field label="Chips (comma separated)" value={about.chips.join(', ')} onChange={(v) => setAbout({ ...about, chips: v.split(',').map(s => s.trim()).filter(Boolean) })} className="md:col-span-2" />
              </div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Statistics</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {about.stats.map((s, i) => (
                    <div key={`stat-${s.label || i}`} className="rounded-xl border border-border p-3">
                      <Input type="number" value={s.value} onChange={(e) => {
                        const next = [...about.stats];
                        next[i] = { ...s, value: Number(e.target.value) };
                        setAbout({ ...about, stats: next });
                      }} className="bg-background/60 mb-2" />
                      <Input value={s.label} onChange={(e) => {
                        const next = [...about.stats];
                        next[i] = { ...s, label: e.target.value };
                        setAbout({ ...about, stats: next });
                      }} className="bg-background/60" />
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="mt-8">
            <SectionCard title="Categories" onSave={saveCats} onAdd={addCat}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cats.map((c) => (
                  <div key={c.id} className="rounded-xl border border-border p-4 flex gap-3">
                    <img src={c.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-muted flex-shrink-0" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
                    <div className="flex-1 space-y-2">
                      <Input value={c.name} onChange={(e) => updateCat(c.id, { name: e.target.value })} className="bg-background/60 h-9" placeholder="Name" />
                      <ImageUploadField value={c.image} onChange={(v) => updateCat(c.id, { image: v })} placeholder="Category image URL or upload" />
                      <div className="flex gap-2 items-center">
                        <Input value={c.icon} onChange={(e) => updateCat(c.id, { icon: e.target.value })} className="bg-background/60 h-9 flex-1" placeholder="lucide icon name (e.g. Lightbulb)" />
                        <button onClick={() => removeCat(c.id)} className="w-9 h-9 rounded-full border border-border hover:border-red-500/60 flex items-center justify-center text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products" className="mt-8">
            <SectionCard title="Products" onSave={saveProducts} onAdd={addProduct}>
              <div className="space-y-4">
                            {products.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4 grid md:grid-cols-[120px,1fr,auto] gap-4 items-start">
                <img src={p.image} alt="" className="w-full md:w-[120px] h-[120px] rounded-lg object-cover bg-muted" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
                <div className="grid md:grid-cols-2 gap-3">
                  <Input value={p.name} onChange={(e) => updateProduct(p.id, { name: e.target.value })} className="bg-background/60 h-9" placeholder="Name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" value={p.price} onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })} className="bg-background/60 h-9" placeholder="Sale Price (INR)" />
                    <Input type="number" value={p.mrp || ''} onChange={(e) => updateProduct(p.id, { mrp: Number(e.target.value) })} className="bg-background/60 h-9" placeholder="MRP (optional)" />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Product Photos (up to 3)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[0, 1, 2].map((idx) => (
                        <ImageUploadField
                          key={idx}
                          value={(p.images && p.images[idx]) || ''}
                          onChange={(v) => {
                            const base = p.images && p.images.length ? p.images : [p.image || '', '', ''];
                            const nextImages = [...base];
                            nextImages[idx] = v;
                            updateProduct(p.id, { images: nextImages, image: nextImages[0] || p.image });
                          }}
                          placeholder={`Photo ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Input
                    value={(p.colours || []).join(', ')}
                    onChange={(e) => updateProduct(p.id, { colours: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    className="bg-background/60 h-9 md:col-span-2"
                    placeholder="Colours (comma separated, e.g. Antique Brass, Matte Black)"
                  />
                  <Select value={p.category} onValueChange={(v) => updateProduct(p.id, { category: v })}>
                    <SelectTrigger className="bg-background/60 h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={p.featured ? 'yes' : 'no'} onValueChange={(v) => updateProduct(p.id, { featured: v === 'yes' })}>
                    <SelectTrigger className="bg-background/60 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Featured</SelectItem>
                      <SelectItem value="no">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea value={p.description} onChange={(e) => updateProduct(p.id, { description: e.target.value })} className="bg-background/60 md:col-span-2" rows={2} placeholder="Description" />
                </div>
                <button onClick={() => removeProduct(p.id)} className="w-9 h-9 rounded-full border border-border hover:border-red-500/60 flex items-center justify-center text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
              </div>
            </SectionCard>
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery" className="mt-8">
            <SectionCard title="Gallery" onSave={saveGallery} onAdd={addGal}>
              <div className="grid md:grid-cols-2 gap-4">
                {gallery.map((g, i) => (
                  <div key={`${g.title || 'gallery'}-${i}`} className="rounded-xl border border-border p-4 flex gap-3">
                    <img src={g.image} alt="" className="w-24 h-24 rounded-lg object-cover bg-muted flex-shrink-0" onError={(e) => (e.currentTarget.style.opacity = 0.25)} />
                    <div className="flex-1 space-y-2">
                      <Input value={g.title} onChange={(e) => updateGal(i, { title: e.target.value })} className="bg-background/60 h-9" placeholder="Title" />
                      <ImageUploadField value={g.image} onChange={(v) => updateGal(i, { image: v })} placeholder="Gallery image URL or upload" />
                      <button onClick={() => removeGal(i)} className="text-xs text-muted-foreground hover:text-red-400 inline-flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faqs" className="mt-8">
            <SectionCard title="FAQs" onSave={saveFaqs} onAdd={addFaq}>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={`${f.q || 'faq'}-${i}`} className="rounded-xl border border-border p-4 space-y-2">
                    <Input value={f.q} onChange={(e) => updateFaq(i, { q: e.target.value })} className="bg-background/60" placeholder="Question" />
                    <Textarea value={f.a} onChange={(e) => updateFaq(i, { a: e.target.value })} className="bg-background/60" rows={2} placeholder="Answer" />
                    <button onClick={() => removeFaq(i)} className="text-xs text-muted-foreground hover:text-red-400 inline-flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          {/* Enquiries */}
          <TabsContent value="enquiries" className="mt-8">
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl">Customer Enquiries</h2>
                <Button variant="outline" onClick={loadEnquiries} className="h-9 rounded-full text-sm">
                  {enqLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Refresh
                </Button>
              </div>
              {enquiries.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  {enqLoading ? 'Loading…' : 'No enquiries yet. Once customers submit the contact form they will appear here.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((e) => (
                    <div key={e.id} className="rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-serif text-lg">{e.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-3">
                            {e.email && <span>{e.email}</span>}
                            {e.phone && <span>{e.phone}</span>}
                            <span>{new Date(e.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <button onClick={() => removeEnquiry(e.id)} className="w-9 h-9 rounded-full border border-border hover:border-red-500/60 flex items-center justify-center text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-foreground/90 whitespace-pre-line">{e.message}</p>
                      {e.phone && (
                        <div className="mt-3 flex gap-2">
                          <a href={`tel:${e.phone}`} className="text-xs text-amber-400 hover:underline">Call →</a>
                          <a href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">WhatsApp →</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TabTrig({ value, icon, label }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-full px-4 py-2 gap-2 text-sm"
    >
      {icon}
      <span>{label}</span>
    </TabsTrigger>
  );
}

function SectionCard({ title, children, onSave, onAdd }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="outline" onClick={onAdd} className="h-9 rounded-full text-sm">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
          <Button onClick={onSave} className="h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-sm">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 bg-background/60 h-10" />
    </div>
  );
}

function FieldArea({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 bg-background/60" rows={3} />
    </div>
  );
}
