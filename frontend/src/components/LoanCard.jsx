import React from 'react';
import { fmtLakh } from '../lib/api';
import { motion } from 'framer-motion';

export default function LoanCard({ loan, index = 0, highlight = false }) {
  const rating = Math.round(loan.rating);
  return (
    <motion.div
      className={`relative rounded-2xl p-5 border transition-all duration-300 cursor-default group ${highlight ? '' : ''}`}
      style={{
        background: highlight ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' : '#fff',
        border: highlight ? '1.5px solid rgba(21,101,192,0.35)' : '1px solid rgba(21,101,192,0.12)',
        boxShadow: highlight ? '0 8px 32px rgba(21,101,192,0.12)' : '0 2px 12px rgba(21,101,192,0.06)',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(21,101,192,0.16)', borderColor: 'rgba(21,101,192,0.4)' }}
    >
      {highlight && (
        <>
          <div className="absolute -top-3 left-4">
            <span className="badge-mint text-[9px]">⭐ BEST CHOICE</span>
          </div>
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top, rgba(21,101,192,0.05) 0%, transparent 60%)' }} />
        </>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border"
            style={{ background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)' }}>
            {loan.logo_emoji}
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#0A1628' }}>{loan.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#7A90B8' }}>{loan.tagline}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono-nums font-bold text-xl" style={{ color: '#1565C0' }}>{loan.interest_rate_min}%</div>
          <div className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#7A90B8' }}>p.a. from</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl" style={{ background: '#F0F6FF', border: '1px solid rgba(21,101,192,0.08)' }}>
        {[['Range', `${fmtLakh(loan.loan_amount_min)}–${fmtLakh(loan.loan_amount_max)}`],
          ['Approval', loan.approval_time],
          ['CIBIL', loan.min_cibil === 0 ? 'Any' : loan.min_cibil]].map(([l, v]) => (
          <div key={l}>
            <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#7A90B8' }}>{l}</div>
            <div className="font-mono-nums text-xs font-semibold" style={{ color: '#0A1628' }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1,2,3,4,5].map(s => <span key={s} className="text-xs" style={{ color: s <= rating ? '#F59E0B' : '#CBD5E1' }}>★</span>)}
          </div>
          <span className="text-xs" style={{ color: '#7A90B8' }}>{loan.rating} <span style={{ color: '#CBD5E1' }}>({(loan.review_count/1000).toFixed(1)}K)</span></span>
        </div>
        <motion.a href={loan.apply_url} target="_blank" rel="noopener noreferrer sponsored"
          className="btn-mint py-2 px-4 text-xs rounded-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Apply Now →
        </motion.a>
      </div>
      {loan.best_for && (
        <div className="mt-3 pt-3 flex items-center gap-1.5" style={{ borderTop: '1px solid rgba(21,101,192,0.08)' }}>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: '#7A90B8' }}>Best for:</span>
          <span className="text-[10px]" style={{ color: '#3B5280' }}>{loan.best_for}</span>
        </div>
      )}
    </motion.div>
  );
}
