import PageTransition from '../components/PageTransition';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const submit = async () => {
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields');
    try { await api.post('/api/contact', form); setSent(true); }
    catch { toast.error('Failed to send. Please try again.'); }
  };
  if (sent) return <div className="max-w-xl mx-auto px-4 py-24 text-center"><div className="text-5xl mb-4">✅</div><h2 className="text-2xl font-bold mb-2">Message sent!</h2><p className="text-slate-400">We'll get back to you within 24 hours.</p></div>;
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-[10px] font-mono text-mint uppercase tracking-[0.2em] mb-2">/ CONTACT</div>
      <h1 className="font-black text-3xl mb-2" style={{fontFamily:'Outfit,sans-serif'}}>Contact Us</h1>
      <p className="text-slate-400 mb-8">Questions, feedback, or partnership enquiries — we read every message.</p>
      <div className="card-cosmic space-y-4">
        <div><label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Name</label><input className="input-cosmic" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" /></div>
        <div><label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Email</label><input className="input-cosmic" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" /></div>
        <div><label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Message</label><textarea className="input-cosmic" rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Your message..." /></div>
        <button className="btn-mint w-full justify-center" onClick={submit}>Send Message →</button>
      </div>
    </div>
  );
}
