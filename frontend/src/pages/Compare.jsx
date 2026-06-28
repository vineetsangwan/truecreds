import PageTransition from '../components/PageTransition';
import React, { useEffect, useState, useMemo } from 'react';
import { api, fmtLakh } from '../lib/api';

export default function Compare() {
  const [loans, setLoans] = useState([]);
  const [minAmount, setMinAmount] = useState(1000);
  const [maxRate, setMaxRate] = useState(48);
  const [minCibil, setMinCibil] = useState(0);
  const [sort, setSort] = useState('rating');

  useEffect(() => { api.get('/api/loan-apps').then(r => setLoans(r.data)); }, []);

  const filtered = useMemo(() => {
    return loans.filter(l => l.loan_amount_max >= minAmount && l.interest_rate_min <= maxRate && l.min_cibil <= minCibil || l.min_cibil === 0)
      .sort((a,b) => sort === 'rate' ? a.interest_rate_min - b.interest_rate_min : sort === 'amount' ? b.loan_amount_max - a.loan_amount_max : b.rating - a.rating);
  }, [loans, minAmount, maxRate, minCibil, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="comparison-table">
      <div className="mb-10">
        <div className="text-[10px] font-mono text-mint uppercase tracking-[0.2em] mb-2">/ COMPARE</div>
        <h1 className="font-black text-3xl sm:text-4xl mb-2" style={{fontFamily:'Outfit,sans-serif'}}>Compare All Lenders</h1>
        <p className="text-slate-400">Showing <span className="text-mint font-mono-nums">{filtered.length}</span> of {loans.length} lenders</p>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        {/* FILTERS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card-cosmic">
            <h3 className="font-semibold text-sm mb-5 uppercase tracking-wider text-slate-300">Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Min Loan: {fmtLakh(minAmount)}</label>
                <input type="range" min="1000" max="4000000" step="10000" value={minAmount} onChange={e=>setMinAmount(+e.target.value)} className="w-full accent-mint" data-testid="filter-amount-slider" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Max Interest: {maxRate}%</label>
                <input type="range" min="9" max="48" step="1" value={maxRate} onChange={e=>setMaxRate(+e.target.value)} className="w-full accent-mint" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Your CIBIL: {minCibil === 0 ? 'Any' : minCibil}</label>
                <input type="range" min="0" max="900" step="10" value={minCibil} onChange={e=>setMinCibil(+e.target.value)} className="w-full accent-mint" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Sort By</label>
                <select className="input-cosmic" value={sort} onChange={e=>setSort(e.target.value)} data-testid="sort-select">
                  <option value="rating">Best Rated</option>
                  <option value="rate">Lowest Rate</option>
                  <option value="amount">Highest Amount</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* TABLE */}
        <div className="lg:col-span-9 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                {['Lender','Interest','Range','Tenure','Approval','CIBIL','Rating',''].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan, i) => (
                <tr key={loan.id} className={`border-b border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(0,255,157,0.03)] ${i===0 ? 'bg-[rgba(0,255,157,0.05)]' : ''}`} data-testid={`compare-row-${loan.id}`}>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{loan.logo_emoji}</span>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {loan.name}
                          {i===0 && <span className="badge-mint text-[9px] py-0.5">BEST</span>}
                        </div>
                        <div className="text-[10px] text-slate-500">{loan.best_for}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 font-mono-nums text-mint text-sm">{loan.interest_rate_min}–{loan.interest_rate_max}%</td>
                  <td className="py-4 px-3 font-mono-nums text-xs">{fmtLakh(loan.loan_amount_min)}–{fmtLakh(loan.loan_amount_max)}</td>
                  <td className="py-4 px-3 text-xs text-slate-400">{loan.tenure_min_months}–{loan.tenure_max_months}m</td>
                  <td className="py-4 px-3 text-xs">{loan.approval_time}</td>
                  <td className="py-4 px-3 font-mono-nums text-xs">{loan.min_cibil === 0 ? 'Any' : loan.min_cibil}</td>
                  <td className="py-4 px-3 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-mono-nums text-xs ml-1">{loan.rating}</span>
                  </td>
                  <td className="py-4 px-3">
                    <a href={loan.apply_url} target="_blank" rel="noopener noreferrer sponsored" className="btn-mint py-1.5 px-3 text-xs" data-testid={`compare-apply-${loan.id}`}>Apply →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
