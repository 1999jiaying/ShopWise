import Nav from '@/components/Nav';

export const metadata = {
  title: 'ShopWise — Pricing',
};

export default function PricingPage() {
  return (
    <>
      <Nav />

      <main className="container">
        <section className="page-head">
          <div className="label">Pricing</div>
          <h1>Simple and transparent</h1>
          <p>Start with a free scan to understand your situation. Pay only when you want the full diagnosis.</p>
        </section>

        <section className="pricing-grid" style={{ paddingBottom: '96px' }}>

          <div className="price-card">
            <div className="plan-name">Free Scan</div>
            <div className="plan-desc">A high-level diagnosis: your market pressure rating, fixability score, and top 3 prioritised actions.</div>
            <div className="plan-price">
              <div className="price-amt">$0</div>
              <div className="price-per">No account required</div>
            </div>
            <ul className="plan-features">
              <li>Market Pressure rating (High / Medium / Low)</li>
              <li>Fixability Score (0–100%)</li>
              <li>3 prioritised actions</li>
              <li>Nearby competitor count</li>
              <li className="dim">Full factor breakdown</li>
              <li className="dim">Competitor benchmarks</li>
              <li className="dim">Strategy recommendation</li>
            </ul>
            <a href="/#analyze" className="btn btn-outline plan-cta">Run Free Scan</a>
          </div>

          <div className="price-card featured">
            <div className="featured-tag">Full analysis</div>
            <div className="plan-name">Diagnosis Report</div>
            <div className="plan-desc">The complete Reality Check — every factor scored, benchmarked against nearby competitors, and explained in plain language.</div>
            <div className="plan-price">
              <div className="price-amt">$29</div>
              <div className="price-per">One-time · no subscription</div>
            </div>
            <ul className="plan-features">
              <li>Everything in Free Scan</li>
              <li>Full controllable factor breakdown</li>
              <li>External pressure analysis</li>
              <li>Competitor benchmark (10+ nearby)</li>
              <li>Strategy recommendation</li>
              <li>PDF export</li>
              <li className="dim">Monthly tracking</li>
            </ul>
            <a href="/#analyze" className="btn btn-primary plan-cta">Get Full Report</a>
          </div>

          <div className="price-card">
            <div className="plan-name">Monthly Monitoring</div>
            <div className="plan-desc">Track how your scores change month by month as you implement improvements and market conditions shift.</div>
            <div className="plan-price">
              <div className="price-amt">$49</div>
              <div className="price-per">Per month · cancel anytime</div>
            </div>
            <ul className="plan-features">
              <li>Everything in Diagnosis Report</li>
              <li>Fresh report each month</li>
              <li>Score change tracking</li>
              <li>New competitor alerts</li>
              <li>Market condition updates</li>
              <li>Unlimited PDF exports</li>
              <li>Priority support</li>
            </ul>
            <a href="/#analyze" className="btn btn-outline plan-cta">Start Monitoring</a>
          </div>

        </section>

        <section className="faq">
          <div className="label">Common questions</div>
          <h2>What you should know</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How accurate is the diagnosis?</h3>
              <p>The report is based on public data signals, your inputs, and algorithmic benchmarking. It is a structured starting point, not a definitive audit. It is most accurate when you provide your Google rating, review count, and area.</p>
            </div>
            <div className="faq-item">
              <h3>What does &ldquo;Fixability Score&rdquo; mean exactly?</h3>
              <p>It estimates the proportion of your business challenges that appear addressable through your own actions — as opposed to structural market conditions. A score of 60% means roughly 60% of the identified issues are in your hands.</p>
            </div>
            <div className="faq-item">
              <h3>Is this just marketing advice?</h3>
              <p>No. ShopWise explicitly separates marketing and operational factors from external structural pressures like competition density, local demand, and cost environment. The goal is an honest picture, not a sales pitch for more marketing spend.</p>
            </div>
            <div className="faq-item">
              <h3>Do I need an account?</h3>
              <p>Not for the free scan. The full Diagnosis Report and Monthly Monitoring plans require a basic account to store and track your results over time.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
