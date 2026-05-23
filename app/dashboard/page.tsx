'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

const metrics = [
  { label: 'MONEY SAVED', value: '€123', change: '+12%' },
  { label: 'WASTE PER CAPITA', value: '10%', change: '+2%' },
  { label: 'DEFLECTION POTENTIAL', value: '70%', change: '+2%' },
  { label: 'DAILY AVERAGE', value: '12,2 kg', change: '+2%' },
];

const byFoodType = [
  { name: 'Salmon', weight: '2kg', cost: '€16.00' },
  { name: 'Salad greens', weight: '1.5kg', cost: '€3.00' },
  { name: 'Bread', weight: '3kg', cost: '€1.20' },
];

const byWasteType = [
  { name: 'Wrong order', weight: '2kg', cost: '€9.00' },
  { name: 'Plate waste', weight: '2kg', cost: '€8.00' },
  { name: 'Over-prep', weight: '1kg', cost: '€4.00' },
];

const recommendations = [
  'Reduce salmon portions by 15% — current plate waste data shows 30% of salmon dishes are returned with significant leftovers.',
  'Reduce bread production on Mondays and Tuesdays — sales data shows 40% lower demand at the start of the week.',
];

const tabs = ['All', 'Ingredients', 'Ready Food'] as const;

type Category = 'ingredient' | 'ready-food';

const distributeItems: {
  item: string; expires: string; expiresColor: 'red' | 'yellow' | 'green';
  originalPrice: string; sellPrice: string; moneySaved: string;
  status: string; statusType: 'red' | 'green' | 'yellow'; platform: string;
  category: Category;
}[] = [
  {
    item: 'Salad greens',
    expires: '3d',
    expiresColor: 'yellow',
    originalPrice: '€5.00',
    sellPrice: '€1.00',
    moneySaved: '€1.50',
    status: 'Messaged',
    statusType: 'green',
    platform: '4 platforms',
    category: 'ingredient',
  },
  {
    item: 'Bread',
    expires: '3d',
    expiresColor: 'yellow',
    originalPrice: '€5.00',
    sellPrice: '€1.00',
    moneySaved: '€1.50',
    status: 'Confirmed',
    statusType: 'green',
    platform: 'ResQ',
    category: 'ingredient',
  },
  {
    item: 'Dairy',
    expires: '1d',
    expiresColor: 'red',
    originalPrice: '€5.00',
    sellPrice: '€1.00',
    moneySaved: '€1.50',
    status: 'Not yet messaged',
    statusType: 'red',
    platform: '',
    category: 'ingredient',
  },
  {
    item: 'Salmon fillet',
    expires: '2d',
    expiresColor: 'red',
    originalPrice: '€12.00',
    sellPrice: '€4.00',
    moneySaved: '€4.00',
    status: 'Messaged',
    statusType: 'green',
    platform: 'ResQ',
    category: 'ingredient',
  },
  {
    item: 'Sandwich (ham & cheese)',
    expires: '1d',
    expiresColor: 'red',
    originalPrice: '€6.50',
    sellPrice: '€2.00',
    moneySaved: '€2.00',
    status: 'Confirmed',
    statusType: 'green',
    platform: 'ResQ',
    category: 'ready-food',
  },
  {
    item: 'Carrot cake slice',
    expires: '2d',
    expiresColor: 'yellow',
    originalPrice: '€4.50',
    sellPrice: '€1.50',
    moneySaved: '€1.50',
    status: 'Messaged',
    statusType: 'green',
    platform: '3 platforms',
    category: 'ready-food',
  },
  {
    item: 'Pasta salad bowl',
    expires: '1d',
    expiresColor: 'red',
    originalPrice: '€8.00',
    sellPrice: '€3.00',
    moneySaved: '€3.00',
    status: 'Not yet messaged',
    statusType: 'red',
    platform: '',
    category: 'ready-food',
  },
  {
    item: 'Berry smoothie',
    expires: '1d',
    expiresColor: 'red',
    originalPrice: '€5.00',
    sellPrice: '€1.50',
    moneySaved: '€1.50',
    status: 'Confirmed',
    statusType: 'green',
    platform: 'ResQ',
    category: 'ready-food',
  },
];

function TrendLine() {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
      <path
        d="M2 16 L10 12 L18 14 L26 8 L34 10 L42 4 L46 2"
        stroke="var(--green-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DonutGauge() {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const stroke = 18;
  const circumference = Math.PI * r;
  const eatenFraction = 0.8;

  return (
    <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--red-500)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--green-500)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference * eatenFraction} ${circumference}`}
      />
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--gray-900)">
        2:8
      </text>
      <text x={cx - 24} y={cy + 22} textAnchor="middle" fontSize="11" fill="var(--green-500)" fontWeight="600">
        Eaten
      </text>
      <text x={cx + 24} y={cy + 22} textAnchor="middle" fontSize="11" fill="var(--red-500)" fontWeight="600">
        Wasted
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('All');

  return (
    <AppShell title="Dashboard">
      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>Waste report</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="app-btn app-btn-green">+ Add waste</button>
          <button className="app-btn app-btn-outline">
            This week 1.1 – 7.1.2026 &gt;
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metric-grid" style={{ marginBottom: 24 }}>
        {metrics.map((m) => (
          <div className="metric-card" key={m.label}>
            <div className="metric-card-label">{m.label}</div>
            <div className="metric-card-value">{m.value}</div>
            <div className="metric-card-change up">{m.change}</div>
            <button className="metric-card-review">Review</button>
          </div>
        ))}
      </div>

      {/* 3-column breakdown section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* By Food Type */}
        <div className="app-card">
          <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 16 }}>
            BY FOOD TYPE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {byFoodType.map((f) => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{f.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{f.weight} &middot; {f.cost}</div>
                </div>
                <TrendLine />
              </div>
            ))}
          </div>
        </div>

        {/* By Waste Type */}
        <div className="app-card">
          <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 16 }}>
            BY WASTE TYPE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {byWasteType.map((w) => (
              <div key={w.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{w.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{w.weight} &middot; {w.cost}</div>
                </div>
                <TrendLine />
              </div>
            ))}
          </div>
        </div>

        {/* Donut gauge */}
        <div className="app-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <DonutGauge />
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginTop: 12 }}>
            80% of food produced was eaten this week
          </p>
          <span className="app-badge app-badge-green" style={{ marginTop: 8 }}>+4% vs last week</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="app-card-green" style={{ marginBottom: 24, display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-700)', marginBottom: 16 }}>Recommendations</h3>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendations.map((r, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>{r}</li>
            ))}
          </ol>
        </div>
        <div style={{ width: 180, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" fill="var(--green-100)" />
            <path d="M40 70 L55 50 L65 60 L80 40" stroke="var(--green-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40" cy="70" r="4" fill="var(--green-500)" />
            <circle cx="55" cy="50" r="4" fill="var(--green-500)" />
            <circle cx="65" cy="60" r="4" fill="var(--green-500)" />
            <circle cx="80" cy="40" r="4" fill="var(--green-500)" />
          </svg>
        </div>
      </div>

      {/* Distribute food status */}
      <div className="app-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>
          Distribute food status for today
        </h3>

        <div className="app-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`app-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <table className="app-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Expires</th>
              <th>Original price</th>
              <th>Sell price</th>
              <th>Money saved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {distributeItems
              .filter((row) => {
                if (activeTab === 'Ingredients') return row.category === 'ingredient';
                if (activeTab === 'Ready Food') return row.category === 'ready-food';
                return true;
              })
              .map((row) => (
              <tr key={row.item}>
                <td style={{ fontWeight: 600 }}>{row.item}</td>
                <td>
                  <span className={`stock-dot ${row.expiresColor}`}>{row.expires}</span>
                </td>
                <td>{row.originalPrice}</td>
                <td>{row.sellPrice}</td>
                <td style={{ color: 'var(--green-600)', fontWeight: 600 }}>{row.moneySaved}</td>
                <td>
                  <span className={`app-badge app-badge-${row.statusType}`} style={{ marginRight: 6 }}>
                    {row.status}
                  </span>
                  {row.platform && (
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{row.platform}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
