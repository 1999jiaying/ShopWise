'use client';

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
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <header className="app-header">
          <div>
            <h1 className="app-header-title">{title}</h1>
            <p className="app-header-date">{formatFinnishDate()}</p>
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
