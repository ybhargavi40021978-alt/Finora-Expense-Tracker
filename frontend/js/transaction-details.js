/**
 * ==============================================================================
 * FINORA EXPENSE TRACKER — SCREEN 13: TRANSACTION DETAILS JS
 * Brand: Finora | "Track. Plan. Save. Grow."
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- State Variables ---
  let currentTxn = null;
  let activeDemoKey = 'standard';

  // --- Indian Rupee Formatter ---
  function formatINR(val) {
    if (isNaN(val) || val === null || val === undefined) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

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

  // --- DOM Elements ---
  const headerCatIcon = document.getElementById('header-cat-icon');
  const headerTxnTitle = document.getElementById('header-txn-title');
  const headerRefId = document.getElementById('header-ref-id');
  const headerTypeBadge = document.getElementById('header-type-badge');
  const headerStatusBadge = document.getElementById('header-status-badge');
  const headerDate = document.getElementById('header-date');

  const amountHeroCard = document.getElementById('amount-hero-card');
  const amountHeadline = document.getElementById('amount-headline');
  const amountSubTitle = document.getElementById('amount-sub-title');
  const quickTypeVal = document.getElementById('quick-type-val');
  const quickCatVal = document.getElementById('quick-cat-val');
  const quickPayVal = document.getElementById('quick-pay-val');
  const quickDateVal = document.getElementById('quick-date-val');

  // Information Fields
  const infoTitle = document.getElementById('info-title');
  const infoType = document.getElementById('info-type');
  const infoAmount = document.getElementById('info-amount');
  const infoCat = document.getElementById('info-cat');
  const infoDate = document.getElementById('info-date');
  const infoPay = document.getElementById('info-pay');
  const infoAccount = document.getElementById('info-account');
  const infoMerchant = document.getElementById('info-merchant');
  const infoStatus = document.getElementById('info-status');
  const infoRefId = document.getElementById('info-ref-id');
  const infoCreated = document.getElementById('info-created');
  const infoUpdated = document.getElementById('info-updated');

  // Description & Notes
  const descText = document.getElementById('desc-text');
  const notesText = document.getElementById('notes-text');
  const tagsContainer = document.getElementById('tags-container');

  // Activity Timeline
  const activityTimeline = document.getElementById('activity-timeline');

  // Related Transactions
  const relatedListContainer = document.getElementById('related-list-container');

  // Side Panels: Category, Payment, Budget
  const sideCatIcon = document.getElementById('side-cat-icon');
  const sideCatName = document.getElementById('side-cat-name');
  const sideCatType = document.getElementById('side-cat-type');
  const sideCatCount = document.getElementById('side-cat-count');
  const sideCatAmount = document.getElementById('side-cat-amount');
  const linkCatTxns = document.getElementById('link-cat-txns');

  const sidePayMethod = document.getElementById('side-pay-method');
  const sidePayAccount = document.getElementById('side-pay-account');
  const sidePayMerchant = document.getElementById('side-pay-merchant');
  const sidePayRef = document.getElementById('side-pay-ref');
  const sideReceiptFilename = document.getElementById('side-receipt-filename');
  const btnViewReceipt = document.getElementById('btn-view-receipt');

  const budgetCardContainer = document.getElementById('budget-card-container');
  const budgetNameEl = document.getElementById('budget-name');
  const budgetLimitEl = document.getElementById('budget-limit');
  const budgetPreviousEl = document.getElementById('budget-previous');
  const budgetTxnEl = document.getElementById('budget-txn');
  const budgetUpdatedEl = document.getElementById('budget-updated');
  const budgetRemainingEl = document.getElementById('budget-remaining');
  const budgetBarFill = document.getElementById('budget-bar-fill');
  const budgetPercentageEl = document.getElementById('budget-percentage');

  // Modals
  const editModalOverlay = document.getElementById('edit-modal-overlay');
  const editForm = document.getElementById('edit-form');
  const editTitleInput = document.getElementById('edit-title');
  const editAmountInput = document.getElementById('edit-amount');
  const editCategorySelect = document.getElementById('edit-category');
  const editDateInput = document.getElementById('edit-date');
  const editPaySelect = document.getElementById('edit-payment');
  const editAccountInput = document.getElementById('edit-account');
  const editMerchantInput = document.getElementById('edit-merchant');
  const editDescInput = document.getElementById('edit-desc');
  const editNotesInput = document.getElementById('edit-notes');

  const duplicateModalOverlay = document.getElementById('duplicate-modal-overlay');
  const duplicateForm = document.getElementById('duplicate-form');
  const duplicateTitleEl = document.getElementById('duplicate-title-preview');
  const duplicateDateInput = document.getElementById('duplicate-new-date');

  const deleteModalOverlay = document.getElementById('delete-modal-overlay');
  const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

  const receiptModalOverlay = document.getElementById('receipt-modal-overlay');
  const receiptModalTitle = document.getElementById('receipt-modal-title');

  // Demo Switcher & Error
  const demoButtons = document.querySelectorAll('.demo-btn');
  const apiErrorBanner = document.getElementById('api-error-banner');
  const notFoundState = document.getElementById('not-found-state');
  const mainDetailsContent = document.getElementById('main-details-content');
  const retryBtn = document.getElementById('retry-btn');
  const toastContainer = document.getElementById('toast-container');

  // Dropdown for More Actions
  const moreActionsBtn = document.getElementById('more-actions-btn');
  const moreActionsDropdown = document.getElementById('more-actions-dropdown');

  // Mobile menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // --- Show Toast Notification ---
  function showToast(msg, icon = 'ri-checkbox-circle-fill') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}" style="color: #23B981; font-size: 1.15rem;"></i><span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Populate UI with Current Transaction Data ---
  function renderTransactionDetails() {
    if (activeDemoKey === 'api-error') {
      apiErrorBanner.style.display = 'block';
      mainDetailsContent.style.display = 'none';
      notFoundState.style.display = 'none';
      return;
    }
    apiErrorBanner.style.display = 'none';

    if (activeDemoKey === 'not-found') {
      notFoundState.style.display = 'flex';
      mainDetailsContent.style.display = 'none';
      return;
    }
    notFoundState.style.display = 'none';
    mainDetailsContent.style.display = 'flex';

    const isExpense = currentTxn.type === 'expense';
    const amountPrefix = isExpense ? '−' : '+';

    // Header Area
    headerCatIcon.className = currentTxn.categoryIcon;
    headerCatIcon.parentElement.style.background = `${currentTxn.categoryColor}18`;
    headerCatIcon.parentElement.style.color = currentTxn.categoryColor;
    headerTxnTitle.textContent = currentTxn.category;
    headerRefId.textContent = currentTxn.referenceId;
    headerDate.textContent = currentTxn.date;

    headerTypeBadge.textContent = isExpense ? 'Expense' : 'Income';
    headerTypeBadge.className = `badge-pill ${isExpense ? 'type-expense' : 'type-income'}`;

    // Amount Hero Card
    amountHeroCard.classList.toggle('income-card', !isExpense);
    amountHeadline.textContent = `${amountPrefix}${formatINR(currentTxn.amount)}`;
    amountHeadline.className = `amount-headline ${isExpense ? 'expense' : 'income'}`;
    amountSubTitle.textContent = currentTxn.title;

    quickTypeVal.textContent = isExpense ? 'Expense' : 'Income';
    quickCatVal.textContent = currentTxn.category;
    quickPayVal.textContent = currentTxn.paymentMethod;
    quickDateVal.textContent = currentTxn.date;

    // Transaction Information Card
    infoTitle.textContent = currentTxn.title;
    infoType.textContent = isExpense ? 'Expense' : 'Income';
    infoAmount.textContent = formatINR(currentTxn.amount);
    infoAmount.style.color = isExpense ? '#F06575' : '#23B981';
    infoCat.textContent = currentTxn.category;
    infoDate.textContent = currentTxn.date;
    infoPay.textContent = currentTxn.paymentMethod;
    infoAccount.textContent = currentTxn.account || 'Not provided';
    infoMerchant.textContent = currentTxn.merchant || 'Not provided';
    infoStatus.textContent = currentTxn.status;
    infoRefId.textContent = currentTxn.referenceId;
    infoCreated.textContent = currentTxn.createdOn;
    infoUpdated.textContent = currentTxn.lastUpdated;

    // Description & Notes
    descText.textContent = currentTxn.description || 'No description added for this transaction.';
    notesText.textContent = currentTxn.notes || 'No additional personal notes.';

    if (currentTxn.tags && currentTxn.tags.length > 0) {
      tagsContainer.innerHTML = currentTxn.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('');
    } else {
      tagsContainer.innerHTML = '<span style="font-size: 0.8125rem; color: #75809A;">No tags assigned</span>';
    }

    // Category Side Panel
    sideCatIcon.className = currentTxn.categoryIcon;
    sideCatIcon.parentElement.style.background = `${currentTxn.categoryColor}18`;
    sideCatIcon.parentElement.style.color = currentTxn.categoryColor;
    sideCatName.textContent = currentTxn.category;
    sideCatType.textContent = `${isExpense ? 'Expense' : 'Income'} category · ${currentTxn.categorySource || 'Default'}`;
    sideCatCount.textContent = `${currentTxn.categoryStats.txnCountMonth} transactions this month`;
    sideCatAmount.textContent = `${formatINR(currentTxn.categoryStats.amountSpentMonth)} recorded`;
    linkCatTxns.href = `transactions.html?category=${encodeURIComponent(currentTxn.category)}`;

    // Payment Information Side Panel
    sidePayMethod.textContent = currentTxn.paymentMethod;
    sidePayAccount.textContent = currentTxn.account || 'Not provided';
    sidePayMerchant.textContent = currentTxn.merchant || 'Not provided';
    sidePayRef.textContent = currentTxn.referenceId;
    if (currentTxn.receiptAttached) {
      sideReceiptFilename.textContent = currentTxn.receiptFileName;
      btnViewReceipt.style.display = 'inline-flex';
    } else {
      sideReceiptFilename.textContent = 'No receipt attached.';
      btnViewReceipt.style.display = 'none';
    }

    // Budget Impact Panel
    if (currentTxn.budget && currentTxn.budget.linked) {
      budgetCardContainer.style.display = 'block';
      budgetNameEl.textContent = currentTxn.budget.name;
      budgetLimitEl.textContent = formatINR(currentTxn.budget.limit);
      budgetPreviousEl.textContent = formatINR(currentTxn.budget.previous);
      budgetTxnEl.textContent = formatINR(currentTxn.budget.thisTxn);
      budgetUpdatedEl.textContent = formatINR(currentTxn.budget.updated);
      budgetRemainingEl.textContent = formatINR(currentTxn.budget.remaining);

      const pct = Math.min(Math.round(currentTxn.budget.percentage), 100);
      budgetBarFill.style.width = `${pct}%`;
      budgetPercentageEl.textContent = `${currentTxn.budget.percentage.toFixed(1)}% of budget utilized`;

      if (currentTxn.budget.percentage > 100) {
        budgetBarFill.className = 'progress-bar-fill danger';
        budgetRemainingEl.style.color = '#F06575';
      } else if (currentTxn.budget.percentage >= 80) {
        budgetBarFill.className = 'progress-bar-fill warning';
        budgetRemainingEl.style.color = '#F5B544';
      } else {
        budgetBarFill.className = 'progress-bar-fill';
        budgetRemainingEl.style.color = '#18213D';
      }
    } else {
      budgetCardContainer.style.display = 'none';
    }

    // Activity Timeline
    activityTimeline.innerHTML = currentTxn.activityHistory.map(evt => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h5>${evt.title}</h5>
          <time>${evt.time}</time>
        </div>
      </div>
    `).join('');

    // Related Transactions
    if (currentTxn.related && currentTxn.related.length > 0) {
      relatedListContainer.innerHTML = currentTxn.related.map(rel => `
        <div class="related-row-item">
          <div class="related-row-left">
            <div class="related-icon" style="background: #F1F4F9; color: #7957FF;">
              <i class="${rel.icon}"></i>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 0.875rem; color: #18213D;">${rel.title}</div>
              <div style="font-size: 0.72rem; color: #75809A;">${rel.category} · ${rel.date}</div>
            </div>
          </div>
          <div style="font-weight: 700; font-size: 0.92rem; color: ${rel.type === 'expense' ? '#F06575' : '#23B981'};">
            ${rel.type === 'expense' ? '-' : '+'}${formatINR(rel.amount)}
          </div>
        </div>
      `).join('');
    } else {
      relatedListContainer.innerHTML = `
        <div style="font-size: 0.8125rem; color: #75809A; padding: 12px 0;">No related transactions found.</div>
      `;
    }
  }

  // --- Edit Transaction Flow ---
  function openEditModal() {
    editTitleInput.value = currentTxn.title;
    editAmountInput.value = currentTxn.amount;
    editCategorySelect.value = currentTxn.category;
    editDateInput.value = currentTxn.dateISO;
    editPaySelect.value = currentTxn.paymentMethod;
    editAccountInput.value = currentTxn.account || '';
    editMerchantInput.value = currentTxn.merchant || '';
    editDescInput.value = currentTxn.description || '';
    editNotesInput.value = currentTxn.notes || '';

    editModalOverlay.classList.add('active');
    editTitleInput.focus();
  }

  function closeEditModal() {
    editModalOverlay.classList.remove('active');
  }

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentTxn || !currentTxn._id) return;
    const title = editTitleInput.value.trim();
    const amount = parseFloat(editAmountInput.value);

    if (!title || isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid title and amount.', 'ri-error-warning-fill');
      return;
    }

    const isIncome = currentTxn.type === 'income';
    const url = isIncome ? `/api/income/${currentTxn._id}` : `/api/expenses/${currentTxn._id}`;
    const payload = {
      title,
      amount,
      category: editCategorySelect.value,
      [isIncome ? 'incomeDate' : 'expenseDate']: editDateInput.value,
      paymentMethod: editPaySelect.value,
      description: editDescInput.value.trim()
    };

    try {
      const res = await fetchAuth(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update transaction');
      }

      currentTxn.title = title;
      currentTxn.amount = amount;
      currentTxn.category = editCategorySelect.value;
      currentTxn.dateISO = editDateInput.value;
      currentTxn.paymentMethod = editPaySelect.value;
      currentTxn.description = editDescInput.value.trim();
      currentTxn.lastUpdated = 'Just now (Updated)';

      closeEditModal();
      renderTransactionDetails();
      showToast('Transaction details updated successfully in database.');
    } catch (err) {
      console.error('Update transaction error:', err);
      showToast(err.message || 'Error updating transaction', 'ri-error-warning-fill');
    }
  });

  // --- Duplicate Transaction Flow ---
  function openDuplicateModal() {
    if (!currentTxn) return;
    duplicateTitleEl.textContent = `Duplicate: ${currentTxn.title} (${formatINR(currentTxn.amount)})`;
    duplicateDateInput.value = new Date().toISOString().split('T')[0];
    duplicateModalOverlay.classList.add('active');
  }

  function closeDuplicateModal() {
    duplicateModalOverlay.classList.remove('active');
  }

  duplicateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentTxn) return;
    const newDate = duplicateDateInput.value;
    const isIncome = currentTxn.type === 'income';
    const url = isIncome ? '/api/income' : '/api/expenses';
    const payload = {
      title: `${currentTxn.title} (Copy)`,
      amount: currentTxn.amount,
      category: currentTxn.category,
      [isIncome ? 'incomeDate' : 'expenseDate']: newDate,
      paymentMethod: currentTxn.paymentMethod,
      description: currentTxn.description
    };

    try {
      const res = await fetchAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to duplicate record');
      const data = await res.json();
      const created = data.income || data.expense;

      closeDuplicateModal();
      showToast(`New duplicate created successfully!`);
      setTimeout(() => {
        if (created && created._id) {
          window.location.href = `transaction-details.html?id=${created._id}`;
        } else {
          window.location.href = 'transactions.html';
        }
      }, 800);
    } catch (err) {
      showToast(err.message || 'Could not duplicate', 'ri-error-warning-fill');
    }
  });

  // --- Delete Transaction Flow ---
  function openDeleteModal() {
    if (!currentTxn) return;
    document.getElementById('delete-modal-txn-name').textContent = `${currentTxn.title} (${formatINR(currentTxn.amount)})`;
    deleteModalOverlay.classList.add('active');
  }

  function closeDeleteModal() {
    deleteModalOverlay.classList.remove('active');
  }

  deleteConfirmBtn.addEventListener('click', async () => {
    if (!currentTxn || !currentTxn._id) return;
    try {
      const res = await fetchAuth(`/api/transactions/${currentTxn._id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      closeDeleteModal();
      showToast(`Transaction deleted permanently.`);
      setTimeout(() => {
        window.location.href = 'transactions.html';
      }, 800);
    } catch (err) {
      showToast(err.message || 'Could not delete transaction', 'ri-error-warning-fill');
      closeDeleteModal();
    }
  });

  // --- Receipt Viewer Modal ---
  function openReceiptModal() {
    receiptModalTitle.textContent = currentTxn.receiptFileName;
    receiptModalOverlay.classList.add('active');
  }

  function closeReceiptModal() {
    receiptModalOverlay.classList.remove('active');
  }

  // --- More Actions Dropdown Toggle ---
  moreActionsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    moreActionsDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    moreActionsDropdown?.classList.remove('show');
  });

  document.getElementById('menu-duplicate-txn')?.addEventListener('click', () => {
    moreActionsDropdown.classList.remove('show');
    openDuplicateModal();
  });

  document.getElementById('menu-related-txns')?.addEventListener('click', () => {
    moreActionsDropdown.classList.remove('show');
    document.getElementById('related-transactions-card')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('menu-print-txn')?.addEventListener('click', () => {
    moreActionsDropdown.classList.remove('show');
    window.print();
  });

  document.getElementById('menu-delete-txn')?.addEventListener('click', () => {
    moreActionsDropdown.classList.remove('show');
    openDeleteModal();
  });

  // --- Event Listeners for Buttons & Modals ---
  document.getElementById('btn-edit-txn')?.addEventListener('click', openEditModal);
  document.getElementById('edit-close-btn')?.addEventListener('click', closeEditModal);
  document.getElementById('edit-cancel-btn')?.addEventListener('click', closeEditModal);

  document.getElementById('duplicate-close-btn')?.addEventListener('click', closeDuplicateModal);
  document.getElementById('duplicate-cancel-btn')?.addEventListener('click', closeDuplicateModal);

  document.getElementById('delete-close-btn')?.addEventListener('click', closeDeleteModal);
  document.getElementById('delete-cancel-btn')?.addEventListener('click', closeDeleteModal);

  btnViewReceipt?.addEventListener('click', openReceiptModal);
  document.getElementById('receipt-close-btn')?.addEventListener('click', closeReceiptModal);

  // Mobile Menu
  mobileToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    sidebarBackdrop.classList.toggle('active');
  });

  sidebarBackdrop?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    sidebarBackdrop.classList.remove('active');
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEditModal();
      closeDuplicateModal();
      closeDeleteModal();
      closeReceiptModal();
    }
  });

  async function loadTransactionFromAPI(id) {
    if (!id) {
      if (notFoundState) notFoundState.style.display = 'flex';
      if (mainDetailsContent) mainDetailsContent.style.display = 'none';
      return;
    }

    try {
      if (apiErrorBanner) apiErrorBanner.style.display = 'none';
      const res = await fetchAuth(`/api/transactions/${id}`);
      if (!res.ok) {
        if (notFoundState) notFoundState.style.display = 'flex';
        if (mainDetailsContent) mainDetailsContent.style.display = 'none';
        return;
      }

      const data = await res.json();
      const txn = data.transaction;
      if (!txn) {
        if (notFoundState) notFoundState.style.display = 'flex';
        if (mainDetailsContent) mainDetailsContent.style.display = 'none';
        return;
      }

      const isIncome = txn.type === 'income';
      const rawDate = txn.date || txn.createdAt;
      const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently';

      currentTxn = {
        id: txn._id,
        _id: txn._id,
        title: txn.title,
        type: txn.type,
        amount: Number(txn.amount || 0),
        category: txn.category,
        categorySource: 'Custom',
        categoryIcon: isIncome ? 'ri-wallet-3-line' : 'ri-shopping-bag-3-line',
        categoryColor: isIncome ? '#23B981' : '#F06575',
        date: formattedDate,
        dateISO: txn.date ? txn.date.slice(0, 10) : (txn.createdAt ? txn.createdAt.slice(0, 10) : ''),
        paymentMethod: txn.paymentMethod || 'Bank Transfer',
        account: txn.depositAccount || txn.paidFrom || 'Personal Account',
        merchant: txn.merchant || (isIncome ? 'Direct Deposit' : 'Merchant'),
        status: 'Completed',
        referenceId: `TXN-${String(txn._id).slice(-6).toUpperCase()}`,
        createdOn: txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN') : '',
        lastUpdated: txn.updatedAt ? new Date(txn.updatedAt).toLocaleString('en-IN') : '',
        description: txn.description || '',
        notes: txn.notes || txn.description || '',
        tags: txn.tags || [],
        receiptAttached: Boolean(txn.hasReceipt || txn.receiptFileName),
        receiptFileName: txn.receiptFileName || '',
        budget: { linked: false },
        categoryStats: { txnCountMonth: 1, amountSpentMonth: txn.amount },
        activityHistory: [
          { title: 'Transaction saved to database', time: txn.createdAt ? new Date(txn.createdAt).toLocaleString('en-IN') : '', icon: 'ri-check-line' }
        ],
        related: []
      };

      if (notFoundState) notFoundState.style.display = 'none';
      if (mainDetailsContent) mainDetailsContent.style.display = 'flex';
      renderTransactionDetails();
    } catch (err) {
      console.error('Failed to load transaction details from MongoDB:', err);
      if (apiErrorBanner) apiErrorBanner.style.display = 'block';
      if (notFoundState) notFoundState.style.display = 'none';
    }
  }

  // --- Initial Boot ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('id');
  if (paramId) {
    loadTransactionFromAPI(paramId);
  } else {
    // Show empty / not-found state if no ID is passed
    if (notFoundState) notFoundState.style.display = 'flex';
    if (mainDetailsContent) mainDetailsContent.style.display = 'none';
  }

})();
