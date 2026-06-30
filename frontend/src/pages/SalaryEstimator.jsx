import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const LENDERS = [
  { name: 'Navi', emoji: '🚀', multiplier: 8, minSalary: 25000 },
  { name: 'Bajaj Finserv', emoji: '🏛️', multiplier: 10, minSalary: 35000 },
  { name: 'KreditBee', emoji: '🐝', multiplier: 5, minSalary: 15000 },
  { name: 'MoneyTap', emoji: '💧', multiplier: 6, minSalary: 20000 },
  { name: 'PaySense', emoji: '💼', multiplier: 6, minSalary: 18000 },
  { name: 'CASHe', emoji: '💸', multiplier: 5, minSalary: 18000 },
  { name: 'LazyPay', emoji: '⏱️', multiplier: 4, minSalary: 12000 },
  { name: 'FlexiLoans', emoji: '🧾', multiplier: 9, minSalary: 25000 },
];

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

export default function SalaryEstimator() {
  const [salary, setSalary] = useState(35000);

  const results = useMemo(() => {
    return LENDERS.map(l => ({
      ...l,
      eligible: salary >= l.minSalary,
      estimatedAmount: salary >= l.minSalary ? salary * l.multiplier : 0,
    })).sort((a, b) => b.estimatedAmount - a.estimatedAmount);
  }, [salary]);

  const maxEligible = results.filter(r => r.eligible);

  return (
    <PageTransition>
      <style>{`
        input[type=range] { -webkit-appearance:none; width:100%; height:6px; border-radius:6px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.4); }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ FREE TOOL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>💰 Salary-Based Loan Estimator</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>Enter your monthly salary to instantly see how much you can likely borrow from each lender.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#3B5280', fontWeight: 600 }}>Your Monthly Salary</span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#1565C0', fontFamily: 'Outfit,sans-serif' }}>{fmtINR(salary)}</span>
            </div>
            <input type="range" min="10000" max="300000" step="5000" value={salary} onChange={e => setSalary(Number(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>₹10K</span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>₹3L</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1565C0' }}>{maxEligible.length}</span>
            <span style={{ fontSize: '14px', color: '#3B5280' }}> of {LENDERS.length} lenders likely to approve you</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {results.map(l => (
              <div key={l.name} style={{
                background: l.eligible ? '#fff' : '#F8FAFC',
                border: `1.5px solid ${l.eligible ? 'rgba(21,101,192,0.15)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '16px', padding: '18px', opacity: l.eligible ? 1 : 0.5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{l.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628' }}>{l.name}</span>
                </div>
                {l.eligible ? (
                  <>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#1565C0', fontFamily: 'Outfit,sans-serif' }}>{fmtINR(l.estimatedAmount)}</div>
                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>✓ Estimated max amount</div>
                  </>
                ) : (
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Needs min ₹{l.minSalary.toLocaleString('en-IN')}/mo salary</div>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '20px', lineHeight: 1.7 }}>
            * Estimates are indicative based on typical income multipliers. Actual loan amount depends on CIBIL score, existing debts, employment type, and lender-specific underwriting.
          </p>

          <Link to="/compare">
            <button style={{ width: '100%', marginTop: '16px', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              See Full Lender Comparison →
            </button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
