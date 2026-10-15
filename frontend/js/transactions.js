/**
 * Finora Expense Tracker — Screen 5: Transactions Page JavaScript
 * Handles dynamic filtering, searching, sorting, pagination, CRUD, bulk actions,
 * interactive modals, state switching (empty/loading/error), and CSV export.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Initial State Data (Clean 0-state, populated strictly from MongoDB)
  // =========================================================================
  const INITIAL_TRANSACTIONS = [];

  // Category Icon Map
  const CATEGORY_ICONS = {
    Salary: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    Freelance: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#199868" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    Income: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    Food: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E66A23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    Transport: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    Shopping: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    Bills: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E54859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
    Health: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    Entertainment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D81B60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    Other: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  // Payment Method Icon Map
  const PAYMENT_ICONS = {
    'Bank Transfer': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    'UPI': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    'Credit Card': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    'Debit Card': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    'Cash': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>`
  };

  // =========================================================================
  // 2. State Variables
  // =========================================================================
  let transactions = [...INITIAL_TRANSACTIONS];
  let searchQuery = '';
  let typeFilter = 'all';
  let categoryFilter = 'all';
  let dateFilter = 'all';
  let customStartDate = '';
  let customEndDate = '';
  let sortBy = 'newest';
  let currentPage = 1;
  let pageSize = 10;
  let selectedIds = new Set();
  let editingId = null;
  let deletingId = null;
  let viewDetailsId = null;
  let simulatedState = 'normal'; // 'normal', 'empty', 'no-results', 'loading', 'error'
  let currentPeriod = 'October 2026';

  // Authenticated fetch helper
  const fetchAuth = async (url, options = {}) => {
    if (window.FinoraAuth) {
      return window.FinoraAuth.fetchWithAuth(url, options);
    }
    const token = localStorage.getItem('finora_auth_token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  };

  // Format INR currency
  function formatINR(val) {
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  // Format date to "12 Oct 2026"
  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  // =========================================================================
  // 3. DOM Elements Cache
  // =========================================================================
  const elTableBody = document.getElementById('transactions-table-body');
  const elResultCount = document.getElementById('card-result-count');
  const elPaginationInfo = document.getElementById('pagination-info');
  const elPaginationButtons = document.getElementById('pagination-buttons');
  const elPageSizeSelect = document.getElementById('page-size-select');
  const elSelectAllCheckbox = document.getElementById('select-all-checkbox');
  const elBulkActionBar = document.getElementById('bulk-actions-bar');
  const elBulkCountText = document.getElementById('bulk-count-text');
  const elActiveFiltersBar = document.getElementById('active-filters-bar');
  const elActiveChipsContainer = document.getElementById('active-chips-container');
  const elStateContainer = document.getElementById('state-container');
  const elTableWrapper = document.getElementById('table-wrapper');

  // Summary Metrics Elements
  const elTotalIncome = document.getElementById('summary-total-income');
  const elTotalExpenses = document.getElementById('summary-total-expenses');
  const elNetCashflow = document.getElementById('summary-net-cashflow');

  // Filter elements
  const elSearchInput = document.getElementById('toolbar-search-input');
  const elTypeSelect = document.getElementById('filter-type-select');
  const elCategorySelect = document.getElementById('filter-category-select');
  const elDateSelect = document.getElementById('filter-date-select');
  const elSortSelect = document.getElementById('filter-sort-select');
  const elClearFiltersBtn = document.getElementById('btn-clear-filters');

  // Modals
  const elModalAddEdit = document.getElementById('modal-add-edit');
  const elModalDetails = document.getElementById('modal-details');
  const elModalDelete = document.getElementById('modal-delete');
  const elFormAddEdit = document.getElementById('form-add-edit');

  // Toasts
  const elToastContainer = document.getElementById('toast-container');

  // =========================================================================
  // 4. Toast Notification Dispatcher
  // =========================================================================
  function showToast(message, type = 'success') {
    if (!elToastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F06575" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    elToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // 5. Calculation of Summary Cards (Dynamic)
  // =========================================================================
  function updateSummaryCards(activeData) {
    let incomeSum = 0;
    let expenseSum = 0;

    // Sum matching active items
    activeData.forEach(tx => {
      if (tx.type === 'income') {
        incomeSum += Number(tx.amount);
      } else if (tx.type === 'expense') {
        expenseSum += Number(tx.amount);
      }
    });

    const netVal = incomeSum - expenseSum;

    if (elTotalIncome) elTotalIncome.textContent = formatINR(incomeSum);
    if (elTotalExpenses) elTotalExpenses.textContent = formatINR(expenseSum);
    if (elNetCashflow) {
      const sign = netVal >= 0 ? '+' : '−';
      elNetCashflow.textContent = `${sign}${formatINR(Math.abs(netVal))}`;
      if (netVal < 0) {
        elNetCashflow.className = 'summary-card-amount text-expense';
      } else {
        elNetCashflow.className = 'summary-card-amount text-net';
      }
    }
  }

  // =========================================================================
  // 6. Filtering & Sorting Engine
  // =========================================================================
  function getFilteredTransactions() {
    return transactions.filter(tx => {
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesMerchant = (tx.merchant || '').toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(q);
        const matchesPayment = (tx.payment || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesMerchant && !matchesCategory && !matchesNotes && !matchesPayment) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== 'all') {
        if (tx.type !== typeFilter) return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (tx.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }

      // Date presets
      if (dateFilter === 'this-month') {
        // e.g. Oct 2026
        if (!tx.date.startsWith('2026-10')) return false;
      } else if (dateFilter === 'today') {
        if (tx.date !== '2026-10-12') return false;
      } else if (dateFilter === 'this-week') {
        // Oct 06 to Oct 12
        if (tx.date < '2026-10-06' || tx.date > '2026-10-12') return false;
      } else if (dateFilter === 'this-year') {
        if (!tx.date.startsWith('2026')) return false;
      } else if (dateFilter === 'custom') {
        if (customStartDate && tx.date < customStartDate) return false;
        if (customEndDate && tx.date > customEndDate) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount-high') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-low') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }

  // =========================================================================
  // 7. Active Filter Chips Update
  // =========================================================================
  function updateActiveChips() {
    if (!elActiveChipsContainer || !elActiveFiltersBar) return;
    elActiveChipsContainer.innerHTML = '';
    const chips = [];

    if (searchQuery.trim() !== '') {
      chips.push({ key: 'search', label: `Search: "${searchQuery}"` });
    }
    if (typeFilter !== 'all') {
      chips.push({ key: 'type', label: `Type: ${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}` });
    }
    if (categoryFilter !== 'all') {
      chips.push({ key: 'category', label: `Category: ${categoryFilter}` });
    }
    if (dateFilter !== 'all') {
      let dateLabel = dateFilter;
      if (dateFilter === 'this-month') dateLabel = 'October 2026';
      else if (dateFilter === 'this-week') dateLabel = 'This Week';
      else if (dateFilter === 'today') dateLabel = 'Today';
      else if (dateFilter === 'this-year') dateLabel = 'Year 2026';
      else if (dateFilter === 'custom') dateLabel = `Range: ${customStartDate} to ${customEndDate}`;
      chips.push({ key: 'date', label: `Date: ${dateLabel}` });
    }

    if (chips.length > 0) {
      elActiveFiltersBar.classList.add('show');
      chips.forEach(chip => {
        const chipEl = document.createElement('span');
        chipEl.className = 'filter-chip';
        chipEl.innerHTML = `
          <span>${chip.label}</span>
          <button type="button" class="filter-chip-remove" data-remove-key="${chip.key}" aria-label="Remove filter">&times;</button>
        `;
        elActiveChipsContainer.appendChild(chipEl);
      });
    } else {
      elActiveFiltersBar.classList.remove('show');
    }
  }

  // =========================================================================
  // 8. Table & Pagination Rendering
  // =========================================================================
  function renderTable() {
    // Check if in simulated error or loading state
    if (simulatedState === 'loading') {
      renderLoadingSkeleton();
      return;
    }
    if (simulatedState === 'error') {
      renderErrorState();
      return;
    }
    if (simulatedState === 'empty') {
      renderEmptyState();
      return;
    }

    const filtered = getFilteredTransactions();
    updateSummaryCards(filtered);
    updateActiveChips();

    // Check if filtered list is empty
    if (filtered.length === 0) {
      renderNoSearchResultsState();
      return;
    }

    // Normal State with data
    if (elStateContainer) elStateContainer.style.display = 'none';
    if (elTableWrapper) elTableWrapper.style.display = 'block';

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalCount);
    const pageItems = filtered.slice(startIndex, endIndex);

    // Update Result Count text
    if (elResultCount) {
      elResultCount.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount} transactions`;
    }
    if (elPaginationInfo) {
      elPaginationInfo.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount} transactions`;
    }

    // Render table rows
    if (elTableBody) {
      elTableBody.innerHTML = pageItems.map(tx => {
        const isSelected = selectedIds.has(tx.id);
        const iconSvg = CATEGORY_ICONS[tx.category] || CATEGORY_ICONS.Other;
        const paymentSvg = PAYMENT_ICONS[tx.payment] || PAYMENT_ICONS['Bank Transfer'];
        const isIncome = tx.type === 'income';
        const amountDisplay = (isIncome ? '+' : '−') + formatINR(tx.amount);
        const amountClass = isIncome ? 'amount-income' : 'amount-expense';

        // Category badge class
        const catClass = `cat-${tx.category.toLowerCase()}`;
        // Status badge class
        const statusClass = `status-${tx.status.toLowerCase()}`;

        return `
          <tr data-id="${tx.id}" class="${isSelected ? 'row-selected' : ''}">
            <td class="th-checkbox">
              <input 
                type="checkbox" 
                class="table-checkbox row-select-checkbox" 
                data-id="${tx.id}" 
                ${isSelected ? 'checked' : ''} 
                aria-label="Select transaction ${tx.title}"
              />
            </td>
            <td>
              <div class="transaction-cell">
                <div class="tx-icon-badge ${catClass}">
                  ${iconSvg}
                </div>
                <div class="tx-info">
                  <span class="tx-title">${escapeHTML(tx.title)}</span>
                  <span class="tx-meta">${escapeHTML(tx.merchant || '')}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="category-badge ${catClass}">
                ${escapeHTML(tx.category)}
              </span>
            </td>
            <td class="date-cell">
              ${tx.displayDate || formatDateDisplay(tx.date)}
            </td>
            <td>
              <span class="payment-cell">
                ${paymentSvg}
                <span>${escapeHTML(tx.payment)}</span>
              </span>
            </td>
            <td class="amount-cell ${amountClass}">
              ${amountDisplay}
            </td>
            <td>
              <span class="status-badge ${statusClass}">
                <span class="status-dot"></span>
                <span>${escapeHTML(tx.status)}</span>
              </span>
            </td>
            <td class="th-actions">
              <div class="actions-cell-wrapper">
                <button 
                  type="button" 
                  class="btn-row-actions" 
                  data-action-toggle="${tx.id}" 
                  aria-label="Actions for ${tx.title}"
                  title="More actions"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="19" cy="12" r="1.5"></circle>
                    <circle cx="5" cy="12" r="1.5"></circle>
                  </svg>
                </button>

                <!-- Actions Menu Popover -->
                <div class="row-actions-popover" id="action-menu-${tx.id}" role="menu">
                  <button type="button" class="row-action-btn action-view-details" data-id="${tx.id}" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#75809A" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <span>View Details</span>
                  </button>
                  <button type="button" class="row-action-btn action-edit" data-id="${tx.id}" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#75809A" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <span>Edit</span>
                  </button>
                  <button type="button" class="row-action-btn action-duplicate" data-id="${tx.id}" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#75809A" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <span>Duplicate</span>
                  </button>
                  <button type="button" class="row-action-btn delete-action action-delete" data-id="${tx.id}" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F06575" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderPaginationControls(totalPages);
    updateBulkActionBar(pageItems);
  }

  // =========================================================================
  // 9. Pagination Buttons Builder
  // =========================================================================
  function renderPaginationControls(totalPages) {
    if (!elPaginationButtons) return;
    let html = '';

    // Prev Button
    html += `
      <button 
        type="button" 
        class="btn-page-arrow" 
        id="btn-page-prev" 
        ${currentPage <= 1 ? 'disabled' : ''} 
        aria-label="Previous Page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    `;

    // Numeric buttons with ellipsis
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        html += `<button type="button" class="btn-page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
    } else {
      // First Page
      html += `<button type="button" class="btn-page-number ${1 === currentPage ? 'active' : ''}" data-page="1">1</button>`;

      if (currentPage > 3) {
        html += `<span class="pagination-ellipsis">…</span>`;
      }

      // Current surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        html += `<button type="button" class="btn-page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }

      if (currentPage < totalPages - 2) {
        html += `<span class="pagination-ellipsis">…</span>`;
      }

      // Last page
      html += `<button type="button" class="btn-page-number ${totalPages === currentPage ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next Button
    html += `
      <button 
        type="button" 
        class="btn-page-arrow" 
        id="btn-page-next" 
        ${currentPage >= totalPages ? 'disabled' : ''} 
        aria-label="Next Page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;

    elPaginationButtons.innerHTML = html;
  }

  // =========================================================================
  // 10. Bulk Selection Bar Handling
  // =========================================================================
  function updateBulkActionBar(currentVisibleItems) {
    if (!elBulkActionBar) return;

    if (selectedIds.size > 0) {
      elBulkActionBar.classList.add('show');
      if (elBulkCountText) {
        elBulkCountText.textContent = `${selectedIds.size} transaction${selectedIds.size > 1 ? 's' : ''} selected`;
      }
    } else {
      elBulkActionBar.classList.remove('show');
    }

    // Header Select-all state
    if (elSelectAllCheckbox && currentVisibleItems.length > 0) {
      const allSelected = currentVisibleItems.every(tx => selectedIds.has(tx.id));
      const someSelected = currentVisibleItems.some(tx => selectedIds.has(tx.id));
      elSelectAllCheckbox.checked = allSelected;
      elSelectAllCheckbox.indeterminate = !allSelected && someSelected;
    } else if (elSelectAllCheckbox) {
      elSelectAllCheckbox.checked = false;
      elSelectAllCheckbox.indeterminate = false;
    }
  }

  // =========================================================================
  // 11. State View Renderers (Section 16: Empty, No Results, Skeleton, Error)
  // =========================================================================
  function renderEmptyState() {
    if (elTableWrapper) elTableWrapper.style.display = 'none';
    if (elActiveFiltersBar) elActiveFiltersBar.classList.remove('show');
    if (elResultCount) elResultCount.textContent = '0 transactions';
    if (elStateContainer) {
      elStateContainer.style.display = 'flex';
      elStateContainer.innerHTML = `
        <div class="state-illustration empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
            <circle cx="16" cy="14" r="1.5"></circle>
          </svg>
        </div>
        <h3 class="state-heading">No transactions yet</h3>
        <p class="state-desc">Start tracking your money by adding your first transaction.</p>
        <button type="button" class="btn-primary-add" id="btn-empty-add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>+ Add Transaction</span>
        </button>
      `;
      document.getElementById('btn-empty-add').addEventListener('click', openAddModal);
    }
    updateSummaryCards([]);
  }

  function renderNoSearchResultsState() {
    if (elTableWrapper) elTableWrapper.style.display = 'none';
    if (elResultCount) elResultCount.textContent = 'No matching transactions';
    if (elStateContainer) {
      elStateContainer.style.display = 'flex';
      elStateContainer.innerHTML = `
        <div class="state-illustration no-results">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="state-heading">No matching transactions</h3>
        <p class="state-desc">Try changing your search or filters.</p>
        <button type="button" class="btn-secondary" id="btn-state-clear-filters">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          <span>Clear Filters</span>
        </button>
      `;
      document.getElementById('btn-state-clear-filters').addEventListener('click', clearAllFilters);
    }
  }

  function renderLoadingSkeleton() {
    if (elStateContainer) elStateContainer.style.display = 'none';
    if (elTableWrapper) elTableWrapper.style.display = 'block';
    if (elResultCount) elResultCount.textContent = 'Loading transactions...';

    const skeletonRows = Array.from({ length: 6 }).map(() => `
      <tr class="skeleton-row">
        <td><div class="skeleton-box" style="width: 18px; height: 18px;"></div></td>
        <td>
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="skeleton-avatar"></div>
            <div style="display: flex; flex-direction: column; gap: 6px; width: 140px;">
              <div class="skeleton-box" style="width: 80%;"></div>
              <div class="skeleton-box" style="width: 50%;"></div>
            </div>
          </div>
        </td>
        <td><div class="skeleton-box" style="width: 70px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px;"></div></td>
        <td><div class="skeleton-box" style="width: 90px;"></div></td>
        <td><div class="skeleton-box" style="width: 80px; margin-left: auto;"></div></td>
        <td><div class="skeleton-box" style="width: 70px;"></div></td>
        <td><div class="skeleton-box" style="width: 24px; margin: 0 auto;"></div></td>
      </tr>
    `).join('');

    if (elTableBody) elTableBody.innerHTML = skeletonRows;
  }

  function renderErrorState() {
    if (elTableWrapper) elTableWrapper.style.display = 'none';
    if (elStateContainer) {
      elStateContainer.style.display = 'flex';
      elStateContainer.innerHTML = `
        <div class="state-illustration error">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="state-heading">We couldn't load your transactions.</h3>
        <p class="state-desc">There was an issue communicating with the database server.</p>
        <button type="button" class="btn-primary-modal" id="btn-error-retry">
          Try Again
        </button>
      `;
      document.getElementById('btn-error-retry').addEventListener('click', () => {
        simulatedState = 'loading';
        renderTable();
        setTimeout(() => {
          simulatedState = 'normal';
          renderTable();
          showToast('Transactions loaded successfully');
        }, 600);
      });
    }
  }

  // =========================================================================
  // 12. Modal Handlers (Add, Edit, View Details, Delete)
  // =========================================================================
  function openAddModal() {
    editingId = null;
    const modalTitle = document.getElementById('modal-add-edit-title');
    if (modalTitle) modalTitle.textContent = 'Add Transaction';

    if (elFormAddEdit) {
      elFormAddEdit.reset();
      // Defaults
      document.getElementById('tx-date').value = '2026-10-15';
      setTypeToggle('expense');
      document.getElementById('tx-status').value = 'Completed';
      document.getElementById('tx-payment').value = 'UPI';
      document.getElementById('tx-category').value = 'Food';
    }

    if (elModalAddEdit) elModalAddEdit.classList.add('show');
  }

  function openEditModal(id) {
    const tx = transactions.find(t => t.id === id || t._id === id || String(t.id) === String(id));
    if (!tx) return;
    editingId = tx._id || tx.id;

    const modalTitle = document.getElementById('modal-add-edit-title');
    if (modalTitle) modalTitle.textContent = 'Edit Transaction';

    document.getElementById('tx-title').value = tx.title;
    document.getElementById('tx-amount').value = tx.amount;
    document.getElementById('tx-category').value = tx.category;
    document.getElementById('tx-date').value = tx.date;
    document.getElementById('tx-payment').value = tx.payment;
    document.getElementById('tx-status').value = tx.status || 'Completed';
    document.getElementById('tx-notes').value = tx.notes || '';

    setTypeToggle(tx.type);

    if (elModalAddEdit) elModalAddEdit.classList.add('show');
  }

  function setTypeToggle(type) {
    const btnExpense = document.getElementById('btn-toggle-expense');
    const btnIncome = document.getElementById('btn-toggle-income');
    const inputType = document.getElementById('tx-type');

    if (type === 'income') {
      inputType.value = 'income';
      btnIncome.classList.add('active', 'type-income');
      btnExpense.classList.remove('active', 'type-expense');
    } else {
      inputType.value = 'expense';
      btnExpense.classList.add('active', 'type-expense');
      btnIncome.classList.remove('active', 'type-income');
    }
  }

  function closeModals() {
    if (elModalAddEdit) elModalAddEdit.classList.remove('show');
    if (elModalDetails) elModalDetails.classList.remove('show');
    if (elModalDelete) elModalDelete.classList.remove('show');
    editingId = null;
    deletingId = null;
  }

  function openDetailsModal(id) {
    const tx = transactions.find(t => t.id === id || t._id === id || String(t.id) === String(id));
    if (!tx) return;
    viewDetailsId = tx._id || tx.id;

    const isIncome = tx.type === 'income';
    const amountFormatted = (isIncome ? '+' : '−') + formatINR(tx.amount);
    const amountColor = isIncome ? 'var(--color-income-text)' : 'var(--color-expense-text)';

    const bodyEl = document.getElementById('modal-details-body');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="details-receipt">
          <div class="details-amount-header">
            <span class="details-amount-val" style="color: ${amountColor}">${amountFormatted}</span>
            <div style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 4px;">
              ${escapeHTML(tx.title)}
            </div>
          </div>

          <div class="details-grid">
            <div class="details-item">
              <span class="details-item-label">Transaction ID</span>
              <span class="details-item-val">#TXN-${String(tx._id || tx.id).slice(-6).toUpperCase()}</span>
            </div>
            <div class="details-item">
              <span class="details-item-label">Status</span>
              <span class="details-item-val" style="font-weight: 600; color: ${tx.status === 'Completed' ? 'var(--color-income-text)' : 'var(--color-warning-text)'}">
                ${escapeHTML(tx.status || 'Completed')}
              </span>
            </div>
            <div class="details-item">
              <span class="details-item-label">Category</span>
              <span class="details-item-val">${escapeHTML(tx.category)}</span>
            </div>
            <div class="details-item">
              <span class="details-item-label">Payment Method</span>
              <span class="details-item-val">${escapeHTML(tx.payment)}</span>
            </div>
            <div class="details-item">
              <span class="details-item-label">Date</span>
              <span class="details-item-val">${tx.displayDate || formatDateDisplay(tx.date)}</span>
            </div>
            <div class="details-item">
              <span class="details-item-label">Account / Merchant</span>
              <span class="details-item-val">${escapeHTML(tx.merchant || 'Standard Account')}</span>
            </div>
          </div>

          <div class="details-item" style="border-top: 1px solid var(--border-light); padding-top: 12px;">
            <span class="details-item-label">Notes & Description</span>
            <span class="details-item-val" style="color: var(--text-secondary); font-size: 0.84rem; line-height: 1.45;">
              ${escapeHTML(tx.notes || 'No description entered for this record.')}
            </span>
          </div>

          <div style="margin-top: 16px; border-top: 1px solid var(--border-light); padding-top: 12px; text-align: center;">
            <a href="transaction-details.html?id=${tx._id || tx.id}" style="display: inline-flex; align-items: center; gap: 6px; color: var(--color-primary-violet); font-weight: 600; font-size: 0.84rem; text-decoration: none;">
              Open Dedicated Transaction Details Page →
            </a>
          </div>
        </div>
      `;
    }

    if (elModalDetails) elModalDetails.classList.add('show');
  }

  function openDeleteConfirmModal(id) {
    deletingId = id;
    const desc = document.getElementById('modal-delete-desc');
    if (desc) {
      if (id === 'bulk') {
        desc.textContent = `Are you sure you want to permanently delete the ${selectedIds.size} selected transactions? This action cannot be undone.`;
      } else {
        const tx = transactions.find(t => t.id === id || t._id === id || String(t.id) === String(id));
        const title = tx ? `"${tx.title}"` : 'this transaction';
        desc.textContent = `Are you sure you want to delete ${title}? This action cannot be undone.`;
      }
    }
    if (elModalDelete) elModalDelete.classList.add('show');
  }

  async function handleSaveTransaction(e) {
    e.preventDefault();
    const title = document.getElementById('tx-title').value.trim();
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const category = document.getElementById('tx-category').value;
    const date = document.getElementById('tx-date').value;
    const payment = document.getElementById('tx-payment').value;
    const type = document.getElementById('tx-type').value;
    const notes = document.getElementById('tx-notes').value.trim();

    if (!title || isNaN(amount) || amount <= 0 || !date) {
      showToast('Please fill out all required fields with valid values.', 'error');
      return;
    }

    try {
      if (editingId) {
        // Find existing transaction to know its type
        const existingTx = transactions.find(t => t.id === editingId || t._id === editingId || String(t.id) === String(editingId));
        const recordType = (existingTx && existingTx.type) || type;
        const url = recordType === 'income' ? `/api/income/${editingId}` : `/api/expenses/${editingId}`;
        const payload = {
          title,
          amount,
          category,
          [recordType === 'income' ? 'incomeDate' : 'expenseDate']: date,
          paymentMethod: payment,
          description: notes
        };

        const res = await fetchAuth(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to update transaction');
        }

        showToast('Transaction updated successfully', 'success');
      } else {
        // Create new
        const url = type === 'income' ? '/api/income' : '/api/expenses';
        const payload = {
          title,
          amount,
          category,
          [type === 'income' ? 'incomeDate' : 'expenseDate']: date,
          paymentMethod: payment,
          description: notes
        };

        const res = await fetchAuth(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to save transaction');
        }

        showToast('Transaction added successfully to database', 'success');
      }

      closeModals();
      loadTransactionsFromAPI();
    } catch (err) {
      console.error('Save transaction error:', err);
      showToast(err.message || 'Error processing request', 'error');
    }
  }

  async function handleDeleteConfirmed() {
    try {
      if (deletingId === 'bulk') {
        const ids = Array.from(selectedIds);
        const res = await fetchAuth('/api/transactions/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        if (!res.ok) throw new Error('Bulk delete failed');
        showToast(`${ids.length} transaction(s) deleted successfully`, 'success');
        selectedIds.clear();
      } else if (deletingId) {
        const res = await fetchAuth(`/api/transactions/${deletingId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Delete failed');
        selectedIds.delete(deletingId);
        showToast('Transaction deleted successfully', 'success');
      }
      closeModals();
      loadTransactionsFromAPI();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Could not delete transaction', 'error');
      closeModals();
    }
  }

  async function duplicateTransaction(id) {
    const tx = transactions.find(t => t.id === id || t._id === id || String(t.id) === String(id));
    if (!tx) return;
    try {
      const url = tx.type === 'income' ? '/api/income' : '/api/expenses';
      const payload = {
        title: `${tx.title} (Copy)`,
        amount: tx.amount,
        category: tx.category,
        [tx.type === 'income' ? 'incomeDate' : 'expenseDate']: tx.date,
        paymentMethod: tx.payment,
        description: tx.notes
      };
      const res = await fetchAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to duplicate');
      showToast(`Duplicated "${tx.title}"`, 'info');
      loadTransactionsFromAPI();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // =========================================================================
  // 13. CSV Export Functionality
  // =========================================================================
  function exportToCSV(itemsToExport = null) {
    const data = itemsToExport || getFilteredTransactions();
    if (!data || data.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }

    const headers = ['Transaction ID', 'Title', 'Category', 'Date', 'Payment Method', 'Type', 'Amount (INR)', 'Status', 'Notes'];
    const rows = data.map(tx => [
      `TXN-${tx.id}`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      `"${tx.category}"`,
      tx.date,
      `"${tx.payment}"`,
      tx.type,
      tx.amount,
      tx.status,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finora_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${data.length} transactions to CSV`, 'success');
  }

  // =========================================================================
  // 14. Reset & Clear Filters
  // =========================================================================
  function clearAllFilters() {
    searchQuery = '';
    typeFilter = 'all';
    categoryFilter = 'all';
    dateFilter = 'all';
    sortBy = 'newest';
    currentPage = 1;
    customStartDate = '';
    customEndDate = '';

    if (elSearchInput) elSearchInput.value = '';
    if (elTypeSelect) elTypeSelect.value = 'all';
    if (elCategorySelect) elCategorySelect.value = 'all';
    if (elDateSelect) elDateSelect.value = 'all';
    if (elSortSelect) elSortSelect.value = 'newest';

    simulatedState = 'normal';
    renderTable();
    showToast('Filters cleared', 'info');
  }

  // =========================================================================
  // 15. Event Listeners Initialization
  // =========================================================================
  function initEventListeners() {
    // Search input
    if (elSearchInput) {
      elSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    // Header global search
    const headerSearch = document.getElementById('header-search');
    if (headerSearch) {
      headerSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (elSearchInput) elSearchInput.value = searchQuery;
        currentPage = 1;
        renderTable();
      });
    }

    // Type filter
    if (elTypeSelect) {
      elTypeSelect.addEventListener('change', (e) => {
        typeFilter = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    // Category filter
    if (elCategorySelect) {
      elCategorySelect.addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    // Date filter
    if (elDateSelect) {
      elDateSelect.addEventListener('change', (e) => {
        dateFilter = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    // Sort control
    if (elSortSelect) {
      elSortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        currentPage = 1;
        renderTable();
      });
    }

    // Clear filters button
    if (elClearFiltersBtn) {
      elClearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Page size dropdown
    if (elPageSizeSelect) {
      elPageSizeSelect.addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value, 10);
        currentPage = 1;
        renderTable();
      });
    }

    // Remove individual active filter chips
    if (elActiveChipsContainer) {
      elActiveChipsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip-remove');
        if (!btn) return;
        const key = btn.dataset.removeKey;
        if (key === 'search') {
          searchQuery = '';
          if (elSearchInput) elSearchInput.value = '';
          const hs = document.getElementById('header-search');
          if (hs) hs.value = '';
        } else if (key === 'type') {
          typeFilter = 'all';
          if (elTypeSelect) elTypeSelect.value = 'all';
        } else if (key === 'category') {
          categoryFilter = 'all';
          if (elCategorySelect) elCategorySelect.value = 'all';
        } else if (key === 'date') {
          dateFilter = 'all';
          if (elDateSelect) elDateSelect.value = 'all';
        }
        currentPage = 1;
        renderTable();
      });
    }

    // Select-All checkbox
    if (elSelectAllCheckbox) {
      elSelectAllCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        const filtered = getFilteredTransactions();
        const start = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);

        if (checked) {
          pageItems.forEach(tx => selectedIds.add(tx.id));
        } else {
          pageItems.forEach(tx => selectedIds.delete(tx.id));
        }
        renderTable();
      });
    }

    // Table body event delegation (checkboxes, row menu, action buttons)
    if (elTableBody) {
      elTableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('row-select-checkbox')) {
          const id = e.target.dataset.id;
          if (e.target.checked) {
            selectedIds.add(id);
          } else {
            selectedIds.delete(id);
          }
          const filtered = getFilteredTransactions();
          const start = (currentPage - 1) * pageSize;
          const pageItems = filtered.slice(start, start + pageSize);
          updateBulkActionBar(pageItems);

          // highlight row
          const tr = e.target.closest('tr');
          if (tr) {
            tr.classList.toggle('row-selected', e.target.checked);
          }
        }
      });

      elTableBody.addEventListener('click', (e) => {
        // Toggle row action menu
        const toggleBtn = e.target.closest('[data-action-toggle]');
        if (toggleBtn) {
          const id = toggleBtn.dataset.actionToggle;
          const menu = document.getElementById(`action-menu-${id}`);
          const isShown = menu && menu.classList.contains('show');

          // close any open menus first
          document.querySelectorAll('.row-actions-popover.show').forEach(m => m.classList.remove('show'));

          if (!isShown && menu) {
            menu.classList.add('show');
          }
          e.stopPropagation();
          return;
        }

        // View details
        const viewBtn = e.target.closest('.action-view-details');
        if (viewBtn) {
          const id = viewBtn.dataset.id;
          openDetailsModal(id);
          return;
        }

        // Edit
        const editBtn = e.target.closest('.action-edit');
        if (editBtn) {
          const id = editBtn.dataset.id;
          openEditModal(id);
          return;
        }

        // Duplicate
        const dupBtn = e.target.closest('.action-duplicate');
        if (dupBtn) {
          const id = dupBtn.dataset.id;
          duplicateTransaction(id);
          return;
        }

        // Delete
        const delBtn = e.target.closest('.action-delete');
        if (delBtn) {
          const id = delBtn.dataset.id;
          openDeleteConfirmModal(id);
          return;
        }
      });
    }

    // Pagination buttons click
    if (elPaginationButtons) {
      elPaginationButtons.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.btn-page-number');
        if (pageBtn) {
          currentPage = parseInt(pageBtn.dataset.page, 10);
          renderTable();
          return;
        }
        if (e.target.closest('#btn-page-prev') && currentPage > 1) {
          currentPage--;
          renderTable();
          return;
        }
        if (e.target.closest('#btn-page-next')) {
          const filtered = getFilteredTransactions();
          const totalPages = Math.ceil(filtered.length / pageSize) || 1;
          if (currentPage < totalPages) {
            currentPage++;
            renderTable();
          }
          return;
        }
      });
    }

    // Bulk actions
    const btnBulkDeselect = document.getElementById('btn-bulk-deselect');
    if (btnBulkDeselect) {
      btnBulkDeselect.addEventListener('click', () => {
        selectedIds.clear();
        renderTable();
      });
    }

    const btnBulkExport = document.getElementById('btn-bulk-export');
    if (btnBulkExport) {
      btnBulkExport.addEventListener('click', () => {
        const selectedList = transactions.filter(tx => selectedIds.has(tx.id));
        exportToCSV(selectedList);
      });
    }

    const btnBulkDelete = document.getElementById('btn-bulk-delete');
    if (btnBulkDelete) {
      btnBulkDelete.addEventListener('click', () => {
        openDeleteConfirmModal('bulk');
      });
    }

    // Top Header / Page Action Buttons
    const btnAddTransaction = document.getElementById('btn-add-transaction');
    if (btnAddTransaction) {
      btnAddTransaction.addEventListener('click', openAddModal);
    }

    const btnExportAll = document.getElementById('btn-export-all');
    if (btnExportAll) {
      btnExportAll.addEventListener('click', () => exportToCSV());
    }

    // Date Selector Header Button & Dropdown
    const btnDateSelector = document.getElementById('btn-date-selector');
    const dateDropdownMenu = document.getElementById('date-dropdown-menu');
    const selectedDateLabel = document.getElementById('selected-date-label');

    if (btnDateSelector && dateDropdownMenu) {
      btnDateSelector.addEventListener('click', (e) => {
        dateDropdownMenu.classList.toggle('show');
        e.stopPropagation();
      });

      dateDropdownMenu.addEventListener('click', (e) => {
        const opt = e.target.closest('.date-option-btn');
        if (opt) {
          document.querySelectorAll('.date-option-btn').forEach(b => b.classList.remove('selected'));
          opt.classList.add('selected');
          currentPeriod = opt.textContent.trim();
          if (selectedDateLabel) selectedDateLabel.textContent = currentPeriod;
          dateDropdownMenu.classList.remove('show');
          showToast(`Period changed to ${currentPeriod}`, 'info');
        }
      });
    }

    // Notification Popover Toggle
    const btnNotification = document.getElementById('btn-notification');
    const notifPopover = document.getElementById('notifications-popover');
    if (btnNotification && notifPopover) {
      btnNotification.addEventListener('click', (e) => {
        notifPopover.classList.toggle('show');
        e.stopPropagation();
      });
    }

    // User Profile Dropdown Toggle
    const userMenu = document.getElementById('user-profile-menu');
    const profilePopover = document.getElementById('profile-popover');
    if (userMenu && profilePopover) {
      userMenu.addEventListener('click', (e) => {
        profilePopover.classList.toggle('show');
        e.stopPropagation();
      });
    }

    // Mobile Sidebar Drawer Toggle
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (btnMobileMenu && sidebar && sidebarBackdrop) {
      btnMobileMenu.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        sidebarBackdrop.classList.toggle('mobile-open');
      });

      sidebarBackdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        sidebarBackdrop.classList.remove('mobile-open');
      });
    }

    // Modal forms & buttons
    if (elFormAddEdit) {
      elFormAddEdit.addEventListener('submit', handleSaveTransaction);
    }

    // Modal Type Toggle Buttons
    const btnToggleIncome = document.getElementById('btn-toggle-income');
    const btnToggleExpense = document.getElementById('btn-toggle-expense');
    if (btnToggleIncome && btnToggleExpense) {
      btnToggleIncome.addEventListener('click', () => setTypeToggle('income'));
      btnToggleExpense.addEventListener('click', () => setTypeToggle('expense'));
    }

    // Close Modal Buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeModals);
    });

    // Delete Confirmation Button
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', handleDeleteConfirmed);
    }

    // View Details Edit Button
    const btnDetailsEdit = document.getElementById('btn-details-edit');
    if (btnDetailsEdit) {
      btnDetailsEdit.addEventListener('click', () => {
        closeModals();
        if (viewDetailsId) openEditModal(viewDetailsId);
      });
    }

    // Global click listener to close popovers when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.row-actions-popover.show').forEach(m => m.classList.remove('show'));
      if (dateDropdownMenu) dateDropdownMenu.classList.remove('show');
      if (notifPopover) notifPopover.classList.remove('show');
      if (profilePopover) profilePopover.classList.remove('show');
    });

    // ESC key closes modals & menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModals();
        document.querySelectorAll('.row-actions-popover.show').forEach(m => m.classList.remove('show'));
        if (dateDropdownMenu) dateDropdownMenu.classList.remove('show');
        if (notifPopover) notifPopover.classList.remove('show');
        if (profilePopover) profilePopover.classList.remove('show');
      }
    });

    // State Demo Preview Pills (Normal, Empty, No-results, Loading, Error)
    document.querySelectorAll('[data-state-demo]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('[data-state-demo]').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        simulatedState = e.target.dataset.stateDemo;
        renderTable();
      });
    });
  }

  // HTML entity escaper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 15. Real API Integration (MongoDB & Express Backend)
  // =========================================================================
  async function loadTransactionsFromAPI() {
    try {
      simulatedState = 'loading';
      renderTable();

      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', '1');
      params.append('limit', '100'); // fetch all recent for local snappy client filtering

      const res = await fetchAuth(`/api/transactions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load transactions');
      const data = await res.json();

      transactions = (data.transactions || []).map(t => ({
        id: t._id,
        _id: t._id,
        title: t.title,
        merchant: t.type === 'expense' ? (t.merchant || t.paidFrom || '') : (t.depositAccount || ''),
        category: t.category,
        date: t.date ? t.date.slice(0, 10) : '',
        displayDate: formatDateDisplay(t.date ? t.date.slice(0, 10) : ''),
        payment: t.paymentMethod || 'Bank Transfer',
        amount: Number(t.amount || 0),
        type: t.type,
        status: 'Completed',
        notes: t.description || ''
      }));

      simulatedState = 'normal';
      renderTable();
      loadSummaryFromAPI();
    } catch (err) {
      console.error('Error fetching transactions from MongoDB:', err);
      simulatedState = 'error';
      renderTable();
    }
  }

  async function loadSummaryFromAPI() {
    try {
      const now = new Date();
      const res = await fetchAuth(`/api/summary/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.summary) {
        const sum = data.summary;
        const inc = Number(sum.totalIncome || 0);
        const exp = Number(sum.totalExpenses || 0);
        const net = inc - exp;

        if (elTotalIncome) elTotalIncome.textContent = window.FinoraCurrency ? window.FinoraCurrency.formatINR(inc) : `₹${inc.toFixed(2)}`;
        if (elTotalExpenses) elTotalExpenses.textContent = window.FinoraCurrency ? window.FinoraCurrency.formatINR(exp) : `₹${exp.toFixed(2)}`;
        if (elNetCashflow) {
          const sign = net >= 0 ? '+' : '−';
          const formattedNet = window.FinoraCurrency ? window.FinoraCurrency.formatINR(Math.abs(net)) : `₹${Math.abs(net).toFixed(2)}`;
          elNetCashflow.textContent = `${sign}${formattedNet}`;
          elNetCashflow.className = net < 0 ? 'summary-card-amount text-expense' : 'summary-card-amount text-net';
        }
      }
    } catch (e) {
      console.warn('Could not load monthly summary in transactions:', e);
    }
  }

  // =========================================================================
  // 16. Boot Application
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadTransactionsFromAPI();
  });

})();
