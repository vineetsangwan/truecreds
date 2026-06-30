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
              <button className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1" onClick={() => setMobileOpen(!mobileOpen)}>
                <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-full h-0.5 rounded origin-center" style={{ background: '#1565C0' }} />
                <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-full h-0.5 rounded" style={{ background: '#1565C0' }} />
                <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-full h-0.5 rounded origin-center" style={{ background: '#1565C0' }} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(10,22,40,0.3)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 md:hidden flex flex-col"
              style={{ background: '#fff', borderLeft: '1px solid rgba(21,101,192,0.12)', boxShadow: '-20px 0 60px rgba(21,101,192,0.1)', overflow: 'hidden', position: 'relative' }}>

              {/* Background illustration */}
              <svg viewBox="0 0 300 700" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', opacity: 0.035, pointerEvents: 'none', zIndex: 0 }}>
                <circle cx="260" cy="100" r="90" fill="#1565C0" />
                <circle cx="280" cy="280" r="60" fill="#0288D1" />
                <rect x="20" y="450" width="20" height="60" fill="#1565C0" />
                <rect x="50" y="420" width="20" height="90" fill="#0288D1" />
                <rect x="80" y="390" width="20" height="120" fill="#1565C0" />
                <circle cx="60" cy="620" r="50" fill="#0288D1" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(21,101,192,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(21,101,192,0.02) 1px,transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

              <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1)', position: 'relative', zIndex: 1 }} />
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(21,101,192,0.1)', position: 'relative', zIndex: 1 }}>
                <span className="font-black text-lg" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628' }}>True<span style={{ color: '#1565C0' }}>Creds</span></span>
                <button onClick={() => setMobileOpen(false)} style={{ color: '#7A90B8' }}>✕</button>
              </div>

              <nav className="flex-1 p-5 space-y-1 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
                {LINKS.map((link) => link.dropdown ? (
                  <div key={link.label} style={{ marginBottom: '4px' }}>
                    <button onClick={() => toggleMobileSection(link.label)}
                      className="w-full flex items-center justify-between text-xs uppercase tracking-wider px-3 py-2.5 font-mono font-semibold rounded-lg"
                      style={{ color: '#1565C0', background: mobileExpanded[link.label] ? 'rgba(21,101,192,0.06)' : 'transparent' }}>
                      {link.label}
                      <motion.span animate={{ rotate: mobileExpanded[link.label] ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileExpanded[link.label] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          {link.dropdown.map(item => (
                            <Link key={item.to} to={item.to} className="block px-3 py-2 text-sm rounded-lg no-underline transition-colors pl-6"
                              style={{ color: loc.pathname === item.to ? '#1565C0' : '#3B5280', background: loc.pathname === item.to ? 'rgba(21,101,192,0.06)' : 'transparent', fontWeight: loc.pathname === item.to ? 600 : 400 }}>
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.to} to={link.to} className="block px-3 py-2.5 text-sm font-medium rounded-lg no-underline transition-all"
                    style={{ color: loc.pathname === link.to ? '#1565C0' : '#3B5280', background: loc.pathname === link.to ? 'rgba(21,101,192,0.08)' : 'transparent' }}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="p-5 border-t" style={{ borderColor: 'rgba(21,101,192,0.1)', position: 'relative', zIndex: 1, background: '#fff' }}>
                <Link to="/apply" className="btn-mint w-full justify-center text-sm">Check Eligibility — Free</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </>
  );
}
