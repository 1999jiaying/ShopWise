'use client';

interface MetricsModalProps {
  label: string;
  value: string;
  change: string;
  onClose: () => void;
}

export default function MetricsModal({ label, value, change, onClose }: MetricsModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>
          {label}
        </h2>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-400)', marginBottom: 8, textTransform: 'uppercase' }}>
            Current Value
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
            {value}
          </div>
          <div style={{ fontSize: 14, color: 'var(--green-600)', fontWeight: 600 }}>
            {change} vs previous period
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 24 }}>
          Review the detailed breakdown of this metric to understand trends and make informed decisions about your waste management strategy.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            className="app-btn app-btn-outline"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            Close
          </button>
          <button
            className="app-btn app-btn-green"
            style={{ cursor: 'pointer' }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
