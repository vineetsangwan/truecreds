import PageTransition from '../components/PageTransition';
import React from 'react';
import EligibilityForm from '../components/EligibilityForm';

export default function Apply() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-[10px] font-mono text-mint uppercase tracking-[0.2em] mb-2">/ APPLY</div>
      <h1 className="font-black text-3xl sm:text-4xl mb-3" style={{fontFamily:'Outfit,sans-serif'}}>Check Your Eligibility</h1>
      <p className="text-slate-400 mb-8">Free · Instant · Zero CIBIL impact. Fill in your details and we'll match you with the best lenders for your profile.</p>
      <EligibilityForm />
    </div>
  );
}
