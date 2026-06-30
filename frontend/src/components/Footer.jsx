import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const linkStyle = { color: '#94A3B8', display: 'block', fontSize: '12px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' };
  const hover = { onMouseEnter: e => e.target.style.color='#60A5FA', onMouseLeave: e => e.target.style.color='#94A3B8' };

  return (
    <footer style={{ background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
          gap: 28px;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        @media(max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 24px; }
          .footer-brand { grid-column: span 3 !important; margin-bottom: 8px; }
        }
        @media(max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px 16px; }
          .footer-brand { grid-column: span 2 !important; }
        }
      `}</style>

      {/* Background illustration — subtle coin/grid pattern */}
      <svg viewBox="0 0 400 300" style={{ position: 'absolute', right: '-40px', top: '-20px', width: '320px', height: '240px', opacity: 0.04, pointerEvents: 'none' }}>
        <circle cx="280" cy="80" r="70" fill="#60A5FA" />
        <circle cx="340" cy="180" r="50" fill="#60A5FA" />
        <circle cx="200" cy="220" r="40" fill="#60A5FA" />
      </svg>
      <svg viewBox="0 0 200 200" style={{ position: 'absolute', left: '-30px', bottom: '-30px', width: '220px', height: '220px', opacity: 0.035, pointerEvents: 'none' }}>
        <rect x="20" y="100" width="25" height="70" fill="#60A5FA" />
        <rect x="55" y="70" width="25" height="100" fill="#60A5FA" />
        <rect x="90" y="40" width="25" height="130" fill="#60A5FA" />
        <rect x="125" y="80" width="25" height="90" fill="#60A5FA" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ height: '2px', background: 'linear-gradient(90deg,#1565C0,#0288D1,#1565C0)', position: 'relative', zIndex: 1 }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 20px 32px', position: 'relative' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '20px', color: '#fff' }}>
                True<span style={{ color: '#60A5FA' }}>Creds</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '10px', maxWidth: '280px' }}>
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

          {/* Free Tools */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Free Tools</div>
            {[['/compare','Compare Lenders'],['/calculator','EMI Calculator'],['/apply','Check Eligibility'],['/rejection-checker','Rejection Checker'],['/emi-vs-sip','EMI vs SIP'],['/salary-estimator','Salary Estimator']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

          {/* Insights & Community */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Insights</div>
            {[['/glossary','Loan Glossary'],['/cibil-roadmap','CIBIL Roadmap'],['/red-flags','Avoid Scams'],['/rejection-stories','Rejection Stories'],['/rate-tracker','Rate Tracker'],['/city-matcher','City Matcher']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', margin: '16px 0 10px' }}>More Tools</div>
            {[['/real-cost-calculator','Real Cost Calculator'],['/document-checklist','Document Checklist'],['/blog','Financial Tips']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

          {/* Company / Cities / Legal stacked */}
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', marginBottom: '16px' }}>Cities</div>
            {[['delhi','Delhi NCR'],['mumbai','Mumbai'],['noida','Noida'],['jaipur','Jaipur']].map(([slug, name]) => (
              <Link key={slug} to={`/loans-in/${slug}`} style={linkStyle} {...hover}>Loans in {name}</Link>
            ))}
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#60A5FA', margin: '16px 0 10px' }}>Company</div>
            {[['/about','About Us'],['/contact','Contact Us']].map(([to, label]) => (
              <Link key={to} to={to} style={linkStyle} {...hover}>{label}</Link>
            ))}
          </div>

        </div>

        {/* Legal row — separate horizontal strip */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[['/editorial-policy','Editorial Policy'],['/how-we-make-money','How We Make Money'],['/corrections','Corrections'],['/legal/privacy','Privacy Policy'],['/terms','Terms of Service'],['/disclaimer','Disclaimer']].map(([to, label]) => (
              <Link key={to} to={to} style={{ ...linkStyle, marginBottom: 0 }} {...hover}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '12px', color: '#4B5563' }}>© 2026 TrueCreds. All rights reserved.</p>
          <p style={{ fontSize: '11px', color: '#374151', maxWidth: '480px', textAlign: 'right', lineHeight: 1.6 }}>
            Affiliate disclosure: We earn a referral fee when you apply via our links. Rankings are independent and not influenced by commercial relationships.
          </p>
        </div>
      </div>
    </footer>
  );
}
