'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [showDraftModal, setShowDraftModal] = useState(false)

  // Load GHL form embed script once
  useEffect(() => {
    if (document.querySelector('script[src*="form_embed.js"]')) return
    const s = document.createElement('script')
    s.src = 'https://site.realfightpromo.com/js/form_embed.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  // Listen for GHL form submission → redirect
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      // GHL fires several event shapes on submission
      const d = e.data
      if (!d) return
      const isSubmit =
        d.type === 'form-submitted' ||
        d.event === 'formSubmit' ||
        d.event === 'form-submitted' ||
        d.message === 'form-submitted' ||
        (typeof d === 'string' && d.includes('form-submitted'))
      if (isSubmit) {
        window.location.href = 'https://watch.realfightpromo.com'
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #000;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Nav ── */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-logo img { height: 40px; width: auto; display: block; }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          align-items: center;
        }

        .nav-links a {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #ef4444; }

        .nav-links .sign-in {
          padding: 8px 20px;
          border: 1px solid rgba(220,38,38,0.4);
          border-radius: 6px;
          color: #ef4444 !important;
        }
        .nav-links .sign-in:hover { background: rgba(220,38,38,0.1); }

        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 100px 24px 60px;
          overflow: hidden;
        }

        #bgVideo {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.45) saturate(0.8);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.80) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }

        .hero-logo {
          height: 100px;
          width: auto;
          display: block;
          margin: 0 auto 20px;
          filter: drop-shadow(0 6px 24px rgba(220,38,38,0.4));
        }

        .eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #dc2626;
          border: 1px solid rgba(220,38,38,0.4);
          padding: 6px 18px;
          border-radius: 100px;
          margin-bottom: 28px;
        }

        .hero h1 {
          font-size: clamp(52px, 9vw, 110px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 12px;
        }
        .hero h1 .accent { color: #dc2626; }

        .sub-headline {
          font-size: clamp(18px, 3vw, 32px);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-bottom: 48px;
        }

        .cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          align-items: center;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 18px 36px;
          border-radius: 4px;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        .btn svg { width: 16px; height: 16px; }

        .btn-primary { background: #dc2626; color: #fff; }
        .btn-primary:hover { background: #b91c1c; transform: translateY(-2px); }

        .btn-secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5); }
        .btn-secondary:hover { border-color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-2px); }

        .btn-stream { background: rgba(220,38,38,0.12); color: #ef4444; border: 2px solid rgba(220,38,38,0.5); }
        .btn-stream:hover { background: rgba(220,38,38,0.2); border-color: #dc2626; transform: translateY(-2px); }

        .scroll-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: bounce 2s infinite;
        }
        .scroll-hint span { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .scroll-arrow { width: 20px; height: 20px; border-right: 2px solid rgba(255,255,255,0.3); border-bottom: 2px solid rgba(255,255,255,0.3); transform: rotate(45deg); }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        /* ── Stats strip ── */
        .stats {
          display: flex;
          justify-content: center;
          gap: 64px;
          padding: 32px 40px;
          background: rgba(0,0,0,0.85);
          border-top: 1px solid rgba(220,38,38,0.2);
          flex-wrap: wrap;
        }
        .stat { text-align: center; }
        .stat-number { font-size: 32px; font-weight: 900; color: #dc2626; line-height: 1; }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-top: 6px; }

        /* ── Features section ── */
        .features-section {
          padding: 80px 40px;
          background: #0a0a0a;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .features-section h2 {
          text-align: center;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          letter-spacing: -0.01em;
          margin-bottom: 56px;
        }
        .features-section h2 .accent { color: #dc2626; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 32px;
          transition: border-color 0.2s, background 0.2s;
        }
        .feature-card:hover { border-color: rgba(220,38,38,0.3); background: rgba(220,38,38,0.04); }

        .feature-icon { font-size: 28px; margin-bottom: 16px; }
        .feature-card h3 { font-size: 18px; font-weight: 800; margin-bottom: 10px; }
        .feature-card p { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.65; }

        /* ── CTA band ── */
        .cta-band {
          padding: 80px 40px;
          text-align: center;
          background: linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(0,0,0,0) 100%);
          border-top: 1px solid rgba(220,38,38,0.15);
          border-bottom: 1px solid rgba(220,38,38,0.15);
        }
        .cta-band h2 { font-size: clamp(26px, 4vw, 40px); font-weight: 900; margin-bottom: 12px; }
        .cta-band p { color: rgba(255,255,255,0.55); font-size: 16px; margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }

        /* ── Promotions logos ── */
        .promos-section {
          padding: 64px 40px;
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .promos-section h3 {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 40px;
        }
        .promos-logos {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }
        .promos-logos img {
          height: 48px;
          width: auto;
          opacity: 0.85;
          transition: opacity 0.2s, transform 0.2s;
        }
        .promos-logos img:hover { opacity: 1; transform: scale(1.05); }

        /* ── Footer ── */
        footer {
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 40px;
          text-align: center;
        }
        .footer-logo img { height: 36px; width: auto; opacity: 0.5; margin-bottom: 20px; }
        .footer-links { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; margin-bottom: 16px; }
        .footer-links a { font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }

        /* ── Draft Modal ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px 40px;
          overflow-y: auto;
        }
        .modal-box {
          position: relative;
          width: 100%;
          max-width: 680px;
          background: #0d0d0d;
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 12px;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .modal-header h3 {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ef4444;
        }
        .modal-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
          padding: 4px 8px;
          transition: color 0.2s;
        }
        .modal-close:hover { color: #fff; }
        .modal-body { padding: 0; }
        .modal-body iframe { display: block; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          nav { padding: 14px 20px; }
          .nav-links { display: none; }
          .stats { gap: 32px; padding: 24px 20px; }
          .features-section { padding: 56px 20px; }
          .cta-band { padding: 56px 20px; }
          .promos-section { padding: 48px 20px; }
          footer { padding: 32px 20px; }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <div className="nav-logo">
          <a href="/"><img src="/logo.jpg" alt="Real Fight Promotions" /></a>
        </div>
        <ul className="nav-links">
          <li><a href="/people">Fighters</a></li>
          <li><a href="https://ta.realpromo.io/events">Events</a></li>
          <li><a href="/match">Matchmaking</a></li>
          <li><a href="https://ta.realpromo.io/events">Stream</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/auth/sign-in" className="sign-in">Sign In</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <video id="bgVideo" autoPlay muted loop playsInline>
          <source src="https://ta.realpromo.io/background.mp4" type="video/mp4" />
        </video>
        <div className="overlay" />

        <div className="hero-content">
          <img src="/logo.jpg" alt="Real Fight Promotions" className="hero-logo" />
          <div className="eyebrow">▲ Combat Sports Platform</div>
          <h1>Real <span className="accent">Fight</span><br />Promotion</h1>
          <p className="sub-headline">We Help Real Fighters</p>

          <div className="cta-group">
            <button onClick={() => setShowDraftModal(true)} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Enter Combat Sports Draft
            </button>
            <a href="https://ta.realpromo.io/events" className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
              Get Tickets
            </a>
            <a href="https://ta.realpromo.io/events" className="btn btn-stream">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Stream
            </a>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stat"><div className="stat-number">100+</div><div className="stat-label">Fighters</div></div>
        <div className="stat"><div className="stat-number">20</div><div className="stat-label">Events</div></div>
        <div className="stat"><div className="stat-number">7</div><div className="stat-label">Promotions</div></div>
        <div className="stat"><div className="stat-number">50,000</div><div className="stat-label">Fans</div></div>
      </div>

      {/* What We Offer */}
      <section className="features-section">
        <h2>Built for the <span className="accent">Fight Game</span></h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>The Fight Board</h3>
            <p>Old-school community board meets AI agent. Post what you need, browse who's out there — then let the AI cut through the noise and put the right people in front of you. No more cold calls. No more dead ends.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Event Ticketing</h3>
            <p>Buy tickets for upcoming fight cards, access live streams, and follow your favorite fighters — all in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Fighter Network</h3>
            <p>Connect with fighters, coaches, managers, and promoters across the country. Every profile, every role — the full combat sports ecosystem.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Promoter Tools</h3>
            <p>Manage events, scan tickets at the door, send branded confirmation emails, and track gate revenue — purpose-built for regional promotions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Fighter Profiles</h3>
            <p>Build a professional fighter profile — record, weight class, reach, stance, availability, and highlights. Your digital fight card.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Live Community Feed</h3>
            <p>Follow the latest from fighters, trainers, and promoters in your area. Post updates, share results, and stay connected to the scene.</p>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <h2>Ready to Enter the Draft?</h2>
        <p>Join the platform that connects every corner of the combat sports world.</p>
        <button onClick={() => setShowDraftModal(true)} className="btn btn-primary">
          Create Your Free Profile →
        </button>
      </section>

      {/* Promotions logos */}
      <section className="promos-section">
        <h3>Promotions in The Community</h3>
        <div className="promos-logos">
          <img src="/logos/kamp-green.png" alt="Kamp Green" />
          <img src="/logos/made-men.png" alt="Made Men" />
          <img src="/logos/rcs2.png" alt="Regal Combat Sports" />
          <img src="/logos/real-fight-promo.png" alt="Real Fight Promotions" />
          <img src="/logos/247-fighting.png" alt="24/7 Fighting" />
          <img src="/logos/toughman.png" alt="Toughman Contest" />
        </div>
      </section>

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowDraftModal(false) }}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>⚡ Enter the Combat Sports Draft</h3>
              <button className="modal-close" onClick={() => setShowDraftModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <iframe
                src="https://site.realfightpromo.com/widget/form/XFHrROVPHixy7rT9kB8x"
                style={{ width: '100%', height: '2100px', border: 'none' }}
                id="inline-XFHrROVPHixy7rT9kB8x"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Fighters DB - Lite"
                data-height="2100"
                data-layout-iframe-id="inline-XFHrROVPHixy7rT9kB8x"
                data-form-id="XFHrROVPHixy7rT9kB8x"
                title="Fighters DB - Lite"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-logo">
          <img src="/logo.jpg" alt="Real Fight Promotions" />
        </div>
        <nav className="footer-links">
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="https://ta.realpromo.io/events">Get Tickets</a>
          <a href="/auth/sign-in">Sign In</a>
        </nav>
        <p className="footer-copy">Copyright 2026 | Real Fight Promotion &nbsp;·&nbsp; Morgantown, WV &nbsp;·&nbsp; info@realpromo.io</p>
      </footer>
    </>
  )
}
