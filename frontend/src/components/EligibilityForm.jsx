import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';

export default function EligibilityForm({ compact = false }) {
  const [form, setForm] = useState({ full_name: '', mobile: '', email: '', loan_amount: '', employment_type: '', city: '', monthly_income: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim()) return toast.error('Please enter your name');
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return toast.error('Enter a valid 10-digit Indian mobile number');
    if (!form.loan_amount || isNaN(form.loan_amount)) return toast.error('Enter loan amount');
    setLoading(true);
    try {
      const payload = { full_name: form.full_name.trim(), mobile: form.mobile, loan_amount: Number(form.loan_amount) };
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.employment_type) payload.employment_type = form.employment_type;
      if (form.city.trim()) payload.city = form.city.trim();
      if (form.monthly_income) payload.monthly_income = Number(form.monthly_income);
      await api.post('/api/leads', payload);
      setSuccess(true);
    } catch (e) {
      const detail = e?.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map(d => d.msg || JSON.stringify(d)).join(', ') : (typeof detail === 'string' ? detail : 'Something went wrong.');
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="card-cosmic text-center py-10" data-testid="eligibility-success" style={{ background: '#EFF6FF', border: '1.5px solid rgba(21,101,192,0.2)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: 'rgba(21,101,192,0.1)' }}>✅</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: '#0A1628' }}>You're on the list!</h3>
      <p className="text-sm" style={{ color: '#3B5280' }}>Our experts will reach out within 30 minutes with your best matches.</p>
      <div className="mt-4 badge-mint inline-block">No CIBIL Impact · 100% Free</div>
    </div>
  );

  return (
    <div className="card-cosmic" data-testid="eligibility-form" style={{ background: '#fff', border: '1.5px solid rgba(21,101,192,0.15)' }}>
      {!compact && (
        <div className="mb-6">
          <div className="badge-mint mb-3">FREE ELIGIBILITY CHECK</div>
          <h3 className="text-xl font-bold" style={{ color: '#0A1628' }}>Check Your Eligibility</h3>
          <p className="text-sm mt-1" style={{ color: '#7A90B8' }}>No CIBIL impact · Results in 2 minutes</p>
        </div>
      )}
      <div className="space-y-3">
        {[
          { label: 'Full Name *', key: 'full_name', placeholder: 'Rahul Sharma', testId: 'lead-name-input' },
          { label: 'Mobile Number *', key: 'mobile', placeholder: '9876543210', testId: 'lead-mobile-input', maxLength: 10 },
          { label: 'Email (optional)', key: 'email', placeholder: 'rahul@example.com', type: 'email' },
          { label: 'Loan Amount (₹) *', key: 'loan_amount', placeholder: '100000', type: 'number', testId: 'lead-amount-input' },
          { label: 'City', key: 'city', placeholder: 'Mumbai, Delhi...' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs uppercase tracking-wider mb-1 block font-medium" style={{ color: '#3B5280' }}>{f.label}</label>
            <input className="input-cosmic" type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
              onChange={e => set(f.key, e.target.value)} maxLength={f.maxLength} data-testid={f.testId} />
          </div>
        ))}
        <div>
          <label className="text-xs uppercase tracking-wider mb-1 block font-medium" style={{ color: '#3B5280' }}>Employment Type</label>
          <select className="input-cosmic" value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
            <option value="">Select type</option>
            {['Salaried','Self-employed','Student','Business owner','Other'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button className="btn-mint w-full justify-center mt-2" onClick={submit} disabled={loading} data-testid="lead-submit-btn">
          {loading ? 'Checking...' : 'Check My Eligibility →'}
        </button>
        <p className="text-[11px] text-center" style={{ color: '#7A90B8' }}>TrueCreds is NOT a lender. Zero CIBIL impact.</p>
      </div>
    </div>
  );
}
