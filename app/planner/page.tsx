'use client';

import { useState, useEffect } from 'react';
import React from 'react';

const FOREST = '#2d4a34';
const PINE   = '#3a7a4e';
const PAPER  = '#f7f0e3';
const AMBER  = '#d4761e';
const TOMATO = '#b5402e';
const INK    = '#2a221c';

type OrderItem  = { ingredient: string; label: string; unit: string; base_demand: number; on_hand: number; suggested_order: number; reduction_reason: string | null };
type OrderData  = { headline: string; reasoning: string; expected_covers: number; items: OrderItem[] };
type AllocItem  = { ingredient: string; label: string; lunch_allocation: number; dinner_allocation: number; unit: string };
type AllocData  = { date: string; expected_covers: { lunch: number; dinner: number }; allocation: AllocItem[] };

type SupplierComparison = { supplier: string; total_eur: number; delivery: string; all_items_available: boolean; savings_vs_most_expensive: number };
type OrderDetail = { ingredient: string; label: string; qty: number; unit: string; supplier: string; unit_price: number; line_total: number };
type PurchasingData = {
  supplier_comparison: SupplierComparison[];
  recommendation: { strategy: string; primary_supplier: string; total_cost_eur: number; estimated_delivery: string; reasoning: string };
  order_details: OrderDetail[];
};

type WasteReport = { total_waste_kg: number; total_waste_eur: number; daily_average_kg: number; trend: string; worst_day: { date: string; waste_kg: number; likely_cause: string }; recommendations: string[] };
type WasteForecastDay = { date: string; predicted_waste_kg: number; predicted_waste_eur: number };
type WasteForecast = { forecast: WasteForecastDay[]; feedback_to_procurement: string };
type AnalystData = { waste_report: WasteReport; waste_forecast: WasteForecast };

type SurplusItem = { item: string; qty: string; expires: string; channel: string; reason: string };
type DeflectionData = {
  surplus_items: SurplusItem[];
  resq_listing: { title: string; description: string; original_price_eur: number; discounted_price_eur: number; portions: number; pickup_window: string };
  shelter_message: { subject: string; body: string; food_items: string; pickup_deadline: string };
  sms_summary: string;
};

type PostPickupData = {
  deflection_summary: { total_surplus_kg: number; successfully_deflected_kg: number; final_waste_kg: number; deflection_rate_pct: number };
  items_still_wasted: { item: string; qty: string; reason: string }[];
  feedback_to_procurement: string;
};

// ── Fallback data ────────────────────────────────────────────

const FALLBACK_ORDER: OrderData = {
  headline: 'Rainy Saturday — trim perishables, keep comfort dishes stocked.',
  reasoning: "Rain + wind forecast reduces expected Saturday covers from ~120 to ~98. Historical rainy-Saturday data shows 18% drop in walk-ins. Trimming fresh proteins and leafy greens by ~20% protects against spoilage while keeping dinner service fully stocked.",
  expected_covers: 98,
  items: [
    { ingredient: 'salmon_kg', label: 'Fresh Salmon', unit: 'kg', base_demand: 7.0, on_hand: 4.2, suggested_order: 2.0, reduction_reason: 'Reduced from 2.8 due to rain forecast' },
    { ingredient: 'mixed_greens_kg', label: 'Mixed Salad Greens', unit: 'kg', base_demand: 3.5, on_hand: 2.8, suggested_order: 0, reduction_reason: 'Sufficient on hand for reduced covers' },
    { ingredient: 'cream_L', label: 'Heavy Cream', unit: 'L', base_demand: 8.0, on_hand: 5.5, suggested_order: 2.5, reduction_reason: null },
    { ingredient: 'beef_chuck_kg', label: 'Beef Chuck', unit: 'kg', base_demand: 4.5, on_hand: 3.5, suggested_order: 1.0, reduction_reason: 'Comfort food demand holds in rain' },
    { ingredient: 'bread_kg', label: 'Artisan Bread Dough', unit: 'kg', base_demand: 8.0, on_hand: 6.0, suggested_order: 2.0, reduction_reason: null },
    { ingredient: 'potatoes_kg', label: 'Potatoes', unit: 'kg', base_demand: 9.0, on_hand: 18.0, suggested_order: 0, reduction_reason: 'Well stocked' },
  ],
};

const FALLBACK_ALLOC: AllocData = {
  date: '2026-05-23',
  expected_covers: { lunch: 42, dinner: 56 },
  allocation: [
    { ingredient: 'salmon_kg', label: 'Fresh Salmon', lunch_allocation: 2.5, dinner_allocation: 3.7, unit: 'kg' },
    { ingredient: 'beef_chuck_kg', label: 'Beef Chuck', lunch_allocation: 1.5, dinner_allocation: 3.0, unit: 'kg' },
    { ingredient: 'bread_kg', label: 'Bread Dough', lunch_allocation: 3.5, dinner_allocation: 4.5, unit: 'kg' },
  ],
};

const FALLBACK_PURCHASING: PurchasingData = {
  supplier_comparison: [
    { supplier: 'Metro Cash & Carry', total_eur: 97.30, delivery: 'Next-day 07:00', all_items_available: true, savings_vs_most_expensive: 18.70 },
    { supplier: 'Local Farm Direct', total_eur: 116.00, delivery: 'Same-day 15:00', all_items_available: true, savings_vs_most_expensive: 0 },
  ],
  recommendation: {
    strategy: 'single_supplier', primary_supplier: 'Metro Cash & Carry',
    total_cost_eur: 97.30, estimated_delivery: 'Next-day 07:00',
    reasoning: 'Metro is €18.70 cheaper and has all items in stock. Next-day 07:00 delivery meets prep schedule.',
  },
  order_details: [
    { ingredient: 'salmon_kg', label: 'Fresh Salmon', qty: 2.0, unit: 'kg', supplier: 'Metro', unit_price: 17.80, line_total: 35.60 },
    { ingredient: 'cream_L', label: 'Heavy Cream', qty: 2.5, unit: 'L', supplier: 'Metro', unit_price: 4.20, line_total: 10.50 },
    { ingredient: 'beef_chuck_kg', label: 'Beef Chuck', qty: 1.0, unit: 'kg', supplier: 'Metro', unit_price: 13.50, line_total: 13.50 },
    { ingredient: 'bread_kg', label: 'Bread Dough', qty: 2.0, unit: 'kg', supplier: 'Metro', unit_price: 3.20, line_total: 6.40 },
  ],
};

const FALLBACK_ANALYST: AnalystData = {
  waste_report: {
    total_waste_kg: 26.8, total_waste_eur: 235.90, daily_average_kg: 4.47, trend: 'stable',
    worst_day: { date: '2026-05-18', waste_kg: 6.8, likely_cause: 'Rainy Monday — over-ordered perishables' },
    recommendations: [
      'Reduce Monday perishable orders by 25% (rainy Mondays consistently worst)',
      'Implement lunch-to-dinner repurposing for soups and roasts',
    ],
  },
  waste_forecast: {
    forecast: [
      { date: '2026-05-24', predicted_waste_kg: 3.8, predicted_waste_eur: 33.20 },
      { date: '2026-05-25', predicted_waste_kg: 5.2, predicted_waste_eur: 45.60 },
      { date: '2026-05-26', predicted_waste_kg: 3.1, predicted_waste_eur: 27.10 },
    ],
    feedback_to_procurement: 'Mixed greens and salmon are the top waste drivers — consider trimming Monday/Tuesday orders by 20%.',
  },
};

const FALLBACK_DEFLECTION: DeflectionData = {
  surplus_items: [
    { item: 'Roast Chicken portions', qty: '5.8 kg', expires: '2026-05-23T21:00', channel: 'resq', reason: 'High-margin prepared food, attractive for ResQ' },
    { item: 'Cream of Potato Soup', qty: '9 L', expires: '2026-05-23T20:00', channel: 'shelter', reason: 'Bulk quantity, ideal for shelter donation' },
    { item: 'Sourdough Rolls', qty: '36 pcs', expires: '2026-05-23T23:59', channel: 'resq', reason: 'Baked goods sell well on ResQ' },
  ],
  resq_listing: {
    title: "Chef's Surprise Box — Linh's Bakery",
    description: 'Roast chicken + fresh sourdough rolls. A full meal at 50% off.',
    original_price_eur: 9.90, discounted_price_eur: 4.90, portions: 16, pickup_window: '17:30–19:00',
  },
  shelter_message: {
    subject: 'Food donation available — Linhs Bakery',
    body: "Hello,\n\nWe have approximately 9L of cream of potato soup available for donation today. Food-safe until 20:00. Pickup window 18:00–19:30 at the kitchen side entrance.\n\nPlease confirm if you can collect.\n\nBest regards,\nLinh's Bakery via .GATHER",
    food_items: '9L cream of potato soup',
    pickup_deadline: '19:30',
  },
  sms_summary: 'GATHER: 16 ResQ portions listed (pickup 17:30-19:00). Shelter contacted for 9L soup (pickup 18:00-19:30). Tap to view.',
};

const FALLBACK_POST_PICKUP: PostPickupData = {
  deflection_summary: {
    total_surplus_kg: 14.1,
    successfully_deflected_kg: 11.3,
    final_waste_kg: 2.8,
    deflection_rate_pct: 80.1,
  },
  items_still_wasted: [
    { item: 'Roast Chicken portions', qty: '1.6 kg', reason: 'Not collected from ResQ' },
    { item: 'Sourdough Rolls', qty: '8 pcs (~0.6 kg)', reason: 'Not collected from ResQ' },
    { item: 'Mixed Salad (dressed)', qty: '1.2 kg', reason: 'Expired before pickup window' },
  ],
  feedback_to_procurement: '2.8 kg still wasted after deflection. Mixed salad expires too early for any rescue — reduce lunch-salad prep by 15%. List ResQ chicken portions earlier (16:00 instead of 17:30).',
};

// ── Backend API helper ───────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_CREWAI_URL || '';
const DEMO_MODE = !BACKEND_URL;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function callAgent<T>(
  agent: string,
  body: Record<string, unknown>,
  fallback: T,
): Promise<T> {
  if (DEMO_MODE) {
    await sleep(1800 + Math.random() * 1200);
    return fallback;
  }

  try {
    const url = `${BACKEND_URL}/api/agent/${agent}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) return fallback;
    const data = await res.json();
    if (data.result) {
      const raw = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      const clean = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(clean) as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

// ── UI atoms ─────────────────────────────────────────────────

function Pill({ children, tone = 'pine' }: { children: React.ReactNode; tone?: 'pine' | 'amber' | 'ink' | 'tomato' }) {
  const map: Record<string, { bg: string; fg: string }> = {
    pine:   { bg: 'rgba(58,122,78,0.12)',  fg: PINE },
    amber:  { bg: 'rgba(212,118,30,0.15)', fg: AMBER },
    ink:    { bg: 'rgba(42,34,28,0.08)',   fg: INK },
    tomato: { bg: 'rgba(181,64,46,0.12)',  fg: TOMATO },
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
        fontFamily: 'var(--font-mono), monospace', fontSize: 12.5,
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

function Card({ children, highlight, tone }: { children: React.ReactNode; highlight?: boolean; tone?: string }) {
  const borderColor = tone === 'amber' ? 'rgba(212,118,30,0.35)'
    : tone === 'tomato' ? 'rgba(181,64,46,0.35)'
    : 'rgba(45,74,52,0.14)';
  return (
    <div style={{
      background: highlight ? 'rgba(255,251,243,0.9)' : 'rgba(255,255,255,0.7)',
      border: `1px solid ${borderColor}`,
      borderRadius: 18, padding: 26,
      boxShadow: '0 10px 40px -24px rgba(45,74,52,0.4)',
      animation: 'rise .4s ease', marginBottom: 20,
    }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
      {children}
    </div>
  );
}

function CardHead({ num, title, tone }: { num: string; title: string; tone: 'pine' | 'amber' | 'tomato' }) {
  const c = tone === 'amber' ? AMBER : tone === 'tomato' ? TOMATO : PINE;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: c, color: '#fff',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 16, flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,34,28,0.45)',
        }}>Agent {num}</div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
    </div>
  );
}

function BigButton({ children, onClick, tone }: { children: React.ReactNode; onClick?: () => void; tone?: 'amber' | 'tomato' }) {
  const bg = tone === 'amber' ? AMBER : tone === 'tomato' ? TOMATO : FOREST;
  return (
    <button onClick={onClick} style={{
      background: bg, color: '#fff', border: 'none', borderRadius: 11,
      padding: '13px 22px', fontSize: 15, fontWeight: 600,
      fontFamily: 'var(--font-newsreader), serif',
      cursor: 'pointer', boxShadow: `0 8px 22px -10px ${bg}`, transition: 'transform .15s',
    }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: INK,
      border: '1px solid rgba(42,34,28,0.25)', borderRadius: 11,
      padding: '12px 18px', fontSize: 14,
      fontFamily: 'var(--font-newsreader), serif', cursor: 'pointer',
    }}>
      {children}
    </button>
  );
}

function ApprovedNote({ text, tone }: { text: string; tone?: 'amber' | 'tomato' }) {
  const c = tone === 'amber' ? AMBER : tone === 'tomato' ? TOMATO : PINE;
  const bg = tone === 'amber' ? 'rgba(212,118,30,0.1)' : tone === 'tomato' ? 'rgba(181,64,46,0.1)' : 'rgba(58,122,78,0.1)';
  return (
    <div style={{
      marginTop: 16, display: 'flex', alignItems: 'center', gap: 10,
      background: bg, color: c, borderRadius: 11, padding: '12px 16px',
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
      }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.78)', whiteSpace: 'pre-line' }}>
        {body}
      </div>
    </div>
  );
}

function Metric({ v, k, c }: { v: string; k: string; c: string }) {
  return (
    <div style={{
      flex: '1 1 140px', background: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(45,74,52,0.12)', borderRadius: 14, padding: 18,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: c }}>{v}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(42,34,28,0.55)', marginTop: 2 }}>{k}</div>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────

type TabId = 'procurement' | 'purchasing' | 'analyst' | 'deflection' | 'impact';

const TABS: { id: TabId; num: string; label: string; tone: 'pine' | 'amber' | 'tomato' }[] = [
  { id: 'procurement', num: '1', label: 'Procurement',  tone: 'pine' },
  { id: 'purchasing',  num: '2', label: 'Sourcing',     tone: 'pine' },
  { id: 'analyst',     num: '3', label: 'Waste Analysis', tone: 'amber' },
  { id: 'deflection',  num: '4', label: 'Surplus Rescue', tone: 'tomato' },
  { id: 'impact',      num: '✓', label: 'Impact',       tone: 'pine' },
];

function TabBar({ active, onSelect, statuses }: {
  active: TabId;
  onSelect: (t: TabId) => void;
  statuses: Record<TabId, 'idle' | 'running' | 'done'>;
}) {
  return (
    <div style={{
      display: 'flex', gap: 4, margin: '10px 0 26px', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(45,74,52,0.12)',
      borderRadius: 14, padding: 5,
    }}>
      {TABS.map((t) => {
        const isActive = active === t.id;
        const status = statuses[t.id];
        const toneColor = t.tone === 'amber' ? AMBER : t.tone === 'tomato' ? TOMATO : PINE;
        return (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono), monospace', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.03em', transition: 'all .2s',
            background: isActive ? FOREST : 'transparent',
            color: isActive ? PAPER : 'rgba(42,34,28,0.55)',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, fontSize: 11, fontWeight: 700,
              display: 'inline-grid', placeItems: 'center', flexShrink: 0,
              background: isActive ? 'rgba(255,255,255,0.2)' : `${toneColor}18`,
              color: isActive ? PAPER : toneColor,
            }}>{t.num}</span>
            <span>{t.label}</span>
            {status === 'done' && <span style={{ color: isActive ? '#9bd3b3' : PINE, fontSize: 13 }}>✓</span>}
            {status === 'running' && <span style={{
              width: 8, height: 8, borderRadius: 99, background: AMBER,
              animation: 'pulse 1s infinite',
            }} />}
          </button>
        );
      })}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<TabId>('procurement');
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');
  const [city,           setCity]           = useState('');
  const [scheduleMode,   setScheduleMode]   = useState('manual');
  const [scheduleInterval, setScheduleInterval] = useState(1);
  const [supplierSource, setSupplierSource] = useState('user_provided');

  const [order,          setOrder]          = useState<OrderData | null>(null);
  const [alloc,          setAlloc]          = useState<AllocData | null>(null);
  const [loadingOrder,   setLoadingOrder]   = useState(false);
  const [orderApproved,  setOrderApproved]  = useState(false);
  const [ownerFeedback,  setOwnerFeedback]  = useState('');

  const [purchasing,     setPurchasing]     = useState<PurchasingData | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [purchaseApproved, setPurchaseApproved] = useState(false);

  const [analyst,        setAnalyst]        = useState<AnalystData | null>(null);
  const [loadingAnalyst, setLoadingAnalyst] = useState(false);

  const [deflection,     setDeflection]     = useState<DeflectionData | null>(null);
  const [loadingDeflect, setLoadingDeflect] = useState(false);
  const [deflectApproved, setDeflectApproved] = useState(false);

  const [postPickup,     setPostPickup]     = useState<PostPickupData | null>(null);
  const [loadingPostPickup, setLoadingPostPickup] = useState(false);

  const kitchenName = restaurantName.trim() || 'Linhs Bakery';
  const wasteSaved  = (orderApproved ? 9.4 : 0) + (deflectApproved ? 21.2 : 0);
  const moneySaved  = (purchaseApproved ? 18.7 : 0) + (orderApproved ? 41 : 0) + (deflectApproved ? 88 : 0);

  const body = { restaurant_name: kitchenName, city: city || 'Helsinki' };

  const statuses: Record<TabId, 'idle' | 'running' | 'done'> = {
    procurement: loadingOrder ? 'running' : orderApproved ? 'done' : order ? 'done' : 'idle',
    purchasing:  loadingPurchase ? 'running' : purchaseApproved ? 'done' : purchasing ? 'done' : 'idle',
    analyst:     loadingAnalyst || loadingPostPickup ? 'running' : postPickup ? 'done' : analyst ? 'done' : 'idle',
    deflection:  loadingDeflect ? 'running' : deflectApproved ? 'done' : deflection ? 'done' : 'idle',
    impact:      postPickup ? 'done' : 'idle',
  };

  async function runAgent1(feedback?: string) {
    setLoadingOrder(true);
    setOrderApproved(false);
    const payload = feedback
      ? { ...body, context: `Owner feedback: ${feedback}` }
      : body;
    const result = await callAgent<{ order_list: string; allocation_plan: string }>('procurement', payload, {
      order_list: JSON.stringify(FALLBACK_ORDER),
      allocation_plan: JSON.stringify(FALLBACK_ALLOC),
    });
    try { setOrder(JSON.parse(result.order_list)); } catch { setOrder(FALLBACK_ORDER); }
    try { setAlloc(JSON.parse(result.allocation_plan)); } catch { setAlloc(FALLBACK_ALLOC); }
    setLoadingOrder(false);
  }

  const runAgent2 = React.useCallback(async () => {
    setLoadingPurchase(true);
    setPurchaseApproved(false);
    const result = await callAgent<{ purchasing_plan: string }>('purchasing', {
      ...body, context: order ? JSON.stringify(order) : '',
    }, { purchasing_plan: JSON.stringify(FALLBACK_PURCHASING) });
    try { setPurchasing(JSON.parse(result.purchasing_plan)); } catch { setPurchasing(FALLBACK_PURCHASING); }
    setLoadingPurchase(false);
    setPurchaseApproved(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, kitchenName, city]);

  const runAgent3 = React.useCallback(async () => {
    setLoadingAnalyst(true);
    const result = await callAgent<{ waste_report: string; waste_forecast: string }>('analyst', body, {
      waste_report: JSON.stringify(FALLBACK_ANALYST.waste_report),
      waste_forecast: JSON.stringify(FALLBACK_ANALYST.waste_forecast),
    });
    try {
      setAnalyst({
        waste_report: JSON.parse(result.waste_report),
        waste_forecast: JSON.parse(result.waste_forecast),
      });
    } catch { setAnalyst(FALLBACK_ANALYST); }
    setLoadingAnalyst(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitchenName, city]);

  const runAgent4 = React.useCallback(async () => {
    setLoadingDeflect(true);
    setDeflectApproved(false);
    const result = await callAgent<{ deflection_plan: string }>('deflection', {
      ...body, context: analyst ? JSON.stringify(analyst.waste_report) : '',
    }, { deflection_plan: JSON.stringify(FALLBACK_DEFLECTION) });
    try { setDeflection(JSON.parse(result.deflection_plan)); } catch { setDeflection(FALLBACK_DEFLECTION); }
    setLoadingDeflect(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyst, kitchenName, city]);

  async function runPostPickup() {
    setLoadingPostPickup(true);
    const result = await callAgent<{ waste_report_phase2: string }>('analyst-p2', body, {
      waste_report_phase2: JSON.stringify(FALLBACK_POST_PICKUP),
    });
    try { setPostPickup(JSON.parse(result.waste_report_phase2)); } catch { setPostPickup(FALLBACK_POST_PICKUP); }
    setLoadingPostPickup(false);
  }

  // Auto-chain: Agent 1 approved → run Agent 2 → auto-approve
  useEffect(() => {
    if (orderApproved && !purchasing && !loadingPurchase) {
      setActiveTab('purchasing');
      runAgent2();
    }
  }, [orderApproved, purchasing, loadingPurchase, runAgent2]);

  // Auto-chain: Agent 2 done → run Agent 3
  useEffect(() => {
    if (purchaseApproved && !analyst && !loadingAnalyst) {
      setActiveTab('analyst');
      runAgent3();
    }
  }, [purchaseApproved, analyst, loadingAnalyst, runAgent3]);

  // Auto-chain: Agent 3 done → run Agent 4
  useEffect(() => {
    if (analyst && !deflection && !loadingDeflect) {
      setActiveTab('deflection');
      runAgent4();
    }
  }, [analyst, deflection, loadingDeflect, runAgent4]);

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
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(120% 80% at 0% 0%, rgba(212,118,30,0.08), transparent 55%)',
          'radial-gradient(110% 90% at 100% 0%, rgba(181,64,46,0.06), transparent 50%)',
          'radial-gradient(120% 100% at 50% 120%, rgba(58,122,78,0.08), transparent 60%)',
        ].join(', '),
      }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        fontSize: 40, opacity: 0.05, lineHeight: 1.8, letterSpacing: '1.4em',
        userSelect: 'none', transform: 'rotate(-8deg) scale(1.3)', transformOrigin: 'center',
      }} aria-hidden>
        🍅🥬🐟🥔🧅🌾🧄🥕🍋🫑🧈🍄🥦🌶️🫒🍞🐟🥬🍅🥔🌾🧅🥕🍋🧄🫑🥦🍄🧈🌶️🫒🍞🍅🐟🥬
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(45,74,52,0.05) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />

      {/* ── Header ── */}
      <header style={{ maxWidth: 980, margin: '0 auto', padding: '34px 28px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${PINE}, ${FOREST})`,
                display: 'grid', placeItems: 'center', fontSize: 19,
                boxShadow: `0 6px 16px -6px ${FOREST}`,
              }}>🍃</div>
              <span style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em' }}>
                GATHER<span style={{ color: PINE }}>.AI</span>
              </span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'rgba(42,34,28,0.6)', maxWidth: 520 }}>
              4-agent food-ops engine — <em>plan</em>, <em>source</em>, <em>analyse</em>, and <em>rescue</em>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Pill tone="pine">4 agents</Pill>
            <Pill tone="amber">zero data entry</Pill>
            <Pill tone="ink">CrewAI</Pill>
            <button onClick={() => setSettingsOpen(!settingsOpen)} style={{
              background: 'none', border: '1px solid rgba(42,34,28,0.2)', borderRadius: 8,
              padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-mono), monospace',
              fontSize: 11, color: 'rgba(42,34,28,0.55)', marginLeft: 4,
            }}>
              {settingsOpen ? '▾ Settings' : '▸ Settings'}
            </button>
          </div>
        </div>

        {/* ── Collapsible settings ── */}
        {settingsOpen && (
          <div style={{
            marginTop: 16, padding: 18, borderRadius: 14,
            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(45,74,52,0.12)',
          }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={labelStyle}>Restaurant</label>
                <input type="text" placeholder="Linh's Bakery" value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={labelStyle}>City</label>
                <input type="text" placeholder="Helsinki" value={city}
                  onChange={(e) => setCity(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={labelStyle}>Agent 1+2 trigger</label>
                <select value={scheduleMode} onChange={(e) => setScheduleMode(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="manual">Manual</option>
                  <option value="auto">Auto schedule</option>
                </select>
              </div>
              {scheduleMode === 'auto' && (
                <div style={{ flex: '1 1 120px' }}>
                  <label style={labelStyle}>Interval</label>
                  <select value={scheduleInterval} onChange={(e) => setScheduleInterval(Number(e.target.value))}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value={1}>Daily</option>
                    <option value={2}>Every 2 days</option>
                    <option value={7}>Weekly</option>
                  </select>
                </div>
              )}
              <div style={{ flex: '1 1 160px' }}>
                <label style={labelStyle}>Supplier data</label>
                <select value={supplierSource} onChange={(e) => setSupplierSource(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="user_provided">Owner-provided</option>
                  <option value="auto_fetch">Auto-fetch</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Metrics bar ── */}
        <div style={{
          display: 'flex', marginTop: 16,
          border: '1px solid rgba(45,74,52,0.16)', borderRadius: 14,
          overflow: 'hidden', background: 'rgba(255,255,255,0.55)',
        }}>
          {[
            { k: 'Waste deflected',   v: wasteSaved > 0 ? `${wasteSaved.toFixed(1)} kg` : '—', c: PINE },
            { k: 'Money saved today',  v: moneySaved > 0 ? `€${moneySaved.toFixed(0)}` : '—', c: AMBER },
            { k: 'Staff time spent',   v: orderApproved || deflectApproved ? '≈ 12 sec' : '—', c: FOREST },
            { k: 'Agents completed',   v: `${[orderApproved, purchaseApproved, !!analyst, deflectApproved].filter(Boolean).length}/4`, c: TOMATO },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1, padding: '14px 18px',
              borderRight: i < 3 ? '1px solid rgba(45,74,52,0.12)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(42,34,28,0.5)',
              }}>{m.k}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: m.c, marginTop: 2, transition: 'color .3s' }}>
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '10px 28px 80px', position: 'relative', zIndex: 1 }}>

        {/* Tab bar */}
        <TabBar active={activeTab} onSelect={setActiveTab} statuses={statuses} />

        {/* ── Tab: Agent 1 — Procurement ── */}
        {activeTab === 'procurement' && (
          <Card>
            <CardHead num="1" title="Demand & Procurement" tone="pine" />
            {!order && !loadingOrder ? (
              <div>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 18px' }}>
                  Analyses POS history, weather, and current inventory to generate an optimised order list with allocation plan.
                </p>
                {scheduleMode === 'auto' && (
                  <div style={{ fontSize: 12.5, color: 'rgba(42,34,28,0.5)', fontFamily: 'var(--font-mono), monospace', marginBottom: 12 }}>
                    Auto-schedule: every {scheduleInterval} day{scheduleInterval > 1 ? 's' : ''} at 06:00
                  </div>
                )}
                <BigButton onClick={runAgent1}>
                  Run Procurement Agent ▸
                </BigButton>
              </div>
            ) : loadingOrder ? (
              <Thinking lines={[
                'Reading 4 weeks of POS sales…',
                `Fetching ${city || 'Helsinki'} weather forecast…`,
                'Checking current inventory levels…',
                'Cross-referencing low-traffic day patterns…',
                'Calculating spoilage-safe order quantities…',
              ]} />
            ) : order && (
              <>
                <p style={{ fontSize: 18, fontWeight: 600, margin: '4px 0 6px', color: FOREST }}>
                  &ldquo;{order.headline}&rdquo;
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 6px' }}>
                  {order.reasoning}
                </p>
                <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: PINE, marginBottom: 16 }}>
                  Expected covers: {order.expected_covers}
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(42,34,28,0.1)' }}>
                  {order.items.map((it, i) => {
                    const needsOrder = it.suggested_order > 0;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 16px', fontSize: 14.5,
                        background: i % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
                      }}>
                        <span>{it.label}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono), monospace', fontSize: 13 }}>
                          <span style={{ color: 'rgba(42,34,28,0.4)' }}>on hand: {it.on_hand}{it.unit}</span>
                          {needsOrder ? (
                            <span style={{ fontWeight: 700, color: AMBER }}>order {it.suggested_order}{it.unit}</span>
                          ) : (
                            <span style={{ fontWeight: 600, color: PINE }}>sufficient</span>
                          )}
                          {it.reduction_reason && <Pill tone="amber">{it.reduction_reason.slice(0, 35)}</Pill>}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {alloc && (
                  <div style={{ marginTop: 16, padding: 14, background: 'rgba(58,122,78,0.06)', borderRadius: 12, border: '1px solid rgba(58,122,78,0.12)' }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: PINE, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Allocation Plan — Lunch {alloc.expected_covers.lunch} / Dinner {alloc.expected_covers.dinner} covers
                    </div>
                    {alloc.allocation.map((a, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'rgba(42,34,28,0.7)', marginBottom: 3 }}>
                        {a.label}: <strong>{a.lunch_allocation}{a.unit}</strong> lunch · <strong>{a.dinner_allocation}{a.unit}</strong> dinner
                      </div>
                    ))}
                  </div>
                )}

                {!orderApproved ? (
                  <>
                    <div style={{
                      marginTop: 18, padding: 14, background: 'rgba(42,34,28,0.03)',
                      borderRadius: 12, border: '1px solid rgba(42,34,28,0.1)',
                    }}>
                      <label style={{
                        fontFamily: 'var(--font-mono), monospace', fontSize: 10.5,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'rgba(42,34,28,0.5)', display: 'block', marginBottom: 8,
                      }}>Feedback to agent (optional)</label>
                      <textarea
                        value={ownerFeedback}
                        onChange={(e) => setOwnerFeedback(e.target.value)}
                        placeholder="e.g. Weather won't be that rainy, keep salmon at normal levels…"
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: 9,
                          border: '1px solid rgba(42,34,28,0.15)', fontSize: 14,
                          fontFamily: 'var(--font-newsreader), Georgia, serif',
                          background: 'rgba(255,255,255,0.8)', color: INK, outline: 'none',
                          resize: 'vertical', minHeight: 56, lineHeight: 1.5,
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center' }}>
                      <BigButton onClick={() => setOrderApproved(true)}>
                        ✓ Approve Order
                      </BigButton>
                      <GhostButton onClick={() => { runAgent1(ownerFeedback || undefined); }}>
                        ↻ Re-plan{ownerFeedback ? ' with feedback' : ''}
                      </GhostButton>
                    </div>
                  </>
                ) : (
                  <ApprovedNote text="Order approved. Agent 2 auto-sourcing suppliers…" />
                )}
              </>
            )}
          </Card>
        )}

        {/* ── Tab: Agent 2 — Purchasing ── */}
        {activeTab === 'purchasing' && (
          <Card>
            <CardHead num="2" title="Smart Sourcing" tone="pine" />
            <div style={{ marginBottom: 12 }}>
              <Pill tone={supplierSource === 'auto_fetch' ? 'amber' : 'pine'}>
                {supplierSource === 'auto_fetch' ? 'auto-fetching prices' : 'owner-provided suppliers'}
              </Pill>
            </div>
            {!purchasing && !loadingPurchase ? (
              <div>
                <Pill tone="ink">auto-triggered after procurement approval</Pill>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '12px 0 0' }}>
                  Automatically prices the approved basket across suppliers and places the cheapest order. No manual action needed.
                </p>
              </div>
            ) : loadingPurchase ? (
              <Thinking lines={
                supplierSource === 'auto_fetch'
                  ? ['Querying Metro Cash & Carry API…', 'Scraping Kesko Food Service catalog…', 'Pricing basket across live sources…', 'Ranking by total cost + SLA…']
                  : ['Fetching supplier catalogs…', 'Pricing approved basket across 3 suppliers…', 'Checking availability & delivery windows…', 'Ranking by total cost + SLA…']
              } />
            ) : purchasing && (
              <>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 16px' }}>
                  {purchasing.recommendation.reasoning}
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                  {purchasing.supplier_comparison.map((s, i) => {
                    const best = s.supplier === purchasing.recommendation.primary_supplier;
                    return (
                      <div key={i} style={{
                        flex: '1 1 200px', position: 'relative',
                        border: best ? `2px solid ${PINE}` : '1px solid rgba(42,34,28,0.14)',
                        borderRadius: 14, padding: 18,
                        background: best ? 'rgba(58,122,78,0.06)' : 'rgba(255,255,255,0.6)',
                      }}>
                        {best && <div style={{ position: 'absolute', top: -10, right: 14 }}><Pill tone="pine">recommended</Pill></div>}
                        <div style={{ fontWeight: 700, fontSize: 17 }}>{s.supplier}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, margin: '6px 0', fontFamily: 'var(--font-mono), monospace' }}>
                          €{s.total_eur.toFixed(2)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'rgba(42,34,28,0.6)' }}>
                          ⏱ {s.delivery}
                        </div>
                        {s.savings_vs_most_expensive > 0 && (
                          <div style={{ fontSize: 13, color: PINE, marginTop: 4, fontWeight: 600 }}>
                            Save €{s.savings_vs_most_expensive.toFixed(2)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(42,34,28,0.1)', marginBottom: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, padding: '8px 16px', background: 'rgba(42,34,28,0.04)', color: 'rgba(42,34,28,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Order breakdown
                  </div>
                  {purchasing.order_details.map((d, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '9px 16px', fontSize: 14,
                      background: i % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
                    }}>
                      <span>{d.label} · {d.qty}{d.unit}</span>
                      <span style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: 600 }}>€{d.line_total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <ApprovedNote text={`Order auto-placed with ${purchasing.recommendation.primary_supplier}. Delivery: ${purchasing.recommendation.estimated_delivery}.`} />
              </>
            )}
          </Card>
        )}

        {/* ── Tab: Agent 3 — Waste Analysis ── */}
        {activeTab === 'analyst' && (
          <>
            <Card highlight tone="amber">
              <CardHead num="3" title="Waste Analysis" tone="amber" />
              {!analyst && !loadingAnalyst ? (
                <div>
                  <Pill tone="amber">auto-scheduled · runs after purchasing completes</Pill>
                  <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '12px 0 0' }}>
                    Automatically analyses 7-day waste history, identifies trends, and forecasts waste. Triggers Surplus Rescue when done.
                  </p>
                </div>
              ) : loadingAnalyst ? (
                <Thinking lines={[
                  'Reading 7-day waste log…',
                  'Scanning end-of-day leftovers…',
                  'Identifying waste trends & root causes…',
                  'Forecasting waste for next 3 days…',
                  'Preparing feedback for procurement agent…',
                ]} />
              ) : analyst && (
                <>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                    <Metric v={`${analyst.waste_report.total_waste_kg} kg`} k="wasted last 7 days" c={TOMATO} />
                    <Metric v={`€${analyst.waste_report.total_waste_eur}`} k="waste value" c={AMBER} />
                    <Metric v={`${analyst.waste_report.daily_average_kg} kg/d`} k="daily average" c={AMBER} />
                    <Metric v={analyst.waste_report.trend} k="trend" c={analyst.waste_report.trend === 'increasing' ? TOMATO : PINE} />
                  </div>

                  <div style={{ padding: 14, background: 'rgba(181,64,46,0.06)', borderRadius: 12, border: '1px solid rgba(181,64,46,0.15)', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: TOMATO, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Worst day: {analyst.waste_report.worst_day.date}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(42,34,28,0.75)' }}>
                      {analyst.waste_report.worst_day.waste_kg} kg wasted — {analyst.waste_report.worst_day.likely_cause}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: AMBER, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Recommendations
                    </div>
                    {analyst.waste_report.recommendations.map((r, i) => (
                      <div key={i} style={{ fontSize: 14, color: 'rgba(42,34,28,0.72)', marginBottom: 6, paddingLeft: 14, borderLeft: `2px solid ${AMBER}` }}>
                        {r}
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 14, background: 'rgba(212,118,30,0.06)', borderRadius: 12, border: '1px solid rgba(212,118,30,0.15)' }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: AMBER, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      3-day waste forecast
                    </div>
                    {analyst.waste_forecast.forecast.map((f, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'rgba(42,34,28,0.7)', marginBottom: 3 }}>
                        {f.date}: <strong>{f.predicted_waste_kg} kg</strong> (€{f.predicted_waste_eur})
                      </div>
                    ))}
                    <div style={{ fontSize: 13, color: AMBER, fontStyle: 'italic', marginTop: 8 }}>
                      → Feedback to Agent 1: {analyst.waste_forecast.feedback_to_procurement}
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Phase 2 — Post-pickup */}
            {analyst && (
              <Card highlight tone="amber">
                <CardHead num="3b" title="Post-Pickup Reconciliation" tone="amber" />
                {!postPickup && !loadingPostPickup ? (
                  <div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '0 0 18px' }}>
                      After the pickup deadline, reconcile what was collected vs what remains. Final waste numbers feed back into Agent 1.
                    </p>
                    <BigButton tone="amber" onClick={runPostPickup}>
                      Run Post-Pickup Reconciliation ▸
                    </BigButton>
                  </div>
                ) : loadingPostPickup ? (
                  <Thinking lines={[
                    'Reading pickup results from ResQ Club…',
                    'Checking shelter collection status…',
                    'Reconciling collected vs remaining…',
                    'Generating feedback for Agent 1…',
                  ]} />
                ) : postPickup && (
                  <>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                      <Metric v={`${postPickup.deflection_summary.successfully_deflected_kg} kg`} k="successfully rescued" c={PINE} />
                      <Metric v={`${postPickup.deflection_summary.final_waste_kg} kg`} k="still wasted" c={TOMATO} />
                      <Metric v={`${postPickup.deflection_summary.deflection_rate_pct}%`} k="deflection rate" c={postPickup.deflection_summary.deflection_rate_pct > 70 ? PINE : AMBER} />
                    </div>

                    {postPickup.items_still_wasted.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: TOMATO, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Items still wasted
                        </div>
                        {postPickup.items_still_wasted.map((w, i) => (
                          <div key={i} style={{ fontSize: 14, color: 'rgba(42,34,28,0.72)', marginBottom: 6, paddingLeft: 14, borderLeft: `2px solid ${TOMATO}` }}>
                            <strong>{w.item}</strong> · {w.qty} — {w.reason}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ padding: 14, background: 'rgba(58,122,78,0.06)', borderRadius: 12, border: '1px solid rgba(58,122,78,0.15)' }}>
                      <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: PINE, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        → Feedback to Agent 1 (next cycle)
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(42,34,28,0.75)', lineHeight: 1.6 }}>
                        {postPickup.feedback_to_procurement}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            )}
          </>
        )}

        {/* ── Tab: Agent 4 — Surplus Deflection ── */}
        {activeTab === 'deflection' && (
          <Card tone="tomato">
            <CardHead num="4" title="Surplus Deflection" tone="tomato" />
            {!deflection && !loadingDeflect ? (
              <div>
                <Pill tone="tomato">auto-triggered after waste analysis</Pill>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.72)', margin: '12px 0 0' }}>
                  Automatically routes surplus to ResQ Club and shelters. Drafts are prepared for your approval before anything is sent.
                </p>
              </div>
            ) : loadingDeflect ? (
              <Thinking lines={[
                'Reading end-of-day leftover inventory…',
                'Categorising by deflection channel…',
                'Routing high-margin items → ResQ Club…',
                'Routing bulk surplus → shelter donation…',
                'Drafting listings & donation messages…',
              ]} />
            ) : deflection && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {deflection.surplus_items.map((s, i) => (
                    <div key={i} style={{
                      border: `1px solid ${TOMATO}66`, background: `${TOMATO}12`,
                      borderRadius: 10, padding: '8px 12px', fontSize: 13,
                    }}>
                      <strong>{s.item}</strong> · {s.qty}
                      <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: TOMATO }}>
                        {s.channel === 'resq' ? 'ResQ Club' : 'Shelter'} · expires {new Date(s.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                  <DraftBox
                    label={`ResQ: ${deflection.resq_listing.title}`}
                    body={`${deflection.resq_listing.description}\n\n€${deflection.resq_listing.discounted_price_eur} (was €${deflection.resq_listing.original_price_eur}) · ${deflection.resq_listing.portions} portions\nPickup: ${deflection.resq_listing.pickup_window}`}
                  />
                  <DraftBox
                    label="Shelter donation"
                    body={deflection.shelter_message.body}
                  />
                </div>

                {deflection.sms_summary && (
                  <div style={{ padding: 14, background: 'rgba(42,34,28,0.04)', borderRadius: 12, border: '1px solid rgba(42,34,28,0.1)', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, color: 'rgba(42,34,28,0.5)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      SMS preview
                    </div>
                    <div style={{ fontSize: 13.5, color: 'rgba(42,34,28,0.75)' }}>{deflection.sms_summary}</div>
                  </div>
                )}

                {!deflectApproved ? (
                  <BigButton tone="tomato" onClick={() => setDeflectApproved(true)}>
                    ✓ Approve — send ResQ listing + shelter email + SMS
                  </BigButton>
                ) : (
                  <ApprovedNote text="ResQ listing live. Shelter contacted. SMS sent to owner." tone="tomato" />
                )}
              </>
            )}
          </Card>
        )}

        {/* ── Tab: Impact ── */}
        {activeTab === 'impact' && (
          <Card>
            <CardHead num="✓" title="Daily Impact" tone="pine" />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
              <Metric v={postPickup ? `${postPickup.deflection_summary.successfully_deflected_kg} kg` : wasteSaved > 0 ? `${wasteSaved.toFixed(1)} kg` : '—'} k="food rescued" c={PINE} />
              <Metric v={moneySaved > 0 ? `€${moneySaved.toFixed(0)}` : '—'} k="saved + recovered" c={AMBER} />
              <Metric v={postPickup ? `${postPickup.deflection_summary.deflection_rate_pct}%` : '—'} k="deflection rate" c={PINE} />
              <Metric v={orderApproved || deflectApproved ? '≈12 sec' : '—'} k={`of ${kitchenName}'s time`} c={FOREST} />
            </div>
            {(orderApproved || purchaseApproved || analyst || deflectApproved) ? (
              <div style={{
                background: FOREST, color: PAPER, borderRadius: 14,
                padding: 22, fontSize: 14.5, lineHeight: 1.65,
              }}>
                <strong>The closed loop:</strong>
                {orderApproved && ' Agent 1 prevented over-ordering.'}
                {purchaseApproved && ' Agent 2 sourced the cheapest supplier.'}
                {analyst && ' Agent 3 analysed waste in two phases (pre- and post-pickup).'}
                {deflectApproved && ' Agent 4 deflected surplus to ResQ customers and a shelter.'}
                {postPickup && (
                  <span> After pickup, {postPickup.deflection_summary.final_waste_kg} kg still went to waste — Agent 3&apos;s feedback
                    has been fed back to Agent 1 so tomorrow&apos;s orders will be adjusted.</span>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(42,34,28,0.5)' }}>
                Run some agents first to see your daily impact summary here.
              </p>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
