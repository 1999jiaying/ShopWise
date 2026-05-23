'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

type StockLevel = 'red' | 'green' | 'yellow';
type Step = 'give-away' | 'human-input' | 'finished';
type Tab = 'all' | 'ingredients' | 'ready-food';

type Category = 'ingredient' | 'ready-food';

interface SurplusItem {
  id: number;
  name: string;
  surplusQty: string;
  giveQty: string;
  expiresIn: string;
  checked: boolean;
  stockLevel: StockLevel;
  pickedUp: number;
  leftover: number;
  category: Category;
}

const INITIAL_ITEMS: SurplusItem[] = [
  { id: 1, name: 'Salmon', surplusQty: '0.5 kg', giveQty: '0.5', expiresIn: 'in 5 days', checked: false, stockLevel: 'red', pickedUp: 0.5, leftover: 0, category: 'ingredient' },
  { id: 2, name: 'Dairy', surplusQty: '1 L', giveQty: '1 L', expiresIn: 'in 5 days', checked: false, stockLevel: 'red', pickedUp: 1, leftover: 0, category: 'ingredient' },
  { id: 3, name: 'Bread', surplusQty: '2 units', giveQty: '2 units', expiresIn: 'in 5 days', checked: false, stockLevel: 'yellow', pickedUp: 1, leftover: 1, category: 'ingredient' },
  { id: 4, name: 'Sandwich', surplusQty: '1 pcs', giveQty: '1 pcs', expiresIn: 'in 5 days', checked: false, stockLevel: 'green', pickedUp: 1, leftover: 0, category: 'ready-food' },
  { id: 5, name: 'Carrot cake', surplusQty: '2 pcs', giveQty: '2 pcs', expiresIn: 'in 3 days', checked: false, stockLevel: 'yellow', pickedUp: 1, leftover: 1, category: 'ready-food' },
  { id: 6, name: 'Pasta salad', surplusQty: '0.5 kg', giveQty: '0.5 kg', expiresIn: 'in 2 days', checked: false, stockLevel: 'red', pickedUp: 0, leftover: 0.5, category: 'ready-food' },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13l-3.5 1 1-3.5L11.5 2.5z" />
  </svg>
);

export default function DistributePage() {
  const [step, setStep] = useState<Step>('give-away');
  const [tab, setTab] = useState<Tab>('all');
  const [items, setItems] = useState<SurplusItem[]>(INITIAL_ITEMS);

  function toggleCheck(id: number) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  const filteredItems = items.filter(it => {
    if (tab === 'ingredients') return it.category === 'ingredient';
    if (tab === 'ready-food') return it.category === 'ready-food';
    return true;
  });

  const allChecked = filteredItems.length > 0 && filteredItems.every(it => it.checked);
  const toggleAll = () => {
    const ids = new Set(filteredItems.map(it => it.id));
    setItems(prev => prev.map(it => ids.has(it.id) ? { ...it, checked: !allChecked } : it));
  };

  const handleGiveAway = () => {
    setItems(prev => prev.filter(it => it.checked));
    setStep('human-input');
  };

  const handleFinished = () => {
    setStep('finished');
  };

  function updatePickedUp(id: number, delta: number) {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const next = Math.max(0, it.pickedUp + delta);
      const giveNum = parseFloat(it.giveQty) || 0;
      return { ...it, pickedUp: next, leftover: Math.max(0, giveNum - next) };
    }));
  }

  function setPickedUpDirect(id: number, value: string) {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const clamped = Math.max(0, num);
      const giveNum = parseFloat(it.giveQty) || 0;
      return { ...it, pickedUp: clamped, leftover: Math.max(0, giveNum - clamped) };
    }));
  }

  return (
    <AppShell title="Dashboard">
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>
        Today&apos;s surplus
      </h2>

      <div className="app-tabs">
        {(['all', 'ingredients', 'ready-food'] as Tab[]).map(t => (
          <button
            key={t}
            className={`app-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? 'All' : t === 'ingredients' ? 'Ingredients' : 'Ready Food'}
          </button>
        ))}
      </div>

      <div className="app-card">
        <table className="app-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <div className={`app-checkbox${allChecked ? ' checked' : ''}`} onClick={toggleAll}>
                  {allChecked && <CheckIcon />}
                </div>
              </th>
              <th>Item</th>
              <th>Surplus quantity</th>
              <th>Give away quantity</th>
              <th>Expired date</th>
              {step === 'human-input' && <th>Picked up?</th>}
              {(step === 'human-input' || step === 'finished') && <th>Leftover</th>}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div
                    className={`app-checkbox${item.checked ? ' checked' : ''}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    {item.checked && <CheckIcon />}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td>
                  <span className={`stock-dot ${item.stockLevel}`}>
                    {item.surplusQty}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{item.giveQty}</td>
                <td style={{ color: 'var(--gray-500)' }}>{item.expiresIn}</td>

                {step === 'human-input' && (
                  <td>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updatePickedUp(item.id, -0.5)}
                      >
                        −
                      </button>
                      <input
                        className="qty-input"
                        type="number"
                        value={item.pickedUp}
                        onChange={e => setPickedUpDirect(item.id, e.target.value)}
                      />
                      <button
                        className="qty-btn"
                        onClick={() => updatePickedUp(item.id, 0.5)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                )}

                {(step === 'human-input' || step === 'finished') && (
                  <td style={{ fontWeight: 600, color: item.leftover > 0 ? 'var(--red-500)' : 'var(--gray-500)' }}>
                    {item.leftover}
                  </td>
                )}

                <td>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <PencilIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {step === 'give-away' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            <button className="app-btn app-btn-outline">+ Add more</button>
            <button className="app-btn app-btn-green" onClick={handleGiveAway}>
              Give away
            </button>
          </div>
        )}

        {step === 'human-input' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="app-btn app-btn-green" onClick={handleFinished}>
              Finished give away
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
