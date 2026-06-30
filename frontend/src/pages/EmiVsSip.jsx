import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

export default function EmiVsSip() {
  const [amount, setAmount] = useState(300000);
  const [loanRate, setLoanRate] = useState(14);
  const [tenure, setTenure] = useState(24);
  const [sipReturn, setSipReturn] = useState(12);

  const calc = useMemo(() => {
    // Loan EMI calculation
    const r = loanRate / 12 / 100;
    const n = tenure;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    const totalLoanCost = emi * n;
    const loanInterestPaid = totalLoanCost - amount;

    // SIP calculation - if instead of taking loan, you invest the EMI amount monthly
    const sr = sipReturn / 12 / 100;
    const sipFutureValue = sr === 0 ? emi * n : emi * ((Math.pow(1+sr, n) - 1) / sr) * (1+sr);

    // Opportunity cost: if you had the amount as savings instead of taking loan, what would it grow to
    const lumpsumFutureValue = amount * Math.pow(1 + sipReturn/100, tenure/12);
    const opportunityCost = lumpsumFutureValue - amount;

    return { emi, totalLoanCost, loanInterestPaid, sipFutureValue, opportunityCost, lumpsumFutureValue };
  }, [amount, loanRate, tenure, sipReturn]);

  const verdict = calc.loanInterestPaid > calc.opportunityCost
    ? { text: 'Taking the loan costs you more than investing would have earned', color: '#dc2626', icon: '⚠️' }
    : { text: 'The loan cost is reasonable compared to potential investment returns', color: '#16a34a', icon: '✅' };

  return (
    <PageTransition>
      <style>{`
        .evs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width: 760px) { .evs-grid { grid-template-columns: 1fr; } }
        input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:5px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.35); }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ FREE TOOL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📊 Loan vs Investment Calculator</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '600px' }}>Should you take this loan, or invest your money instead? Compare the real cost of borrowing against potential SIP returns.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div className="evs-grid">

            {/* Inputs */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)' }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#0A1628', marginBottom: '24px' }}>🎚️ Your Numbers</h3>
              {[
                { label: 'Loan Amount', val: amount, set: setAmount, min: 10000, max: 2000000, step: 10000, fmt: v => `₹${(v/100000).toFixed(1)}L` },
                { label: 'Loan Interest Rate', val: loanRate, set: setLoanRate, min: 6, max: 36, step: 0.5, fmt: v => `${v}% p.a.` },
                { label: 'Tenure (months)', val: tenure, set: setTenure, min: 3, max: 84, step: 3, fmt: v => `${v} mo` },
                { label: 'Expected SIP Return', val: sipReturn, set: setSipReturn, min: 6, max: 20, step: 0.5, fmt: v => `${v}% p.a.` },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#3B5280', fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: '14px', color: '#1565C0', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{s.fmt(s.val)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} />
                </div>
              ))}
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', lineHeight: 1.6 }}>* SIP returns are market-linked and not guaranteed. Mutual fund investments are subject to market risks.</p>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Verdict */}
              <div style={{ background: `${verdict.color}10`, border: `1.5px solid ${verdict.color}40`, borderRadius: '16px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px' }}>{verdict.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: verdict.color, marginBottom: '4px' }}>Verdict</div>
                  <div style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.6 }}>{verdict.text}</div>
                </div>
              </div>

              {/* Loan side */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(220,38,38,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h4 style={{ fontWeight: 700, fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>🏦 If You Take The Loan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    ['Monthly EMI', fmtINR(calc.emi)],
                    ['Total Interest Paid', fmtINR(calc.loanInterestPaid)],
                    ['Total Amount Repaid', fmtINR(calc.totalLoanCost)],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#7A90B8' }}>{l}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1628', fontFamily: 'JetBrains Mono,monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment side */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(22,163,74,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h4 style={{ fontWeight: 700, fontSize: '13px', color: '#16a34a', marginBottom: '12px' }}>📈 If You Invest Instead</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    ['SIP of EMI Amount Grows To', fmtINR(calc.sipFutureValue)],
                    ['Lumpsum Amount Grows To', fmtINR(calc.lumpsumFutureValue)],
                    ['Opportunity Cost', fmtINR(calc.opportunityCost)],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#7A90B8' }}>{l}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1628', fontFamily: 'JetBrains Mono,monospace' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/compare">
                <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Compare Lenders If You Decide to Borrow →
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
