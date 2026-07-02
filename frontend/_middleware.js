// middleware.js — Vercel Edge Middleware
//
// Runs at Vercel's edge, before the SPA's static HTML is served.
// Fixes the "wrong title on Google" issue by rewriting <title>, meta
// description, and OG tags directly in the HTML using real data from
// the Railway backend. Works for every blog post automatically.
//
// IMPORTANT: This file must live at the ROOT of the directory Vercel
// builds (same level as package.json, index.html, vercel.json) —
// i.e. frontend/middleware.js, NOT inside src/.

const API_BASE = "https://api.truecreds.in"; // ← replace with your actual Railway backend URL
const SITE_URL = "https://www.truecreds.in";
const SITE_NAME = "TrueCreds";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.jpg`;

export const config = {
  matcher: "/blog/:slug*",
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/);

  // Fetch the original response from Vercel's origin/cache.
  // This does NOT re-trigger the middleware — it's a documented
  // Vercel pattern for reading+rewriting the response body.
  const response = await fetch(request);

  if (!match) {
    return response;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const slug = match[1];

  let post = null;
  try {
    const apiRes = await fetch(`${API_BASE}/api/blog/posts/${slug}`);
    if (apiRes.ok) {
      post = await apiRes.json();
    }
  } catch (err) {
    return response; // backend unreachable — serve default SPA shell
  }

  if (!post || !post.title) {
    return response; // post not found — let the SPA handle its own 404
  }

  const title = escapeHtml(`${post.title} | ${SITE_NAME}`);
  const description = escapeHtml(
    post.meta_description || post.excerpt || post.title || ""
  );
  const canonical = `${SITE_URL}/blog/${slug}`;
  const image = post.cover_image || DEFAULT_OG_IMAGE;

  let html = await response.text();

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${description}$2`
  );
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${title}$2`
  );
  html = html.replace(
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${description}$2`
  );
  html = html.replace(
    /(<meta property="og:image" content=")[^"]*(")/,
    `$1${escapeHtml(image)}$2`
  );
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${escapeHtml(canonical)}$2`
  );
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${escapeHtml(canonical)}$2`
  );

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
}
