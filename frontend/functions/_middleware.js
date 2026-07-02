// functions/_middleware.js
//
// Cloudflare Pages Function — runs at the edge, BEFORE the React app loads.
// Fixes the "wrong title on Google" issue permanently by rewriting <title>,
// meta description, and OG tags directly in the raw HTML response using
// real data from the FastAPI backend. Works for every blog post automatically —
// no per-page code needed going forward.
//
// IMPORTANT: This file must live at the ROOT of your repo (or the root of the
// directory Cloudflare Pages builds from) as `functions/_middleware.js`,
// NOT inside `src/` or `dist/`. Cloudflare auto-detects it on deploy.

const API_BASE = "https://api.truecreds.in";// ← replace with your actual Render API URL
const SITE_URL = "https://truecreds.in"; // ← replace if needed
const SITE_NAME = "TrueCreds";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.jpg`;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only intercept blog post detail pages: /blog/:slug
  const blogMatch = url.pathname.match(/^\/blog\/([^/]+)\/?$/);

  if (!blogMatch) {
    return next(); // everything else passes through untouched
  }

  const slug = blogMatch[1];

  // Get the normal SPA HTML shell first
  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response; // not HTML (e.g. asset request) — skip
  }

  // Fetch the real post data from your backend
  let post = null;
  try {
    const apiRes = await fetch(`${API_BASE}/api/blog/posts/${slug}`);
    if (apiRes.ok) {
      post = await apiRes.json();
    }
  } catch (err) {
    // Backend unreachable — fail gracefully, serve default SPA shell
    return response;
  }

  if (!post || !post.title) {
    return response; // post not found — let the SPA handle its own 404
  }

  const title = `${post.title} | ${SITE_NAME}`;
  const description =
    post.meta_description || post.excerpt || post.title || "";
  const canonical = `${SITE_URL}/blog/${slug}`;
  const image = post.cover_image || DEFAULT_OG_IMAGE;

  const rewriter = new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute("content", title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute("content", image);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", canonical);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", canonical);
      },
    });

  return rewriter.transform(response);
}
