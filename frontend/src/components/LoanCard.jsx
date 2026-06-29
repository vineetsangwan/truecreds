import React from 'react';
import { fmtLakh } from '../lib/api';
import { motion } from 'framer-motion';

export default function LoanCard({ loan, index = 0, highlight = false }) {
  const rating = Math.round(loan.rating);
  return (
    <motion.div
      style={{
        background: highlight ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' : '#fff',
        border: highlight ? '1.5px solid rgba(21,101,192,0.35)' : '1px solid rgba(21,101,192,0.12)',
        boxShadow: highlight ? '0 8px 32px rgba(21,101,192,0.12)' : '0 2px 12px rgba(21,101,192,0.06)',
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(21,101,192,0.16)' }}
    >
      {/* BEST CHOICE badge */}
      {highlight && (
        <>
          <div style={{ position: 'absolute', top: '-10px', left: '16px' }}>
            <span className="badge-mint" style={{ fontSize: '9px' }}>⭐ BEST CHOICE</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'radial-gradient(ellipse at top, rgba(21,101,192,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        </>
      )}

      {/* Header — name + rate */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)', flexShrink: 0 }}>
            {loan.logo_emoji}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loan.name}</h3>
            <p style={{ fontSize: '11px', color: '#7A90B8', margin: '2px 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{loan.tagline}</p>
          </div>
        </div>
        {/* Rate — fixed width, no overflow */}
        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '60px' }}>
          <div style={{ fontWeight: 800, fontSize: '20px', color: '#1565C0', lineHeight: 1, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
            {loan.interest_rate_min}%
          </div>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A90B8', marginTop: '3px', whiteSpace: 'nowrap' }}>P.A. FROM</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '12px', borderRadius: '12px', background: '#F0F6FF', border: '1px solid rgba(21,101,192,0.08)', marginBottom: '16px' }}>
        {[
          ['Range', `${fmtLakh(loan.loan_amount_min)}–${fmtLakh(loan.loan_amount_max)}`],
          ['Approval', loan.approval_time],
          ['CIBIL', loan.min_cibil === 0 ? 'Any' : String(loan.min_cibil)],
        ].map(([label, value]) => (
          <div key={label} style={{ minWidth: 0 }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7A90B8', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Rating + Apply — pushed to bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '12px', color: s <= rating ? '#F59E0B' : '#CBD5E1' }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#7A90B8' }}>
            {loan.rating} <span style={{ color: '#CBD5E1' }}>({(loan.review_count/1000).toFixed(1)}K)</span>
          </span>
        </div>
        <motion.a href={loan.apply_url} target="_blank" rel="noopener noreferrer sponsored"
          className="btn-mint" style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '10px', whiteSpace: 'nowrap' }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Apply Now →
        </motion.a>
      </div>

      {/* Best for */}
      {loan.best_for && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(21,101,192,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7A90B8' }}>Best for:</span>
          <span style={{ fontSize: '11px', color: '#3B5280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.best_for}</span>
        </div>
      )}
    </motion.div>
  );
}
