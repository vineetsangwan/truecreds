// functions/_middleware.js — DEBUG VERSION
// Adds x-mw-debug header so we can see exactly which branch executes.
// Once the issue is found, we'll switch back to the clean version.

const API_BASE = "https://api.truecreds.in";
const SITE_URL = "https://truecreds.in";
const SITE_NAME = "TrueCreds";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.jpg`;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  const blogMatch = url.pathname.match(/^\/blog\/([^/]+)\/?$/);

  if (!blogMatch) {
    const resp = await next();
    return resp;
  }

  const slug = blogMatch[1];
  const response = await next();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    const resp = new Response(response.body, response);
    resp.headers.set("x-mw-debug", "not-html:" + contentType);
    return resp;
  }

  let post = null;
  let debugMsg = "";
  try {
    const apiRes = await fetch(`${API_BASE}/api/blog/posts/${slug}`);
    debugMsg = "api-status:" + apiRes.status;
    if (apiRes.ok) {
      post = await apiRes.json();
      debugMsg += ";has-title:" + (!!post && !!post.title);
    }
  } catch (err) {
    debugMsg = "fetch-error:" + err.message;
    const resp = new Response(response.body, response);
    resp.headers.set("x-mw-debug", debugMsg);
    return resp;
  }

  if (!post || !post.title) {
    const resp = new Response(response.body, response);
    resp.headers.set("x-mw-debug", "no-post-or-title;" + debugMsg);
    return resp;
  }

  const title = `${post.title} | ${SITE_NAME}`;
  const description = post.meta_description || post.excerpt || post.title || "";
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

  const transformed = rewriter.transform(response);
  const finalResp = new Response(transformed.body, transformed);
  finalResp.headers.set("x-mw-debug", "success;" + debugMsg);
  return finalResp;
}
