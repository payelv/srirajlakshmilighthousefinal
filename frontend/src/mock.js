// Mock data for Sri Rajlaxmi Light House website.
// All fields here are meant to be editable via the /admin dashboard.
// Persisted to localStorage so edits survive refresh.

export const DEFAULT_CONTENT = {
  business: {
    name: 'Sri Rajlaxmi',
    tagline: 'LIGHT HOUSE',
    location: 'Kochi, Kerala',
    phone: '+918870524744',
    whatsapp: '918870524744',
    email: 'luxelane4744@okicici',
    address: 'A2, 67/11610, Jew St, Padma Junction, Kacheripady, Kochi',
    shortAddress: 'Jew Street, Kochi, Kerala',
    mapsQuery: 'A2, 67/11610, Jew Street, Padma Junction, Kacheripady, Kochi',
    hours: 'Mon-Sat: 10am - 8pm',
    hoursFull: 'Mon-Sat, 9 AM - 9 PM · Sun, 9 AM - 3 PM',
  },
  hero: {
    eyebrow: 'Est. Kochi, Kerala',
    titleLine1: 'Illuminate Every Space with',
    titleAccent: 'Timeless Elegance',
    subtitle:
      'Premium decorative, residential, commercial, and architectural lighting solutions — curated for homes, hotels, and finer spaces across Kerala.',
    image: 'https://images.unsplash.com/photo-1531762948975-73032b7b61f4?auto=format&fit=crop&w=1920&q=80',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Visit Showroom',
    ctaTertiary: 'Contact Us',
  },
  about: {
    eyebrow: 'About Us',
    title: 'Where craftsmanship meets',
    titleAccent: 'radiant beauty',
    body: [
      "Sri Rajlaxmi Light House has illuminated Kerala's finest homes and commercial spaces for over two decades. As trusted wholesale dealers in premium LED lights and fancy decorative fittings, we blend timeless design with modern innovation.",
      'From heritage chandeliers to smart architectural systems, every piece in our Jew Street showroom is hand-picked for homeowners, interior designers, architects, hotels, and builders who refuse to compromise on quality.',
    ],
    chips: ['Trusted Brands', 'Wholesale Pricing', 'Expert Consultation'],
    stats: [
      { value: 20, suffix: '+', label: 'Years of Experience' },
      { value: 3000, suffix: '+', label: 'Happy Customers' },
      { value: 1200, suffix: '+', label: 'Products Available' },
      { value: 500, suffix: '+', label: 'Completed Projects' },
    ],
  },
  categories: [
    { id: 'chandeliers', name: 'Chandeliers', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1532951842694-e22cbcf22ae0?auto=format&fit=crop&w=800&q=80' },
    { id: 'pendant', name: 'Pendant Lights', icon: 'Lightbulb', image: 'https://images.unsplash.com/photo-1515948725-edac7b5bb0fc?auto=format&fit=crop&w=800&q=80' },
    { id: 'ceiling', name: 'Ceiling Lights', icon: 'CircleDot', image: 'https://images.pexels.com/photos/10974468/pexels-photo-10974468.jpeg?auto=compress&w=800' },
    { id: 'wall', name: 'Wall Lights', icon: 'PanelTop', image: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=800&q=80' },
    { id: 'led', name: 'LED Lights', icon: 'Zap', image: 'https://images.unsplash.com/photo-1561794919-75618574e915?auto=format&fit=crop&w=800&q=80' },
    { id: 'spot', name: 'Spot Lights', icon: 'Aperture', image: 'https://images.unsplash.com/photo-1471877325906-aee7c2240b5f?auto=format&fit=crop&w=800&q=80' },
    { id: 'outdoor', name: 'Outdoor Lighting', icon: 'Sun', image: 'https://images.pexels.com/photos/15531960/pexels-photo-15531960.jpeg?auto=compress&w=800' },
    { id: 'garden', name: 'Garden Lights', icon: 'Trees', image: 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&w=800&q=80' },
    { id: 'decorative', name: 'Decorative Lighting', icon: 'Gem', image: 'https://images.unsplash.com/photo-1475783006851-1d68dd683eff?auto=format&fit=crop&w=800&q=80' },
    { id: 'commercial', name: 'Commercial Lighting', icon: 'Building2', image: 'https://images.pexels.com/photos/31071253/pexels-photo-31071253.jpeg?auto=compress&w=800' },
    { id: 'smart', name: 'Smart Lighting', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1605419589330-0b6dede4c265?auto=format&fit=crop&w=800&q=80' },
    { id: 'architectural', name: 'Architectural Lighting', icon: 'LayoutTemplate', image: 'https://images.unsplash.com/photo-1764284025780-640c4c88d8c2?auto=format&fit=crop&w=800&q=80' },
  ],
  products: [
    {
      id: 'p1',
      name: 'Aurora Crystal Chandelier',
      category: 'chandeliers',
      price: 42500,
      mrp: 49900,
      colours: ['Antique Gold', 'Chrome', 'Black Nickel'],
      image: 'https://images.pexels.com/photos/12024171/pexels-photo-12024171.jpeg?auto=compress&w=800',
      images: [
        'https://images.pexels.com/photos/12024171/pexels-photo-12024171.jpeg?auto=compress&w=800',
        'https://images.unsplash.com/photo-1543198126-b48993e9ec24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?auto=format&fit=crop&w=800&q=80',
      ],
      description: '18-arm hand-cut crystal chandelier with warm-white LED candles. Ideal for foyers and grand living rooms.',
      featured: true,
    },
    {
      id: 'p2',
      name: 'Milano Brass Pendant',
      category: 'pendant',
      price: 8900,
      mrp: 10500,
      colours: ['Antique Brass', 'Matte Black'],
      image: 'https://images.unsplash.com/photo-1515948725-edac7b5bb0fc?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1515948725-edac7b5bb0fc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Antique brass pendant with amber glass shade — perfect over dining tables and islands.',
      featured: true,
    },
    {
      id: 'p3',
      name: 'Halo LED Panel 24W',
      category: 'led',
      price: 1450,
      mrp: 1800,
      colours: ['White', 'Warm White'],
      image: 'https://images.unsplash.com/photo-1561794919-75618574e915?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1561794919-75618574e915?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517339357107-c67c1d2e6ee1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Ultra-slim recessed LED panel with 3-CCT switch and flicker-free driver.',
      featured: true,
    },
    {
      id: 'p4',
      name: 'Onyx Wall Sconce Pair',
      category: 'wall',
      price: 3600,
      mrp: 4400,
      colours: ['Black & Gold', 'Bronze'],
      image: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
        'https://images.pexels.com/photos/15531960/pexels-photo-15531960.jpeg?auto=compress&w=800',
      ],
      description: 'Handmade black-and-gold sconces in a matched pair with dimmable warm LED.',
      featured: true,
    },
    {
      id: 'p5',
      name: 'Garden Bollard Copper',
      category: 'garden',
      price: 4900,
      mrp: 5900,
      colours: ['Copper', 'Matte Black'],
      image: 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&w=800&q=80',
        'https://images.pexels.com/photos/15531960/pexels-photo-15531960.jpeg?auto=compress&w=800',
        'https://images.unsplash.com/photo-1605776193318-38b0aa11c7f4?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'IP65 weather-sealed bollard in aged copper finish. Ideal for driveways and pathways.',
      featured: true,
    },
    {
      id: 'p6',
      name: 'Nova Smart Ceiling',
      category: 'smart',
      price: 12800,
      mrp: 15500,
      colours: ['White', 'Black'],
      image: 'https://images.unsplash.com/photo-1605419589330-0b6dede4c265?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1605419589330-0b6dede4c265?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517339357107-c67c1d2e6ee1?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'App & voice-controlled RGBW smart ceiling with 16 million colors and scenes.',
      featured: true,
    },
    {
      id: 'p7',
      name: 'Beam Track Spot 3-head',
      category: 'spot',
      price: 5400,
      mrp: 6500,
      colours: ['Black', 'White'],
      image: 'https://images.unsplash.com/photo-1471877325906-aee7c2240b5f?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1471877325906-aee7c2240b5f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517339357107-c67c1d2e6ee1?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Rotatable 3-head track spot with 12° / 24° beam options for gallery-style accent lighting.',
      featured: false,
    },
    {
      id: 'p8',
      name: 'Terrace Floodlight 100W',
      category: 'outdoor',
      price: 6200,
      mrp: 7400,
      colours: ['Black', 'Grey'],
      image: 'https://images.pexels.com/photos/15531960/pexels-photo-15531960.jpeg?auto=compress&w=800',
      images: [
        'https://images.pexels.com/photos/15531960/pexels-photo-15531960.jpeg?auto=compress&w=800',
        'https://images.unsplash.com/photo-1605776193318-38b0aa11c7f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'High-lumen outdoor floodlight with anti-glare lens and IP66 housing.',
      featured: false,
    },
  ],
  whyUs: [
    { icon: 'BadgeCheck', title: 'Premium Quality', text: 'Every fixture curated for lasting brilliance.' },
    { icon: 'LayoutGrid', title: 'Wide Product Range', text: '12+ categories, 1200+ products in stock.' },
    { icon: 'ShieldCheck', title: 'Trusted Brands', text: 'Only established, reliable manufacturers.' },
    { icon: 'Compass', title: 'Expert Guidance', text: '20+ years of lighting expertise.' },
    { icon: 'Zap', title: 'Energy Efficient', text: 'LED-first, environment-conscious range.' },
    { icon: 'IndianRupee', title: 'Competitive Pricing', text: 'Direct wholesale rates for every buyer.' },
    { icon: 'Lightbulb', title: 'Lighting Consultation', text: 'Personalized design plans for your space.' },
    { icon: 'Headphones', title: 'After Sales Support', text: 'We stand behind every fixture we sell.' },
  ],
  gallery: [
    { title: 'Living Rooms', image: 'https://images.pexels.com/photos/31737858/pexels-photo-31737858.jpeg?auto=compress&w=1200' },
    { title: 'Luxury Chandeliers', image: 'https://images.pexels.com/photos/12024171/pexels-photo-12024171.jpeg?auto=compress&w=1200' },
    { title: 'Restaurants', image: 'https://images.pexels.com/photos/18177440/pexels-photo-18177440.jpeg?auto=compress&w=1200' },
    { title: 'Bedrooms', image: 'https://images.pexels.com/photos/20653886/pexels-photo-20653886.jpeg?auto=compress&w=1200' },
    { title: 'Villas', image: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Dining Rooms', image: 'https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Outdoor Lighting', image: 'https://images.unsplash.com/photo-1582016309733-5865c2f9f21f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Hotels', image: 'https://images.pexels.com/photos/34496713/pexels-photo-34496713.jpeg?auto=compress&w=1200' },
    { title: 'Modern Interiors', image: 'https://images.pexels.com/photos/30699851/pexels-photo-30699851.jpeg?auto=compress&w=1200' },
  ],
  testimonials: [
    { name: 'Ravi Menon', role: 'Homeowner, Kochi', quote: 'The team helped us pick the perfect chandelier for our living room — quality and service were outstanding.', video: '' },
    { name: 'Anjali Nair', role: 'Interior Designer', quote: 'As an interior designer, I rely on their range and expertise for every project. Never disappoints.', video: '' },
    { name: 'Thomas Varghese', role: 'Hotel Owner', quote: 'Fitted out our entire hotel with their commercial lighting — on time, on budget, beautifully done.', video: '' },
    { name: 'Fathima Beevi', role: 'Homeowner', quote: 'From the first consultation to installation, everything felt personal. Our home has never looked warmer.', video: '' },
  ],
  faqs: [
    { q: 'How do I choose the right lighting for my space?', a: 'Consider room purpose, ceiling height, ambient vs task needs, and existing decor. Our team offers free in-showroom consultation to guide selection based on layout, style preference, and budget.' },
    { q: 'Do you offer lighting consultation?', a: 'Yes — we provide expert lighting design consultation for homes, offices, hotels and commercial projects. Bring your floor plan or photos and we\u2019ll craft a plan.' },
    { q: 'Can I visit the showroom?', a: 'Absolutely. Visit us at A2, 67/11610, Jew St, Padma Junction, Kacheripady, Kochi — open Monday to Saturday, 9 AM to 9 PM, and Sunday, 9 AM to 3 PM.' },
    { q: 'Do you supply products for commercial projects?', a: 'Yes, we serve architects, interior designers, builders, hotels, restaurants and offices with wholesale pricing and bulk quantities.' },
    { q: 'Do you provide installation guidance?', a: 'We provide detailed installation guidance, wiring recommendations, and can connect you with trusted local electricians for professional installation.' },
    { q: 'Do you accept bulk orders?', a: 'Yes — bulk orders receive preferential wholesale pricing. Contact us with your requirements and we\u2019ll prepare a competitive quotation.' },
  ],
};

const STORAGE_KEY = 'srl-content-v1';

export function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw);
    // shallow merge to allow additions of new default fields
    return { ...DEFAULT_CONTENT, ...parsed };
  } catch (err) {
    console.warn('[mock] Failed to read cached content:', err);
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
}

// NOTE: Admin credentials are managed on the backend only (see backend/.env).
// This module intentionally contains no auth secrets.
