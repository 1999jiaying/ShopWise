'use client';

import { useState } from 'react';

interface HistoryRow {
  week: string;
  value: string;
  change?: string;
}

interface Props {
  label: string;
  value: string;
  change: string;
  history: HistoryRow[];
}

export default function MetricsCard({ label, value, change, history }: Props) {
  const [showModal, setShowModal] = useState(false);
  const direction = change.startsWith('-') ? 'down' : 'up';

  return (
    <>
      <div className="metric-card">
        <div className="metric-card-label">{label}</div>
        <div className="metric-card-value">{value}</div>
        <div className={`metric-card-change ${direction}`}>{change}</div>
        <button className="metric-card-review" onClick={() => setShowModal(true)}>Review</button>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 560,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 28px 20px' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>
                {label} — detail
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)', lineHeight: 1, padding: '2px 6px' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--gray-100)', margin: '0 28px' }} />

            {/* Date range */}
            <div style={{ padding: '16px 28px 0', fontSize: 14, color: 'var(--gray-400)' }}>
              This week 1.1 – 7.1.2026
            </div>

            {/* Table */}
            <div style={{ padding: '16px 28px 0' }}>
              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 40px', paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--gray-400)', fontWeight: 500 }}>Week</span>
                <span style={{ fontSize: 13, color: 'var(--gray-400)', fontWeight: 500 }}>Value</span>
                <span style={{ fontSize: 13, color: 'var(--gray-400)', fontWeight: 500 }}>Change</span>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-100)' }} />

              {history.map((row) => {
                const rowDir = row.change?.startsWith('-') ? 'down' : 'up';
                return (
                  <div
                    key={row.week}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 40px',
                      padding: '16px 0',
                      borderBottom: '1px solid var(--gray-100)',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>{row.week}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{row.value}</span>
                    <span style={{
                      fontSize: 15, fontWeight: 600, minWidth: 60, textAlign: 'right',
                      color: row.change ? (rowDir === 'up' ? 'var(--green-600)' : 'var(--red-500)') : 'transparent',
                    }}>
                      {row.change ? `↑ ${row.change}` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 28px 28px' }}>
              <button className="app-btn app-btn-outline" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
