import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-0" style={{ background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1, #1565C0)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <span className="font-black text-xl text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>True<span style={{ color: '#60A5FA' }}>Creds</span></span>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: '#94A3B8' }}>India's trusted loan comparison platform. We compare, you choose — always for free.</p>
            <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>Not a lender. We compare RBI-registered NBFCs & banks.</p>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: '#60A5FA' }}>Loan Types</div>
            {['personal','student','business','aadhaar','no-cibil','instant'].map(s => (
              <Link key={s} to={`/loans/${s}`} className="block text-xs mb-2.5 no-underline capitalize transition-colors" style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.target.style.color='#60A5FA'} onMouseLeave={e => e.target.style.color='#94A3B8'}>
                {s.replace('-', ' ')} loans
              </Link>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: '#60A5FA' }}>Cities</div>
            {[['delhi','Delhi NCR'],['mumbai','Mumbai'],['noida','Noida'],['jaipur','Jaipur']].map(([slug, name]) => (
              <Link key={slug} to={`/loans-in/${slug}`} className="block text-xs mb-2.5 no-underline transition-colors" style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.target.style.color='#60A5FA'} onMouseLeave={e => e.target.style.color='#94A3B8'}>
                Loans in {name}
              </Link>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: '#60A5FA' }}>Company</div>
            {[['/',  'Home'],['/compare','Compare'],['/calculator','EMI Calculator'],['/blog','Blog'],['/contact','Contact'],['/legal/privacy','Privacy Policy'],['/legal/disclaimer','Disclaimer']].map(([to, label]) => (
              <Link key={to} to={to} className="block text-xs mb-2.5 no-underline transition-colors" style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.target.style.color='#60A5FA'} onMouseLeave={e => e.target.style.color='#94A3B8'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#4B5563' }}>© 2026 TrueCreds. All rights reserved.</p>
          <p className="text-xs text-center sm:text-right max-w-sm" style={{ color: '#374151' }}>Affiliate disclosure: We earn a referral fee when you apply via our links. Rankings are independent.</p>
        </div>
      </div>
    </footer>
  );
}
