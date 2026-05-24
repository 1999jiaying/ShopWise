'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import LogWasteModal from '@/components/LogWasteModal';
import PageHeader from '@/components/PageHeader';
import { useWaste } from '@/context/WasteContext';

type VisualConfig = { icon: React.ReactNode; chartPath: string };

const FOOD_VISUAL: Record<string, VisualConfig> = {
  'Croissant': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12c-4-4-8-6-12-5C4 8 2 12 2 12s2 4 8 5c4 1 8-1 12-5z" />
        <circle cx="18" cy="10" r="1" fill="var(--green-600)" stroke="none" />
        <path d="M2 12c2-2 4-3 6-3" />
      </svg>
    ),
    chartPath: 'M0 45 C30 10, 80 50, 140 15 C180 45, 220 8, 280 40 C320 55, 380 12, 420 35 C450 50, 465 20, 480 30',
  },
  'Salad greens': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" />
        <path d="M12 12C12 7 7 4 4 6c0 4 3 7 8 6z" />
        <path d="M12 12C12 7 17 4 20 6c0 4-3 7-8 6z" />
      </svg>
    ),
    chartPath: 'M0 30 C50 52, 100 5, 160 42 C200 55, 250 10, 300 35 C340 50, 390 8, 430 28 C455 48, 470 15, 480 25',
  },
  'Bread': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="10" rx="3" />
        <path d="M4 10c0-3 2-6 8-6s8 3 8 6" />
      </svg>
    ),
    chartPath: 'M0 10 C40 48, 90 5, 150 50 C190 15, 240 55, 300 8 C340 45, 380 10, 420 52 C450 20, 468 45, 480 18',
  },
};

const DEFAULT_VISUAL: VisualConfig = {
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 3" />
    </svg>
  ),
  chartPath: 'M0 35 C50 55, 110 8, 170 45 C210 52, 260 12, 320 40 C360 50, 400 15, 440 38 C460 48, 475 22, 480 30',
};

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
  const [expanded, setExpanded] = useState<string | null>('Croissant');
  const [showLogWaste, setShowLogWaste] = useState(false);
  const { foodItems, logWaste } = useWaste();

  const items = foodItems.map(f => ({ ...f, ...(FOOD_VISUAL[f.name] ?? DEFAULT_VISUAL) }));

  return (
    <AppShell title="Dashboard">
      {showLogWaste && (
        <LogWasteModal
          onClose={() => setShowLogWaste(false)}
          onSubmit={logWaste}
        />
      )}

      <PageHeader
        title="By Food Waste"
        breadcrumb={{ label: 'Dashboard', href: '/dashboard' }}
        onAddWaste={() => setShowLogWaste(true)}
      />

      <div className="app-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div className="food-type-header">
          <h3 className="section-label">BY FOOD TYPE</h3>
        </div>

        <div className="food-type-rows">
          {items.map((item) => {
            const isExpanded = expanded === item.name;
            return (
              <div key={item.name} className="food-type-row">
                <button
                  className="expand-row-btn"
                  onClick={() => setExpanded(isExpanded ? null : item.name)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="expand-row-name">{item.name}</span>
                  <span className="expand-row-weight">{item.weight}</span>
                  <SparkLine path={item.chartPath} />
                  <span className="expand-row-cost">{item.cost}</span>
                  <span className="expand-row-caret">{isExpanded ? '∧' : '∨'}</span>
                </button>

                {isExpanded && (
                  <div className="expand-chart">
                    <ExpandedChart path={item.chartPath} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="app-card-green">
        <h3 className="section-title" style={{ color: 'var(--green-700)' }}>Recommendations</h3>
        <ol className="recommendations-list">
          {recommendations.map((r, i) => (
            <li key={i} className="body-text">{r}</li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
