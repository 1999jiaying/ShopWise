'use client';

import { useState } from 'react';

const WASTE_TYPES = ['Over-prep', 'Plate waste', 'Wrong order', 'Spoilage'] as const;
type WasteType = (typeof WASTE_TYPES)[number];

interface Props {
  onClose: () => void;
  onSubmit: (data: { item: string; quantity: string; wasteType: WasteType }) => void;
}

export default function LogWasteModal({ onClose, onSubmit }: Props) {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [wasteType, setWasteType] = useState<WasteType>('Over-prep');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item.trim() || !quantity.trim()) return;
    onSubmit({ item, quantity, wasteType });
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '32px 32px 28px',
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>Log waste</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--gray-400)', lineHeight: 1,
              padding: '2px 4px',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Item name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>
              Item name
            </label>
            <input
              type="text"
              placeholder="e.g. Salmon fillet"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              style={{
                border: '1.5px solid var(--gray-200)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 14,
                color: 'var(--gray-800)',
                outline: 'none',
                background: 'var(--gray-50, #f9fafb)',
              }}
            />
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>
              Quantity
            </label>
            <input
              type="text"
              placeholder="e.g. 1.5 kg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                border: '1.5px solid var(--gray-200)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 14,
                color: 'var(--gray-800)',
                outline: 'none',
                background: 'var(--gray-50, #f9fafb)',
              }}
            />
          </div>

          {/* Waste type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>
              Waste type
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value as WasteType)}
                style={{
                  appearance: 'none',
                  width: '100%',
                  border: '1.5px solid var(--gray-200)',
                  borderRadius: 10,
                  padding: '12px 40px 12px 14px',
                  fontSize: 14,
                  color: 'var(--gray-800)',
                  outline: 'none',
                  background: 'var(--gray-50, #f9fafb)',
                  cursor: 'pointer',
                }}
              >
                {WASTE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: 'var(--gray-400)', fontSize: 12,
                }}
              >
                ▾
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              className="app-btn app-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="app-btn app-btn-green"
              disabled={!item.trim() || !quantity.trim()}
            >
              Log waste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
