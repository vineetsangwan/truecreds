import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

export default function RealCostCalculator() {
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(14);
  const [tenure, setTenure] = useState(24);
  const [processingFeePct, setProcessingFeePct] = useState(2);
  const [gstPct] = useState(18); // GST on processing fee, standard in India
  const [insuranceFee, setInsuranceFee] = useState(2000);

  const calc = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    const totalEmiPaid = emi * n;
    const interestPaid = totalEmiPaid - amount;

    const processingFee = amount * (processingFeePct / 100);
    const gstOnFee = processingFee * (gstPct / 100);
    const totalUpfrontFees = processingFee + gstOnFee + insuranceFee;

    const realTotalCost = totalEmiPaid + totalUpfrontFees;
    const realCostPct = ((realTotalCost - amount) / amount) * 100;
    const effectiveRate = (Math.pow(realTotalCost / amount, 12 / tenure) - 1) * 100;

    return { emi, totalEmiPaid, interestPaid, processingFee, gstOnFee, totalUpfrontFees, realTotalCost, realCostPct, effectiveRate };
  }, [amount, rate, tenure, processingFeePct, gstPct, insuranceFee]);

  return (
    <PageTransition>
      <style>{`
        .rc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width: 760px) { .rc-grid { grid-template-columns: 1fr; } }
        input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:5px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.35); }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ TRANSPARENCY TOOL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>💯 Real Cost of Loan Calculator</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '600px' }}>Most calculators only show EMI. We show the TRUE total cost — including processing fees, GST, and insurance addons.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div className="rc-grid">

            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)' }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#0A1628', marginBottom: '24px' }}>🎚️ Loan Details</h3>
              {[
                { label: 'Loan Amount', val: amount, set: setAmount, min: 10000, max: 2000000, step: 10000, fmt: v => `₹${(v/100000).toFixed(1)}L` },
                { label: 'Interest Rate', val: rate, set: setRate, min: 6, max: 36, step: 0.5, fmt: v => `${v}% p.a.` },
                { label: 'Tenure (months)', val: tenure, set: setTenure, min: 3, max: 84, step: 3, fmt: v => `${v} mo` },
                { label: 'Processing Fee %', val: processingFeePct, set: setProcessingFeePct, min: 0, max: 5, step: 0.25, fmt: v => `${v}%` },
                { label: 'Insurance/Other Fees', val: insuranceFee, set: setInsuranceFee, min: 0, max: 20000, step: 500, fmt: v => `₹${v.toLocaleString('en-IN')}` },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#3B5280', fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: '14px', color: '#1565C0', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{s.fmt(s.val)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', borderRadius: '20px', padding: '24px', color: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>True Total Cost</div>
                <div style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, fontFamily: 'Outfit,sans-serif' }}>{fmtINR(calc.realTotalCost)}</div>
                <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '6px' }}>That's {calc.realCostPct.toFixed(1)}% more than what you borrowed</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.1)' }}>
                <h4 style={{ fontWeight: 700, fontSize: '13px', color: '#0A1628', marginBottom: '14px' }}>📋 Full Cost Breakdown</h4>
                {[
                  ['Principal Borrowed', fmtINR(amount), '#0A1628'],
                  ['EMI Interest', fmtINR(calc.interestPaid), '#dc2626'],
                  ['Processing Fee', fmtINR(calc.processingFee), '#d97706'],
                  ['GST on Processing Fee (18%)', fmtINR(calc.gstOnFee), '#d97706'],
                  ['Insurance/Other Fees', fmtINR(insuranceFee), '#d97706'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,101,192,0.06)' }}>
                    <span style={{ fontSize: '12px', color: '#7A90B8' }}>{l}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: c, fontFamily: 'JetBrains Mono,monospace' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A1628' }}>Total Real Cost</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#1565C0', fontFamily: 'JetBrains Mono,monospace' }}>{fmtINR(calc.realTotalCost)}</span>
                </div>
              </div>

              <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#92400E', lineHeight: 1.6 }}>
                  <strong>Effective Annual Rate: {calc.effectiveRate.toFixed(1)}%</strong> — this accounts for ALL fees, not just the advertised interest rate of {rate}%.
                </div>
              </div>

              <Link to="/compare">
                <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Compare Lenders with Lowest True Cost →
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
