import PageTransition from '../components/PageTransition';
import React, { useState } from 'react';

const ROADMAP_STEPS = [
  { id: 1, icon: '💳', title: 'Pay all EMIs and credit card bills on time', impact: '+50-80 points', timeline: '3-6 months', desc: 'Payment history is 35% of your CIBIL score. Set up auto-pay to never miss a due date.' },
  { id: 2, icon: '📊', title: 'Reduce credit utilization below 30%', impact: '+30-50 points', timeline: '1-2 months', desc: 'If your credit card limit is ₹1L, keep outstanding balance under ₹30K. High utilization signals risk.' },
  { id: 3, icon: '🗂️', title: 'Avoid multiple loan applications at once', impact: '+10-20 points', timeline: 'Immediate', desc: 'Each hard inquiry can drop your score by 5-10 points. Space out applications by at least 3-6 months.' },
  { id: 4, icon: '⏳', title: 'Maintain old credit accounts (don\'t close them)', impact: '+15-25 points', timeline: '6-12 months', desc: 'Length of credit history matters. Closing your oldest credit card can actually hurt your score.' },
  { id: 5, icon: '🎯', title: 'Maintain a healthy mix of credit types', impact: '+10-15 points', timeline: '6-12 months', desc: 'Having both secured (car/home loan) and unsecured (credit card) credit shows balanced credit management.' },
  { id: 6, icon: '🔍', title: 'Check your CIBIL report for errors', impact: '+20-100 points', timeline: 'Immediate', desc: 'Incorrect entries (wrongly marked as default, duplicate accounts) can severely hurt your score. Dispute errors immediately.' },
  { id: 7, icon: '💰', title: 'Clear old outstanding dues / settled accounts', impact: '+30-60 points', timeline: '3-6 months', desc: 'Settled or written-off accounts hurt your score for years. Paying them off fully (not settling) is better long-term.' },
];

export default function CibilRoadmap() {
  const [checked, setChecked] = useState({});
  const toggleCheck = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = Math.round((completedCount / ROADMAP_STEPS.length) * 100);

  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ CIBIL IMPROVEMENT</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📈 CIBIL Score Improvement Roadmap</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>7 proven steps to boost your CIBIL score — check them off as you complete each one.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          {/* Progress bar */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(21,101,192,0.12)', marginBottom: '24px', boxShadow: '0 4px 20px rgba(21,101,192,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628' }}>Your Progress</span>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#1565C0' }}>{completedCount}/{ROADMAP_STEPS.length} completed</span>
            </div>
            <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(21,101,192,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#1565C0,#0288D1)', borderRadius: '10px', transition: 'width 0.4s' }} />
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ROADMAP_STEPS.map(s => (
              <div key={s.id} onClick={() => toggleCheck(s.id)}
                style={{
                  background: checked[s.id] ? '#F0FDF4' : '#fff',
                  border: `1.5px solid ${checked[s.id] ? '#BBF7D0' : 'rgba(21,101,192,0.12)'}`,
                  borderRadius: '16px', padding: '20px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'flex-start',
                  boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.2s',
                }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, marginTop: '2px',
                  border: `2px solid ${checked[s.id] ? '#16a34a' : 'rgba(21,101,192,0.2)'}`,
                  background: checked[s.id] ? '#16a34a' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800,
                }}>
                  {checked[s.id] && '✓'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '20px' }}>{s.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', textDecoration: checked[s.id] ? 'line-through' : 'none', opacity: checked[s.id] ? 0.6 : 1 }}>{s.title}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.6, marginBottom: '10px' }}>{s.desc}</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#F0FDF4', padding: '4px 10px', borderRadius: '999px' }}>📈 {s.impact}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1565C0', background: '#EFF6FF', padding: '4px 10px', borderRadius: '999px' }}>⏱️ {s.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
