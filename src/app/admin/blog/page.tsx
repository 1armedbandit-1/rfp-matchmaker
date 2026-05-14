'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  author: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_url: '',
    author: 'Real Fight Promotions',
    tags: '',
    published: false,
  });

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  function newPost() {
    setEditingId(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_url: '', author: 'Real Fight Promotions', tags: '', published: false });
    setView('editor');
  }

  function editPost(post: Post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content,
      cover_url: post.cover_url ?? '',
      author: post.author ?? 'Real Fight Promotions',
      tags: (post.tags ?? []).join(', '),
      published: post.published,
    });
    setView('editor');
  }

  async function savePost() {
    if (!form.title || !form.content) return;
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_url: form.cover_url,
      author: form.author,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    };

    if (editingId) {
      await supabase.from('blog_posts').update(payload).eq('id', editingId);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    await loadPosts();
    setView('list');
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    await loadPosts();
  }

  async function togglePublished(post: Post) {
    await supabase.from('blog_posts').update({
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : null,
    }).eq('id', post.id);
    await loadPosts();
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #fff; min-height: 100vh; }

        .page { max-width: 960px; margin: 0 auto; padding: 48px 32px; }

        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
        .page-header h1 { font-size: 28px; font-weight: 900; }
        .page-header a { font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; }
        .page-header a:hover { color: #fff; }

        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; }
        .btn-red { background: #dc2626; color: #fff; }
        .btn-red:hover { background: #b91c1c; }
        .btn-ghost { background: transparent; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.15); }
        .btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
        .btn-green { background: #16a34a; color: #fff; }
        .btn-green:hover { background: #15803d; }
        .btn-sm { padding: 6px 14px; font-size: 12px; }

        /* Post list */
        .post-list { display: flex; flex-direction: column; gap: 12px; }
        .post-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 16px 20px;
        }
        .post-row-info { flex: 1; }
        .post-row-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .post-row-meta { font-size: 12px; color: rgba(255,255,255,0.35); }
        .status-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; }
        .status-published { background: rgba(22,163,74,0.15); color: #4ade80; border: 1px solid rgba(22,163,74,0.3); }
        .status-draft { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }
        .post-row-actions { display: flex; gap: 8px; }

        /* Editor */
        .editor { display: flex; flex-direction: column; gap: 20px; }
        .editor-header { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
        .editor-header h2 { font-size: 22px; font-weight: 800; flex: 1; }

        label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        input[type="text"], textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: #fff;
          padding: 12px 16px;
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.2s;
          outline: none;
        }
        input[type="text"]:focus, textarea:focus { border-color: #dc2626; }
        textarea { resize: vertical; min-height: 320px; line-height: 1.65; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .checkbox-row { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px; }
        .checkbox-row input[type="checkbox"] { width: 20px; height: 20px; accent-color: #dc2626; cursor: pointer; }
        .checkbox-row span { font-size: 14px; font-weight: 600; }

        .editor-actions { display: flex; gap: 12px; padding-top: 8px; }
        .save-note { font-size: 13px; color: #4ade80; font-weight: 600; }

        .empty { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.3); }
        .empty h3 { font-size: 20px; margin-bottom: 8px; }

        @media (max-width: 640px) {
          .page { padding: 32px 16px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <div className="page-header">
          <h1>📝 Blog Posts</h1>
          <a href="/">← Back to site</a>
        </div>

        {view === 'list' ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <button className="btn btn-red" onClick={newPost}>+ New Post</button>
            </div>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
            ) : posts.length === 0 ? (
              <div className="empty">
                <h3>No posts yet</h3>
                <p>Click "New Post" to write your first article.</p>
              </div>
            ) : (
              <div className="post-list">
                {posts.map(post => (
                  <div key={post.id} className="post-row">
                    <div className="post-row-info">
                      <div className="post-row-title">{post.title}</div>
                      <div className="post-row-meta">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {post.tags?.length > 0 && ` · ${post.tags.join(', ')}`}
                      </div>
                    </div>
                    <span className={`status-badge ${post.published ? 'status-published' : 'status-draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="post-row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => editPost(post)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: post.published ? 'rgba(255,255,255,0.06)' : 'rgba(22,163,74,0.15)', color: post.published ? 'rgba(255,255,255,0.5)' : '#4ade80', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => togglePublished(post)}>
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-sm" style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.2)' }} onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="editor">
            <div className="editor-header">
              <h2>{editingId ? 'Edit Post' : 'New Post'}</h2>
              <button className="btn btn-ghost" onClick={() => setView('list')}>← Cancel</button>
            </div>

            <div>
              <label>Title *</label>
              <input type="text" value={form.title} placeholder="e.g. Fight Night Recap — May 2026" onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} />
            </div>

            <div className="form-row">
              <div>
                <label>URL Slug (auto-generated)</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="fight-night-recap-may-2026" />
              </div>
              <div>
                <label>Author</label>
                <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
            </div>

            <div>
              <label>Excerpt (shown on blog listing)</label>
              <input type="text" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary of the post..." />
            </div>

            <div>
              <label>Cover Image URL (optional)</label>
              <input type="text" value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." />
            </div>

            <div>
              <label>Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Boxing, Recap, Event News" />
            </div>

            <div>
              <label>Content * (use blank lines between paragraphs)</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your post here...&#10;&#10;Use blank lines to separate paragraphs." />
            </div>

            <div className="checkbox-row">
              <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
              <label htmlFor="published" style={{ marginBottom: 0, textTransform: 'none', letterSpacing: 0, fontSize: 14, color: '#fff' }}>
                <span>Publish immediately</span>
                <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Uncheck to save as draft</span>
              </label>
            </div>

            <div className="editor-actions">
              <button className="btn btn-red" onClick={savePost} disabled={saving}>
                {saving ? 'Saving...' : 'Save Post'}
              </button>
              {saved && <span className="save-note">✓ Saved!</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
