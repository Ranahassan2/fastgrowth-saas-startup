import React, { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import StoreDesigner from './components/StoreDesigner';

import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Background particles
    const pc = document.getElementById('particles');
    if (pc) {
      pc.innerHTML = '';
      const cols = ['rgba(216,75,26,.4)', 'rgba(25,25,25,.7)', 'rgba(232,160,32,.3)'];
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random() * 5 + 2;
        p.style.cssText = `width:${s}px;height:${s}px;background:${cols[~~(Math.random() * 3)]};right:${Math.random() * 100}%;animation-duration:${Math.random() * 15 + 10}s;animation-delay:-${Math.random() * 20}s;`;
        pc.appendChild(p);
      }
    }
  }, []);

  const [isDesignerOpen, setIsDesignerOpen] = useState(false);

  return (
    <>
      <div className="bg-grid"></div>
      <div className="bg-particles" id="particles"></div>
      <div className="bg-radial"></div>

      <Header />
      {/* Passing setIsDesignerOpen to Hero so a button there can open it if needed, 
          or we can just add a floating button or use an existing button */}
      <Hero onOpenDesigner={() => setIsDesignerOpen(true)} />
      <Features />
      
      {/* Modal has been completely removed based on your request */}

      <ScrollToTop />
      <Footer />
    </>
  );
}

export default App;
