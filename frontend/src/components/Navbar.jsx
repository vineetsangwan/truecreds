import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { to: '/compare', label: 'Compare' },
  { to: '/calculator', label: 'EMI Calc' },
  {
    label: 'Loan Types', dropdown: [
      { to: '/loans/personal', label: '👤 Personal Loans' },
      { to: '/loans/student', label: '🎓 Student Loans' },
      { to: '/loans/business', label: '🏢 Business Loans' },
      { to: '/loans/aadhaar', label: '🪪 Aadhaar Loans' },
      { to: '/loans/no-cibil', label: '📊 No CIBIL Loans' },
      { to: '/loans/instant', label: '⚡ Instant Loans' },
    ]
  },
  {
    label: 'Tools', dropdown: [
      { to: '/rejection-checker', label: '🔍 Rejection Checker' },
      { to: '/emi-vs-sip', label: '📊 EMI vs SIP' },
      { to: '/salary-estimator', label: '💰 Salary Estimator' },
      { to: '/real-cost-calculator', label: '💯 Real Cost Calculator' },
      { to: '/glossary', label: '📖 Loan Glossary' },
      { to: '/cibil-roadmap', label: '📈 CIBIL Roadmap' },
      { to: '/city-matcher', label: '📍 City Matcher' },
      { to: '/document-checklist', label: '📋 Document Checklist' },
      { to: '/red-flags', label: '🚩 Avoid Scams' },
      { to: '/rejection-stories', label: '💬 Rejection Stories' },
      { to: '/rate-tracker', label: '📈 Rate Tracker' },
    ]
  },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const dropRef = useRef(null);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(null); }, [loc.pathname]);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const isActive = (link) => link.to ? loc.pathname === link.to : link.dropdown?.some(d => loc.pathname === d.to);
  const toggleMobileSection = (label) => setMobileExpanded(p => ({ ...p, [label]: !p[label] }));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(240,246,255,0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 1px 0 rgba(21,101,192,0.1), 0 8px 32px rgba(21,101,192,0.08)' : '0 1px 0 rgba(21,101,192,0.08)',
        }}
      >
        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1, #1565C0)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

            <Link to="/" className="flex items-center gap-2 group no-underline">
              <motion.div whileHover={{ rotate: [-5,5,-3,0], scale: 1.1 }} transition={{ duration: 0.4 }} className="relative">
                <span className="text-2xl">✅</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1565C0] animate-pulse" />
              </motion.div>
              <span className="font-black text-xl" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628', letterSpacing: '-0.02em' }}>
                True<span style={{ color: '#1565C0' }}>Creds</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider" style={{ color: '#1565C0', border: '1px solid rgba(21,101,192,0.25)', background: 'rgba(21,101,192,0.06)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-pulse" />LIVE
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-1">
              {LINKS.map(link => link.dropdown ? (
                <div key={link.label} className="relative" ref={dropRef}>
                  <button onClick={() => setDropdownOpen(dropdownOpen === link.label ? null : link.label)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all relative"
                    style={{ color: isActive(link) ? '#1565C0' : '#3B5280' }}>
                    {link.label}
                    <motion.span animate={{ rotate: dropdownOpen === link.label ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs">▾</motion.span>
                    {isActive(link) && <motion.div layoutId="navUnderline" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: '#1565C0' }} />}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden border shadow-xl"
                        style={{
                          background: '#fff', borderColor: 'rgba(21,101,192,0.15)', boxShadow: '0 20px 60px rgba(21,101,192,0.15)',
                          width: link.label === 'Tools' ? '560px' : '220px',
                          maxWidth: '90vw',
                        }}
                      >
                        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1)' }} />
                        <div style={{ display: link.label === 'Tools' ? 'grid' : 'block', gridTemplateColumns: link.label === 'Tools' ? '1fr 1fr' : undefined, padding: link.label === 'Tools' ? '8px' : 0 }}>
                          {link.dropdown.map((item, i) => (
                            <motion.div key={item.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                              <Link to={item.to} className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all no-underline rounded-lg"
                                style={{ color: '#3B5280' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(21,101,192,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.to} to={link.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline relative"
                  style={{ color: isActive(link) ? '#1565C0' : '#3B5280' }}>
                  {link.label}
                  {isActive(link) && <motion.div layoutId="navUnderline" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: '#1565C0' }} />}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/apply" className="hidden md:inline-flex">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-mint text-sm py-2.5 px-5">
                  Check Eligibility →
                </motion.button>
              </Link>
              {!mobileOpen && (
                <button className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1" onClick={() => setMobileOpen(true)}>
                  <span className="block w-full h-0.5 rounded" style={{ background: '#1565C0' }} />
                  <span className="block w-full h-0.5 rounded" style={{ background: '#1565C0' }} />
                  <span className="block w-full h-0.5 rounded" style={{ background: '#1565C0' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden"
              style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(10,22,40,0.3)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.div
              className="md:hidden"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '320px', maxWidth: '85vw',
                zIndex: 50,
                background: '#fff',
                borderLeft: '1px solid rgba(21,101,192,0.12)',
                boxShadow: '-20px 0 60px rgba(21,101,192,0.15)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}>

              {/* Background illustration — very subtle, bottom corner only */}
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '140px', height: '140px', opacity: 0.04, pointerEvents: 'none', overflow: 'hidden' }}>
                <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%' }}>
                  <rect x="20" y="90" width="16" height="40" fill="#1565C0" />
                  <rect x="45" y="70" width="16" height="60" fill="#0288D1" />
                  <rect x="70" y="50" width="16" height="80" fill="#1565C0" />
                  <rect x="95" y="75" width="16" height="55" fill="#0288D1" />
                </svg>
              </div>

              <div style={{ height: '2px', background: 'linear-gradient(90deg, #1565C0, #0288D1)', flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid rgba(21,101,192,0.1)', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '22px' }}>✅</span>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '18px', color: '#0A1628' }}>
                    True<span style={{ color: '#1565C0' }}>Creds</span>
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ color: '#7A90B8', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
              </div>

              <nav style={{ flex: 1, padding: '20px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                {LINKS.map((link) => link.dropdown ? (
                  <div key={link.label} style={{ marginBottom: '4px' }}>
                    <button onClick={() => toggleMobileSection(link.label)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#1565C0', background: mobileExpanded[link.label] ? 'rgba(21,101,192,0.06)' : 'transparent' }}>
                      {link.label}
                      <motion.span animate={{ rotate: mobileExpanded[link.label] ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileExpanded[link.label] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          {link.dropdown.map(item => (
                            <Link key={item.to} to={item.to}
                              style={{ display: 'block', padding: '8px 12px 8px 24px', fontSize: '14px', borderRadius: '10px', textDecoration: 'none', color: loc.pathname === item.to ? '#1565C0' : '#3B5280', background: loc.pathname === item.to ? 'rgba(21,101,192,0.06)' : 'transparent', fontWeight: loc.pathname === item.to ? 600 : 400 }}>
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.to} to={link.to}
                    style={{ display: 'block', padding: '10px 12px', fontSize: '14px', fontWeight: 500, borderRadius: '10px', textDecoration: 'none', marginBottom: '4px', color: loc.pathname === link.to ? '#1565C0' : '#3B5280', background: loc.pathname === link.to ? 'rgba(21,101,192,0.08)' : 'transparent' }}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div style={{ padding: '20px', borderTop: '1px solid rgba(21,101,192,0.1)', position: 'relative', zIndex: 1, background: '#fff', flexShrink: 0 }}>
                <Link to="/apply" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(21,101,192,0.3)' }}>
                  Check Eligibility — Free
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div style={{ height: '64px' }} />
    </>
  );
}
