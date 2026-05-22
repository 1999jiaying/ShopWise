import Nav from '@/components/Nav';
import { analyzeShop } from './actions';

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-orb" aria-hidden="true" />
        <div className="container hero-inner">

          <div>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="label">Local business diagnostics</span>
            </div>
            <h1>Find out what&apos;s fixable —<br /><em>and what&apos;s not.</em></h1>
            <p className="hero-sub">
              ShopWise analyzes local demand, competition, online visibility, and business basics to give small shops an honest diagnosis — not just marketing advice.
            </p>

            <form id="analyze" action={analyzeShop}>
              <div className="hero-form-card">
                <h3>Run a Reality Check</h3>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label" htmlFor="shopName">Business name</label>
                    <input className="form-input" id="shopName" type="text" name="shopName" placeholder="e.g. Golden Bowl Noodles" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="category">Business type</label>
                    <select className="form-input" id="category" name="category">
                      <option value="restaurant">Restaurant</option>
                      <option value="cafe">Café / Coffee</option>
                      <option value="bakery">Bakery</option>
                      <option value="retail">Retail store</option>
                      <option value="bar">Bar / Pub</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label" htmlFor="address">City or neighbourhood</label>
                    <input className="form-input" id="address" type="text" name="address" placeholder="e.g. Financial District, SF" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="rating">
                      Google rating <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <input className="form-input" id="rating" type="number" name="rating" placeholder="e.g. 4.2" min="1" max="5" step="0.1" />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label" htmlFor="reviews">
                      No. of Google reviews <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <input className="form-input" id="reviews" type="number" name="reviews" placeholder="e.g. 89" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="website">
                      Website <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <input className="form-input" id="website" type="url" name="website" placeholder="https://..." />
                  </div>
                </div>
                <div className="form-note">No account or credit card required. We generate a diagnostic report from your inputs and public data signals.</div>
                <button type="submit" className="btn btn-primary form-submit">Run a Reality Check →</button>
              </div>
            </form>
          </div>

          <div className="hero-right">
            <div className="hero-food-badge" aria-hidden="true">🍜</div>
            <div className="hero-food-badge-2" aria-hidden="true">🌿</div>
            <div className="hero-preview">
              <div className="hp-header">
                <div className="hp-eyebrow">Reality Check Report · Sample</div>
                <div className="hp-shop">🍜 Golden Bowl Noodles</div>
                <div className="hp-loc">Restaurant · Financial District, San Francisco</div>
              </div>
              <div className="hp-metrics">
                <div className="hp-row">
                  <span className="hp-row-label">Market Pressure</span>
                  <span className="chip chip-high">High</span>
                </div>
                <div className="hp-row">
                  <span className="hp-row-label">Fixability Score</span>
                  <div className="fixbar-wrap">
                    <div className="fixbar"><div className="fixbar-fill" style={{ width: '58%' }} /></div>
                    <span className="fixbar-pct">58%</span>
                  </div>
                </div>
                <div className="hp-row">
                  <span className="hp-row-label">Competition Saturation</span>
                  <span className="chip chip-high">High</span>
                </div>
                <div className="hp-row">
                  <span className="hp-row-label">Local Demand</span>
                  <span className="chip chip-high">Declining</span>
                </div>
                <div className="hp-row">
                  <span className="hp-row-label">Online Visibility</span>
                  <span className="chip chip-med">Weak</span>
                </div>
              </div>
              <div className="hp-diagnosis">
                <div className="hp-diag-label">Diagnosis</div>
                <div className="hp-diag-text">Around 58% of your challenges appear fixable. The area shows weak demand and high saturation — structural pressures outside your control.</div>
              </div>
              <div className="hp-strategy">
                <div className="hp-strat-label">Recommended strategy</div>
                <div className="hp-strat-value">Fix basics + Differentiate</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PROBLEM ───────────────────────────────────────────────────── */}
      <section className="section problem" id="problem">
        <div className="container">
          <div className="problem-accent-line" />
          <div className="label">The honest problem</div>
          <h2>&ldquo;Improve your SEO.<br />Post more on Instagram.<br />Ask for more reviews.&rdquo;</h2>
          <p className="problem-intro">That&apos;s the advice most tools give. And sometimes it helps. But often the harder truth is weak local demand, too many competitors, or a location that is structurally difficult. Spending on marketing before knowing which problem you have is an expensive guess.</p>
          <div className="problem-grid">
            <div className="problem-cell">
              <div className="pc-icon">📉</div>
              <div className="pc-title">The market may be the problem</div>
              <div className="pc-desc">If demand in your area is declining — due to office vacancies, population shifts, or economic pressure — no amount of marketing will reverse it. Knowing this changes everything.</div>
            </div>
            <div className="problem-cell">
              <div className="pc-icon">🏘️</div>
              <div className="pc-title">Saturation is real</div>
              <div className="pc-desc">Some neighbourhoods have far more restaurants than the area can support. Understanding your competitive density is the starting point, not an afterthought.</div>
            </div>
            <div className="problem-cell">
              <div className="pc-icon">🔧</div>
              <div className="pc-title">Some things are genuinely fixable</div>
              <div className="pc-desc">Your Google profile, review response rate, menu layout, website, and opening hours can all be improved — and they directly affect whether customers find and choose you.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REALITY CHECK ─────────────────────────────────────────────── */}
      <section className="section reality-check" id="reality-check">
        <div className="container">
          <div className="rc-header">
            <div className="rc-label-wrap">
              <span className="rc-label-leaf">✦</span>
              <div className="label">Reality Check</div>
              <span className="rc-label-leaf">✦</span>
            </div>
            <h2 className="section-title">Some problems are fixable.<br />Some are structural.</h2>
            <p className="section-sub">ShopWise separates what you can act on this week from what the market is doing to you.</p>
          </div>
          <div className="rc-columns">
            <div className="rc-col rc-col-left">
              <div className="rc-col-heading"><span className="dot dot-green" />{' '}Things you control</div>
              <div className="rc-item"><div className="rc-icon green">📸</div><div><div className="rc-item-title">Google Maps photos &amp; profile</div><div className="rc-item-desc">Profiles with 10+ photos get significantly more clicks. Adding photos costs nothing and takes an hour.</div></div></div>
              <div className="rc-item"><div className="rc-icon green">⭐</div><div><div className="rc-item-title">Review quality &amp; response rate</div><div className="rc-item-desc">Responding to reviews improves local search ranking and signals trust to potential customers.</div></div></div>
              <div className="rc-item"><div className="rc-icon green">🍽️</div><div><div className="rc-item-title">Menu clarity &amp; structure</div><div className="rc-item-desc">A well-organised menu with clear sections and photos reduces decision fatigue and increases average order value.</div></div></div>
              <div className="rc-item"><div className="rc-icon green">🌐</div><div><div className="rc-item-title">Website &amp; delivery page quality</div><div className="rc-item-desc">Missing opening hours, no order button, or slow mobile load all push customers to competitors.</div></div></div>
              <div className="rc-item"><div className="rc-icon green">🎯</div><div><div className="rc-item-title">Positioning &amp; differentiation</div><div className="rc-item-desc">A clear reason to choose you over the restaurant next door can be defined and communicated.</div></div></div>
            </div>
            <div className="rc-col rc-col-right">
              <div className="rc-col-heading"><span className="dot dot-dark" />{' '}Things the market controls</div>
              <div className="rc-item"><div className="rc-icon neutral">📊</div><div><div className="rc-item-title">Local spending power &amp; confidence</div><div className="rc-item-desc">Economic downturns and rising costs reduce how often people dine out. This is not something you can market your way out of.</div></div></div>
              <div className="rc-item"><div className="rc-icon neutral">🏘️</div><div><div className="rc-item-title">Number of nearby competitors</div><div className="rc-item-desc">If 14 similar restaurants are within 500m, your share of a fixed pool of customers is structurally constrained.</div></div></div>
              <div className="rc-item"><div className="rc-icon neutral">🚶</div><div><div className="rc-item-title">Area foot traffic</div><div className="rc-item-desc">Office vacancies, construction, or neighbourhood decline reduce the number of people walking past your door each day.</div></div></div>
              <div className="rc-item"><div className="rc-icon neutral">📅</div><div><div className="rc-item-title">Tourism seasonality</div><div className="rc-item-desc">Tourist-dependent areas see sharp demand swings that no amount of marketing can fully offset in low season.</div></div></div>
              <div className="rc-item"><div className="rc-icon neutral">💸</div><div><div className="rc-item-title">Rent, ingredient &amp; energy costs</div><div className="rc-item-desc">External cost pressure squeezes margins regardless of how well you market or how good your food is.</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SAMPLE REPORT ─────────────────────────────────────────────── */}
      <section className="section sample-report" id="sample">
        <div className="container">
          <div className="sr-header">
            <div className="label">Sample diagnostic report</div>
            <div className="sr-title">What an honest diagnosis looks like</div>
            <p className="sr-sub">Not generic tips — a specific assessment of what&apos;s fixable and what is structural market pressure.</p>
          </div>
          <div className="report-card">
            <div className="report-top">
              <div>
                <div className="report-shop">🍜 Golden Bowl Noodles</div>
                <div className="report-meta">Restaurant · Financial District, San Francisco · Diagnostic report · May 2026</div>
              </div>
              <a href="/sample" className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px', flexShrink: 0 }}>View full report →</a>
            </div>
            <div className="report-scores">
              <div className="rs-cell">
                <div className="rs-label">Market Pressure</div>
                <div className="rs-value"><span className="chip chip-high" style={{ fontSize: '14px', padding: '5px 12px' }}>High</span></div>
                <div className="rs-note">14 similar restaurants within 500m · Office vacancy ~28%</div>
              </div>
              <div className="rs-cell">
                <div className="rs-label">Fixability Score</div>
                <div className="rs-value" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>58%</div>
                <div className="rs-note">Around 58% of challenges appear actionable through business changes</div>
              </div>
              <div className="rs-cell">
                <div className="rs-label">Online Visibility</div>
                <div className="rs-value"><span className="chip chip-med" style={{ fontSize: '14px', padding: '5px 12px' }}>Weak</span></div>
                <div className="rs-note">3 photos · fewer reviews than 78% of nearby competitors</div>
              </div>
            </div>
            <div className="report-diagnosis">
              <div className="rd-label">Diagnosis</div>
              <div className="rd-text">&ldquo;Your business may not be struggling only because of poor marketing. The Financial District area shows declining lunch foot traffic and high restaurant saturation — these are structural pressures outside your control. However, your Google visibility, review count, and menu clarity are all meaningfully below the area average and are fixable within weeks.&rdquo;</div>
            </div>
            <div className="report-breakdown">
              <div className="rb-col">
                <div className="rb-heading"><span style={{ color: 'var(--sage)' }}>●</span> Controllable factors</div>
                <div className="rb-row"><span className="rb-row-label">Google Visibility</span><div className="rb-bar-group"><div className="rb-bar"><div className="rb-bar-fill" style={{ width: '30%' }} /></div><span className="rb-score">30</span></div></div>
                <div className="rb-row"><span className="rb-row-label">Review Health</span><div className="rb-bar-group"><div className="rb-bar"><div className="rb-bar-fill" style={{ width: '55%' }} /></div><span className="rb-score">55</span></div></div>
                <div className="rb-row"><span className="rb-row-label">Menu Clarity</span><div className="rb-bar-group"><div className="rb-bar"><div className="rb-bar-fill" style={{ width: '40%' }} /></div><span className="rb-score">40</span></div></div>
                <div className="rb-row"><span className="rb-row-label">Website Quality</span><div className="rb-bar-group"><div className="rb-bar"><div className="rb-bar-fill" style={{ width: '35%' }} /></div><span className="rb-score">35</span></div></div>
                <div className="rb-row"><span className="rb-row-label">Social Presence</span><div className="rb-bar-group"><div className="rb-bar"><div className="rb-bar-fill" style={{ width: '20%' }} /></div><span className="rb-score">20</span></div></div>
              </div>
              <div className="rb-col">
                <div className="rb-heading"><span style={{ color: 'var(--text-3)' }}>●</span> External pressures</div>
                <div className="rb-row"><span className="rb-row-label">Competition Density</span><span className="chip chip-high">High</span></div>
                <div className="rb-row"><span className="rb-row-label">Local Demand</span><span className="chip chip-high">Declining</span></div>
                <div className="rb-row"><span className="rb-row-label">Consumer Spending</span><span className="chip chip-med">Pressured</span></div>
                <div className="rb-row"><span className="rb-row-label">Foot Traffic</span><span className="chip chip-med">Below avg</span></div>
                <div className="rb-row"><span className="rb-row-label">Cost Environment</span><span className="chip chip-high">High</span></div>
              </div>
            </div>
            <div className="report-strategy">
              <div style={{ fontSize: '20px', flexShrink: 0, paddingTop: '2px', color: 'var(--sage)' }}>→</div>
              <div>
                <div className="rstr-label">Recommended strategy</div>
                <div className="rstr-title">Fix basics + Differentiate</div>
                <div className="rstr-desc">Your execution has clear, fixable gaps — but the market is also working against you. Improving visibility and menu basics could meaningfully help. Long-term, plan for loyal customer retention and a distinct positioning to survive the area&apos;s high saturation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALGORITHM EXPLAINER ───────────────────────────────────────── */}
      <section className="section algorithm" id="how">
        <div className="container">
          <div className="alg-header">
            <div className="label">How it works</div>
            <h2 className="section-title">Four analyses. One honest score.</h2>
            <p className="section-sub">We combine public signals, competitor comparison, and your inputs to separate what&apos;s fixable from what&apos;s structural.</p>
          </div>
          <div className="alg-grid">
            <div className="alg-card"><div className="alg-num">1</div><div className="alg-title">Controllable Score</div><div className="alg-desc">We score how well your business executes on the factors you can actually change — visibility, reviews, menu, website, and positioning.</div><div className="alg-tags"><span className="alg-tag">Google photos</span><span className="alg-tag">Review count</span><span className="alg-tag">Menu clarity</span><span className="alg-tag">Website</span></div></div>
            <div className="alg-card"><div className="alg-num">2</div><div className="alg-title">External Pressure Score</div><div className="alg-desc">We estimate the structural market pressure acting on your business — competitor density, local demand signals, consumer spending, and cost levels.</div><div className="alg-tags"><span className="alg-tag">Nearby competitors</span><span className="alg-tag">Foot traffic</span><span className="alg-tag">Local demand</span><span className="alg-tag">Cost pressure</span></div></div>
            <div className="alg-card"><div className="alg-num">3</div><div className="alg-title">Fixability Score</div><div className="alg-desc">We calculate what proportion of your challenges appear fixable through business actions, versus structural market conditions outside your control.</div><div className="alg-tags"><span className="alg-tag">Controllable ÷ Total</span><span className="alg-tag">Weighted formula</span><span className="alg-tag">Displayed as %</span></div></div>
            <div className="alg-card"><div className="alg-num">4</div><div className="alg-title">Competitor Benchmark</div><div className="alg-desc">We compare your visibility, review count, rating, and online presence against similar businesses within walking distance of your location.</div><div className="alg-tags"><span className="alg-tag">Rating percentile</span><span className="alg-tag">Review volume</span><span className="alg-tag">Photo count</span><span className="alg-tag">Category match</span></div></div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────────────── */}
      <section className="section pricing" id="pricing">
        <div className="container">
          <div className="pricing-header">
            <div className="label">Pricing</div>
            <h2 className="section-title">Simple and transparent</h2>
            <p className="section-sub">Start with a free scan. Pay only when you want the full analysis.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="plan-name">Free Scan</div>
              <div className="plan-desc">A high-level diagnosis: market pressure rating, fixability score, and your top 3 prioritised actions.</div>
              <div className="plan-price"><div className="price-amt">$0</div><div className="price-per">No account required</div></div>
              <ul className="plan-features">
                <li>Market Pressure rating</li><li>Fixability Score</li><li>3 prioritised actions</li><li>Nearby competitor count</li>
                <li className="dim">Full factor breakdown</li><li className="dim">Competitor benchmarks</li><li className="dim">Strategy recommendation</li>
              </ul>
              <a href="/#analyze" className="btn btn-outline plan-cta">Run Free Scan</a>
            </div>
            <div className="price-card featured">
              <div className="featured-tag">Full analysis</div>
              <div className="plan-name">Diagnosis Report</div>
              <div className="plan-desc">The complete Reality Check — every factor scored, benchmarked, and explained in plain language.</div>
              <div className="plan-price"><div className="price-amt">$29</div><div className="price-per">One-time · no subscription</div></div>
              <ul className="plan-features">
                <li>Everything in Free Scan</li><li>Full controllable factor breakdown</li><li>External pressure analysis</li>
                <li>Competitor benchmark (10+ nearby)</li><li>Strategy recommendation</li><li>PDF export</li>
                <li className="dim">Monthly tracking</li>
              </ul>
              <a href="/#analyze" className="btn btn-primary plan-cta">Get Full Report</a>
            </div>
            <div className="price-card">
              <div className="plan-name">Monthly Monitoring</div>
              <div className="plan-desc">Track how your scores change month by month as you implement improvements and conditions shift.</div>
              <div className="plan-price"><div className="price-amt">$49</div><div className="price-per">Per month · cancel anytime</div></div>
              <ul className="plan-features">
                <li>Everything in Diagnosis Report</li><li>Fresh report each month</li><li>Score change tracking</li>
                <li>New competitor alerts</li><li>Market condition updates</li><li>Unlimited PDF exports</li><li>Priority support</li>
              </ul>
              <a href="/#analyze" className="btn btn-outline plan-cta">Start Monitoring</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <span className="label">Honest · Practical · Free to start</span>
          <h2 className="section-title" style={{ color: '#fff', marginTop: '18px' }}>Get a diagnosis before spending<br />more money on marketing.</h2>
          <p>Most small businesses spend on ads and promotions before understanding what is actually holding them back. ShopWise tells you what to fix first — and what to stop worrying about.</p>
          <div className="cta-actions">
            <a href="/#analyze" className="btn btn-white btn-lg">Run a Reality Check →</a>
            <a href="/sample" className="btn btn-ghost-white btn-lg">View sample report</a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Shop<span>Wise</span></div>
              <p className="footer-desc">Honest business diagnostics for local restaurants, cafés, and independent shops. Built to separate what&apos;s fixable from what&apos;s structural.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="/sample">Sample report</a></li>
                <li><a href="/pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom"><span>© 2026 ShopWise · All rights reserved</span></div>
        </div>
      </footer>
    </>
  );
}
