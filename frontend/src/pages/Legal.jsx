import React from 'react';
import { useParams } from 'react-router-dom';

const CONTENT = {
  privacy: { title: 'Privacy Policy', body: `Last updated: January 2026\n\nTrueCreds ("we", "our", "us") is committed to protecting your personal information.\n\n**What we collect:** Name, mobile number, email (optional), loan amount, employment details, and city.\n\n**How we use it:** To match you with relevant lenders, improve our service, and send you loan-related communications (only if you opt in).\n\n**We never:** Sell your personal data to third parties. Share your data with any party that isn't a registered lender.\n\n**Your rights:** You may request deletion of your data at any time by emailing privacy@truecreds.in\n\n**Security:** All data is transmitted over HTTPS and stored in encrypted databases.` },
  disclaimer: { title: 'Disclaimer', body: `**TrueCreds is NOT a lender.**\n\nWe are a loan comparison and lead generation platform. We do not directly provide loans, financial advice, or credit decisions.\n\nAll loan products displayed on this platform are offered by third-party RBI-registered NBFCs and banks. Loan approval, interest rates, and terms are determined solely by the respective lender.\n\n**Affiliate disclosure:** TrueCreds earns a referral commission from lenders when users apply through our platform. This commission does not affect our rankings, which are based purely on our algorithmic scoring.\n\n**CIBIL impact:** Our eligibility check is a soft inquiry and does not affect your credit score. Applying directly with a lender may result in a hard inquiry.\n\nInterest rates displayed are indicative and subject to change. Always verify the final rate directly with the lender before signing any agreement.` },
};

export default function Legal() {
  const { slug } = useParams();
  const page = CONTENT[slug] || CONTENT.disclaimer;
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-black text-3xl mb-8" style={{fontFamily:'Outfit,sans-serif'}}>{page.title}</h1>
      <div className="card-cosmic prose prose-invert max-w-none">
        {page.body.split('\n\n').map((para, i) => {
          const html = para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
          return <p key={i} className="text-slate-400 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{__html:html}} />;
        })}
      </div>
    </div>
  );
}
