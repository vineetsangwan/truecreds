import PageTransition from '../components/PageTransition';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '../lib/api';

const LENDER_NAMES = ['Navi', 'Bajaj Finserv', 'Credila', 'KreditBee', 'MoneyTap', 'mPokket', 'LazyPay', 'CASHe', 'PaySense', 'FlexiLoans', 'Other'];

export default function RejectionStories() {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lender_name: '', reason: '', cibil_range: '', employment_type: '', story: '', display_name: '' });
  const [filter, setFilter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const load = () => {
    api.get('/api/rejection-stories', { params: filter ? { lender: filter } : {} })
      .then(r => setStories(r.data)).catch(() => {});
  };

  useEffect(load, [filter]);

  const submit = async () => {
    if (!form.lender_name || !form.reason || !form.story) return toast.error('Please fill required fields');
    try {
      await api.post('/api/rejection-stories', { ...form, display_name: form.display_name || 'Anonymous' });
      setSubmitted(true);
      setForm({ lender_name: '', reason: '', cibil_range: '', employment_type: '', story: '', display_name: '' });
    } catch { toast.error('Failed to submit. Try again.'); }
  };

  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ COMMUNITY</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>💬 Which Lender Rejected You?</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>Real, anonymous stories from borrowers across India. Learn from others' experiences before you apply.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#fff', fontSize: '13px', color: '#3B5280' }}>
              <option value="">All Lenders</option>
              {LENDER_NAMES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={() => setShowForm(s => !s)}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              {showForm ? '✕ Close' : '✍️ Share Your Story'}
            </button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(21,101,192,0.12)', marginBottom: '24px', overflow: 'hidden' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
                  <div style={{ fontWeight: 700, color: '#0A1628', marginBottom: '4px' }}>Thanks for sharing!</div>
                  <div style={{ fontSize: '13px', color: '#7A90B8' }}>Your story will appear after a quick review.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <select value={form.lender_name} onChange={e => setForm(p => ({ ...p, lender_name: e.target.value }))}
                    style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px' }}>
                    <option value="">Which lender rejected you? *</option>
                    {LENDER_NAMES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <input type="text" placeholder="Brief reason (e.g. Low CIBIL, Income mismatch) *" value={form.reason}
                    onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                    style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="CIBIL range (optional)" value={form.cibil_range}
                      onChange={e => setForm(p => ({ ...p, cibil_range: e.target.value }))}
                      style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px' }} />
                    <input type="text" placeholder="Employment type" value={form.employment_type}
                      onChange={e => setForm(p => ({ ...p, employment_type: e.target.value }))}
                      style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px' }} />
                  </div>
                  <textarea rows={4} placeholder="Tell your story — what happened, any advice for others? *" value={form.story}
                    onChange={e => setForm(p => ({ ...p, story: e.target.value }))}
                    style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }} />
                  <input type="text" placeholder="Your name (optional, defaults to Anonymous)" value={form.display_name}
                    onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                    style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px' }} />
                  <button onClick={submit} style={{ padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Submit Story →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stories.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', background: '#fff', borderRadius: '20px', border: '1px solid rgba(21,101,192,0.1)' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
                No stories yet for this filter. Be the first to share!
              </div>
            )}
            {stories.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.1)', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ background: '#FEF2F2', color: '#991B1B', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>{s.lender_name}</span>
                    <span style={{ fontSize: '12px', color: '#7A90B8', marginLeft: '8px' }}>{s.reason}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>— {s.display_name}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.7, margin: 0 }}>{s.story}</p>
                {(s.cibil_range || s.employment_type) && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {s.cibil_range && <span style={{ fontSize: '11px', color: '#1565C0', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>CIBIL: {s.cibil_range}</span>}
                    {s.employment_type && <span style={{ fontSize: '11px', color: '#1565C0', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>{s.employment_type}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
