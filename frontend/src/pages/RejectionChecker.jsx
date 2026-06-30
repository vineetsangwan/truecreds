import PageTransition from '../components/PageTransition';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LENDERS = [
  { name: 'Navi', emoji: '🚀', minCibil: 650, minIncome: 25000, employment: ['Salaried'], maxAge: 58 },
  { name: 'Bajaj Finserv', emoji: '🏛️', minCibil: 720, minIncome: 35000, employment: ['Salaried', 'Self-employed'], maxAge: 60 },
  { name: 'Credila', emoji: '📚', minCibil: 680, minIncome: 30000, employment: ['Salaried'], maxAge: 55 },
  { name: 'KreditBee', emoji: '🐝', minCibil: 0, minIncome: 15000, employment: ['Salaried', 'Self-employed', 'Freelancer', 'Student'], maxAge: 58 },
  { name: 'MoneyTap', emoji: '💧', minCibil: 600, minIncome: 20000, employment: ['Salaried', 'Self-employed'], maxAge: 55 },
  { name: 'mPokket', emoji: '🎓', minCibil: 0, minIncome: 0, employment: ['Student'], maxAge: 30 },
  { name: 'LazyPay', emoji: '⏱️', minCibil: 0, minIncome: 12000, employment: ['Salaried', 'Self-employed', 'Freelancer'], maxAge: 55 },
  { name: 'CASHe', emoji: '💸', minCibil: 600, minIncome: 18000, employment: ['Salaried'], maxAge: 55 },
  { name: 'PaySense', emoji: '💼', minCibil: 600, minIncome: 18000, employment: ['Salaried', 'Self-employed'], maxAge: 56 },
  { name: 'FlexiLoans', emoji: '🧾', minCibil: 650, minIncome: 25000, employment: ['Self-employed'], maxAge: 60 },
];

const EMPLOYMENT_OPTIONS = ['Salaried', 'Self-employed', 'Freelancer', 'Student', 'Unemployed'];

function analyze(form) {
  const cibil = form.cibil === 'no-score' ? 0 : parseInt(form.cibil);
  const income = parseInt(form.income) || 0;
  const age = parseInt(form.age) || 25;

  const eligible = [];
  const rejected = [];

  LENDERS.forEach(l => {
    const reasons = [];
    if (cibil < l.minCibil) reasons.push(`CIBIL too low (need ${l.minCibil}+, you have ${cibil === 0 ? 'no score' : cibil})`);
    if (income < l.minIncome) reasons.push(`Income too low (need ₹${l.minIncome.toLocaleString('en-IN')}+, you have ₹${income.toLocaleString('en-IN')})`);
    if (!l.employment.includes(form.employment)) reasons.push(`Doesn't accept ${form.employment} applicants`);
    if (age > l.maxAge) reasons.push(`Age limit exceeded (max ${l.maxAge}, you are ${age})`);

    if (reasons.length === 0) eligible.push(l);
    else rejected.push({ ...l, reasons });
  });

  // General rejection reasons based on profile
  const generalIssues = [];
  if (cibil > 0 && cibil < 600) generalIssues.push({ icon: '📉', title: 'Low CIBIL Score', desc: `A score of ${cibil} signals high risk to most lenders. Scores below 600 face rejection from 70%+ of NBFCs.` });
  if (cibil === 0) generalIssues.push({ icon: '❓', title: 'No Credit History', desc: 'With no CIBIL score, traditional lenders cannot assess your risk. You\'ll need lenders specifically built for first-time borrowers.' });
  if (income > 0 && income < 15000) generalIssues.push({ icon: '💰', title: 'Income Below Minimum Threshold', desc: 'Most lenders require ₹15,000+ monthly income to ensure repayment capacity. Your current income limits your options significantly.' });
  if (form.employment === 'Unemployed') generalIssues.push({ icon: '🚫', title: 'No Employment Income', desc: 'Almost all lenders require proof of regular income. Without employment, approval odds are very low across the board.' });
  if (form.employment === 'Freelancer') generalIssues.push({ icon: '📊', title: 'Irregular Income Risk', desc: 'Freelance income is harder to verify and predict. Lenders often ask for 6-12 months of bank statements to prove stability.' });
  if (age > 55) generalIssues.push({ icon: '🎂', title: 'Approaching Age Limits', desc: 'Most lenders cap loan tenure to end before retirement age (typically 60). This limits your maximum tenure options.' });

  return { eligible, rejected, generalIssues, cibil, income };
}

export default function RejectionChecker() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ cibil: '', income: '', employment: '', age: '' });
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    setResult(analyze(form));
    setStep(4);
  };

  const reset = () => {
    setForm({ cibil: '', income: '', employment: '', age: '' });
    setResult(null);
    setStep(0);
  };

  return (
    <PageTransition>
      <style>{`
        .rc-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1.5px solid rgba(21,101,192,0.2); background: #F8FAFF; font-size: 15px; color: #0A1628; outline: none; box-sizing: border-box; font-family: inherit; }
        .rc-input:focus { border-color: #1565C0; background: #fff; box-shadow: 0 0 0 3px rgba(21,101,192,0.08); }
        .rc-chip { padding: 12px 18px; border-radius: 12px; border: 1.5px solid rgba(21,101,192,0.2); background: #F8FAFF; font-size: 14px; font-weight: 500; color: #3B5280; cursor: pointer; transition: all 0.15s; text-align: center; }
        .rc-chip.active { background: #1565C0; border-color: #1565C0; color: #fff; font-weight: 700; }
      `}</style>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ FREE TOOL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>
            🔍 Loan Rejection Checker
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            Find out exactly why you might get rejected — and which lenders are most likely to approve you instead.
          </p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px', minHeight: '60vh' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>

          <AnimatePresence mode="wait">

            {/* STEP 0 — CIBIL */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= step ? '#1565C0' : 'rgba(21,101,192,0.12)' }} />)}
                </div>
                <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px' }}>Step 1 of 4</div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '20px' }}>What is your CIBIL score?</h2>
                <input type="number" className="rc-input" placeholder="e.g. 720" value={form.cibil === 'no-score' ? '' : form.cibil}
                  onChange={e => setForm(p => ({ ...p, cibil: e.target.value }))} style={{ marginBottom: '12px' }} />
                <button onClick={() => setForm(p => ({ ...p, cibil: 'no-score' }))}
                  style={{ background: 'none', border: 'none', color: '#1565C0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}>
                  I don't know / no credit history →
                </button>
                <button onClick={() => setStep(1)} disabled={form.cibil === ''}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: form.cibil === '' ? '#CBD5E1' : 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: form.cibil === '' ? 'not-allowed' : 'pointer' }}>
                  Continue →
                </button>
              </motion.div>
            )}

            {/* STEP 1 — Income */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= step ? '#1565C0' : 'rgba(21,101,192,0.12)' }} />)}
                </div>
                <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px' }}>Step 2 of 4</div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '20px' }}>What is your monthly income?</h2>
                <input type="number" className="rc-input" placeholder="e.g. 35000" value={form.income}
                  onChange={e => setForm(p => ({ ...p, income: e.target.value }))} style={{ marginBottom: '24px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(0)} style={{ padding: '14px 20px', borderRadius: '12px', border: '1.5px solid rgba(21,101,192,0.2)', background: 'transparent', color: '#3B5280', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => setStep(2)} disabled={form.income === ''}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: form.income === '' ? '#CBD5E1' : 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: form.income === '' ? 'not-allowed' : 'pointer' }}>
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Employment */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= step ? '#1565C0' : 'rgba(21,101,192,0.12)' }} />)}
                </div>
                <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px' }}>Step 3 of 4</div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '20px' }}>What is your employment type?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                  {EMPLOYMENT_OPTIONS.map(opt => (
                    <div key={opt} className={`rc-chip ${form.employment === opt ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, employment: opt }))}>
                      {opt}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(1)} style={{ padding: '14px 20px', borderRadius: '12px', border: '1.5px solid rgba(21,101,192,0.2)', background: 'transparent', color: '#3B5280', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => setStep(3)} disabled={!form.employment}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: !form.employment ? '#CBD5E1' : 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: !form.employment ? 'not-allowed' : 'pointer' }}>
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Age */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= step ? '#1565C0' : 'rgba(21,101,192,0.12)' }} />)}
                </div>
                <div style={{ fontSize: '11px', color: '#1565C0', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px' }}>Step 4 of 4</div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '20px' }}>What is your age?</h2>
                <input type="number" className="rc-input" placeholder="e.g. 28" value={form.age}
                  onChange={e => setForm(p => ({ ...p, age: e.target.value }))} style={{ marginBottom: '24px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(2)} style={{ padding: '14px 20px', borderRadius: '12px', border: '1.5px solid rgba(21,101,192,0.2)', background: 'transparent', color: '#3B5280', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                  <button onClick={handleSubmit} disabled={form.age === ''}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: form.age === '' ? '#CBD5E1' : 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: form.age === '' ? 'not-allowed' : 'pointer' }}>
                    Check My Results →
                  </button>
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {step === 4 && result && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Summary */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)', marginBottom: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{result.eligible.length > 0 ? '✅' : '⚠️'}</div>
                  <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '22px', color: '#0A1628', marginBottom: '6px' }}>
                    {result.eligible.length > 0 ? `${result.eligible.length} Lenders Likely to Approve You` : 'No Lenders Match Your Profile Yet'}
                  </h2>
                  <p style={{ color: '#7A90B8', fontSize: '14px' }}>
                    {result.eligible.length > 0 ? "Based on your profile, here's what we found:" : "Here's what's holding you back — and how to fix it:"}
                  </p>
                </div>

                {/* Why you might be rejected */}
                {result.generalIssues.length > 0 && (
                  <div style={{ background: '#FFFBEB', borderRadius: '20px', padding: '24px', border: '1.5px solid #FCD34D', marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#92400E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>⚠️ Why You Might Get Rejected</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {result.generalIssues.map((issue, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ fontSize: '20px', flexShrink: 0 }}>{issue.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400E', marginBottom: '2px' }}>{issue.title}</div>
                            <div style={{ fontSize: '13px', color: '#B45309', lineHeight: 1.6 }}>{issue.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligible lenders */}
                {result.eligible.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '12px' }}>✅ Lenders Likely to Approve</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px' }}>
                      {result.eligible.map(l => (
                        <div key={l.name} style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '24px' }}>{l.emoji}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#14532D' }}>{l.name}</div>
                            <div style={{ fontSize: '11px', color: '#16A34A' }}>✓ Strong match</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lenders to avoid */}
                {result.rejected.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '12px' }}>❌ Lenders to Avoid (Won't Approve)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.rejected.map(l => (
                        <div key={l.name} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '18px' }}>{l.emoji}</span>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: '#991B1B' }}>{l.name}</span>
                          </div>
                          {l.reasons.map((r, i) => (
                            <div key={i} style={{ fontSize: '12px', color: '#B91C1C', marginLeft: '26px', marginBottom: '2px' }}>• {r}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {result.eligible.length > 0 && (
                    <Link to="/compare" style={{ flex: 1, minWidth: '160px' }}>
                      <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                        Compare Eligible Lenders →
                      </button>
                    </Link>
                  )}
                  <button onClick={reset} style={{ flex: 1, minWidth: '160px', padding: '14px', borderRadius: '12px', border: '1.5px solid #1565C0', background: 'transparent', color: '#1565C0', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                    Check Again
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
