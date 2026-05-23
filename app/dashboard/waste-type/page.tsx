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
    chartPath: 'M0 38 C40 42, 80 34, 120 40 C160 46, 200 36, 240 42 C280 48, 320 38, 360 44 C400 50, 440 40, 480 44',
  },
  'Plate waste': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    ),
    chartPath: 'M0 32 C40 38, 80 28, 120 36 C160 44, 200 30, 240 38 C280 46, 320 32, 360 40 C400 48, 440 34, 480 38',
  },
  'Over-prep': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12M6 8c0-2 1-4 6-4s6 2 6 4M6 8l1 10h10L18 8" />
        <path d="M10 12h4" />
      </svg>
    ),
    chartPath: 'M0 44 C40 40, 80 46, 120 42 C160 38, 200 44, 240 40 C280 36, 320 42, 360 38 C400 34, 440 40, 480 36',
  },
  'Spoilage': {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    chartPath: 'M0 50 C40 48, 80 50, 120 48 C160 46, 200 50, 240 48 C280 46, 320 48, 360 46 C400 44, 440 46, 480 44',
  },
};

const DEFAULT_VISUAL: VisualConfig = {
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 3" />
    </svg>
  ),
  chartPath: 'M0 44 C40 40, 80 46, 120 42 C160 38, 200 44, 240 40 C280 36, 320 42, 360 38 C400 34, 440 40, 480 36',
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
