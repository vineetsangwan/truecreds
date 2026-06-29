import PageTransition from '../components/PageTransition';
import React from 'react';

export default function EditorialPolicy() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ EDITORIAL POLICY</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Editorial Policy</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Last updated: June 2026</p>
        </div>
      </div>
      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          {[
            { title: '1. Independence', content: 'TrueCreds editorial content is produced independently of our commercial relationships. Lenders cannot pay to influence rankings, reviews or editorial content. Our comparison rankings are determined solely by our algorithmic scoring model.' },
            { title: '2. Accuracy', content: 'We verify all interest rates, fees, and product terms directly with lenders or from their official websites before publishing. All data is reviewed at least once a month. If you find an error, email us at support@truecreds.in and we will correct it within 48 hours.' },
            { title: '3. How We Rank Lenders', content: 'Our ranking algorithm weighs four factors: interest rate (40%), approval speed (25%), CIBIL flexibility (20%), and verified user ratings (15%). No lender can pay to improve their ranking.' },
            { title: '4. Advertiser Relationships', content: 'TrueCreds earns referral fees when users apply to lenders via our platform. This commercial relationship never influences our editorial rankings, rate data, or written content. We clearly disclose when content is sponsored.' },
            { title: '5. Content Review Process', content: 'Every article on TrueCreds is written by our in-house finance team, fact-checked against RBI guidelines, and reviewed for accuracy before publication. We do not publish content from external contributors without editorial review.' },
            { title: '6. Corrections Policy', content: 'We take accuracy seriously. If we publish incorrect information, we correct it promptly and note the correction at the bottom of the article. We do not silently delete or alter content.' },
            { title: '7. Contact the Editorial Team', content: 'For editorial queries, corrections or concerns: support@truecreds.in' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid rgba(21,101,192,0.1)', marginBottom: '16px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#0A1628', marginBottom: '10px' }}>{s.title}</h2>
              <p style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.8, margin: 0 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
