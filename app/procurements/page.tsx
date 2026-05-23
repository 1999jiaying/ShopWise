'use client';

import { useState, Fragment } from 'react';
import AppShell from '@/components/AppShell';

type Step = 'empty' | 'loading' | 'analyzed' | 'chat' | 'supplier' | 'confirm';

interface OrderRow {
  item: string;
  inStock: string;
  stockColor: 'red' | 'green' | 'yellow';
  toOrder: string;
  checked: boolean;
}

const initialOrders: OrderRow[] = [
  { item: 'Salmon', inStock: '0.5 kg', stockColor: 'red', toOrder: '12 kg', checked: true },
  { item: 'Potatoes', inStock: '4 kg', stockColor: 'green', toOrder: '40 kg', checked: true },
  { item: 'Dairy', inStock: '1 L', stockColor: 'red', toOrder: '25 L', checked: true },
  { item: 'Bread', inStock: '2 units', stockColor: 'yellow', toOrder: '20 units', checked: true },
];

interface SupplierPrice {
  ingredient: string;
  qty: string;
  category: string;
  prices: { [supplier: string]: { price: string; best: boolean } };
}

const suppliers = ['Mäkinen Tukku', 'Tukku Vihannes', 'Nordic Wholesale'] as const;

const supplierData: SupplierPrice[] = [
  { ingredient: 'Whole milk', qty: '25 L', category: 'DAIRY', prices: { 'Mäkinen Tukku': { price: '€0.90/L', best: false }, 'Tukku Vihannes': { price: '€0.85/L', best: true }, 'Nordic Wholesale': { price: '€0.95/L', best: false } } },
  { ingredient: 'Cream', qty: '10 L', category: 'DAIRY', prices: { 'Mäkinen Tukku': { price: '€2.10/L', best: false }, 'Tukku Vihannes': { price: '€1.95/L', best: true }, 'Nordic Wholesale': { price: '€2.20/L', best: false } } },
  { ingredient: 'Butter', qty: '4 kg', category: 'DAIRY', prices: { 'Mäkinen Tukku': { price: '€7.50/kg', best: false }, 'Tukku Vihannes': { price: '€7.20/kg', best: true }, 'Nordic Wholesale': { price: '€7.80/kg', best: false } } },
  { ingredient: 'Salad greens', qty: '6 kg', category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€2.60/kg', best: false }, 'Tukku Vihannes': { price: '€2.40/kg', best: true }, 'Nordic Wholesale': { price: '€2.55/kg', best: false } } },
  { ingredient: 'Potatoes', qty: '40 kg', category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€0.60/kg', best: false }, 'Tukku Vihannes': { price: '€0.55/kg', best: true }, 'Nordic Wholesale': { price: '€0.65/kg', best: false } } },
  { ingredient: 'Carrots', qty: '10 kg', category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€0.90/kg', best: false }, 'Tukku Vihannes': { price: '€0.85/kg', best: true }, 'Nordic Wholesale': { price: '€0.95/kg', best: false } } },
  { ingredient: 'Bread loaves', qty: '20 u', category: 'DRY GOODS', prices: { 'Mäkinen Tukku': { price: '€0.45/u', best: false }, 'Tukku Vihannes': { price: '€0.42/u', best: false }, 'Nordic Wholesale': { price: '€0.38/u', best: true } } },
  { ingredient: 'Pasta', qty: '5 kg', category: 'DRY GOODS', prices: { 'Mäkinen Tukku': { price: '€1.90/kg', best: false }, 'Tukku Vihannes': { price: '€1.85/kg', best: false }, 'Nordic Wholesale': { price: '€1.75/kg', best: true } } },
  { ingredient: 'Rice', qty: '8 kg', category: 'DRY GOODS', prices: { 'Mäkinen Tukku': { price: '€1.55/kg', best: false }, 'Tukku Vihannes': { price: '€1.50/kg', best: false }, 'Nordic Wholesale': { price: '€1.45/kg', best: true } } },
];

interface ConfirmItem {
  item: string;
  qty: string;
  unitPrice: string;
}

interface ConfirmSupplier {
  name: string;
  total: string;
  items: ConfirmItem[];
}

const confirmData: ConfirmSupplier[] = [
  {
    name: 'Mäkinen Tukku',
    total: '€41.60',
    items: [{ item: 'Chicken breast', qty: '8 kg', unitPrice: '€5.20/kg' }],
  },
  {
    name: 'Tukku Vihannes',
    total: '€114.45',
    items: [
      { item: 'Whole milk', qty: '25 L', unitPrice: '€0.85/L' },
      { item: 'Cream', qty: '10 L', unitPrice: '€1.95/L' },
      { item: 'Butter', qty: '4 kg', unitPrice: '€7.20/kg' },
      { item: 'Salad greens', qty: '6 kg', unitPrice: '€2.40/kg' },
      { item: 'Potatoes', qty: '40 kg', unitPrice: '€0.55/kg' },
      { item: 'Carrots', qty: '10 kg', unitPrice: '€0.85/kg' },
    ],
  },
  {
    name: 'Nordic Wholesale',
    total: '€129.95',
    items: [
      { item: 'Salmon fillet', qty: '12 kg', unitPrice: '€8.50/kg' },
      { item: 'Bread loaves', qty: '20 u', unitPrice: '€0.38/u' },
      { item: 'Pasta', qty: '5 kg', unitPrice: '€1.75/kg' },
      { item: 'Rice', qty: '8 kg', unitPrice: '€1.45/kg' },
    ],
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2.5,7 5.8,10.5 11.5,3.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gray-400)', cursor: 'pointer' }}>
      <path d="M11.5 2.5a1.5 1.5 0 012.12 2.12L5.5 12.75 2 14l1.25-3.5z" />
    </svg>
  );
}

export default function ProcurementsPage() {
  const [step, setStep] = useState<Step>('empty');
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [chatMsg, setChatMsg] = useState('');

  const handleForecast = () => {
    setStep('loading');
    setTimeout(() => setStep('analyzed'), 2000);
  };

  const toggleCheck = (idx: number) => {
    setOrders(prev => prev.map((r, i) => i === idx ? { ...r, checked: !r.checked } : r));
  };

  const groupedSupplier = supplierData.reduce<Record<string, SupplierPrice[]>>((acc, row) => {
    (acc[row.category] ??= []).push(row);
    return acc;
  }, {});

  /* ── Empty state ─────────────────────────────────────────── */
  if (step === 'empty') {
    return (
      <AppShell title="Procurements">
        <div className="app-card" style={{ maxWidth: 540, margin: '48px auto', textAlign: 'center', padding: '48px 32px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 20px' }}>
            <rect width="48" height="48" rx="14" fill="var(--green-50)" />
            <path d="M16 24h16M24 16v16" stroke="var(--green-500)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <p style={{ color: 'var(--gray-500)', fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
            You can forecast demand for next week and we can create the order list
          </p>
          <button className="app-btn app-btn-green" onClick={handleForecast}>
            Forecast demand and create order list
          </button>
        </div>
      </AppShell>
    );
  }

  /* ── Loading state ───────────────────────────────────────── */
  if (step === 'loading') {
    return (
      <AppShell title="Procurements">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--green-100)',
            animation: 'pulse 1.2s ease-in-out infinite',
          }} />
          <p style={{ color: 'var(--gray-500)', fontSize: 15, fontWeight: 500 }}>Analyzing demand...</p>
          <style>{`@keyframes pulse { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.15); opacity:0.6 } }`}</style>
        </div>
      </AppShell>
    );
  }

  /* ── Order list table (shared between analyzed & chat) ──── */
  const orderTable = (
    <div className="app-card" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>Order list</h3>
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--gray-400)', textTransform: 'uppercase' as const, marginBottom: 12 }}>
        ORDER LIST FOR NEXT WEEK
      </p>
      <table className="app-table">
        <thead>
          <tr>
            <th style={{ width: 40 }} />
            <th>Item</th>
            <th>In stock</th>
            <th>To order</th>
            <th style={{ width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {orders.map((row, i) => (
            <tr key={row.item}>
              <td>
                <div className={`app-checkbox${row.checked ? ' checked' : ''}`} onClick={() => toggleCheck(i)}>
                  {row.checked && <CheckIcon />}
                </div>
              </td>
              <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{row.item}</td>
              <td><span className={`stock-dot ${row.stockColor}`}>{row.inStock}</span></td>
              <td style={{ fontWeight: 600 }}>{row.toOrder}</td>
              <td><EditIcon /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {step === 'chat' && (
        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <textarea
            value={chatMsg}
            onChange={e => setChatMsg(e.target.value)}
            placeholder="I want to increase salmon more because I have 10 salmon soup pre-orders"
            style={{
              flex: 1, resize: 'vertical', minHeight: 56, padding: '12px 14px',
              borderRadius: 10, border: '1px solid var(--gray-300)', fontSize: 14,
              fontFamily: 'inherit', color: 'var(--gray-700)', lineHeight: 1.5,
            }}
          />
          <button className="app-btn app-btn-green" style={{ alignSelf: 'flex-end' }}>Send</button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>+ Add more</button>
          <button className="app-btn app-btn-outline" style={{ fontSize: 13 }} onClick={() => setStep('chat')}>
            Adjust with AI
          </button>
        </div>
        <button className="app-btn app-btn-green" onClick={() => setStep('supplier')}>
          Confirm order list
        </button>
      </div>
    </div>
  );

  /* ── Supplier comparison modal ───────────────────────────── */
  const supplierModal = step === 'supplier' && (
    <div className="app-overlay" onClick={() => setStep('analyzed')}>
      <div className="app-modal" style={{ maxWidth: 1000 }} onClick={e => e.stopPropagation()}>
        <div className="app-modal-header">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Confirm the supplier</h2>
            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 2 }}>Prices fetched from 3 suppliers</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>Refresh prices</button>
            <button className="app-btn app-btn-green" style={{ fontSize: 13 }} onClick={() => setStep('confirm')}>Next →</button>
            <button
              onClick={() => setStep('analyzed')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)', padding: '4px 8px' }}
            >×</button>
          </div>
        </div>
        <div className="app-modal-body">
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            <div className="app-card" style={{ padding: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Items to order</p>
              <p style={{ fontSize: 22, fontWeight: 700 }}>12</p>
            </div>
            <div className="app-card" style={{ padding: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Suppliers checked</p>
              <p style={{ fontSize: 22, fontWeight: 700 }}>3</p>
            </div>
            <div className="app-card" style={{ padding: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Combined total</p>
              <p style={{ fontSize: 22, fontWeight: 700 }}>€286.00</p>
            </div>
            <div className="app-card" style={{ padding: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Saving</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--green-600)' }}>€31.40</p>
            </div>
          </div>

          {/* Comparison table */}
          <table className="app-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Qty</th>
                {suppliers.map(s => <th key={s}>{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSupplier).map(([cat, items]) => (
                <Fragment key={cat}>
                  <tr>
                    <td colSpan={5} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--gray-400)', background: 'var(--gray-50)', padding: '8px 16px' }}>
                      {cat}
                    </td>
                  </tr>
                  {items.map(row => (
                    <tr key={row.ingredient}>
                      <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{row.ingredient}</td>
                      <td>{row.qty}</td>
                      {suppliers.map(s => (
                        <td key={s} style={row.prices[s].best ? { background: 'var(--green-50)', fontWeight: 600, color: 'var(--green-700)' } : {}}>
                          {row.prices[s].price}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>

          {/* Insight callout */}
          <div style={{ marginTop: 20, background: 'var(--yellow-50)', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 20px', fontSize: 13, color: '#92400E', lineHeight: 1.7 }}>
            <strong>Tukku Vihannes</strong> is €1.25/kg cheaper on dairy but you currently have Mäkinen Tukku selected for those items. Switching dairy to Vihannes would save an additional <strong>€8.75</strong> on this order.
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Confirm order modal ─────────────────────────────────── */
  const confirmModal = step === 'confirm' && (
    <div className="app-overlay" onClick={() => setStep('supplier')}>
      <div className="app-modal" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        <div className="app-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="app-btn app-btn-outline" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setStep('supplier')}>← Back</button>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Review the order list</h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>Refresh prices</button>
            <button className="app-btn app-btn-green" style={{ fontSize: 13 }} onClick={() => alert('Order confirmed!')}>Confirm order</button>
            <button
              onClick={() => setStep('supplier')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)', padding: '4px 8px' }}
            >×</button>
          </div>
        </div>
        <div className="app-modal-body">
          {confirmData.map(supplier => (
            <div key={supplier.name} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{supplier.name}</h4>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-500)' }}>{supplier.total}</span>
              </div>
              <table className="app-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ color: 'var(--green-600)' }}>Item</th>
                    <th>Qty</th>
                    <th>Unit price</th>
                  </tr>
                </thead>
                <tbody>
                  {supplier.items.map(item => (
                    <tr key={item.item}>
                      <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item.item}</td>
                      <td>{item.qty}</td>
                      <td>{item.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Analyzed / Chat state (main view) ───────────────────── */
  return (
    <AppShell title="Procurements">
      {/* Insight card */}
      <div className="app-card" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 14 }}>
            Insight
          </h3>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 8, lineHeight: 1.6 }}>
            &ldquo;Rainy Saturday — trim perishables, keep comfort dishes stocked.&rdquo;
          </p>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.7 }}>
            Rain + wind forecast reduces expected Saturday covers from ~120 to ~98. Historical rainy-Saturday data shows 18% drop in walk-ins. Trimming fresh proteins and leafy greens by ~20% protects against spoilage while keeping dinner service fully stocked.
          </p>
        </div>
        <div style={{ width: 120, height: 90, borderRadius: 12, background: 'var(--green-50)', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 28c0-6 4-12 10-16 6 4 10 10 10 16" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round" fill="var(--green-100)" />
            <path d="M20 12v20" stroke="var(--green-500)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>

      {/* Order list table */}
      {orderTable}

      {/* Modals */}
      {supplierModal}
      {confirmModal}
    </AppShell>
  );
}
