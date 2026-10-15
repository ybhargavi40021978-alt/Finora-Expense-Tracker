import React, { useState, useEffect } from 'react';
import './FinoraTransactionDetailsPage.css';
import { transactionService } from './services/transactionService';
import { incomeService } from './services/incomeService';
import { expenseService } from './services/expenseService';
import { authService } from './services/authService';
import { formatINR } from './utils/currency';

/**
 * Finora Expense Tracker — Screen 13: Transaction Details Component (React)
 * Connected directly to real MongoDB backend records.
 */

export default function FinoraTransactionDetailsPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const loadTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');

      let record = null;
      if (id) {
        const res = await transactionService.getById(id);
        record = res && (res.transaction || res);
      } else {
        const res = await transactionService.getAll({ limit: 1 });
        if (res && res.transactions && res.transactions.length > 0) {
          record = res.transactions[0];
        }
      }

      if (record) {
        const isExp = record.type === 'expense';
        const formatted = {
          id: record._id,
          title: record.title,
          type: record.type,
          amount: Number(record.amount) || 0,
          category: record.category || 'General',
          categoryIcon: isExp ? 'ri-restaurant-line' : 'ri-wallet-3-line',
          date: record.date ? new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A',
          paymentMethod: record.paymentMethod || 'UPI',
          account: isExp ? (record.paidFrom || 'Primary Account') : (record.depositAccount || 'Primary Account'),
          merchant: isExp ? (record.merchant || 'Merchant') : 'Payer',
          referenceId: `TXN-${(record._id || '').slice(-6).toUpperCase()}`,
          createdOn: record.createdAt ? new Date(record.createdAt).toLocaleString('en-IN') : 'N/A',
          lastUpdated: record.updatedAt ? new Date(record.updatedAt).toLocaleString('en-IN') : 'N/A',
          description: record.notes || 'No description provided.',
          notes: record.notes || 'None'
        };
        setTransaction(formatted);
        setEditTitle(formatted.title);
        setEditAmount(formatted.amount);
      } else {
        setTransaction(null);
      }
    } catch (err) {
      console.error('Failed to load transaction details:', err);
      setError(err.message || 'Failed to load transaction details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, []);

  const isExpense = transaction ? transaction.type === 'expense' : true;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!transaction) return;
    try {
      const amt = parseFloat(editAmount);
      if (transaction.type === 'income') {
        await incomeService.update(transaction.id, { title: editTitle, amount: amt });
      } else {
        await expenseService.update(transaction.id, { title: editTitle, amount: amt });
      }
      setIsEditOpen(false);
      await loadTransaction();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update transaction.');
    }
  };

  return (
    <div className="finora-txn-details-app">
      {/* Sidebar */}
      <aside className="ftd-sidebar">
        <div>
          <div className="ftd-brand">
            <div className="ftd-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <div>
              <div className="ftd-brand-name">Finora</div>
              <div className="ftd-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="ftd-nav">
            <a href="dashboard.html" className="ftd-nav-item"><i className="ri-dashboard-line"></i> Dashboard</a>
            <a href="transactions.html" className="ftd-nav-item active"><i className="ri-exchange-dollar-line"></i> Transactions</a>
            <a href="add-income.html" className="ftd-nav-item"><i className="ri-wallet-3-line"></i> Income</a>
            <a href="add-expense.html" className="ftd-nav-item"><i className="ri-shopping-bag-3-line"></i> Expenses</a>
            <a href="analytics.html" className="ftd-nav-item"><i className="ri-pie-chart-line"></i> Analytics</a>
            <a href="budgets.html" className="ftd-nav-item"><i className="ri-funds-line"></i> Budgets</a>
            <a href="goals.html" className="ftd-nav-item"><i className="ri-flag-line"></i> Goals</a>
            <a href="categories.html" className="ftd-nav-item"><i className="ri-price-tag-3-line"></i> Categories</a>
            <a href="recurring.html" className="ftd-nav-item"><i className="ri-repeat-line"></i> Recurring</a>
            <a href="#settings" className="ftd-nav-item"><i className="ri-settings-4-line"></i> Settings</a>
          </nav>
        </div>

        <a href="login.html" className="ftd-logout">
          <i className="ri-logout-box-r-line"></i> Logout
        </a>
      </aside>

      {/* Main Workspace */}
      <main className="ftd-workspace">
        <header className="ftd-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#75809A', marginBottom: 2 }}>Dashboard / Transactions / Details</div>
            <a href="transactions.html" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#7957FF' }}>
              ← Back to Transactions
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} 
                alt={user?.name || "User avatar"}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #E8EBF3' }}
              />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="ftd-content">
          {loading ? (
            <div style={{ background: '#FFF', padding: 48, borderRadius: 14, textAlign: 'center', color: '#75809A' }}>
              Loading transaction details from MongoDB...
            </div>
          ) : !transaction ? (
            <div style={{ background: '#FFF', padding: 48, borderRadius: 14, textAlign: 'center' }}>
              <h3 style={{ color: '#11183F', marginBottom: 8 }}>No Transaction Found</h3>
              <p style={{ color: '#75809A', marginBottom: 20 }}>There are no saved transactions to display, or the requested transaction ID does not exist in the database.</p>
              <a href="transactions.html" style={{ display: 'inline-block', background: '#7957FF', color: '#FFF', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                Go to Transactions
              </a>
            </div>
          ) : (
            <>
              {/* Header Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFF', padding: 20, borderRadius: 14, border: '1px solid #E8EBF3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: isExpense ? '#FEEFF1' : '#E8F8F2', color: isExpense ? '#F06575' : '#23B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className={transaction.categoryIcon}></i>
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: 700 }}>{transaction.category}</h2>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: '#F1F4F9', padding: '2px 6px', borderRadius: 4 }}>{transaction.referenceId}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#E8F8F2', color: '#23B981', padding: '2px 8px', borderRadius: 99 }}>Completed</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditOpen(true)}
                  style={{ background: '#7957FF', color: '#FFF', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <i className="ri-edit-line"></i> Edit Transaction
                </button>
              </div>

              {/* Amount Hero Card */}
              <div className="ftd-amount-card" style={{ borderLeft: `6px solid ${isExpense ? '#F06575' : '#23B981'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#75809A', textTransform: 'uppercase' }}>Transaction Amount</div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '2.2rem', fontWeight: 800, color: isExpense ? '#F06575' : '#138E61' }}>
                    {isExpense ? '−' : '+'}{formatINR(transaction.amount)}
                  </div>
                  <div style={{ fontWeight: 600, color: '#18213D' }}>{transaction.title}</div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ background: '#F8F9FD', padding: '8px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }}>
                    <div style={{ fontSize: '0.7rem', color: '#75809A', textTransform: 'uppercase' }}>Method</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{transaction.paymentMethod}</div>
                  </div>
                  <div style={{ background: '#F8F9FD', padding: '8px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }}>
                    <div style={{ fontSize: '0.7rem', color: '#75809A', textTransform: 'uppercase' }}>Date</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{transaction.date}</div>
                  </div>
                </div>
              </div>

          {/* 2-Column Grid */}
          <div className="ftd-grid-2col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Information Card */}
              <div className="ftd-card">
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>Transaction Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Title:</span> <strong style={{ display: 'block' }}>{transaction.title}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Type:</span> <strong style={{ display: 'block' }}>Expense</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Merchant:</span> <strong style={{ display: 'block' }}>{transaction.merchant}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Account:</span> <strong style={{ display: 'block' }}>{transaction.account}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Created:</span> <strong style={{ display: 'block' }}>{transaction.createdOn}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: '#75809A' }}>Updated:</span> <strong style={{ display: 'block' }}>{transaction.lastUpdated}</strong></div>
                </div>
              </div>

              {/* Description Card */}
              <div className="ftd-card">
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.05rem', fontWeight: 700, marginBottom: 12 }}>Description & Notes</h3>
                <p style={{ fontSize: '0.875rem', color: '#18213D', marginBottom: 10 }}>{transaction.description}</p>
                <div style={{ fontSize: '0.8125rem', color: '#75809A', borderTop: '1px solid #E8EBF3', paddingTop: 10 }}>
                  <strong>Notes:</strong> {transaction.notes}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="ftd-card">
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.05rem', fontWeight: 700, marginBottom: 12 }}>Category Info</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <i className={transaction.categoryIcon} style={{ color: isExpense ? '#F06575' : '#23B981', fontSize: '1.3rem' }}></i>
                  <div>
                    <div style={{ fontWeight: 700 }}>{transaction.category}</div>
                    <div style={{ fontSize: '0.72rem', color: '#75809A' }}>{isExpense ? 'Expense' : 'Income'} Category</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#75809A' }}>Recorded in Finora MongoDB Database</div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
