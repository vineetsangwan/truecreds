import PageTransition from '../components/PageTransition';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TEAM = [
  { name: 'Vineet Sangwan', role: 'Founder & CEO', emoji: '👨‍💼', bio: 'Fintech enthusiast with a passion for making financial products transparent and accessible for every Indian borrower.' },
  { name: 'Content Team', role: 'Research & Editorial', emoji: '✍️', bio: 'A dedicated team of finance writers who verify every rate, term and lender claim before it goes live on TrueCreds.' },
  { name: 'Tech Team', role: 'Engineering', emoji: '⚙️', bio: 'Building the comparison engine, real-time rate updates and the tools that help 1.2 lakh+ borrowers every month.' },
];

const STATS = [
  { val: '1.2L+', label: 'Borrowers Helped' },
  { val: '12+', label: 'Lenders Compared' },
  { val: '100%', label: 'Free to Use' },
  { val: '2024', label: 'Founded' },
];

export default function AboutUs() {
  return (
    <PageTransition>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '64px 0 48px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ ABOUT US</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>We built TrueCreds because loan comparison in India was broken.</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', lineHeight: 1.7, maxWidth: '680px' }}>Too many hidden charges, too many misleading rates, too many borrowers paying more than they should. TrueCreds exists to fix that — one honest comparison at a time.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '16px', marginBottom: '56px' }}>
            {STATS.map((s,i) => (
              <motion.div key={i} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.1 }}
                style={{ background:'#fff', borderRadius:'16px', padding:'24px 16px', textAlign:'center', border:'1px solid rgba(21,101,192,0.12)', boxShadow:'0 4px 16px rgba(21,101,192,0.07)' }}>
                <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'2rem', fontWeight:900, color:'#1565C0' }}>{s.val}</div>
                <div style={{ fontSize:'12px', color:'#7A90B8', marginTop:'4px' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mission */}
          <div style={{ background:'#fff', borderRadius:'20px', padding:'36px', border:'1px solid rgba(21,101,192,0.12)', marginBottom:'32px', boxShadow:'0 4px 20px rgba(21,101,192,0.06)' }}>
            <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'1.5rem', color:'#0A1628', marginBottom:'16px' }}>🎯 Our Mission</h2>
            <p style={{ fontSize:'15px', color:'#3B5280', lineHeight:1.8, marginBottom:'14px' }}>TrueCreds is India's transparent loan comparison platform. We help borrowers across India find the best personal, student, business and instant loans — without the confusion, without the spam, and without the hidden agenda.</p>
            <p style={{ fontSize:'15px', color:'#3B5280', lineHeight:1.8 }}>We are <strong>not a lender</strong>. We never touch your money. We simply compare RBI-registered NBFCs and banks side by side so you can make an informed choice.</p>
          </div>

          {/* How we work */}
          <div style={{ background:'#fff', borderRadius:'20px', padding:'36px', border:'1px solid rgba(21,101,192,0.12)', marginBottom:'32px', boxShadow:'0 4px 20px rgba(21,101,192,0.06)' }}>
            <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'1.5rem', color:'#0A1628', marginBottom:'16px' }}>⚙️ How We Work</h2>
            {[
              ['We research', 'Our team manually verifies interest rates, processing fees, eligibility criteria and approval times for every lender on our platform.'],
              ['We compare', 'Our algorithm ranks lenders by a weighted score — rate (40%), approval speed (25%), CIBIL flexibility (20%), user ratings (15%).'],
              ['We earn', 'We receive a referral fee from lenders when you apply. This fee never affects our rankings or the rates shown to you.'],
              ['We update', 'Rates and terms are reviewed monthly. Any lender found misrepresenting terms is removed from our platform.'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display:'flex', gap:'16px', marginBottom: i < 3 ? '20px' : 0 }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#1565C0', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'13px', flexShrink:0, marginTop:'2px' }}>{i+1}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'14px', color:'#0A1628', marginBottom:'4px' }}>{title}</div>
                  <div style={{ fontSize:'14px', color:'#3B5280', lineHeight:1.7 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Team */}
          <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'1.5rem', color:'#0A1628', marginBottom:'20px' }}>👥 Our Team</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px', marginBottom:'40px' }}>
            {TEAM.map((t,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:'16px', padding:'24px', border:'1px solid rgba(21,101,192,0.12)', boxShadow:'0 4px 16px rgba(21,101,192,0.06)' }}>
                <div style={{ fontSize:'36px', marginBottom:'12px' }}>{t.emoji}</div>
                <div style={{ fontWeight:700, fontSize:'15px', color:'#0A1628', marginBottom:'2px' }}>{t.name}</div>
                <div style={{ fontSize:'11px', color:'#1565C0', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>{t.role}</div>
                <div style={{ fontSize:'13px', color:'#3B5280', lineHeight:1.7 }}>{t.bio}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center' }}>
            <Link to="/contact">
              <button style={{ background:'linear-gradient(135deg,#1565C0,#0288D1)', color:'#fff', border:'none', borderRadius:'12px', padding:'14px 32px', fontWeight:700, fontSize:'15px', cursor:'pointer' }}>
                Get in Touch →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
