import PageTransition from '../components/PageTransition';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';

export default function Corrections() {
  const [form, setForm] = useState({ page: '', issue: '', correct: '', email: '' });
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!form.page || !form.issue) return toast.error('Please fill all required fields');
    try {
      await api.post('/api/contact', { name: 'Correction Request', email: form.email || 'anonymous', message: `Page: ${form.page}\nIssue: ${form.issue}\nCorrection: ${form.correct}`, type: 'Correction' });
      setSent(true);
    } catch { toast.error('Failed to send. Email us at support@truecreds.in'); }
  };

  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ CORRECTIONS</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Report a Correction</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Found an error in our rates, content or lender info? Tell us and we'll fix it within 48 hours.</p>
        </div>
      </div>
      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
          {sent ? (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid rgba(21,101,192,0.12)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#0A1628', marginBottom: '8px' }}>Thanks for the report!</h2>
              <p style={{ color: '#7A90B8', fontSize: '14px' }}>We'll review and fix the issue within 48 hours.</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 32px rgba(21,101,192,0.08)' }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '18px', color: '#0A1628', marginBottom: '24px' }}>Correction Form</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Page URL or Page Name *', key: 'page', placeholder: 'e.g. /compare or "Navi loan page"' },
                  { label: 'What is incorrect? *', key: 'issue', placeholder: 'Describe the error you found' },
                  { label: 'What is the correct information?', key: 'correct', placeholder: 'Tell us what it should say' },
                  { label: 'Your Email (optional)', key: 'email', placeholder: 'We\'ll notify you when fixed' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <textarea rows={f.key === 'page' || f.key === 'email' ? 1 : 3}
                      value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#F8FAFF', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <button onClick={submit}
                  style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Submit Correction →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
