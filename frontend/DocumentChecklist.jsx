import PageTransition from '../components/PageTransition';
import React, { useState, useRef } from 'react';

const LOAN_TYPES = {
  personal: {
    name: 'Personal Loan', icon: '👤',
    docs: ['PAN Card', 'Aadhaar Card', 'Last 3 months salary slips', 'Last 6 months bank statement', '2 passport size photographs', 'Address proof (utility bill / rent agreement)', 'Form 16 / Income Tax Return (last 2 years)'],
  },
  student: {
    name: 'Student Loan', icon: '🎓',
    docs: ['PAN Card (applicant + co-applicant)', 'Aadhaar Card', 'Admission letter from institution', 'Fee structure document', 'Academic records (10th, 12th, graduation)', "Co-applicant's income proof", "Co-applicant's bank statements (6 months)", 'Collateral documents (if applicable)'],
  },
  business: {
    name: 'Business Loan', icon: '🏢',
    docs: ['PAN Card (business + owner)', 'Aadhaar Card', 'GST registration certificate', 'Business registration / incorporation certificate', 'Last 2 years ITR with computation', 'Bank statements (last 12 months)', 'Business address proof', 'Profit & Loss statement'],
  },
  instant: {
    name: 'Instant Loan', icon: '⚡',
    docs: ['PAN Card', 'Aadhaar Card (linked to mobile)', 'Selfie for verification', 'Bank account details', 'Last 3 months bank statement (sometimes auto-fetched via app)'],
  },
  aadhaar: {
    name: 'Aadhaar-based Loan', icon: '🪪',
    docs: ['Aadhaar Card (mobile-linked)', 'PAN Card', 'Selfie / live photo verification', 'Bank account for disbursal'],
  },
  'no-cibil': {
    name: 'No-CIBIL Loan', icon: '📊',
    docs: ['PAN Card', 'Aadhaar Card', 'Bank statement (3-6 months)', 'Proof of income (salary slip / business proof)', 'Selfie verification', 'Reference contact details'],
  },
};

export default function DocumentChecklist() {
  const [type, setType] = useState('personal');
  const [checked, setChecked] = useState({});
  const printRef = useRef();

  const selected = LOAN_TYPES[type];
  const toggleCheck = doc => setChecked(p => ({ ...p, [doc]: !p[doc] }));

  const handlePrint = () => window.print();

  return (
    <PageTransition>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { padding: 0 !important; background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ FREE TOOL</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📋 Document Checklist Generator</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>Select your loan type and get a complete, printable checklist of documents you'll need.</p>
        </div>
      </div>

      <div className="print-area" style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>

          <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px', marginBottom: '24px' }}>
            {Object.entries(LOAN_TYPES).map(([slug, lt]) => (
              <div key={slug} onClick={() => setType(slug)}
                style={{
                  padding: '14px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                  border: `1.5px solid ${type === slug ? '#1565C0' : 'rgba(21,101,192,0.15)'}`,
                  background: type === slug ? 'rgba(21,101,192,0.08)' : '#fff',
                }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{lt.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: type === slug ? '#1565C0' : '#3B5280' }}>{lt.name}</div>
              </div>
            ))}
          </div>

          <div ref={printRef} style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(21,101,192,0.1)' }}>
              <span style={{ fontSize: '32px' }}>{selected.icon}</span>
              <div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '20px', color: '#0A1628', margin: 0 }}>{selected.name} Checklist</h2>
                <div style={{ fontSize: '12px', color: '#7A90B8' }}>TrueCreds.in · {selected.docs.length} documents required</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selected.docs.map((doc, i) => (
                <div key={doc} onClick={() => toggleCheck(doc)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: checked[doc] ? '#F0FDF4' : '#F8FAFF', cursor: 'pointer' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    border: `2px solid ${checked[doc] ? '#16a34a' : 'rgba(21,101,192,0.25)'}`,
                    background: checked[doc] ? '#16a34a' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 800,
                  }}>
                    {checked[doc] && '✓'}
                  </div>
                  <span style={{ fontSize: '14px', color: '#0A1628', textDecoration: checked[doc] ? 'line-through' : 'none', opacity: checked[doc] ? 0.6 : 1 }}>
                    {i + 1}. {doc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="no-print" onClick={handlePrint}
            style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#1565C0,#0288D1)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
