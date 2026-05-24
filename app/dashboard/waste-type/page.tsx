'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import LogWasteModal from '@/components/LogWasteModal';
import PageHeader from '@/components/PageHeader';
import { useWaste } from '@/context/WasteContext';

type VisualConfig = { icon: React.ReactNode; chartPath: string };

const WASTE_VISUAL: Record<string, VisualConfig> = {
  'Wrong order': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 12l4-4M3 12l4 4" />
      </svg>
    ),
    chartPath: 'M0 20 C40 50, 90 5, 150 45 C190 55, 240 10, 300 42 C340 52, 390 8, 430 35 C460 50, 475 18, 480 28',
  },
  'Plate waste': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    ),
    chartPath: 'M0 48 C50 8, 100 52, 160 12 C200 45, 250 5, 310 38 C350 55, 400 10, 440 42 C465 52, 478 20, 480 30',
  },
  'Over-prep': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12M6 8c0-2 1-4 6-4s6 2 6 4M6 8l1 10h10L18 8" />
        <path d="M10 12h4" />
      </svg>
    ),
    chartPath: 'M0 8 C45 50, 100 10, 160 48 C200 15, 250 52, 310 10 C350 45, 395 8, 440 40 C458 52, 472 15, 480 22',
  },
  'Spoilage': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    chartPath: 'M0 40 C35 12, 80 55, 140 18 C180 48, 230 5, 290 42 C330 55, 375 12, 420 38 C450 50, 468 15, 480 25',
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
        <linearGradient id="chartFadeWaste" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--red-500)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--red-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L480 60 L0 60 Z`} fill="url(#chartFadeWaste)" />
      <path d={path} stroke="var(--red-500)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const recommendations = [
  'Wrong order waste is highest — consider reviewing order confirmation steps with staff.',
  'Plate waste suggests portion sizes may be too large for certain menu items.',
];

export default function WasteTypePage() {
  const [expanded, setExpanded] = useState<string | null>('Wrong order');
  const [showLogWaste, setShowLogWaste] = useState(false);
  const { wasteTypeItems, logWaste } = useWaste();

  const items = wasteTypeItems.map(w => ({ ...w, ...(WASTE_VISUAL[w.name] ?? DEFAULT_VISUAL) }));

  return (
    <AppShell title="Dashboard">
      {showLogWaste && (
        <LogWasteModal
          onClose={() => setShowLogWaste(false)}
          onSubmit={logWaste}
        />
      )}

      <PageHeader
        title="By Waste Type"
        breadcrumb={{ label: 'Dashboard', href: '/dashboard' }}
        onAddWaste={() => setShowLogWaste(true)}
      />

      <div className="app-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div className="waste-type-header">
          <h3 className="section-label">BY WASTE TYPE</h3>
        </div>

        <div className="waste-type-rows">
          {items.map((item) => {
            const isExpanded = expanded === item.name;
            return (
              <div key={item.name} className="waste-type-row">
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
