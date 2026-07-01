import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  canonical,
  image = "https://truecreds.in/og-default.jpg",
  schema = [],
}) {
  const fullCanonical = canonical
    ? `https://truecreds.in${canonical}`
    : "https://truecreds.in";
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={image} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
