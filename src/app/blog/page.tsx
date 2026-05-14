import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Real Fight Promotions',
  description: 'Fight recaps, event announcements, fighter spotlights, and combat sports news from Real Fight Promotions.',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_url, author, tags, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #030712;
          color: #fff;
          min-height: 100vh;
        }

        nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          background: rgba(3,7,18,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-logo img { height: 38px; width: auto; display: block; }
        .nav-links { display: flex; gap: 28px; list-style: none; }
        .nav-links a { color: rgba(255,255,255,0.65); text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: #dc2626; }

        .hero {
          background: linear-gradient(135deg, rgba(220,38,38,0.08) 0%, transparent 60%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 64px 40px 48px;
          text-align: center;
        }
        .hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #dc2626; margin-bottom: 12px; }
        .hero h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 900; line-height: 1.05; margin-bottom: 12px; }
        .hero p { color: rgba(255,255,255,0.5); font-size: 16px; max-width: 480px; margin: 0 auto; }

        .blog-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }

        .post-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.2s;
        }
        .post-card:hover { border-color: rgba(220,38,38,0.4); transform: translateY(-3px); }

        .post-cover {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: rgba(220,38,38,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }
        .post-cover img { width: 100%; height: 100%; object-fit: cover; }

        .post-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }

        .post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #dc2626; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); padding: 3px 10px; border-radius: 100px; }

        .post-title { font-size: 18px; font-weight: 800; line-height: 1.3; margin-bottom: 10px; }
        .post-excerpt { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.65; flex: 1; }

        .post-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.07); }
        .post-author { font-size: 12px; color: rgba(255,255,255,0.4); }
        .post-date { font-size: 12px; color: rgba(255,255,255,0.3); }

        .read-more { font-size: 12px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 16px; }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          color: rgba(255,255,255,0.3);
          grid-column: 1 / -1;
        }
        .empty-state h2 { font-size: 24px; margin-bottom: 8px; }

        footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 32px 40px;
          text-align: center;
        }
        .footer-logo img { height: 32px; opacity: 0.4; margin-bottom: 12px; }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }

        @media (max-width: 640px) {
          nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { padding: 48px 20px 36px; }
          .blog-grid { padding: 40px 20px; }
          footer { padding: 24px 20px; }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <div className="nav-logo">
          <Link href="/"><img src="/logo.jpg" alt="Real Fight Promotions" /></Link>
        </div>
        <ul className="nav-links">
          <li><Link href="/people">Fighters</Link></li>
          <li><Link href="https://ta.realpromo.io/events">Events</Link></li>
          <li><Link href="/match">Matchmaking</Link></li>
          <li><Link href="/blog" className="active">Blog</Link></li>
          <li><Link href="/auth/sign-in">Sign In</Link></li>
        </ul>
      </nav>

      {/* Hero */}
      <div className="hero">
        <p className="hero-eyebrow">Real Fight Promotions</p>
        <h1>News &amp; Updates</h1>
        <p>Fight recaps, event announcements, fighter spotlights, and combat sports news.</p>
      </div>

      {/* Posts grid */}
      <div className="blog-grid">
        {posts && posts.length > 0 ? posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="post-card">
            <div className="post-cover">
              {post.cover_url
                ? <img src={post.cover_url} alt={post.title} />
                : '🥊'
              }
            </div>
            <div className="post-body">
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <h2 className="post-title">{post.title}</h2>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : ''}
                </span>
              </div>
              <p className="read-more">Read more →</p>
            </div>
          </Link>
        )) : (
          <div className="empty-state">
            <h2>No posts yet</h2>
            <p>Check back soon for fight recaps and event news.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">
          <img src="/logo.jpg" alt="Real Fight Promotions" />
        </div>
        <p className="footer-copy">Copyright 2026 | Real Fight Promotions · info@realpromo.io</p>
      </footer>
    </>
  );
}
