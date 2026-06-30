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
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^\d+\.\s(.*$)/gim, '<li class="ol-item">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li class="ol-item">.*<\/li>\n?)+/g, m => `<ol>${m.replace(/ class="ol-item"/g, '')}</ol>`);
  html = html.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><h/g, '<h').replace(/<\/h([1-3])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>').replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><ol>/g, '<ol>').replace(/<\/ol><\/p>/g, '</ol>');
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
        .bp-content ul, .bp-content ol { margin: 0 0 18px; padding-left: 22px; }
        .bp-content li { margin-bottom: 8px; }
        .bp-content strong { color: #0A1628; font-weight: 700; }
        .bp-content blockquote { border-left: 3px solid #1565C0; background: #F0F6FF; padding: 16px 20px; margin: 24px 0; border-radius: 0 12px 12px 0; font-style: italic; color: #1E293B; }
        .bp-content a { color: #1565C0; text-decoration: underline; }
        .bp-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
        .bp-sidebar { position: sticky; top: 88px; }
        @media(max-width: 960px) {
          .bp-layout { grid-template-columns: 1fr; }
          .bp-sidebar { position: static; }
        }
        @media(max-width: 640px) {
          .bp-content { font-size: 15px; }
          .bp-content h2 { font-size: 1.3rem; }
          .bp-content h3 { font-size: 1.1rem; }
        }
      `}</style>

      {/* ── Dark Blue Header — Breadcrumb + Title + Byline ── */}
      <div style={{ background: 'linear-gradient(135deg,#0A1628,#1E3A5F)', padding: '24px 0 36px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link to="/blog" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</Link>
            <span>›</span>
            <span style={{ color: '#fff', fontWeight: 500 }}>{post.title}</span>
          </div>

          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: '16px' }}>
            {post.category}
          </span>

          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '20px', maxWidth: '900px' }}>
            {post.title}
          </h1>

          {/* Byline with icons — BankCreds style */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              👤 By <strong style={{ color: 'rgba(255,255,255,0.95)' }}>TrueCreds Editorial Team</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✅ Reviewed by <strong style={{ color: 'rgba(255,255,255,0.95)' }}>TrueCreds Financial Experts</strong>
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
            {post.published_at && (
              <>Published {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · </>
            )}
            {post.read_time} read
          </div>
        </div>
      </div>

      {/* ── Main 2-column layout: Article + Sticky Form ── */}
      <div style={{ background: '#F8FAFF', padding: '32px 0 0' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
          <div className="bp-layout">

            {/* LEFT — Article */}
            <div>
              {/* Cover image */}
              {post.cover_image && (
                <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={post.cover_image} alt={post.title} style={{ width: '100%', display: 'block' }} />
                </div>
              )}

              {/* Article body card */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: 'clamp(20px,4vw,40px)', border: '1px solid rgba(21,101,192,0.1)', marginBottom: '20px' }}>
                <div className="bp-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(21,101,192,0.1)' }}>
                  <ShareButtons title={post.title} />
                </div>
              </div>

              {/* Editorial trust note */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(21,101,192,0.1)', marginBottom: '32px', display: 'flex', gap: '14px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A1628', marginBottom: '8px' }}>How this article was produced</div>
                  <p style={{ fontSize: '13px', color: '#3B5280', lineHeight: 1.7, marginBottom: '10px' }}>
                    Written and fact-checked by the <strong>TrueCreds Editorial Team</strong>. Loan and credit terms change often — figures are indicative and you should confirm current rates and charges with the lender before applying.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px' }}>
                    <Link to="/editorial-policy" style={{ color: '#1565C0', textDecoration: 'underline' }}>editorial policy</Link>
                    <span style={{ color: '#94A3B8' }}>,</span>
                    <Link to="/how-we-make-money" style={{ color: '#1565C0', textDecoration: 'underline' }}>how we make money</Link>
                    <span style={{ color: '#94A3B8' }}>, and</span>
                    <Link to="/corrections" style={{ color: '#1565C0', textDecoration: 'underline' }}>corrections policy</Link>
                  </div>
                </div>
              </div>

              {/* Yellow disclaimer */}
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '16px', padding: '20px 24px', marginBottom: '40px', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.7, margin: 0 }}>
                  <strong>Disclaimer:</strong> TrueCreds.in is a loan comparison platform and does not directly lend, disburse, or provide any financial products. We aggregate and display loan offers from RBI-registered banks and NBFCs to help you make an informed decision. All loan applications are processed directly by the respective lender. Interest rates, charges, eligibility, and terms shown are indicative and subject to the lender's final assessment. Please read the lender's terms and conditions carefully before applying.
                </p>
              </div>
            </div>

            {/* RIGHT — Sticky lead form */}
            <div className="bp-sidebar">
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid rgba(21,101,192,0.1)', boxShadow: '0 4px 24px rgba(21,101,192,0.08)' }}>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '20px', color: '#0A1628', marginBottom: '6px' }}>Compare Loan Offers</h2>
                <p style={{ fontSize: '13px', color: '#7A90B8', marginBottom: '20px' }}>Get matched with top lenders in 2 minutes</p>
                <EligibilityForm compact />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Related Articles — full width below ── */}
      {related.length > 0 && (
        <div style={{ background: '#F0F6FF', padding: '48px 0 64px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '22px', color: '#0A1628', marginBottom: '24px' }}>📚 You Might Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
              {related.map((r, i) => (
                <motion.div key={r.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(21,101,192,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '120px', background: 'linear-gradient(135deg,#1565C0,#0288D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {r.cover_image ? (
                          <img src={r.cover_image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '32px', opacity: 0.5 }}>📰</span>
                        )}
                        <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.08em', backdropFilter: 'blur(4px)' }}>{r.category}</span>
                      </div>
                      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '15px', color: '#0A1628', marginBottom: '8px', lineHeight: 1.4, flex: 1 }}>{r.title}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '10px', borderTop: '1px solid rgba(21,101,192,0.08)' }}>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>{r.read_time} read</span>
                          <span style={{ fontSize: '12px', color: '#1565C0', fontWeight: 600 }}>Read →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <Link to="/blog">
                <button style={{ padding: '12px 28px', borderRadius: '10px', border: '1.5px solid #1565C0', background: 'transparent', color: '#1565C0', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  View All Articles →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
