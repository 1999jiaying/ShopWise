'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import LogWasteModal from '@/components/LogWasteModal';
import PageHeader from '@/components/PageHeader';

const wasteItems = [
  {
    name: 'Wrong order',
    weight: '2 kg',
    cost: '€9,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 12l4-4M3 12l4 4" />
      </svg>
    ),
    chartPath: 'M0 38 C40 42, 80 34, 120 40 C160 46, 200 36, 240 42 C280 48, 320 38, 360 44 C400 50, 440 40, 480 44',
  },
  {
    name: 'Plate waste',
    weight: '2 kg',
    cost: '€8,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    ),
    chartPath: 'M0 32 C40 38, 80 28, 120 36 C160 44, 200 30, 240 38 C280 46, 320 32, 360 40 C400 48, 440 34, 480 38',
  },
  {
    name: 'Over-prep',
    weight: '1 kg',
    cost: '€4,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12M6 8c0-2 1-4 6-4s6 2 6 4M6 8l1 10h10L18 8" />
        <path d="M10 12h4" />
      </svg>
    ),
    chartPath: 'M0 44 C40 40, 80 46, 120 42 C160 38, 200 44, 240 40 C280 36, 320 42, 360 38 C400 34, 440 40, 480 36',
  },
  {
    name: 'Spoilage',
    weight: '0 kg',
    cost: '€0,00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    chartPath: 'M0 50 C40 48, 80 50, 120 48 C160 46, 200 50, 240 48 C280 46, 320 48, 360 46 C400 44, 440 46, 480 44',
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

  return (
    <AppShell title="Dashboard">
      {showLogWaste && (
        <LogWasteModal
          onClose={() => setShowLogWaste(false)}
          onSubmit={(data) => console.log('Waste logged:', data)}
        />
      )}

      <PageHeader
        title="By Waste Type"
        breadcrumb={{ label: 'Dashboard', href: '/dashboard' }}
        onAddWaste={() => setShowLogWaste(true)}
      />

      {/* By Waste Type card */}
      <div className="app-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            BY WASTE TYPE
          </h3>
        </div>

        {wasteItems.map((item, i) => {
          const isExpanded = expanded === item.name;
          return (
            <div key={item.name} style={{ borderBottom: i < wasteItems.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
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
      <div className="app-card-green" style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-700)', marginBottom: 16 }}>Recommendations</h3>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendations.map((r, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>{r}</li>
            ))}
          </ol>
        </div>
        <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
            <ellipse cx="60" cy="100" rx="40" ry="6" fill="var(--green-100)" />
            <rect x="20" y="55" width="55" height="38" rx="6" fill="var(--gray-200)" />
            <rect x="24" y="59" width="47" height="28" rx="3" fill="#fff" />
            <circle cx="85" cy="60" r="22" fill="var(--green-600)" />
            <circle cx="78" cy="60" r="5" fill="#fff" />
            <circle cx="85" cy="60" r="5" fill="#fff" />
            <circle cx="92" cy="60" r="5" fill="#fff" />
            <rect x="36" y="93" width="22" height="7" rx="2" fill="var(--gray-300)" />
          </svg>
        </div>
      </div>
    </AppShell>
  );
}
