import React, { useState } from 'react';
import './FinoraLoadingStates.css';

/**
 * Screen 16 — Reusable Loading Components & Skeleton UI for Finora
 * Brand Tagline: "Track. Plan. Save. Grow."
 */

// 1. Full Page Centered Loader
export function PageLoader({ title = 'Getting everything ready…', subtitle = 'Please wait while we prepare your financial overview securely.' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#F6F7FC', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EBF3', borderRadius: '20px', padding: '48px 40px', maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 12px 36px rgba(17,24,63,0.08)' }}>
        <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #7957FF 0%, #5B35E8 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#fff', fontWeight: 800 }}>
          F
        </div>
        <div className="finora-spinner-circle" style={{ marginBottom: '20px' }}></div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18213D', margin: '0 0 6px 0' }}>{title}</h2>
        <p style={{ fontSize: '0.875rem', color: '#75809A', margin: '0 0 24px 0', lineHeight: 1.5 }}>{subtitle}</p>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C7B8FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Track. Plan. Save. Grow.</span>
      </div>
    </div>
  );
}

// 2. Summary Card Skeleton
export function SummaryCardSkeleton() {
  return (
    <div className="finora-skeleton-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="finora-loading-shimmer" style={{ width: '80px', height: '14px' }}></div>
        <div className="finora-loading-shimmer" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
      </div>
      <div className="finora-loading-shimmer" style={{ width: '130px', height: '28px' }}></div>
      <div className="finora-loading-shimmer" style={{ width: '90px', height: '12px' }}></div>
    </div>
  );
}

// 3. Transactions Table Skeleton
export function TransactionTableSkeleton({ rows = 5 }) {
  return (
    <div className="finora-skeleton-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="finora-loading-shimmer" style={{ width: '140px', height: '18px' }}></div>
        <div className="finora-loading-shimmer" style={{ width: '80px', height: '18px' }}></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F0F2F7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="finora-loading-shimmer" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
            <div className="finora-loading-shimmer" style={{ width: `${120 + (i % 3) * 30}px`, height: '16px' }}></div>
          </div>
          <div className="finora-loading-shimmer" style={{ width: '80px', height: '14px' }}></div>
          <div className="finora-loading-shimmer" style={{ width: '70px', height: '16px' }}></div>
        </div>
      ))}
    </div>
  );
}

// 4. Form Submit Button with Loading State
export function FormSubmitLoader({ isLoading = false, label = 'Save Changes', loadingLabel = 'Saving…', onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        background: '#7957FF',
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 22px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '0.875rem',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        opacity: isLoading ? 0.85 : 1,
        minWidth: '150px',
        justifyContent: 'center'
      }}
    >
      {isLoading && (
        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'finoraSpin 0.8s infinite linear' }}></div>
      )}
      {isLoading ? loadingLabel : label}
    </button>
  );
}

// 5. Default Screen Preview Showcase Component
export default function FinoraLoadingStates() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFullPage, setShowFullPage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F7FC', fontFamily: 'Inter, sans-serif' }}>
      
      {showFullPage && <PageLoader />}

      {/* Sidebar (220px) */}
      <aside style={{ width: '220px', background: '#171D4C', color: '#fff', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Finora</h2>
          <span style={{ fontSize: '0.625rem', color: '#C7B8FF' }}>Track. Plan. Save. Grow.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          <div style={{ padding: '8px 12px', background: '#7957FF', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>
            Dashboard
          </div>
          <div style={{ padding: '8px 12px', color: '#A8B1D4', fontSize: '0.875rem' }}>Transactions</div>
          <div style={{ padding: '8px 12px', color: '#A8B1D4', fontSize: '0.875rem' }}>Analytics</div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header Skeleton */}
        <header style={{ height: '72px', background: '#fff', borderBottom: '1px solid #E8EBF3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="finora-loading-shimmer" style={{ width: '120px', height: '14px' }}></div>
            <div className="finora-loading-shimmer" style={{ width: '180px', height: '20px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="finora-loading-shimmer" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
          </div>
        </header>

        <div style={{ padding: '24px 32px', maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Switcher Bar */}
          <div style={{ background: '#171D4C', padding: '12px 16px', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600 }}>Loading State View:</span>
            {['dashboard', 'transactions', 'buttons'].map(v => (
              <button
                key={v}
                onClick={() => setActiveTab(v)}
                style={{
                  background: activeTab === v ? '#7957FF' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {v.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => {
                setShowFullPage(true);
                setTimeout(() => setShowFullPage(false), 2500);
              }}
              style={{ background: '#48B9F5', color: '#11183F', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Test Full Page Loader
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
              </div>
              <TransactionTableSkeleton rows={4} />
            </div>
          )}

          {activeTab === 'transactions' && (
            <TransactionTableSkeleton rows={8} />
          )}

          {activeTab === 'buttons' && (
            <div className="finora-skeleton-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Async Button Loading State</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <FormSubmitLoader
                  isLoading={isSubmitting}
                  label="+ Save Expense"
                  loadingLabel="Saving Expense…"
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => setIsSubmitting(false), 2000);
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
