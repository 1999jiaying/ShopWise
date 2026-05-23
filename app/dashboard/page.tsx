'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import LogWasteModal from '@/components/LogWasteModal';
import MetricsCard from '@/components/MetricsCard';
import PageHeader from '@/components/PageHeader';

const metrics = [
  {
    label: 'MONEY SAVED', value: '€123', change: '+12%',
    history: [
      { week: '2 weeks ago', value: '€108' },
      { week: 'Last week',   value: '€111', change: '+3%' },
      { week: 'This week',   value: '€123', change: '+12%' },
    ],
  },
  {
    label: 'WASTE PER CAPITA', value: '10%', change: '+2%',
    history: [
      { week: '2 weeks ago', value: '9.4%' },
      { week: 'Last week',   value: '9.8%', change: '+4%' },
      { week: 'This week',   value: '10%',  change: '+2%' },
    ],
  },
  {
    label: 'DEFLECTION POTENTIAL', value: '70%', change: '+2%',
    history: [
      { week: '2 weeks ago', value: '66%' },
      { week: 'Last week',   value: '68%', change: '+3%' },
      { week: 'This week',   value: '70%', change: '+3%' },
    ],
  },
  {
    label: 'DAILY AVERAGE WASTE', value: '12,2 kg', change: '+2%',
    history: [
      { week: '2 weeks ago', value: '11.8 kg' },
      { week: 'Last week',   value: '12.0 kg', change: '+2%' },
      { week: 'This week',   value: '12.2 kg', change: '+2%' },
    ],
  },
];

const byFoodType = [
  { name: 'Salmon', weight: '2kg', cost: '€16.00' },
  { name: 'Salad greens', weight: '1.5kg', cost: '€3.00' },
  { name: 'Bread', weight: '3kg', cost: '€1.20' },
];

const INITIAL_BY_WASTE_TYPE = [
  { name: 'Wrong order', weight: '2kg', cost: '€9.00' },
  { name: 'Plate waste', weight: '2kg', cost: '€8.00' },
  { name: 'Over-prep', weight: '1kg', cost: '€4.00' },
];

function parseKg(str: string): number {
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

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

function TrendLine({ delay = 0 }: { delay?: number }) {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
      <path
        d="M2 16 L10 12 L18 14 L26 8 L34 10 L42 4 L46 2"
        stroke="var(--green-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="60"
        strokeDashoffset="60"
        style={{ animation: `draw-trend 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards` }}
      />
    </svg>
  );
}

function DonutGauge() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const stroke = 18;
  const circumference = Math.PI * r;
  const eatenFraction = 0.8;
  const dashLength = mounted ? circumference * eatenFraction : 0;

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
        strokeDasharray={`${dashLength} ${circumference}`}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
  const [showLogWaste, setShowLogWaste] = useState(false);
  const [byWasteType, setByWasteType] = useState(INITIAL_BY_WASTE_TYPE);

  function handleLogWaste(data: { item: string; quantity: string; wasteType: string }) {
    const incoming = parseKg(data.quantity);
    setByWasteType((prev) => {
      const idx = prev.findIndex((w) => w.name === data.wasteType);
      if (idx !== -1) {
        const updated = [...prev];
        const total = +(parseKg(updated[idx].weight) + incoming).toFixed(2);
        updated[idx] = { ...updated[idx], weight: `${total}kg` };
        return updated;
      }
      return [...prev, { name: data.wasteType, weight: `${incoming}kg`, cost: '' }];
    });
  }

  return (
    <AppShell title="Dashboard">
      {showLogWaste && (
        <LogWasteModal
          onClose={() => setShowLogWaste(false)}
          onSubmit={handleLogWaste}
        />
      )}
      <PageHeader
        title="Waste report"
        onAddWaste={() => setShowLogWaste(true)}
      />

      {/* Metric Cards */}
      <div className="metric-grid metric-grid-wrap">
        {metrics.map((m) => (
          <MetricsCard
            key={m.label}
            label={m.label}
            value={m.value}
            change={m.change}
            history={m.history}
          />
        ))}
      </div>

      {/* 3-column breakdown section */}
      <div className="breakdown-grid">
        {/* By Food Type */}
        <div className="app-card">
          <div className="breakdown-card-header">
            <h3 className="section-label">BY FOOD TYPE</h3>
            <Link href="/dashboard/food-waste" className="card-link">View all →</Link>
          </div>
          <div className="breakdown-card-divider" />
          <div className="breakdown-card-items">
            {byFoodType.map((f) => (
              <div key={f.name} className="breakdown-card-item">
                <div>
                  <div className="breakdown-item-label">{f.name}</div>
                  <div className="breakdown-item-sub">{f.weight} &middot; {f.cost}</div>
                </div>
                <TrendLine />
              </div>
            ))}
          </div>
        </div>

        {/* By Waste Type */}
        <div className="app-card" id="by-waste-type">
          <div className="breakdown-card-header">
            <h3 className="section-label">BY WASTE TYPE</h3>
            <Link href="/dashboard/waste-type" className="card-link">View all →</Link>
          </div>
          <div className="breakdown-card-divider" />
          <div className="breakdown-card-items">
            {byWasteType.map((w) => (
              <div key={w.name} className="breakdown-card-item">
                <div>
                  <div className="breakdown-item-label">{w.name}</div>
                  <div className="breakdown-item-sub">{w.weight} &middot; {w.cost}</div>
                </div>
                <TrendLine />
              </div>
            ))}
          </div>
        </div>

        {/* Donut gauge */}
        <div className="app-card donut-card-body">
          <DonutGauge />
          <p className="donut-card-caption">80% of food produced was eaten this week</p>
          <span className="app-badge app-badge-green" style={{ marginTop: 8 }}>+4% vs last week</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="app-card-green recommendations-card">
        <h3 className="section-title" style={{ color: 'var(--green-700)' }}>Recommendations</h3>
        <ol className="recommendations-list">
          {recommendations.map((r, i) => (
            <li key={i} className="body-text">{r}</li>
          ))}
        </ol>
      </div>

      {/* Distribute food status */}
      <div className="app-card">
        <h3 className="distribute-status-header">Distribute food status for today</h3>

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

        <div className="app-table-wrap">
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
                <td className="td-name">{row.item}</td>
                <td>
                  <span className={`stock-dot ${row.expiresColor}`}>{row.expires}</span>
                </td>
                <td>{row.originalPrice}</td>
                <td>{row.sellPrice}</td>
                <td className="td-green">{row.moneySaved}</td>
                <td>
                  <span className={`app-badge app-badge-${row.statusType}`} style={{ marginRight: 6 }}>
                    {row.status}
                  </span>
                  {row.platform && (
                    <span className="text-muted">{row.platform}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </AppShell>
  );
}
