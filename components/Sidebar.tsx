'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="11" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="11" width="6" height="6" rx="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/procurements',
    label: 'Procurements',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 9h4l2-6 4 12 2-6h4" />
      </svg>
    ),
  },
  {
    href: '/distribute',
    label: 'Distribute food',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 5v4l3 2" />
      </svg>
    ),
  },
  {
    href: '/configure',
    label: 'Configure',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="2.5" />
        <path d="M9 1v2M9 15v2M15.36 2.64l-1.42 1.42M4.05 12.95l-1.42 1.42M17 9h-2M3 9H1M15.36 15.36l-1.42-1.42M4.05 5.05L2.63 3.63" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#22C55E" />
            <path d="M8 14c0-4 3-7 6-7s4 2 4 4c0 3-2 5-5 6-1 .3-2 .5-3 .5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div>
          <div className="sidebar-title">Sesonki.AI</div>
          <div className="sidebar-subtitle">Matti&apos;s Bistro · Helsinki</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <svg className="sidebar-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l4 4-4 4" />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
