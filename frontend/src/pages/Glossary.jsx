import PageTransition from '../components/PageTransition';
import React, { useState, useMemo } from 'react';

const TERMS = [
  { term: 'FOIR', full: 'Fixed Obligation to Income Ratio', def: 'The percentage of your monthly income that goes toward fixed debt obligations (EMIs, rent). Most lenders want this under 50%.' },
  { term: 'MCLR', full: 'Marginal Cost of Funds based Lending Rate', def: 'The minimum interest rate a bank can charge, based on its cost of borrowing funds. Used as a benchmark for floating rate loans.' },
  { term: 'CIBIL Score', full: 'Credit Information Bureau Score', def: 'A 3-digit number (300-900) representing your creditworthiness based on repayment history. Higher is better.' },
  { term: 'Processing Fee', full: '', def: 'A one-time non-refundable fee charged by lenders to process your loan application, typically 1-3% of loan amount.' },
  { term: 'Prepayment Penalty', full: '', def: 'A fee charged if you repay your loan before the agreed tenure ends. RBI has banned this on floating-rate personal loans.' },
  { term: 'Moratorium', full: '', def: 'A period during which you are not required to make EMI payments, though interest may still accrue. Common in education loans.' },
  { term: 'EMI', full: 'Equated Monthly Instalment', def: 'A fixed monthly payment combining principal and interest, paid until the loan is fully repaid.' },
  { term: 'Tenure', full: '', def: 'The total duration over which a loan is repaid, usually expressed in months or years.' },
  { term: 'Disbursal', full: '', def: 'The process of releasing approved loan funds into the borrower\'s bank account.' },
  { term: 'Collateral', full: '', def: 'An asset pledged as security for a loan. Personal loans are usually unsecured (no collateral needed).' },
  { term: 'NBFC', full: 'Non-Banking Financial Company', def: 'A financial institution that provides banking services without holding a full banking license. Many instant loan apps are NBFCs.' },
  { term: 'Floating Rate', full: '', def: 'An interest rate that changes periodically based on market conditions or a benchmark rate like MCLR or repo rate.' },
  { term: 'Fixed Rate', full: '', def: 'An interest rate that remains constant throughout the loan tenure, regardless of market changes.' },
  { term: 'Soft Inquiry', full: '', def: 'A credit check that does NOT affect your CIBIL score, usually done for eligibility checks or pre-approved offers.' },
  { term: 'Hard Inquiry', full: '', def: 'A credit check done when you formally apply for a loan, which can slightly lower your CIBIL score temporarily.' },
  { term: 'Guarantor', full: '', def: 'A person who agrees to repay the loan if the primary borrower defaults. Required for some high-value or low-CIBIL loans.' },
  { term: 'Top-Up Loan', full: '', def: 'Additional funds borrowed on top of an existing loan, usually at the same or similar interest rate.' },
  { term: 'Bounce Charges', full: '', def: 'Penalty fees charged when an EMI payment fails due to insufficient funds in your bank account.' },
  { term: 'Foreclosure', full: '', def: 'Paying off the entire outstanding loan amount before the scheduled tenure ends.' },
  { term: 'Part Payment', full: '', def: 'Paying an extra amount toward your loan principal (beyond the EMI) to reduce the outstanding balance faster.' },
  { term: 'Sanction Letter', full: '', def: 'An official document from the lender confirming loan approval, including amount, rate, and terms.' },
  { term: 'KYC', full: 'Know Your Customer', def: 'The process of verifying a borrower\'s identity using documents like Aadhaar, PAN, and address proof.' },
  { term: 'e-NACH', full: 'Electronic National Automated Clearing House', def: 'An electronic mandate that allows automatic EMI deduction from your bank account.' },
  { term: 'Loan Against Property', full: 'LAP', def: 'A secured loan where you pledge property as collateral, usually offering lower interest rates than unsecured loans.' },
  { term: 'Debt-to-Income Ratio', full: 'DTI', def: 'Total monthly debt payments divided by gross monthly income, used to assess repayment capacity.' },
  { term: 'Co-applicant', full: '', def: 'A second person who jointly applies for a loan, sharing responsibility for repayment. Improves approval chances.' },
  { term: 'Pre-approved Loan', full: '', def: 'A loan offer extended to you in advance based on your existing relationship/credit profile with a lender, usually faster to avail.' },
  { term: 'Loan Restructuring', full: '', def: 'Modifying loan terms (tenure, EMI, rate) typically done when a borrower faces repayment difficulty.' },
  { term: 'Repo Rate', full: '', def: 'The rate at which RBI lends money to commercial banks. Changes in repo rate often affect floating loan interest rates.' },
  { term: 'Base Rate', full: '', def: 'The minimum interest rate set by RBI below which banks cannot lend (mostly replaced by MCLR now).' },
];

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [letter, setLetter] = useState('All');

  const filtered = useMemo(() => {
    return TERMS
      .filter(t => letter === 'All' || t.term[0].toUpperCase() === letter)
      .filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [search, letter]);

  const letters = ['All', ...new Set(TERMS.map(t => t.term[0].toUpperCase()))].sort();

  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(135deg,#1565C0,#0288D1)', padding: '56px 0 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/ LOAN GLOSSARY</div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>📖 Loan Terms Explained Simply</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px' }}>FOIR, MCLR, moratorium — every confusing loan term, explained in plain English.</p>
        </div>
      </div>

      <div style={{ background: '#F0F6FF', padding: '40px 0 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

          <input type="text" placeholder="🔍 Search a term..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid rgba(21,101,192,0.2)', background: '#fff', fontSize: '15px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }} />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {letters.map(l => (
              <button key={l} onClick={() => setLetter(l)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: `1.5px solid ${letter === l ? '#1565C0' : 'rgba(21,101,192,0.2)'}`, background: letter === l ? '#1565C0' : '#fff', color: letter === l ? '#fff' : '#3B5280', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '20px 24px', border: '1px solid rgba(21,101,192,0.1)', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '16px', color: '#1565C0', margin: 0 }}>{t.term}</h3>
                  {t.full && <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>({t.full})</span>}
                </div>
                <p style={{ fontSize: '14px', color: '#3B5280', lineHeight: 1.7, margin: 0 }}>{t.def}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No terms found matching "{search}"</div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
