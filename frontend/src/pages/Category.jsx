import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import LoanCard from '../components/LoanCard';
import EligibilityForm from '../components/EligibilityForm';

const META = {
  personal: { title: 'Personal Loans', intro: 'Compare the best personal loan apps in India. Instant approval, competitive rates, and minimal documentation.' },
  student: { title: 'Student Loans', intro: 'Education and student-friendly loans with flexible repayment. Apply without a job or co-applicant.' },
  business: { title: 'Business Loans', intro: 'SME and working capital loans from leading NBFCs. Quick disbursal, no collateral options available.' },
  aadhaar: { title: 'Aadhaar-Based Loans', intro: 'Get a loan using just your Aadhaar card. eKYC-powered instant approval with zero paperwork.' },
  'no-cibil': { title: 'No CIBIL Loans', intro: 'Loans for low or zero CIBIL scores. Alternative data underwriting means more approvals.' },
  instant: { title: 'Instant Loans', intro: 'Money in your account in minutes. Same-day disbursal loan apps with the fastest approval times.' },
};

export default function Category() {
  const { slug } = useParams();
  const [loans, setLoans] = useState([]);
  const meta = META[slug] || { title: `${slug} Loans`, intro: `Find the best ${slug} loans in India.` };
  useEffect(() => { api.get(`/api/loan-apps?category=${slug}`).then(r => setLoans(r.data)); }, [slug]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-[10px] font-mono text-mint uppercase tracking-[0.2em] mb-2">/ {slug.toUpperCase()}</div>
      <h1 className="font-black text-3xl sm:text-4xl mb-3" style={{fontFamily:'Outfit,sans-serif'}}>{meta.title}</h1>
      <p className="text-slate-400 mb-10 max-w-2xl">{meta.intro}</p>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {loans.map((l, i) => <LoanCard key={l.id} loan={l} index={i} highlight={i===0} />)}
            {!loans.length && <p className="text-slate-500 col-span-2">Loading lenders...</p>}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-24"><EligibilityForm compact /></div>
        </div>
      </div>
    </div>
  );
}
