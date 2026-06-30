import PageTransition from '../components/PageTransition';
import React from 'react';

const RED_FLAGS = [
  { icon: '🚫', title: 'No RBI Registration', desc: 'Legitimate lenders are always registered NBFCs or banks. Check RBI\'s official list before trusting any app.' },
  { icon: '💸', title: 'Upfront "Processing Fee" Before Disbursal', desc: 'Genuine lenders deduct fees from the loan amount, never ask you to pay separately before money is disbursed.' },
  { icon: '📱', title: 'No Physical Address or Customer Support', desc: 'A legitimate lender has a verifiable office address, working customer care number, and email support.' },
  { icon: '⚡', title: 'Guaranteed Approval Regardless of CIBIL', desc: 'No legitimate lender guarantees approval without checking your credit profile. This is a major scam signal.' },
  { icon: '🔓', title: 'Excessive App Permissions', desc: 'Be wary of apps demanding access to your contacts, photos, or call logs — often used for harassment during recovery.' },
  { icon: '😠', title: 'Harassment or Threats for Repayment', desc: 'RBI guidelines prohibit lenders from threatening, harassing or contacting your personal contacts for recovery.' },
  { icon: '📝', title: 'No Written Loan Agreement', desc: 'Always insist on a clear, written loan agreement stating interest rate, fees, and tenure before accepting funds.' },
  { icon: '💰', title: 'Interest Rates Above 36% Annually', desc: 'RBI caps interest rates for digital lending. Rates significantly above market average are a red flag.' },
];

export default function RedFlags() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#DC2626,#EA580C)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ SAFETY GUIDE</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>🚩 Red Flags: Avoid Loan App Scams</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>Illegal lending apps are a serious risk in India. Here's how to spot and avoid them before you get trapped.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '16px', padding: '20px', marginBottom: '28px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <p style={{ fontSize: '14px', color: '#991B1B', lineHeight: 1.7, margin: 0 }}>
              The RBI has flagged hundreds of illegal digital lending apps operating in India. Always verify a lender is RBI-registered before sharing any personal or financial information.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
            {RED_FLAGS.map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(220,38,38,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '6px' }}>{f.title}</h3>
                  <p style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '18px', color: '#14532D', marginBottom: '14px' }}>✅ How TrueCreds Protects You</h2>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {['Only RBI-registered NBFCs and banks listed', 'All lenders manually verified before listing', 'Transparent rates with no hidden charges shown', 'We report and remove any flagged lender immediately'].map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#166534', marginBottom: '8px', lineHeight: 1.6 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
