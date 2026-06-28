import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import PageTransition from '../components/PageTransition';
import EligibilityForm from '../components/EligibilityForm';

function HeroSection({ data }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #00FF9D, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {data.badge && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="badge-mint">{data.badge}</span>
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-black tracking-tight mb-6 leading-tight"
          style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)' }}
          dangerouslySetInnerHTML={{ __html: data.heading?.replace(/\*\*(.*?)\*\*/g, '<span style="color:#00FF9D">$1</span>') || '' }}
        />
        {data.subheading && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {data.subheading}
          </motion.p>
        )}
        {(data.cta_text || data.cta2_text) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center">
            {data.cta_text && (
              <Link to={data.cta_link || '/apply'} className="btn-mint px-8 py-3">{data.cta_text}</Link>
            )}
            {data.cta2_text && (
              <Link to={data.cta2_link || '/compare'} className="btn-ghost px-8 py-3">{data.cta2_text}</Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TextSection({ data }) {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.label && <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.25em] mb-2">{data.label}</div>}
        {data.heading && <h2 className="font-bold text-3xl mb-6" style={{ fontFamily: 'Outfit,sans-serif' }}>{data.heading}</h2>}
        {data.body && (
          <div className="prose prose-invert max-w-none">
            {data.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed mb-4 text-base"
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            ))}
          </div>
        )}
        {data.image_url && (
          <img src={data.image_url} alt={data.heading || ''} className="w-full rounded-2xl mt-8 border border-[rgba(255,255,255,0.07)]" />
        )}
      </div>
    </section>
  );
}

function CardsSection({ data }) {
  const cards = data.cards || [];
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.label && <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.25em] mb-2">{data.label}</div>}
        {data.heading && <h2 className="font-bold text-3xl mb-10" style={{ fontFamily: 'Outfit,sans-serif' }}>{data.heading}</h2>}
        <div className={`grid gap-5 ${cards.length <= 2 ? 'md:grid-cols-2' : cards.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
          {cards.map((card, i) => (
            <motion.div key={i} className="card-cosmic"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              {card.icon && <div className="text-3xl mb-3">{card.icon}</div>}
              {card.title && <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>{card.title}</h3>}
              {card.desc && <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>}
              {card.link && <Link to={card.link} className="text-[#00FF9D] text-xs mt-3 block hover:underline">{card.link_text || 'Learn more →'}</Link>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }) {
  const stats = data.stats || [];
  return (
    <section className="py-16 border-y border-[rgba(255,255,255,0.06)]" style={{ background: 'rgba(0,255,157,0.02)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.heading && <h2 className="font-bold text-2xl mb-10 text-center" style={{ fontFamily: 'Outfit,sans-serif' }}>{data.heading}</h2>}
        <div className={`grid gap-4 ${stats.length <= 2 ? 'md:grid-cols-2' : stats.length === 3 ? 'md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          {stats.map((stat, i) => (
            <motion.div key={i} className="text-center p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <div className="font-mono-nums text-[#00FF9D] font-bold text-3xl mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }) {
  const [open, setOpen] = useState(null);
  const faqs = data.faqs || [];
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.label && <div className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-[0.25em] mb-2 text-center">{data.label}</div>}
        {data.heading && <h2 className="font-bold text-3xl mb-10 text-center" style={{ fontFamily: 'Outfit,sans-serif' }}>{data.heading}</h2>}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} className="card-cosmic cursor-pointer" onClick={() => setOpen(open === i ? null : i)}
              whileHover={{ borderColor: 'rgba(0,255,157,0.2)' }}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-sm">{f.q}</span>
                <motion.span className="text-[#00FF9D] text-xs flex-shrink-0" animate={{ rotate: open === i ? 180 : 0 }}>▼</motion.span>
              </div>
              <motion.div initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{f.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data }) {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,157,0.06), transparent 70%)' }} />
        {data.heading && (
          <h2 className="font-black mb-4 relative" style={{ fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
            {data.heading}
          </h2>
        )}
        {data.subheading && <p className="text-slate-400 mb-8 text-lg relative">{data.subheading}</p>}
        {data.show_form ? (
          <div className="max-w-md mx-auto relative"><EligibilityForm compact /></div>
        ) : data.cta_text ? (
          <Link to={data.cta_link || '/apply'} className="btn-mint px-10 py-4 text-base relative inline-flex">{data.cta_text}</Link>
        ) : null}
      </div>
    </section>
  );
}

const SECTION_RENDERERS = {
  hero: HeroSection,
  text: TextSection,
  cards: CardsSection,
  stats: StatsSection,
  faq: FaqSection,
  cta: CtaSection,
};

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/api/pages/${slug}`)
      .then(r => setPage(r.data))
      .catch(() => setError(true));
  }, [slug]);

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="font-black text-3xl mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>Page Not Found</h1>
      <p className="text-slate-400 mb-6">This page doesn't exist or has been unpublished.</p>
      <Link to="/" className="btn-mint">Go Home →</Link>
    </div>
  );

  if (!page) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  );

  return (
    <PageTransition>
      {(page.sections || []).map((section, i) => {
        const Renderer = SECTION_RENDERERS[section.type];
        return Renderer ? <Renderer key={i} data={section.data || {}} /> : null;
      })}
    </PageTransition>
  );
}
