import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const CITY_DATA = {
  delhi: { name: 'Delhi NCR', icon: '🏛️', avgApproval: '15 min', activeCount: 9 },
  mumbai: { name: 'Mumbai', icon: '🌆', avgApproval: '12 min', activeCount: 10 },
  noida: { name: 'Noida', icon: '🏙️', avgApproval: '18 min', activeCount: 8 },
  jaipur: { name: 'Jaipur', icon: '🕌', avgApproval: '20 min', activeCount: 7 },
};

const LENDERS = [
  { name: 'Navi', emoji: '🚀', cities: ['delhi','mumbai','noida','jaipur'], min: 10000, max: 2000000 },
  { name: 'Bajaj Finserv', emoji: '🏛️', cities: ['delhi','mumbai','noida'], min: 100000, max: 2000000 },
  { name: 'KreditBee', emoji: '🐝', cities: ['delhi','mumbai','noida','jaipur'], min: 1000, max: 400000 },
  { name: 'MoneyTap', emoji: '💧', cities: ['delhi','mumbai','jaipur'], min: 3000, max: 500000 },
  { name: 'CASHe', emoji: '💸', cities: ['mumbai','delhi'], min: 5000, max: 400000 },
  { name: 'PaySense', emoji: '💼', cities: ['delhi','mumbai','noida','jaipur'], min: 5000, max: 500000 },
  { name: 'LazyPay', emoji: '⏱️', cities: ['delhi','mumbai','noida'], min: 1000, max: 100000 },
  { name: 'FlexiLoans', emoji: '🧾', cities: ['mumbai','delhi','jaipur'], min: 100000, max: 2000000 },
];

function fmtAmt(v) {
  if (v >= 100000) return `₹${(v/100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v/1000).toFixed(0)}K`;
  return `₹${v}`;
}

export default function CityMatcher() {
  const [city, setCity] = useState('delhi');
  const [amount, setAmount] = useState(200000);

  const matched = useMemo(() => {
    return LENDERS.filter(l => l.cities.includes(city) && amount >= l.min && amount <= l.max);
  }, [city, amount]);

  const cityInfo = CITY_DATA[city];

  return (
    <PageTransition>
      <style>{`
        input[type=range] { -webkit-appearance:none; width:100%; height:6px; border-radius:6px; background:rgba(21,101,192,0.15); outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#1565C0; cursor:pointer; box-shadow:0 2px 8px rgba(21,101,192,0.4); }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ CITY MATCHER</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📍 Find Loans by City & Amount</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>Select your city and loan amount to see which lenders are active near you.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)', marginBottom: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#3B5280', display: 'block', marginBottom: '10px' }}>Select Your City</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
                {Object.entries(CITY_DATA).map(([slug, c]) => (
                  <div key={slug} onClick={() => setCity(slug)}
                    style={{
                      padding: '14px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                      border: `1.5px solid ${city === slug ? '#1565C0' : 'rgba(21,101,192,0.15)'}`,
                      background: city === slug ? 'rgba(21,101,192,0.08)' : '#F8FAFF',
                    }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{c.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: city === slug ? '#1565C0' : '#3B5280' }}>{c.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#3B5280' }}>Loan Amount Needed</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#1565C0', fontFamily: 'Outfit,sans-serif' }}>{fmtAmt(amount)}</span>
              </div>
              <input type="range" min="1000" max="2000000" step="10000" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            </div>
          </div>

          {/* City stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '24px' }}>
            {[['🏦', matched.length, 'Lenders Available'], ['⚡', cityInfo.avgApproval, 'Avg Approval Time'], ['📍', cityInfo.name, 'Selected City']].map(([icon, val, label]) => (
              <div key={label} style={{ background: '#fff', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid rgba(21,101,192,0.1)' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#0A1628' }}>{val}</div>
                <div style={{ fontSize: '10px', color: '#7A90B8', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Matched lenders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matched.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', background: '#fff', borderRadius: '16px' }}>
                No lenders match this amount in {cityInfo.name}. Try adjusting the slider.
              </div>
            ) : matched.map(l => (
              <div key={l.name} style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', border: '1px solid rgba(21,101,192,0.1)', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 12px rgba(21,101,192,0.04)' }}>
                <span style={{ fontSize: '26px' }}>{l.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628' }}>{l.name}</div>
                  <div style={{ fontSize: '12px', color: '#7A90B8' }}>Active in {cityInfo.name} · {fmtAmt(l.min)}–{fmtAmt(l.max)}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#F0FDF4', padding: '4px 10px', borderRadius: '999px' }}>✓ Available</span>
              </div>
            ))}
          </div>

          <Link to="/compare">
            <button style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              See Full Comparison →
            </button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
