import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import LoanCard from '../components/LoanCard';
import EligibilityForm from '../components/EligibilityForm';

const META = {
  delhi: { title: 'Loans in Delhi NCR', intro: 'Instant personal loans available for Delhi, Gurgaon, Faridabad & NCR. Get matched with lenders who approve Delhi-based borrowers fastest.' },
  mumbai: { title: 'Loans in Mumbai', intro: 'Personal and business loans for Mumbai residents. Compare rates from lenders with the highest approval rates in the financial capital.' },
  noida: { title: 'Loans in Noida', intro: 'Instant loans for Noida and Greater Noida residents. Tech-savvy lenders with digital-first approval in 10 minutes.' },
  jaipur: { title: 'Loans in Jaipur', intro: 'Personal and business loans in the Pink City. Compare rates from RBI-registered NBFCs serving Jaipur borrowers.' },
};
const OTHER_CITIES = ['delhi','mumbai','noida','jaipur'];

export default function Location() {
  const { slug } = useParams();
  const [loans, setLoans] = useState([]);
  const meta = META[slug] || { title: `Loans in ${slug}`, intro: `Find personal loans in ${slug}.` };
  useEffect(() => { api.get(`/api/loan-apps?location=${slug}`).then(r => setLoans(r.data)); }, [slug]);
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
          <div className="mt-8">
            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Other cities</div>
            <div className="flex flex-wrap gap-2">
              {OTHER_CITIES.filter(c => c !== slug).map(c => (
                <Link key={c} to={`/loans-in/${c}`} className="badge-mint capitalize no-underline hover:border-mint">{c}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-24"><EligibilityForm compact /></div>
        </div>
      </div>
    </div>
  );
}
