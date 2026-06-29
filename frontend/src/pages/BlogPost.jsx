import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import PageTransition from '../components/PageTransition';
import EligibilityForm from '../components/EligibilityForm';

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

function injectHeadingIds(html) {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

function parseTable(block) {
  const lines = block.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return null;
  const isSeparator = (l) => /^\|[\s|:-]+\|$/.test(l.trim());
  if (!isSeparator(lines[1])) return null;
  const parseRow = (line) =>
    line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);
  const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1.5rem 0"><table style="min-width:500px;width:100%;border-collapse:collapse">${thead}${tbody}</table></div>`;
}

function markdownToHtml(text) {
  if (!text) return '';
  if (text.trim().startsWith('<')) return injectHeadingIds(text);
  const blocks = text.split(/\n\n+/);
  const processed = blocks.map(block => {
    const trimmed = block.trim();
    if (trimmed.startsWith('|') && trimmed.includes('\n')) {
      const table = parseTable(trimmed);
      if (table) return table;
    }
    let html = trimmed
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^---$/gm, '<hr>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, s => `<ul>${s}</ul>`);
    if (!html.match(/^<(h[1-6]|ul|ol|li|blockquote|hr|img|table)/)) {
      html = `<p>${html}</p>`;
    }
    return html;
  });
  return injectHeadingIds(processed.join('\n'));
}

function TableOfContents({ headings, activeId, onHeadingClick }) {
  if (!headings.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(21,101,192,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(21,101,192,0.08)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)', padding: '14px 20px' }}>
        <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>📋 Table of Contents</div>
      </div>
      <nav style={{ padding: '12px' }}>
        {headings.map((h, i) => (
          <a key={i} href={`#${h.id}`}
            onClick={e => { e.preventDefault(); onHeadingClick && onHeadingClick(h.id); }}
            style={{
              display: 'block',
              fontSize: '12px',
              padding: h.level === 3 ? '7px 12px 7px 24px' : '8px 12px',
              borderRadius: '8px',
              marginBottom: '2px',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: activeId === h.id ? 600 : 400,
              color: activeId === h.id ? '#1565C0' : '#3B5280',
              background: activeId === h.id ? 'rgba(21,101,192,0.08)' : 'transparent',
              borderLeft: activeId === h.id && h.level === 2 ? '3px solid #1565C0' : '3px solid transparent',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { if (activeId !== h.id) e.currentTarget.style.background = 'rgba(21,101,192,0.04)'; }}
            onMouseLeave={e => { if (activeId !== h.id) e.currentTarget.style.background = 'transparent'; }}>
            {h.level === 3 && <span style={{ color: '#94A3B8', marginRight: '4px', fontSize: '10px' }}>└</span>}
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

function ShareButtons({ title }) {
  const url = window.location.href;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider mr-1 font-semibold" style={{ color: '#7A90B8' }}>Share</span>
      {[
        { label: 'X', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
        { label: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}` },
        { label: 'LinkedIn', icon: 'in', url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
      ].map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs no-underline transition-all font-semibold"
          style={{ border: '1px solid rgba(21,101,192,0.2)', color: '#1565C0', background: 'rgba(21,101,192,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1565C0'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(21,101,192,0.05)'; e.currentTarget.style.color = '#1565C0'; }}>
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

  const scrollToHeading = (id) => {
    const el = contentRef.current;
    if (!el) return;
    const target = el.querySelector(`#${id}`);
    if (target) {
      el.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
    }
  };

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

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      // Track scroll progress of the article container itself
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
      // Active heading detection
      const allH = el.querySelectorAll('h2, h3');
      let current = '';
      allH.forEach(h => {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      });
      if (current) setActiveId(current);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [post]);

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">📭</div>
      <h1 className="font-black text-3xl mb-2" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628' }}>Article Not Found</h1>
      <p className="mb-6" style={{ color: '#3B5280' }}>This article does not exist or was removed.</p>
      <Link to="/blog" className="btn-mint">← Back to Blog</Link>
    </div>
  );

  if (!post) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1565C0', borderTopColor: 'transparent' }} />
        <span className="text-sm" style={{ color: '#7A90B8' }}>Loading article...</span>
      </div>
    </div>
  );

  const contentHtml = markdownToHtml(post.content);

  return (
    <PageTransition>

      {/* READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60]" style={{ background: 'rgba(21,101,192,0.1)' }}>
        <motion.div className="h-full rounded-r-full" style={{ background: 'linear-gradient(90deg, #1565C0, #0288D1)', width: `${readProgress}%` }} />
      </div>

      {/* HERO — full bleed image, no crop, professional glass overlay */}
      <div style={{ position: 'relative', width: '100%', minHeight: '560px', display: 'flex', alignItems: 'center' }}>

        {/* BG image — contain so nothing is cropped */}
        {post.cover_image ? (
          <>
            <img
              src={post.cover_image}
              alt={post.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                zIndex: 0,
              }}
            />
            {/* Left-heavy gradient so right image is visible, left has overlay for text */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(100deg, rgba(5,15,45,0.92) 0%, rgba(5,15,45,0.72) 45%, rgba(5,15,45,0.20) 75%, rgba(5,15,45,0.05) 100%)',
            }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg,#1565C0,#0288D1,#0D47A1)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        )}

        {/* Diagonal white cut at bottom */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 3, lineHeight: 0, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: '80px', display: 'block' }}>
            <polygon points="0,80 1440,80 0,30" fill="#ffffff" />
          </svg>
        </div>

        {/* Content — left side, max half screen width on desktop */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 2, paddingTop: '56px', paddingBottom: '96px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.7)'}>Home</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <Link to="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.7)'}>Blog</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
          </div>

          {/* Content block — max 55% width on desktop, full on mobile */}
          <div style={{ maxWidth: 'min(640px, 55%)', width: '100%' }} className="hero-content-block">

            {/* Meta pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{
                padding: '5px 14px', borderRadius: '999px', fontSize: '10px',
                fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
                letterSpacing: '0.15em', fontWeight: 700,
                background: 'rgba(21,101,192,0.7)',
                backdropFilter: 'blur(8px)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
              }}>
                {post.category}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono,monospace' }}>
                📖 {post.read_time} read
              </span>
              {post.published_at && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                  🗓 {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Title — large, bold, white */}
            <h1 style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}>
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{
                fontSize: 'clamp(14px,1.8vw,16px)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.88)',
                marginBottom: '24px',
                textShadow: '0 1px 8px rgba(0,0,0,0.4)',
              }}>
                {post.excerpt.replace(/<[^>]+>/g, '')}
              </p>
            )}

            {/* Thin divider */}
            <div style={{ width: '48px', height: '3px', borderRadius: '3px', background: 'linear-gradient(90deg,#60A5FA,#3B82F6)', marginBottom: '20px' }} />

            <ShareButtons title={post.title} />
          </div>
        </div>

        <style>{`
          @media(max-width:640px){
            .hero-content-block{ max-width:100% !important; width:100% !important; }
          }
        `}</style>
      </div>

      {/* MAIN CONTENT — fixed sidebars, only article scrolls */}
      <div style={{ background: '#fff', display: 'flex', height: 'calc(100vh - 64px)', position: 'sticky', top: '64px', borderTop: '1px solid rgba(21,101,192,0.08)' }}>

        {/* LEFT SIDEBAR — fixed, never scrolls */}
        <aside className="hidden lg:flex flex-col" style={{ width: '300px', flexShrink: 0, height: '100%', overflowY: 'auto', borderRight: '1px solid rgba(21,101,192,0.1)', scrollbarWidth: 'none', background: '#F8FAFF' }}>
          <div className="p-5 space-y-5">
            <TableOfContents headings={headings} activeId={activeId} onHeadingClick={scrollToHeading} />
            <div style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0, #0288D1)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 8px 32px rgba(21,101,192,0.25)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
              <div style={{ color: '#fff', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>Compare Loan Apps</div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: 1.6, marginBottom: '14px' }}>See which lender gives you the best rate for your CIBIL score</p>
              <Link to="/compare" style={{ display: 'block', background: '#fff', color: '#1565C0', fontWeight: 700, fontSize: '13px', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>Compare All Lenders →</Link>
            </div>
          </div>
        </aside>

        {/* CENTER — ONLY this scrolls */}
        <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', padding: '48px 64px', background: '#fff' }} ref={contentRef}>

          {/* Mobile TOC */}
          {headings.length > 0 && (
            <div className="lg:hidden mb-8">
              <TableOfContents headings={headings} activeId={activeId} onHeadingClick={scrollToHeading} />
            </div>
          )}

          {/* ARTICLE BODY */}
          <div className="blog-content mb-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {/* TAGS */}
          <div className="rounded-2xl p-5 mb-6" style={{ border: '1px solid rgba(21,101,192,0.12)' }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Personal Loan', 'India', 'CIBIL', 'Finance Tips', post.category].filter(Boolean).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ border: '1px solid rgba(21,101,192,0.2)', color: '#1565C0', background: 'rgba(21,101,192,0.06)' }}>
                  #{tag.replace(' ', '')}
                </span>
              ))}
            </div>
            <ShareButtons title={post.title} />
          </div>

          {/* AUTHOR */}
          <div className="rounded-2xl p-5 flex gap-4 mb-10" style={{ border: '1px solid rgba(21,101,192,0.12)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)' }}>✅</div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#0A1628' }}>TrueCreds Editorial Team</div>
              <p className="text-xs leading-relaxed" style={{ color: '#3B5280' }}>Our team compares loan products from 12+ RBI-registered lenders to bring you accurate, unbiased financial guides.</p>
            </div>
          </div>

          {/* RELATED POSTS */}
          {related.length > 0 && (
            <div className="pt-10" style={{ borderTop: '1px solid rgba(21,101,192,0.1)' }}>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2 font-bold" style={{ color: '#1565C0' }}>/ KEEP READING</div>
              <h2 className="font-bold text-2xl mb-8" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628' }}>Related Articles</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((p, i) => (
                  <motion.div key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link to={`/blog/${p.slug}`} className="block no-underline group rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(21,101,192,0.12)', boxShadow: '0 4px 16px rgba(21,101,192,0.06)' }}>
                      <div className="h-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)' }}>
                        {p.cover_image
                          ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                          : <div className="w-full h-full flex items-center justify-center"><span className="text-4xl opacity-30">📄</span></div>
                        }
                      </div>
                      <div className="p-4" style={{ background: '#fff' }}>
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block font-bold" style={{ background: 'rgba(21,101,192,0.08)', color: '#1565C0' }}>{p.category}</span>
                        <h3 className="font-semibold text-sm leading-snug" style={{ fontFamily: 'Outfit,sans-serif', color: '#0A1628' }}>{p.title}</h3>
                        <div className="text-[10px] font-mono mt-2" style={{ color: '#7A90B8' }}>{p.read_time} read</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* RIGHT SIDEBAR — fixed, never scrolls */}
        <aside className="hidden lg:flex flex-col" style={{ width: '320px', flexShrink: 0, height: '100%', overflowY: 'auto', borderLeft: '1px solid rgba(21,101,192,0.1)', scrollbarWidth: 'none', background: '#F8FAFF' }}>
          <div className="p-5 space-y-5">
            <EligibilityForm compact />

            {/* QUICK LINKS */}
            <div style={{ background: '#fff', border: '1px solid rgba(21,101,192,0.12)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
              <div style={{ background: 'linear-gradient(135deg, #1565C0, #0288D1)', padding: '12px 20px' }}>
                <div style={{ color: '#fff', fontSize: '10px', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>🔗 Quick Links</div>
              </div>
              <div style={{ padding: '8px' }}>
                {[
                  { to: '/compare', label: 'Compare All Lenders', icon: '⚖️' },
                  { to: '/calculator', label: 'EMI Calculator', icon: '🧮' },
                  { to: '/loans/personal', label: 'Personal Loans', icon: '👤' },
                  { to: '/loans/instant', label: 'Instant Loans', icon: '⚡' },
                  { to: '/loans/no-cibil', label: 'No CIBIL Loans', icon: '📊' },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: '#3B5280', fontSize: '13px', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(21,101,192,0.06)'; e.currentTarget.style.color = '#1565C0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B5280'; }}>
                    <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{link.icon}</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{link.label}</span>
                    <span style={{ color: '#1565C0', fontSize: '12px' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* RATE TICKER */}
            <div style={{ background: '#fff', border: '1.5px solid rgba(21,101,192,0.15)', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>📈</span>
                <span style={{ color: '#1565C0', fontSize: '11px', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Today's Best Rates</span>
              </div>
              {[['Navi', '9.9%', '⭐'], ['Bajaj Finserv', '11%', '🏛️'], ['MoneyTap', '13%', '💧']].map(([name, rate, icon]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(21,101,192,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{icon}</span>
                    <span style={{ fontSize: '13px', color: '#3B5280', fontWeight: 500 }}>{name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: '#1565C0' }}>{rate} p.a.</span>
                </div>
              ))}
              <Link to="/compare" style={{ display: 'block', textAlign: 'center', marginTop: '14px', padding: '9px', border: '1.5px solid #1565C0', borderRadius: '10px', color: '#1565C0', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1565C0'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565C0'; }}>
                See All Rates →
              </Link>
            </div>

          </div>
        </aside>

      </div>

      <style>{`
        .blog-content { color: #334155; font-size: 15px; line-height: 1.85; }
        .blog-content h2 { font-family: Outfit,sans-serif; font-size: 1.6rem; font-weight: 800; color: #0A1628; margin: 2rem 0 1rem; letter-spacing: -0.02em; padding-bottom: 0.75rem; border-bottom: 2px solid rgba(21,101,192,0.15); }
        .blog-content h3 { font-family: Outfit,sans-serif; font-size: 1.15rem; font-weight: 700; color: #1565C0; margin: 1.5rem 0 0.75rem; }
        .blog-content p { margin-bottom: 1.25rem; color: #334155; }
        .blog-content strong, .blog-content b { color: #0A1628; font-weight: 700; }
        .blog-content em { color: #475569; font-style: italic; }
        .blog-content ul, .blog-content ol { margin: 1rem 0 1.25rem 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; color: #334155; }
        .blog-content ul li::marker { color: #1565C0; }
        .blog-content ol li::marker { color: #1565C0; font-weight: 700; }
        .blog-content a { color: #1565C0; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content a:hover { color: #0D47A1; }
        .blog-content blockquote { border-left: 4px solid #1565C0; padding: 1rem 1.25rem; margin: 1.5rem 0; background: rgba(21,101,192,0.05); border-radius: 0 12px 12px 0; color: #475569; font-style: italic; }
        .blog-content code { font-family: 'JetBrains Mono',monospace; font-size: 13px; background: rgba(21,101,192,0.08); padding: 2px 8px; border-radius: 5px; color: #1565C0; }
        .blog-content pre { background: #F0F6FF; border: 1px solid rgba(21,101,192,0.15); border-radius: 12px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .blog-content pre code { background: none; padding: 0; color: #334155; }
        .blog-content img { width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(21,101,192,0.12); }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 14px; min-width: 500px; }
        .blog-content table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .blog-content th { background: linear-gradient(135deg, #1565C0, #0288D1); color: #fff; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
        .blog-content td { padding: 10px 14px; border-bottom: 1px solid rgba(21,101,192,0.08); color: #334155; }
        .blog-content tr:hover td { background: rgba(21,101,192,0.03); }
        .blog-content hr { border: none; border-top: 2px solid rgba(21,101,192,0.1); margin: 2rem 0; }
      `}</style>

    </PageTransition>
  );
}
