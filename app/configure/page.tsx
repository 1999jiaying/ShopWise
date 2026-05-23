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
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: checked ? 'var(--forest-mid)' : 'var(--gray-300)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

export default function ConfigurePage() {
  const [restaurantName, setRestaurantName] = useState("Linh's Bakery");
  const [city, setCity] = useState('Helsinki');
  const [agentTrigger, setAgentTrigger] = useState<'manual' | 'auto'>('manual');
  const [autoInterval, setAutoInterval] = useState('daily');
  const [analystTime, setAnalystTime] = useState('17:00');
  const [pickupDeadline, setPickupDeadline] = useState('19:30');
  const [supplierSource, setSupplierSource] = useState<'owner' | 'auto'>('owner');
  const [enabledWholesalers, setEnabledWholesalers] = useState<Record<string, boolean>>({
    heinon_tukku: true, kespro: true, metro_tukku: false, wihuri: false,
  });
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  function toggleWholesaler(id: string) {
    setEnabledWholesalers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <AppShell title="Configure">
      <div className="settings-stack">

        <div className="app-card">
          <h3 className="settings-title">Restaurant Settings</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Restaurant name</label>
              <input className="form-input" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">City</label>
              <input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="app-btn app-btn-green">Save</button>
          </div>
        </div>

        <div className="app-card">
          <h3 className="settings-title">Scheduling</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Agent 1+2 trigger</label>
              <select className="form-input" value={agentTrigger} onChange={(e) => setAgentTrigger(e.target.value as 'manual' | 'auto')}>
                <option value="manual">Manual</option>
                <option value="auto">Auto schedule</option>
              </select>
            </div>
            {agentTrigger === 'auto' && (
              <div className="form-field">
                <label className="form-label">Interval</label>
                <select className="form-input" value={autoInterval} onChange={(e) => setAutoInterval(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="every_2_days">Every 2 days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-row" style={{ marginTop: 16 }}>
            <div className="form-field">
              <label className="form-label">Analyst trigger time</label>
              <input type="time" className="form-input" value={analystTime} onChange={(e) => setAnalystTime(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Pickup deadline</label>
              <input type="time" className="form-input" value={pickupDeadline} onChange={(e) => setPickupDeadline(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="app-card">
          <h3 className="settings-title">Supplier Configuration</h3>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Catalog source</label>
            <select className="form-input" value={supplierSource} onChange={(e) => setSupplierSource(e.target.value as 'owner' | 'auto')}>
              <option value="owner">Owner-provided</option>
              <option value="auto">Auto-fetch</option>
            </select>
          </div>
          {supplierSource === 'auto' && (
            <div className="flex-col" style={{ gap: 12 }}>
              <label className="form-label">Wholesalers</label>
              {wholesalers.map((w) => (
                <div key={w.id} className="wholesaler-row">
                  <span className="body-text">{w.name}</span>
                  <Toggle checked={!!enabledWholesalers[w.id]} onChange={() => toggleWholesaler(w.id)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="app-card">
          <h3 className="settings-title">Notifications</h3>
          <div className="toggle-list">
            <div className="toggle-row">
              <span className="body-text">SMS notifications</span>
              <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
            </div>
            <div className="toggle-row">
              <span className="body-text">Email notifications</span>
              <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
