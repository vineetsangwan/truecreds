import React from 'react';
import { fmtLakh } from '../lib/api';
import { motion } from 'framer-motion';

export default function LoanCard({ loan, index = 0, highlight = false }) {
  const rating = Math.round(loan.rating);
  return (
    <motion.div
      style={{
        background: highlight ? 'linear-gradient(135deg,#EFF6FF,#DBEAFE)' : '#fff',
        border: highlight ? '1.5px solid rgba(21,101,192,0.35)' : '1px solid rgba(21,101,192,0.12)',
        boxShadow: highlight ? '0 8px 32px rgba(21,101,192,0.12)' : '0 2px 12px rgba(21,101,192,0.06)',
        borderRadius: '16px',
        padding: '16px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        width: '100%',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(21,101,192,0.16)' }}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: '-10px', left: '16px', zIndex: 1 }}>
          <span className="badge-mint" style={{ fontSize: '9px' }}>⭐ BEST CHOICE</span>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', width: '100%', overflow: 'hidden' }}>
        {/* Emoji logo */}
        <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)' }}>
          {loan.logo_emoji}
        </div>
        {/* Name + tagline */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {loan.name}
          </h3>
          <p style={{ fontSize: '11px', color: '#7A90B8', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {loan.tagline}
          </p>
        </div>
        {/* Rate — always visible, never cut off */}
        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '4px' }}>
          <div style={{ fontWeight: 800, fontSize: '17px', color: '#1565C0', lineHeight: 1, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>
            {loan.interest_rate_min}%
          </div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7A90B8', marginTop: '2px', whiteSpace: 'nowrap' }}>
            P.A. FROM
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', padding: '10px', borderRadius: '10px', background: '#F0F6FF', border: '1px solid rgba(21,101,192,0.08)', marginBottom: '12px' }}>
        {[
          ['Range', `${fmtLakh(loan.loan_amount_min)}–${fmtLakh(loan.loan_amount_max)}`],
          ['Approval', loan.approval_time],
          ['CIBIL', loan.min_cibil === 0 ? 'Any' : String(loan.min_cibil)],
        ].map(([label, value]) => (
          <div key={label} style={{ minWidth: 0 }}>
            <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A90B8', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} style={{ fontSize: '11px', color: s <= rating ? '#F59E0B' : '#CBD5E1' }}>★</span>
        ))}
        <span style={{ fontSize: '11px', color: '#7A90B8', marginLeft: '2px' }}>
          {loan.rating} ({(loan.review_count/1000).toFixed(1)}K)
        </span>
      </div>

      {/* Apply — full width */}
      <motion.a
        href={loan.apply_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'block',
          textAlign: 'center',
          background: 'linear-gradient(135deg,#1565C0,#0288D1)',
          color: 'white',
          fontWeight: 700,
          fontSize: '13px',
          padding: '11px',
          borderRadius: '10px',
          textDecoration: 'none',
          marginTop: 'auto',
          boxShadow: '0 4px 12px rgba(21,101,192,0.25)',
        }}
      >
        Apply Now →
      </motion.a>

      {/* Best for */}
      {loan.best_for && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(21,101,192,0.08)', display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A90B8', flexShrink: 0 }}>Best for:</span>
          <span style={{ fontSize: '11px', color: '#3B5280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.best_for}</span>
        </div>
      )}
    </motion.div>
  );
}
