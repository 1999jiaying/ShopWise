import { buildShopData } from '@/lib/shopData';
import SidebarWrapper from '@/components/sample/SidebarWrapper';

interface PageProps {
  params: { section?: string[] };
  searchParams: { name?: string; category?: string; address?: string; rating?: string; reviews?: string };
}

function getBarFillClass(score: number): string {
  if (score >= 70) return 'bar-fill-ok';
  if (score >= 50) return 'bar-fill-normal';
  if (score >= 35) return 'bar-fill-weak';
  return 'bar-fill-poor';
}

function getControllableIcon(score: number): string {
  if (score >= 70) return '✅';
  if (score >= 50) return '⚠️';
  return '🔴';
}

export default function SamplePage({ params, searchParams }: PageProps) {
  const currentSection = params.section?.[0] ?? 'overview';
  const shopData = buildShopData(searchParams, currentSection);

  // Build query string to persist across sidebar navigation
  const qsParts: string[] = [];
  if (searchParams.name)     qsParts.push(`name=${encodeURIComponent(searchParams.name)}`);
  if (searchParams.category) qsParts.push(`category=${encodeURIComponent(searchParams.category)}`);
  if (searchParams.address)  qsParts.push(`address=${encodeURIComponent(searchParams.address)}`);
  if (searchParams.rating)   qsParts.push(`rating=${encodeURIComponent(searchParams.rating)}`);
  if (searchParams.reviews)  qsParts.push(`reviews=${encodeURIComponent(searchParams.reviews)}`);
  const searchParamsString = qsParts.join('&');

  const rules = [
    {
      condition: 'High external pressure + Low controllable score',
      strategy: 'Market is the main problem. Consider cost control, loyal customer focus, niche repositioning, or relocation.',
      match: shopData.externalPressureScore > 65 && shopData.controllableScore < 50,
    },
    {
      condition: 'Low external pressure + Low controllable score',
      strategy: 'The market is not the main issue. Fix visibility, reviews, menu, website, and positioning first.',
      match: shopData.externalPressureScore <= 65 && shopData.controllableScore < 50,
    },
    {
      condition: 'High external pressure + High controllable score',
      strategy: 'You face both market pressure and internal weaknesses. Focus on the highest-impact controllable fixes first.',
      match: shopData.externalPressureScore > 65 && shopData.controllableScore >= 50,
    },
    {
      condition: 'Low external pressure + High controllable score',
      strategy: 'Situation is relatively healthy. Focus on optimisation and retention.',
      match: shopData.externalPressureScore <= 65 && shopData.controllableScore >= 50,
    },
  ];

  return (
    <SidebarWrapper shopData={shopData} searchParamsString={searchParamsString}>

      {/* ── OVERVIEW ─────────────────────────────────────────────── */}
      {currentSection === 'overview' && (
        <>
          <div className="report-band">
            <div>
              <div className="rb-shop">{shopData.name}</div>
              <div className="rb-meta">{shopData.category} · {shopData.address} · Reality Check Report</div>
            </div>
            <div className="rb-actions">
              <a href="#" className="btn btn-outline">Export PDF</a>
              <a href="/" className="btn btn-primary">Run New Analysis</a>
            </div>
          </div>

          <div className="metrics-row">
            <div className="metric-card">
              <div className="mc-label">Market Pressure</div>
              <div className="mc-value">
                <span className="chip chip-high" style={{ fontSize: '15px', padding: '6px 14px' }}>{shopData.marketPressure}</span>
              </div>
              <div className="mc-note">{shopData.nearbyCompetitorCount} similar competitors within 500m · Local demand {shopData.localDemandTrend.toLowerCase()}</div>
            </div>
            <div className="metric-card">
              <div className="mc-label">Fixability Score</div>
              <div className="dash-fixbar-wrap">
                <span className="dash-fixbar-pct">{shopData.fixabilityScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${shopData.fixabilityScore}%`, height: '100%', background: 'var(--text-1)', borderRadius: '99px' }} />
              </div>
              <div className="mc-note">Around {shopData.fixabilityScore}% of challenges appear actionable through business changes</div>
            </div>
            <div className="metric-card">
              <div className="mc-label">Online Visibility</div>
              <div className="mc-value">
                <span className="chip chip-med" style={{ fontSize: '15px', padding: '6px 14px' }}>{shopData.onlineVisibility}</span>
              </div>
              <div className="mc-note">Below area average for photos, review count, and profile completeness</div>
            </div>
          </div>

          <div className="diagnosis-card">
            <div className="label dc-label">Diagnosis</div>
            <div className="dc-text">&ldquo;{shopData.diagnosis}&rdquo;</div>
          </div>

          <div className="breakdown-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#22C55E' }}>●</span> Controllable Factors
                  </div>
                  <div className="card-sub">Overall score: {shopData.controllableScore} / 100</div>
                </div>
                <a href={`/sample/controllable${searchParamsString ? '?' + searchParamsString : ''}`} className="btn btn-outline" style={{ fontSize: '12px', padding: '7px 12px' }}>Full breakdown →</a>
              </div>
              <div className="card-body" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                {shopData.controllable.map((f) => (
                  <div className="factor-row" key={f.label}>
                    <div>
                      <div className="factor-label">{f.label}</div>
                    </div>
                    <div className="bar-group">
                      <div className="bar">
                        <div className={`bar-fill ${getBarFillClass(f.score)}`} style={{ width: `${f.score}%` }} />
                      </div>
                      <span className="bar-score">{f.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#EF4444' }}>●</span> External Pressures
                  </div>
                  <div className="card-sub">Pressure score: {shopData.externalPressureScore} / 100</div>
                </div>
                <a href={`/sample/external${searchParamsString ? '?' + searchParamsString : ''}`} className="btn btn-outline" style={{ fontSize: '12px', padding: '7px 12px' }}>Full breakdown →</a>
              </div>
              <div className="card-body" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                {shopData.external.map((e) => (
                  <div className="factor-row" key={e.label}>
                    <span className="factor-label">{e.label}</span>
                    <span className={`chip chip-${e.chip}`}>{e.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="strategy-card">
            <div className="strat-arrow">→</div>
            <div>
              <div className="label strat-label">Recommended strategy</div>
              <div className="strat-title">{shopData.strategyLabel}</div>
              <div className="strat-desc">{shopData.strategyDesc}</div>
            </div>
          </div>
        </>
      )}

      {/* ── CONTROLLABLE FACTORS ──────────────────────────────────── */}
      {currentSection === 'controllable' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Controllable Factors</div>
              <div className="card-sub">Overall controllable score: {shopData.controllableScore} / 100 — things you can improve this week</div>
            </div>
          </div>
          <div className="card-body">
            {shopData.controllable.map((f) => (
              <div className="action-item" key={f.label}>
                <div className="action-icon">
                  {getControllableIcon(f.score)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="action-title">{f.label}</div>
                  <div className="action-detail">{f.detail}</div>
                  <div className="action-badges" style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '120px', height: '5px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div className={`bar-fill ${getBarFillClass(f.score)}`} style={{ width: `${f.score}%`, height: '100%' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{f.score}/100</span>
                    </div>
                    {f.priority && <span className="badge high-impact">Priority fix</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EXTERNAL PRESSURES ────────────────────────────────────── */}
      {currentSection === 'external' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">External Pressures</div>
              <div className="card-sub">Pressure score: {shopData.externalPressureScore} / 100 — structural factors outside your control</div>
            </div>
          </div>
          <div className="card-body">
            {shopData.external.map((e) => (
              <div className="action-item" key={e.label}>
                <div className="action-icon">📊</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div className="action-title">{e.label}</div>
                    <div className="action-detail">{e.detail}</div>
                  </div>
                  <span className={`chip chip-${e.chip}`} style={{ flexShrink: 0, marginTop: '2px' }}>{e.level}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)' }}>
              <div className="label" style={{ marginBottom: '8px' }}>What this means</div>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>These are structural conditions acting on your business that cannot be resolved through marketing or operational improvements alone. Understanding them helps you make better decisions about where to invest effort and money — and when to consider different strategies such as cost reduction, repositioning, or focusing on loyal customer retention.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPETITOR BENCHMARK ──────────────────────────────────── */}
      {currentSection === 'benchmark' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Competitor Benchmark</div>
              <div className="card-sub">{shopData.benchmark.nearbyCount} similar businesses within walking distance of {shopData.address}</div>
            </div>
          </div>
          <div className="card-body">
            <div className="bench-grid" style={{ marginBottom: '24px' }}>
              <div className="bench-cell">
                <div className="bench-label">Google Rating</div>
                <div className="bench-you">{shopData.rating} ★</div>
                <div className="bench-avg">Area average: {shopData.benchmark.areaAvgRating} ★</div>
                <span className={`bench-pct ${shopData.benchmark.ratingPercentile >= 50 ? 'pct-ok' : 'pct-med'}`}>
                  Better than {shopData.benchmark.ratingPercentile}% of competitors
                </span>
              </div>
              <div className="bench-cell">
                <div className="bench-label">Review Count</div>
                <div className="bench-you">{shopData.reviews}</div>
                <div className="bench-avg">Area average: {shopData.benchmark.areaAvgReviews}</div>
                <span className="bench-pct pct-weak">
                  More than only {shopData.benchmark.reviewCountPercentile}% of competitors
                </span>
              </div>
              <div className="bench-cell">
                <div className="bench-label">Google Photos</div>
                <div className="bench-you">~3</div>
                <div className="bench-avg">Area average: {shopData.benchmark.areaAvgPhotos}</div>
                <span className="bench-pct pct-weak">
                  More than only {shopData.benchmark.photoPercentile}% of competitors
                </span>
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)' }}>
              <div className="label" style={{ marginBottom: '8px' }}>Key finding</div>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>Your rating is competitive, but your review volume and photo count are well below the area average. These are high-priority controllable improvements — customers and Google&apos;s local algorithm both use them to assess credibility and relevance.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIORITY ACTIONS ──────────────────────────────────────── */}
      {currentSection === 'actions' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Priority Actions</div>
              <div className="card-sub">Ordered by impact vs effort — focus on the top items first</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
            {shopData.actions.map((a, i) => (
              <div className="action-item" key={a.title}>
                <div className="action-icon">{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="action-title">{i + 1}. {a.title}</div>
                  <div className="action-detail">{a.detail}</div>
                  <div className="action-badges">
                    <span className={`badge${a.impact === 'High' ? ' high-impact' : ''}`}>{a.impact} impact</span>
                    <span className="badge">{a.effort} effort</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STRATEGY ─────────────────────────────────────────────── */}
      {currentSection === 'strategy' && (
        <>
          <div className="strategy-card" style={{ flexDirection: 'column', gap: 0 }}>
            <div className="label" style={{ marginBottom: '10px' }}>Recommended strategy</div>
            <div className="strat-title" style={{ fontSize: '20px', marginBottom: '12px' }}>{shopData.strategyLabel}</div>
            <div className="strat-desc" style={{ fontSize: '15px' }}>{shopData.strategyDesc}</div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Strategy decision rules</div></div>
            <div className="card-body">
              {rules.map((r) => (
                <div className="factor-row" key={r.condition} style={{ alignItems: 'flex-start', gap: '16px', padding: '14px 0' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', marginTop: '4px', flexShrink: 0, background: r.match ? '#22C55E' : 'var(--border)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: r.match ? 'var(--text-1)' : 'var(--text-3)', marginBottom: '4px' }}>
                      {r.condition}{r.match ? ' ← Your situation' : ''}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>{r.strategy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── FALLBACK ─────────────────────────────────────────────── */}
      {!['overview', 'controllable', 'external', 'benchmark', 'actions', 'strategy'].includes(currentSection) && (
        <div className="card">
          <div className="stub">
            <strong>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</strong>
            This section will be available in the full report. <a href="/sample" style={{ color: 'var(--text-1)' }}>Go to overview →</a>
          </div>
        </div>
      )}

    </SidebarWrapper>
  );
}
