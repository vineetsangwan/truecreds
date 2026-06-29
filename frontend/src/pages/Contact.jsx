import PageTransition from '../components/PageTransition';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '../lib/api';

const CONTACT_INFO = [
  {
    icon: '📧',
    title: 'Email Us',
    desc: 'For general enquiries and support',
    value: 'support@truecreds.in',
    link: 'mailto:support@truecreds.in',
  },
  {
    icon: '🤝',
    title: 'Partnership',
    desc: 'Lender partnerships & affiliate deals',
    value: 'partners@truecreds.in',
    link: 'mailto:partners@truecreds.in',
  },
  {
    icon: '🔒',
    title: 'Privacy',
    desc: 'Data privacy & GDPR requests',
    value: 'privacy@truecreds.in',
    link: 'mailto:privacy@truecreds.in',
  },
  {
    icon: '⚡',
    title: 'Response Time',
    desc: 'We typically reply within',
    value: '24 hours',
    link: null,
  },
];

const FAQS = [
  { q: 'Is TrueCreds free to use?', a: 'Yes, completely free for borrowers. We earn a referral fee from lenders when you apply — you pay nothing extra.' },
  { q: 'Will you call me after I submit a query?', a: 'No. We never cold call. All communication is by email only, and only if you reach out first.' },
  { q: 'How do I report a lender issue?', a: 'Email us at support@truecreds.in with the lender name and issue. We take every complaint seriously.' },
  { q: 'Can I partner with TrueCreds as a lender?', a: 'Absolutely. Email partners@truecreds.in with your company details and we will get back within 48 hours.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', type: 'General Enquiry' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await api.post('/api/contact', form);
      setSent(true);
    } catch {
      toast.error('Failed to send. Please try again.');
    }
    setLoading(false);
  };

  if (sent) return (
    <PageTransition>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F6FF' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '60px 40px', background: '#fff', borderRadius: '24px', maxWidth: '480px', margin: '24px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 40px rgba(21,101,192,0.1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#1565C0,#0288D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>✅</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '28px', color: '#0A1628', marginBottom: '12px' }}>Message Sent!</h2>
          <p style={{ color: '#7A90B8', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>Thanks for reaching out. We'll get back to you at <strong style={{ color: '#1565C0' }}>{form.email}</strong> within 24 hours.</p>
          <button onClick={() => setSent(false)}
            style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Send Another Message
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <style>{`
        .contact-layout { display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start; }
        @media(max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
        .contact-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media(max-width: 480px) { .contact-info-grid { grid-template-columns: 1fr; } }
        input[type=text],input[type=email],textarea,select {
          width: 100%; padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid rgba(21,101,192,0.2); background: #F8FAFF;
          font-size: 14px; color: #0A1628; outline: none; font-family: inherit;
          transition: border-color 0.2s; box-sizing: border-box;
        }
        input[type=text]:focus,input[type=email]:focus,textarea:focus,select:focus {
          border-color: #1565C0; background: #fff; box-shadow: 0 0 0 3px rgba(21,101,192,0.08);
        }
        textarea { resize: vertical; min-height: 120px; }
      `}</style>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1565C0 0%,#0288D1 60%,#0D47A1 100%)', padding: '64px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ CONTACT US</div>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, color: '#fff', marginBottom: '14px', lineHeight: 1.15 }}>
              Get in Touch
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: '560px', lineHeight: 1.7 }}>
              Questions, feedback, partnership enquiries — we read every message and reply personally. No bots, no auto-responders.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>

          {/* Contact info cards */}
          <div className="contact-info-grid" style={{ marginBottom: '40px' }}>
            {CONTACT_INFO.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 16px rgba(21,101,192,0.06)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1px solid rgba(21,101,192,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#7A90B8', marginBottom: '6px' }}>{item.desc}</div>
                  {item.link ? (
                    <a href={item.link} style={{ fontSize: '13px', color: '#1565C0', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>{item.value}</a>
                  ) : (
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1565C0' }}>{item.value}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main layout */}
          <div className="contact-layout">

            {/* LEFT — FAQ */}
            <div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#0A1628', marginBottom: '8px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: '#7A90B8', fontSize: '14px', marginBottom: '24px' }}>Quick answers before you reach out.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
                {FAQS.map((f, i) => (
                  <motion.div key={i} onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(21,101,192,0.12)', cursor: 'pointer', userSelect: 'none', overflow: 'hidden', boxShadow: '0 2px 10px rgba(21,101,192,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#0A1628' }}>{f.q}</span>
                      <motion.span style={{ color: '#1565C0', flexShrink: 0, fontSize: '12px' }} animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2 }}>▼</motion.span>
                    </div>
                    <motion.div initial={false} animate={{ height: faqOpen === i ? 'auto' : 0, opacity: faqOpen === i ? 1 : 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.7, marginTop: '12px' }}>{f.a}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Trust badges */}
              <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', borderRadius: '20px', padding: '28px', color: '#fff' }}>
                <div style={{ fontSize: '20px', marginBottom: '12px' }}>🛡️</div>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Your Privacy is Safe</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
                  We never share your contact information with third parties. Messages are read only by our team.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['No cold calls ever', 'No spam emails', 'Data encrypted in transit', 'Responds within 24 hrs'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                      <span style={{ color: '#7EFFD4' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div style={{ position: 'sticky', top: '80px' }}>
              <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 8px 40px rgba(21,101,192,0.1)' }}>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '6px' }}>Send us a Message</h2>
                <p style={{ fontSize: '13px', color: '#7A90B8', marginBottom: '24px' }}>We reply within 24 hours on working days.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Enquiry type */}
                  <div>
                    <label style={{ fontSize: '11px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Enquiry Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      <option>General Enquiry</option>
                      <option>Lender Partnership</option>
                      <option>Report an Issue</option>
                      <option>Data Privacy Request</option>
                      <option>Media / Press</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize: '11px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Rahul Sharma" />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '11px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize: '11px', color: '#7A90B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Message *</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help you..." rows={5} />
                  </div>

                  {/* Submit */}
                  <button onClick={submit} disabled={loading}
                    style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(21,101,192,0.3)', transition: 'all 0.2s', width: '100%' }}>
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
                    By submitting, you agree to our <a href="/legal/privacy" style={{ color: '#1565C0', textDecoration: 'none' }}>Privacy Policy</a>. No spam, ever.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
