'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import LogWasteModal from '@/components/LogWasteModal';
import PageHeader from '@/components/PageHeader';

const foodItems = [
  {
    name: 'Salmon',
    weight: '2 kg',
    cost: '€16,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12c-4-4-8-6-12-5C4 8 2 12 2 12s2 4 8 5c4 1 8-1 12-5z" />
        <circle cx="18" cy="10" r="1" fill="var(--green-600)" stroke="none" />
        <path d="M2 12c2-2 4-3 6-3" />
      </svg>
    ),
    chartPath: 'M0 40 C40 38, 80 42, 120 39 C160 36, 200 40, 240 38 C280 36, 320 40, 360 38 C400 36, 440 39, 480 38',
  },
  {
    name: 'Salad greens',
    weight: '1.5 kg',
    cost: '€3,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" />
        <path d="M12 12C12 7 7 4 4 6c0 4 3 7 8 6z" />
        <path d="M12 12C12 7 17 4 20 6c0 4-3 7-8 6z" />
      </svg>
    ),
    chartPath: 'M0 35 C40 30, 80 40, 120 32 C160 24, 200 38, 240 30 C280 22, 320 36, 360 28 C400 20, 440 34, 480 30',
  },
  {
    name: 'Bread',
    weight: '3 kg',
    cost: '€1,20',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="10" rx="3" />
        <path d="M4 10c0-3 2-6 8-6s8 3 8 6" />
      </svg>
    ),
    chartPath: 'M0 30 C40 40, 80 25, 120 38 C160 48, 200 30, 240 42 C280 52, 320 35, 360 45 C400 52, 440 38, 480 44',
  },
];

function SparkLine({ path }: { path: string }) {
  return (
    <svg width="60" height="24" viewBox="0 0 480 60" fill="none" preserveAspectRatio="none">
      <path d={path} stroke="var(--red-500)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandedChart({ path }: { path: string }) {
  return (
    <svg width="100%" height="80" viewBox="0 0 480 60" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--red-500)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--red-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L480 60 L0 60 Z`} fill="url(#chartFade)" />
      <path d={path} stroke="var(--red-500)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const recommendations = [
  'Reduce salmon batch size on rainy days — historical data shows 18% lower demand',
  'Reduce leafy green orders by ~20% to protect against spoilage this weekend',
];

export default function FoodWastePage() {
  const [expanded, setExpanded] = useState<string | null>('Salmon');
  const [showLogWaste, setShowLogWaste] = useState(false);

  return (
    <AppShell title="Dashboard">
      {showLogWaste && (
        <LogWasteModal
          onClose={() => setShowLogWaste(false)}
          onSubmit={(data) => console.log('Waste logged:', data)}
        />
      )}

      <PageHeader
        title="By Food Waste"
        breadcrumb={{ label: 'Dashboard', href: '/dashboard' }}
        onAddWaste={() => setShowLogWaste(true)}
      />

      {/* By Food Type card */}
      <div className="app-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            BY FOOD TYPE
          </h3>
        </div>

        {foodItems.map((item, i) => {
          const isExpanded = expanded === item.name;
          return (
            <div key={item.name} style={{ borderBottom: i < foodItems.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
              {/* Row */}
              <button
                onClick={() => setExpanded(isExpanded ? null : item.name)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px', textAlign: 'left',
                }}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', flex: 1 }}>{item.name}</span>
                <span style={{ fontSize: 14, color: 'var(--gray-400)', minWidth: 48 }}>{item.weight}</span>
                <SparkLine path={item.chartPath} />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', minWidth: 56, textAlign: 'right' }}>{item.cost}</span>
                <span style={{ fontSize: 14, color: 'var(--gray-400)', marginLeft: 4 }}>{isExpanded ? '∧' : '∨'}</span>
              </button>

              {/* Expanded chart */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', marginTop: -4 }}>
                  <ExpandedChart path={item.chartPath} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="app-card-green">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-700)', marginBottom: 16 }}>Recommendations</h3>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recommendations.map((r, i) => (
            <li key={i} style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>{r}</li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
