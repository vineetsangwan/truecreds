import React from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyCta from './StickyCta';

export default function Layout({ children }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen relative" style={{ background: '#F0F7FF' }}>
      <div className="relative z-10">
        <Navbar />
        <main>
          <AnimatePresence mode="wait" key={loc.pathname}>
            {children}
          </AnimatePresence>
        </main>
        <Footer />
        <StickyCta />
      </div>
      <Toaster theme="light" position="top-right" />
    </div>
  );
}
