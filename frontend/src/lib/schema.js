export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "TrueCreds",
  "url": "https://truecreds.in",
  "description": "TrueCreds compares personal, student, business, and instant loan apps from RBI-registered NBFCs and banks in India."
};

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  };
}