import PageTransition from '../components/PageTransition';
import React from 'react';

export default function TermsOfService() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ LEGAL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Terms of Service</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Last updated: June 2026</p>
        </div>
      </div>
      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          {[
            { title: '1. Acceptance of Terms', content: 'By using TrueCreds (truecreds.in), you agree to these Terms of Service. If you do not agree, please do not use our platform.' },
            { title: '2. Description of Service', content: 'TrueCreds provides a free loan comparison service. We aggregate information from RBI-registered lenders to help you compare loan products. We are not a lender and do not process loan applications directly.' },
            { title: '3. User Eligibility', content: 'You must be at least 18 years old and a resident of India to use TrueCreds. By using our service, you confirm you meet these requirements.' },
            { title: '4. Use of Information', content: 'Information you provide (name, income, CIBIL score) is used solely to help you find matching loan products. We do not sell your personal data to third parties. See our Privacy Policy for full details.' },
            { title: '5. No Warranty', content: 'TrueCreds provides information "as is" without warranty of any kind. We do not guarantee the accuracy, completeness or timeliness of lender information. Interest rates and terms may change without notice.' },
            { title: '6. Limitation of Liability', content: 'TrueCreds shall not be liable for any loss or damage arising from your use of our platform, your reliance on lender information displayed, or decisions made based on our comparisons.' },
            { title: '7. Intellectual Property', content: 'All content on TrueCreds — including rankings, articles, tools and design — is owned by TrueCreds. You may not reproduce or distribute our content without written permission.' },
            { title: '8. Changes to Terms', content: 'We may update these Terms at any time. Continued use of TrueCreds after changes constitutes acceptance of the new Terms.' },
            { title: '9. Governing Law', content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.' },
            { title: '10. Contact', content: 'For questions about these Terms: support@truecreds.in' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px 28px', border: '1px solid rgba(21,101,192,0.1)', marginBottom: '12px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '8px' }}>{s.title}</h2>
              <p style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.8, margin: 0 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
