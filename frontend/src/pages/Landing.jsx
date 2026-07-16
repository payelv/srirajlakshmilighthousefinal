import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Categories from '../components/Categories';
import Products from '../components/Products';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function Landing() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Categories />
        <Products />
        <WhyChooseUs />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
