import React from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyCta from './StickyCta';

function DisclaimerBar() {
  return (
    <div style={{
      background: '#0A1628',
      borderTop: '1px solid rgba(21,101,192,0.3)',
      padding: '10px 16px',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.6,
        margin: 0,
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>⚠️ Disclaimer:</span>{' '}
        TrueCreds is a <strong style={{ color: 'rgba(255,255,255,0.75)' }}>loan comparison and aggregator platform</strong> only.
        We do <strong style={{ color: 'rgba(255,255,255,0.75)' }}>not</strong> provide, disburse, or guarantee any loans.
        All loan products are offered by RBI-registered NBFCs and banks.
        Approval, interest rates, and loan amounts are at the sole discretion of the lender.
        TrueCreds earns a referral fee from lenders — this does not affect our rankings or your loan terms.
      </p>
    </div>
  );
}

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
        <DisclaimerBar />
        <StickyCta />
      </div>
      <Toaster theme="light" position="top-right" />
    </div>
  );
}
