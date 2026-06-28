import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import PageTransition from '../components/PageTransition';

const CATEGORIES = ['All', 'Guides', 'Tips', 'Students', 'Guide', 'News'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [source, setSource] = useState('local');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/blog/posts')
      .then(r => {
        const data = r.data;
        if (Array.isArray(data)) { setPosts(data); }
        else { setPosts(data.posts || []); setSource(data.source || 'local'); }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PageTransition>
      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #F0F6FF 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-[10px] font-mono text-[#1565C0] uppercase tracking-[0.25em] mb-3">/ BLOG</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-black text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>
                Loan Guides<br /><span style={{ color: '#1565C0' }}>& Tips</span>
              </h1>
              <p className="text-[#3B5280] text-base max-w-lg">Expert advice on personal loans, CIBIL scores, EMI planning and everything Indian borrowers need to know.</p>
            </div>
            {source === 'wordpress' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(21,101,192,0.3)] bg-[rgba(21,101,192,0.05)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-pulse" />
                <span className="text-[11px] font-mono text-[#1565C0] uppercase tracking-wider">Live from WordPress</span>
              </div>
            )}
          </div>

          {/* SEARCH + FILTER */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A90B8] text-sm">🔍</span>
              <input
                className="input-cosmic pl-9 text-sm"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeCategory === cat ? 'bg-[#1565C0] text-[#F0F6FF] border-[#1565C0] font-bold' : 'border-[rgba(255,255,255,0.1)] text-[#3B5280] hover:border-[rgba(21,101,192,0.3)] hover:text-[#0A1628]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card-cosmic animate-pulse">
                <div className="h-44 rounded-xl bg-[#EFF6FF] mb-4" />
                <div className="h-3 bg-[#EFF6FF] rounded mb-2 w-1/3" />
                <div className="h-5 bg-[#EFF6FF] rounded mb-2" />
                <div className="h-3 bg-[#EFF6FF] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-xl mb-2">No articles found</h3>
            <p className="text-[#7A90B8]">Try a different category or search term</p>
          </div>
        ) : (
          <>
            {/* FEATURED POST */}
            {featured && !search && activeCategory === 'All' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <Link to={`/blog/${featured.slug}`} className="group block no-underline" style={{ textDecoration: 'none' }}>
                  <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[rgba(21,101,192,0.12)] hover:border-[rgba(21,101,192,0.25)] transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                    {/* IMAGE */}
                    <div className="relative h-64 lg:h-auto overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff, #0E2138)' }}>
                      {featured.cover_image ? (
                        <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl opacity-20">📰</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="badge-mint">FEATURED</span>
                      </div>
                    </div>
                    {/* CONTENT */}
                    <div className="p-8 lg:p-10 flex flex-col justify-center" style={{ background: '#ffffff' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="badge-mint">{featured.category}</span>
                        <span className="text-[10px] text-[#7A90B8] font-mono">{featured.read_time} read</span>
                        {featured.published_at && (
                          <span className="text-[10px] text-slate-600">{new Date(featured.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                      </div>
                      <h2 className="font-black text-2xl lg:text-3xl mb-4 leading-tight group-hover:text-[#1565C0] transition-colors" style={{ fontFamily: 'Outfit,sans-serif' }}>
                        {featured.title}
                      </h2>
                      <p className="text-[#3B5280] text-sm leading-relaxed mb-6 line-clamp-3">
                        {featured.excerpt?.replace(/<[^>]+>/g, '')}
                      </p>
                      <span className="text-[#1565C0] text-sm font-semibold flex items-center gap-1">
                        Read Full Article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* POSTS GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || activeCategory !== 'All' ? filtered : rest).map((post, i) => (
                <motion.div key={post.slug || i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link to={`/blog/${post.slug}`} className="card-cosmic block no-underline group h-full flex flex-col" style={{ textDecoration: 'none', padding: 0, overflow: 'hidden' }}>
                    {/* CARD IMAGE */}
                    <div className="relative h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff, #0E2138)' }}>
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-10">📄</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-transparent to-transparent opacity-60" />
                      <div className="absolute top-3 left-3">
                        <span className="badge-mint text-[9px]">{post.category}</span>
                      </div>
                    </div>

                    {/* CARD BODY */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3 text-[10px] text-[#7A90B8] font-mono">
                        <span>{post.read_time} read</span>
                        {post.published_at && (
                          <>
                            <span>·</span>
                            <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </>
                        )}
                      </div>
                      <h2 className="font-bold text-base leading-snug mb-3 group-hover:text-[#1565C0] transition-colors flex-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                        {post.title}
                      </h2>
                      <p className="text-xs text-[#7A90B8] leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt?.replace(/<[^>]+>/g, '')}
                      </p>
                      <div className="flex items-center gap-1 text-[#1565C0] text-xs font-semibold mt-auto">
                        Read more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* BOTTOM CTA */}
        {!loading && filtered.length > 0 && (
          <div className="mt-16 rounded-2xl p-8 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff, #0B1F3A)', border: '1px solid rgba(21,101,192,0.15)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(21,101,192,0.06), transparent 70%)' }} />
            <h3 className="font-bold text-2xl mb-2 relative" style={{ fontFamily: 'Outfit,sans-serif' }}>Ready to apply for a loan?</h3>
            <p className="text-[#3B5280] text-sm mb-6 relative">Compare India's best loan apps and check your eligibility in 2 minutes.</p>
            <Link to="/apply" className="btn-mint relative inline-flex">Check Eligibility — Free →</Link>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
