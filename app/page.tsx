import Link from 'next/link';
import React from 'react';
import Nav from '@/components/Nav';

export default function HomePage() {
  const agents = [
    {
      time: '07:00',
      num: '1',
      title: 'Demand Planning',
      desc: "Agent 1 reads your POS history, checks today's weather, and calculates exactly how much to order — no guessing, no over-buying.",
    },
    {
      time: 'Morning',
      num: '2',
      title: 'Smart Sourcing',
      desc: 'Agent 2 prices your approved basket across your wholesale suppliers and places the order automatically — always cheapest, always on time.',
    },
    {
      time: '14:00',
      num: '3',
      title: 'Surplus Rescue',
      desc: 'After lunch service, Agent 3 scans leftover inventory and routes it: high-margin items to ResQ Club, bulk surplus to a local shelter.',
    },
  ];

  const flowSteps = ['07:00 Intake', 'Supplier pick', '14:00 Rescue', 'Impact'];

  return (
    <div>
      <Nav />
      <main>
        {/* ── Hero ── */}
        <section className="hero-landing">
          <div className="hero-ingredients" aria-hidden="true">
            🍅🥬🐟🥔🧅🌾🧄🥕🍋🫑🧈🍄🥦🌶️🫒🍞🐟🥬🍅🥔🌾🧅🥕🍋🧄🫑🥦🍄🧈🌶️🫒🍞🍅🐟🥬
          </div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-tag">3 agents · zero data entry</div>
            <h1>
              Stop throwing<br />
              <em>food away.</em>
            </h1>
            <p className="hero-sub">
              Every restaurant loses 8–10% of revenue to food waste. Sesonki.AI runs three AI agents
              through your day — ordering right in the morning, sourcing cheapest at delivery, and
              rescuing every gram of surplus by afternoon.
            </p>
            <div className="hero-actions">
              <Link href="/planner" className="btn-primary">Start today&apos;s planner →</Link>
              <a href="#how-it-works" className="btn-ghost">How it works ↓</a>
            </div>

            <div className="stats-bar">
              {[
                { k: 'Restaurant revenue lost to food waste', v: '8–10%' },
                { k: 'Avg monthly savings with AI planning', v: '€2,500+' },
                { k: 'Staff time per full daily cycle', v: '≈12 sec' },
              ].map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-label">{s.k}</div>
                  <div className="stat-value">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="how-section">
          <div className="container">
            <span className="how-label">A closed loop, from order to impact</span>
            <h2>
              Three agents. One goal:<br />
              <em>zero waste.</em>
            </h2>
            <p className="section-sub">
              The agents share context — what gets cut at 07:00 shapes what gets rescued at 14:00.
              No spreadsheets, no data entry.
            </p>

            <div className="flow-rail">
              {flowSteps.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="flow-step">{s}</div>
                  {i < flowSteps.length - 1 && <span className="flow-sep">→</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="agent-grid">
              {agents.map((a) => (
                <div key={a.num} className="agent-card">
                  <div className="agent-time">{a.time}</div>
                  <div className="agent-num">{a.num}</div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2>Start your day differently.</h2>
            <p>
              No forms to fill. No complex setup. Tell the agents about your kitchen and let
              them run the day.
            </p>
            <Link href="/planner" className="btn-paper">Open the planner →</Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer>
          <div className="container">
            <div className="footer-inner">
              <div className="footer-brand">Sesonki<span>.AI</span></div>
              <div className="footer-copy">© 2026 Sesonki.AI · Anti-food-waste AI for restaurants</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
