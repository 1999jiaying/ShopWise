'use client';

import { useState, Fragment } from 'react';
import AppShell from '@/components/AppShell';
import { usePersistedState } from '@/hooks/usePersistedState';

type Step = 'empty' | 'loading' | 'analyzed' | 'chat' | 'supplier' | 'confirm';

interface OrderHistoryEntry {
  id: number;
  date: string;
  suppliers: ConfirmSupplier[];
  status: 'Confirmed' | 'Delivered' | 'Pending';
}

interface OrderRow {
  item: string;
  inStock: string;
  stockColor: 'red' | 'green' | 'yellow';
  toOrder: string;
  checked: boolean;
}

const initialOrders: OrderRow[] = [
  { item: 'Salmon',   inStock: '0.5 kg',  stockColor: 'red',    toOrder: '12 kg',    checked: true },
  { item: 'Potatoes', inStock: '4 kg',    stockColor: 'green',  toOrder: '40 kg',    checked: true },
  { item: 'Dairy',    inStock: '1 L',     stockColor: 'red',    toOrder: '25 L',     checked: true },
  { item: 'Bread',    inStock: '2 units', stockColor: 'yellow', toOrder: '20 units', checked: true },
];

interface SupplierPrice {
  ingredient: string;
  qty: string;
  category: string;
  prices: { [supplier: string]: { price: string; best: boolean } };
}

const suppliers = ['Mäkinen Tukku', 'Tukku Vihannes', 'Nordic Wholesale'] as const;

const supplierData: SupplierPrice[] = [
  { ingredient: 'Whole milk',   qty: '25 L',  category: 'DAIRY',         prices: { 'Mäkinen Tukku': { price: '€0.90/L',   best: false }, 'Tukku Vihannes': { price: '€0.85/L',   best: true  }, 'Nordic Wholesale': { price: '€0.95/L',   best: false } } },
  { ingredient: 'Cream',        qty: '10 L',  category: 'DAIRY',         prices: { 'Mäkinen Tukku': { price: '€2.10/L',   best: false }, 'Tukku Vihannes': { price: '€1.95/L',   best: true  }, 'Nordic Wholesale': { price: '€2.20/L',   best: false } } },
  { ingredient: 'Butter',       qty: '4 kg',  category: 'DAIRY',         prices: { 'Mäkinen Tukku': { price: '€7.50/kg',  best: false }, 'Tukku Vihannes': { price: '€7.20/kg',  best: true  }, 'Nordic Wholesale': { price: '€7.80/kg',  best: false } } },
  { ingredient: 'Salad greens', qty: '6 kg',  category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€2.60/kg',  best: false }, 'Tukku Vihannes': { price: '€2.40/kg',  best: true  }, 'Nordic Wholesale': { price: '€2.55/kg',  best: false } } },
  { ingredient: 'Potatoes',     qty: '40 kg', category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€0.60/kg',  best: false }, 'Tukku Vihannes': { price: '€0.55/kg',  best: true  }, 'Nordic Wholesale': { price: '€0.65/kg',  best: false } } },
  { ingredient: 'Carrots',      qty: '10 kg', category: 'FRESH PRODUCE', prices: { 'Mäkinen Tukku': { price: '€0.90/kg',  best: false }, 'Tukku Vihannes': { price: '€0.85/kg',  best: true  }, 'Nordic Wholesale': { price: '€0.95/kg',  best: false } } },
  { ingredient: 'Bread loaves', qty: '20 u',  category: 'DRY GOODS',     prices: { 'Mäkinen Tukku': { price: '€0.45/u',   best: false }, 'Tukku Vihannes': { price: '€0.42/u',   best: false }, 'Nordic Wholesale': { price: '€0.38/u',   best: true  } } },
  { ingredient: 'Pasta',        qty: '5 kg',  category: 'DRY GOODS',     prices: { 'Mäkinen Tukku': { price: '€1.90/kg',  best: false }, 'Tukku Vihannes': { price: '€1.85/kg',  best: false }, 'Nordic Wholesale': { price: '€1.75/kg',  best: true  } } },
  { ingredient: 'Rice',         qty: '8 kg',  category: 'DRY GOODS',     prices: { 'Mäkinen Tukku': { price: '€1.55/kg',  best: false }, 'Tukku Vihannes': { price: '€1.50/kg',  best: false }, 'Nordic Wholesale': { price: '€1.45/kg',  best: true  } } },
];

interface ConfirmItem { item: string; qty: string; unitPrice: string; }
interface ConfirmSupplier { name: string; total: string; items: ConfirmItem[]; }

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
  const [step, setStep] = usePersistedState<Step>('proc-step', 'empty');
  const [orders, setOrders] = usePersistedState<OrderRow[]>('proc-orders', initialOrders);
  const [chatMsg, setChatMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = usePersistedState<{ role: 'user' | 'ai'; text: string }[]>('proc-chat', []);
  const [orderHistory, setOrderHistory] = usePersistedState<OrderHistoryEntry[]>('proc-history', []);

  const defaultSelections: Record<string, string> = {};
  supplierData.forEach(row => {
    const best = Object.entries(row.prices).find(([, v]) => v.best);
    if (best) defaultSelections[row.ingredient] = best[0];
  });
  const [supplierSelections, setSupplierSelections] = useState<Record<string, string>>(defaultSelections);

  const selectSupplier = (ingredient: string, supplier: string) =>
    setSupplierSelections(prev => ({ ...prev, [ingredient]: supplier }));

  const computeConfirmData = (): ConfirmSupplier[] => {
    const grouped: Record<string, ConfirmItem[]> = {};
    supplierData.forEach(row => {
      const chosen = supplierSelections[row.ingredient];
      if (!chosen) return;
      if (!grouped[chosen]) grouped[chosen] = [];
      grouped[chosen].push({ item: row.ingredient, qty: row.qty, unitPrice: row.prices[chosen].price });
    });
    return Object.entries(grouped).map(([name, items]) => {
      const total = items.reduce((sum, it) => sum + parseFloat(it.unitPrice.replace('€', '')) * parseFloat(it.qty), 0);
      return { name, total: `€${total.toFixed(2)}`, items };
    });
  };

  const computedTotal = () => {
    let total = 0;
    supplierData.forEach(row => {
      const chosen = supplierSelections[row.ingredient];
      if (!chosen) return;
      total += parseFloat(row.prices[chosen].price.replace('€', '')) * parseFloat(row.qty);
    });
    return total;
  };

  const computedSaving = () => {
    let maxTotal = 0;
    supplierData.forEach(row => {
      const prices = Object.values(row.prices).map(v => parseFloat(v.price.replace('€', '')));
      maxTotal += Math.max(...prices) * parseFloat(row.qty);
    });
    return maxTotal - computedTotal();
  };

  if (step === 'loading') setStep('empty');

  const handleForecast = () => {
    setStep('loading');
    setTimeout(() => setStep('analyzed'), 2000);
  };

  const toggleCheck = (idx: number) =>
    setOrders(prev => prev.map((r, i) => i === idx ? { ...r, checked: !r.checked } : r));

  const allChecked = orders.length > 0 && orders.every(r => r.checked);
  const toggleAll = () => setOrders(prev => prev.map(r => ({ ...r, checked: !allChecked })));

  const handleSendChat = () => {
    const msg = chatMsg.trim();
    if (!msg || chatLoading) return;
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setChatMsg('');
    setChatLoading(true);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = '';
      const removeMatch = lower.match(/remove\s+(.+?)(?:\s*,|\s+from|\s+we|\s+it|$)/);
      if (removeMatch) {
        const target = removeMatch[1].trim();
        setOrders(prev => prev.filter(r => !r.item.toLowerCase().includes(target)));
        response = orders.find(r => r.item.toLowerCase().includes(target))
          ? `Done — removed "${target}" from the order list.`
          : `I couldn't find "${target}". Available: ${orders.map(r => r.item).join(', ')}.`;
      }
      const increaseMatch = lower.match(/increase\s+(.+?)\s+(?:to|by)\s+(\d+)/);
      if (!response && increaseMatch) {
        const [, target, amount] = increaseMatch;
        setOrders(prev => prev.map(r => r.item.toLowerCase().includes(target.trim())
          ? { ...r, toOrder: `${amount} ${r.toOrder.replace(/[\d.]+\s*/, '')}`.trim() } : r));
        response = `Updated — ${target.trim()} set to ${amount}.`;
      }
      const decreaseMatch = lower.match(/decrease\s+(.+?)\s+(?:to|by)\s+(\d+)/);
      if (!response && decreaseMatch) {
        const [, target, amount] = decreaseMatch;
        setOrders(prev => prev.map(r => r.item.toLowerCase().includes(target.trim())
          ? { ...r, toOrder: `${amount} ${r.toOrder.replace(/[\d.]+\s*/, '')}`.trim() } : r));
        response = `Updated — ${target.trim()} set to ${amount}.`;
      }
      const addMatch = lower.match(/add\s+(.+?)\s+(\d+)\s*(\w+)/);
      if (!response && addMatch) {
        const itemName = addMatch[1].trim().charAt(0).toUpperCase() + addMatch[1].trim().slice(1);
        setOrders(prev => [...prev, { item: itemName, inStock: '0', stockColor: 'red', toOrder: `${addMatch[2]} ${addMatch[3]}`, checked: true }]);
        response = `Added "${itemName}" (${addMatch[2]} ${addMatch[3]}) to the order list.`;
      }
      if (!response) response = `Understood — try: "remove salmon", "increase bread to 30", or "add mushrooms 5 kg".`;
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
      setChatLoading(false);
    }, 1000);
  };

  const groupedSupplier = supplierData.reduce<Record<string, SupplierPrice[]>>((acc, row) => {
    (acc[row.category] ??= []).push(row);
    return acc;
  }, {});

  /* ── Order history section ─────────────────────────────── */
  const orderHistorySection = orderHistory.length > 0 && (
    <div className="order-history-section">
      <h3 className="order-history-title">Order history</h3>
      {orderHistory.map(entry => (
        <div key={entry.id} className="app-card" style={{ marginBottom: 16 }}>
          <div className="order-history-card-hdr">
            <div className="order-history-card-lft">
              <span className="order-history-date">{entry.date}</span>
              <span className="app-badge app-badge-green">{entry.status}</span>
            </div>
            <span className="order-history-card-rgt">Order baskets ({entry.suppliers.length})</span>
          </div>
          {entry.suppliers.map(supplier => (
            <div key={supplier.name} className="supplier-box">
              <div className="supplier-box-header">
                <h4 className="supplier-name">{supplier.name}</h4>
                <span className="supplier-total">{supplier.total}</span>
              </div>
              <div className="app-table-wrap">
                <table className="app-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th className="th-green">Item</th>
                      <th>Qty</th>
                      <th>Unit price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.items.map(item => (
                      <tr key={item.item}>
                        <td className="td-name">{item.item}</td>
                        <td>{item.qty}</td>
                        <td>{item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  /* ── Empty state ────────────────────────────────────────── */
  if (step === 'empty') {
    return (
      <AppShell title="Procurements">
        <div className="app-card empty-card">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="empty-icon">
            <rect width="48" height="48" rx="14" fill="var(--green-50)" />
            <path d="M16 24h16M24 16v16" stroke="var(--green-500)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <p className="text-sm" style={{ marginBottom: 24, lineHeight: 1.7 }}>
            You can forecast demand for next week and we can create the order list
          </p>
          <button className="app-btn app-btn-green" onClick={handleForecast}>
            Forecast demand and create order list
          </button>
        </div>
        {orderHistorySection}
      </AppShell>
    );
  }

  /* ── Loading state ──────────────────────────────────────── */
  if (step === 'loading') {
    return (
      <AppShell title="Procurements">
        <div className="loading-center">
          <div className="loading-spinner" />
          <p className="text-sm" style={{ fontWeight: 500 }}>Analyzing demand...</p>
        </div>
      </AppShell>
    );
  }

  /* ── Order list table (shared: analyzed & chat) ─────────── */
  const orderTable = (
    <div className="app-card" style={{ marginTop: 20 }}>
      <div className="order-list-header">
        <h3 className="section-title">Order list</h3>
      </div>
      <p className="order-list-meta">ORDER LIST FOR NEXT WEEK</p>
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <div className={`app-checkbox${allChecked ? ' checked' : ''}`} onClick={toggleAll}>
                  {allChecked && <CheckIcon />}
                </div>
              </th>
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
                <td className="td-name">{row.item}</td>
                <td><span className={`stock-dot ${row.stockColor}`}>{row.inStock}</span></td>
                <td className="td-bold">{row.toOrder}</td>
                <td><EditIcon /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {step === 'chat' && (
        <div style={{ marginTop: 20 }}>
          {chatHistory.length > 0 && (
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`}>
                  <span className="chat-msg-label">{msg.role === 'user' ? 'You:' : 'AI:'}</span>
                  <span>{msg.text}</span>
                </div>
              ))}
              {chatLoading && <div className="chat-msg-thinking">Thinking...</div>}
            </div>
          )}
          <div className="chat-input-row">
            <textarea
              className="form-textarea"
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
              placeholder="e.g. remove salmon, increase bread to 30, add mushrooms 5 kg"
              style={{ minHeight: 56 }}
            />
            <button
              className="app-btn app-btn-green"
              style={{ alignSelf: 'flex-end', opacity: chatLoading ? 0.6 : 1 }}
              onClick={handleSendChat}
              disabled={chatLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="order-list-actions">
        <div className="order-list-btns">
          <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>+ Add more</button>
          <button className="app-btn app-btn-outline" style={{ fontSize: 13 }} onClick={() => setStep('chat')}>
            Adjust with AI
          </button>
        </div>
        <button className="app-btn app-btn-green" onClick={() => {
          setOrders(prev => prev.filter(r => r.checked));
          setStep('supplier');
        }}>
          Confirm order list
        </button>
      </div>
    </div>
  );

  /* ── Supplier comparison modal ──────────────────────────── */
  const supplierModal = step === 'supplier' && (
    <div className="app-overlay" onClick={() => setStep('analyzed')}>
      <div className="app-modal" style={{ maxWidth: 1000 }} onClick={e => e.stopPropagation()}>
        <div className="app-modal-header">
          <div className="supplier-modal-header-lft">
            <h2 className="section-title-lg" style={{ marginBottom: 0 }}>Confirm the supplier</h2>
            <p className="supplier-modal-subtitle">Prices fetched from 3 suppliers</p>
          </div>
          <div className="supplier-modal-header-rgt">
            <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>Refresh prices</button>
            <button className="app-btn app-btn-green" style={{ fontSize: 13 }} onClick={() => setStep('confirm')}>Next →</button>
            <button className="btn-close" onClick={() => setStep('analyzed')}>×</button>
          </div>
        </div>
        <div className="app-modal-body">
          <div className="stat-mini-grid">
            <div className="app-card stat-mini">
              <p className="stat-mini-label">Items to order</p>
              <p className="stat-mini-value">{supplierData.length}</p>
            </div>
            <div className="app-card stat-mini">
              <p className="stat-mini-label">Suppliers checked</p>
              <p className="stat-mini-value">{suppliers.length}</p>
            </div>
            <div className="app-card stat-mini">
              <p className="stat-mini-label">Combined total</p>
              <p className="stat-mini-value">€{computedTotal().toFixed(2)}</p>
            </div>
            <div className="app-card stat-mini">
              <p className="stat-mini-label">Saving</p>
              <p className="stat-mini-value text-green">€{computedSaving().toFixed(2)}</p>
            </div>
          </div>

          <div className="app-table-wrap">
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
                    <tr><td colSpan={5} className="td-section">{cat}</td></tr>
                    {items.map(row => (
                      <tr key={row.ingredient}>
                        <td className="td-name">{row.ingredient}</td>
                        <td>{row.qty}</td>
                        {suppliers.map(s => {
                          const isSelected = supplierSelections[row.ingredient] === s;
                          return (
                            <td
                              key={s}
                              onClick={() => selectSupplier(row.ingredient, s)}
                              style={{
                                cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s',
                                ...(isSelected ? { background: 'var(--green-50)', fontWeight: 600, color: 'var(--green-700)', border: '2px solid var(--green-400)' } : {}),
                              }}
                            >
                              {row.prices[s].price}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="callout-yellow">
            <strong>Tukku Vihannes</strong> is €1.25/kg cheaper on dairy but you currently have Mäkinen Tukku selected for those items. Switching dairy to Vihannes would save an additional <strong>€8.75</strong> on this order.
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Confirm order modal ────────────────────────────────── */
  const confirmModal = step === 'confirm' && (
    <div className="app-overlay" onClick={() => setStep('supplier')}>
      <div className="app-modal" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        <div className="app-modal-header">
          <div className="confirm-modal-lft">
            <button className="app-btn app-btn-outline" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setStep('supplier')}>← Back</button>
            <h2 className="section-title-lg" style={{ marginBottom: 0 }}>Review the order list</h2>
          </div>
          <div className="confirm-modal-rgt">
            <button className="app-btn app-btn-outline" style={{ fontSize: 13 }}>Refresh prices</button>
            <button className="app-btn app-btn-green" style={{ fontSize: 13 }} onClick={() => {
              const dateStr = new Date().toLocaleDateString('fi-FI');
              setOrderHistory(prev => [{ id: Date.now(), date: dateStr, suppliers: computeConfirmData(), status: 'Confirmed' }, ...prev]);
              setOrders(initialOrders);
              setChatHistory([]);
              setStep('empty');
            }}>Confirm order</button>
            <button className="btn-close" onClick={() => setStep('supplier')}>×</button>
          </div>
        </div>
        <div className="app-modal-body">
          {computeConfirmData().map(supplier => (
            <div key={supplier.name} className="confirm-order-section">
              <div className="confirm-order-hdr">
                <h4 className="supplier-name">{supplier.name}</h4>
                <span className="supplier-total">{supplier.total}</span>
              </div>
              <div className="app-table-wrap">
                <table className="app-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th className="th-green">Item</th>
                      <th>Qty</th>
                      <th>Unit price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.items.map(item => (
                      <tr key={item.item}>
                        <td className="td-name">{item.item}</td>
                        <td>{item.qty}</td>
                        <td>{item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Analyzed / Chat state ──────────────────────────────── */
  return (
    <AppShell title="Procurements">
      <div className="app-card" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div className="insight-body">
          <h3 className="insight-headline">Insight</h3>
          <p className="insight-quote">&ldquo;Rainy Saturday — trim perishables, keep comfort dishes stocked.&rdquo;</p>
          <p className="insight-detail">
            Rain + wind forecast reduces expected Saturday covers from ~120 to ~98. Historical rainy-Saturday data shows 18% drop in walk-ins. Trimming fresh proteins and leafy greens by ~20% protects against spoilage while keeping dinner service fully stocked.
          </p>
        </div>
        <div className="insight-illustration">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 28c0-6 4-12 10-16 6 4 10 10 10 16" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round" fill="var(--green-100)" />
            <path d="M20 12v20" stroke="var(--green-500)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>

      {orderTable}
      {supplierModal}
      {confirmModal}
    </AppShell>
  );
}
