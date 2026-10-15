/**
 * Finora Expense Tracker — Screen 7: Add Expense Page JavaScript
 * Handles real-time form-to-preview synchronization, category budget impact calculation,
 * receipt upload simulation, tags management, recurring calculator, validation, and API simulation.
 */

(function () {
  'use strict';

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

  // Category Budgets Database (Simulated user budgets)
  const CATEGORY_BUDGETS = {
    'Food & Dining': { budget: 12000, spent: 7800 },
    'Groceries': { budget: 10000, spent: 6200 },
    'Transportation': { budget: 5000, spent: 3400 },
    'Shopping': { budget: 8000, spent: 5499 },
    'Bills & Utilities': { budget: 6000, spent: 4850 },
    'Housing & Rent': { budget: 25000, spent: 25000 },
    'Healthcare': { budget: 4000, spent: 1200 },
    'Entertainment': { budget: 3500, spent: 2850 },
    'Subscriptions': { budget: 2000, spent: 1799 }
  };

  // Category Icon Map
  const CATEGORY_ICONS = {
    'Food & Dining': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F06575" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    'Groceries': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23B981" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    'Transportation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    'Shopping': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    'Bills & Utilities': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5B544" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
    'Housing & Rent': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    'Healthcare': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A085" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    'Education': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#48B9F5" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    'Entertainment': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D81B60" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    'Travel': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ACC1" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    'Personal Care': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E91E63" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
    'Subscriptions': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    'Other': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  // State Management
  const state = {
    title: '',
    amount: '',
    category: 'Groceries',
    date: '2026-10-15',
    payment: 'UPI',
    account: 'Primary Bank Account',
    merchant: '',
    description: '',
    tags: ['Essential', 'Personal'],
    receiptFile: null,
    isRecurring: false,
    recurringFrequency: 'Monthly',
    recurringStartDate: '2026-10-15',
    recurringEndDate: '',
    includeInReports: true,
    isEssential: true,
    isSubmitting: false,
    snapshotData: {
      totalExpenses: 0,
      recordsCount: 0,
      highestCategory: 'None'
    }
  };

  // DOM Elements
  const elForm = document.getElementById('add-expense-form');
  const elTitleInput = document.getElementById('expense-title');
  const elAmountInput = document.getElementById('expense-amount');
  const elCategorySelect = document.getElementById('expense-category');
  const elDateInput = document.getElementById('expense-date');
  const elPaymentSelect = document.getElementById('expense-payment');
  const elAccountSelect = document.getElementById('expense-account');
  const elMerchantInput = document.getElementById('expense-merchant');
  const elDescTextarea = document.getElementById('expense-description');
  const elTagsContainer = document.getElementById('tags-chips-list');
  const elTagInput = document.getElementById('tag-input');

  // Receipt Elements
  const elReceiptDropzone = document.getElementById('receipt-dropzone');
  const elReceiptInput = document.getElementById('receipt-file-input');
  const elReceiptPreview = document.getElementById('receipt-file-preview');
  const elReceiptName = document.getElementById('receipt-file-name');
  const elReceiptSize = document.getElementById('receipt-file-size');
  const elReceiptRemove = document.getElementById('btn-remove-receipt');

  // Recurring Elements
  const elRecurringToggle = document.getElementById('recurring-toggle');
  const elRecurringPanel = document.getElementById('recurring-fields-panel');
  const elRecurringFreq = document.getElementById('recurring-frequency');
  const elRecurringStart = document.getElementById('recurring-start-date');
  const elRecurringEnd = document.getElementById('recurring-end-date');
  const elRecurringPreview = document.getElementById('recurring-next-payout');
  const elReportsCheckbox = document.getElementById('include-reports-check');
  const elEssentialCheckbox = document.getElementById('essential-check');

  // Preview Elements
  const elPreviewAmount = document.getElementById('preview-amount-val');
  const elPreviewTitle = document.getElementById('preview-title-val');
  const elPreviewCategory = document.getElementById('preview-category-val');
  const elPreviewCatIcon = document.getElementById('preview-category-icon');
  const elPreviewDate = document.getElementById('preview-date-val');
  const elPreviewPayment = document.getElementById('preview-payment-val');
  const elPreviewMerchant = document.getElementById('preview-merchant-val');
  const elPreviewAccount = document.getElementById('preview-account-val');
  const elPreviewBadge = document.getElementById('preview-status-badge');

  // Budget Impact Elements
  const elBudgetCategory = document.getElementById('budget-cat-name');
  const elBudgetLimit = document.getElementById('budget-total-val');
  const elBudgetRemaining = document.getElementById('budget-remaining-val');
  const elBudgetBarFill = document.getElementById('budget-bar-fill');
  const elBudgetStatusText = document.getElementById('budget-status-text');
  const elBudgetBox = document.getElementById('budget-impact-content');
  const elNoBudgetBox = document.getElementById('budget-empty-state');

  // Action Buttons
  const elTopSaveBtn = document.getElementById('btn-top-save');
  const elBottomSaveBtn = document.getElementById('btn-bottom-save');
  const elSaveDraftBtn = document.getElementById('btn-save-draft');
  const elToastContainer = document.getElementById('toast-container');

  // Format currency
  function formatINR(val) {
    if (!val || isNaN(val) || Number(val) <= 0) return '₹0.00';
    return '−₹' + Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatCurrencyPlain(val) {
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  // Format date display
  function formatDateDisplay(dateStr) {
    if (!dateStr) return 'Today';
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

  // Toast Notification
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

  // Update Live Preview Card
  function updatePreview() {
    // Amount
    const amountVal = parseFloat(state.amount);
    if (!isNaN(amountVal) && amountVal > 0) {
      elPreviewAmount.textContent = formatINR(amountVal);
      elPreviewAmount.style.color = 'var(--color-expense-text)';
    } else {
      elPreviewAmount.textContent = '₹0.00';
      elPreviewAmount.style.color = 'var(--text-secondary)';
    }

    // Title
    elPreviewTitle.textContent = state.title.trim() ? state.title.trim() : 'Grocery Shopping';

    // Category
    elPreviewCategory.textContent = state.category;
    if (elPreviewCatIcon) {
      elPreviewCatIcon.innerHTML = CATEGORY_ICONS[state.category] || CATEGORY_ICONS.Other;
    }

    // Date
    elPreviewDate.textContent = formatDateDisplay(state.date);

    // Payment Method
    elPreviewPayment.textContent = state.payment;

    // Merchant
    if (elPreviewMerchant) {
      elPreviewMerchant.textContent = state.merchant.trim() ? state.merchant.trim() : 'Local Merchant';
    }

    // Deposit Account
    if (elPreviewAccount) {
      elPreviewAccount.textContent = state.account;
    }

    // Status Badge
    const isValid = state.title.trim() !== '' && !isNaN(amountVal) && amountVal > 0 && state.date;
    if (isValid) {
      elPreviewBadge.textContent = 'Ready to save';
      elPreviewBadge.className = 'preview-badge-status ready';
    } else {
      elPreviewBadge.textContent = 'Complete required fields';
      elPreviewBadge.className = 'preview-badge-status drafting';
    }

    // Update Budget Impact Card
    updateBudgetImpact(amountVal);

    // Update Recurring Text if recurring
    if (state.isRecurring) {
      calculateNextRecurringBill();
    }
  }

  // Update Budget Impact Card based on category & current entered amount
  function updateBudgetImpact(currentEnteredAmount = 0) {
    if (!elBudgetBox || !elNoBudgetBox) return;

    const catBudget = CATEGORY_BUDGETS[state.category];
    if (!catBudget) {
      // Category has no budget defined
      elBudgetBox.style.display = 'none';
      elNoBudgetBox.style.display = 'block';
      return;
    }

    elBudgetBox.style.display = 'block';
    elNoBudgetBox.style.display = 'none';

    if (elBudgetCategory) elBudgetCategory.textContent = state.category;
    if (elBudgetLimit) elBudgetLimit.textContent = formatCurrencyPlain(catBudget.budget);

    const entered = !isNaN(currentEnteredAmount) && currentEnteredAmount > 0 ? currentEnteredAmount : 0;
    const projectedSpent = catBudget.spent + entered;
    const projectedRemaining = catBudget.budget - projectedSpent;

    if (elBudgetRemaining) {
      if (projectedRemaining >= 0) {
        elBudgetRemaining.textContent = formatCurrencyPlain(projectedRemaining);
        elBudgetRemaining.style.color = 'var(--color-deep-navy)';
      } else {
        elBudgetRemaining.textContent = '−' + formatCurrencyPlain(Math.abs(projectedRemaining));
        elBudgetRemaining.style.color = 'var(--color-expense-text)';
      }
    }

    // Progress Bar percentage
    const percent = Math.min(Math.round((projectedSpent / catBudget.budget) * 100), 100);
    if (elBudgetBarFill) {
      elBudgetBarFill.style.width = `${percent}%`;
      if (projectedSpent > catBudget.budget) {
        elBudgetBarFill.className = 'budget-bar-fill danger';
      } else if (percent >= 85) {
        elBudgetBarFill.className = 'budget-bar-fill warning';
      } else {
        elBudgetBarFill.className = 'budget-bar-fill';
      }
    }

    // Status text
    if (elBudgetStatusText) {
      if (projectedSpent > catBudget.budget) {
        const overBy = projectedSpent - catBudget.budget;
        elBudgetStatusText.innerHTML = `<span style="color: var(--color-expense-text); font-weight: 600;">⚠️ Exceeds budget by ₹${overBy.toLocaleString('en-IN')}</span><span>${Math.round((projectedSpent/catBudget.budget)*100)}%</span>`;
      } else if (percent >= 85) {
        elBudgetStatusText.innerHTML = `<span style="color: var(--color-warning-text); font-weight: 600;">⚠️ Near monthly budget limit</span><span>${percent}%</span>`;
      } else {
        elBudgetStatusText.innerHTML = `<span>On track (${formatCurrencyPlain(projectedSpent)} of ${formatCurrencyPlain(catBudget.budget)})</span><span>${percent}%</span>`;
      }
    }
  }

  // Calculate Next Bill Due Date
  function calculateNextRecurringBill() {
    if (!elRecurringPreview) return;
    const baseDateStr = state.recurringStartDate || state.date;
    try {
      const parts = baseDateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (state.recurringFrequency === 'Weekly') {
          d.setDate(d.getDate() + 7);
        } else if (state.recurringFrequency === 'Monthly') {
          d.setMonth(d.getMonth() + 1);
        } else if (state.recurringFrequency === 'Quarterly') {
          d.setMonth(d.getMonth() + 3);
        } else if (state.recurringFrequency === 'Yearly') {
          d.setFullYear(d.getFullYear() + 1);
        }
        elRecurringPreview.textContent = `Next bill due on: ${formatDateDisplay(d.toISOString().slice(0, 10))}`;
      }
    } catch (e) {
      elRecurringPreview.textContent = 'Next bill scheduled automatically';
    }
  }

  // Render Tags
  function renderTags() {
    if (!elTagsContainer) return;
    elTagsContainer.innerHTML = '';
    state.tags.forEach((tag, idx) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `
        <span>${escapeHTML(tag)}</span>
        <button type="button" class="tag-chip-remove" data-index="${idx}" aria-label="Remove tag">&times;</button>
      `;
      elTagsContainer.appendChild(chip);
    });
  }

  function addTag(tagText) {
    const trimmed = tagText.trim();
    if (trimmed && !state.tags.includes(trimmed)) {
      state.tags.push(trimmed);
      renderTags();
    }
    if (elTagInput) elTagInput.value = '';
  }

  function removeTag(index) {
    state.tags.splice(index, 1);
    renderTags();
  }

  // Receipt File Handling
  function handleReceiptFile(file) {
    if (!file) return;

    // Validate type (PNG, JPG, PDF)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Unsupported file type. Please upload a PNG, JPG, or PDF.', 'error');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File exceeds 5MB size limit.', 'error');
      return;
    }

    state.receiptFile = file;

    if (elReceiptName) elReceiptName.textContent = file.name;
    if (elReceiptSize) {
      const sizeKb = Math.round(file.size / 1024);
      elReceiptSize.textContent = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    }

    if (elReceiptPreview) elReceiptPreview.classList.add('show');
    showToast(`Receipt "${file.name}" attached successfully!`, 'info');
  }

  function removeReceiptFile() {
    state.receiptFile = null;
    if (elReceiptInput) elReceiptInput.value = '';
    if (elReceiptPreview) elReceiptPreview.classList.remove('show');
    showToast('Receipt attachment removed', 'info');
  }

  // Inline Validation
  function validateField(fieldId) {
    let isValid = true;
    if (fieldId === 'expense-title') {
      const err = document.getElementById('error-title');
      if (!elTitleInput.value.trim()) {
        elTitleInput.classList.add('is-invalid');
        if (err) err.classList.add('show');
        isValid = false;
      } else {
        elTitleInput.classList.remove('is-invalid');
        if (err) err.classList.remove('show');
      }
    } else if (fieldId === 'expense-amount') {
      const err = document.getElementById('error-amount');
      const val = parseFloat(elAmountInput.value);
      if (isNaN(val) || val <= 0) {
        elAmountInput.classList.add('is-invalid');
        if (err) err.classList.add('show');
        isValid = false;
      } else {
        elAmountInput.classList.remove('is-invalid');
        if (err) err.classList.remove('show');
      }
    } else if (fieldId === 'expense-date') {
      const err = document.getElementById('error-date');
      if (!elDateInput.value) {
        elDateInput.classList.add('is-invalid');
        if (err) err.classList.add('show');
        isValid = false;
      } else {
        elDateInput.classList.remove('is-invalid');
        if (err) err.classList.remove('show');
      }
    }
    return isValid;
  }

  function validateAll() {
    const validTitle = validateField('expense-title');
    const validAmount = validateField('expense-amount');
    const validDate = validateField('expense-date');

    if (!validTitle) elTitleInput.focus();
    else if (!validAmount) elAmountInput.focus();
    else if (!validDate) elDateInput.focus();

    return validTitle && validAmount && validDate;
  }

  // Handle Form Submission (Real MongoDB API flow)
  async function handleFormSubmit(e) {
    if (e) e.preventDefault();
    if (state.isSubmitting) return;

    if (!validateAll()) {
      showToast('Please fix the errors in the form before saving.', 'error');
      return;
    }

    state.isSubmitting = true;
    setLoadingState(true);

    // Prepare API Payload for POST /api/expenses matching Expense model
    const payload = {
      title: state.title.trim(),
      amount: parseFloat(state.amount),
      category: state.category,
      expenseDate: state.date,
      paymentMethod: state.payment,
      paidFrom: state.account,
      merchant: state.merchant.trim() || undefined,
      description: state.description.trim() || undefined,
      tags: state.tags,
      hasReceipt: Boolean(state.receiptFile),
      receiptFileName: state.receiptFile ? state.receiptFile.name : undefined,
      isRecurring: state.isRecurring,
      recurrence: state.isRecurring ? {
        frequency: state.recurringFrequency,
        startDate: state.recurringStartDate,
        endDate: state.recurringEndDate || null
      } : null,
      includeInReports: state.includeInReports,
      isEssential: state.isEssential
    };

    try {
      const response = await fetchAuth('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to save expense record to database');
      }

      setLoadingState(false);
      state.isSubmitting = false;

      // Update snapshot metrics with newly added expense
      state.snapshotData.totalExpenses += payload.amount;
      state.snapshotData.recordsCount += 1;
      updateSnapshotMetrics();

      const formattedAmt = window.FinoraCurrency ? window.FinoraCurrency.formatINR(payload.amount) : ('₹' + payload.amount.toLocaleString('en-IN'));
      showToast(`Expense "${payload.title}" added successfully! (${formattedAmt})`, 'success');

      // Update preview badge
      if (elPreviewBadge) {
        elPreviewBadge.textContent = 'Saved to database';
        elPreviewBadge.className = 'preview-badge-status ready';
      }

      // Redirect after confirmation
      setTimeout(() => {
        showToast('Redirecting to Transactions history...', 'info');
        setTimeout(() => {
          window.location.href = 'transactions.html';
        }, 1000);
      }, 800);

    } catch (err) {
      console.error('[Finora API Error]', err);
      setLoadingState(false);
      state.isSubmitting = false;
      // Preserve form values, show clear error
      showToast(err.message || 'Could not save expense. Please try again.', 'error');
    }
  }

  function setLoadingState(loading) {
    const btns = [elTopSaveBtn, elBottomSaveBtn];
    btns.forEach(btn => {
      if (!btn) return;
      if (loading) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span><span>Saving...</span>`;
      } else {
        btn.disabled = false;
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Save Expense</span>
        `;
      }
    });
  }

  function updateSnapshotMetrics() {
    const elTot = document.getElementById('snapshot-total');
    const elCount = document.getElementById('snapshot-count');
    const elHighest = document.getElementById('snapshot-highest');
    const elDistLabel = document.getElementById('snapshot-distribution-label');

    const formatted = window.FinoraCurrency 
      ? window.FinoraCurrency.formatINR(state.snapshotData.totalExpenses) 
      : ('₹' + state.snapshotData.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    if (elTot) elTot.textContent = formatted;
    if (elCount) elCount.textContent = state.snapshotData.recordsCount;
    if (elHighest) elHighest.textContent = state.snapshotData.highestCategory;

    if (elDistLabel) {
      if (state.snapshotData.recordsCount === 0) {
        elDistLabel.textContent = 'No expenses recorded yet';
      } else {
        elDistLabel.textContent = `${state.snapshotData.highestCategory} is top category`;
      }
    }
  }

  async function loadRealExpenseSnapshot() {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const res = await fetchAuth(`/api/summary/monthly?year=${year}&month=${month}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.summary) {
        const sum = data.summary;
        state.snapshotData.totalExpenses = sum.totalExpenses || 0;
        state.snapshotData.recordsCount = sum.expenseCount || 0;
        if (sum.expenseByCategory && sum.expenseByCategory.length > 0) {
          const top = sum.expenseByCategory[0];
          const topFormatted = window.FinoraCurrency ? window.FinoraCurrency.formatINR(top.total) : `₹${top.total}`;
          state.snapshotData.highestCategory = `${top.category} (${topFormatted})`;
          
          // Populate category budgets spent with actual DB amounts
          sum.expenseByCategory.forEach(c => {
            if (CATEGORY_BUDGETS[c.category]) {
              CATEGORY_BUDGETS[c.category].spent = c.total;
            } else {
              CATEGORY_BUDGETS[c.category] = { budget: 10000, spent: c.total };
            }
          });
        } else {
          state.snapshotData.highestCategory = 'None';
        }
        updateSnapshotMetrics();
        updateBudgetImpact();
      }
    } catch (e) {
      console.warn('Could not load monthly expense snapshot:', e);
    }
  }

  // Event Listeners
  function initListeners() {
    // Title Input
    if (elTitleInput) {
      elTitleInput.addEventListener('input', (e) => {
        state.title = e.target.value;
        validateField('expense-title');
        updatePreview();
      });
      elTitleInput.addEventListener('blur', () => validateField('expense-title'));
    }

    // Amount Input
    if (elAmountInput) {
      elAmountInput.addEventListener('input', (e) => {
        state.amount = e.target.value;
        validateField('expense-amount');
        updatePreview();
      });
      elAmountInput.addEventListener('blur', () => validateField('expense-amount'));
    }

    // Category Select
    if (elCategorySelect) {
      elCategorySelect.addEventListener('change', (e) => {
        state.category = e.target.value;
        updatePreview();
      });
    }

    // Date Received
    if (elDateInput) {
      elDateInput.addEventListener('change', (e) => {
        state.date = e.target.value;
        if (elRecurringStart && !elRecurringStart.value) {
          elRecurringStart.value = state.date;
          state.recurringStartDate = state.date;
        }
        validateField('expense-date');
        updatePreview();
      });
      elDateInput.addEventListener('blur', () => validateField('expense-date'));
    }

    // Payment Method
    if (elPaymentSelect) {
      elPaymentSelect.addEventListener('change', (e) => {
        state.payment = e.target.value;
        updatePreview();
      });
    }

    // Deposit Account (Paid From)
    if (elAccountSelect) {
      elAccountSelect.addEventListener('change', (e) => {
        state.account = e.target.value;
        updatePreview();
      });
    }

    // Merchant / Recipient
    if (elMerchantInput) {
      elMerchantInput.addEventListener('input', (e) => {
        state.merchant = e.target.value;
        updatePreview();
      });
    }

    // Description Textarea
    if (elDescTextarea) {
      elDescTextarea.addEventListener('input', (e) => {
        state.description = e.target.value;
      });
    }

    // Tags Input
    if (elTagInput) {
      elTagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          addTag(elTagInput.value);
        }
      });
      elTagInput.addEventListener('blur', () => {
        if (elTagInput.value.trim()) addTag(elTagInput.value);
      });
    }

    // Tags Remove click delegation
    if (elTagsContainer) {
      elTagsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag-chip-remove');
        if (btn) {
          const idx = parseInt(btn.dataset.index, 10);
          removeTag(idx);
        }
      });
    }

    // Suggested Tags buttons
    document.querySelectorAll('.suggested-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        addTag(btn.dataset.tag);
      });
    });

    // Receipt Drag & Drop
    if (elReceiptDropzone && elReceiptInput) {
      elReceiptDropzone.addEventListener('click', () => {
        elReceiptInput.click();
      });

      elReceiptInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleReceiptFile(e.target.files[0]);
        }
      });

      elReceiptDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elReceiptDropzone.classList.add('dragover');
      });

      elReceiptDropzone.addEventListener('dragleave', () => {
        elReceiptDropzone.classList.remove('dragover');
      });

      elReceiptDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        elReceiptDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleReceiptFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (elReceiptRemove) {
      elReceiptRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        removeReceiptFile();
      });
    }

    // Recurring Toggle Switch
    if (elRecurringToggle) {
      elRecurringToggle.addEventListener('change', (e) => {
        state.isRecurring = e.target.checked;
        if (elRecurringPanel) {
          if (state.isRecurring) {
            elRecurringPanel.classList.add('show');
            calculateNextRecurringBill();
          } else {
            elRecurringPanel.classList.remove('show');
          }
        }
      });
    }

    // Recurring Frequency Select
    if (elRecurringFreq) {
      elRecurringFreq.addEventListener('change', (e) => {
        state.recurringFrequency = e.target.value;
        calculateNextRecurringBill();
      });
    }

    // Recurring Start Date
    if (elRecurringStart) {
      elRecurringStart.addEventListener('change', (e) => {
        state.recurringStartDate = e.target.value;
        calculateNextRecurringBill();
      });
    }

    // Recurring End Date
    if (elRecurringEnd) {
      elRecurringEnd.addEventListener('change', (e) => {
        state.recurringEndDate = e.target.value;
      });
    }

    // Reports Checkbox
    if (elReportsCheckbox) {
      elReportsCheckbox.addEventListener('change', (e) => {
        state.includeInReports = e.target.checked;
      });
    }

    // Essential Checkbox
    if (elEssentialCheckbox) {
      elEssentialCheckbox.addEventListener('change', (e) => {
        state.isEssential = e.target.checked;
      });
    }

    // Form Submit
    if (elForm) {
      elForm.addEventListener('submit', handleFormSubmit);
    }

    // Top Save Button
    if (elTopSaveBtn) {
      elTopSaveBtn.addEventListener('click', () => {
        if (elForm) elForm.requestSubmit();
      });
    }

    // Save as Draft
    if (elSaveDraftBtn) {
      elSaveDraftBtn.addEventListener('click', () => {
        showToast('Expense draft saved locally', 'info');
      });
    }

    // Header Notifications Popover
    const btnNotif = document.getElementById('btn-notification');
    const notifPopover = document.getElementById('notifications-popover');
    if (btnNotif && notifPopover) {
      btnNotif.addEventListener('click', (e) => {
        notifPopover.classList.toggle('show');
        e.stopPropagation();
      });
    }

    // Header User Profile Menu
    const userMenu = document.getElementById('user-profile-menu');
    const profilePopover = document.getElementById('profile-popover');
    if (userMenu && profilePopover) {
      userMenu.addEventListener('click', (e) => {
        profilePopover.classList.toggle('show');
        e.stopPropagation();
      });
    }

    // Mobile Sidebar Drawer
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

    // Close on click outside
    document.addEventListener('click', () => {
      if (notifPopover) notifPopover.classList.remove('show');
      if (profilePopover) profilePopover.classList.remove('show');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (notifPopover) notifPopover.classList.remove('show');
        if (profilePopover) profilePopover.classList.remove('show');
      }
    });

    // State Demo Switcher Pills
    document.querySelectorAll('[data-state-demo]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('[data-state-demo]').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        applyDemoState(e.target.dataset.stateDemo);
      });
    });
  }

  // Demo States (Section 17 Requirements)
  function applyDemoState(demoState) {
    if (demoState === 'normal') {
      elTitleInput.value = '';
      elAmountInput.value = '';
      elMerchantInput.value = '';
      state.title = '';
      state.amount = '';
      state.merchant = '';
      state.category = 'Groceries';
      if (elCategorySelect) elCategorySelect.value = 'Groceries';
      state.tags = ['Essential', 'Personal'];
      renderTags();
      removeReceiptFile();
      updatePreview();
      showToast('Form reset to initial state', 'info');
    } else if (demoState === 'prefilled') {
      elTitleInput.value = 'Weekly Grocery Stock';
      elAmountInput.value = '1850';
      elMerchantInput.value = 'Nature Basket Supermarket';
      elCategorySelect.value = 'Groceries';
      state.title = 'Weekly Grocery Stock';
      state.amount = '1850';
      state.category = 'Groceries';
      state.merchant = 'Nature Basket Supermarket';
      state.payment = 'Debit Card';
      if (elPaymentSelect) elPaymentSelect.value = 'Debit Card';
      state.tags = ['Groceries', 'Pantry', 'Weekly'];
      renderTags();
      updatePreview();
      showToast('Pre-filled sample expense loaded', 'info');
    } else if (demoState === 'recurring') {
      if (elRecurringToggle) {
        elRecurringToggle.checked = true;
        state.isRecurring = true;
        elRecurringPanel.classList.add('show');
        elRecurringFreq.value = 'Monthly';
        state.recurringFrequency = 'Monthly';
        calculateNextRecurringBill();
      }
      showToast('Recurring expense controls revealed', 'info');
    } else if (demoState === 'budget-warning') {
      elCategorySelect.value = 'Shopping';
      elAmountInput.value = '2500';
      state.category = 'Shopping';
      state.amount = '2500';
      state.title = 'Electronic Accessories';
      elTitleInput.value = 'Electronic Accessories';
      updatePreview();
      showToast('Showing budget threshold warning state', 'info');
    } else if (demoState === 'no-budget') {
      elCategorySelect.value = 'Travel';
      state.category = 'Travel';
      updatePreview();
      showToast('Category with no budget configured', 'info');
    } else if (demoState === 'empty-snapshot') {
      const elTot = document.getElementById('snapshot-total');
      const elCount = document.getElementById('snapshot-count');
      const elHighest = document.getElementById('snapshot-highest');
      if (elTot) elTot.textContent = '₹0.00';
      if (elCount) elCount.textContent = '0';
      if (elHighest) elHighest.textContent = 'None yet';
      showToast('Previewing empty monthly spending snapshot', 'info');
    } else if (demoState === 'api-error') {
      showToast('Error 500: Failed to persist expense record. Data preserved.', 'error');
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initListeners();
    renderTags();
    updatePreview();
    loadRealExpenseSnapshot();
  });

})();
