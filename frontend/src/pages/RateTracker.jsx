import PageTransition from '../components/PageTransition';
import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function RateTracker() {
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    api.get('/api/rate-tracker').then(r => setSnapshots(r.data)).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ LIVE TRACKING</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📊 Weekly Rate Change Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>We track interest rate changes every week so you always know if rates are rising or falling.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

          {snapshots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', background: '#fff', borderRadius: '20px', border: '1px solid rgba(21,101,192,0.1)' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📈</div>
              Rate tracking data will appear here once published.
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 20px rgba(21,101,192,0.08)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)' }}>
                      {['Lender', 'This Week', 'Last Week', 'Change'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#fff', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {snapshots.map((s, i) => {
                      const curr = (s.current_rate_min + s.current_rate_max) / 2;
                      const prev = s.previous_rate_min != null ? (s.previous_rate_min + s.previous_rate_max) / 2 : null;
                      const diff = prev != null ? curr - prev : null;
                      return (
                        <tr key={s.lender_name} style={{ borderBottom: '1px solid rgba(21,101,192,0.08)', background: i % 2 === 0 ? '#fff' : '#F8FAFF' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '13px', color: '#0A1628' }}>{s.lender_name}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono,monospace', color: '#1565C0', fontWeight: 700, fontSize: '13px' }}>
                            {s.current_rate_min}–{s.current_rate_max}%
                          </td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono,monospace', color: '#94A3B8', fontSize: '13px' }}>
                            {prev != null ? `${s.previous_rate_min}–${s.previous_rate_max}%` : '—'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {diff == null ? (
                              <span style={{ fontSize: '12px', color: '#94A3B8' }}>New</span>
                            ) : diff > 0 ? (
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626' }}>▲ +{diff.toFixed(1)}%</span>
                            ) : diff < 0 ? (
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>▼ {diff.toFixed(1)}%</span>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#7A90B8' }}>— No change</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(21,101,192,0.08)', fontSize: '11px', color: '#94A3B8' }}>
                Updated weekly by the TrueCreds research team. Last refresh: {snapshots[0]?.week_label || 'recently'}.
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
