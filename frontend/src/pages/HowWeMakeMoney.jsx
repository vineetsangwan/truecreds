import PageTransition from '../components/PageTransition';
import React from 'react';

export default function HowWeMakeMoney() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ TRANSPARENCY</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>How We Make Money</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>We believe in full transparency about our business model.</p>
        </div>
      </div>
      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          {/* Key callout */}
          <div style={{ background: '#EFF6FF', border: '1.5px solid rgba(21,101,192,0.25)', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '6px' }}>TrueCreds is completely free for borrowers.</div>
              <div style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.7 }}>You never pay us anything. We earn from lenders, not from you — and this never affects what we show you.</div>
            </div>
          </div>

          {[
            { icon: '🤝', title: 'Referral Fees', content: 'When you click "Apply Now" and submit an application with a lender, TrueCreds receives a referral fee from that lender. This fee is paid by the lender — not added to your loan cost or interest rate.' },
            { icon: '📊', title: 'Does This Affect Our Rankings?', content: 'No. Our lender rankings are determined by our algorithm (rate, speed, CIBIL flexibility, ratings). A lender cannot pay to rank higher. We have turned down commercial partnerships with lenders that did not meet our quality standards.' },
            { icon: '🔍', title: 'What We Do Not Do', content: 'We do not sell your personal data. We do not charge borrowers any fee. We do not accept payment for editorial content or reviews. We do not show you a lender that is not RBI-registered.' },
            { icon: '📋', title: 'Affiliate Disclosures', content: 'Pages or articles that contain affiliate links or referral partnerships are marked with "Partnered" or contain a disclosure at the top. Our editorial content is kept separate from commercial content.' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(21,101,192,0.1)', marginBottom: '14px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{s.icon}</span>
              <div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '8px' }}>{s.title}</h2>
                <p style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.8, margin: 0 }}>{s.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
