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
        padding: '18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(21,101,192,0.16)' }}
    >
      {/* BEST CHOICE badge */}
      {highlight && (
        <div style={{ position: 'absolute', top: '-10px', left: '16px' }}>
          <span className="badge-mint" style={{ fontSize: '9px' }}>⭐ BEST CHOICE</span>
        </div>
      )}

      {/* Header — logo + name + rate all on one line */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
        {/* Logo */}
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: '#EFF6FF', border: '1px solid rgba(21,101,192,0.15)', flexShrink: 0 }}>
          {loan.logo_emoji}
        </div>
        {/* Name + tagline */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loan.name}
          </h3>
          <p style={{ fontSize: '11px', color: '#7A90B8', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {loan.tagline}
          </p>
        </div>
        {/* Rate — fixed width, no wrap ever */}
        <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '56px' }}>
          <div style={{ fontWeight: 800, fontSize: '18px', color: '#1565C0', lineHeight: 1, fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>
            {loan.interest_rate_min}%
          </div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7A90B8', marginTop: '2px', whiteSpace: 'nowrap' }}>
            P.A. FROM
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', padding: '10px', borderRadius: '10px', background: '#F0F6FF', border: '1px solid rgba(21,101,192,0.08)', marginBottom: '14px' }}>
        {[
          ['Range', `${fmtLakh(loan.loan_amount_min)}–${fmtLakh(loan.loan_amount_max)}`],
          ['Approval', loan.approval_time],
          ['CIBIL', loan.min_cibil === 0 ? 'Any' : String(loan.min_cibil)],
        ].map(([label, value]) => (
          <div key={label} style={{ minWidth: 0 }}>
            <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7A90B8', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
        <div style={{ display: 'flex' }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: '11px', color: s <= rating ? '#F59E0B' : '#CBD5E1' }}>★</span>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: '#7A90B8' }}>
          {loan.rating} <span style={{ color: '#CBD5E1' }}>({(loan.review_count/1000).toFixed(1)}K)</span>
        </span>
      </div>

      {/* Apply button — full width, always on its own line */}
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
          padding: '10px 16px',
          borderRadius: '10px',
          textDecoration: 'none',
          marginTop: 'auto',
          boxShadow: '0 4px 12px rgba(21,101,192,0.25)',
          whiteSpace: 'nowrap',
        }}
      >
        Apply Now →
      </motion.a>

      {/* Best for */}
      {loan.best_for && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(21,101,192,0.08)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A90B8', flexShrink: 0 }}>Best for:</span>
          <span style={{ fontSize: '11px', color: '#3B5280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.best_for}</span>
        </div>
      )}
    </motion.div>
  );
}
