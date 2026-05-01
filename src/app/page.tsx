'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #0a0a0a;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── NAV ────────────────────────────────── */
        .rfp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent);
          border-bottom: 1px solid rgba(204,0,0,0.15);
        }

        .rfp-nav-logo {
          display: flex;
          align-items: center;
        }

        .rfp-nav-logo img {
          height: 52px;
          width: auto;
          filter: drop-shadow(0 2px 8px rgba(204,0,0,0.5));
        }

        .rfp-nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }

        .rfp-nav-links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .rfp-nav-links a:hover { color: #CC0000; }

        .rfp-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #CC0000;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 22px;
          border-radius: 3px;
          transition: background 0.2s, transform 0.2s;
        }

        .rfp-nav-cta:hover { background: #aa0000; transform: translateY(-1px); }

        /* ── HERO ───────────────────────────────── */
        .rfp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          overflow: hidden;
        }

        #rfpBgVideo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.3) saturate(0.7);
        }

        .rfp-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.75) 100%),
            radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%);
          z-index: 1;
        }

        /* red accent lines top-left */
        .rfp-overlay::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: #CC0000;
          box-shadow: 0 0 40px rgba(204,0,0,0.8);
        }

        .rfp-hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
        }

        .rfp-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #CC0000;
          border: 1px solid rgba(204,0,0,0.5);
          background: rgba(204,0,0,0.08);
          padding: 7px 20px;
          border-radius: 2px;
          margin-bottom: 36px;
        }

        .rfp-logo-hero {
          width: min(480px, 85vw);
          height: auto;
          margin-bottom: 32px;
          filter: drop-shadow(0 4px 24px rgba(204,0,0,0.4));
        }

        .rfp-tagline {
          font-size: clamp(16px, 2.5vw, 24px);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 48px;
        }

        .rfp-tagline span {
          color: #CC0000;
        }

        /* ── BUTTONS ────────────────────────────── */
        .rfp-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          align-items: center;
        }

        .rfp-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 18px 36px;
          border-radius: 3px;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .rfp-btn-primary {
          background: #CC0000;
          color: #fff;
          box-shadow: 0 0 24px rgba(204,0,0,0.4);
        }

        .rfp-btn-primary:hover {
          background: #aa0000;
          transform: translateY(-2px);
          box-shadow: 0 4px 32px rgba(204,0,0,0.6);
        }

        .rfp-btn-secondary {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.4);
        }

        .rfp-btn-secondary:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .rfp-btn-outline-red {
          background: transparent;
          color: #CC0000;
          border: 2px solid rgba(204,0,0,0.6);
        }

        .rfp-btn-outline-red:hover {
          background: rgba(204,0,0,0.1);
          border-color: #CC0000;
          transform: translateY(-2px);
        }

        .rfp-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

        /* ── STATS STRIP ────────────────────────── */
        .rfp-stats {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          gap: 0;
          background: rgba(0,0,0,0.85);
          border-top: 3px solid #CC0000;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
        }

        .rfp-stat {
          text-align: center;
          padding: 28px 48px;
          flex: 1;
          min-width: 140px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }

        .rfp-stat:last-child { border-right: none; }

        .rfp-stat-number {
          font-size: 36px;
          font-weight: 900;
          color: #CC0000;
          line-height: 1;
          letter-spacing: -1px;
        }

        .rfp-stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-top: 8px;
        }

        /* ── FEATURES SECTION ───────────────────── */
        .rfp-features {
          background: #0a0a0a;
          padding: 100px 40px;
          position: relative;
        }

        .rfp-features::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to bottom, #CC0000, transparent);
        }

        .rfp-section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #CC0000;
          text-align: center;
          margin-bottom: 16px;
        }

        .rfp-section-title {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          text-align: center;
          color: #fff;
          margin-bottom: 64px;
          letter-spacing: -0.5px;
        }

        .rfp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .rfp-card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid #CC0000;
          border-radius: 4px;
          padding: 36px 32px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .rfp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(204,0,0,0.15);
        }

        .rfp-card-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .rfp-card-title {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }

        .rfp-card-body {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
        }

        /* ── CTA SECTION ────────────────────────── */
        .rfp-cta-section {
          background: #CC0000;
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .rfp-cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(0,0,0,0.04) 20px,
            rgba(0,0,0,0.04) 40px
          );
        }

        .rfp-cta-section h2 {
          position: relative;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .rfp-cta-section p {
          position: relative;
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 40px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .rfp-btn-dark {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #000;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 18px 42px;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .rfp-btn-dark:hover {
          background: #111;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        /* ── FOOTER ─────────────────────────────── */
        .rfp-footer {
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .rfp-footer img {
          height: 36px;
          width: auto;
          opacity: 0.7;
        }

        .rfp-footer-links {
          display: flex;
          gap: 24px;
          list-style: none;
        }

        .rfp-footer-links a {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .rfp-footer-links a:hover { color: #CC0000; }

        .rfp-footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }

        /* ── SCROLL HINT ────────────────────────── */
        .rfp-scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: rfpBounce 2.2s ease-in-out infinite;
        }

        .rfp-scroll span {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .rfp-scroll-arrow {
          width: 18px;
          height: 18px;
          border-right: 2px solid rgba(204,0,0,0.6);
          border-bottom: 2px solid rgba(204,0,0,0.6);
          transform: rotate(45deg);
        }

        @keyframes rfpBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        /* ── RESPONSIVE ─────────────────────────── */
        @media (max-width: 700px) {
          .rfp-nav { padding: 14px 20px; }
          .rfp-nav-links { display: none; }
          .rfp-features { padding: 64px 24px; }
          .rfp-stat { padding: 22px 24px; }
          .rfp-footer { justify-content: center; text-align: center; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="rfp-nav">
        <div className="rfp-nav-logo">
          <img src="/logo.png" alt="Real Fight Promotions" />
        </div>
        <ul className="rfp-nav-links">
          <li><a href="/people">Fighters</a></li>
          <li><a href="https://ta.realpromo.io/events">Events</a></li>
          <li><a href="/match">Matchmaking</a></li>
          <li><a href="https://ta.realpromo.io/events">Stream</a></li>
        </ul>
        <a href="/auth/sign-in" className="rfp-nav-cta">
          Sign In
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="rfp-hero">
        <video id="rfpBgVideo" autoPlay muted loop playsInline>
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="rfp-overlay" />

        <div className="rfp-hero-content">
          <div className="rfp-badge">▲ Combat Sports Platform</div>

          <img
            src="/logo.png"
            alt="Real Fight Promotions"
            className="rfp-logo-hero"
          />

          <p className="rfp-tagline">
            We Help <span>Real</span> Fighters
          </p>

          <div className="rfp-cta-group">
            <a href="/auth/sign-up" className="rfp-btn rfp-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Enter Combat Sports Draft
            </a>

            <a href="https://realfightpromo.com" target="_blank" rel="noopener noreferrer" className="rfp-btn rfp-btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
              Get Tickets
            </a>

            <a href="https://ta.realpromo.io/events" className="rfp-btn rfp-btn-outline-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Stream
            </a>
          </div>
        </div>

        <div className="rfp-scroll">
          <span>Scroll</span>
          <div className="rfp-scroll-arrow" />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="rfp-stats">
        <div className="rfp-stat">
          <div className="rfp-stat-number">100+</div>
          <div className="rfp-stat-label">Fighters</div>
        </div>
        <div className="rfp-stat">
          <div className="rfp-stat-number">20</div>
          <div className="rfp-stat-label">Events</div>
        </div>
        <div className="rfp-stat">
          <div className="rfp-stat-number">7</div>
          <div className="rfp-stat-label">Promotions</div>
        </div>
        <div className="rfp-stat">
          <div className="rfp-stat-number">50K</div>
          <div className="rfp-stat-label">Fans</div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="rfp-features">
        <div className="rfp-section-label">What We Offer</div>
        <h2 className="rfp-section-title">Built for the Fight Game</h2>

        <div className="rfp-grid">
          <div className="rfp-card">
            <div className="rfp-card-icon">📋</div>
            <h3 className="rfp-card-title">The Fight Board</h3>
            <p className="rfp-card-body">
              Old-school community board meets AI agent. Post what you need, browse who's out there — then let the AI cut through the noise and put the right people in front of you. No more cold calls. No more dead ends.
            </p>
          </div>

          <div className="rfp-card">
            <div className="rfp-card-icon">🎟️</div>
            <h3 className="rfp-card-title">Event Ticketing</h3>
            <p className="rfp-card-body">
              Buy tickets for upcoming fight cards, access live streams, and follow your favorite fighters — all in one place.
            </p>
          </div>

          <div className="rfp-card">
            <div className="rfp-card-icon">👥</div>
            <h3 className="rfp-card-title">Fighter Network</h3>
            <p className="rfp-card-body">
              Connect with fighters, coaches, managers, and promoters across the country. Every profile, every role — the full combat sports ecosystem.
            </p>
          </div>

          <div className="rfp-card">
            <div className="rfp-card-icon">📋</div>
            <h3 className="rfp-card-title">Promoter Tools</h3>
            <p className="rfp-card-body">
              Manage events, scan tickets at the door, send branded confirmation emails, and track gate revenue — purpose-built for regional promotions.
            </p>
          </div>

          <div className="rfp-card">
            <div className="rfp-card-icon">🏆</div>
            <h3 className="rfp-card-title">Fighter Profiles</h3>
            <p className="rfp-card-body">
              Build a professional fighter profile — record, weight class, reach, stance, availability, and highlights. Your digital fight card.
            </p>
          </div>

          <div className="rfp-card">
            <div className="rfp-card-icon">⚡</div>
            <h3 className="rfp-card-title">Live Community Feed</h3>
            <p className="rfp-card-body">
              Follow the latest from fighters, trainers, and promoters in your area. Post updates, share results, and stay connected to the scene.
            </p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div className="rfp-cta-section">
        <h2>Ready to Enter the Draft?</h2>
        <p>Join the platform that connects every corner of the combat sports world.</p>
        <a href="/auth/sign-up" className="rfp-btn-dark">
          Create Your Free Profile →
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer className="rfp-footer">
        <img src="/logo.png" alt="Real Fight Promotions" />
        <ul className="rfp-footer-links">
          <li><a href="/people">Fighters</a></li>
          <li><a href="https://ta.realpromo.io/events">Events</a></li>
          <li><a href="/match">Matchmaking</a></li>
          <li><a href="/auth/sign-in">Sign In</a></li>
        </ul>
        <span className="rfp-footer-copy">© 2026 Real Fight Promotions. All rights reserved.</span>
      </footer>
    </>
  )
}
