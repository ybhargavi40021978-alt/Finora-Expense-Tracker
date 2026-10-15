/**
 * ==============================================================================
 * FINORA EXPENSE TRACKER — SCREEN 12: RECURRING TRANSACTIONS JS
 * Brand: Finora | "Track. Plan. Save. Grow."
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- Initial Recurring Schedules Dataset ---
  const INITIAL_SCHEDULES = [
    {
      id: 'rec-1',
      title: 'Rent Payment',
      type: 'expense',
      category: 'Housing',
      amount: 12000,
      frequency: 'Monthly',
      nextDate: '2026-10-18',
      reminder: '2 days before',
      status: 'Active',
      account: 'Primary Bank Account',
      description: 'Apartment monthly lease payment to landlord.',
      icon: 'ri-home-4-line',
      color: '#0EA5E9',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-2',
      title: 'Internet Broadband',
      type: 'expense',
      category: 'Bills & Utilities',
      amount: 999,
      frequency: 'Monthly',
      nextDate: '2026-10-20',
      reminder: '1 day before',
      status: 'Active',
      account: 'Debit Card',
      description: 'Fiber internet 300 Mbps monthly subscription.',
      icon: 'ri-wifi-line',
      color: '#20275D',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-3',
      title: 'Primary Salary',
      type: 'income',
      category: 'Salary',
      amount: 65000,
      frequency: 'Monthly',
      nextDate: '2026-10-25',
      reminder: 'On due date',
      status: 'Active',
      account: 'Primary Bank Account',
      description: 'Monthly salary from employment.',
      icon: 'ri-wallet-3-line',
      color: '#23B981',
      occurrenceHandling: 'auto'
    },
    {
      id: 'rec-4',
      title: 'Electricity Bill',
      type: 'expense',
      category: 'Bills & Utilities',
      amount: 2450,
      frequency: 'Monthly',
      nextDate: '2026-10-22',
      reminder: '3 days before',
      status: 'Active',
      account: 'UPI / Net Banking',
      description: 'State electricity board utility charge.',
      icon: 'ri-flashlight-line',
      color: '#F5B544',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-5',
      title: 'Netflix 4K UHD',
      type: 'expense',
      category: 'Subscriptions',
      amount: 649,
      frequency: 'Monthly',
      nextDate: '2026-10-28',
      reminder: '1 day before',
      status: 'Active',
      account: 'Credit Card',
      description: 'Family video streaming recurring subscription.',
      icon: 'ri-film-line',
      color: '#A855F7',
      occurrenceHandling: 'auto'
    },
    {
      id: 'rec-6',
      title: 'Gym Membership',
      type: 'expense',
      category: 'Subscriptions',
      amount: 1500,
      frequency: 'Monthly',
      nextDate: null,
      reminder: 'Disabled',
      status: 'Paused',
      account: 'Debit Card',
      description: 'Fitness club monthly recurring pass.',
      icon: 'ri-riding-line',
      color: '#8B5CF6',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-7',
      title: 'Freelance Retainer',
      type: 'income',
      category: 'Freelance',
      amount: 25000,
      frequency: 'Monthly',
      nextDate: '2026-11-01',
      reminder: '2 days before',
      status: 'Active',
      account: 'Savings Account',
      description: 'Design consulting retainer from agency client.',
      icon: 'ri-macbook-line',
      color: '#48B9F5',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-8',
      title: 'Vehicle Insurance EMI',
      type: 'expense',
      category: 'Transportation',
      amount: 7800,
      frequency: 'Yearly',
      nextDate: '2026-12-15',
      reminder: '7 days before',
      status: 'Active',
      account: 'Primary Bank Account',
      description: 'Annual comprehensive four-wheeler coverage.',
      icon: 'ri-car-line',
      color: '#48B9F5',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-9',
      title: 'Health Insurance EMI',
      type: 'expense',
      category: 'Healthcare',
      amount: 2200,
      frequency: 'Monthly',
      nextDate: '2026-10-16',
      reminder: '1 day before',
      status: 'Active',
      account: 'Primary Bank Account',
      description: 'Individual medical policy premium.',
      icon: 'ri-heart-pulse-line',
      color: '#E11D48',
      occurrenceHandling: 'confirm'
    },
    {
      id: 'rec-10',
      title: 'Mobile Postpaid',
      type: 'expense',
      category: 'Bills & Utilities',
      amount: 799,
      frequency: 'Monthly',
      nextDate: '2026-10-19',
      reminder: '1 day before',
      status: 'Active',
      account: 'UPI',
      description: 'Unlimited 5G mobile network plan.',
      icon: 'ri-smartphone-line',
      color: '#FB923C',
      occurrenceHandling: 'confirm'
    }
  ];

  // --- State ---
  let schedules = [...INITIAL_SCHEDULES];
  let currentTab = 'all'; // 'all' | 'expense' | 'income' | 'paused'
  let searchQuery = '';
  let filterFrequency = 'all';
  let filterCategory = 'all';
  let filterStatus = 'all';
  let sortBy = 'due-date';
  let isCalendarView = false;
  let activeDemoState = 'standard';

  // Modal Editing State
  let editingScheduleId = null;
  let recordingScheduleId = null;
  let selectedType = 'expense';

  // Details Drawer State
  let activeDetailsSchedule = null;

  // Confirmation Modal State
  let confirmCallback = null;

  // --- Indian Rupee Formatter ---
  function formatINR(val) {
    if (isNaN(val)) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  // --- DOM Elements ---
  const tableContainer = document.getElementById('table-container');
  const calendarContainer = document.getElementById('calendar-container');
  const scheduleTableBody = document.getElementById('schedule-table-body');
  const upcomingPanelItems = document.getElementById('upcoming-panel-items');

  // Summary Card Elements
  const countActiveEl = document.getElementById('count-active-schedules');
  const upcomingExpensesEl = document.getElementById('val-upcoming-expenses');
  const expectedIncomeEl = document.getElementById('val-expected-income');
  const dueSoonCountEl = document.getElementById('count-due-soon');

  // Tab buttons
  const tabAllBtn = document.getElementById('tab-all');
  const tabExpenseBtn = document.getElementById('tab-expense');
  const tabIncomeBtn = document.getElementById('tab-income');
  const tabPausedBtn = document.getElementById('tab-paused');
  const tabAllCount = document.getElementById('tab-all-count');
  const tabExpenseCount = document.getElementById('tab-expense-count');
  const tabIncomeCount = document.getElementById('tab-income-count');
  const tabPausedCount = document.getElementById('tab-paused-count');

  // Search & Filter controls
  const searchInput = document.getElementById('search-recurring');
  const filterFreqSelect = document.getElementById('filter-frequency');
  const filterCatSelect = document.getElementById('filter-category');
  const filterStatusSelect = document.getElementById('filter-status');
  const sortSelect = document.getElementById('sort-recurring');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const calendarToggleBtn = document.getElementById('calendar-toggle-btn');

  // Modals
  const scheduleModalOverlay = document.getElementById('schedule-modal-overlay');
  const scheduleForm = document.getElementById('schedule-form');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const schedTitleInput = document.getElementById('sched-title');
  const schedAmountInput = document.getElementById('sched-amount');
  const schedCatSelect = document.getElementById('sched-category');
  const schedAccountSelect = document.getElementById('sched-account');
  const schedDescInput = document.getElementById('sched-desc');
  const schedFreqSelect = document.getElementById('sched-frequency');
  const schedStartDateInput = document.getElementById('sched-start-date');
  const schedReminderSelect = document.getElementById('sched-reminder');
  const typeRadioCards = document.querySelectorAll('.type-radio-card');

  // Record Payment Modal
  const recordModalOverlay = document.getElementById('record-modal-overlay');
  const recordTitleEl = document.getElementById('record-sched-title');
  const recordAmountInput = document.getElementById('record-actual-amount');
  const recordDateInput = document.getElementById('record-actual-date');
  const recordAccountSelect = document.getElementById('record-account');
  const recordNotesInput = document.getElementById('record-notes');
  const recordSubmitBtn = document.getElementById('record-submit-btn');

  // Details Side Drawer
  const detailsDrawerBackdrop = document.getElementById('drawer-backdrop');
  const detailsDrawer = document.getElementById('details-drawer');
  const drawerIcon = document.getElementById('drawer-icon');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBadges = document.getElementById('drawer-badges');
  const drawerDesc = document.getElementById('drawer-desc');
  const drawerAmount = document.getElementById('drawer-amt');
  const drawerFreq = document.getElementById('drawer-freq');
  const drawerNext = document.getElementById('drawer-next');
  const drawerAccount = document.getElementById('drawer-account');
  const drawerHandling = document.getElementById('drawer-handling');
  const drawerRecordBtn = document.getElementById('drawer-record-btn');
  const drawerEditBtn = document.getElementById('drawer-edit-btn');
  const drawerPauseBtn = document.getElementById('drawer-pause-btn');

  // Confirm Modal
  const confirmModalOverlay = document.getElementById('confirm-modal-overlay');
  const confirmTitle = document.getElementById('confirm-title');
  const confirmDesc = document.getElementById('confirm-desc');
  const confirmActionBtn = document.getElementById('confirm-action-btn');

  // Commitments & Insights
  const commitExpensesEl = document.getElementById('commit-expenses');
  const commitIncomeEl = document.getElementById('commit-income');
  const commitNetEl = document.getElementById('commit-net');
  const commitBarExpenses = document.getElementById('commit-bar-expenses');
  const commitBarIncome = document.getElementById('commit-bar-income');
  const insightBulletsContainer = document.getElementById('insight-bullets');

  // Demo Switcher
  const demoButtons = document.querySelectorAll('.demo-btn');
  const apiErrorBanner = document.getElementById('api-error-banner');
  const retryBtn = document.getElementById('retry-btn');

  // Mobile navigation
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const toastContainer = document.getElementById('toast-container');

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

  // --- Due Date Helper Calculation ---
  function getDueTimingInfo(dateStr) {
    if (!dateStr) return { label: 'Paused', pillClass: 'due-later' };

    const today = new Date('2026-10-15'); // Current system date
    const target = new Date(dateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { label: 'Due today', pillClass: 'due-today' };
    } else if (diffDays === 1) {
      return { label: 'Due tomorrow', pillClass: 'due-soon' };
    } else if (diffDays > 1 && diffDays <= 7) {
      return { label: `Due in ${diffDays} days`, pillClass: 'due-soon' };
    } else if (diffDays < 0) {
      return { label: 'Awaiting confirmation', pillClass: 'due-today' };
    } else {
      return { label: `In ${diffDays} days`, pillClass: 'due-later' };
    }
  }

  // --- Calculate and Update Summaries ---
  function updateSummaries() {
    const active = schedules.filter(s => s.status === 'Active');
    const expenses = schedules.filter(s => s.type === 'expense');
    const income = schedules.filter(s => s.type === 'income');
    const paused = schedules.filter(s => s.status === 'Paused');

    // Counts for tabs
    if (tabAllCount) tabAllCount.textContent = schedules.length;
    if (tabExpenseCount) tabExpenseCount.textContent = expenses.length;
    if (tabIncomeCount) tabIncomeCount.textContent = income.length;
    if (tabPausedCount) tabPausedCount.textContent = paused.length;

    // Active Schedules count
    if (countActiveEl) countActiveEl.textContent = active.length;

    // Upcoming Expenses (next 30 days)
    const upcomingExpensesSum = active
      .filter(s => s.type === 'expense' && s.nextDate)
      .reduce((sum, s) => sum + s.amount, 0);
    if (upcomingExpensesEl) upcomingExpensesEl.textContent = formatINR(upcomingExpensesSum);

    // Expected Income (next 30 days)
    const expectedIncomeSum = active
      .filter(s => s.type === 'income' && s.nextDate)
      .reduce((sum, s) => sum + s.amount, 0);
    if (expectedIncomeEl) expectedIncomeEl.textContent = formatINR(expectedIncomeSum);

    // Payments Due Soon (within next 7 days, Oct 15 - Oct 22)
    const dueSoonCount = active.filter(s => {
      if (!s.nextDate) return false;
      const target = new Date(s.nextDate);
      const diffDays = Math.ceil((target - new Date('2026-10-15')) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;
    if (dueSoonCountEl) dueSoonCountEl.textContent = dueSoonCount;

    // Monthly Commitments card
    if (commitExpensesEl) commitExpensesEl.textContent = formatINR(upcomingExpensesSum);
    if (commitIncomeEl) commitIncomeEl.textContent = formatINR(expectedIncomeSum);
    const netFlow = expectedIncomeSum - upcomingExpensesSum;
    if (commitNetEl) {
      commitNetEl.textContent = (netFlow >= 0 ? '+' : '') + formatINR(netFlow);
      commitNetEl.style.color = netFlow >= 0 ? '#23B981' : '#F06575';
    }

    const totalFlow = upcomingExpensesSum + expectedIncomeSum;
    if (totalFlow > 0) {
      const expPercent = Math.round((upcomingExpensesSum / totalFlow) * 100);
      const incPercent = 100 - expPercent;
      if (commitBarExpenses) commitBarExpenses.style.width = `${expPercent}%`;
      if (commitBarIncome) commitBarIncome.style.width = `${incPercent}%`;
    }

    // Helpful Insights bullets
    if (insightBulletsContainer) {
      insightBulletsContainer.innerHTML = `
        <div class="insight-bullet-item">
          <i class="ri-alarm-warning-line" style="color: #F5B544; font-size: 1.15rem; flex-shrink: 0;"></i>
          <div><strong>${dueSoonCount} payment${dueSoonCount === 1 ? '' : 's'} due soon:</strong> Health Insurance EMI is due on October 16, and Rent Payment is due on October 18.</div>
        </div>
        <div class="insight-bullet-item">
          <i class="ri-checkbox-circle-line" style="color: #23B981; font-size: 1.15rem; flex-shrink: 0;"></i>
          <div><strong>Strong recurring cash flow:</strong> Your estimated recurring income exceeds recurring obligations by ${formatINR(netFlow)}.</div>
        </div>
        <div class="insight-bullet-item">
          <i class="ri-repeat-line" style="color: #7957FF; font-size: 1.15rem; flex-shrink: 0;"></i>
          <div><strong>Active schedules:</strong> You have 2 digital subscriptions and 3 utility bills automated.</div>
        </div>
      `;
    }
  }

  // --- Render Upcoming Payments Panel ---
  function renderUpcomingPanel() {
    if (!upcomingPanelItems) return;

    // Get active schedules sorted by nearest upcoming date
    const upcomingList = schedules
      .filter(s => s.status === 'Active' && s.nextDate)
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
      .slice(0, 3);

    upcomingPanelItems.innerHTML = upcomingList.map(s => {
      const timing = getDueTimingInfo(s.nextDate);
      const isExpense = s.type === 'expense';
      const formattedDate = new Date(s.nextDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <div class="upcoming-item-card" data-id="${s.id}">
          <div class="upcoming-item-top">
            <div class="upcoming-icon-title">
              <div class="upcoming-icon" style="background: ${s.color}15; color: ${s.color};">
                <i class="${s.icon}"></i>
              </div>
              <div class="upcoming-details">
                <h4>${s.title}</h4>
                <div class="upcoming-category-sub">${s.category} · ${s.frequency}</div>
              </div>
            </div>
            <span class="upcoming-due-pill ${timing.pillClass}">${timing.label}</span>
          </div>

          <div class="upcoming-item-bottom">
            <div style="color: #75809A;">
              <i class="ri-calendar-line"></i> ${formattedDate}
            </div>
            <div class="upcoming-amt ${isExpense ? 'expense' : 'income'}">
              ${isExpense ? '-' : '+'}${formatINR(s.amount)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click to open drawer
    upcomingPanelItems.querySelectorAll('.upcoming-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openDetailsDrawer(id);
      });
    });
  }

  // --- Render Main Schedules List & Table ---
  function renderSchedules() {
    if (activeDemoState === 'api-error') {
      scheduleTableBody.innerHTML = '';
      if (apiErrorBanner) apiErrorBanner.style.display = 'block';
      return;
    }
    if (apiErrorBanner) apiErrorBanner.style.display = 'none';

    // Filter schedules
    let list = schedules.filter(s => {
      // Tab filter
      if (currentTab === 'expense' && s.type !== 'expense') return false;
      if (currentTab === 'income' && s.type !== 'income') return false;
      if (currentTab === 'paused' && s.status !== 'Paused') return false;

      // Frequency filter
      if (filterFrequency !== 'all' && s.frequency.toLowerCase() !== filterFrequency.toLowerCase()) return false;

      // Category filter
      if (filterCategory !== 'all' && s.category !== filterCategory) return false;

      // Status filter
      if (filterStatus !== 'all' && s.status.toLowerCase() !== filterStatus.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchCat = s.category.toLowerCase().includes(q);
        const matchDesc = s.description ? s.description.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchCat && !matchDesc) return false;
      }

      return true;
    });

    // Sort schedules
    list.sort((a, b) => {
      if (sortBy === 'due-date') {
        if (!a.nextDate) return 1;
        if (!b.nextDate) return -1;
        return new Date(a.nextDate) - new Date(b.nextDate);
      }
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      return 0;
    });

    // Empty state
    if (list.length === 0) {
      scheduleTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 48px 20px;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: #F2EFFF; color: #7957FF; display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                <i class="ri-repeat-line"></i>
              </div>
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: #18213D;">No recurring schedules found</h4>
              <p style="font-size: 0.84rem; color: #75809A; max-width: 360px;">Try adjusting your keyword, frequency, or tab filters to find schedules.</p>
              <button class="btn-secondary" id="empty-clear-btn" style="margin-top: 6px;">
                <i class="ri-refresh-line"></i> Clear Filters
              </button>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('empty-clear-btn')?.addEventListener('click', clearAllFilters);
      return;
    }

    // Populate Table Rows
    scheduleTableBody.innerHTML = list.map(s => {
      const isExpense = s.type === 'expense';
      const timing = getDueTimingInfo(s.nextDate);
      const formattedDate = s.nextDate
        ? new Date(s.nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

      return `
        <tr data-id="${s.id}" class="schedule-row" style="cursor: pointer;">
          <!-- 1. Transaction -->
          <td>
            <div class="table-txn-cell">
              <div class="table-icon-tile" style="background: ${s.color}15; color: ${s.color};">
                <i class="${s.icon}"></i>
              </div>
              <div class="table-txn-info">
                <span class="table-txn-title">${s.title}</span>
                <span class="table-txn-desc">${s.account || 'Account unassigned'}</span>
              </div>
            </div>
          </td>

          <!-- 2. Category -->
          <td>
            <span style="font-size: 0.8125rem; font-weight: 600; color: #18213D; background: #F8F9FD; padding: 4px 10px; border-radius: 6px; border: 1px solid #E8EBF3;">
              ${s.category}
            </span>
          </td>

          <!-- 3. Amount -->
          <td>
            <span class="table-amt ${isExpense ? 'expense' : 'income'}">
              ${isExpense ? '-' : '+'}${formatINR(s.amount)}
            </span>
          </td>

          <!-- 4. Frequency -->
          <td>
            <span style="font-size: 0.84rem; font-weight: 500; color: #18213D;">${s.frequency}</span>
          </td>

          <!-- 5. Next Occurrence -->
          <td>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-weight: 600; font-size: 0.84rem; color: #18213D;">${formattedDate}</span>
              <span class="upcoming-due-pill ${timing.pillClass}" style="align-self: flex-start;">${timing.label}</span>
            </div>
          </td>

          <!-- 6. Reminder -->
          <td>
            <span style="font-size: 0.77rem; color: #75809A; display: flex; align-items: center; gap: 5px;">
              <i class="ri-notification-3-line" style="color: ${s.reminder === 'Disabled' ? '#75809A' : '#7957FF'};"></i>
              ${s.reminder}
            </span>
          </td>

          <!-- 7. Status -->
          <td>
            <span class="status-badge ${s.status.toLowerCase()}">
              ${s.status}
            </span>
          </td>

          <!-- 8. Actions Menu -->
          <td style="text-align: right; position: relative;">
            <button class="row-menu-btn" data-id="${s.id}" aria-label="Actions for ${s.title}">
              <i class="ri-more-2-fill"></i>
            </button>
            <div class="row-menu-dropdown" id="dropdown-${s.id}">
              <button class="menu-item menu-action-details" data-id="${s.id}">
                <i class="ri-eye-line"></i> View Details
              </button>
              <button class="menu-item menu-action-record" data-id="${s.id}">
                <i class="ri-checkbox-circle-line"></i> ${isExpense ? 'Record Payment' : 'Record Income'}
              </button>
              <button class="menu-item menu-action-edit" data-id="${s.id}">
                <i class="ri-edit-line"></i> Edit Schedule
              </button>
              <button class="menu-item menu-action-skip" data-id="${s.id}">
                <i class="ri-skip-forward-line"></i> Skip Occurrence
              </button>
              ${s.status === 'Active' ? `
                <button class="menu-item menu-action-pause" data-id="${s.id}">
                  <i class="ri-pause-circle-line"></i> Pause Schedule
                </button>
              ` : `
                <button class="menu-item menu-action-resume" data-id="${s.id}">
                  <i class="ri-play-circle-line"></i> Resume Schedule
                </button>
              `}
              <button class="menu-item danger menu-action-end" data-id="${s.id}">
                <i class="ri-stop-circle-line"></i> End Schedule
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    attachTableEventListeners();
  }

  // --- Attach Table Row & Dropdown Listeners ---
  function attachTableEventListeners() {
    // Row click -> open details (unless clicking menu)
    document.querySelectorAll('.schedule-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.row-menu-btn') || e.target.closest('.row-menu-dropdown')) {
          return;
        }
        const id = row.getAttribute('data-id');
        openDetailsDrawer(id);
      });
    });

    // Dropdown toggle
    document.querySelectorAll('.row-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const dropdown = document.getElementById(`dropdown-${id}`);
        document.querySelectorAll('.row-menu-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('show');
        });
        dropdown.classList.toggle('show');
      });
    });

    // Details action
    document.querySelectorAll('.menu-action-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailsDrawer(btn.getAttribute('data-id'));
      });
    });

    // Record action
    document.querySelectorAll('.menu-action-record').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRecordModal(btn.getAttribute('data-id'));
      });
    });

    // Edit action
    document.querySelectorAll('.menu-action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openScheduleModal(btn.getAttribute('data-id'));
      });
    });

    // Skip Occurrence action
    document.querySelectorAll('.menu-action-skip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const s = schedules.find(item => item.id === id);
        if (!s) return;
        openConfirmModal(
          `Skip next occurrence of "${s.title}"?`,
          `This will advance the next occurrence without recording a transaction for ${s.nextDate}. All schedule rules will remain intact.`,
          'Skip Occurrence',
          () => {
            advanceOccurrence(s);
            updateSummaries();
            renderUpcomingPanel();
            renderSchedules();
            showToast(`Skipped occurrence for "${s.title}". Next due date updated.`);
          }
        );
      });
    });

    // Pause action
    document.querySelectorAll('.menu-action-pause').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const s = schedules.find(item => item.id === id);
        if (!s) return;
        s.status = 'Paused';
        updateSummaries();
        renderUpcomingPanel();
        renderSchedules();
        showToast(`"${s.title}" schedule paused.`);
      });
    });

    // Resume action
    document.querySelectorAll('.menu-action-resume').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const s = schedules.find(item => item.id === id);
        if (!s) return;
        s.status = 'Active';
        if (!s.nextDate) s.nextDate = '2026-10-20';
        updateSummaries();
        renderUpcomingPanel();
        renderSchedules();
        showToast(`"${s.title}" schedule resumed.`);
      });
    });

    // End Schedule action
    document.querySelectorAll('.menu-action-end').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const s = schedules.find(item => item.id === id);
        if (!s) return;
        openConfirmModal(
          `End schedule "${s.title}"?`,
          `Future occurrences will be cancelled. All past transaction records associated with this schedule will remain preserved in your history.`,
          'End Schedule',
          () => {
            s.status = 'Ended';
            s.nextDate = null;
            updateSummaries();
            renderUpcomingPanel();
            renderSchedules();
            showToast(`"${s.title}" schedule has ended.`);
          }
        );
      });
    });
  }

  // Close menus on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.row-menu-dropdown').forEach(d => d.classList.remove('show'));
  });

  // --- Helper: Advance Next Occurrence Date ---
  function advanceOccurrence(schedule) {
    if (!schedule.nextDate) return;
    const current = new Date(schedule.nextDate);

    if (schedule.frequency === 'Monthly') {
      current.setMonth(current.getMonth() + 1);
    } else if (schedule.frequency === 'Weekly') {
      current.setDate(current.getDate() + 7);
    } else if (schedule.frequency === 'Yearly') {
      current.setFullYear(current.getFullYear() + 1);
    } else if (schedule.frequency === 'Daily') {
      current.setDate(current.getDate() + 1);
    } else if (schedule.frequency === 'Quarterly') {
      current.setMonth(current.getMonth() + 3);
    }

    schedule.nextDate = current.toISOString().split('T')[0];
  }

  // --- Details Side Drawer ---
  function openDetailsDrawer(id) {
    const s = schedules.find(item => item.id === id);
    if (!s) return;
    activeDetailsSchedule = s;

    drawerIcon.className = s.icon;
    drawerIcon.parentElement.style.background = `${s.color}15`;
    drawerIcon.parentElement.style.color = s.color;

    drawerTitle.textContent = s.title;
    drawerDesc.textContent = s.description || 'No description added for this schedule.';
    drawerAmount.textContent = (s.type === 'expense' ? '-' : '+') + formatINR(s.amount);
    drawerAmount.style.color = s.type === 'expense' ? '#F06575' : '#23B981';

    drawerFreq.textContent = s.frequency;
    drawerNext.textContent = s.nextDate || 'Paused';
    drawerAccount.textContent = s.account || 'Primary Bank Account';
    drawerHandling.textContent = s.occurrenceHandling === 'auto'
      ? 'Auto-generate pending transaction'
      : 'Ask for confirmation before recording';

    drawerBadges.innerHTML = `
      <span class="status-badge ${s.type === 'expense' ? 'expense' : 'active'}" style="background: ${s.type === 'expense' ? '#FEEFF1' : '#E8F8F2'}; color: ${s.type === 'expense' ? '#F06575' : '#23B981'};">
        ${s.type === 'expense' ? 'Expense' : 'Income'}
      </span>
      <span class="status-badge ${s.status.toLowerCase()}">${s.status}</span>
    `;

    drawerRecordBtn.textContent = s.type === 'expense' ? 'Record Payment Now' : 'Record Income Now';
    drawerRecordBtn.onclick = () => {
      closeDetailsDrawer();
      openRecordModal(s.id);
    };

    drawerEditBtn.onclick = () => {
      closeDetailsDrawer();
      openScheduleModal(s.id);
    };

    drawerPauseBtn.textContent = s.status === 'Active' ? 'Pause Schedule' : 'Resume Schedule';
    drawerPauseBtn.onclick = () => {
      s.status = s.status === 'Active' ? 'Paused' : 'Active';
      if (s.status === 'Active' && !s.nextDate) s.nextDate = '2026-10-20';
      updateSummaries();
      renderUpcomingPanel();
      renderSchedules();
      closeDetailsDrawer();
      showToast(`"${s.title}" status updated to ${s.status}.`);
    };

    detailsDrawerBackdrop.classList.add('active');
    detailsDrawer.classList.add('open');
  }

  function closeDetailsDrawer() {
    detailsDrawerBackdrop.classList.remove('active');
    detailsDrawer.classList.remove('open');
    activeDetailsSchedule = null;
  }

  // --- Record Payment / Income Modal ---
  function openRecordModal(id) {
    const s = schedules.find(item => item.id === id);
    if (!s) return;
    recordingScheduleId = s.id;

    recordTitleEl.textContent = `${s.type === 'expense' ? 'Record Payment:' : 'Record Income:'} ${s.title}`;
    recordAmountInput.value = s.amount;
    recordDateInput.value = new Date().toISOString().split('T')[0];
    recordAccountSelect.value = s.account || 'Primary Bank Account';
    recordNotesInput.value = `Recurring occurrence for ${s.nextDate || 'scheduled period'}.`;
    recordSubmitBtn.textContent = s.type === 'expense' ? 'Confirm and Record Payment' : 'Confirm and Record Income';

    recordModalOverlay.classList.add('active');
  }

  function closeRecordModal() {
    recordModalOverlay.classList.remove('active');
    recordingScheduleId = null;
  }

  document.getElementById('record-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = schedules.find(item => item.id === recordingScheduleId);
    if (!s) return;

    advanceOccurrence(s);
    updateSummaries();
    renderUpcomingPanel();
    renderSchedules();
    closeRecordModal();
    showToast(`Transaction recorded for "${s.title}". Next occurrence scheduled.`);
  });

  // --- Create / Edit Schedule Modal ---
  function openScheduleModal(id = null) {
    editingScheduleId = id;

    if (id) {
      const s = schedules.find(item => item.id === id);
      if (!s) return;
      modalTitle.textContent = 'Edit Recurring Schedule';
      modalSubtitle.textContent = 'Adjust schedule frequency, amount, or reminder rules.';
      schedTitleInput.value = s.title;
      schedAmountInput.value = s.amount;
      schedCatSelect.value = s.category;
      schedAccountSelect.value = s.account;
      schedDescInput.value = s.description || '';
      schedFreqSelect.value = s.frequency;
      schedStartDateInput.value = s.nextDate || '2026-10-18';
      schedReminderSelect.value = s.reminder;
      selectedType = s.type;
    } else {
      modalTitle.textContent = 'Create Recurring Schedule';
      modalSubtitle.textContent = 'Set it once and keep your finances organized.';
      scheduleForm.reset();
      schedStartDateInput.value = '2026-10-18';
      selectedType = currentTab === 'income' ? 'income' : 'expense';
    }

    typeRadioCards.forEach(c => {
      c.classList.toggle('selected', c.getAttribute('data-type') === selectedType);
    });

    scheduleModalOverlay.classList.add('active');
    schedTitleInput.focus();
  }

  function closeScheduleModal() {
    scheduleModalOverlay.classList.remove('active');
    editingScheduleId = null;
  }

  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = schedTitleInput.value.trim();
    const amount = parseFloat(schedAmountInput.value);

    if (!title || isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid title and amount.', 'ri-error-warning-fill');
      return;
    }

    if (editingScheduleId) {
      const s = schedules.find(item => item.id === editingScheduleId);
      if (s) {
        s.title = title;
        s.amount = amount;
        s.category = schedCatSelect.value;
        s.account = schedAccountSelect.value;
        s.description = schedDescInput.value.trim();
        s.frequency = schedFreqSelect.value;
        s.nextDate = schedStartDateInput.value;
        s.reminder = schedReminderSelect.value;
        s.type = selectedType;
        showToast(`Schedule "${s.title}" updated successfully.`);
      }
    } else {
      const newSchedule = {
        id: 'rec-' + Date.now(),
        title: title,
        type: selectedType,
        category: schedCatSelect.value,
        amount: amount,
        frequency: schedFreqSelect.value,
        nextDate: schedStartDateInput.value,
        reminder: schedReminderSelect.value,
        status: 'Active',
        account: schedAccountSelect.value,
        description: schedDescInput.value.trim(),
        icon: selectedType === 'income' ? 'ri-wallet-3-line' : 'ri-file-text-line',
        color: selectedType === 'income' ? '#23B981' : '#7957FF',
        occurrenceHandling: 'confirm'
      };
      schedules.unshift(newSchedule);
      showToast(`Schedule "${newSchedule.title}" created successfully.`);
    }

    closeScheduleModal();
    updateSummaries();
    renderUpcomingPanel();
    renderSchedules();
  });

  typeRadioCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedType = card.getAttribute('data-type');
      typeRadioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // --- Confirmation Modal ---
  function openConfirmModal(title, desc, actionLabel, onConfirm) {
    confirmTitle.textContent = title;
    confirmDesc.textContent = desc;
    confirmActionBtn.textContent = actionLabel;
    confirmCallback = onConfirm;
    confirmModalOverlay.classList.add('active');
  }

  function closeConfirmModal() {
    confirmModalOverlay.classList.remove('active');
    confirmCallback = null;
  }

  confirmActionBtn.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  });

  // --- Segment Tabs Switcher ---
  function setTab(tab) {
    currentTab = tab;
    [tabAllBtn, tabExpenseBtn, tabIncomeBtn, tabPausedBtn].forEach(b => b.classList.remove('active', 'tab-income', 'tab-expense'));

    if (tab === 'all') tabAllBtn.classList.add('active');
    if (tab === 'expense') tabExpenseBtn.classList.add('active', 'tab-expense');
    if (tab === 'income') tabIncomeBtn.classList.add('active', 'tab-income');
    if (tab === 'paused') tabPausedBtn.classList.add('active');

    renderSchedules();
  }

  tabAllBtn?.addEventListener('click', () => setTab('all'));
  tabExpenseBtn?.addEventListener('click', () => setTab('expense'));
  tabIncomeBtn?.addEventListener('click', () => setTab('income'));
  tabPausedBtn?.addEventListener('click', () => setTab('paused'));

  // --- Search & Filters ---
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSchedules();
  });

  filterFreqSelect?.addEventListener('change', (e) => {
    filterFrequency = e.target.value;
    renderSchedules();
  });

  filterCatSelect?.addEventListener('change', (e) => {
    filterCategory = e.target.value;
    renderSchedules();
  });

  filterStatusSelect?.addEventListener('change', (e) => {
    filterStatus = e.target.value;
    renderSchedules();
  });

  sortSelect?.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderSchedules();
  });

  function clearAllFilters() {
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    filterFrequency = 'all';
    if (filterFreqSelect) filterFreqSelect.value = 'all';
    filterCategory = 'all';
    if (filterCatSelect) filterCatSelect.value = 'all';
    filterStatus = 'all';
    if (filterStatusSelect) filterStatusSelect.value = 'all';
    sortBy = 'due-date';
    if (sortSelect) sortSelect.value = 'due-date';
    setTab('all');
  }

  clearFiltersBtn?.addEventListener('click', clearAllFilters);

  // --- Calendar View Toggle ---
  calendarToggleBtn?.addEventListener('click', () => {
    isCalendarView = !isCalendarView;
    if (isCalendarView) {
      calendarToggleBtn.innerHTML = '<i class="ri-table-line"></i> Table View';
      calendarToggleBtn.classList.add('active');
      tableContainer.style.display = 'none';
      calendarContainer.classList.add('active');
      renderCalendar();
    } else {
      calendarToggleBtn.innerHTML = '<i class="ri-calendar-line"></i> Calendar View';
      calendarToggleBtn.classList.remove('active');
      tableContainer.style.display = 'block';
      calendarContainer.classList.remove('active');
    }
  });

  function renderCalendar() {
    const calGrid = document.getElementById('cal-days-grid');
    if (!calGrid) return;

    // October 2026 starts on Thursday (index 4)
    // 31 Days
    const daysInMonth = 31;
    const startDayOffset = 4; // Thursday

    let cellsHtml = '';

    // Blank cells before day 1
    for (let i = 0; i < startDayOffset; i++) {
      cellsHtml += `<div class="cal-cell" style="opacity: 0.35; background: #FFF;"></div>`;
    }

    // Days 1 to 31
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
      const isToday = day === 15;

      // Find events matching this day
      const dayEvents = schedules.filter(s => s.status === 'Active' && s.nextDate === dateStr);

      const eventsHtml = dayEvents.map(e => `
        <div class="cal-event-pill ${e.type}" data-id="${e.id}" title="${e.title} - ${formatINR(e.amount)}">
          <span>${e.title}</span>
          <strong>${formatINR(e.amount)}</strong>
        </div>
      `).join('');

      cellsHtml += `
        <div class="cal-cell ${isToday ? 'today' : ''}">
          <div class="cal-date-number">${day} ${isToday ? '<span style="color: #7957FF;">(Today)</span>' : ''}</div>
          ${eventsHtml}
        </div>
      `;
    }

    calGrid.innerHTML = cellsHtml;

    // Attach click to calendar event pills
    calGrid.querySelectorAll('.cal-event-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = pill.getAttribute('data-id');
        openDetailsDrawer(id);
      });
    });
  }

  // --- Demo Switcher Toolbar ---
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDemoState = btn.getAttribute('data-state');

      if (isCalendarView && activeDemoState !== 'calendar') {
        calendarToggleBtn.click();
      }

      if (activeDemoState === 'standard') {
        schedules = [...INITIAL_SCHEDULES];
        clearAllFilters();
      } else if (activeDemoState === 'expenses-only') {
        setTab('expense');
      } else if (activeDemoState === 'income-only') {
        setTab('income');
      } else if (activeDemoState === 'paused-only') {
        setTab('paused');
      } else if (activeDemoState === 'calendar') {
        if (!isCalendarView) calendarToggleBtn.click();
      } else if (activeDemoState === 'empty') {
        schedules = [];
        updateSummaries();
        renderUpcomingPanel();
        renderSchedules();
        return;
      } else if (activeDemoState === 'api-error') {
        renderSchedules();
        return;
      }

      updateSummaries();
      renderUpcomingPanel();
      renderSchedules();
    });
  });

  retryBtn?.addEventListener('click', () => {
    activeDemoState = 'standard';
    demoButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-state') === 'standard'));
    schedules = [...INITIAL_SCHEDULES];
    updateSummaries();
    renderUpcomingPanel();
    renderSchedules();
    showToast('Schedules reloaded from /api/recurring');
  });

  // --- Global Modal Close & Cancel Handlers ---
  document.getElementById('create-schedule-btn')?.addEventListener('click', () => openScheduleModal());
  document.getElementById('modal-close-btn')?.addEventListener('click', closeScheduleModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeScheduleModal);
  document.getElementById('record-close-btn')?.addEventListener('click', closeRecordModal);
  document.getElementById('record-cancel-btn')?.addEventListener('click', closeRecordModal);
  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDetailsDrawer);
  detailsDrawerBackdrop?.addEventListener('click', closeDetailsDrawer);
  document.getElementById('confirm-cancel-btn')?.addEventListener('click', closeConfirmModal);

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
      closeScheduleModal();
      closeRecordModal();
      closeDetailsDrawer();
      closeConfirmModal();
    }
  });

  // Initial Boot
  updateSummaries();
  renderUpcomingPanel();
  renderSchedules();

})();
