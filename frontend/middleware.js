// middleware.js — Vercel Edge Middleware
//
// Handles two things:
// 1. Blog posts (/blog/:slug) — full title/description/OG rewrite using real
//    post data from the backend.
// 2. ALL other pages — fixes the canonical URL + og:url to match the actual
//    page being requested, instead of every page inheriting the static
//    homepage canonical from index.html.
//
// NOTE: filtering is done INSIDE the function (not via matcher regex) —
// Vercel's generic Edge Middleware (non-Next.js) doesn't reliably support
// complex matcher regex like negative lookaheads. A broad matcher + manual
// checks is more robust.

const API_BASE = "https://api.truecreds.in";
const SITE_URL = "https://www.truecreds.in";
const SITE_NAME = "TrueCreds";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.jpg`;

export const config = {
  matcher: "/:path*",
};

const SKIP_EXTENSIONS = [
  ".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif",
  ".ico", ".woff", ".woff2", ".ttf", ".map", ".json", ".xml", ".txt",
];

function shouldSkip(pathname) {
  if (pathname.startsWith("/api/")) return true;
  if (SKIP_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;
  return false;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function middleware(request) {
  const url = new URL(request.url);

  if (shouldSkip(url.pathname)) {
    return fetch(request);
  }

  const response = await fetch(request);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const canonical = `${SITE_URL}${url.pathname === "/" ? "" : url.pathname}`;
  const blogMatch = url.pathname.match(/^\/blog\/([^/]+)\/?$/);

  let html = await response.text();

  // ── Case 1: Blog post — fetch real title/description from backend ──
  if (blogMatch) {
    const slug = blogMatch[1];
    let post = null;
    try {
      const apiRes = await fetch(`${API_BASE}/api/blog/posts/${slug}`);
      if (apiRes.ok) {
        post = await apiRes.json();
      }
    } catch (err) {
      post = null;
    }

    if (post && post.title) {
      const title = escapeHtml(`${post.title} | ${SITE_NAME}`);
      const description = escapeHtml(
        post.meta_description || post.excerpt || post.title || ""
      );
      const image = post.cover_image || DEFAULT_OG_IMAGE;

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
    }
  }

  // ── Case 2: ALL pages — fix canonical + og:url to match the actual page ──
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${escapeHtml(canonical)}$2`
  );
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${escapeHtml(canonical)}$2`
  );

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
}