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
    <div className="page-header">
      {/* Left: title or breadcrumb */}
      {breadcrumb ? (
        <div className="page-header-breadcrumb">
          <Link href={breadcrumb.href} className="page-header-breadcrumb-link">
            {breadcrumb.label}
          </Link>
          <span className="page-header-breadcrumb-sep">›</span>
          <span className="page-header-breadcrumb-current">{title}</span>
        </div>
      ) : (
        <h2 className="page-header-title">{title}</h2>
      )}

      {/* Right: Add waste + date */}
      <div className="page-header-actions">
        <button className="app-btn app-btn-green" onClick={onAddWaste}>
          + Add waste
        </button>
        <div className="page-header-date">
          <button className="page-header-date-btn">‹</button>
          <span className="page-header-date-label">{dateLabel}</span>
          <button className="page-header-date-btn">›</button>
        </div>
      </div>
    </div>
  );
}
