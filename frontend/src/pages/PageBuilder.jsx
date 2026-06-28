import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '../lib/api';

// ─── SECTION TEMPLATES ────────────────────────────────────────────────────────

const SECTION_TYPES = [
  { type: 'hero', icon: '🦸', label: 'Hero Banner', desc: 'Big heading + CTA buttons' },
  { type: 'text', icon: '📝', label: 'Text Block', desc: 'Heading + paragraphs + image' },
  { type: 'cards', icon: '🃏', label: 'Cards Grid', desc: 'Grid of icon cards' },
  { type: 'stats', icon: '📊', label: 'Stats Row', desc: 'Numbers/metrics display' },
  { type: 'faq', icon: '❓', label: 'FAQ Accordion', desc: 'Questions & answers' },
  { type: 'cta', icon: '🎯', label: 'Call to Action', desc: 'CTA banner or eligibility form' },
];

const DEFAULT_DATA = {
  hero: { badge: 'NEW', heading: 'Your **Page Title** Here', subheading: 'Write your subtitle here. Keep it clear and compelling.', cta_text: 'Get Started', cta_link: '/apply', cta2_text: 'Learn More', cta2_link: '/compare' },
  text: { label: '/ SECTION', heading: 'Section Heading', body: 'Write your content here.\n\nUse **bold text** by wrapping with double asterisks.\n\nAdd multiple paragraphs by leaving a blank line between them.', image_url: '' },
  cards: { label: '/ FEATURES', heading: 'Why Choose Us', cards: [{ icon: '⚡', title: 'Fast', desc: 'Get results in minutes', link: '', link_text: '' }, { icon: '🔒', title: 'Secure', desc: 'Bank-grade security', link: '', link_text: '' }, { icon: '💰', title: 'Free', desc: '100% free for borrowers', link: '', link_text: '' }] },
  stats: { heading: 'By the Numbers', stats: [{ value: '1.2L+', label: 'Borrowers' }, { value: '9.9%', label: 'Starting Rate' }, { value: '5 min', label: 'Avg Approval' }, { value: '12+', label: 'Lenders' }] },
  faq: { label: '/ FAQ', heading: 'Frequently Asked Questions', faqs: [{ q: 'Question one goes here?', a: 'Answer to question one goes here.' }, { q: 'Question two goes here?', a: 'Answer to question two goes here.' }] },
  cta: { heading: 'Ready to Get Started?', subheading: 'Check your eligibility in 2 minutes. Zero CIBIL impact.', cta_text: 'Check Eligibility', cta_link: '/apply', show_form: false },
};

// ─── SECTION EDITORS ─────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} className="input-cosmic text-sm" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return <textarea className="input-cosmic text-sm" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function HeroEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Badge text (optional)"><Input value={data.badge} onChange={v => set('badge', v)} placeholder="e.g. NEW · UPDATED" /></Field>
      <Field label="Main heading (use **text** for mint color)"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="Your **headline** here" /></Field>
      <Field label="Subheading"><Textarea value={data.subheading} onChange={v => set('subheading', v)} rows={2} placeholder="Supporting text" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary button text"><Input value={data.cta_text} onChange={v => set('cta_text', v)} placeholder="Get Started" /></Field>
        <Field label="Primary button link"><Input value={data.cta_link} onChange={v => set('cta_link', v)} placeholder="/apply" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Secondary button text"><Input value={data.cta2_text} onChange={v => set('cta2_text', v)} placeholder="Learn More" /></Field>
        <Field label="Secondary button link"><Input value={data.cta2_link} onChange={v => set('cta2_link', v)} placeholder="/compare" /></Field>
      </div>
    </div>
  );
}

function TextEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Section label (optional)"><Input value={data.label} onChange={v => set('label', v)} placeholder="/ ABOUT" /></Field>
      <Field label="Heading"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="Section heading" /></Field>
      <Field label="Body text (use **text** for bold, blank line = new paragraph)"><Textarea value={data.body} onChange={v => set('body', v)} rows={6} placeholder="Your content here..." /></Field>
      <Field label="Image URL (optional)"><Input value={data.image_url} onChange={v => set('image_url', v)} placeholder="https://example.com/image.jpg" /></Field>
    </div>
  );
}

function CardsEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setCard = (i, k, v) => {
    const cards = [...(data.cards || [])];
    cards[i] = { ...cards[i], [k]: v };
    set('cards', cards);
  };
  const addCard = () => set('cards', [...(data.cards || []), { icon: '⭐', title: 'New Card', desc: 'Description here', link: '', link_text: '' }]);
  const removeCard = (i) => set('cards', (data.cards || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <Field label="Section label"><Input value={data.label} onChange={v => set('label', v)} placeholder="/ FEATURES" /></Field>
      <Field label="Section heading"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="Section heading" /></Field>
      <div className="space-y-3">
        {(data.cards || []).map((card, i) => (
          <div key={i} className="p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 font-mono">Card {i + 1}</span>
              <button onClick={() => removeCard(i)} className="text-red-500 text-xs hover:text-red-400">Remove</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Icon (emoji)"><Input value={card.icon} onChange={v => setCard(i, 'icon', v)} placeholder="⭐" /></Field>
              <div className="col-span-2"><Field label="Title"><Input value={card.title} onChange={v => setCard(i, 'title', v)} placeholder="Card title" /></Field></div>
            </div>
            <Field label="Description"><Input value={card.desc} onChange={v => setCard(i, 'desc', v)} placeholder="Short description" /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Link (optional)"><Input value={card.link} onChange={v => setCard(i, 'link', v)} placeholder="/page" /></Field>
              <Field label="Link text"><Input value={card.link_text} onChange={v => setCard(i, 'link_text', v)} placeholder="Learn more →" /></Field>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addCard} className="btn-ghost text-xs px-4 py-2 w-full justify-center">+ Add Card</button>
    </div>
  );
}

function StatsEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setStat = (i, k, v) => {
    const stats = [...(data.stats || [])];
    stats[i] = { ...stats[i], [k]: v };
    set('stats', stats);
  };
  const addStat = () => set('stats', [...(data.stats || []), { value: '0', label: 'New Stat' }]);
  const removeStat = (i) => set('stats', (data.stats || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <Field label="Heading (optional)"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="By the Numbers" /></Field>
      <div className="grid grid-cols-2 gap-3">
        {(data.stats || []).map((stat, i) => (
          <div key={i} className="p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500 font-mono">Stat {i + 1}</span>
              <button onClick={() => removeStat(i)} className="text-red-500 text-xs">Remove</button>
            </div>
            <Field label="Value"><Input value={stat.value} onChange={v => setStat(i, 'value', v)} placeholder="1.2L+" /></Field>
            <Field label="Label"><Input value={stat.label} onChange={v => setStat(i, 'label', v)} placeholder="Borrowers" /></Field>
          </div>
        ))}
      </div>
      <button onClick={addStat} className="btn-ghost text-xs px-4 py-2 w-full justify-center">+ Add Stat</button>
    </div>
  );
}

function FaqEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setFaq = (i, k, v) => {
    const faqs = [...(data.faqs || [])];
    faqs[i] = { ...faqs[i], [k]: v };
    set('faqs', faqs);
  };
  const addFaq = () => set('faqs', [...(data.faqs || []), { q: '', a: '' }]);
  const removeFaq = (i) => set('faqs', (data.faqs || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <Field label="Label"><Input value={data.label} onChange={v => set('label', v)} placeholder="/ FAQ" /></Field>
      <Field label="Heading"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="Frequently Asked Questions" /></Field>
      <div className="space-y-3">
        {(data.faqs || []).map((faq, i) => (
          <div key={i} className="p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500 font-mono">FAQ {i + 1}</span>
              <button onClick={() => removeFaq(i)} className="text-red-500 text-xs">Remove</button>
            </div>
            <Field label="Question"><Input value={faq.q} onChange={v => setFaq(i, 'q', v)} placeholder="Question goes here?" /></Field>
            <Field label="Answer"><Textarea value={faq.a} onChange={v => setFaq(i, 'a', v)} rows={2} placeholder="Answer goes here." /></Field>
          </div>
        ))}
      </div>
      <button onClick={addFaq} className="btn-ghost text-xs px-4 py-2 w-full justify-center">+ Add FAQ</button>
    </div>
  );
}

function CtaEditor({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <Field label="Heading"><Input value={data.heading} onChange={v => set('heading', v)} placeholder="Ready to Get Started?" /></Field>
      <Field label="Subheading"><Input value={data.subheading} onChange={v => set('subheading', v)} placeholder="Supporting text" /></Field>
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
        <div className={`w-10 h-6 rounded-full cursor-pointer relative transition-colors ${data.show_form ? 'bg-[#00FF9D]' : 'bg-slate-700'}`} onClick={() => set('show_form', !data.show_form)}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.show_form ? 'left-5' : 'left-1'}`} />
        </div>
        <span className="text-sm text-slate-300">Show eligibility form instead of button</span>
      </div>
      {!data.show_form && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button text"><Input value={data.cta_text} onChange={v => set('cta_text', v)} placeholder="Check Eligibility" /></Field>
          <Field label="Button link"><Input value={data.cta_link} onChange={v => set('cta_link', v)} placeholder="/apply" /></Field>
        </div>
      )}
    </div>
  );
}

const SECTION_EDITORS = { hero: HeroEditor, text: TextEditor, cards: CardsEditor, stats: StatsEditor, faq: FaqEditor, cta: CtaEditor };

// ─── PAGE BUILDER MAIN ────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function PageBuilder({ onClose }) {
  const [pages, setPages] = useState([]);
  const [view, setView] = useState('list'); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', meta_description: '', status: 'published', sections: [] });
  const [showAddSection, setShowAddSection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const loadPages = () => api.get('/api/admin/pages').then(r => setPages(r.data)).catch(() => {});
  useEffect(() => { loadPages(); }, []);

  const startCreate = () => {
    setForm({ title: '', slug: '', meta_description: '', status: 'published', sections: [] });
    setEditing(null);
    setView('create');
  };

  const startEdit = (page) => {
    setForm({ title: page.title, slug: page.slug, meta_description: page.meta_description || '', status: page.status, sections: page.sections || [] });
    setEditing(page);
    setView('edit');
  };

  const addSection = (type) => {
    const newSection = { type, data: { ...DEFAULT_DATA[type] } };
    setForm(f => ({ ...f, sections: [...f.sections, newSection] }));
    setExpandedSection(form.sections.length);
    setShowAddSection(false);
  };

  const updateSection = (i, data) => {
    setForm(f => {
      const sections = [...f.sections];
      sections[i] = { ...sections[i], data };
      return { ...f, sections };
    });
  };

  const removeSection = (i) => {
    setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
    setExpandedSection(null);
  };

  const moveSection = (i, dir) => {
    setForm(f => {
      const sections = [...f.sections];
      const j = i + dir;
      if (j < 0 || j >= sections.length) return f;
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...f, sections };
    });
    setExpandedSection(i + dir);
  };

  const save = async () => {
    if (!form.title) return toast.error('Title is required');
    if (!form.slug) return toast.error('Slug is required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/admin/pages/${editing.id}`, form);
        toast.success('Page updated!');
      } else {
        await api.post('/api/admin/pages', form);
        toast.success('Page created!');
      }
      await loadPages();
      setView('list');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (page) => {
    await api.patch(`/api/admin/pages/${page.id}/status`);
    toast.success(page.status === 'published' ? 'Page unpublished' : 'Page published!');
    loadPages();
  };

  const deletePage = async (page) => {
    if (!window.confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    await api.delete(`/api/admin/pages/${page.id}`);
    toast.success('Page deleted');
    loadPages();
  };

  // ── LIST VIEW ──
  if (view === 'list') return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Pages <span className="text-slate-500 font-normal text-sm ml-2">({pages.length})</span></h2>
        <button onClick={startCreate} className="btn-mint text-sm px-4 py-2">+ Create Page</button>
      </div>

      {pages.length === 0 ? (
        <div className="card-cosmic text-center py-16">
          <div className="text-4xl mb-3">📄</div>
          <h3 className="font-semibold mb-2">No pages yet</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first page and it will appear at /p/your-slug</p>
          <button onClick={startCreate} className="btn-mint text-sm px-6 py-2">Create First Page</button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map(page => (
            <motion.div key={page.id} className="card-cosmic flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{page.title}</span>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${page.status === 'published' ? 'text-[#00FF9D] border-[rgba(0,255,157,0.3)] bg-[rgba(0,255,157,0.08)]' : 'text-slate-500 border-slate-700 bg-slate-800'}`}>
                    {page.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-mono">/p/{page.slug}</span>
                  <span>·</span>
                  <span>{(page.sections || []).length} sections</span>
                  {page.status === 'published' && (
                    <>
                      <span>·</span>
                      <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="text-[#00FF9D] hover:underline">View live →</a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleStatus(page)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${page.status === 'published' ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-[rgba(0,255,157,0.3)] text-[#00FF9D]'}`}>
                  {page.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => startEdit(page)} className="btn-ghost text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => deletePage(page)} className="text-red-500 hover:text-red-400 text-xs px-2">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // ── CREATE / EDIT VIEW ──
  return (
    <div>
      {/* TOP BAR */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('list')} className="text-slate-400 hover:text-white text-sm">← Pages</button>
        <span className="text-slate-700">/</span>
        <span className="text-sm font-medium">{editing ? 'Edit Page' : 'New Page'}</span>
        <div className="ml-auto flex items-center gap-2">
          {form.slug && (
            <a href={`/p/${form.slug}`} target="_blank" rel="noreferrer" className="text-xs text-[#00FF9D] hover:underline">Preview →</a>
          )}
          <select className="input-cosmic text-xs py-1.5 w-32" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={save} disabled={saving} className="btn-mint text-sm px-5 py-2">
            {saving ? 'Saving...' : editing ? 'Update Page' : 'Publish Page'}
          </button>
        </div>
      </div>

      {/* PAGE META */}
      <div className="card-cosmic mb-5 space-y-3">
        <h3 className="font-semibold text-sm text-slate-300 mb-4">Page Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Page Title *</label>
            <input className="input-cosmic text-sm" placeholder="e.g. About Us" value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: f.title === slugify(f.title) || !f.slug ? { ...f, title: e.target.value, slug: slugify(e.target.value) }.title : e.target.value })); setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) })); }} />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">URL Slug * <span className="text-slate-600 normal-case">(yoursite.com/p/slug)</span></label>
            <input className="input-cosmic text-sm font-mono" placeholder="about-us" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Meta Description (SEO)</label>
          <input className="input-cosmic text-sm" placeholder="Brief description for search engines (150-160 chars)" value={form.meta_description}
            onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} />
          {form.meta_description && <div className="text-[10px] text-slate-600 mt-1">{form.meta_description.length}/160 chars</div>}
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-3 mb-5">
        {form.sections.length === 0 && (
          <div className="card-cosmic text-center py-10 border-dashed">
            <div className="text-3xl mb-2">➕</div>
            <p className="text-slate-500 text-sm">No sections yet — add your first section below</p>
          </div>
        )}
        {form.sections.map((section, i) => {
          const typeInfo = SECTION_TYPES.find(t => t.type === section.type);
          const Editor = SECTION_EDITORS[section.type];
          const isExpanded = expandedSection === i;
          return (
            <motion.div key={i} className="card-cosmic overflow-hidden" layout>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedSection(isExpanded ? null : i)}>
                <span className="text-xl">{typeInfo?.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-sm">{typeInfo?.label}</span>
                  <span className="text-slate-600 text-xs ml-2">#{i + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={e => { e.stopPropagation(); moveSection(i, -1); }} disabled={i === 0} className="text-slate-600 hover:text-white disabled:opacity-30 px-1 text-sm">↑</button>
                  <button onClick={e => { e.stopPropagation(); moveSection(i, 1); }} disabled={i === form.sections.length - 1} className="text-slate-600 hover:text-white disabled:opacity-30 px-1 text-sm">↓</button>
                  <button onClick={e => { e.stopPropagation(); removeSection(i); }} className="text-red-500 hover:text-red-400 px-2 text-xs">Remove</button>
                  <span className={`text-[#00FF9D] text-xs ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && Editor && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.07)]">
                      <Editor data={section.data || {}} onChange={data => updateSection(i, data)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ADD SECTION */}
      <AnimatePresence>
        {showAddSection ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="card-cosmic">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm">Choose a section type</span>
              <button onClick={() => setShowAddSection(false)} className="text-slate-500 hover:text-white text-xs">✕ Cancel</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SECTION_TYPES.map(type => (
                <button key={type.type} onClick={() => addSection(type.type)}
                  className="p-3 rounded-xl border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,255,157,0.3)] hover:bg-[rgba(0,255,157,0.04)] transition-all text-left group">
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="font-semibold text-xs text-white">{type.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setShowAddSection(true)} className="btn-ghost w-full justify-center text-sm py-3">
            + Add Section
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
