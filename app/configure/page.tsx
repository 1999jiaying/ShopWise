'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

const wholesalers = [
  { id: 'heinon_tukku', name: 'Heinon Tukku' },
  { id: 'kespro', name: 'Kespro' },
  { id: 'metro_tukku', name: 'Metro Tukku' },
  { id: 'wihuri', name: 'Wihuri (Meira Nova)' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: checked ? 'var(--green-500)' : 'var(--gray-300)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid var(--gray-200)',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  color: 'var(--gray-800)',
  background: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--gray-500)',
  marginBottom: 6,
  display: 'block',
};

export default function ConfigurePage() {
  const [restaurantName, setRestaurantName] = useState("Linh's Bakery");
  const [city, setCity] = useState('Helsinki');

  const [agentTrigger, setAgentTrigger] = useState<'manual' | 'auto'>('manual');
  const [autoInterval, setAutoInterval] = useState('daily');
  const [analystTime, setAnalystTime] = useState('17:00');
  const [pickupDeadline, setPickupDeadline] = useState('19:30');

  const [supplierSource, setSupplierSource] = useState<'owner' | 'auto'>('owner');
  const [enabledWholesalers, setEnabledWholesalers] = useState<Record<string, boolean>>({
    heinon_tukku: true,
    kespro: true,
    metro_tukku: false,
    wihuri: false,
  });

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  function toggleWholesaler(id: string) {
    setEnabledWholesalers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AppShell title="Dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>

        {/* Restaurant Settings */}
        <div className="app-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>
            Restaurant Settings
          </h3>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Restaurant name</label>
              <input
                style={inputStyle}
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City</label>
              <input
                style={inputStyle}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="app-btn app-btn-green">Save</button>
          </div>
        </div>

        {/* Scheduling */}
        <div className="app-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>
            Scheduling
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={labelStyle}>Agent 1+2 trigger</label>
              <select
                style={inputStyle}
                value={agentTrigger}
                onChange={(e) => setAgentTrigger(e.target.value as 'manual' | 'auto')}
              >
                <option value="manual">Manual</option>
                <option value="auto">Auto schedule</option>
              </select>
            </div>
            {agentTrigger === 'auto' && (
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={labelStyle}>Interval</label>
                <select
                  style={inputStyle}
                  value={autoInterval}
                  onChange={(e) => setAutoInterval(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="every_2_days">Every 2 days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Analyst trigger time</label>
              <input
                type="time"
                style={inputStyle}
                value={analystTime}
                onChange={(e) => setAnalystTime(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pickup deadline</label>
              <input
                type="time"
                style={inputStyle}
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Supplier Configuration */}
        <div className="app-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>
            Supplier Configuration
          </h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Catalog source</label>
            <select
              style={inputStyle}
              value={supplierSource}
              onChange={(e) => setSupplierSource(e.target.value as 'owner' | 'auto')}
            >
              <option value="owner">Owner-provided</option>
              <option value="auto">Auto-fetch</option>
            </select>
          </div>
          {supplierSource === 'auto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={labelStyle}>Wholesalers</label>
              {wholesalers.map((w) => (
                <div
                  key={w.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--gray-200)',
                    background: 'var(--gray-50)',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>{w.name}</span>
                  <Toggle
                    checked={!!enabledWholesalers[w.id]}
                    onChange={() => toggleWholesaler(w.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="app-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>
            Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>SMS notifications</span>
              <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>Email notifications</span>
              <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
