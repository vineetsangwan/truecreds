import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import PageTransition from '../components/PageTransition';
import EligibilityForm from '../components/EligibilityForm';

// Parse headings from content for Table of Contents
function extractHeadings(html) {
  const headings = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    headings.push({ level: parseInt(match[1]), text, id });
  }
  return headings;
}

// Inject IDs into headings for scroll
function injectHeadingIds(html) {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

// Convert local markdown-style content to HTML
function markdownToHtml(text) {
  if (!text) return '';
  // Already HTML (from WordPress)
  if (text.trim().startsWith('<')) return injectHeadingIds(text);
  // Local markdown-lite
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, s => `<ul>${s}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hup])(.+)$/gm, (m) => m.trim() ? m : '')
    .replace(/^<\/p><p>$/, '')
    .trim()
    .replace(/^(.+)$/, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
}

function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.07)]" style={{ background: '#0A1728' }}>
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)]" style={{ background: 'rgba(0,255,157,0.05)' }}>
        <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.2em]">Table of Contents</div>
      </div>
      <nav className="p-4 space-y-1">
        {headings.map((h, i) => (
          <a key={i} href={`#${h.id}`}
            className={`block text-xs py-1.5 px-3 rounded-lg transition-all no-underline ${h.level === 3 ? 'ml-3' : ''} ${activeId === h.id ? 'bg-[rgba(0,255,157,0.1)] text-[#00FF9D] font-medium' : 'text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.04)]'}`}>
            {h.level === 3 && <span className="text-slate-700 mr-1">└</span>}
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

function ShareButtons({ title, slug }) {
  const url = window.location.href;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider mr-1">Share</span>
      {[
        { label: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
        { label: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}` },
        { label: 'LinkedIn', icon: 'in', url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
      ].map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
          className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-xs text-slate-400 hover:border-[rgba(0,255,157,0.3)] hover:text-[#00FF9D] transition-all no-underline">
          {s.icon}
        </a>
      ))}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    setPost(null); setError(false); setHeadings([]);
    api.get(`/api/blog/posts/${slug}`).then(r => {
      setPost(r.data);
      const html = markdownToHtml(r.data.content);
      setHeadings(extractHeadings(html));
    }).catch(() => setError(true));
    api.get('/api/blog/posts').then(r => {
      const posts = Array.isArray(r.data) ? r.data : r.data.posts || [];
      setRelated(posts.filter(p => p.slug !== slug).slice(0, 3));
    });
  }, [slug]);

  // Reading progress + active heading tracker
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(Math.min(100, (window.scrollY / total) * 100));
      // Active heading
      const allHeadings = el.querySelectorAll('h2, h3');
      let current = '';
      allHeadings.forEach(h => {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      });
      if (current) setActiveId(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">📭</div>
      <h1 className="font-black text-3xl mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>Article Not Found</h1>
      <p className="text-slate-400 mb-6">This article doesn't exist or was removed.</p>
      <Link to="/blog" className="btn-mint">← Back to Blog</Link>
    </div>
  );

  if (!post) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00FF9D] border-t-transparent animate-spin" />
        <span className="text-slate-500 text-sm">Loading article...</span>
      </div>
    </div>
  );

  const contentHtml = markdownToHtml(post.content);

  return (
    <PageTransition>
      {/* READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60]" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #00FF9D, #00BFFF)', width: `${readProgress}%` }} />
      </div>

      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(180deg, #0A1728 0%, #070F1E 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link to="/" className="hover:text-white no-underline transition-colors">Home</Link>
            <span>›</span>
            <Link to="/blog" className="hover:text-white no-underline transition-colors">Blog</Link>
            <span>›</span>
            <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
          </div>

          <div className="max-w-3xl">
            {/* CATEGORY + META */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="badge-mint">{post.category}</span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-400 font-mono">{post.read_time} read</span>
              {post.published_at && (
                <>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-xs text-slate-400">
                    {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </>
              )}
              {post.source === 'wordpress' && (
                <>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-[9px] font-mono text-[#00FF9D] uppercase tracking-wider">WordPress</span>
                </>
              )}
            </div>

            {/* TITLE */}
            <h1 className="font-black leading-tight mb-5" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>

            {/* EXCERPT */}
            {post.excerpt && (
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {post.excerpt.replace(/<[^>]+>/g, '')}
              </p>
            )}

            <ShareButtons title={post.title} slug={slug} />
          </div>
        </div>

        {/* FEATURED IMAGE */}
        {post.cover_image && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
            <div className="rounded-t-2xl overflow-hidden border-t border-x border-[rgba(255,255,255,0.08)]" style={{ maxHeight: 460 }}>
              <img src={post.cover_image} alt={post.title} className="w-full object-cover" style={{ maxHeight: 460 }} />
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT: TABLE OF CONTENTS (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-5">
              <TableOfContents headings={headings} activeId={activeId} />
              <div className="rounded-2xl p-4 border border-[rgba(255,255,255,0.07)] text-center" style={{ background: '#0A1728' }}>
                <div className="text-2xl mb-2">🦈</div>
                <div className="font-bold text-sm mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>Compare Loan Apps</div>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">Find the lowest rate for your profile</p>
                <Link to="/compare" className="btn-mint text-xs px-4 py-2 w-full justify-center">Compare Now →</Link>
              </div>
            </div>
          </aside>

          {/* CENTER: ARTICLE CONTENT */}
          <article className="lg:col-span-6" ref={contentRef}>
            {/* Mobile TOC */}
            {headings.length > 0 && (
              <div className="lg:hidden mb-8">
                <TableOfContents headings={headings} activeId={activeId} />
              </div>
            )}

            {/* ARTICLE BODY */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* TAGS */}
            <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.07)]">
              <div className="flex flex-wrap gap-2 mb-6">
                {['Personal Loan', 'India', 'CIBIL', 'Finance Tips', post.category].filter(Boolean).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs border border-[rgba(255,255,255,0.1)] text-slate-400 hover:border-[rgba(0,255,157,0.3)] hover:text-[#00FF9D] cursor-pointer transition-all">
                    #{tag.replace(' ', '')}
                  </span>
                ))}
              </div>
              <ShareButtons title={post.title} slug={slug} />
            </div>

            {/* AUTHOR BOX */}
            <div className="mt-8 p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] flex gap-4" style={{ background: '#0A1728' }}>
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] flex items-center justify-center text-xl flex-shrink-0">🦈</div>
              <div>
                <div className="font-semibold text-sm mb-1">TrueCreds Editorial Team</div>
                <p className="text-xs text-slate-400 leading-relaxed">Our team compares loan products from 12+ RBI-registered lenders to bring you accurate, unbiased financial guides.</p>
              </div>
            </div>
          </article>

          {/* RIGHT: STICKY SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-5">
              {/* ELIGIBILITY WIDGET */}
              <EligibilityForm compact />

              {/* QUICK LINKS */}
              <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.07)]" style={{ background: '#0A1728' }}>
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)]" style={{ background: 'rgba(0,255,157,0.05)' }}>
                  <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.2em]">Quick Links</div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { to: '/compare', label: 'Compare All Lenders', icon: '⚖️' },
                    { to: '/calculator', label: 'EMI Calculator', icon: '🧮' },
                    { to: '/loans/personal', label: 'Personal Loans', icon: '👤' },
                    { to: '/loans/instant', label: 'Instant Loans', icon: '⚡' },
                    { to: '/loans/no-cibil', label: 'No CIBIL Loans', icon: '📊' },
                  ].map(link => (
                    <Link key={link.to} to={link.to}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.04)] no-underline transition-all group">
                      <span>{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      <span className="text-slate-700 group-hover:text-[#00FF9D] group-hover:translate-x-0.5 transition-all">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* RATE TICKER */}
              <div className="rounded-2xl p-4 border border-[rgba(0,255,157,0.15)]" style={{ background: 'rgba(0,255,157,0.04)' }}>
                <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-wider mb-3">Today's Best Rates</div>
                {[['Navi', '9.9%'], ['Bajaj', '11%'], ['MoneyTap', '13%']].map(([name, rate]) => (
                  <div key={name} className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                    <span className="text-xs text-slate-400">{name}</span>
                    <span className="text-xs font-mono font-bold text-[#00FF9D]">{rate} p.a.</span>
                  </div>
                ))}
                <Link to="/compare" className="btn-ghost text-xs px-3 py-2 w-full justify-center mt-3">See All Rates →</Link>
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED POSTS */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[rgba(255,255,255,0.07)]">
            <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.25em] mb-2">/ KEEP READING</div>
            <h2 className="font-bold text-2xl mb-8" style={{ fontFamily: 'Outfit,sans-serif' }}>Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <motion.div key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/blog/${p.slug}`} className="card-cosmic block no-underline group" style={{ textDecoration: 'none', padding: 0, overflow: 'hidden' }}>
                    <div className="h-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1728, #0E2138)' }}>
                      {p.cover_image
                        ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><span className="text-4xl opacity-10">📄</span></div>
                      }
                    </div>
                    <div className="p-4">
                      <span className="badge-mint text-[8px] mb-2 inline-block">{p.category}</span>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-[#00FF9D] transition-colors" style={{ fontFamily: 'Outfit,sans-serif' }}>{p.title}</h3>
                      <div className="text-[10px] text-slate-600 font-mono mt-2">{p.read_time} read</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BLOG CONTENT STYLES */}
      <style>{`
        .blog-content { color: #94A3B8; font-size: 15px; line-height: 1.85; }
        .blog-content h2 { font-family: Outfit,sans-serif; font-size: 1.6rem; font-weight: 700; color: #fff; margin: 2rem 0 1rem; letter-spacing: -0.02em; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .blog-content h3 { font-family: Outfit,sans-serif; font-size: 1.2rem; font-weight: 600; color: #e2e8f0; margin: 1.5rem 0 0.75rem; }
        .blog-content p { margin-bottom: 1.25rem; color: #94A3B8; }
        .blog-content strong, .blog-content b { color: #fff; font-weight: 600; }
        .blog-content em { color: #cbd5e1; font-style: italic; }
        .blog-content ul, .blog-content ol { margin: 1rem 0 1.25rem 1.5rem; space-y: 0.5rem; }
        .blog-content li { margin-bottom: 0.5rem; color: #94A3B8; position: relative; }
        .blog-content ul li::marker { color: #00FF9D; }
        .blog-content ol li::marker { color: #00FF9D; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .blog-content a { color: #00FF9D; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content a:hover { color: #00E08A; }
        .blog-content blockquote { border-left: 3px solid #00FF9D; padding: 1rem 1.25rem; margin: 1.5rem 0; background: rgba(0,255,157,0.05); border-radius: 0 12px 12px 0; color: #cbd5e1; font-style: italic; }
        .blog-content code { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 5px; color: #00FF9D; }
        .blog-content pre { background: #050C18; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .blog-content pre code { background: none; padding: 0; color: #e2e8f0; }
        .blog-content img { width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(255,255,255,0.08); }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 14px; }
        .blog-content th { background: rgba(0,255,157,0.08); color: #00FF9D; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(0,255,157,0.2); }
        .blog-content td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #94A3B8; }
        .blog-content tr:hover td { background: rgba(255,255,255,0.02); }
        .blog-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 2rem 0; }
      `}</style>
    </PageTransition>
  );
}
