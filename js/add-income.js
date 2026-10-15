/**
 * Finora Expense Tracker — Screen 6: Add Income Page JavaScript
 * Handles real-time form-to-preview synchronization, dynamic tag management,
 * recurring income calculator, form validation, simulated API submission, and toast alerts.
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

  // State Management
  const state = {
    title: '',
    amount: '',
    source: 'Salary',
    date: '2026-10-15',
    payment: 'Bank Transfer',
    account: 'Primary Bank Account',
    description: '',
    tags: ['Monthly', 'Work'],
    isRecurring: false,
    recurringFrequency: 'Monthly',
    recurringStartDate: '2026-10-15',
    recurringEndDate: '',
    includeInReports: true,
    isSubmitting: false,
    snapshotData: {
      totalIncome: 0,
      recordsCount: 0,
      largestSource: 'None'
    }
  };

  // DOM Elements
  const elForm = document.getElementById('add-income-form');
  const elTitleInput = document.getElementById('income-title');
  const elAmountInput = document.getElementById('income-amount');
  const elSourceSelect = document.getElementById('income-source');
  const elDateInput = document.getElementById('income-date');
  const elPaymentSelect = document.getElementById('income-payment');
  const elAccountSelect = document.getElementById('income-account');
  const elDescTextarea = document.getElementById('income-description');
  const elTagsContainer = document.getElementById('tags-chips-list');
  const elTagInput = document.getElementById('tag-input');

  // Recurring Elements
  const elRecurringToggle = document.getElementById('recurring-toggle');
  const elRecurringPanel = document.getElementById('recurring-fields-panel');
  const elRecurringFreq = document.getElementById('recurring-frequency');
  const elRecurringStart = document.getElementById('recurring-start-date');
  const elRecurringEnd = document.getElementById('recurring-end-date');
  const elRecurringPreview = document.getElementById('recurring-next-payout');
  const elReportsCheckbox = document.getElementById('include-reports-check');

  // Preview Elements
  const elPreviewAmount = document.getElementById('preview-amount-val');
  const elPreviewTitle = document.getElementById('preview-title-val');
  const elPreviewSource = document.getElementById('preview-source-val');
  const elPreviewDate = document.getElementById('preview-date-val');
  const elPreviewPayment = document.getElementById('preview-payment-val');
  const elPreviewAccount = document.getElementById('preview-account-val');
  const elPreviewBadge = document.getElementById('preview-status-badge');

  // Buttons
  const elTopSaveBtn = document.getElementById('btn-top-save');
  const elBottomSaveBtn = document.getElementById('btn-bottom-save');
  const elSaveDraftBtn = document.getElementById('btn-save-draft');

  // Toast Container
  const elToastContainer = document.getElementById('toast-container');

  // Format currency in Indian Rupees
  function formatINR(val) {
    if (!val || isNaN(val) || Number(val) <= 0) return '₹0.00';
    return '+₹' + Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Format date display (e.g. 15 Oct 2026)
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
      elPreviewAmount.style.color = 'var(--color-income-text)';
    } else {
      elPreviewAmount.textContent = '₹0.00';
      elPreviewAmount.style.color = 'var(--text-secondary)';
    }

    // Title
    elPreviewTitle.textContent = state.title.trim() ? state.title.trim() : 'Monthly Salary';

    // Source
    elPreviewSource.textContent = state.source || 'Salary';

    // Date
    elPreviewDate.textContent = formatDateDisplay(state.date);

    // Payment Method
    elPreviewPayment.textContent = state.payment || 'Bank Transfer';

    // Deposit Account
    elPreviewAccount.textContent = state.account || 'Primary Bank Account';

    // Status Badge
    const isValid = state.title.trim() !== '' && !isNaN(amountVal) && amountVal > 0 && state.date;
    if (isValid) {
      elPreviewBadge.textContent = 'Ready to save';
      elPreviewBadge.className = 'preview-badge-status ready';
    } else {
      elPreviewBadge.textContent = 'Drafting';
      elPreviewBadge.className = 'preview-badge-status drafting';
    }

    // Next recurring calculation if recurring is checked
    if (state.isRecurring) {
      calculateNextRecurringPayout();
    }
  }

  // Calculate Next Expected Payout
  function calculateNextRecurringPayout() {
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
        elRecurringPreview.textContent = `Next payout expected on: ${formatDateDisplay(d.toISOString().slice(0, 10))}`;
      }
    } catch (e) {
      elRecurringPreview.textContent = 'Next payout scheduled automatically';
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

  // Inline Validation
  function validateField(fieldId) {
    let isValid = true;
    if (fieldId === 'income-title') {
      const err = document.getElementById('error-title');
      if (!elTitleInput.value.trim()) {
        elTitleInput.classList.add('is-invalid');
        if (err) err.classList.add('show');
        isValid = false;
      } else {
        elTitleInput.classList.remove('is-invalid');
        if (err) err.classList.remove('show');
      }
    } else if (fieldId === 'income-amount') {
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
    } else if (fieldId === 'income-date') {
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
    const validTitle = validateField('income-title');
    const validAmount = validateField('income-amount');
    const validDate = validateField('income-date');
    return validTitle && validAmount && validDate;
  }

  // Handle Save Submission (Simulated API flow)
  // Handle Save Submission (Real MongoDB API flow)
  async function handleFormSubmit(e) {
    if (e) e.preventDefault();
    if (state.isSubmitting) return;

    if (!validateAll()) {
      showToast('Please fix the errors in the form before saving.', 'error');
      return;
    }

    state.isSubmitting = true;
    setLoadingState(true);

    // Prepare API Payload matching Income model
    const payload = {
      title: state.title.trim(),
      amount: parseFloat(state.amount),
      category: state.source,
      incomeDate: state.date,
      paymentMethod: state.payment,
      depositAccount: state.account,
      description: state.description.trim() || undefined,
      tags: state.tags,
      isRecurring: state.isRecurring,
      recurrence: state.isRecurring ? {
        frequency: state.recurringFrequency,
        startDate: state.recurringStartDate,
        endDate: state.recurringEndDate || null
      } : null,
      includeInReports: state.includeInReports
    };

    try {
      const response = await fetchAuth('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to save income record to database');
      }

      // Record saved successfully
      setLoadingState(false);
      state.isSubmitting = false;

      // Update snapshot metrics with newly added income
      state.snapshotData.totalIncome += payload.amount;
      state.snapshotData.recordsCount += 1;
      updateSnapshotMetrics();

      const formattedAmt = window.FinoraCurrency ? window.FinoraCurrency.formatINR(payload.amount) : ('₹' + payload.amount.toLocaleString('en-IN'));
      showToast(`Income "${payload.title}" added successfully! (${formattedAmt})`, 'success');

      // Update badge to saved state
      if (elPreviewBadge) {
        elPreviewBadge.textContent = 'Saved to database';
        elPreviewBadge.className = 'preview-badge-status ready';
      }

      // Provide navigation option after short delay
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
      showToast(err.message || 'Could not save income. Please try again.', 'error');
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
          <span>Save Income</span>
        `;
      }
    });
  }

  function updateSnapshotMetrics() {
    const elTot = document.getElementById('snapshot-total');
    const elCount = document.getElementById('snapshot-count');
    const elLargest = document.getElementById('snapshot-largest');
    const elBreakdownLabel = document.getElementById('snapshot-breakdown-label');

    const formatted = window.FinoraCurrency 
      ? window.FinoraCurrency.formatINR(state.snapshotData.totalIncome) 
      : ('₹' + state.snapshotData.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    if (elTot) elTot.textContent = formatted;
    if (elCount) elCount.textContent = state.snapshotData.recordsCount;
    if (elLargest) elLargest.textContent = state.snapshotData.largestSource;

    if (elBreakdownLabel) {
      if (state.snapshotData.recordsCount === 0) {
        elBreakdownLabel.textContent = 'No income records yet';
      } else {
        elBreakdownLabel.textContent = `${state.snapshotData.largestSource} is top source`;
      }
    }
  }

  async function loadRealSnapshot() {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const res = await fetchAuth(`/api/summary/monthly?year=${year}&month=${month}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.summary) {
        const sum = data.summary;
        state.snapshotData.totalIncome = sum.totalIncome || 0;
        state.snapshotData.recordsCount = sum.incomeCount || 0;
        if (sum.incomeByCategory && sum.incomeByCategory.length > 0) {
          const top = sum.incomeByCategory[0];
          const topFormatted = window.FinoraCurrency ? window.FinoraCurrency.formatINR(top.total) : `₹${top.total}`;
          state.snapshotData.largestSource = `${top.category} (${topFormatted})`;
        } else {
          state.snapshotData.largestSource = 'None';
        }
        updateSnapshotMetrics();
      }
    } catch (e) {
      console.warn('Could not load monthly snapshot:', e);
    }
  }

  // Event Listeners
  function initListeners() {
    // Title Input
    if (elTitleInput) {
      elTitleInput.addEventListener('input', (e) => {
        state.title = e.target.value;
        validateField('income-title');
        updatePreview();
      });
      elTitleInput.addEventListener('blur', () => validateField('income-title'));
    }

    // Amount Input
    if (elAmountInput) {
      elAmountInput.addEventListener('input', (e) => {
        state.amount = e.target.value;
        validateField('income-amount');
        updatePreview();
      });
      elAmountInput.addEventListener('blur', () => validateField('income-amount'));
    }

    // Source Select
    if (elSourceSelect) {
      elSourceSelect.addEventListener('change', (e) => {
        state.source = e.target.value;
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
        validateField('income-date');
        updatePreview();
      });
      elDateInput.addEventListener('blur', () => validateField('income-date'));
    }

    // Payment Method
    if (elPaymentSelect) {
      elPaymentSelect.addEventListener('change', (e) => {
        state.payment = e.target.value;
        updatePreview();
      });
    }

    // Deposit Account
    if (elAccountSelect) {
      elAccountSelect.addEventListener('change', (e) => {
        state.account = e.target.value;
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

    // Recurring Toggle Switch
    if (elRecurringToggle) {
      elRecurringToggle.addEventListener('change', (e) => {
        state.isRecurring = e.target.checked;
        if (elRecurringPanel) {
          if (state.isRecurring) {
            elRecurringPanel.classList.add('show');
            calculateNextRecurringPayout();
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
        calculateNextRecurringPayout();
      });
    }

    // Recurring Start Date
    if (elRecurringStart) {
      elRecurringStart.addEventListener('change', (e) => {
        state.recurringStartDate = e.target.value;
        calculateNextRecurringPayout();
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
        showToast('Income draft saved to local storage', 'info');
      });
    }

    // Manage Sources Modal Trigger
    const btnManageSources = document.getElementById('btn-manage-sources');
    if (btnManageSources) {
      btnManageSources.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Custom income source category management is available in Account Settings.', 'info');
      });
    }

    // Notification Dropdown Popover
    const btnNotif = document.getElementById('btn-notification');
    const notifPopover = document.getElementById('notifications-popover');
    if (btnNotif && notifPopover) {
      btnNotif.addEventListener('click', (e) => {
        notifPopover.classList.toggle('show');
        e.stopPropagation();
      });
    }

    // User Profile Dropdown Popover
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

    // Close popovers on click outside
    document.addEventListener('click', () => {
      if (notifPopover) notifPopover.classList.remove('show');
      if (profilePopover) profilePopover.classList.remove('show');
    });

    // Close on Escape
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
        const demoState = e.target.dataset.stateDemo;
        applyDemoState(demoState);
      });
    });
  }

  // Demo Switcher States for Testing Section 13 Requirements
  function applyDemoState(demoState) {
    if (demoState === 'normal') {
      elTitleInput.value = '';
      elAmountInput.value = '';
      state.title = '';
      state.amount = '';
      state.tags = ['Monthly', 'Work'];
      renderTags();
      updatePreview();
      showToast('Form reset to empty initial state', 'info');
    } else if (demoState === 'prefilled') {
      elTitleInput.value = 'Client Retainer - Q4';
      elAmountInput.value = '35000';
      elSourceSelect.value = 'Business';
      elPaymentSelect.value = 'Bank Transfer';
      elAccountSelect.value = 'Primary Bank Account';
      state.title = 'Client Retainer - Q4';
      state.amount = '35000';
      state.source = 'Business';
      state.payment = 'Bank Transfer';
      state.account = 'Primary Bank Account';
      state.tags = ['Client', 'Retainer', 'Quarterly'];
      renderTags();
      updatePreview();
      showToast('Pre-filled sample income record loaded', 'info');
    } else if (demoState === 'recurring') {
      if (elRecurringToggle) {
        elRecurringToggle.checked = true;
        state.isRecurring = true;
        elRecurringPanel.classList.add('show');
        elRecurringFreq.value = 'Monthly';
        state.recurringFrequency = 'Monthly';
        calculateNextRecurringPayout();
      }
      showToast('Recurring income controls revealed', 'info');
    } else if (demoState === 'empty-snapshot') {
      const elTot = document.getElementById('snapshot-total');
      const elCount = document.getElementById('snapshot-count');
      const elLargest = document.getElementById('snapshot-largest');
      if (elTot) elTot.textContent = '₹0.00';
      if (elCount) elCount.textContent = '0';
      if (elLargest) elLargest.textContent = 'None yet';
      showToast('Previewing empty monthly history state', 'info');
    } else if (demoState === 'api-error') {
      showToast('Error 500: Database connection timed out. Form data preserved.', 'error');
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
    loadRealSnapshot();
  });

})();
