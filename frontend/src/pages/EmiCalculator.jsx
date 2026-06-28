import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtINR } from '../lib/api';

export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    let bal = amount;
    const schedule = [];
    for (let m = 1; m <= n; m++) {
      const interest = bal * r;
      const principal = emi - interest;
      bal = Math.max(0, bal - principal);
      if (m % Math.max(1, Math.floor(n/12)) === 0 || m === n) schedule.push({ month: m, balance: Math.round(bal) });
    }
    return { emi, totalPayment: emi * n, totalInterest: (emi * n) - amount, schedule };
  }, [amount, rate, tenure]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div className="card-cosmic text-xs p-3"><div className="text-slate-400">Month {payload[0]?.payload?.month}</div><div className="text-mint font-mono-nums">{fmtINR(payload[0]?.value)}</div><div className="text-slate-500">outstanding</div></div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="emi-calculator">
      <div className="mb-10">
        <div className="text-[10px] font-mono text-mint uppercase tracking-[0.2em] mb-2">/ EMI CALCULATOR</div>
        <h1 className="font-black text-3xl sm:text-4xl mb-2" style={{fontFamily:'Outfit,sans-serif'}}>EMI Calculator</h1>
        <p className="text-slate-400">Calculate your monthly instalment and total interest payable</p>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        {/* SLIDERS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-cosmic">
            <h3 className="font-semibold mb-6 text-slate-300">Loan Parameters</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Loan Amount</label>
                  <span className="font-mono-nums text-mint text-sm">{fmtINR(amount)}</span>
                </div>
                <input type="range" min="5000" max="5000000" step="5000" value={amount} onChange={e=>setAmount(+e.target.value)} className="w-full accent-mint" data-testid="emi-amount-slider" />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>₹5K</span><span>₹50L</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Interest Rate</label>
                  <span className="font-mono-nums text-mint text-sm">{rate}% p.a.</span>
                </div>
                <input type="range" min="6" max="36" step="0.5" value={rate} onChange={e=>setRate(+e.target.value)} className="w-full accent-mint" />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>6%</span><span>36%</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Tenure</label>
                  <span className="font-mono-nums text-mint text-sm">{tenure} months</span>
                </div>
                <input type="range" min="3" max="84" step="3" value={tenure} onChange={e=>setTenure(+e.target.value)} className="w-full accent-mint" />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>3m</span><span>84m</span></div>
              </div>
            </div>
          </div>
          <Link to="/apply" state={{ amount, rate, tenure }} className="btn-mint w-full justify-center">Apply with these numbers →</Link>
        </div>
        {/* OUTPUT */}
        <div className="lg:col-span-7 space-y-5" data-testid="emi-output">
          <div className="grid grid-cols-3 gap-4">
            {[['Monthly EMI', fmtINR(emi), 'text-mint'], ['Total Interest', fmtINR(totalInterest), 'text-red-400'], ['Total Payable', fmtINR(totalPayment), 'text-white']].map(([l,v,c]) => (
              <div key={l} className="card-cosmic text-center">
                <div className={`font-mono-nums text-xl font-bold mb-1 ${c}`}>{v}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
          <div className="card-cosmic">
            <h3 className="text-sm font-semibold mb-4 text-slate-300">Outstanding Balance Over Time</h3>
            <div style={{height:220}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schedule} margin={{top:5,right:10,left:10,bottom:5}}>
                  <defs>
                    <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF9D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00FF9D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" tick={{fontSize:10,fontFamily:'JetBrains Mono'}} tickLine={false} />
                  <YAxis stroke="#64748B" tick={{fontSize:10,fontFamily:'JetBrains Mono'}} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="balance" stroke="#00FF9D" strokeWidth={2} fill="url(#mintGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-cosmic">
            <h3 className="text-sm font-semibold mb-3 text-slate-300">Repayment Summary</h3>
            <div className="space-y-2">
              {[['Principal Amount', fmtINR(amount)], ['Total Interest', fmtINR(totalInterest)], ['Total Payment', fmtINR(totalPayment)], ['Loan Tenure', `${tenure} months (${Math.round(tenure/12*10)/10} years)`], ['Interest %', `${((totalInterest/amount)*100).toFixed(1)}% of principal`]].map(([l,v]) => (
                <div key={l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-xs text-slate-400">{l}</span>
                  <span className="text-xs font-mono-nums text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
