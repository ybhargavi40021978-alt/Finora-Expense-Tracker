import React, { useState, useMemo, useEffect } from 'react';
import './FinoraTransactionsPage.css';
import { summaryService } from './services/summaryService';
import { transactionService } from './services/transactionService';
import { incomeService } from './services/incomeService';
import { expenseService } from './services/expenseService';
import { authService } from './services/authService';
import { formatINR } from './utils/currency';

/**
 * Finora Expense Tracker — Screen 5: Transactions Component (React)
 * Connected directly to real MongoDB backend APIs with full CRUD.
 */

export default function FinoraTransactionsPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewDetailsTx, setViewDetailsTx] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    payment: 'UPI',
    type: 'expense',
    status: 'Completed',
    notes: ''
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load real transactions and summary from MongoDB backend
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getAll();
      const rawList = (res && res.transactions) || [];
      const formatted = rawList.map(t => ({
        id: t._id,
        _id: t._id,
        title: t.title,
        merchant: t.type === 'expense' ? (t.merchant || t.paidFrom || 'Expense') : (t.depositAccount || 'Income'),
        category: t.category,
        date: t.date ? t.date.split('T')[0] : '',
        displayDate: t.date ? new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        payment: t.paymentMethod || 'UPI',
        amount: Number(t.amount) || 0,
        type: t.type,
        status: 'Completed',
        notes: t.notes || ''
      }));
      setTransactions(formatted);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      triggerToast('Could not load transactions from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter & Sort
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        const matchesMerchant = (tx.merchant || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesMerchant) return false;
      }
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && tx.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortBy]);

  // Summaries
  const { totalIncome, totalExpenses, netCashFlow } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += tx.amount;
      else if (tx.type === 'expense') exp += tx.amount;
    });
    return {
      totalIncome: inc,
      totalExpenses: exp,
      netCashFlow: inc - exp
    };
  }, [transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Checkbox toggle
  const toggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(currentItems.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      payment: 'UPI',
      type: 'expense',
      status: 'Completed',
      notes: ''
    });
    setIsAddEditOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      title: tx.title,
      amount: tx.amount,
      category: tx.category,
      date: tx.date,
      payment: tx.payment,
      type: tx.type,
      status: tx.status,
      notes: tx.notes || ''
    });
    setActiveMenuId(null);
    setIsAddEditOpen(true);
  };

  // Save Modal with real backend call
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || Number(formData.amount) <= 0) {
      triggerToast('Please provide a valid title and amount greater than ₹0.');
      return;
    }

    try {
      if (editingTransaction) {
        if (formData.type === 'income') {
          await incomeService.update(editingTransaction.id, {
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            paymentMethod: formData.payment,
            notes: formData.notes
          });
        } else {
          await expenseService.update(editingTransaction.id, {
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            paymentMethod: formData.payment,
            notes: formData.notes
          });
        }
        triggerToast('Transaction updated successfully in database.');
      } else {
        if (formData.type === 'income') {
          await incomeService.create({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            paymentMethod: formData.payment,
            notes: formData.notes
          });
        } else {
          await expenseService.create({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            paymentMethod: formData.payment,
            notes: formData.notes
          });
        }
        triggerToast('Transaction saved successfully to database.');
      }
      setIsAddEditOpen(false);
      await loadTransactions();
    } catch (err) {
      console.error('Error saving transaction:', err);
      triggerToast(err.message || 'Failed to save transaction to database.');
    }
  };

  // Delete with real backend call
  const confirmDelete = async () => {
    try {
      if (deleteTargetId === 'bulk') {
        await transactionService.deleteBulk(Array.from(selectedIds));
        triggerToast(`${selectedIds.size} transaction(s) deleted from database.`);
        setSelectedIds(new Set());
      } else {
        await transactionService.delete(deleteTargetId);
        triggerToast('Transaction deleted from database.');
      }
      setDeleteTargetId(null);
      await loadTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      triggerToast(err.message || 'Failed to delete transaction.');
    }
  };

  // Duplicate
  const duplicateTx = (tx) => {
    const newId = Math.max(...transactions.map(t => t.id)) + 1;
    setTransactions(prev => [{
      ...tx,
      id: newId,
      title: `${tx.title} (Copy)`
    }, ...prev]);
    setActiveMenuId(null);
    triggerToast(`Duplicated "${tx.title}"`);
  };

  // Export CSV
  const exportCSV = (dataToExport = filteredTransactions) => {
    const headers = ['ID', 'Title', 'Category', 'Date', 'Payment', 'Amount', 'Status'];
    const rows = dataToExport.map(t => [t.id, `"${t.title}"`, t.category, t.date, t.payment, t.amount, t.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finora_Transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${dataToExport.length} transactions`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
    triggerToast('Filters reset');
  };

  return (
    <div className="finora-tx-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="tx-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="tx-react-logo-area">
            <div className="tx-react-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <span className="tx-react-brand-name">Finora</span>
          </div>

          <nav className="tx-react-nav">
            <a href="dashboard.html" className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
              <span>Dashboard</span>
            </a>
            <button className="tx-react-nav-item active">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>Transactions</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Income</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Expenses</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Analytics</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              <span>Budgets</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <span>Goals</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span>Categories</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>Recurring</span>
            </button>
            <button className="tx-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="tx-react-footer">
          <a href="login.html" className="tx-react-logout">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="tx-react-main">
        {/* Header */}
        <header className="tx-react-header">
          <div className="tx-react-title-group">
            <h1>Transactions</h1>
            <p>Track and manage all your financial activity.</p>
          </div>

          <div className="tx-react-header-actions">
            <div className="tx-react-search-box">
              <span className="tx-react-search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="tx-react-btn-icon" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>

            <div className="tx-react-user">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} alt={user?.name || "User"} />
              <span>{user?.name || "User"}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="tx-react-content">
          {/* Actions Row */}
          <div className="tx-react-actions-row">
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="tx-react-btn-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7957FF" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>October 2026</span>
              </button>
              <button className="tx-react-btn-export" onClick={() => exportCSV()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export</span>
              </button>
            </div>

            <button className="tx-react-btn-add" onClick={handleOpenAdd}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>+ Add Transaction</span>
            </button>
          </div>

          {/* Summary Cards */}
          <section className="tx-react-summary-grid">
            <div className="tx-react-card">
              <div className="tx-react-card-info">
                <span className="tx-react-card-label">Total Income</span>
                <span className="tx-react-card-amount income">₹{totalIncome.toLocaleString('en-IN')}</span>
                <span className="tx-react-card-subtext">For selected period</span>
              </div>
              <div className="tx-react-card-icon income">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </div>
            </div>

            <div className="tx-react-card">
              <div className="tx-react-card-info">
                <span className="tx-react-card-label">Total Expenses</span>
                <span className="tx-react-card-amount expense">₹{totalExpenses.toLocaleString('en-IN')}</span>
                <span className="tx-react-card-subtext">For selected period</span>
              </div>
              <div className="tx-react-card-icon expense">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              </div>
            </div>

            <div className="tx-react-card">
              <div className="tx-react-card-info">
                <span className="tx-react-card-label">Net Cash Flow</span>
                <span className="tx-react-card-amount net">
                  {netCashFlow >= 0 ? '+' : '−'}₹{Math.abs(netCashFlow).toLocaleString('en-IN')}
                </span>
                <span className="tx-react-card-subtext">Income minus expenses</span>
              </div>
              <div className="tx-react-card-icon net">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
            </div>
          </section>

          {/* Management Card */}
          <div className="tx-react-mgmt-card">
            <div className="tx-react-mgmt-header">
              <div>
                <h2>All Transactions</h2>
                <p>View, search, and manage your transactions.</p>
              </div>
              <span className="tx-react-count-badge">
                Showing {currentItems.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </span>
            </div>

            {/* Toolbar */}
            <div className="tx-react-toolbar">
              <div className="tx-react-search-table">
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <select className="tx-react-select" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select className="tx-react-select" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
              </select>

              <select className="tx-react-select" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Dates</option>
                <option value="this-month">October 2026</option>
              </select>

              <select className="tx-react-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>

              <button className="tx-react-btn-clear" onClick={clearFilters}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                <span>Clear Filters</span>
              </button>
            </div>

            {/* Table */}
            <div className="tx-react-table-wrap">
              <table className="tx-react-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={currentItems.length > 0 && currentItems.every(t => selectedIds.has(t.id))}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Transaction</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px 20px', color: '#75809A' }}>
                        Loading real records from MongoDB...
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '48px 24px', color: '#75809A' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#11183F', marginBottom: 6 }}>No transactions yet</div>
                        <div style={{ fontSize: '0.85rem' }}>Saved financial records will appear here once submitted. Click "+ Add Transaction" to create your first record.</div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map(tx => (
                    <tr key={tx.id} className={selectedIds.has(tx.id) ? 'selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(tx.id)}
                          onChange={() => toggleSelectRow(tx.id)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#11183F' }}>{tx.title}</div>
                            <div style={{ fontSize: '0.775rem', color: '#75809A' }}>{tx.merchant}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`tx-react-cat-pill cat-${tx.category.toLowerCase()}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ color: '#75809A', fontSize: '0.84rem' }}>{tx.displayDate || tx.date}</td>
                      <td style={{ fontSize: '0.84rem' }}>{tx.payment}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'Plus Jakarta Sans', color: tx.type === 'income' ? '#138E61' : '#D63D4F' }}>
                        {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`tx-react-status-pill ${tx.status.toLowerCase()}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <button 
                          className="tx-react-btn-icon" 
                          style={{ width: 30, height: 30, margin: '0 auto' }}
                          onClick={() => setActiveMenuId(activeMenuId === tx.id ? null : tx.id)}
                        >
                          ⋮
                        </button>

                        {activeMenuId === tx.id && (
                          <div style={{
                            position: 'absolute',
                            right: 10,
                            top: 36,
                            background: '#FFFFFF',
                            border: '1px solid #E8EBF3',
                            borderRadius: 10,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            zIndex: 60,
                            padding: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            width: 150
                          }}>
                            <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 6 }} onClick={() => { setViewDetailsTx(tx); setActiveMenuId(null); }}>View Details</button>
                            <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 6 }} onClick={() => handleOpenEdit(tx)}>Edit</button>
                            <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 6 }} onClick={() => duplicateTx(tx)}>Duplicate</button>
                            <button style={{ padding: '8px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 6, color: '#F06575' }} onClick={() => { setDeleteTargetId(tx.id); setActiveMenuId(null); }}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="tx-react-pagination">
              <span style={{ fontSize: '0.8125rem', color: '#75809A' }}>
                Showing {currentItems.length} of {filteredTransactions.length} items
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button 
                  className="tx-react-page-btn" 
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i + 1}
                    className={`tx-react-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="tx-react-page-btn" 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <div className="tx-react-modal-overlay">
          <div className="tx-react-modal">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#11183F' }}>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={() => setIsAddEditOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={handleSaveTransaction}>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => setFormData(f => ({ ...f, type: 'expense' }))} style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: formData.type === 'expense' ? '#F06575' : '#F6F7FC', color: formData.type === 'expense' ? '#FFF' : '#18213D', cursor: 'pointer', fontWeight: 600 }}>Expense</button>
                  <button type="button" onClick={() => setFormData(f => ({ ...f, type: 'income' }))} style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: formData.type === 'income' ? '#23B981' : '#F6F7FC', color: formData.type === 'income' ? '#FFF' : '#18213D', cursor: 'pointer', fontWeight: 600 }}>Income</button>
                </div>
                <input type="text" placeholder="Transaction Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }} />
                <input type="number" placeholder="Amount (INR)" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }}>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Health">Health</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }} />
                </div>
                <select value={formData.payment} onChange={e => setFormData({ ...formData, payment: e.target.value })} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }}>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                </select>
                <textarea placeholder="Notes..." rows="2" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #E8EBF3' }}></textarea>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #E8EBF3', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setIsAddEditOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E8EBF3', background: '#FFF', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#7957FF', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="tx-react-modal-overlay">
          <div className="tx-react-modal" style={{ maxWidth: 400, padding: 24 }}>
            <h3 style={{ color: '#11183F', marginBottom: 8 }}>Confirm Deletion</h3>
            <p style={{ color: '#75809A', fontSize: '0.875rem', marginBottom: 20 }}>Are you sure you want to delete this record? This cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setDeleteTargetId(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E8EBF3', background: '#FFF', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#F06575', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#171D4C',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderLeft: '4px solid #23B981',
          zIndex: 300
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
