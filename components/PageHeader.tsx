'use client';

import Link from 'next/link';

interface Props {
  title: string;
  breadcrumb?: { label: string; href: string };
  onAddWaste: () => void;
  dateLabel?: string;
}

export default function PageHeader({
  title,
  breadcrumb,
  onAddWaste,
  dateLabel = 'This week 1.1 – 7.1.2026',
}: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      {/* Left: title or breadcrumb */}
      {breadcrumb ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
          <Link href={breadcrumb.href} style={{ color: 'var(--gray-400)', textDecoration: 'none', fontWeight: 500 }}>
            {breadcrumb.label}
          </Link>
          <span style={{ color: 'var(--gray-400)' }}>›</span>
          <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{title}</span>
        </div>
      ) : (
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>{title}</h2>
      )}

      {/* Right: Add waste + date (consistent across all pages) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="app-btn app-btn-green" onClick={onAddWaste}>
          + Add waste
        </button>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-200)', borderRadius: 999, overflow: 'hidden' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', color: 'var(--gray-500)', fontSize: 14 }}>‹</button>
          <span style={{ fontSize: 14, color: 'var(--gray-700)', fontWeight: 500, padding: '0 4px' }}>{dateLabel}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', color: 'var(--gray-500)', fontSize: 14 }}>›</button>
        </div>
      </div>
    </div>
  );
}
