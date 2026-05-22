'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav>
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          Shop<span style={{ color: 'var(--green)' }}>Wise</span>
        </Link>
        <div className="nav-links">
          <Link href="/sample" className="nav-link">Sample report</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/#analyze" className="nav-cta">Run a Reality Check</Link>
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
        <Link href="/sample" onClick={() => setMobileMenuOpen(false)}>Sample report</Link>
        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
        <Link href="/#analyze" onClick={() => setMobileMenuOpen(false)}>Run a Reality Check</Link>
      </div>
    </nav>
  );
}
