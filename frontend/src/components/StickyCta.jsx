import React from 'react';
import { Link, useLocation } from 'react-router-dom';
export default function StickyCta() {
  const loc = useLocation();
  if (loc.pathname.startsWith('/admin') || loc.pathname === '/apply') return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 p-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 -4px 24px rgba(21,101,192,0.1)' }}>
      <Link to="/apply" className="btn-mint w-full justify-center text-sm">Check Eligibility — Free</Link>
    </div>
  );
}
