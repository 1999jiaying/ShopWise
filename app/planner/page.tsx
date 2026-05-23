'use client';

import { useState, useEffect } from 'react';
import React from 'react';

// ── Color tokens ─────────────────────────────────────────────
const FOREST = '#2d4a34';
const PINE   = '#3a7a4e';
const PAPER  = '#f7f0e3';
const AMBER  = '#d4761e';
const TOMATO = '#b5402e';
const INK    = '#2a221c';

// ── Types ─────────────────────────────────────────────────────
type OrderItem  = { name: string; icon: string; base: number; suggested: number; unit: string };
type OrderData  = { headline: string; reasoning: string; items: OrderItem[] };
type SurplusItem = { name: string; icon: string; qty: string; risk: string };
type RescueData = { surplus: SurplusItem[]; resq: string; shelter: string };

// ── Fallback scripted data ─────────────────────────────────────
const FALLBACK_ORDER: OrderData = {
  headline: 'Slow day ahead — trim perishables, keep the core menu lean.',
  reasoning:
    "Today's conditions suggest lower-than-average foot traffic. Historically these patterns reduce walk-in customers by 30–38%. Trimming fresh proteins and leafy greens by ~25% protects against spoilage while keeping dinner service fully stocked.",
  items: [
    { name: 'Fresh Salmon',        icon: '🐟', base: 12, suggested: 8,  unit: 'kg' },
    { name: 'Mixed Salad Greens',  icon: '🥬', base: 6,  suggested: 4,  unit: 'kg' },
    { name: 'Potatoes',            icon: '🥔', base: 20, suggested: 20, unit: 'kg' },
    { name: 'Heavy Cream',         icon: '🧈', base: 8,  suggested: 6,  unit: 'L'  },
    { name: 'Artisan Bread Dough', icon: '🌾', base: 15, suggested: 12, unit: 'kg' },
  ],
};

const FALLBACK_SUPPLIERS = [
  { name: 'Metro Cash & Carry',  total: 198.5, eta: 'Next-day 07:00', note: 'Bulk discount on proteins active'  },
  { name: 'Local Farm Direct',   total: 214.2, eta: 'Same-day 15:00', note: 'Premium freshness, faster delivery' },
];

const FALLBACK_RESCUE: RescueData = {
  surplus: [
    { name: 'Lunch roast chicken',    icon: '🍗', qty: '5.8 kg', risk: 'Expires 21:00'    },
    { name: "Chef's cream soup",       icon: '🍲', qty: '9 L',    risk: 'Expires 20:00'    },
    { name: 'Sourdough rolls',         icon: '🥖', qty: '36 pcs', risk: 'Day-old at close' },
  ],
  resq: "ResQ Club listing — 'Chef's Lunch Box €4.90': roast chicken + cream soup + fresh sourdough roll. 16 portions for pickup 17:30–19:00. Auto-priced at 50% off to clear before close.",
  shelter:
    "Hello,\n\nWe have approximately 3.5 kg of roast chicken and 7 L of cream soup available for donation today. Food-safe until 21:00. Pickup window 19:30–20:00 at the kitchen side entrance. Please confirm if you can collect.\n\n— Sesonki.AI, on behalf of your kitchen",
};

// ── Claude API helper ─────────────────────────────────────────
async function askClaude<T>(prompt: string, fallback: T): Promise<T> {
  try {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (!data.content) return fallback;
    const text = (data.content as Array<{ type: string; text?: string }>)
      .map((c) => (c.type === 'text' ? (c.text ?? '') : ''))
      .join('');
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
}

// ── UI atoms ──────────────────────────────────────────────────
function Pill({ children, tone = 'pine' }: { children: React.ReactNode; tone?: 'pine' | 'amber' | 'ink' }) {
  const map = {
    pine:  { bg: 'rgba(58,122,78,0.12)',  fg: PINE  },
    amber: { bg: 'rgba(212,118,30,0.15)', fg: AMBER },
    ink:   { bg: 'rgba(42,34,28,0.08)',   fg: INK   },
  };
  const s = map[tone];
  return (
    <span style={{
      background: s.bg, color: s.fg,
      fontFamily: 'var(--font-mono), monospace',
      fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function AgentLine({ done, label }: { done: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{
        width: 7, height: 7, borderRadius: 999, flexShrink: 0,
        background: done ? PINE : 'rgba(42,34,28,0.2)',
        boxShadow: done ? '0 0 0 3px rgba(58,122,78,0.18)' : 'none',
        transition: 'all .3s',
      }} />
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 12.5,
        color: done ? INK : 'rgba(42,34,28,0.45)',
      }}>
        {label}
      </span>
    </div>
  );
}

function Thinking({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((s) => s + 1), 520);
      return () => clearTimeout(t);
    }
  }, [shown, lines.length]);
  return (
    <div>
      {lines.slice(0, shown).map((l, i) => <AgentLine key={i} done label={l} />)}
      {shown < lines.length && <AgentLine done={false} label={lines[shown]} />}
    </div>
  );
}

function Card({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'rgba(255,251,243,0.9)' : 'rgba(255,255,255,0.7)',
      border: `1px solid ${highlight ? 'rgba(212,118,30,0.35)' : 'rgba(45,74,52,0.14)'}`,
      borderRadius: 18, padding: 26,
      boxShadow: '0 10px 40px -24px rgba(45,74,52,0.4)',
      animation: 'rise .4s ease',
    }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
      {children}
    </div>
  );
}

function CardHead({ num, title, tone }: { num: string; title: string; tone: 'pine' | 'amber' }) {
  const c = tone === 'amber' ? AMBER : PINE;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: c, color: '#fff',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 16, flexShrink: 0,
      }}>
        {num}
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,34,28,0.45)',
        }}>
          Agent {num}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
    </div>
  );
}

function BigButton({ children, onClick, tone }: { children: React.ReactNode; onClick?: () => void; tone?: 'amber' }) {
  const bg = tone === 'amber' ? AMBER : FOREST;
  return (
    <button
      onClick={onClick}
      style={{
        background: bg, color: '#fff', border: 'none', borderRadius: 11,
        padding: '13px 22px', fontSize: 15, fontWeight: 600,
        fontFamily: 'var(--font-newsreader), serif',
        cursor: 'pointer', boxShadow: `0 8px 22px -10px ${bg}`, transition: 'transform .15s',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent', color: INK,
        border: '1px solid rgba(42,34,28,0.25)', borderRadius: 11,
        padding: '12px 18px', fontSize: 14,
        fontFamily: 'var(--font-newsreader), serif', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function ApprovedNote({ text, tone }: { text: string; tone?: 'amber' }) {
  const c = tone === 'amber' ? AMBER : PINE;
  return (
    <div style={{
      marginTop: 16, display: 'flex', alignItems: 'center', gap: 10,
      background: tone === 'amber' ? 'rgba(212,118,30,0.1)' : 'rgba(58,122,78,0.1)',
      color: c, borderRadius: 11, padding: '12px 16px',
      fontSize: 14, fontWeight: 600, animation: 'rise .3s ease',
    }}>
      <span>✓</span> {text}
    </div>
  );
}

function DraftBox({ label, body }: { label: string; body: string }) {
  return (
    <div style={{
      flex: '1 1 240px', background: 'rgba(255,255,255,0.85)',
      border: '1px solid rgba(42,34,28,0.12)', borderRadius: 12, padding: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono), monospace', fontSize: 11.5,
        fontWeight: 600, color: PINE, marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.78)', whiteSpace: 'pre-line' }}>
        {body}
      </div>
    </div>
  );
}

function Metric({ v, k, c }: { v: string; k: string; c: string }) {
  return (
    <div style={{
      flex: '1 1 160px', background: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(45,74,52,0.12)', borderRadius: 14, padding: 18,
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: c }}>{v}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(42,34,28,0.55)', marginTop: 2 }}>{k}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function PlannerPage() {
  const [stage,          setStage]          = useState(0);
  const [restaurantName, setRestaurantName] = useState('');
  const [city,           setCity]           = useState('');
  const [order,          setOrder]          = useState<OrderData | null>(null);
  const [loadingOrder,   setLoadingOrder]   = useState(false);
  const [orderApproved,  setOrderApproved]  = useState(false);
  const [chosenSupplier, setChosenSupplier] = useState<string | null>(null);
  const [rescue,         setRescue]         = useState<RescueData | null>(null);
  const [loadingRescue,  setLoadingRescue]  = useState(false);
  const [rescueSent,     setRescueSent]     = useState(false);

  const wasteSaved  = (orderApproved ? 9.4 : 0) + (rescueSent ? 21.2 : 0);
  const moneySaved  = (chosenSupplier ? 15.7 : 0) + (orderApproved ? 41 : 0) + (rescueSent ? 88 : 0);
  const kitchenName = restaurantName.trim() || 'Your Kitchen';

  async function runAgent1() {
    setStage(1);
    setLoadingOrder(true);
    const prompt = `You are Agent 1, the demand & procurement planner for ${kitchenName}${city ? ` in ${city}` : ''}.
Context: Today's conditions suggest lower-than-average foot traffic. Historical data shows this reduces walk-in customers by 30–38%. The restaurant's top spoilage risks are fresh proteins and leafy greens.
Return ONLY valid JSON (no markdown) shaped exactly like:
{"headline":"one punchy sentence","reasoning":"2-3 sentence justification a busy chef would trust","items":[{"name":"...","icon":"single food emoji","base":number,"suggested":number,"unit":"kg or L"}]}
Include 5 items. "base" = normal order qty, "suggested" = your adjusted qty. Keep numbers realistic for a 50-70 seat restaurant.`;
    const result = await askClaude<OrderData>(prompt, FALLBACK_ORDER);
    setOrder(result);
    setLoadingOrder(false);
  }

  async function runRescue() {
    setStage(3);
    setLoadingRescue(true);
    const prompt = `You are Agent 3, the surplus-deflection bot for ${kitchenName} at 2:00 PM.
The lunch service just ended with leftover food. Route it: high-margin prepared food → ResQ Club discount listing; bulk → donation request to a local food shelter.
Return ONLY valid JSON (no markdown):
{"surplus":[{"name":"...","icon":"single food emoji","qty":"...","risk":"..."}],"resq":"a short ResQ Club listing text","shelter":"a short professional donation email body to a shelter coordinator"}
Include 3 surplus items. Keep it realistic and concise.`;
    const result = await askClaude<RescueData>(prompt, FALLBACK_RESCUE);
    setRescue(result);
    setLoadingRescue(false);
  }

  function reset() {
    setStage(0); setRestaurantName(''); setCity('');
    setOrder(null); setOrderApproved(false);
    setChosenSupplier(null); setRescue(null); setRescueSent(false);
  }

  const flowSteps = ['07:00 Intake', 'Supplier pick', '14:00 Rescue', 'Impact'];
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 9,
    border: '1px solid rgba(42,34,28,0.2)', fontSize: 15,
    fontFamily: 'var(--font-newsreader), Georgia, serif',
    background: 'rgba(255,255,255,0.8)', color: INK, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'rgba(42,34,28,0.5)', display: 'block', marginBottom: 6,
  };

  return (
    <div style={{
      background: PAPER, minHeight: '100vh', color: INK,
      fontFamily: 'var(--font-newsreader), Georgia, serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Warm gradients */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(120% 80% at 0% 0%, rgba(212,118,30,0.08), transparent 55%)',
          'radial-gradient(110% 90% at 100% 0%, rgba(181,64,46,0.06), transparent 50%)',
          'radial-gradient(120% 100% at 50% 120%, rgba(58,122,78,0.08), transparent 60%)',
        ].join(', '),
      }} />
      {/* Floating ingredients */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        fontSize: 40, opacity: 0.05, lineHeight: 1.8, letterSpacing: '1.4em',
        userSelect: 'none', transform: 'rotate(-8deg) scale(1.3)', transformOrigin: 'center',
      }} aria-hidden>
        🍅🥬🐟🥔🧅🌾🧄🥕🍋🫑🧈🍄🥦🌶️🫒🍞🐟🥬🍅🥔🌾🧅🥕🍋🧄🫑🥦🍄🧈🌶️🫒🍞🍅🐟🥬
      </div>
      {/* Paper grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(45,74,52,0.05) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />

      {/* ── App header (logo + tagline + pills + ticker) ── */}
      <header style={{ maxWidth: 980, margin: '0 auto', padding: '34px 28px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${PINE}, ${FOREST})`,
                display: 'grid', placeItems: 'center', fontSize: 19,
                boxShadow: `0 6px 16px -6px ${FOREST}`,
              }}>
                🍃
              </div>
              <span style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Sesonki<span style={{ color: PINE }}>.AI</span>
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'rgba(42,34,28,0.6)', maxWidth: 520 }}>
              A closed-loop agentic food-ops engine — it decides what to{' '}
              <em>buy</em> and what to <em>rescue</em>, so your kitchen never has to type.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill tone="pine">3 agents</Pill>
            <Pill tone="amber">zero data entry</Pill>
            <Pill tone="ink">live demo</Pill>
          </div>
        </div>

        {/* Live impact ticker */}
        <div style={{
          display: 'flex', marginTop: 22,
          border: '1px solid rgba(45,74,52,0.16)', borderRadius: 14,
          overflow: 'hidden', background: 'rgba(255,255,255,0.55)',
        }}>
          {[
            { k: 'Waste deflected',   v: `${wasteSaved.toFixed(1)} kg`,                    c: PINE   },
            { k: 'Money saved today', v: moneySaved > 0 ? `€${moneySaved.toFixed(0)}` : '—', c: AMBER  },
            { k: 'Staff time spent',  v: orderApproved || rescueSent ? '≈ 12 sec' : '—',   c: FOREST },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1, padding: '14px 18px',
              borderRight: i < 2 ? '1px solid rgba(45,74,52,0.12)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(42,34,28,0.5)',
              }}>
                {m.k}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.c, marginTop: 2, transition: 'color .3s' }}>
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{
        maxWidth: 980, margin: '0 auto', padding: '26px 28px 80px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Flow rail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 26px', flexWrap: 'wrap' }}>
          {flowSteps.map((s, i) => {
            const active = stage >= i + 1;
            return [
              <div key={`step-${i}`} style={{
                fontFamily: 'var(--font-mono), monospace', fontSize: 11.5,
                padding: '5px 11px', borderRadius: 8, transition: 'all .3s',
                background: active ? FOREST : 'transparent',
                color: active ? PAPER : 'rgba(42,34,28,0.4)',
                border: active ? 'none' : '1px solid rgba(42,34,28,0.15)',
              }}>
                {s}
              </div>,
              i < flowSteps.length - 1
                ? <span key={`sep-${i}`} style={{ color: 'rgba(42,34,28,0.3)' }}>→</span>
                : null,
            ];
          })}
        </div>

        {/* ── Stage 0: Setup ── */}
        {stage === 0 && (
          <Card>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 320px' }}>
                <h2 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Good morning.
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 22px' }}>
                  Your agents are ready. Tell them about your kitchen — they&apos;ll pull today&apos;s
                  conditions and plan the day for you.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
                  <div>
                    <label style={labelStyle}>Restaurant name</label>
                    <input
                      type="text"
                      placeholder="e.g. Harbour Bistro"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      type="text"
                      placeholder="e.g. Helsinki, Amsterdam, London…"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <BigButton onClick={runAgent1}>Wake Agent 1 ▸</BigButton>
              </div>
              <div style={{
                flex: '1 1 240px', background: FOREST, borderRadius: 14, padding: 20,
                color: PAPER, fontFamily: 'var(--font-mono), monospace',
                fontSize: 12, lineHeight: 1.7,
              }}>
                <div style={{ opacity: 0.6, marginBottom: 8 }}>// raw sensors</div>
                POS ........... 4 wks loaded<br />
                WEATHER ....... 🌧 checking...<br />
                WHOLESALE ..... suppliers ready<br />
                INVENTORY ..... synced<br />
                <div style={{ opacity: 0.6, margin: '12px 0 6px' }}>// pipeline</div>
                Agent 1 → Agent 2 → Agent 3<br />
                <span style={{ color: '#9bd3b3' }}>status: armed</span>
              </div>
            </div>
          </Card>
        )}

        {/* ── Stage 1: Agent 1 ── */}
        {stage === 1 && (
          <Card>
            <CardHead num="1" title="Demand & Procurement" tone="pine" />
            {loadingOrder || !order ? (
              <Thinking lines={[
                'Reading 4 weeks of POS sales…',
                `Fetching ${city || 'local'} weather forecast…`,
                'Cross-referencing low-traffic day patterns…',
                'Calculating spoilage-safe order quantities…',
              ]} />
            ) : (
              <>
                <p style={{ fontSize: 18, fontWeight: 600, margin: '4px 0 6px', color: FOREST }}>
                  &ldquo;{order.headline}&rdquo;
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 16px' }}>
                  {order.reasoning}
                </p>
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(42,34,28,0.1)' }}>
                  {order.items.map((it, i) => {
                    const cut = it.suggested < it.base;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 16px',
                        background: i % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
                      }}>
                        <span style={{ fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span style={{ fontSize: 17 }}>{it.icon || '🥄'}</span>
                          {it.name}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono), monospace', fontSize: 13 }}>
                          {cut && (
                            <span style={{ textDecoration: 'line-through', color: 'rgba(42,34,28,0.35)' }}>
                              {it.base}{it.unit}
                            </span>
                          )}
                          <span style={{ fontWeight: 700, color: cut ? AMBER : INK }}>
                            {it.suggested}{it.unit}
                          </span>
                          {cut && <Pill tone="amber">−{it.base - it.suggested}{it.unit}</Pill>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {!orderApproved ? (
                  <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
                    <BigButton onClick={() => { setOrderApproved(true); setStage(2); }}>
                      ✓ Approve order (1 click)
                    </BigButton>
                    <GhostButton onClick={runAgent1}>↻ Re-plan</GhostButton>
                  </div>
                ) : (
                  <ApprovedNote text="Order approved. Handing off to Agent 2 for supplier sourcing." />
                )}
              </>
            )}
          </Card>
        )}

        {/* ── Stage 2: Agent 2 ── */}
        {stage === 2 && (
          <Card>
            <CardHead num="2" title="Autonomous Purchasing" tone="pine" />
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 16px' }}>
              Agent 2 priced your approved basket across both wholesalers and ranked by total cost + delivery SLA.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {FALLBACK_SUPPLIERS.map((s, i) => {
                const cheapest = i === 0;
                const picked   = chosenSupplier === s.name;
                return (
                  <div key={i} style={{
                    flex: '1 1 200px', position: 'relative',
                    border: picked ? `2px solid ${PINE}` : '1px solid rgba(42,34,28,0.14)',
                    borderRadius: 14, padding: 18, transition: 'all .25s',
                    background: picked ? 'rgba(58,122,78,0.06)' : 'rgba(255,255,255,0.6)',
                  }}>
                    {cheapest && (
                      <div style={{ position: 'absolute', top: -10, right: 14 }}>
                        <Pill tone="pine">cheapest</Pill>
                      </div>
                    )}
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{s.name}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, margin: '6px 0', fontFamily: 'var(--font-mono), monospace' }}>
                      €{s.total.toFixed(2)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'rgba(42,34,28,0.6)' }}>
                      ⏱ {s.eta}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(42,34,28,0.6)', marginTop: 6 }}>{s.note}</div>
                  </div>
                );
              })}
            </div>
            {!chosenSupplier ? (
              <div style={{ marginTop: 18 }}>
                <BigButton onClick={() => setChosenSupplier('Metro Cash & Carry')}>
                  ✓ Auto-order from cheapest (Metro) — save €15.70
                </BigButton>
              </div>
            ) : (
              <>
                <ApprovedNote text="Order placed with Metro Cash & Carry for 07:00 next-day delivery. €15.70 saved." />
                <div style={{ marginTop: 18 }}>
                  <p style={{ fontSize: 14.5, color: 'rgba(42,34,28,0.72)', margin: '0 0 12px' }}>
                    ⏩ Fast-forward to <strong>14:00</strong> — lunch service just closed. Agent 3 is scanning leftovers…
                  </p>
                  <BigButton onClick={runRescue}>Trigger Agent 3 ▸</BigButton>
                </div>
              </>
            )}
          </Card>
        )}

        {/* ── Stage 3: Agent 3 Rescue ── */}
        {stage === 3 && (
          <Card highlight>
            <CardHead num="3" title="Surplus Deflection — 14:00" tone="amber" />
            {loadingRescue || !rescue ? (
              <Thinking lines={[
                'Scanning post-lunch inventory…',
                'Flagging items expiring within hours…',
                'Routing: high-margin → ResQ Club, bulk → shelter…',
                'Drafting listings & donation email…',
              ]} />
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {rescue.surplus.map((s, i) => (
                    <div key={i} style={{
                      border: `1px solid ${TOMATO}66`,
                      background: `${TOMATO}12`,
                      borderRadius: 10, padding: '8px 12px', fontSize: 13,
                    }}>
                      <strong>{s.icon || '🍽️'} {s.name}</strong> · {s.qty}
                      <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: TOMATO }}>
                        ⚠ {s.risk}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <DraftBox label="📱 ResQ Club listing"    body={rescue.resq}    />
                  <DraftBox label="✉ Shelter donation email" body={rescue.shelter} />
                </div>
                {!rescueSent ? (
                  <div style={{ marginTop: 18 }}>
                    <BigButton tone="amber" onClick={() => { setRescueSent(true); setStage(4); }}>
                      ✓ Approve & send (SMS + email)
                    </BigButton>
                  </div>
                ) : (
                  <ApprovedNote text="Listing live on ResQ Club. Shelter emailed. Confirmation sent." tone="amber" />
                )}
              </>
            )}
          </Card>
        )}

        {/* ── Stage 4: Impact ── */}
        {stage === 4 && (
          <Card>
            <CardHead num="✓" title="Daily Impact — closed loop complete" tone="pine" />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
              <Metric v={`${wasteSaved.toFixed(1)} kg`}     k="food kept out of the bin"    c={PINE}   />
              <Metric v={`€${moneySaved.toFixed(0)}`}        k="saved + recovered today"     c={AMBER}  />
              <Metric v="≈12 sec"                             k={`of ${kitchenName}'s time`}  c={FOREST} />
            </div>
            <div style={{
              background: FOREST, color: PAPER, borderRadius: 14,
              padding: 22, fontSize: 14.5, lineHeight: 1.65,
            }}>
              <strong>The closed loop:</strong> Agent 1 prevented over-ordering, Agent 2 sourced
              cheapest, and Agent 3 deflected the lunch surplus to paying customers and a shelter —
              all from <em>three taps</em>. Scaled to a year, a 5% food-cost cut can lift a
              low-margin restaurant&apos;s net profit by up to 20%.
            </div>
            <div style={{ marginTop: 18 }}>
              <GhostButton onClick={reset}>↻ Run another day</GhostButton>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
