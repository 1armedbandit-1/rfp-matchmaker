'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [showFeatureModal, setShowFeatureModal] = useState(false)
  const [showPromoterModal, setShowPromoterModal] = useState(false)

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
        window.location.href = 'https://realfightpromo.com'
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

        .cta-group-small {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: 14px;
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

        .btn-sm { font-size: 11px; padding: 12px 24px; font-weight: 700; letter-spacing: 0.08em; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-sm-ticket { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        .btn-sm-ticket:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
        .btn-sm-stream { background: rgba(220,38,38,0.1); color: #ef4444; border: 1px solid rgba(220,38,38,0.35); }
        .btn-sm-stream:hover { background: rgba(220,38,38,0.2); transform: translateY(-2px); }

        /* ── Promo Band ── */
        .promo-band {
          position: relative;
          overflow: hidden;
          padding: 100px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .promo-band-video {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.3) saturate(0.7);
        }
        .promo-band-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.65) 100%);
          z-index: 1;
        }
        .promo-band-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }
        .promo-band-headline {
          font-size: clamp(36px, 6vw, 80px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #dc2626;
          margin-bottom: 24px;
        }
        .promo-band-sub {
          font-size: clamp(14px, 2vw, 20px);
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        /* ── Founder Story ── */
        .founder-section {
          padding: 80px 40px;
          background: #0a0a0a;
          border-top: 1px solid rgba(220,38,38,0.15);
        }
        .founder-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .founder-photo-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .founder-side-photo {
          width: 28%;
          height: 210px;
          object-fit: cover;
          object-position: center;
          flex-shrink: 0;
          border-radius: 8px;
          border: 2px solid rgba(220,38,38,0.25);
          filter: grayscale(15%);
          display: block;
        }
        .founder-main-photo-wrap {
          flex: 1;
          min-width: 0;
          position: relative;
        }
        .founder-main-photo-wrap img {
          width: 100%;
          display: block;
          border-radius: 8px;
          border: 2px solid rgba(220,38,38,0.25);
          filter: grayscale(15%);
        }
        .founder-photo-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 14px 18px;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
          border-radius: 0 0 8px 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #dc2626;
        }
        .founder-story {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .founder-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #dc2626;
        }
        .founder-story h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #fff;
        }
        .founder-story h2 span { color: #dc2626; }
        .founder-quote {
          font-size: 17px;
          line-height: 1.75;
          color: rgba(255,255,255,0.75);
          border-left: 3px solid #dc2626;
          padding-left: 20px;
          font-style: italic;
        }
        .founder-sig {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.05em;
        }
        @media (max-width: 768px) {
          .founder-inner { grid-template-columns: 1fr; gap: 40px; }
          .founder-photo-row { max-width: 400px; margin: 0 auto; }
          .founder-side-photo { height: 130px; }
        }

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
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
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
        .feature-number { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: #dc2626; text-transform: uppercase; margin-bottom: 8px; }

        .feature-request-wrap { text-align: center; margin-top: 48px; }
        .feature-request-wrap p { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
        .btn-feature-request {
          background: transparent;
          border: 2px solid #dc2626;
          color: #dc2626;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-feature-request:hover { background: #dc2626; color: #fff; }

        /* ── Feature Request Modal ── */
        .fr-modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .fr-modal-box {
          background: #141414;
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 16px;
          padding: 40px;
          width: 100%; max-width: 520px;
          position: relative;
          margin: auto;
        }
        .fr-modal-box h3 { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
        .fr-modal-box p { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 28px; }
        .fr-field { margin-bottom: 18px; }
        .fr-field label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .fr-field input, .fr-field textarea {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 12px 16px;
          color: #fff; font-size: 15px;
          outline: none; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .fr-field input:focus, .fr-field textarea:focus { border-color: #dc2626; }
        .fr-field textarea { height: 120px; resize: vertical; }
        .fr-submit {
          width: 100%; background: #dc2626; color: #fff;
          border: none; border-radius: 8px; padding: 14px;
          font-size: 14px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.2s;
        }
        .fr-submit:hover { background: #b91c1c; }
        .fr-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; color: rgba(255,255,255,0.4);
          font-size: 24px; cursor: pointer; line-height: 1;
        }
        .fr-success { text-align: center; padding: 20px 0; }
        .fr-success .fr-check { font-size: 48px; margin-bottom: 16px; }
        .fr-success h4 { font-size: 20px; font-weight: 900; margin-bottom: 8px; }
        .fr-success p { font-size: 14px; color: rgba(255,255,255,0.5); }

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
          <li><a href="https://realfightpromo.com" className="sign-in" target="_blank" rel="noopener noreferrer">Sign In</a></li>
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
          <p className="sub-headline">We Help Real Fighters &amp; Promoters</p>

          <div className="cta-group">
            <button onClick={() => setShowDraftModal(true)} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Click Here to Get Matched for Fights
            </button>
            <button onClick={() => setShowPromoterModal(true)} className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
              Get E-Tickets For Your Show
            </button>
            <button onClick={() => setShowPromoterModal(true)} className="btn btn-stream">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Get Stream For Your Show
            </button>
          </div>

          <div className="cta-group-small">
            <a href="https://realfightpromo.com" target="_blank" rel="noopener noreferrer" className="btn-sm btn-sm-ticket">
              🎟️ Buy Tickets for Event
            </a>
            <a href="https://realfightpromo.com" className="btn-sm btn-sm-stream" target="_blank" rel="noopener noreferrer">
              ▶ Video Stream For Event
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

      {/* Promo Band */}
      <section className="promo-band">
        <video className="promo-band-video" autoPlay muted loop playsInline>
          <source src="/promo-band.mp4" type="video/mp4" />
        </video>
        <div className="promo-band-overlay" />
        <div className="promo-band-content">
          <h2 className="promo-band-headline">We Bring Tickets &amp; Stream<br />Under Your Roof<br />No More Middleman</h2>
          <p className="promo-band-sub">Built for the Combat Sports Industry</p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="founder-section">
        <div className="founder-inner">
          <div className="founder-photo-row">
            <img className="founder-side-photo" src="/eric-left.JPG" alt="Eric Watkins in action" />
            <div className="founder-main-photo-wrap">
              <img src="/eric-story.jpg" alt="Eric 'the 1 Armed Bandit' Watkins with champion" />
              <div className="founder-photo-caption">Eric &quot;the 1 Armed Bandit&quot; Watkins</div>
            </div>
            <img className="founder-side-photo" src="/eric-right.jpg" alt="Eric Watkins in the ring" />
          </div>
          <div className="founder-story">
            <div className="founder-eyebrow">Why We Built This</div>
            <h2>From <span>Broke Fighter</span> to<br />Boxing Promoter</h2>
            <p className="founder-quote">
              I started as a broke fighter right here in Morgantown, WV. To add insult to injury
              — literally — I broke my arm in my very first fight at this arena. That&apos;s where
              the nickname came from. I&apos;ve made $700. $400 guaranteed plus ticket sales
              commission. 24 amateur fights. 24 pro fights. Went from this building to Las Vegas
              twice, Madison Square Garden, Turning Stone, Foxwoods — and ended my career against
              the GOAT, Roy Jones Jr. Along the way I learned how to sell tickets, build a network,
              and make it happen. During COVID I started my own promotion. We&apos;ve put on 11
              successful fight nights right here in good ol&apos; Morgantown. Then I went into
              tech and kept thinking: I&apos;d rather help fighters and promoters — because
              I&nbsp;<em>am</em>&nbsp;you. Boxing changed my life. I want it to change yours too.
            </p>
            <div className="founder-sig">— Eric &quot;the 1 Armed Bandit&quot; Watkins · Founder, Real Fight Promotions</div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="features-section">
        <h2>Everything You Need to <span className="accent">Run the Show</span></h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">🎟️</div>
            <h3>Ticketing — Fully Under Your Roof</h3>
            <p>Professional e-tickets, great rates, and you control the fees. Custom seating charts, door scanner tool, and confirmation emails — all branded to you. No Ticketmaster. No middleman.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">🧠</div>
            <h3>Complete Internal Operating System</h3>
            <p>Tickets. SMS & email marketing. Website builder. Social media posting. AI integrations. Facebook & Google Ads. CRM pipeline. Automation workflows. Event check-in. Revenue reporting. Gate tracking. Vendor coordination. Fighter management. One super-tool — built to do as much as possible so you can focus on putting on the show.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">🥊</div>
            <h3>AI Fight Matchmaking</h3>
            <p>Stop making phone calls nobody answers. Our AI matchmaking system connects promoters with fighters and fighters with opponents — based on record, weight class, location, and availability. Get the matches you need, fast.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>
            <div className="feature-icon">🌐</div>
            <h3>Websites for You & Your Fighters</h3>
            <p>Get a professional website for your promotion and your fighters — without hiring a developer. Built-in fight records, event pages, ticket links, and bios. Your brand, your platform.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">05</div>
            <div className="feature-icon">📺</div>
            <h3>PPV Streaming — No Middleman</h3>
            <p>Sell your own pay-per-view stream at your price. Keep the revenue. Broadcast your fight night live directly to fans through your own branded channel. Just like tickets — all under your roof.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">06</div>
            <div className="feature-icon">📲</div>
            <h3>SMS & Email Marketing</h3>
            <p>Reach your fans where they actually look. Send fight night reminders, ticket drops, and event announcements via text and email. Built-in tools, no third-party subscriptions required.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">07</div>
            <div className="feature-icon">📣</div>
            <h3>Ads for Your Fight or Gym</h3>
            <p>Get your event or gym in front of the right audience. Run targeted digital ads without needing an agency. Promote your next card, sell more tickets, and grow your following — on your budget.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">08</div>
            <div className="feature-icon">📅</div>
            <h3>Social Media Planner & Templates</h3>
            <p>Schedule your fight promotion content weeks in advance. Built-in templates for countdowns, fighter spotlights, and event announcements — ready to post across Instagram, Facebook, and X.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">09</div>
            <div className="feature-icon">🎨</div>
            <h3>Fight Poster Templates & White Label Design</h3>
            <p>Professional graphic templates for fight posters, flyers, and promo cards — fully customizable with your fighters, logos, and colors. White label design available for promotions that want a custom look.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">10</div>
            <div className="feature-icon">👕</div>
            <h3>Merchandise for You & Your Fighters</h3>
            <p>Sell branded merch directly to your fans — shirts, hats, shorts, and more. Set your prices, we handle fulfillment. Your fighters can have their own store. Another revenue stream, zero hassle.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">11</div>
            <div className="feature-icon">⚙️</div>
            <h3>Complete Customization</h3>
            <p>Every tool, every page, every fee — customizable to your promotion. No two fight nights are the same. Our platform bends to how you run your show, not the other way around.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">12</div>
            <div className="feature-icon">✍️</div>
            <h3>Automated Contracts</h3>
            <p>Getting a signature used to be a nightmare. Now send fighter contracts, get them signed digitally, and store everything automatically. No more chasing people down. No more paperwork piles.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">13</div>
            <div className="feature-icon">🔌</div>
            <h3>Open API</h3>
            <p>Already using other tools? Connect them. Our open API lets developers and tech-savvy promoters plug our platform into any existing system — CRM, accounting, analytics, whatever you need.</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">14</div>
            <div className="feature-icon">🔗</div>
            <h3>Connect to Any System via Webhooks</h3>
            <p>We will connect to your existing CRM, software, or workflow via our Open API and webhooks. If you use it, we can work with it. We're built to plug into your world — not replace it.</p>
          </div>

        </div>

        <div className="feature-request-wrap">
          <p>Don&apos;t see what you need? Tell us — we build what the fight game needs.</p>
          <button className="btn-feature-request" onClick={() => setShowFeatureModal(true)}>
            🚀 Submit a Feature Request
          </button>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <h2>Ready to Enter the Draft?</h2>
        <p>Join the platform that connects every corner of the combat sports world.</p>

        <div className="cta-group" style={{marginTop: '16px', justifyContent: 'center'}}>
          <button onClick={() => setShowDraftModal(true)} className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Click Here to Get Matched for Fights
          </button>
          <button onClick={() => setShowPromoterModal(true)} className="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
            </svg>
            Get E-Tickets For Your Show
          </button>
          <button onClick={() => setShowPromoterModal(true)} className="btn btn-stream">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Get Stream For Your Show
          </button>
        </div>

        <div className="cta-group-small" style={{marginTop: '16px', justifyContent: 'center'}}>
          <button onClick={() => setShowPromoterModal(true)} className="btn-sm btn-sm-ticket">
            🎟️ Buy Tickets for Event
          </button>
          <button onClick={() => setShowPromoterModal(true)} className="btn-sm btn-sm-stream">
            ▶ Video Stream For Event
          </button>
        </div>
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

      {/* Promoter / Tickets & Stream Modal */}
      {showPromoterModal && (
        <div className="fr-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowPromoterModal(false); }}>
          <div className="fr-modal-box" style={{maxWidth: '600px'}}>
            <button className="fr-close" onClick={() => setShowPromoterModal(false)}>✕</button>
            <h3>🎟️ Get Tickets &amp; Stream For Your Show</h3>
            <p>Fill out the form below and we&apos;ll get your ticketing and stream set up under your roof.</p>
            <iframe
              src="https://site.realfightpromo.com/widget/form/s1y3dMvmLtoygJ8iY9qg"
              style={{ width: '100%', height: '1028px', border: 'none', borderRadius: '3px' }}
              id="inline-s1y3dMvmLtoygJ8iY9qg"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Promoter/Matchmaker DB-Lite"
              data-height="1028"
              data-layout-iframe-id="inline-s1y3dMvmLtoygJ8iY9qg"
              data-form-id="s1y3dMvmLtoygJ8iY9qg"
              title="Promoter/Matchmaker DB-Lite"
            />
          </div>
        </div>
      )}

      {/* Feature Request Modal */}
      {showFeatureModal && (
        <div className="fr-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowFeatureModal(false); }}>
          <div className="fr-modal-box">
            <button className="fr-close" onClick={() => setShowFeatureModal(false)}>✕</button>
            <h3>🚀 Request a Feature</h3>
            <p>Got an idea that would make your promotion run better? Tell us — we build what the fight game needs.</p>
            <iframe
              src="https://site.realfightpromo.com/widget/form/OgtwhUkhJxk5QujlpgaH"
              style={{ width: '100%', height: '958px', border: 'none', borderRadius: '3px' }}
              id="inline-OgtwhUkhJxk5QujlpgaH"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Feature Request"
              data-height="958"
              data-layout-iframe-id="inline-OgtwhUkhJxk5QujlpgaH"
              data-form-id="OgtwhUkhJxk5QujlpgaH"
              title="Feature Request"
            />
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
          <a href="https://realfightpromo.com" target="_blank" rel="noopener noreferrer">Sign In</a>
        </nav>
        <p className="footer-copy">Copyright 2026 | Real Fight Promotion &nbsp;·&nbsp; Morgantown, WV &nbsp;·&nbsp; info@realpromo.io</p>
      </footer>
    </>
  )
}
