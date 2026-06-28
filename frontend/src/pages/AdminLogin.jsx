import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { api } from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => { if (localStorage.getItem('truecreds_token')) nav('/admin'); }, [nav]);

  const login = async () => {
    if (!username || !password) return toast.error('Enter credentials');
    setLoading(true);
    try {
      const r = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('truecreds_token', r.data.access_token);
      nav('/admin');
    } catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'#F0F7FF'}}>
      <Toaster theme="dark" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🦈</div>
          <div className="font-black text-2xl mb-1" style={{fontFamily:'Outfit,sans-serif'}}>Loan<span className="text-mint">shark</span></div>
          <div className="text-slate-500 text-sm">Command Center.</div>
        </div>
        <div className="card-cosmic space-y-4" data-testid="admin-login-form">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Username</label>
            <input className="input-cosmic" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="admin" data-testid="admin-username-input" />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
            <input className="input-cosmic" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="••••••••" data-testid="admin-password-input" />
          </div>
          <button className="btn-mint w-full justify-center" onClick={login} disabled={loading} data-testid="admin-login-btn">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>
      </div>
    </div>
  );
}
