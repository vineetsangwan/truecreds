import PageTransition from '../components/PageTransition';
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { api, fmtLakh } from '../lib/api';

export default function Compare() {
  const [loans, setLoans] = useState([]);
  const [minAmount, setMinAmount] = useState(10000);
  const [maxRate, setMaxRate] = useState(48);
  const [minCibil, setMinCibil] = useState(0);
  const [sort, setSort] = useState('rating');
  const [view, setView] = useState(window.innerWidth < 640 ? 'cards' : 'table');
  const [filtersOpen, setFiltersOpen] = useState(window.innerWidth >= 900);

  useEffect(() => { api.get('/api/loan-apps').then(r => setLoans(r.data)).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    return loans
      .filter(l => l.loan_amount_max >= minAmount && l.interest_rate_min <= maxRate && (l.min_cibil <= minCibil || l.min_cibil === 0))
      .sort((a, b) => sort === 'rate' ? a.interest_rate_min - b.interest_rate_min : sort === 'amount' ? b.loan_amount_max - a.loan_amount_max : b.rating - a.rating);
  }, [loans, minAmount, maxRate, minCibil, sort]);

  const fmtAmt = v => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
    return `₹${v}`;
  };

  return (
    <PageTransition>
      <style>{`
        .compare-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
        .compare-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        @media(max-width: 900px) {
          .compare-layout { grid-template-columns: 1fr; }
          .compare-sidebar { position: static !important; }
        }
        @media(max-width: 540px) { .compare-cards { grid-template-columns: 1fr; } }
        @media(max-width: 640px) {
          .filter-card { padding: 16px !important; }
          .filter-sliders { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .sort-buttons { display: flex !important; flex-direction: row !important; flex-wrap: wrap; gap: 8px; }
          .sort-buttons button { flex: 1; min-width: 100px; font-size: 11px !important; padding: 8px 10px !important; }
          .view-toggle { display: flex; gap: 8px; }
          .view-toggle button { flex: 1; }
        }
        .compare-table { width: 100%; border-collapse: collapse; }
        .compare-table th { padding: 12px 14px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #fff; font-weight: 700; background: linear-gradient(135deg,#1565C0,#0288D1); white-space: nowrap; }
        .compare-table td { padding: 14px; font-size: 13px; color: #3B5280; border-bottom: 1px solid rgba(21,101,192,0.07); vertical-align: middle; }
        .compare-table tr:hover td { background: rgba(21,101,192,0.04); }
        .compare-table tr.best-row td { background: rgba(21,101,192,0.06); }
        input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:5px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.4); }
      `}</style>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '48px 0 36px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>/ COMPARE ALL LENDERS</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '8px', lineHeight: 1.15 }}>
            Compare All Loan Apps
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
            Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> of {loans.length} lenders — sorted by {sort === 'rate' ? 'lowest rate' : sort === 'amount' ? 'highest amount' : 'best rating'}
          </p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', minHeight: '80vh', padding: '32px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          {/* Mobile filter toggle */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setFiltersOpen(f => !f)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.3)', background: filtersOpen ? 'rgba(21,101,192,0.08)' : '#fff', color: '#1565C0', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              🎛️ {filtersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <span style={{ fontSize: '13px', color: '#7A90B8' }}>
              <strong style={{ color: '#1565C0' }}>{filtered.length}</strong> of {loans.length} lenders
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              {[['table','📋'],['cards','🃏']].map(([val, icon]) => (
                <button key={val} onClick={() => setView(val)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: `1.5px solid ${view === val ? '#1565C0' : 'rgba(21,101,192,0.2)'}`, background: view === val ? '#1565C0' : '#fff', color: view === val ? '#fff' : '#3B5280', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  {icon} {val === 'table' ? 'Table' : 'Cards'}
                </button>
              ))}
            </div>
          </div>

          <div className="compare-layout">

            {/* ── FILTERS SIDEBAR ── */}
            <aside style={{ display: filtersOpen ? 'block' : 'none' }}>
              <div className="filter-card" style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.06)', position: 'sticky', top: '80px' }}>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#0A1628', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎛️ Filters
                </h3>

                {/* Min Loan Amount — max 20L */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Loan Amount</label>
                    <span style={{ fontSize: '13px', color: '#1565C0', fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{fmtAmt(minAmount)}</span>
                  </div>
                  <input type="range" min="1000" max="2000000" step="10000" value={minAmount} onChange={e => setMinAmount(+e.target.value)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>₹1K</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>₹20L</span>
                  </div>
                </div>

                {/* Max Interest Rate */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Interest Rate</label>
                    <span style={{ fontSize: '14px', color: '#1565C0', fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', background: 'rgba(21,101,192,0.08)', padding: '2px 8px', borderRadius: '6px' }}>{maxRate}%</span>
                  </div>
                  <input type="range" min="9" max="48" step="1" value={maxRate} onChange={e => setMaxRate(+e.target.value)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>9%</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>48%</span>
                  </div>
                </div>

                {/* CIBIL Score */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your CIBIL Score</label>
                    <span style={{ fontSize: '14px', color: '#1565C0', fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', background: 'rgba(21,101,192,0.08)', padding: '2px 8px', borderRadius: '6px' }}>{minCibil === 0 ? 'Any' : minCibil}</span>
                  </div>
                  <input type="range" min="0" max="900" step="10" value={minCibil} onChange={e => setMinCibil(+e.target.value)} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>Any</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>900</span>
                  </div>
                </div>

                {/* Sort */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Sort By</label>
                  <div className="sort-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[['rating','⭐ Best Rated'],['rate','📉 Lowest Rate'],['amount','💰 Highest Amount']].map(([val, label]) => (
                      <button key={val} onClick={() => setSort(val)}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${sort === val ? '#1565C0' : 'rgba(21,101,192,0.15)'}`, background: sort === val ? 'rgba(21,101,192,0.08)' : 'transparent', color: sort === val ? '#1565C0' : '#3B5280', fontSize: '13px', fontWeight: sort === val ? 700 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View toggle */}
                <div>
                  <label style={{ fontSize: '12px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>View</label>
                  <div className="view-toggle" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[['table','📋 Table'],['cards','🃏 Cards']].map(([val, label]) => (
                      <button key={val} onClick={() => setView(val)}
                        style={{ padding: '8px', borderRadius: '8px', border: `1.5px solid ${view === val ? '#1565C0' : 'rgba(21,101,192,0.15)'}`, background: view === val ? '#1565C0' : 'transparent', color: view === val ? '#fff' : '#3B5280', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button onClick={() => { setMinAmount(10000); setMaxRate(48); setMinCibil(0); setSort('rating'); }}
                  style={{ width: '100%', marginTop: '16px', padding: '10px', borderRadius: '10px', border: '1px solid rgba(21,101,192,0.2)', background: 'transparent', color: '#7A90B8', fontSize: '12px', cursor: 'pointer' }}>
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* ── RESULTS ── */}
            <main>
              {filtered.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '20px', padding: '60px 24px', textAlign: 'center', border: '1px solid rgba(21,101,192,0.12)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#0A1628', marginBottom: '8px' }}>No lenders match your filters</h3>
                  <p style={{ color: '#7A90B8', fontSize: '14px' }}>Try relaxing your filters to see more options.</p>
                </div>
              ) : view === 'cards' ? (
                /* CARDS VIEW */
                <div className="compare-cards">
                  {filtered.map((loan, i) => (
                    <motion.div key={loan.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: i === 0 ? '2px solid rgba(21,101,192,0.4)' : '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, border: '1px solid rgba(21,101,192,0.15)' }}>{loan.logo_emoji}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {loan.name}
                              {i === 0 && <span style={{ background: '#1565C0', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>BEST</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: '#7A90B8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.best_for}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#1565C0', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{loan.interest_rate_min}%</div>
                          <div style={{ fontSize: '9px', color: '#7A90B8', textTransform: 'uppercase' }}>p.a. from</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', background: '#F0F6FF', borderRadius: '10px', padding: '10px' }}>
                        {[['Range',`${fmtLakh(loan.loan_amount_min)}–${fmtLakh(loan.loan_amount_max)}`],['Approval',loan.approval_time],['CIBIL',loan.min_cibil===0?'Any':loan.min_cibil]].map(([l,v])=>(
                          <div key={l}><div style={{ fontSize: '9px', color: '#7A90B8', textTransform: 'uppercase', marginBottom: '2px' }}>{l}</div><div style={{ fontSize: '11px', fontWeight: 600, color: '#0A1628', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</div></div>
                        ))}
                      </div>
                      <a href={loan.apply_url} target="_blank" rel="noopener noreferrer sponsored"
                        style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '13px', padding: '11px', borderRadius: '10px', textDecoration: 'none' }}>
                        Apply Now →
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* TABLE VIEW */
                <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="compare-table" style={{ minWidth: '700px' }}>
                      <thead>
                        <tr>
                          {['Lender', 'Interest', 'Range', 'Tenure', 'Approval', 'CIBIL', 'Rating', ''].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((loan, i) => (
                          <tr key={loan.id} className={i === 0 ? 'best-row' : ''}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
                                <span style={{ fontSize: '22px', flexShrink: 0 }}>{loan.logo_emoji}</span>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A1628', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    {loan.name}
                                    {i === 0 && <span style={{ background: '#1565C0', color: '#fff', fontSize: '8px', padding: '2px 5px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>BEST</span>}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#7A90B8', marginTop: '2px', whiteSpace: 'nowrap' }}>{loan.best_for}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'JetBrains Mono,monospace', color: '#1565C0', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {loan.interest_rate_min}–{loan.interest_rate_max}%
                            </td>
                            <td style={{ whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px' }}>
                              {fmtLakh(loan.loan_amount_min)}–{fmtLakh(loan.loan_amount_max)}
                            </td>
                            <td style={{ whiteSpace: 'nowrap', color: '#7A90B8', fontSize: '12px' }}>
                              {loan.tenure_min_months}–{loan.tenure_max_months}m
                            </td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{loan.approval_time}</td>
                            <td>
                              <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, background: loan.min_cibil === 0 ? 'rgba(22,163,74,0.1)' : 'rgba(21,101,192,0.1)', color: loan.min_cibil === 0 ? '#16a34a' : '#1565C0', whiteSpace: 'nowrap' }}>
                                {loan.min_cibil === 0 ? 'Any' : loan.min_cibil}
                              </span>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <span style={{ color: '#F59E0B' }}>★</span>
                              <span style={{ fontWeight: 600, fontSize: '13px', marginLeft: '4px', color: '#0A1628' }}>{loan.rating}</span>
                            </td>
                            <td>
                              <a href={loan.apply_url} target="_blank" rel="noopener noreferrer sponsored"
                                style={{ display: 'inline-block', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                Apply →
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
