// Seo.jsx — Reusable per-page SEO component
//
// Drop this into ANY page component to set correct title/description/
// canonical/OG tags — fixes the "stale meta tags after client-side
// navigation" issue site-wide, not just for blog posts.
//
// USAGE (add near the top of any page's return statement):
//
//   <Seo
//     title="Compare Personal Loans"
//     description="Compare interest rates from top banks and NBFCs in India."
//     path="/compare"
//   />
//
// For dynamic pages (e.g. /loans/:slug), pass the current path explicitly:
//
//   <Seo
//     title={`${category.name} Loans | TrueCreds`}
//     description={category.meta_description}
//     path={`/loans/${slug}`}
//   />

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.truecreds.in";
const SITE_NAME = "TrueCreds";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Compare the best instant loan apps in India. Check eligibility in 2 minutes, no CIBIL impact.";

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_OG_IMAGE,
  type = "website",
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Compare India's Best Loan Apps`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
