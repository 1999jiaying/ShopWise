'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav>
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          Sesonki<span>.AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/#how-it-works" className="nav-link">How it works</Link>
          <Link href="/planner" className="nav-cta">Open Planner</Link>
        </div>
        <button
          className="nav-mobile-toggle"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="2" y1="6" x2="20" y2="6" />
            <line x1="2" y1="11" x2="20" y2="11" />
            <line x1="2" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </div>
      <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
        <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
        <Link href="/planner" onClick={() => setMobileMenuOpen(false)}>Open Planner</Link>
      </div>
    </nav>
  );
}
