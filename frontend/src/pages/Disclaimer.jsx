import PageTransition from '../components/PageTransition';
import React from 'react';

export default function Disclaimer() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ LEGAL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Disclaimer</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Last updated: June 2026</p>
        </div>
      </div>
      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <p style={{ fontSize: '14px', color: '#92400E', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
              TrueCreds is a loan comparison and aggregator platform. We are NOT a lender, bank, NBFC or financial institution. We do not provide, disburse, approve or guarantee any loan.
            </p>
          </div>
          {[
            { title: '1. Nature of Service', content: 'TrueCreds (truecreds.in) is an independent loan comparison platform. We aggregate and display loan product information from RBI-registered banks and NBFCs to help users compare options. We are not a lender and do not participate in the loan disbursement process.' },
            { title: '2. Information Accuracy', content: 'We strive to keep all rate, fee and eligibility information accurate and up to date. However, loan terms, interest rates, and eligibility criteria are set by lenders and may change without notice. Always verify the final terms directly with the lender before applying.' },
            { title: '3. No Guarantee of Approval', content: 'TrueCreds does not guarantee that you will be approved for any loan. Loan approval depends entirely on the lender\'s assessment of your credit profile, income, and eligibility. We make no representations about approval likelihood.' },
            { title: '4. Not Financial Advice', content: 'Nothing on TrueCreds constitutes financial, legal or investment advice. Our comparisons are for informational purposes only. Please consult a qualified financial advisor before making borrowing decisions.' },
            { title: '5. Third-Party Links', content: 'When you click "Apply Now", you will be directed to the lender\'s own website or app. TrueCreds is not responsible for the content, terms, or practices of any third-party lender website.' },
            { title: '6. RBI Compliance', content: 'TrueCreds operates as a loan aggregator and does not require RBI registration for its comparison activities. All lenders listed on our platform are RBI-registered entities.' },
            { title: '7. Contact', content: 'For questions about this disclaimer: support@truecreds.in' },
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
