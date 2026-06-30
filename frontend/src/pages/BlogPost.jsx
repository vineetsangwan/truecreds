import PageTransition from '../components/PageTransition';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import EligibilityForm from '../components/EligibilityForm';

function ShareButtons({ title }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = (platform) => {
    const links = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(links[platform], '_blank', 'width=600,height=400');
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Share</span>
      {[['x','𝕏'],['whatsapp','💬'],['linkedin','in']].map(([p, icon]) => (
        <button key={p} onClick={() => share(p)}
          style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(21,101,192,0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: '#3B5280' }}>
          {icon}
        </button>
      ))}
    </div>
  );
}

function markdownToHtml(md) {
  if (!md) return '';
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><h/g, '<h').replace(/<\/h([1-3])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>').replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><blockquote>/g, '<blockquote>').replace(/<\/blockquote><\/p>/g, '</blockquote>');
  return html;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/api/blog/posts/${slug}`).then(r => setPost(r.data)).catch(() => setPost(null)).finally(() => setLoading(false));
    api.get('/api/blog/posts').then(r => {
      const posts = Array.isArray(r.data) ? r.data : r.data.posts || [];
      setRelated(posts.filter(p => p.slug !== slug).slice(0, 3));
    }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(21,101,192,0.15)', borderTopColor: '#1565C0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', gap: '12px' }}>
        <div style={{ fontSize: '40px' }}>📭</div>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#0A1628' }}>Article not found</h2>
        <Link to="/blog" style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}>← Back to Blog</Link>
      </div>
    );
  }

  const contentHtml = markdownToHtml(post.content);

  return (
    <PageTransition>
      <style>{`
        .bp-content { color: #334155; font-size: 16px; line-height: 1.85; }
        .bp-content h2 { font-family:'Outfit',sans-serif; font-weight:800; font-size:1.5rem; color:#0A1628; margin:36px 0 14px; }
        .bp-content h3 { font-family:'Outfit',sans-serif; font-weight:700; font-size:1.2rem; color:#0A1628; margin:28px 0 10px; }
        .bp-content p { margin-bottom:18px; }
        .bp-content ul { margin: 0 0 18px; padding-left: 22px; }
        .bp-content li { margin-bottom: 8px; }
        .bp-content strong { color: #0A1628; font-weight: 700; }
        .bp-content blockquote { border-left: 3px solid #1565C0; background: #F0F6FF; padding: 16px 20px; margin: 24px 0; border-radius: 0 12px 12px 0; font-style: italic; color: #1E293B; }
        .bp-content a { color: #1565C0; text-decoration: underline; }
        @media(max-width: 640px) {
          .bp-content { font-size: 15px; }
          .bp-content h2 { font-size: 1.3rem; }
          .bp-content h3 { font-size: 1.1rem; }
        }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(21,101,192,0.08)', padding: '14px 0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A90B8', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#7A90B8', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link to="/blog" style={{ color: '#7A90B8', textDecoration: 'none' }}>Blog</Link>
            <span>›</span>
            <span style={{ color: '#3B5280' }}>{post.title}</span>
          </div>
        </div>
      </div>

      {/* ── Article Header ── */}
      <div style={{ background: '#fff', padding: '40px 0 0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>

          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(21,101,192,0.08)', color: '#1565C0', marginBottom: '16px' }}>
            {post.category}
          </span>

          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, color: '#0A1628', lineHeight: 1.2, marginBottom: '20px' }}>
            {post.title}
          </h1>

          {/* Author byline — BankCreds style */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A90B8', marginBottom: '8px' }}>
            <span>By <strong style={{ color: '#3B5280' }}>TrueCreds Editorial Team</strong></span>
            <span>·</span>
            <span>Reviewed by <strong style={{ color: '#3B5280' }}>TrueCreds Financial Experts</strong></span>
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
            {post.published_at && (
              <>Published {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · </>
            )}
            {post.read_time} read
          </div>
        </div>
      </div>

      {/* ── Cover Image ── */}
      {post.cover_image && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 32px' }}>
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
        </div>
      )}

      {/* ── Article Body ── */}
      <div style={{ background: '#fff', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>
          <div className="bp-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(21,101,192,0.1)' }}>
            <ShareButtons title={post.title} />
          </div>
        </div>
      </div>

      {/* ── Editorial trust note ── */}
      <div style={{ background: '#F0F6FF', padding: '28px 0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 24px', border: '1px solid rgba(21,101,192,0.1)' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A1628', marginBottom: '8px' }}>How this article was produced</div>
            <p style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.7, marginBottom: '10px' }}>
              Written and fact-checked by the TrueCreds Editorial Team. Loan and credit terms change often — figures are indicative and you should confirm current rates and charges with the lender before applying.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px' }}>
              <Link to="/editorial-policy" style={{ color: '#1565C0', textDecoration: 'none', fontWeight: 600 }}>Editorial Policy</Link>
              <Link to="/how-we-make-money" style={{ color: '#1565C0', textDecoration: 'none', fontWeight: 600 }}>How We Make Money</Link>
              <Link to="/corrections" style={{ color: '#1565C0', textDecoration: 'none', fontWeight: 600 }}>Corrections</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline Lead Form — BankCreds style ── */}
      <div style={{ background: '#fff', padding: '48px 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '22px', color: '#0A1628', marginBottom: '8px' }}>Compare Loan Offers</h2>
            <p style={{ fontSize: '14px', color: '#7A90B8' }}>Get matched with top lenders in 2 minutes</p>
          </div>
          <EligibilityForm />
        </div>
      </div>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '20px', color: '#0A1628', marginBottom: '24px' }}>Related Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '16px' }}>
              {related.map((r, i) => (
                <motion.div key={r.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid rgba(21,101,192,0.1)', height: '100%' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#1565C0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.category}</span>
                    <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', margin: '8px 0', lineHeight: 1.4 }}>{r.title}</h3>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>{r.read_time} read</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
