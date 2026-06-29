import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

function fmtL(v) {
  if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v/1000).toFixed(0)}K`;
  return `₹${v}`;
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    let bal = amount;
    const schedule = [];
    for (let m = 1; m <= n; m++) {
      const interest = bal * r;
      const principal = emi - interest;
      bal = Math.max(0, bal - principal);
      if (m % Math.max(1, Math.floor(n/12)) === 0 || m === n)
        schedule.push({ month: m, balance: Math.round(bal) });
    }
    return { emi, totalPayment: emi * n, totalInterest: (emi * n) - amount, schedule };
  }, [amount, rate, tenure]);

  const principalPct = Math.round((amount / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(21,101,192,0.2)', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 4px 20px rgba(21,101,192,0.15)' }}>
        <div style={{ fontSize: '11px', color: '#7A90B8', marginBottom: '4px' }}>Month {payload[0]?.payload?.month}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1565C0', fontFamily: 'JetBrains Mono,monospace' }}>{fmtINR(payload[0]?.value)}</div>
        <div style={{ fontSize: '10px', color: '#94A3B8' }}>outstanding</div>
      </div>
    );
  };

  return (
    <PageTransition>
      <style>{`
        .emi-layout { display: grid; grid-template-columns: 400px 1fr; gap: 24px; align-items: start; }
        @media(max-width: 860px) { .emi-layout { grid-template-columns: 1fr; } }
        .emi-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        @media(max-width: 480px) { .emi-stats { grid-template-columns: 1fr; } }
        input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:5px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.35); }
      `}</style>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '48px 0 36px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>/ EMI CALCULATOR</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
            EMI Calculator
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Calculate your monthly instalment and total interest payable</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', minHeight: '80vh', padding: '32px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
          <div className="emi-layout">

            {/* ── LEFT — SLIDERS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)' }}>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#0A1628', marginBottom: '24px' }}>🎚️ Loan Parameters</h3>

                {/* Loan Amount */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loan Amount</label>
                    <span style={{ fontSize: '15px', color: '#1565C0', fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{fmtINR(amount)}</span>
                  </div>
                  <input type="range" min="5000" max="2000000" step="5000" value={amount} onChange={e => setAmount(+e.target.value)} data-testid="emi-amount-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>₹5K</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>₹20L</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Interest Rate</label>
                    <span style={{ fontSize: '15px', color: '#1565C0', fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{rate}% p.a.</span>
                  </div>
                  <input type="range" min="6" max="36" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>6%</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>36%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tenure</label>
                    <span style={{ fontSize: '15px', color: '#1565C0', fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{tenure} months</span>
                  </div>
                  <input type="range" min="3" max="84" step="3" value={tenure} onChange={e => setTenure(+e.target.value)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>3 mo</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>84 mo</span>
                  </div>
                </div>
              </div>

              <Link to="/apply" state={{ amount, rate, tenure }}
                style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 24px', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(21,101,192,0.3)' }}>
                Apply with these numbers →
              </Link>
            </div>

            {/* ── RIGHT — OUTPUT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} data-testid="emi-output">

              {/* 3 stat cards */}
              <div className="emi-stats">
                {[
                  { label: 'Monthly EMI', value: fmtINR(emi), color: '#1565C0', bg: '#EFF6FF', border: 'rgba(21,101,192,0.2)' },
                  { label: 'Total Interest', value: fmtINR(totalInterest), color: '#dc2626', bg: '#FEF2F2', border: 'rgba(220,38,38,0.2)' },
                  { label: 'Total Payable', value: fmtINR(totalPayment), color: '#0A1628', bg: '#F0F6FF', border: 'rgba(21,101,192,0.15)' },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: '16px', padding: '18px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(14px,3vw,20px)', fontWeight: 900, color: s.color, fontFamily: 'JetBrains Mono,monospace', lineHeight: 1.2, wordBreak: 'break-all', marginBottom: '6px' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '10px', color: '#7A90B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Principal vs Interest bar */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', marginBottom: '14px' }}>📊 Principal vs Interest</h3>
                <div style={{ height: '12px', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '10px' }}>
                  <div style={{ width: `${principalPct}%`, background: '#1565C0', transition: 'width 0.4s' }} />
                  <div style={{ width: `${interestPct}%`, background: '#dc2626', transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1565C0' }} />
                    <span style={{ fontSize: '12px', color: '#3B5280' }}>Principal <strong>{principalPct}%</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#dc2626' }} />
                    <span style={{ fontSize: '12px', color: '#3B5280' }}>Interest <strong>{interestPct}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', marginBottom: '16px' }}>📉 Outstanding Balance Over Time</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={schedule} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1565C0" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(21,101,192,0.08)" vertical={false} />
                      <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7A90B8' }} tickLine={false} />
                      <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7A90B8' }} tickFormatter={v => fmtL(v)} tickLine={false} axisLine={false} width={48} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="#1565C0" strokeWidth={2.5} fill="url(#blueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Repayment Summary — FIXED: proper colors, visible values */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', marginBottom: '16px' }}>📋 Repayment Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    ['Principal Amount', fmtINR(amount), '#1565C0'],
                    ['Total Interest', fmtINR(totalInterest), '#dc2626'],
                    ['Total Payment', fmtINR(totalPayment), '#0A1628'],
                    ['Loan Tenure', `${tenure} months (${(tenure/12).toFixed(1)} yrs)`, '#3B5280'],
                    ['Interest Burden', `${((totalInterest/amount)*100).toFixed(1)}% of principal`, '#d97706'],
                    ['Monthly EMI', fmtINR(emi), '#1565C0'],
                  ].map(([label, value, color], i, arr) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(21,101,192,0.08)' : 'none', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', color: '#7A90B8', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: '14px', color: color, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
