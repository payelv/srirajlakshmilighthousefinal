import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useContent } from '../context/ContentContext';
import { enquiryApi } from '../api';

export default function Contact() {
  const { content } = useContent();
  const { business } = content;
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast({ title: 'Please fill your name and message.' });
      return;
    }
    setLoading(true);
    try {
      await enquiryApi.create(form);
    } catch (err) {
      // Non-blocking: still open WhatsApp fallback below
      console.warn('enquiry save failed', err?.message);
    }
    const text = encodeURIComponent(
      `Enquiry from ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0A%0A${form.message}`
    );
    window.open(`https://wa.me/${business.whatsapp}?text=${text}`, '_blank');
    toast({ title: 'Enquiry sent!', description: 'We have received your message and opened WhatsApp for a quick reply.' });
    setForm({ name: '', email: '', phone: '', message: '' });
    setLoading(false);
  };

  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs tracking-[0.35em] uppercase text-amber-400">Get in Touch</span>
          <h2 className="mt-4 font-serif text-4xl lg:text-6xl">
            Visit our <span className="gold-gradient-text italic">showroom</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Experience the collection in person — or reach us anytime.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info + Map */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-muted-foreground">Address</div>
                  <div className="font-serif text-lg mt-1">{business.address}</div>
                  <a href={mapsLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-amber-400 text-sm hover:underline">
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-8">
                <a
                  href={`tel:${business.phone}`}
                  className="rounded-xl border border-border hover:border-amber-500/60 p-4 flex flex-col gap-1 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-amber-400"><Phone className="w-4 h-4" /><span className="text-xs uppercase tracking-widest">Call</span></div>
                  <span className="text-sm text-foreground group-hover:text-amber-300">{business.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 p-4 flex flex-col gap-1 transition-colors"
                >
                  <div className="flex items-center gap-2 text-emerald-400"><MessageCircle className="w-4 h-4" /><span className="text-xs uppercase tracking-widest">WhatsApp</span></div>
                  <span className="text-sm text-foreground">{business.phone}</span>
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="rounded-xl border border-border hover:border-amber-500/60 p-4 flex flex-col gap-1 transition-colors"
                >
                  <div className="flex items-center gap-2 text-amber-400"><Mail className="w-4 h-4" /><span className="text-xs uppercase tracking-widest">Email</span></div>
                  <span className="text-sm text-foreground break-all">{business.email}</span>
                </a>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{business.hoursFull}</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border h-[380px]">
              <iframe
                title="Sri Rajlaxmi Light House Map"
                src={mapsSrc}
                className="w-full h-full grayscale-[35%] contrast-110"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="lg:col-span-2 rounded-2xl border border-border bg-card/50 backdrop-blur p-6 lg:p-8 space-y-4 h-fit"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <Input value={form.name} onChange={handle('name')} placeholder="Your name" className="mt-2 bg-background/60 border-border h-11" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <Input type="email" value={form.email} onChange={handle('email')} placeholder="you@example.com" className="mt-2 bg-background/60 border-border h-11" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
              <Input value={form.phone} onChange={handle('phone')} placeholder="+91 …" className="mt-2 bg-background/60 border-border h-11" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <Textarea value={form.message} onChange={handle('message')} rows={5} placeholder="Tell us about your project or product interest" className="mt-2 bg-background/60 border-border resize-none" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send Enquiry</>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">We reply within 1 business hour.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
