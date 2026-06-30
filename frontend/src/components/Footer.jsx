import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const linkStyle = { color: '#94A3B8', display: 'block', fontSize: '12px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' };
  const hover = { onMouseEnter: e => e.target.style.color='#60A5FA', onMouseLeave: e => e.target.style.color='#94A3B8' };

  return (
    <footer style={{ background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 32px;
          margin-bottom: 48px;
        }
        @media(max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px 16px !important;
          }
          .footer-brand {
            grid-column: span 2 !important;
            margin-bottom: 8px;
          }
        }
        @media(max-width: 360px) {
          .footer-grid { gap: 20px 12px !important; }
        }
      `}</style>

      <div style={{ height: '2px', background: 'linear-gradient(90deg,#1565C0,#0288D1,#1565C0)' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 20px 32px' }}>
        <div className="footer-grid">

          {/* Brand — spans full width on mobile */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '20px', color: '#fff' }}>
                True<span style={{ color: '#60A5FA' }}>Creds</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '10px', maxWidth: '320px' }}>
              India's trusted loan comparison platform. We compare, you choose — always for free.
            </p>
            <p style={{ fontSize: '11px', color: '#4B5563', lineHeight: 1.6 }}>
              Not a lender. We compare RBI-registered NBFCs & banks.
            </p>
          </div>

          {/* Loan Types */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Loan Types</div>
            {[['personal','Personal Loans'],['student','Student Loans'],['business','Business Loans'],['aadhaar','Aadhaar Loans'],['no-cibil','No CIBIL Loans'],['instant','Instant Loans']].map(([s, label]) => (
              <Link key={s} to={`/loans/${s}`} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

          {/* Tools */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Tools</div>
            {[['/compare','Compare Lenders'],['/calculator','EMI Calculator'],['/apply','Check Eligibility'],['/blog','Financial Tips']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', margin: '16px 0 10px' }}>Cities</div>
            {[['delhi','Delhi NCR'],['mumbai','Mumbai'],['noida','Noida'],['jaipur','Jaipur']].map(([slug, name]) => (
              <Link key={slug} to={`/loans-in/${slug}`} style={linkStyle} {...hover}>Loans in {name}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Company</div>
            {[['/about','About Us'],['/contact','Contact Us'],['/editorial-policy','Editorial Policy'],['/how-we-make-money','How We Make Money'],['/corrections','Corrections']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Legal</div>
            {[['/legal/privacy','Privacy Policy'],['/terms','Terms of Service'],['/disclaimer','Disclaimer'],['/legal/disclaimer','Legal Disclaimer']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', color: '#4B5563' }}>© 2026 TrueCreds. All rights reserved.</p>
          <p style={{ fontSize: '11px', color: '#374151', maxWidth: '480px', textAlign: 'right', lineHeight: 1.6 }}>
            Affiliate disclosure: We earn a referral fee when you apply via our links. Rankings are independent and not influenced by commercial relationships.
          </p>
        </div>
      </div>
    </footer>
  );
}
