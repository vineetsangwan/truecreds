import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { api } from '../lib/api';
import LoanCard from '../components/LoanCard';
import EligibilityForm from '../components/EligibilityForm';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.section>
  );
}

const CATEGORIES = [
  { slug: 'personal', icon: '👤', title: 'Personal Loans', desc: 'For any purpose, instant disbursal' },
  { slug: 'student', icon: '🎓', title: 'Student Loans', desc: 'Education & college expenses' },
  { slug: 'business', icon: '🏢', title: 'Business Loans', desc: 'SME & working capital' },
  { slug: 'aadhaar', icon: '🪪', title: 'Aadhaar Loans', desc: 'Minimal KYC, fast approval' },
  { slug: 'no-cibil', icon: '📊', title: 'No CIBIL Loans', desc: 'Low or zero credit score' },
  { slug: 'instant', icon: '⚡', title: 'Instant Loans', desc: 'Money in minutes, not days' },
];
const CITIES = [
  { slug: 'delhi', name: 'Delhi NCR', icon: '🏛️' },
  { slug: 'mumbai', name: 'Mumbai', icon: '🌆' },
  { slug: 'noida', name: 'Noida', icon: '🏙️' },
  { slug: 'jaipur', name: 'Jaipur', icon: '🕌' },
];
const TESTIMONIALS = [
  { name: 'Priya Mehta', city: 'Mumbai', text: 'Got ₹3 lakh approved in under an hour. TrueCreds saved me from a high-interest trap.', rating: 5 },
  { name: 'Rohit Sharma', city: 'Delhi', text: 'CIBIL was 620 and rejected everywhere. TrueCreds showed me KreditBee — got the loan same day.', rating: 5 },
  { name: 'Ananya Singh', city: 'Jaipur', text: 'The EMI calculator helped me pick the right tenure. Transparent, honest, zero spam.', rating: 5 },
];
const FAQS = [
  { q: 'Is TrueCreds a lender?', a: 'No. TrueCreds is a comparison platform. We help you find loans from RBI-registered NBFCs and banks. We never lend money directly.' },
  { q: 'Will checking eligibility affect my CIBIL?', a: 'Absolutely not. Our eligibility check is a soft inquiry only — zero impact on your CIBIL score.' },
  { q: 'Which loan types does TrueCreds compare?', a: 'Personal, student, business, Aadhaar-based, instant loans, and loans for low/no CIBIL profiles.' },
  { q: 'How are lenders ranked?', a: 'By a weighted score: interest rate (40%), approval speed (25%), CIBIL flexibility (20%), user ratings (15%).' },
  { q: 'Is my data safe?', a: 'Yes. Bank-grade encryption. We never sell your data. Used only to match you with lenders.' },
];

export default function Home() {
  const [loans, setLoans] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);
  useEffect(() => { api.get('/api/loan-apps').then(r => setLoans(r.data)); }, []);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" data-testid="home-page"
        style={{ background: 'linear-gradient(160deg, #E8F0FB 0%, #F0F6FF 50%, #DBEAFE 100%)' }}>
        {/* GRID */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(21,101,192,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(21,101,192,0.04) 1px,transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        {/* BLOBS */}
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.12), transparent 70%)', filter: 'blur(50px)', animation: 'float1 14s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(2,136,209,0.1), transparent 70%)', filter: 'blur(60px)', animation: 'float2 18s ease-in-out infinite' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest"
                  style={{ color: '#1565C0', border: '1px solid rgba(21,101,192,0.25)', background: 'rgba(21,101,192,0.08)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-pulse" />
                  Live · 12 Lenders Compared
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="font-black tracking-tight leading-tight mb-6"
                style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2.4rem,5.5vw,3.8rem)', color: '#0A1628' }}>
                Compare the best<br />
                <span className="relative inline-block" style={{ color: '#1565C0' }}>
                  instant loan apps
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1)' }} />
                </span>
                <br />in India.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: '#3B5280' }}>
                No guesswork. No spam. The clearest side-by-side comparison of India's top loan apps — ranked by rate, speed, and CIBIL flexibility.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3 mb-12">
                <Link to="/apply"><motion.button className="btn-mint text-sm px-6 py-3" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Check Eligibility — Free</motion.button></Link>
                <Link to="/compare"><motion.button className="btn-ghost text-sm px-6 py-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Compare All Lenders →</motion.button></Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ val: 120000, suffix: '+', label: 'Borrowers', isCount: true }, { val: '30 min', label: 'Avg Approval' }, { val: '9.9%', label: 'Starting Rate' }, { val: '12+', label: 'Lenders' }].map((s, i) => (
                  <motion.div key={i} className="text-center p-3 rounded-xl border" whileHover={{ borderColor: 'rgba(21,101,192,0.3)', background: 'rgba(21,101,192,0.06)' }}
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(21,101,192,0.12)' }}>
                    <div className="font-bold text-xl mb-0.5" style={{ color: '#1565C0' }}>
                      {s.isCount ? <AnimatedCounter target={s.val} suffix={s.suffix} /> : s.val}
                    </div>
                    <div className="text-[10px]" style={{ color: '#7A90B8' }}>{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <EligibilityForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <Section>
        <div className="py-5 border-y" style={{ background: '#fff', borderColor: 'rgba(21,101,192,0.1)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8">
              {[['🏦','RBI Registered'],['⚡','5 Min Approval'],['👥','1,20,000+ Borrowers'],['💰','₹1K – ₹40L Range'],['🔒','Zero CIBIL Impact']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-medium" style={{ color: '#3B5280' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* TOP LOAN APPS */}
      <Section className="py-24" style={{ background: '#F0F6FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: '#1565C0' }}>/ 01 — TOP APPS</div>
              <h2 className="font-bold tracking-tight" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>
                India's Top Loan Apps, <span style={{ color: '#1565C0' }}>Ranked.</span>
              </h2>
            </div>
            <Link to="/compare" className="hidden md:flex btn-ghost text-sm px-4 py-2">See full comparison →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loans.slice(0, 6).map((loan, i) => <LoanCard key={loan.id} loan={loan} index={i} highlight={i === 0} />)}
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="py-24" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: '#1565C0' }}>/ HOW IT WORKS</div>
          <h2 className="font-bold mb-12" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>Three steps to your loan</h2>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(21,101,192,0.3), transparent)' }} />
            {[['01','Tell us what you need','Share loan amount, employment type and CIBIL. Takes 90 seconds.','📝'],
              ['02','We match top lenders','Our algorithm ranks lenders by your profile — highest approval odds first.','🎯'],
              ['03','Apply with one tap','Click Apply on your preferred lender. Fully guided from start to disbursal.','✅']].map(([num, title, desc, icon], i) => (
              <motion.div key={num} className="card-cosmic relative text-center p-8"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border text-2xl"
                  style={{ background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(21,101,192,0.2)' }}>{icon}</div>
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black font-mono"
                  style={{ background: '#1565C0' }}>{num}</div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A90B8' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section className="py-24" style={{ background: '#F0F6FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: '#1565C0' }}>/ LOAN TYPES</div>
          <h2 className="font-bold mb-10" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>Find loans by category</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/loans/${c.slug}`} className="card-cosmic flex items-center gap-4 no-underline group" style={{ textDecoration: 'none' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
                    style={{ background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)' }}>{c.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: '#0A1628' }}>{c.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#7A90B8' }}>{c.desc}</div>
                  </div>
                  <span className="transition-all group-hover:translate-x-1" style={{ color: '#1565C0' }}>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CITIES */}
      <Section className="py-24" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: '#1565C0' }}>/ BY CITY</div>
          <h2 className="font-bold mb-10" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>Loans near you</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={`/loans-in/${c.slug}`} className="card-cosmic text-center no-underline group block" style={{ textDecoration: 'none' }}>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{c.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: '#0A1628' }}>{c.name}</div>
                  <div className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium" style={{ color: '#1565C0' }}>View lenders →</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="py-24" style={{ background: '#F0F6FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: '#1565C0' }}>/ TESTIMONIALS</div>
          <h2 className="font-bold mb-10" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>Real borrowers, real results</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="card-cosmic relative overflow-hidden"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1)' }} />
                <div className="text-yellow-400 text-base mb-4">{'★'.repeat(t.rating)}</div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: '#3B5280' }}>"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1565C0' }}>{t.name[0]}</div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#0A1628' }}>{t.name}</div>
                    <div className="text-[10px]" style={{ color: '#7A90B8' }}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-24" style={{ background: '#fff' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2 text-center" style={{ color: '#1565C0' }}>/ FAQ</div>
          <h2 className="font-bold mb-10 text-center" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0A1628' }}>Common questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <motion.div key={i} className="card-cosmic cursor-pointer select-none overflow-hidden" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-sm" style={{ color: '#0A1628' }}>{f.q}</span>
                  <motion.span style={{ color: '#1565C0' }} animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs flex-shrink-0">▼</motion.span>
                </div>
                <motion.div initial={false} animate={{ height: faqOpen === i ? 'auto' : 0, opacity: faqOpen === i ? 1 : 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: '#3B5280' }}>{f.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)', boxShadow: '0 20px 60px rgba(21,101,192,0.3)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-4 text-white opacity-70">/ GET STARTED NOW</div>
            <h2 className="font-black text-white mb-4" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2rem,5vw,3rem)' }}>Stop guessing.<br />Start comparing.</h2>
            <p className="text-blue-100 mb-8 text-lg">Join 1.2 lakh+ Indians who found their best loan on TrueCreds.</p>
            <Link to="/apply">
              <motion.button className="font-bold text-base px-10 py-4 rounded-xl border-0 cursor-pointer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ background: '#fff', color: '#1565C0', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                Check Eligibility — Free & Instant →
              </motion.button>
            </Link>
            <p className="text-blue-200 text-xs mt-4 opacity-70">TrueCreds is NOT a lender. Zero CIBIL impact. No spam.</p>
          </div>
        </div>
      </Section>
    </PageTransition>
  );
}
