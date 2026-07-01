import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { api, fmtLakh } from "../lib/api";
import { convertPlainTextToMarkdown } from "../lib/smartPaste";
import PageBuilder from "./PageBuilder";

const STATUS_COLORS = {
  new: "#00FF9D",
  contacted: "#60A5FA",
  converted: "#34D399",
  rejected: "#F87171",
};

function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (statusFilter && statusFilter !== "all")
      params.append("status_filter", statusFilter);
    api.get(`/api/leads?${params}`).then((r) => setLeads(r.data));
  }, [q, statusFilter]);
  useEffect(() => {
    load();
  }, [load]);

  const del = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await api.delete(`/api/leads/${id}`);
    setLeads((l) => l.filter((x) => x.id !== id));
    toast.success("Lead deleted");
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/api/leads/${id}`, { status });
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  return (
    <div data-testid="leads-panel">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          className="input-cosmic flex-1 min-w-48"
          placeholder="Search name, mobile, city..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          data-testid="leads-search-input"
        />
        <select
          className="input-cosmic w-36"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="btn-ghost px-4 py-2.5 text-sm" onClick={load}>
          ↺ Refresh
        </button>
      </div>
      <div className="mb-4 flex gap-4 text-xs text-slate-500">
        <span>{leads.length} leads found</span>
        <span>·</span>
        <span className="text-[#00FF9D]">
          {leads.filter((l) => l.status === "new").length} new
        </span>
        <span className="text-[#60A5FA]">
          {leads.filter((l) => l.status === "contacted").length} contacted
        </span>
        <span className="text-[#34D399]">
          {leads.filter((l) => l.status === "converted").length} converted
        </span>
      </div>
      {leads.length === 0 ? (
        <div className="text-center text-slate-600 py-16 card-cosmic">
          No leads found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                {[
                  "Name",
                  "Mobile",
                  "City",
                  "Loan Amt",
                  "Employment",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 text-[10px] text-slate-600 uppercase tracking-wider font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  data-testid={`lead-row-${l.id}`}
                >
                  <td className="py-3 px-3 font-semibold text-sm">
                    {l.full_name}
                  </td>
                  <td className="py-3 px-3 font-mono-nums text-xs text-slate-400">
                    {l.mobile}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {l.city || "—"}
                  </td>
                  <td className="py-3 px-3 font-mono-nums text-xs text-[#00FF9D] font-bold">
                    {fmtLakh(l.loan_amount)}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {l.employment_type || "—"}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className="text-[9px] font-mono uppercase tracking-wider rounded-full px-2 py-1 border border-current cursor-pointer bg-transparent"
                      style={{ color: STATUS_COLORS[l.status] || "#94A3B8" }}
                    >
                      {["new", "contacted", "converted", "rejected"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td className="py-3 px-3 text-[10px] text-slate-600 whitespace-nowrap">
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      className="text-red-500 hover:text-red-400 text-xs transition-colors"
                      onClick={() => del(l.id)}
                      data-testid={`lead-delete-${l.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BlogTab() {
  const EMPTY = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Personal Loan",
    cover_image: "",
    read_time: "5 min",
    status: "publish",
  };
  const CATEGORIES = [
    "Personal Loan",
    "Business Loan",
    "Student Loan",
    "Instant Loan",
    "Credit Score",
    "Finance Tips",
    "General",
  ];
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' | 'new' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/api/admin/blog/posts");
      setPosts(r.data);
    } catch {
      toast.error("Failed to load posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const autoSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const save = async () => {
    if (!form.title || !form.content)
      return toast.error("Title and content are required");
    setSaving(true);
    try {
      if (view === "new") {
        await api.post("/api/admin/blog/posts", form);
        toast.success("Post created!");
      } else {
        await api.put(`/api/admin/blog/posts/${editId}`, form);
        toast.success("Post updated!");
      }
      setView("list");
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Save failed");
    }
    setSaving(false);
  };

  const del = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/api/admin/blog/posts/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const startEdit = (post) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "General",
      cover_image: post.cover_image || "",
      read_time: post.read_time || "5 min",
      status: post.status || "publish",
    });
    setEditId(post.id);
    setView("edit");
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleContentPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const markdown = convertPlainTextToMarkdown(pastedText);

    const ta = e.target;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const newContent = before + markdown + after;

    set("content", newContent);

    requestAnimationFrame(() => {
      const newCursorPos = start + markdown.length;
      ta.selectionStart = ta.selectionEnd = newCursorPos;
      ta.focus();
    });
  };

  if (view === "list")
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-200">
            Blog Posts ({posts.length})
          </h3>
          <button
            className="btn-mint text-xs px-4 py-2"
            onClick={() => {
              setForm(EMPTY);
              setView("new");
            }}
          >
            + New Post
          </button>
        </div>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">No blog posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,255,157,0.2)] transition-all"
                style={{ background: "#0A1728" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-200 truncate">
                      {p.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${p.status === "publish" ? "bg-[rgba(0,255,157,0.1)] text-[#00FF9D]" : "bg-[rgba(255,255,255,0.06)] text-slate-500"}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                    <span>/{p.slug}</span>
                    <span>·</span>
                    <span>{p.category}</span>
                    <span>·</span>
                    <span>{p.read_time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-[#00FF9D] transition-colors no-underline px-2 py-1"
                  >
                    View →
                  </a>
                  <button
                    className="btn-ghost text-xs px-3 py-1.5"
                    onClick={() => startEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-900 text-red-500 hover:bg-red-900/20 transition-all"
                    onClick={() => del(p.id, p.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          className="text-slate-500 hover:text-white text-sm transition-colors"
          onClick={() => {
            setView("list");
            setForm(EMPTY);
            setEditId(null);
          }}
        >
          ← Back
        </button>
        <h3 className="font-semibold text-slate-200">
          {view === "new" ? "New Blog Post" : "Edit Post"}
        </h3>
      </div>

      <div className="space-y-5 max-w-3xl">
        {/* Title */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            Title *
          </label>
          <input
            className="input-cosmic"
            placeholder="e.g. Best Personal Loans in India 2026"
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (view === "new") set("slug", autoSlug(e.target.value));
            }}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            Slug (URL)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-xs font-mono">/blog/</span>
            <input
              className="input-cosmic flex-1"
              placeholder="best-personal-loans-india-2026"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            Excerpt (short description)
          </label>
          <input
            className="input-cosmic"
            placeholder="A short summary shown on blog listing page..."
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>

        {/* Category + Read Time + Status */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
              Category
            </label>
            <select
              className="input-cosmic"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
              Read Time
            </label>
            <input
              className="input-cosmic"
              placeholder="5 min"
              value={form.read_time}
              onChange={(e) => set("read_time", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
              Status
            </label>
            <select
              className="input-cosmic"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Cover Image — Thumbnail */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            Cover Image (Thumbnail)
          </label>
          <div className="flex gap-2 items-center">
            <input
              className="input-cosmic flex-1"
              placeholder="Paste URL or upload from device →"
              value={form.cover_image}
              onChange={(e) => set("cover_image", e.target.value)}
            />
            <label
              className="flex-shrink-0 cursor-pointer px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(0,255,157,0.1)",
                color: "#00FF9D",
                border: "1px solid rgba(0,255,157,0.3)",
              }}
            >
              📁 Upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 3 * 1024 * 1024) {
                    toast.error("Image must be under 3MB");
                    return;
                  }
                  const toastId = toast.loading("Uploading thumbnail...");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const token = localStorage.getItem("truecreds_token");
                    const res = await fetch(
                      `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload-image`,
                      {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      },
                    );
                    const data = await res.json();
                    if (!res.ok)
                      throw new Error(data.detail || "Upload failed");
                    set("cover_image", data.url);
                    toast.success("Thumbnail uploaded!", { id: toastId });
                  } catch (err) {
                    toast.error(err.message || "Upload failed", {
                      id: toastId,
                    });
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {form.cover_image && (
            <div className="mt-2 relative inline-block">
              <img
                src={form.cover_image}
                alt="Thumbnail preview"
                className="h-20 w-40 object-cover rounded-lg"
                style={{ border: "1px solid rgba(0,255,157,0.2)" }}
              />
              <button
                type="button"
                onClick={() => set("cover_image", "")}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Content Editor with Toolbar */}
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
            Content *{" "}
            <span className="text-slate-700 normal-case">
              (use ## for headings, ### for subheadings)
            </span>
          </label>

          {/* TOOLBAR */}
          <div
            className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border border-b-0 border-[rgba(255,255,255,0.1)]"
            style={{ background: "#0D1B2E" }}
          >
            {[
              { label: "H2", title: "Heading 2", insert: "\n## " },
              { label: "H3", title: "Heading 3", insert: "\n### " },
              { label: "B", title: "Bold", wrap: ["**", "**"] },
              { label: "I", title: "Italic", wrap: ["*", "*"] },
              { label: "— HR", title: "Divider", insert: "\n\n---\n\n" },
              {
                label: "• List",
                title: "Bullet list",
                insert: "\n- Item one\n- Item two\n- Item three\n",
              },
              {
                label: "> Quote",
                title: "Blockquote",
                insert: "\n> Your quote here\n",
              },
              { label: "` Code", title: "Inline code", wrap: ["`", "`"] },
            ].map((tool) => (
              <button
                key={tool.label}
                title={tool.title}
                type="button"
                className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all"
                onClick={() => {
                  const ta = document.getElementById("blog-content-editor");
                  const start = ta.selectionStart,
                    end = ta.selectionEnd;
                  const selected = form.content.substring(start, end);
                  let newText;
                  if (tool.wrap) {
                    newText =
                      form.content.substring(0, start) +
                      tool.wrap[0] +
                      (selected || "text") +
                      tool.wrap[1] +
                      form.content.substring(end);
                  } else {
                    newText =
                      form.content.substring(0, start) +
                      tool.insert +
                      form.content.substring(end);
                  }
                  set("content", newText);
                  setTimeout(() => {
                    ta.focus();
                  }, 10);
                }}
              >
                {tool.label}
              </button>
            ))}

            <div
              className="w-px h-5 mx-1"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />

            {/* IMAGE UPLOAD FROM DEVICE — inline in content */}
            <label
              title="Upload image from device"
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-[#00FF9D] hover:bg-[rgba(0,255,157,0.08)] transition-all cursor-pointer"
            >
              🖼 Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 3 * 1024 * 1024) {
                    toast.error("Image must be under 3MB");
                    return;
                  }
                  const toastId = toast.loading("Uploading image...");
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const token = localStorage.getItem("truecreds_token");
                    const res = await fetch(
                      `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload-image`,
                      {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      },
                    );
                    const data = await res.json();
                    if (!res.ok)
                      throw new Error(data.detail || "Upload failed");
                    const ta = document.getElementById("blog-content-editor");
                    const pos = ta ? ta.selectionStart : form.content.length;
                    const insert = `\n![${file.name.replace(/\.[^.]+$/, "")}](${data.url})\n`;
                    set(
                      "content",
                      form.content.substring(0, pos) +
                        insert +
                        form.content.substring(pos),
                    );
                    toast.success("Image inserted!", { id: toastId });
                  } catch (err) {
                    toast.error(err.message || "Upload failed", {
                      id: toastId,
                    });
                  }
                  e.target.value = "";
                }}
              />
            </label>

            {/* LINK INSERT */}
            <button
              type="button"
              title="Insert Link"
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-[#00FF9D] hover:bg-[rgba(0,255,157,0.08)] transition-all"
              onClick={() => {
                const ta = document.getElementById("blog-content-editor");
                const start = ta.selectionStart,
                  end = ta.selectionEnd;
                const selected = form.content.substring(start, end);
                const text = window.prompt(
                  "Link text:",
                  selected || "Click here",
                );
                if (!text) return;
                const url = window.prompt("URL:", "https://");
                if (!url) return;
                const insert = `[${text}](${url})`;
                set(
                  "content",
                  form.content.substring(0, start) +
                    insert +
                    form.content.substring(end),
                );
              }}
            >
              🔗 Link
            </button>

            {/* TABLE INSERT */}
            <button
              type="button"
              title="Insert Table"
              className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-[#00FF9D] hover:bg-[rgba(0,255,157,0.08)] transition-all"
              onClick={() => {
                const ta = document.getElementById("blog-content-editor");
                const pos = ta.selectionStart;
                const insert =
                  "\n| Header 1 | Header 2 | Header 3 |\n|---|---|---|\n| Row 1 | Data | Data |\n| Row 2 | Data | Data |\n";
                set(
                  "content",
                  form.content.substring(0, pos) +
                    insert +
                    form.content.substring(pos),
                );
              }}
            >
              📊 Table
            </button>
          </div>

          <textarea
            id="blog-content-editor"
            className="input-cosmic font-mono text-xs leading-relaxed rounded-t-none"
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            rows={22}
            placeholder={`## Introduction\nWrite your intro here.\n\n## Section One\nYour content here.\n\n### Subsection\nMore details here.\n\n![Image description](https://example.com/image.jpg)\n\n[Read more](https://truecreds.in/compare)\n\n## Conclusion\nWrap up here.`}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            onPaste={handleContentPaste}
          />
          <p className="text-[10px] text-slate-600 mt-1.5">
            💡{" "}
            <code className="bg-[rgba(255,255,255,0.06)] px-1 rounded">
              ## Heading
            </code>{" "}
            ·{" "}
            <code className="bg-[rgba(255,255,255,0.06)] px-1 rounded">
              **bold**
            </code>{" "}
            ·{" "}
            <code className="bg-[rgba(255,255,255,0.06)] px-1 rounded">
              ![alt](url)
            </code>{" "}
            for images ·{" "}
            <code className="bg-[rgba(255,255,255,0.06)] px-1 rounded">
              [text](url)
            </code>{" "}
            for links
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            className="btn-mint px-6 py-2.5 text-sm"
            onClick={save}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : view === "new"
                ? "Publish Post →"
                : "Save Changes →"}
          </button>
          <button
            className="btn-ghost px-4 py-2.5 text-sm"
            onClick={() => {
              setView("list");
              setForm(EMPTY);
              setEditId(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function WpTab() {
  const [cfg, setCfg] = useState({
    base_url: "",
    active: false,
    wp_username: "",
    wp_app_password: "",
  });
  const [logs, setLogs] = useState([]);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "publish",
  });

  useEffect(() => {
    api.get("/api/wp/config").then((r) => setCfg(r.data));
  }, []);

  const test = async () => {
    if (!cfg.base_url) return toast.error("Enter a WordPress URL first");
    setTesting(true);
    setLogs([]);
    try {
      const r = await api.post("/api/wp/test", { base_url: cfg.base_url });
      setLogs(r.data.logs || []);
      toast[r.data.ok ? "success" : "error"](
        r.data.ok
          ? `Connected! ${r.data.post_count} posts found`
          : "Connection failed — check logs",
      );
    } catch {
      toast.error("Test request failed");
    } finally {
      setTesting(false);
    }
  };

  const save = async () => {
    await api.post("/api/wp/config", cfg);
    toast.success("WordPress config saved!");
  };

  const sync = async () => {
    setSyncing(true);
    try {
      const r = await api.post("/api/wp/sync");
      toast.success(`Synced ${r.data.synced} new posts from WordPress`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const pushPost = async () => {
    if (!newPost.title || !newPost.content)
      return toast.error("Title and content required");
    try {
      await api.post("/api/wp/posts", newPost);
      toast.success("Post published to WordPress!");
      setNewPost({ title: "", content: "", excerpt: "", status: "publish" });
      setShowNewPost(false);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Publish failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT: CONFIG */}
        <div className="lg:col-span-7 space-y-5">
          <div className="card-cosmic">
            <h3 className="font-semibold text-sm mb-5 text-slate-300">
              WordPress Connection
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                  Site URL
                </label>
                <input
                  className="input-cosmic"
                  placeholder="https://yourblog.com"
                  value={cfg.base_url}
                  onChange={(e) =>
                    setCfg((p) => ({ ...p, base_url: e.target.value }))
                  }
                  data-testid="wp-url-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                    WP Username
                  </label>
                  <input
                    className="input-cosmic"
                    placeholder="admin"
                    value={cfg.wp_username || ""}
                    onChange={(e) =>
                      setCfg((p) => ({ ...p, wp_username: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                    App Password
                  </label>
                  <input
                    className="input-cosmic"
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={cfg.wp_app_password || ""}
                    onChange={(e) =>
                      setCfg((p) => ({ ...p, wp_app_password: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${cfg.active ? "bg-[#00FF9D]" : "bg-slate-700"}`}
                  onClick={() => setCfg((p) => ({ ...p, active: !p.active }))}
                  data-testid="wp-sync-toggle"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${cfg.active ? "left-6" : "left-1"}`}
                  />
                </div>
                <span className="text-sm text-slate-300">
                  Active headless sync{" "}
                  <span className="text-slate-600 text-xs">
                    (blog auto-fetches from WP)
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-ghost text-xs px-4 py-2"
                  onClick={test}
                  disabled={testing}
                  data-testid="wp-test-btn"
                >
                  {testing ? "⏳ Testing..." : "🔌 Test Connection"}
                </button>
                <button
                  className="btn-mint text-xs px-4 py-2"
                  onClick={save}
                  data-testid="wp-save-btn"
                >
                  💾 Save Config
                </button>
                {cfg.active && (
                  <button
                    className="btn-ghost text-xs px-4 py-2"
                    onClick={sync}
                    disabled={syncing}
                  >
                    {syncing ? "⏳ Syncing..." : "🔄 Sync Posts Now"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LOGS */}
          {logs.length > 0 && (
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.07)] overflow-hidden"
              data-testid="wp-cors-logs"
            >
              <div className="px-4 py-2 bg-[rgba(0,255,157,0.04)] border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-wider">
                  Diagnostic Log
                </span>
              </div>
              <div
                className="p-4 space-y-1.5"
                style={{
                  background: "#050C18",
                  fontFamily: "JetBrains Mono,monospace",
                }}
              >
                {logs.map((l, i) => (
                  <div key={i} className="text-xs text-slate-400">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW POST */}
          <div className="card-cosmic">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-slate-300">
                Publish to WordPress
              </h3>
              <button
                className="btn-ghost text-xs px-3 py-1.5"
                onClick={() => setShowNewPost(!showNewPost)}
              >
                {showNewPost ? "✕ Cancel" : "+ New Post"}
              </button>
            </div>
            <AnimatePresence>
              {showNewPost && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                        Title
                      </label>
                      <input
                        className="input-cosmic"
                        placeholder="Post title..."
                        value={newPost.title}
                        onChange={(e) =>
                          setNewPost((p) => ({ ...p, title: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                        Excerpt
                      </label>
                      <input
                        className="input-cosmic"
                        placeholder="Short description..."
                        value={newPost.excerpt}
                        onChange={(e) =>
                          setNewPost((p) => ({ ...p, excerpt: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                        Content (HTML or Gutenberg blocks)
                      </label>
                      <textarea
                        className="input-cosmic"
                        rows={6}
                        placeholder="<p>Your post content here...</p>"
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost((p) => ({ ...p, content: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        className="input-cosmic w-36"
                        value={newPost.status}
                        onChange={(e) =>
                          setNewPost((p) => ({ ...p, status: e.target.value }))
                        }
                      >
                        <option value="publish">Publish</option>
                        <option value="draft">Save as Draft</option>
                      </select>
                      <button
                        className="btn-mint text-sm px-5 py-2"
                        onClick={pushPost}
                      >
                        Publish to WP →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!showNewPost && (
              <p className="text-xs text-slate-600">
                Push posts directly to your WordPress site using the REST API
                with Basic Auth.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: SETUP GUIDE */}
        <div className="lg:col-span-5">
          <div className="card-cosmic sticky top-24">
            <h3 className="font-semibold text-sm mb-5 text-slate-300">
              Setup Guide
            </h3>
            <ol className="space-y-4">
              {[
                [
                  "Install WordPress",
                  "Any host works: WP Engine, Kinsta, Cloudways, or even a ₹99/mo shared host.",
                ],
                [
                  "Enable REST API",
                  "It's on by default in WordPress 4.7+. No plugin needed.",
                ],
                [
                  "Add CORS Headers",
                  'Install "WP CORS" plugin or add `header("Access-Control-Allow-Origin: *")` in functions.php',
                ],
                [
                  "Create App Password",
                  'WP Admin → Users → Your Profile → Application Passwords. Generate one for "TrueCreds".',
                ],
                [
                  "Paste URL & Credentials",
                  "Enter your site URL, WP username, and the generated app password above.",
                ],
                [
                  "Test & Save",
                  "Click Test Connection to verify, then Save. Toggle Active Sync to pull posts automatically.",
                ],
              ].map(([title, desc], i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] text-[#00FF9D] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white mb-0.5">
                      {title}
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {desc}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTab() {
  const [status, setStatus] = useState(null);
  const load = () =>
    api
      .get("/api/status/system")
      .then((r) => setStatus(r.data))
      .catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const sendTestEmail = async () => {
    try {
      const r = await api.post("/api/admin/test-email");
      toast[r.data.ok ? "success" : "error"](
        r.data.ok ? "Test email sent!" : r.data.error,
      );
    } catch {
      toast.error("Failed to send test email");
    }
  };

  if (!status)
    return (
      <div className="text-slate-600 text-sm py-12 text-center">
        Loading system status...
      </div>
    );

  const Dot = ({ ok }) => (
    <span
      className={`w-2.5 h-2.5 rounded-full inline-block ${ok ? "bg-[#00FF9D]" : "bg-red-500"}`}
      style={
        ok
          ? {
              boxShadow: "0 0 6px rgba(0,255,157,0.6)",
              animation: "pulse 2s infinite",
            }
          : {}
      }
    />
  );

  return (
    <div className="grid sm:grid-cols-2 gap-5" data-testid="status-panel">
      <motion.div
        className="card-cosmic"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Database</h3>
          <Dot ok={status.database.connected} />
        </div>
        <div className="space-y-1.5 text-xs text-slate-500">
          <div>
            Name:{" "}
            <span className="text-slate-300 font-mono-nums">
              {status.database.name}
            </span>
          </div>
          <div>
            Status:{" "}
            <span
              className={
                status.database.connected ? "text-[#00FF9D]" : "text-red-400"
              }
            >
              {status.database.connected ? "Connected ✓" : "Disconnected ✗"}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="card-cosmic"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">WordPress Sync</h3>
          <Dot ok={status.wordpress.active} />
        </div>
        <div className="space-y-1.5 text-xs text-slate-500">
          <div>
            Active:{" "}
            <span
              className={
                status.wordpress.active ? "text-[#00FF9D]" : "text-slate-400"
              }
            >
              {status.wordpress.active ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Posts cached:{" "}
            <span className="text-slate-300 font-mono-nums">
              {status.wordpress.post_count}
            </span>
          </div>
          <div>
            Auth:{" "}
            <span className="text-slate-300">
              {status.wordpress.has_auth
                ? "✓ App Password set"
                : "— Not configured"}
            </span>
          </div>
          {status.wordpress.last_tested && (
            <div>
              Last test:{" "}
              <span className="text-slate-400">
                {new Date(status.wordpress.last_tested).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="card-cosmic"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Email (Resend)</h3>
          <Dot ok={status.email.configured} />
        </div>
        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div>
            Configured:{" "}
            <span
              className={
                status.email.configured ? "text-[#00FF9D]" : "text-slate-400"
              }
            >
              {status.email.configured ? "Yes ✓" : "No — Add RESEND_API_KEY"}
            </span>
          </div>
          {status.email.from && (
            <div>
              From:{" "}
              <span className="text-slate-300 font-mono-nums">
                {status.email.from}
              </span>
            </div>
          )}
          {status.email.to && (
            <div>
              Notify:{" "}
              <span className="text-slate-300 font-mono-nums">
                {status.email.to}
              </span>
            </div>
          )}
        </div>
        <button
          className="btn-ghost text-xs px-3 py-2"
          onClick={sendTestEmail}
          data-testid="send-test-email-btn"
        >
          Send Test Email
        </button>
      </motion.div>

      <motion.div
        className="card-cosmic"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Counters</h3>
          <Dot ok={true} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Leads", status.counters.total_leads],
            ["Loan Apps", status.counters.loan_apps],
            ["Blog Posts", status.counters.blog_posts],
            ["Contacts", status.counters.contacts],
          ].map(([l, v]) => (
            <div
              key={l}
              className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.03)]"
            >
              <div className="font-mono-nums text-lg text-white font-bold">
                {v}
              </div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">
                {l}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center text-[10px] text-slate-600 font-mono">
          v{status.counters.version} · {status.counters.service}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("leads");
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("truecreds_token");
    nav("/admin/login");
  };

  useEffect(() => {
    api.get("/api/auth/me").catch(() => {
      localStorage.removeItem("truecreds_token");
      nav("/admin/login");
    });
  }, [nav]);

  return (
    <div className="min-h-screen" style={{ background: "#070F1E" }}>
      <Toaster theme="dark" position="top-right" />
      {/* ADMIN NAV */}
      <div
        className="border-b border-[rgba(255,255,255,0.07)] px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(7,15,30,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <span
            className="font-black text-lg text-white"
            style={{ fontFamily: "Outfit,sans-serif" }}
          >
            True<span style={{ color: "#00FF9D" }}>Creds</span>
          </span>
          <span className="badge-mint text-[9px]">ADMIN</span>
        </div>
        <button className="btn-ghost text-sm px-4 py-2" onClick={logout}>
          Sign Out →
        </button>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-testid="admin-dashboard-page"
      >
        <div className="mb-8">
          <h1
            className="font-black text-3xl"
            style={{ fontFamily: "Outfit,sans-serif" }}
          >
            Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage leads, WordPress sync, and system health.
          </p>
        </div>

        {/* TABS */}
        <div
          className="flex gap-1 mb-8 border-b border-[rgba(255,255,255,0.07)]"
          data-testid="admin-tabs"
        >
          {[
            ["leads", "Leads Manager"],
            ["blog", "✍️ Blog Manager"],
            ["wordpress", "WordPress Sync"],
            ["pages", "Page Builder"],
            ["status", "Status Monitor"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              data-testid={`tab-${id}`}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${tab === id ? "border-[#00FF9D] text-[#00FF9D]" : "border-transparent text-slate-500 hover:text-slate-300"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "leads" && <LeadsTab />}
            {tab === "blog" && <BlogTab />}
            {tab === "wordpress" && <WpTab />}
            {tab === "status" && <StatusTab />}
            {tab === "pages" && <PageBuilder />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
