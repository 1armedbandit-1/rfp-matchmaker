'use client'

export default function HomePage() {
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

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
          overflow: hidden;
        }

        #bgVideo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.45) saturate(0.8);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.55) 50%,
            rgba(0,0,0,0.80) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
        }

        .nav-logo {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }

        .nav-logo span { color: #c9a84c; }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
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

        .nav-links a:hover { color: #c9a84c; }

        .eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.4);
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

        .hero h1 .accent { color: #c9a84c; }

        .sub-headline {
          font-size: clamp(20px, 3.5vw, 36px);
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

        .btn-primary {
          background: #c9a84c;
          color: #000;
        }

        .btn-primary:hover {
          background: #e0be6a;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }

        .btn-secondary:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .btn-stream {
          background: rgba(201,168,76,0.12);
          color: #c9a84c;
          border: 2px solid rgba(201,168,76,0.5);
        }

        .btn-stream:hover {
          background: rgba(201,168,76,0.2);
          border-color: #c9a84c;
          transform: translateY(-2px);
        }

        .btn svg { width: 16px; height: 16px; }

        .stats {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          gap: 64px;
          padding: 32px 40px;
          background: rgba(0,0,0,0.55);
          border-top: 1px solid rgba(201,168,76,0.2);
          flex-wrap: wrap;
        }

        .stat { text-align: center; }

        .stat-number {
          font-size: 32px;
          font-weight: 900;
          color: #c9a84c;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-top: 6px;
        }

        .scroll-hint {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: bounce 2s infinite;
        }

        .scroll-hint span {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .scroll-arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid rgba(255,255,255,0.3);
          border-bottom: 2px solid rgba(255,255,255,0.3);
          transform: rotate(45deg);
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        @media (max-width: 640px) {
          nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .stats { gap: 32px; padding: 24px 20px; }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <div className="nav-logo">Real <span>Fight</span> Promotion</div>
        <ul className="nav-links">
          <li><a href="/people">Fighters</a></li>
          <li><a href="https://ta.realpromo.io/events">Events</a></li>
          <li><a href="/match">Matchmaking</a></li>
          <li><a href="https://ta.realpromo.io/events">Stream</a></li>
          <li><a href="/auth/sign-in">Sign In</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <video id="bgVideo" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/4761267/4761267-hd_1920_1080_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/7592578/7592578-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="overlay" />

        <div className="hero-content">
          <div className="eyebrow">▲ Combat Sports Platform</div>

          <h1>Real <span className="accent">Fight</span><br />Promotion</h1>

          <p className="sub-headline">We Help Real Fighters</p>

          <div className="cta-group">
            {/* Matchmaking CTA → sign up */}
            <a href="/auth/sign-up" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Enter Combat Sports Draft
            </a>

            {/* Get Tickets */}
            <a href="https://ta.realpromo.io/events" className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
              Get Tickets
            </a>

            {/* Watch Stream */}
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

      {/* Stats strip */}
      <div className="stats">
        <div className="stat">
          <div className="stat-number">100</div>
          <div className="stat-label">Fighters</div>
        </div>
        <div className="stat">
          <div className="stat-number">20</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat">
          <div className="stat-number">7</div>
          <div className="stat-label">Promotions</div>
        </div>
        <div className="stat">
          <div className="stat-number">50,000</div>
          <div className="stat-label">Fans</div>
        </div>
      </div>
    </>
  )
}
