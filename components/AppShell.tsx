'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

function formatFinnishDate() {
  const days = ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'];
  const months = ['tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'];
  const now = new Date();
  return `${days[now.getDay()]} ${now.getDate()}. ${months[now.getMonth()]}`;
}

export default function AppShell({ children, title, actions }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <div className="mobile-brand">
          <button
            className="app-hamburger"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="var(--forest-mid)" />
            <path d="M8 14c0-4 3-7 6-7s4 2 4 4c0 3-2 5-5 6-1 .3-2 .5-3 .5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          <div>
            <div className="mobile-brand-name">Sesonki.AI</div>
            <div className="mobile-brand-sub">Linh&apos;s Bakery · Helsinki</div>
          </div>
        </div>

        <header className="app-header">
          <div className="app-header-left">
            <div>
              <h1 className="app-header-title">{title}</h1>
              <p className="app-header-date">{formatFinnishDate()}</p>
            </div>
          </div>
          <div className="app-header-actions">
            {actions}
            <button className="app-bell" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 7a5 5 0 00-10 0c0 5-2 7-2 7h14s-2-2-2-7" />
                <path d="M8.59 17a2 2 0 002.82 0" />
              </svg>
            </button>
          </div>
        </header>
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
}
