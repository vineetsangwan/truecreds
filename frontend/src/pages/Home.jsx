import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { api } from '../lib/api';
import LoanCard from '../components/LoanCard';
import EligibilityForm from '../components/EligibilityForm';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';

function Section({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={className} style={style}>
      {children}
    </motion.section>
  );
}

/* ── SVG Illustrations ── */
function IllustrationCoins() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.18 }}>
      <circle cx="40" cy="70" r="28" fill="#1565C0" /><circle cx="40" cy="70" r="22" fill="#0288D1" />
      <text x="40" y="75" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">₹</text>
      <circle cx="80" cy="50" r="22" fill="#1565C0" /><circle cx="80" cy="50" r="17" fill="#0288D1" />
      <text x="80" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">₹</text>
      <circle cx="95" cy="85" r="14" fill="#1565C0" /><circle cx="95" cy="85" r="10" fill="#0288D1" />
      <text x="95" y="89" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">₹</text>
    </svg>
  );
}
function IllustrationChart() {
  return (
    <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.15 }}>
      <rect x="10" y="60" width="18" height="35" rx="4" fill="#1565C0" /><rect x="36" y="40" width="18" height="55" rx="4" fill="#0288D1" />
      <rect x="62" y="25" width="18" height="70" rx="4" fill="#1565C0" /><rect x="88" y="45" width="18" height="50" rx="4" fill="#0288D1" />
      <rect x="114" y="15" width="18" height="80" rx="4" fill="#1565C0" />
      <line x1="5" y1="95" x2="135" y2="95" stroke="#1565C0" strokeWidth="2" />
      <polyline points="19,60 45,40 71,25 97,45 123,15" stroke="#0288D1" strokeWidth="2" fill="none" strokeDasharray="4,3" />
    </svg>
  );
}
function IllustrationShield() {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.12 }}>
      <path d="M50 10 L90 28 L90 62 C90 82 72 98 50 108 C28 98 10 82 10 62 L10 28 Z" fill="#1565C0" />
      <path d="M50 22 L80 36 L80 63 C80 78 67 91 50 99 C33 91 20 78 20 63 L20 36 Z" fill="#0288D1" />
      <polyline points="35,60 45,70 65,48" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IllustrationPhone() {
  return (
    <svg viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.13 }}>
      <rect x="8" y="5" width="64" height="120" rx="12" fill="#1565C0" /><rect x="14" y="14" width="52" height="100" rx="8" fill="#0288D1" />
      <rect x="22" y="24" width="36" height="6" rx="3" fill="white" opacity="0.5" /><rect x="22" y="36" width="28" height="4" rx="2" fill="white" opacity="0.35" />
      <rect x="22" y="48" width="36" height="4" rx="2" fill="white" opacity="0.35" /><rect x="22" y="60" width="22" height="4" rx="2" fill="white" opacity="0.35" />
      <rect x="22" y="78" width="36" height="16" rx="6" fill="white" opacity="0.2" />
      <text x="40" y="90" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.7">Apply Now</text>
      <circle cx="40" cy="118" r="4" fill="white" opacity="0.3" />
    </svg>
  );
}
function IllustrationDots() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.06, pointerEvents: 'none' }}>
      {[...Array(10)].map((_, row) => [...Array(10)].map((_, col) => (
        <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2" fill="#1565C0" />
      )))}
    </svg>
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
const LENDERS = [
  { name: 'Navi', emoji: '🚀', rate: '9.9%' },
  { name: 'Bajaj Finserv', emoji: '🏛️', rate: '11%' },
  { name: 'Credila', emoji: '📚', rate: '10.5%' },
  { name: 'MoneyTap', emoji: '💧', rate: '13%' },
  { name: 'KreditBee', emoji: '🐝', rate: '17%' },
  { name: 'PaySense', emoji: '💼', rate: '14%' },
  { name: 'CASHe', emoji: '💸', rate: '18%' },
  { name: 'LazyPay', emoji: '⏱️', rate: '16%' },
  { name: 'mPokket', emoji: '🎓', rate: '24%' },
  { name: 'FlexiLoans', emoji: '🧾', rate: '14%' },
];
const CIBIL_RANGES = [
  { range: '750+', label: 'Excellent', color: '#16a34a', lenders: 'All lenders — Best rates', pct: 100 },
  { range: '700–749', label: 'Good', color: '#2563eb', lenders: 'Navi, Bajaj, MoneyTap, KreditBee', pct: 80 },
  { range: '650–699', label: 'Fair', color: '#d97706', lenders: 'KreditBee, LazyPay, CASHe', pct: 55 },
  { range: '600–649', label: 'Low', color: '#dc2626', lenders: 'KreditBee, LazyPay, mPokket', pct: 35 },
  { range: 'No Score', label: 'No Credit', color: '#7c3aed', lenders: 'KreditBee, LazyPay, mPokket', pct: 20 },
];
const COMPARE_TABLE = [
  { name: 'Navi', emoji: '🚀', rate: '9.9%', max: '₹20L', cibil: '650+', time: '5 min', best: 'Salaried' },
  { name: 'KreditBee', emoji: '🐝', rate: '17%', max: '₹4L', cibil: 'Any', time: '10 min', best: 'Low CIBIL' },
  { name: 'Bajaj Finserv', emoji: '🏛️', rate: '11%', max: '₹40L', cibil: '720+', time: '30 min', best: 'High value' },
  { name: 'MoneyTap', emoji: '💧', rate: '13%', max: '₹5L', cibil: '600+', time: '15 min', best: 'Credit line' },
  { name: 'LazyPay', emoji: '⏱️', rate: '16%', max: '₹1L', cibil: 'Any', time: 'Instant', best: 'Small loans' },
];

/* ── EMI Calculator Component ── */
function EmiCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(12);
  const emi = Math.round((amount * (rate / 1200) * Math.pow(1 + rate / 1200, tenure)) / (Math.pow(1 + rate / 1200, tenure) - 1));
  const total = emi * tenure;
  const interest = total - amount;
  const pct = Math.round((interest / total) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
      <div>
        {[
          { label: 'Loan Amount', val: amount, set: setAmount, min: 10000, max: 20000000, step: 50000, fmt: v => v >= 10000000 ? `₹${(v/10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K` },
          { label: 'Interest Rate (% p.a.)', val: rate, set: setRate, min: 9, max: 36, step: 0.5, fmt: v => `${v}%` },
          { label: 'Tenure (months)', val: tenure, set: setTenure, min: 3, max: 84, step: 1, fmt: v => `${v} mo` },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#3B5280', fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontSize: '14px', color: '#1565C0', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{s.fmt(s.val)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={e => s.set(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1565C0', height: '4px', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>{s.fmt(s.min)}</span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>{s.fmt(s.max)}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)', borderRadius: '20px', padding: '32px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Monthly EMI</div>
        <div style={{ fontSize: 'clamp(2.4rem,6vw,3.5rem)', fontWeight: 900, fontFamily: 'Outfit,sans-serif', marginBottom: '24px' }}>
          ₹{emi.toLocaleString('en-IN')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Amount', val: `₹${total.toLocaleString('en-IN')}` },
            { label: 'Total Interest', val: `₹${interest.toLocaleString('en-IN')}` },
            { label: 'Principal', val: `₹${amount.toLocaleString('en-IN')}` },
            { label: 'Interest %', val: `${pct}%` },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{item.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', overflow: 'hidden', height: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'white', height: '100%', width: `${100 - pct}%`, borderRadius: '10px', transition: 'width 0.4s' }} />
        </div>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '16px' }}>
          Principal {100 - pct}% · Interest {pct}%
        </div>
        <Link to="/compare">
          <button style={{ background: 'white', color: '#1565C0', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%' }}>
            Find Best Rate →
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Loan Amount Slider ── */
function LoanSlider() {
  const [amount, setAmount] = useState(200000);
  const LENDER_DATA = [
    { name: 'mPokket', emoji: '🎓', min: 500, max: 30000 },
    { name: 'LazyPay', emoji: '⏱️', min: 1000, max: 100000 },
    { name: 'KreditBee', emoji: '🐝', min: 1000, max: 400000 },
    { name: 'CASHe', emoji: '💸', min: 5000, max: 400000 },
    { name: 'MoneyTap', emoji: '💧', min: 3000, max: 500000 },
    { name: 'PaySense', emoji: '💼', min: 5000, max: 500000 },
    { name: 'Navi', emoji: '🚀', min: 10000, max: 2000000 },
    { name: 'Credila', emoji: '📚', min: 50000, max: 7500000 },
    { name: 'Bajaj Finserv', emoji: '🏛️', min: 100000, max: 4000000 },
    { name: 'FlexiLoans', emoji: '🧾', min: 100000, max: 5000000 },
  ];
  const eligible = LENDER_DATA.filter(l => amount >= l.min && amount <= l.max);
  const formatAmt = v => v >= 100000 ? `₹${(v / 100000).toFixed(v >= 1000000 ? 1 : 0)}${v >= 1000000 ? 'Cr' : 'L'}` : `₹${(v / 1000).toFixed(0)}K`;

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #E8F0FB, #F0F6FF)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: '#3B5280', fontWeight: 500 }}>How much do you need?</span>
          <span style={{ fontSize: '28px', fontWeight: 900, color: '#1565C0', fontFamily: 'Outfit,sans-serif' }}>{formatAmt(amount)}</span>
        </div>
        <input type="range" min={500} max={7500000} step={5000} value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#1565C0', height: '6px', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>₹500</span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>₹75L</span>
        </div>
      </div>
      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#3B5280' }}>
        <span style={{ fontWeight: 700, color: '#1565C0', fontSize: '18px' }}>{eligible.length}</span> lenders can give you {formatAmt(amount)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
        {LENDER_DATA.map(l => {
          const ok = amount >= l.min && amount <= l.max;
          return (
            <div key={l.name} style={{ padding: '12px', borderRadius: '12px', border: `1.5px solid ${ok ? 'rgba(21,101,192,0.3)' : 'rgba(0,0,0,0.06)'}`, background: ok ? 'rgba(21,101,192,0.06)' : 'rgba(0,0,0,0.02)', opacity: ok ? 1 : 0.4, transition: 'all 0.3s' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{l.emoji}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: ok ? '#1565C0' : '#94A3B8' }}>{l.name}</div>
              <div style={{ fontSize: '10px', color: ok ? '#3B5280' : '#94A3B8', marginTop: '2px' }}>
                {ok ? '✓ Available' : '✗ Not available'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Eligibility Quiz ── */
function LoanQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    { q: 'What is your loan purpose?', key: 'purpose', options: ['Personal/Emergency', 'Education', 'Business', 'Instant cash'] },
    { q: 'What is your employment type?', key: 'employment', options: ['Salaried', 'Self-employed', 'Student', 'Freelancer'] },
    { q: 'What is your CIBIL score range?', key: 'cibil', options: ['750+', '650–749', '550–649', 'No score / unsure'] },
  ];

  const getResult = (a) => {
    if (a.cibil === '750+' && a.employment === 'Salaried') return { name: 'Navi', emoji: '🚀', rate: '9.9%', reason: 'Best rate for salaried with good CIBIL', link: '/loans/personal' };
    if (a.purpose === 'Education') return { name: 'Credila', emoji: '📚', rate: '10.5%', reason: 'Specialised in education loans', link: '/loans/student' };
    if (a.purpose === 'Business') return { name: 'FlexiLoans', emoji: '🧾', rate: '14%', reason: 'Best for SME working capital', link: '/loans/business' };
    if (a.employment === 'Student') return { name: 'mPokket', emoji: '🎓', rate: '24%', reason: 'Only lender for students', link: '/loans/student' };
    if (a.cibil === 'No score / unsure' || a.cibil === '550–649') return { name: 'KreditBee', emoji: '🐝', rate: '17%', reason: 'Accepts zero credit history', link: '/loans/no-cibil' };
    return { name: 'MoneyTap', emoji: '💧', rate: '13%', reason: 'Flexible credit line, wide eligibility', link: '/loans/personal' };
  };

  if (result) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{result.emoji}</div>
      <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Your Best Match</div>
      <div style={{ fontSize: '28px', fontWeight: 900, color: '#0A1628', fontFamily: 'Outfit,sans-serif', marginBottom: '8px' }}>{result.name}</div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#1565C0', marginBottom: '12px' }}>from {result.rate} p.a.</div>
      <div style={{ fontSize: '14px', color: '#3B5280', marginBottom: '24px', padding: '12px', background: 'rgba(21,101,192,0.06)', borderRadius: '10px' }}>{result.reason}</div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={result.link}>
          <button style={{ background: '#1565C0', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Apply Now →
          </button>
        </Link>
        <button onClick={() => { setStep(0); setAnswers({}); setResult(null); }}
          style={{ background: 'transparent', color: '#1565C0', border: '1.5px solid #1565C0', borderRadius: '10px', padding: '12px 24px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Retake Quiz
        </button>
      </div>
    </motion.div>
  );

  const q = questions[step];
  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= step ? '#1565C0' : 'rgba(21,101,192,0.15)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px' }}>Step {step + 1} of {questions.length}</div>
      <div style={{ fontSize: 'clamp(16px,3vw,20px)', fontWeight: 700, color: '#0A1628', fontFamily: 'Outfit,sans-serif', marginBottom: '20px' }}>{q.q}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
        {q.options.map(opt => (
          <motion.button key={opt} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const newAnswers = { ...answers, [q.key]: opt };
              setAnswers(newAnswers);
              if (step < questions.length - 1) setStep(s => s + 1);
              else setResult(getResult(newAnswers));
            }}
            style={{ padding: '14px 16px', borderRadius: '12px', border: '1.5px solid rgba(21,101,192,0.2)', background: 'rgba(21,101,192,0.04)', color: '#0A1628', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', wordBreak: 'keep-all', whiteSpace: 'normal', lineHeight: 1.3 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565C0'; e.currentTarget.style.background = 'rgba(21,101,192,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(21,101,192,0.2)'; e.currentTarget.style.background = 'rgba(21,101,192,0.04)'; }}>
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [loans, setLoans] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    api.get('/api/loan-apps').then(r => setLoans(r.data)).catch(() => {});
    api.get('/api/blog/posts').then(r => {
      const posts = Array.isArray(r.data) ? r.data : r.data.posts || [];
      setBlogs(posts.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <style>{`
        @keyframes float1{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(15px)}}
        @keyframes float3{0%,100%{transform:translateY(0)}33%{transform:translateY(-12px)}66%{transform:translateY(8px)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .loan-grid{grid-template-columns:repeat(3,1fr)!important}
        @media(max-width:900px){.loan-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:560px){.loan-grid{grid-template-columns:1fr!important}}
        .faq-cta-grid{grid-template-columns:1fr 420px!important}
        @media(max-width:860px){.faq-cta-grid{grid-template-columns:1fr!important}}
        .partners-grid{grid-template-columns:repeat(5,1fr)!important}
        @media(max-width:640px){.partners-grid{grid-template-columns:repeat(3,1fr)!important}}
        .ticker-inner{display:flex;animation:ticker 30s linear infinite;width:max-content}
        .ticker-inner:hover{animation-play-state:paused}
        .home-pad{padding-left:16px;padding-right:16px}
        @media(min-width:640px){.home-pad{padding-left:24px;padding-right:24px}}
        @media(min-width:1024px){.home-pad{padding-left:32px;padding-right:32px}}
        .home-section{padding:56px 0}
        @media(max-width:640px){.home-section{padding:44px 0}}
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:5px;background:rgba(21,101,192,0.2);outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#1565C0;cursor:pointer;box-shadow:0 2px 8px rgba(21,101,192,0.4)}
      `}</style>

      {/* ── 0. HERO ── */}
      <section style={{ background: 'linear-gradient(160deg,#E8F0FB 0%,#F0F6FF 50%,#DBEAFE 100%)', minHeight: '100svh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(21,101,192,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(21,101,192,0.04) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(21,101,192,0.14),transparent 70%)', filter: 'blur(50px)', animation: 'float1 14s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(2,136,209,0.12),transparent 70%)', filter: 'blur(60px)', animation: 'float2 18s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '5%', top: '15%', width: '70px', height: '110px', animation: 'float3 10s ease-in-out infinite', pointerEvents: 'none', display: 'none' }} className="sm:block"><IllustrationPhone /></div>
        <div style={{ position: 'absolute', left: '3%', bottom: '15%', width: '90px', height: '90px', animation: 'float1 12s ease-in-out infinite', pointerEvents: 'none', display: 'none' }} className="sm:block"><IllustrationCoins /></div>

        <div className="w-full max-w-7xl mx-auto home-pad" style={{ paddingTop: '72px', paddingBottom: '72px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '20px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1565C0', border: '1px solid rgba(21,101,192,0.25)', background: 'rgba(21,101,192,0.08)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1565C0', animation: 'float1 2s ease-in-out infinite' }} />
                  Live · 12 Lenders Compared
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2.2rem,6vw,3.8rem)', fontWeight: 900, color: '#0A1628', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
                Compare the best<br />
                <span style={{ color: '#1565C0' }}>instant loan apps</span><br />
                in India.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ color: '#3B5280', fontSize: 'clamp(14px,2vw,17px)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '480px' }}>
                No guesswork. No spam. The clearest side-by-side comparison of India's top loan apps — ranked by rate, speed, and CIBIL flexibility.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' }}>
                <Link to="/apply"><motion.button className="btn-mint" style={{ fontSize: '14px', padding: '12px 24px', width: '100%', maxWidth: '220px' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Check Eligibility — Free</motion.button></Link>
                <Link to="/compare"><motion.button className="btn-ghost" style={{ fontSize: '14px', padding: '12px 24px' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Compare All →</motion.button></Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                {[{ val: 120000, suffix: '+', label: 'Borrowers', isCount: true }, { val: '30 min', label: 'Avg Approval' }, { val: '9.9%', label: 'Starting Rate' }, { val: '12+', label: 'Lenders' }].map((s, i) => (
                  <motion.div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '14px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(21,101,192,0.12)' }} whileHover={{ background: 'rgba(21,101,192,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: 'clamp(16px,3vw,20px)', color: '#1565C0' }}>
                      {s.isCount ? <AnimatedCounter target={s.val} suffix={s.suffix} /> : s.val}
                    </div>
                    <div style={{ fontSize: '10px', color: '#7A90B8', marginTop: '2px' }}>{s.label}</div>
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

      {/* ── 1. LIVE RATE TICKER ── */}
      <div style={{ background: '#0A1628', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="ticker-inner">
          {[...LENDERS, ...LENDERS].map((l, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 24px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' }}>
              <span style={{ fontSize: '16px' }}>{l.emoji}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{l.name}</span>
              <span style={{ color: '#00E676', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{l.rate} p.a.</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <Section>
        <div style={{ background: '#fff', borderTop: '1px solid rgba(21,101,192,0.1)', borderBottom: '1px solid rgba(21,101,192,0.1)', padding: '14px 0', overflowX: 'auto' }}>
          <div className="max-w-7xl mx-auto home-pad">
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', minWidth: 'max-content', margin: '0 auto' }}>
              {[['🏦', 'RBI Registered'], ['⚡', '5 Min Approval'], ['👥', '1,20,000+ Borrowers'], ['💰', '₹1K – ₹40L Range'], ['🔒', 'Zero CIBIL Impact']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#3B5280' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. TOP LOAN APPS ── */}
      <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-20px', top: '20px', width: '180px', height: '180px', opacity: 1 }}><IllustrationChart /></div>
        <IllustrationDots />
        <div className="w-full max-w-7xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '6px', color: '#1565C0' }}>/ 01 — TOP APPS</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>
                India's Top Loan Apps, <span style={{ color: '#1565C0' }}>Ranked.</span>
              </h2>
            </div>
            <Link to="/compare"><button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>See full comparison →</button></Link>
          </div>
          <div className='loan-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {loans.slice(0, 6).map((loan, i) => (
              <div key={loan.id} style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ width: '100%' }}>
                  <LoanCard loan={loan} index={i} highlight={i === 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 3. PARTNER LENDER LOGOS ── */}
      <Section className="home-section" style={{ background: '#fff' }}>
        <div className="w-full max-w-7xl mx-auto home-pad">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ OUR PARTNERS</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>Lenders we compare</h2>
            <p style={{ color: '#7A90B8', fontSize: '14px', marginTop: '8px' }}>All RBI-registered NBFCs and banks. Zero bias.</p>
          </div>
          <div className='partners-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px' }}>
            {LENDERS.map((l, i) => (
              <motion.div key={l.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                style={{ padding: '16px 12px', borderRadius: '14px', border: '1px solid rgba(21,101,192,0.12)', background: '#F8FAFF', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{l.emoji}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A1628' }}>{l.name}</div>
                <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, marginTop: '4px' }}>{l.rate}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. EMI CALCULATOR ── */}
      <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
        <IllustrationDots />
        <div style={{ position: 'absolute', left: '-10px', bottom: '20px', width: '130px', height: '130px' }}><IllustrationShield /></div>
        <div className="w-full max-w-5xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 02 — EMI CALCULATOR</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>Calculate your monthly EMI</h2>
            <p style={{ color: '#7A90B8', fontSize: '14px', marginTop: '8px' }}>Adjust amount, rate and tenure to see your exact EMI instantly</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '24px', padding: 'clamp(20px,4vw,40px)', boxShadow: '0 8px 40px rgba(21,101,192,0.1)', border: '1px solid rgba(21,101,192,0.12)' }}>
            <EmiCalculator />
          </div>
        </div>
      </Section>

      {/* ── 5. HOW IT WORKS ── */}
      <Section className="home-section" style={{ background: '#fff' }}>
        <div className="w-full max-w-7xl mx-auto home-pad text-center">
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ HOW IT WORKS</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628', marginBottom: '40px' }}>Three steps to your loan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
            {[['01', 'Tell us what you need', 'Share loan amount, employment type and CIBIL. Takes 90 seconds.', '📝'],
              ['02', 'We match top lenders', 'Our algorithm ranks lenders by your profile — highest approval odds first.', '🎯'],
              ['03', 'Apply with one tap', 'Click Apply on your preferred lender. Fully guided from start to disbursal.', '✅']].map(([num, title, desc, icon], i) => (
              <motion.div key={num} className="card-cosmic" style={{ position: 'relative', textAlign: 'center', padding: '32px 24px' }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(21,101,192,0.2)' }}>{icon}</div>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', background: '#1565C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, fontFamily: 'monospace' }}>{num}</div>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#7A90B8' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 6. LOAN AMOUNT SLIDER ── */}
      <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
        <IllustrationDots />
        <div className="w-full max-w-4xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 03 — ELIGIBILITY FINDER</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>How much do you need?</h2>
            <p style={{ color: '#7A90B8', fontSize: '14px', marginTop: '8px' }}>Drag the slider to see which lenders can give you that amount</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '24px', padding: 'clamp(20px,4vw,36px)', boxShadow: '0 8px 40px rgba(21,101,192,0.1)', border: '1px solid rgba(21,101,192,0.12)' }}>
            <LoanSlider />
          </div>
        </div>
      </Section>

      {/* ── 7. CIBIL SCORE GUIDE ── */}
      <Section className="home-section" style={{ background: '#fff' }}>
        <div className="w-full max-w-4xl mx-auto home-pad">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 04 — CIBIL GUIDE</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>What loan can you get?</h2>
            <p style={{ color: '#7A90B8', fontSize: '14px', marginTop: '8px' }}>Your CIBIL score determines which lenders approve you</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CIBIL_RANGES.map((c, i) => (
              <motion.div key={c.range} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '18px 20px', borderRadius: '16px', border: `1.5px solid ${c.color}22`, background: `${c.color}08` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: '80px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: c.color, fontFamily: 'JetBrains Mono,monospace' }}>{c.range}</div>
                    <div style={{ fontSize: '11px', color: c.color, fontWeight: 600 }}>{c.label}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ height: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${c.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{ height: '100%', borderRadius: '8px', background: c.color }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#7A90B8', marginTop: '4px' }}>{c.pct}% lenders available</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#3B5280', minWidth: '200px' }}>
                    <span style={{ fontWeight: 600 }}>Eligible: </span>{c.lenders}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/loans/no-cibil"><button className="btn-ghost" style={{ fontSize: '13px', padding: '10px 20px' }}>Low CIBIL options →</button></Link>
          </div>
        </div>
      </Section>

      {/* ── 8. LENDER COMPARISON TABLE ── */}
      <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
        <IllustrationDots />
        <div className="w-full max-w-5xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 05 — COMPARE</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>Side-by-side comparison</h2>
          </div>
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(21,101,192,0.1)', border: '1px solid rgba(21,101,192,0.12)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)' }}>
                    {['Lender', 'Rate', 'Max Loan', 'Min CIBIL', 'Approval', 'Best For'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'white', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_TABLE.map((l, i) => (
                    <tr key={l.name} style={{ borderBottom: '1px solid rgba(21,101,192,0.08)', background: i % 2 === 0 ? '#fff' : '#F8FAFF' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(21,101,192,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#F8FAFF'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{l.emoji}</span>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#0A1628' }}>{l.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#1565C0', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', fontSize: '14px' }}>{l.rate}</td>
                      <td style={{ padding: '14px 16px', color: '#3B5280', fontSize: '13px' }}>{l.max}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: l.cibil === 'Any' ? 'rgba(22,163,74,0.1)' : 'rgba(21,101,192,0.1)', color: l.cibil === 'Any' ? '#16a34a' : '#1565C0' }}>{l.cibil}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#3B5280', fontSize: '13px' }}>{l.time}</td>
                      <td style={{ padding: '14px 16px', color: '#7A90B8', fontSize: '13px' }}>{l.best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px 20px', textAlign: 'center', borderTop: '1px solid rgba(21,101,192,0.08)' }}>
              <Link to="/compare"><button className="btn-mint" style={{ fontSize: '13px', padding: '10px 24px' }}>See All 12 Lenders →</button></Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 9. LOAN ELIGIBILITY QUIZ ── */}
      <Section className="home-section" style={{ background: '#fff' }}>
        <div className="w-full max-w-2xl mx-auto home-pad">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 06 — QUICK QUIZ</div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>Which loan is right for you?</h2>
            <p style={{ color: '#7A90B8', fontSize: '14px', marginTop: '8px' }}>3 quick questions. Get a personalised lender recommendation.</p>
          </div>
          <div style={{ background: '#F8FAFF', borderRadius: '24px', padding: 'clamp(20px,4vw,40px)', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 40px rgba(21,101,192,0.08)' }}>
            <LoanQuiz />
          </div>
        </div>
      </Section>

      {/* ── CATEGORIES ── */}
      <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
        <IllustrationDots />
        <div className="w-full max-w-7xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ LOAN TYPES</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628', marginBottom: '28px' }}>Find loans by category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {CATEGORIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/loans/${c.slug}`} className="card-cosmic" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', padding: '16px 20px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)', flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0A1628', marginBottom: '2px' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: '#7A90B8' }}>{c.desc}</div>
                  </div>
                  <span style={{ color: '#1565C0', flexShrink: 0 }}>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CITIES ── */}
      <Section className="home-section" style={{ background: '#fff' }}>
        <div className="w-full max-w-7xl mx-auto home-pad">
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ BY CITY</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628', marginBottom: '28px' }}>Loans near you</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '12px' }}>
            {CITIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={`/loans-in/${c.slug}`} className="card-cosmic" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', padding: '24px 16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#0A1628' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: '#1565C0', marginTop: '4px', fontWeight: 500 }}>View lenders →</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 10. BLOG PREVIEW ── */}
      {blogs.length > 0 && (
        <Section className="home-section" style={{ background: '#F0F6FF', position: 'relative', overflow: 'hidden' }}>
          <IllustrationDots />
          <div className="w-full max-w-7xl mx-auto home-pad" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ 07 — FINANCIAL TIPS</div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628' }}>Learn before you borrow</h2>
              </div>
              <Link to="/blog"><button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>All articles →</button></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
              {blogs.map((b, i) => (
                <motion.div key={b.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${b.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="card-cosmic" style={{ height: '100%', overflow: 'hidden', padding: 0 }}>
                      <div style={{ height: '140px', background: 'linear-gradient(135deg,#1565C0,#0288D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {b.cover_image ? (
                          <img src={b.cover_image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        ) : (
                          <span style={{ fontSize: '40px', opacity: 0.4 }}>📰</span>
                        )}
                        <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}>{b.category}</span>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', lineHeight: 1.4, marginBottom: '10px' }}>{b.title}</h3>
                        {b.excerpt && <p style={{ fontSize: '13px', color: '#7A90B8', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.excerpt}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(21,101,192,0.08)' }}>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'JetBrains Mono,monospace' }}>{b.read_time} read</span>
                          <span style={{ fontSize: '12px', color: '#1565C0', fontWeight: 600 }}>Read more →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── TESTIMONIALS ── */}
      <Section className="home-section" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-15px', top: '30px', width: '120px', height: '120px' }}><IllustrationCoins /></div>
        <div className="w-full max-w-7xl mx-auto home-pad">
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ TESTIMONIALS</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 700, color: '#0A1628', marginBottom: '28px' }}>Real borrowers, real results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} className="card-cosmic" style={{ position: 'relative', overflow: 'hidden' }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#1565C0,#0288D1)', borderRadius: '16px 16px 0 0' }} />
                <div style={{ color: '#facc15', fontSize: '14px', marginBottom: '12px' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#3B5280', marginBottom: '16px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#7A90B8' }}>{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ + CTA SIDE BY SIDE ── */}
      <Section className="home-section" style={{ background: '#F0F6FF' }}>
        <div className="w-full max-w-7xl mx-auto home-pad">
          <div className="faq-cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>

            {/* LEFT — FAQ */}
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#1565C0', marginBottom: '8px' }}>/ FAQ</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, color: '#0A1628', marginBottom: '24px' }}>Common questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FAQS.map((f, i) => (
                  <motion.div key={i} className="card-cosmic" style={{ cursor: 'pointer', userSelect: 'none', overflow: 'hidden', background: '#fff' }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#0A1628' }}>{f.q}</span>
                      <motion.span style={{ color: '#1565C0', flexShrink: 0 }} animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}>▼</motion.span>
                    </div>
                    <motion.div initial={false} animate={{ height: faqOpen === i ? 'auto' : 0, opacity: faqOpen === i ? 1 : 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '14px', marginTop: '12px', lineHeight: 1.7, color: '#3B5280' }}>{f.a}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT — CTA Blue Box */}
            <div style={{ position: 'sticky', top: '80px' }}>
              <div style={{ borderRadius: '24px', padding: '40px 32px', position: 'relative', overflow: 'hidden', textAlign: 'center', background: 'linear-gradient(135deg,#1565C0,#0288D1)', boxShadow: '0 20px 60px rgba(21,101,192,0.3)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: '12px', top: '12px', width: '50px', height: '75px', opacity: 0.25 }}><IllustrationPhone /></div>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ GET STARTED NOW</div>
                  <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
                    Stop guessing.<br />Start comparing.
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                    Join 1.2 lakh+ Indians who found their best loan on TrueCreds.
                  </p>
                  <Link to="/apply">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      style={{ background: '#fff', color: '#1565C0', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: '100%' }}>
                      Check Eligibility — Free →
                    </motion.button>
                  </Link>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[['🔒','Zero CIBIL Impact'],['⚡','Result in 90 seconds'],['✅','100% Free to use']].map(([icon, text]) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '14px' }}>{icon}</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '16px' }}>TrueCreds is NOT a lender. No spam.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Section>

    </PageTransition>
  );
}
