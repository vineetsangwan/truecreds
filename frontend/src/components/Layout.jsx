import React from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyCta from './StickyCta';

function TrustDisclaimerSection() {
  return (
    <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.07)' }}>

      {/* Two cards row */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>

          {/* Trust & Safety — green */}
          <div style={{ background: '#F0FBF4', border: '1px solid #B7EBC8', borderRadius: '14px', padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#16a34a" opacity="0.15"/>
                <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                <polyline points="9,12 11,14 15,10" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#14532d', marginBottom: '6px' }}>Trust & Safety</div>
              <div style={{ fontSize: '13px', color: '#166534', lineHeight: 1.6 }}>
                RBI-regulated lenders only · Verified rates and charges · No platform fees · 256-bit SSL encryption · 1,20,000+ verified users · 4.6/5 star rating · Independent comparisons (TrueCreds is not owned by any lender)
              </div>
            </div>
          </div>

          {/* Disclaimer — yellow */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '14px', padding: '20px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#92400E', marginBottom: '6px' }}>Disclaimer</div>
            <div style={{ fontSize: '13px', color: '#B45309', lineHeight: 1.6 }}>
              Loan approval depends on your credit profile, income verification, and the lender's eligibility criteria. Interest rates are subject to change based on market conditions and RBI guidelines. This page is for informational purposes only and does not guarantee loan approval. TrueCreds is a comparison platform and is not a lender.
            </div>
          </div>

        </div>
      </div>

      {/* Full width yellow disclaimer bar */}
      <div style={{ background: '#FFFBEB', borderTop: '1px solid #FCD34D', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
          <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.7, margin: 0 }}>
            <strong>Disclaimer:</strong> TrueCreds is a loan comparison platform and does not directly lend, disburse, or provide any financial products. We aggregate and display loan offers from RBI-registered banks and NBFCs to help you make an informed decision. All loan applications are processed directly by the respective lender. Interest rates, charges, eligibility, and terms shown are indicative and subject to the lender's final assessment. Please read the lender's terms and conditions carefully before applying.
          </p>
        </div>
      </div>

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
        <TrustDisclaimerSection />
        <Footer />
        <StickyCta />
      </div>
      <Toaster theme="light" position="top-right" />
    </div>
  );
}
