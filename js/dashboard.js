/**
 * Finora Expense Tracker — Screen 4: Real Data Dashboard Logic
 * Fully integrated with MongoDB via Express APIs.
 * Zero demo/mock data: calculated purely from persisted user entries.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Global State for Dashboard Date Selection
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1; // 1-12
  let currentPeriodView = 'month'; // 'month' or 'year'

  // DOM Elements - Selectors
  const btnDateSelector = document.getElementById('btn-date-selector');
  const dateDropdownMenu = document.getElementById('date-dropdown-menu');
  const selectedDateLabel = document.getElementById('selected-date-label');
  const dateOptionBtns = document.querySelectorAll('.date-option-btn');

  // Summary Metrics
  const valBalance = document.getElementById('val-balance');
  const valIncome = document.getElementById('val-income');
  const valExpenses = document.getElementById('val-expenses');
  const valSavings = document.getElementById('val-savings');

  // Donut Elements
  const donutCenterAmount = document.getElementById('donut-center-amount');
  const donutCenterLabel = document.getElementById('donut-center-label');
  const donutSegmentsGroup = document.getElementById('donut-segments-group');
  const categoryLegendList = document.getElementById('category-legend-list');

  // Transactions Table
  const headerSearch = document.getElementById('header-search');
  const transactionsTbody = document.getElementById('transactions-tbody');

  // Chart Toggle & Stage
  const barChartStage = document.getElementById('bar-chart-stage');
  const chartTooltip = document.getElementById('chart-tooltip');
  const tabMonthly = document.getElementById('tab-monthly');
  const tabYearly = document.getElementById('tab-yearly');

  // Modal Elements
  const btnOpenAddModal = document.getElementById('btn-open-add-modal');
  const addTxModal = document.getElementById('add-tx-modal');
  const modalTxClose = document.getElementById('modal-tx-close');
  const modalTxForm = document.getElementById('modal-tx-form');
  const tabTypeExpense = document.getElementById('tab-type-expense');
  const tabTypeIncome = document.getElementById('tab-type-income');
  const txInputTitle = document.getElementById('tx-input-title');
  const txInputCategory = document.getElementById('tx-input-category');
  const txInputAmount = document.getElementById('tx-input-amount');
  const txInputDate = document.getElementById('tx-input-date');

  // Popovers
  const btnNotification = document.getElementById('btn-notification');
  const notificationsPopover = document.getElementById('notifications-popover');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const profilePopover = document.getElementById('profile-popover');
  const btnLogout = document.getElementById('btn-logout');
  const dropdownLogout = document.getElementById('dropdown-logout');

  // Quick Action Buttons
  const qaAddIncome = document.getElementById('qa-add-income');
  const qaAddExpense = document.getElementById('qa-add-expense');
  const qaSetBudget = document.getElementById('qa-set-budget');
  const qaCreateGoal = document.getElementById('qa-create-goal');

  let currentTxType = 'expense';
  let isSubmitting = false;

  // INR Currency Formatter Helper
  const formatMoney = (val) => {
    if (window.formatINR) return window.formatINR(val);
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

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

  /* ==========================================================================
     1. Data Fetching & Dynamic UI Hydration
     ========================================================================== */

  // Load Dashboard Data from Real Backend
  async function loadDashboardData() {
    try {
      // 0. Refresh authenticated user identity and greeting
      if (window.FinoraAuth) {
        await window.FinoraAuth.refreshProfile();
      }

      // 1. Fetch Monthly Summary from MongoDB
      const summaryUrl = `/api/summary/monthly?year=${currentYear}&month=${currentMonth}`;
      const summaryRes = await fetchAuth(summaryUrl);
      const summaryJson = await summaryRes.json();
      const summary = summaryJson.data || summaryJson.summary || {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        savings: 0,
        expenseByCategory: [],
        incomeByCategory: []
      };

      // 2. Fetch Recent Transactions from MongoDB
      const txRes = await fetchAuth('/api/transactions?limit=6');
      const txJson = await txRes.json();
      const transactions = txJson.data || txJson.transactions || [];

      // 3. Fetch Yearly Breakdown for the Cash Flow Chart
      const yearlyRes = await fetchAuth(`/api/summary/yearly?year=${currentYear}`);
      const yearlyJson = await yearlyRes.json();
      const yearlyData = yearlyJson.data || yearlyJson.summary || { monthlyBreakdown: [] };

      // Update UI Components
      updateSummaryCards(summary);
      renderCategoryDonut(summary.expenseByCategory, summary.totalExpenses);
      renderRecentTransactions(transactions);
      renderBarChart(yearlyData.monthlyBreakdown);

    } catch (err) {
      console.error('[Finora Dashboard] Error fetching dashboard data:', err);
    }
  }

  // Update Top Metric Cards
  function updateSummaryCards(summary) {
    if (valBalance) valBalance.textContent = formatMoney(summary.netBalance);
    if (valIncome) valIncome.textContent = formatMoney(summary.totalIncome);
    if (valExpenses) valExpenses.textContent = formatMoney(summary.totalExpenses);
    if (valSavings) valSavings.textContent = formatMoney(summary.savings);

    // Update trend badges
    const trendBalance = document.getElementById('trend-balance');
    const trendIncome = document.getElementById('trend-income');
    const trendExpenses = document.getElementById('trend-expenses');
    const trendSavings = document.getElementById('trend-savings');

    if (trendBalance) trendBalance.textContent = summary.netBalance >= 0 ? '+₹' + Number(summary.netBalance).toLocaleString('en-IN') : '−₹' + Math.abs(summary.netBalance).toLocaleString('en-IN');
    if (trendIncome) trendIncome.textContent = `${summary.incomeCount || 0} entries`;
    if (trendExpenses) trendExpenses.textContent = `${summary.expenseCount || 0} entries`;
    if (trendSavings) trendSavings.textContent = summary.totalExpenses > 0 ? `${Math.round((summary.savings / (summary.totalIncome || 1)) * 100)}% saved` : '0%';
  }

  // Render Dynamic Category Donut SVG from Real Expense Aggregations
  function renderCategoryDonut(categories = [], totalExpenses = 0) {
    if (!donutCenterAmount || !donutCenterLabel || !donutSegmentsGroup || !categoryLegendList) return;

    donutCenterAmount.textContent = formatMoney(totalExpenses);
    donutCenterLabel.textContent = 'Total expenses';

    if (!categories || categories.length === 0 || totalExpenses <= 0) {
      donutSegmentsGroup.innerHTML = '';
      categoryLegendList.innerHTML = `
        <div style="color: #75809A; font-size: 13px; padding: 24px 0; text-align: left;">
          No expense records for this period.<br>
          <span style="font-size: 12px; color: #94A3B8;">Add expenses to view category breakdowns.</span>
        </div>
      `;
      return;
    }

    const palette = ['#7957FF', '#48B9F5', '#F06575', '#F5B544', '#43D9A3', '#0EA5E9', '#D946EF', '#8B5CF6'];
    let accumulatedOffset = 0;
    let segmentsHtml = '';
    let legendHtml = '';

    categories.forEach((cat, index) => {
      const color = palette[index % palette.length];
      const pct = Math.max(1, Math.round(cat.percentage));
      const dashArray = `${pct} ${100 - pct}`;
      const dashOffset = -accumulatedOffset;
      accumulatedOffset += pct;

      const formattedAmt = formatMoney(cat.amount);
      const labelText = `${cat.category}: ${formattedAmt} (${cat.percentage}%)`;

      segmentsHtml += `
        <circle cx="50" cy="50" r="38" class="donut-segment"
          stroke="${color}"
          stroke-width="12"
          fill="none"
          stroke-dasharray="${dashArray}"
          stroke-dashoffset="${dashOffset}"
          data-cat="${escapeHtml(cat.category)}"
          data-val="${formattedAmt} (${cat.percentage}%)"
          tabindex="0"
          role="img"
          aria-label="${escapeHtml(labelText)}"
          style="cursor: pointer; transition: stroke-width 0.2s;"
        />
      `;

      legendHtml += `
        <div class="category-legend-item" data-category="${escapeHtml(cat.category)}" style="cursor: pointer;">
          <span class="cat-dot-name">
            <span class="cat-dot" style="background-color: ${color};"></span>
            ${escapeHtml(cat.category)}
          </span>
          <span class="cat-pct">${cat.percentage}%</span>
        </div>
      `;
    });

    donutSegmentsGroup.innerHTML = segmentsHtml;
    categoryLegendList.innerHTML = legendHtml;

    // Attach Interactive Hover Listeners to new Donut Segments
    const newSegments = donutSegmentsGroup.querySelectorAll('.donut-segment');
    newSegments.forEach(seg => {
      seg.addEventListener('mouseenter', () => {
        const cat = seg.getAttribute('data-cat');
        const val = seg.getAttribute('data-val');
        donutCenterAmount.textContent = val.split(' ')[0];
        donutCenterLabel.textContent = cat;
        seg.style.strokeWidth = '15';
      });

      seg.addEventListener('mouseleave', () => {
        donutCenterAmount.textContent = formatMoney(totalExpenses);
        donutCenterLabel.textContent = 'Total expenses';
        seg.style.strokeWidth = '12';
      });
    });

    const legendItems = categoryLegendList.querySelectorAll('.category-legend-item');
    legendItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const cat = item.getAttribute('data-category');
        const seg = Array.from(newSegments).find(s => s.getAttribute('data-cat') === cat);
        if (seg) {
          const val = seg.getAttribute('data-val');
          donutCenterAmount.textContent = val.split(' ')[0];
          donutCenterLabel.textContent = cat;
          seg.style.strokeWidth = '15';
        }
      });

      item.addEventListener('mouseleave', () => {
        donutCenterAmount.textContent = formatMoney(totalExpenses);
        donutCenterLabel.textContent = 'Total expenses';
        newSegments.forEach(s => s.style.strokeWidth = '12');
      });
    });
  }

  // Render Real Recent Transactions in the Table
  function renderRecentTransactions(transactions = []) {
    if (!transactionsTbody) return;

    if (!transactions || transactions.length === 0) {
      transactionsTbody.innerHTML = `
        <tr id="empty-tx-row">
          <td colspan="6" style="text-align: center; padding: 48px 20px; color: #75809A;">
            <div style="font-size: 15px; font-weight: 600; color: #18213D; margin-bottom: 6px;">No transactions yet</div>
            <div style="font-size: 13px; margin-bottom: 16px;">Add your first income or expense to see it recorded here.</div>
            <button type="button" class="btn-add-transaction" id="btn-empty-add-tx" style="margin: 0 auto; display: inline-flex;">+ Add Transaction</button>
          </td>
        </tr>
      `;
      const btnEmptyAdd = document.getElementById('btn-empty-add-tx');
      if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', () => openModal('expense'));
      return;
    }

    let rowsHtml = '';
    transactions.forEach(tx => {
      const isIncome = tx.type === 'income';
      const sign = isIncome ? '+' : '−';
      const amountClass = isIncome ? 'income' : 'expense';
      const bubbleClass = isIncome ? 'bubble-mint' : 'bubble-violet';
      const pillClass = isIncome ? 'pill-income' : 'pill-food';

      // SVG Icon based on type
      const iconSvg = isIncome
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23B981" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7957FF" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>';

      const d = new Date(tx.date);
      const dateFormatted = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Recently';

      const amountFormatted = `${sign}${formatMoney(tx.amount)}`;

      rowsHtml += `
        <tr data-id="${tx.id}" data-type="${tx.type}" data-title="${escapeHtml(tx.title)}" data-category="${escapeHtml(tx.category)}">
          <td>
            <div class="tx-entity-cell">
              <div class="tx-icon-bubble ${bubbleClass}">
                ${iconSvg}
              </div>
              <div class="tx-info">
                <span class="tx-name">${escapeHtml(tx.title)}</span>
                <span class="tx-meta">${escapeHtml(tx.merchant || tx.paymentMethod || 'Personal Record')}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="category-pill ${pillClass}">${escapeHtml(tx.category || 'General')}</span>
          </td>
          <td>${dateFormatted}</td>
          <td class="amount-cell ${amountClass}">${amountFormatted}</td>
          <td>
            <span class="status-badge">
              <span class="status-dot"></span>
              ${escapeHtml(tx.status || 'Completed')}
            </span>
          </td>
          <td style="text-align: center;">
            <a href="transaction-details.html?id=${tx.id}" class="btn-row-action" title="View Transaction Details" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </a>
          </td>
        </tr>
      `;
    });

    transactionsTbody.innerHTML = rowsHtml;
  }

  // Render Income vs Expenses Bar Chart from Real 12-Month Aggregations
  function renderBarChart(monthlyBreakdown = []) {
    if (!barChartStage) return;

    // Find maximum amount for scale
    let maxVal = 1000;
    monthlyBreakdown.forEach(m => {
      if (m.income > maxVal) maxVal = m.income;
      if (m.expenses > maxVal) maxVal = m.expenses;
    });

    const chartHeight = 130; // Maximum bar pixel height
    const startX = 60;
    const stepX = 40;

    let svgBarsHtml = '';

    monthlyBreakdown.forEach((m, idx) => {
      const x = startX + idx * stepX;
      const incomeHeight = Math.max(2, Math.round((m.income / maxVal) * chartHeight));
      const expenseHeight = Math.max(2, Math.round((m.expenses / maxVal) * chartHeight));

      const incomeY = 160 - incomeHeight;
      const expenseY = 160 - expenseHeight;

      const incFormatted = formatMoney(m.income);
      const expFormatted = formatMoney(m.expenses);

      svgBarsHtml += `
        <g class="bar-group" data-month="${m.monthName}" data-income="${incFormatted}" data-expense="${expFormatted}">
          <rect x="${x}" y="${incomeY}" width="12" height="${incomeHeight}" rx="2" class="bar-income" style="fill: #23B981;" />
          <rect x="${x + 14}" y="${expenseY}" width="12" height="${expenseHeight}" rx="2" class="bar-expense" style="fill: #7957FF;" />
          <text x="${x + 13}" y="174" text-anchor="middle" class="axis-text" font-size="11" fill="#75809A">${m.monthName}</text>
        </g>
      `;
    });

    // Render full SVG with grid lines
    barChartStage.innerHTML = `
      <div class="chart-tooltip" id="chart-tooltip" style="display: none; position: absolute; background: #11183F; color: #FFF; padding: 6px 10px; border-radius: 6px; font-size: 11.5px; pointer-events: none; z-index: 10;"></div>
      <svg viewBox="0 0 540 190" class="bar-chart-svg" style="width: 100%; height: 100%;">
        <line x1="40" y1="30" x2="520" y2="30" stroke="#EAEFF8" stroke-dasharray="3 3"/>
        <line x1="40" y1="75" x2="520" y2="75" stroke="#EAEFF8" stroke-dasharray="3 3"/>
        <line x1="40" y1="120" x2="520" y2="120" stroke="#EAEFF8" stroke-dasharray="3 3"/>
        <line x1="40" y1="160" x2="520" y2="160" stroke="#E8EBF3" stroke-width="1.5"/>
        ${svgBarsHtml}
      </svg>
    `;

    // Attach Hover Tooltip
    const tooltip = document.getElementById('chart-tooltip');
    const groups = barChartStage.querySelectorAll('.bar-group');

    groups.forEach(group => {
      group.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        const month = group.getAttribute('data-month');
        const inc = group.getAttribute('data-income');
        const exp = group.getAttribute('data-expense');

        tooltip.innerHTML = `<strong>${month}</strong><br><span style="color:#23B981">Income: ${inc}</span><br><span style="color:#C7B8FF">Expense: ${exp}</span>`;
        tooltip.style.display = 'block';

        const rect = group.getBoundingClientRect();
        const stageRect = barChartStage.getBoundingClientRect();
        tooltip.style.left = `${rect.left - stageRect.left - 10}px`;
        tooltip.style.top = `${rect.top - stageRect.top - 50}px`;
      });

      group.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  /* ==========================================================================
     2. Date Selector Filtering
     ========================================================================== */
  if (btnDateSelector && dateDropdownMenu) {
    btnDateSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dateDropdownMenu.classList.contains('open');
      closeAllPopovers();
      if (!isOpen) {
        dateDropdownMenu.classList.add('open');
        btnDateSelector.setAttribute('aria-expanded', 'true');
      }
    });

    dateOptionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const periodKey = btn.getAttribute('data-period');
        dateOptionBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (periodKey === 'oct-2026') {
          currentYear = 2026;
          currentMonth = 10;
          selectedDateLabel.textContent = 'October 2026';
        } else if (periodKey === 'sep-2026') {
          currentYear = 2026;
          currentMonth = 9;
          selectedDateLabel.textContent = 'September 2026';
        } else if (periodKey === 'aug-2026') {
          currentYear = 2026;
          currentMonth = 8;
          selectedDateLabel.textContent = 'August 2026';
        } else if (periodKey === 'fy-2026') {
          currentYear = 2026;
          selectedDateLabel.textContent = 'Year 2026';
        }

        dateDropdownMenu.classList.remove('open');
        btnDateSelector.setAttribute('aria-expanded', 'false');

        // Reload data for selected period
        loadDashboardData();
      });
    });
  }

  /* ==========================================================================
     3. Search Filtering in Recent Transactions
     ========================================================================== */
  if (headerSearch && transactionsTbody) {
    headerSearch.addEventListener('input', () => {
      const query = headerSearch.value.trim().toLowerCase();
      const rows = transactionsTbody.querySelectorAll('tr:not(#empty-tx-row)');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ==========================================================================
     4. Popover Menu Handlers
     ========================================================================== */
  const closeAllPopovers = () => {
    if (dateDropdownMenu) dateDropdownMenu.classList.remove('open');
    if (notificationsPopover) notificationsPopover.classList.remove('open');
    if (profilePopover) profilePopover.classList.remove('open');
  };

  if (btnNotification && notificationsPopover) {
    btnNotification.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notificationsPopover.classList.contains('open');
      closeAllPopovers();
      if (!isOpen) notificationsPopover.classList.add('open');
    });
  }

  if (userProfileMenu && profilePopover) {
    userProfileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profilePopover.classList.contains('open');
      closeAllPopovers();
      if (!isOpen) profilePopover.classList.add('open');
    });
  }

  document.addEventListener('click', () => closeAllPopovers());

  // Logout Handlers
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of Finora?')) {
      window.location.href = 'login.html';
    }
  };
  if (btnLogout) btnLogout.addEventListener('click', handleLogout);
  if (dropdownLogout) dropdownLogout.addEventListener('click', handleLogout);

  /* ==========================================================================
     5. Add Transaction Modal & Real MongoDB API Submission
     ========================================================================== */
  const openModal = (type = 'expense') => {
    currentTxType = type;
    if (type === 'expense') {
      if (tabTypeExpense) tabTypeExpense.classList.add('active');
      if (tabTypeIncome) tabTypeIncome.classList.remove('active');
      if (txInputCategory) txInputCategory.value = 'Food';
    } else {
      if (tabTypeIncome) tabTypeIncome.classList.add('active');
      if (tabTypeExpense) tabTypeExpense.classList.remove('active');
      if (txInputCategory) txInputCategory.value = 'Income';
    }

    if (txInputDate) txInputDate.value = new Date().toISOString().split('T')[0];
    if (addTxModal) {
      addTxModal.classList.add('open');
      if (txInputTitle) txInputTitle.focus();
    }
  };

  const closeModal = () => {
    if (addTxModal) addTxModal.classList.remove('open');
    if (modalTxForm) modalTxForm.reset();
  };

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', () => openModal('expense'));
  if (modalTxClose) modalTxClose.addEventListener('click', closeModal);
  if (addTxModal) {
    addTxModal.addEventListener('click', (e) => {
      if (e.target === addTxModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addTxModal && addTxModal.classList.contains('open')) {
      closeModal();
    }
  });

  if (tabTypeExpense && tabTypeIncome) {
    tabTypeExpense.addEventListener('click', () => {
      currentTxType = 'expense';
      tabTypeExpense.classList.add('active');
      tabTypeIncome.classList.remove('active');
      if (txInputCategory && txInputCategory.value === 'Income') txInputCategory.value = 'Food';
    });

    tabTypeIncome.addEventListener('click', () => {
      currentTxType = 'income';
      tabTypeIncome.classList.add('active');
      tabTypeExpense.classList.remove('active');
      if (txInputCategory) txInputCategory.value = 'Income';
    });
  }

  // Quick Action Buttons
  if (qaAddIncome) qaAddIncome.addEventListener('click', () => openModal('income'));
  if (qaAddExpense) qaAddExpense.addEventListener('click', () => openModal('expense'));
  if (qaSetBudget) {
    qaSetBudget.addEventListener('click', () => {
      window.location.href = 'budgets.html';
    });
  }
  if (qaCreateGoal) {
    qaCreateGoal.addEventListener('click', () => {
      window.location.href = 'goals.html';
    });
  }

  // Real Form Submission to Express & MongoDB
  if (modalTxForm) {
    modalTxForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const title = txInputTitle.value.trim();
      const category = txInputCategory.value;
      const amount = parseFloat(txInputAmount.value);
      const dateVal = txInputDate.value;

      if (!title || isNaN(amount) || amount <= 0 || !dateVal) {
        alert('Please provide a valid title, positive amount, and date.');
        return;
      }

      isSubmitting = true;
      const submitBtn = modalTxForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Save';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving to MongoDB...';
      }

      try {
        const endpoint = currentTxType === 'income' ? '/api/income' : '/api/expenses';
        const payload = {
          title,
          amount,
          category,
          date: dateVal
        };

        const response = await fetchAuth(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          closeModal();
          // Immediately reload real data from MongoDB
          await loadDashboardData();
        } else {
          alert(result.message || 'Failed to save transaction. Please check inputs.');
        }
      } catch (err) {
        console.error('[Finora Dashboard] Save error:', err);
        alert('Network or server error while saving transaction.');
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Toggle Period on Chart Tab
  if (tabMonthly && tabYearly) {
    tabMonthly.addEventListener('click', () => {
      tabMonthly.classList.add('active');
      tabYearly.classList.remove('active');
      tabMonthly.setAttribute('aria-selected', 'true');
      tabYearly.setAttribute('aria-selected', 'false');
      loadDashboardData();
    });

    tabYearly.addEventListener('click', () => {
      tabYearly.classList.add('active');
      tabMonthly.classList.remove('active');
      tabYearly.setAttribute('aria-selected', 'true');
      tabMonthly.setAttribute('aria-selected', 'false');
      loadDashboardData();
    });
  }

  // Initial Load on Page Startup
  loadDashboardData();
});
