'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ShopData } from '@/lib/shopData';

interface SidebarWrapperProps {
  shopData: ShopData;
  searchParamsString: string;
  children: React.ReactNode;
}

export default function SidebarWrapper({ shopData, searchParamsString, children }: SidebarWrapperProps) {
  const [open, setOpen] = useState(false);

  const section = shopData.currentSection;
  const qs = searchParamsString ? '?' + searchParamsString : '';

  const navItems = [
    { href: `/sample${qs}`,              icon: '📊', label: 'Overview',            key: 'overview' },
    { href: `/sample/controllable${qs}`, icon: '🔧', label: 'Controllable Factors', key: 'controllable' },
    { href: `/sample/external${qs}`,     icon: '📉', label: 'External Pressures',   key: 'external' },
    { href: `/sample/benchmark${qs}`,    icon: '⚖️', label: 'Competitor Benchmark', key: 'benchmark' },
  ];

  const actionItems = [
    { href: `/sample/actions${qs}`,  icon: '✅', label: 'Priority Actions', key: 'actions' },
    { href: `/sample/strategy${qs}`, icon: '🎯', label: 'Strategy',         key: 'strategy' },
  ];

  return (
    <>
      <header className="app-header">
        <div className="container app-nav">
          <div className="app-nav-left">
            <button
              className="burger"
              aria-label="Open menu"
              onClick={() => setOpen(!open)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="2" y1="5" x2="18" y2="5" />
                <line x1="2" y1="10" x2="18" y2="10" />
                <line x1="2" y1="15" x2="18" y2="15" />
              </svg>
            </button>
            <Link href="/" className="app-brand">
              Shop<span style={{ color: 'var(--sage)' }}>Wise</span>
            </Link>
            <span className="app-sep">/</span>
            <span className="app-report-label">Reality Check Report</span>
          </div>
          <div className="app-nav-right">
            <span className="app-shop-name">{shopData.name}</span>
          </div>
        </div>
      </header>

      <div
        className={`sidebar-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <div className="container dash-layout">
        <aside className={`sidebar${open ? ' open' : ''}`} id="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-heading">Report</div>
            <ul className="sidebar-menu">
              {navItems.map(item => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={section === item.key ? 'active' : ''}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.icon}</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-section">
            <div className="sidebar-heading">Actions</div>
            <ul className="sidebar-menu">
              {actionItems.map(item => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={section === item.key ? 'active' : ''}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.icon}</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-divider" />
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none', padding: '8px 10px' }}
            onClick={() => setOpen(false)}
          >
            ← Back to home
          </Link>
        </aside>

        <main className="main">
          {children}
        </main>
      </div>
    </>
  );
}
