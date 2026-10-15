/**
 * Finora Expense Tracker — Screen 9: Budget Management Logic
 * Handles interactive budget summaries, category budget filtering/sorting,
 * budget creation & editing modals, action menus, SVG charts, and demo states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Budget Records
  let initialBudgets = [
    {
      id: 'b-1',
      name: 'Food & Dining',
      category: 'Food & Dining',
      budget: 10000,
      spent: 6200,
      icon: 'ri-restaurant-line',
      color: '#7957FF',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-2',
      name: 'Transportation',
      category: 'Transportation',
      budget: 5000,
      spent: 3800,
      icon: 'ri-car-line',
      color: '#48B9F5',
      threshold: 75,
      period: 'Monthly'
    },
    {
      id: 'b-3',
      name: 'Shopping',
      category: 'Shopping',
      budget: 8000,
      spent: 7500,
      icon: 'ri-shopping-bag-3-line',
      color: '#F5B544',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-4',
      name: 'Bills & Utilities',
      category: 'Bills & Utilities',
      budget: 6000,
      spent: 4200,
      icon: 'ri-flashlight-line',
      color: '#23B981',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-5',
      name: 'Entertainment',
      category: 'Entertainment',
      budget: 3000,
      spent: 3400,
      icon: 'ri-gamepad-line',
      color: '#F06575',
      threshold: 90,
      period: 'Monthly'
    },
    {
      id: 'b-6',
      name: 'Healthcare',
      category: 'Healthcare',
      budget: 4000,
      spent: 1500,
      icon: 'ri-heart-pulse-line',
      color: '#23B981',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-7',
      name: 'Housing & Rent',
      category: 'Housing & Rent',
      budget: 10000,
      spent: 5000,
      icon: 'ri-home-4-line',
      color: '#7957FF',
      threshold: 90,
      period: 'Monthly'
    },
    {
      id: 'b-8',
      name: 'Subscriptions',
      category: 'Subscriptions',
      budget: 2000,
      spent: 1200,
      icon: 'ri-repeat-line',
      color: '#C7B8FF',
      threshold: 75,
      period: 'Monthly'
    }
  ];

  let budgets = [...initialBudgets];
  let filterStatus = 'All';
  let sortKey = 'Category Name';
  let searchQuery = '';
  let activeMenuId = null;
  let editingBudgetId = null;

  // DOM Elements
  const overviewTotalEl = document.getElementById('overview-total-budget');
  const overviewSpentEl = document.getElementById('overview-total-spent');
  const overviewRemainingEl = document.getElementById('overview-remaining-budget');
  const overviewUsageEl = document.getElementById('overview-budget-usage');

  const overallProgressFill = document.getElementById('overall-progress-fill');
  const overallSpentText = document.getElementById('overall-spent-text');
  const overallTotalText = document.getElementById('overall-total-text');
  const overallRemainingText = document.getElementById('overall-remaining-text');
  const overallPercentText = document.getElementById('overall-percent-text');

  const categoryCardsContainer = document.getElementById('category-cards-grid');
  const catSearchInput = document.getElementById('cat-search-input');
  const filterSelect = document.getElementById('filter-select');
  const sortSelect = document.getElementById('sort-select');

  // Modal Elements
  const modalBackdrop = document.getElementById('budget-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('budget-form');
  const inputName = document.getElementById('budget-name-input');
  const selectCat = document.getElementById('budget-cat-select');
  const inputAmount = document.getElementById('budget-amount-input');
  const selectPeriod = document.getElementById('budget-period-select');
  const inputStartDate = document.getElementById('budget-start-date');
  const inputEndDate = document.getElementById('budget-end-date');
  const selectThreshold = document.getElementById('budget-threshold-select');
  const inputDesc = document.getElementById('budget-desc-input');

  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  const formatINR = (val) => {
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const showToast = (msg) => {
    if (!toastNotice) return;
    toastText.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  };

  // 2. Compute Status for Budget item
  const getBudgetStatus = (spent, budget) => {
    const percent = (spent / budget) * 100;
    if (spent > budget) return { label: 'Over Budget', className: 'status-over', color: '#F06575', percent };
    if (percent >= 75) return { label: 'Near Limit', className: 'status-near', color: '#D97706', percent };
    return { label: 'Under Budget', className: 'status-under', color: '#23B981', percent };
  };

  // 3. Render Summaries & Progress Bar
  const renderSummaries = () => {
    const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const usage = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0';

    if (overviewTotalEl) overviewTotalEl.textContent = `₹${formatINR(totalBudget)}`;
    if (overviewSpentEl) overviewSpentEl.textContent = `₹${formatINR(totalSpent)}`;
    if (overviewRemainingEl) {
      overviewRemainingEl.textContent = remaining >= 0 ? `₹${formatINR(remaining)}` : `-₹${formatINR(Math.abs(remaining))}`;
      overviewRemainingEl.style.color = remaining >= 0 ? '#11183F' : '#F06575';
    }
    if (overviewUsageEl) overviewUsageEl.textContent = `${usage}%`;

    // Full-Width Progress Card
    if (overallSpentText) overallSpentText.textContent = `₹${formatINR(totalSpent)}`;
    if (overallTotalText) overallTotalText.textContent = `₹${formatINR(totalBudget)}`;
    if (overallRemainingText) {
      overallRemainingText.textContent = remaining >= 0 ? `₹${formatINR(remaining)} remaining` : `₹${formatINR(Math.abs(remaining))} over budget`;
      overallRemainingText.style.color = remaining >= 0 ? '#23B981' : '#F06575';
    }
    if (overallPercentText) overallPercentText.textContent = `${usage}% used`;

    if (overallProgressFill) {
      const visualWidth = Math.min(100, Math.max(0, usage));
      overallProgressFill.style.width = `${visualWidth}%`;
      if (usage >= 90) {
        overallProgressFill.style.backgroundColor = '#F06575';
      } else if (usage >= 70) {
        overallProgressFill.style.backgroundColor = '#F5B544';
      } else {
        overallProgressFill.style.backgroundColor = '#7957FF';
      }
    }

    // Period overview counts
    const totalCount = budgets.length;
    const overCount = budgets.filter(b => b.spent > b.budget).length;
    const nearCount = budgets.filter(b => {
      const p = (b.spent / b.budget) * 100;
      return p >= 75 && b.spent <= b.budget;
    }).length;
    const underCount = totalCount - overCount - nearCount;

    const countActive = document.getElementById('count-active-budgets');
    const countWithin = document.getElementById('count-within-limits');
    const countNear = document.getElementById('count-near-limits');
    const countOver = document.getElementById('count-over-budget');

    if (countActive) countActive.textContent = totalCount;
    if (countWithin) countWithin.textContent = underCount;
    if (countNear) countNear.textContent = nearCount;
    if (countOver) countOver.textContent = overCount;
  };

  // 4. Render Category Budget Cards
  const renderCategoryCards = () => {
    if (!categoryCardsContainer) return;
    categoryCardsContainer.innerHTML = '';

    // Filter
    let filtered = budgets.filter(b => {
      const status = getBudgetStatus(b.spent, b.budget);
      if (filterStatus !== 'All' && status.label !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortKey === 'Category Name') return a.name.localeCompare(b.name);
      if (sortKey === 'Highest Budget') return b.budget - a.budget;
      if (sortKey === 'Highest Spending') return b.spent - a.spent;
      if (sortKey === 'Remaining Budget') return (b.budget - b.spent) - (a.budget - a.spent);
      return 0;
    });

    if (filtered.length === 0) {
      categoryCardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 36px 20px; background: #FFFFFF; border: 1px dashed #E8EBF3; border-radius: 14px;">
          <i class="ri-search-line" style="font-size: 32px; color: #75809A; display: block; margin-bottom: 8px;"></i>
          <p style="font-size: 0.9rem; font-weight: 600; color: #18213D;">No category budgets match your filter.</p>
          <p style="font-size: 0.8rem; color: #75809A; margin-top: 2px;">Try adjusting your search terms or filter selection.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(b => {
      const status = getBudgetStatus(b.spent, b.budget);
      const remaining = b.budget - b.spent;
      const percentStr = status.percent.toFixed(1);
      const visualWidth = Math.min(100, Math.max(0, status.percent));

      const card = document.createElement('div');
      card.className = 'category-budget-card';
      card.innerHTML = `
        <div class="cat-card-header">
          <div class="cat-badge-wrap">
            <div class="cat-icon-square" style="background-color: ${b.color}18; color: ${b.color};">
              <i class="${b.icon}"></i>
            </div>
            <div class="cat-name-box">
              <h3>${b.name}</h3>
              <span>${b.period} Period</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="status-pill ${status.className}">
              <i class="ri-record-circle-fill" style="font-size: 9px;"></i>
              ${status.label}
            </span>
            <button class="card-action-menu-btn" data-id="${b.id}" aria-label="Action options for ${b.name}">
              <i class="ri-more-2-fill"></i>
            </button>
            <div class="dropdown-menu" id="menu-${b.id}">
              <a href="transactions.html" class="dropdown-item">
                <i class="ri-exchange-dollar-line"></i> View Transactions
              </a>
              <button class="dropdown-item" onclick="window.editBudget('${b.id}')">
                <i class="ri-edit-line"></i> Edit Budget
              </button>
              <button class="dropdown-item" onclick="window.adjustBudget('${b.id}')">
                <i class="ri-equalizer-line"></i> Adjust Budget
              </button>
              <button class="dropdown-item" onclick="window.viewDetails('${b.id}')">
                <i class="ri-information-line"></i> View Details
              </button>
              <button class="dropdown-item danger" onclick="window.deleteBudget('${b.id}')">
                <i class="ri-delete-bin-line"></i> Delete Budget
              </button>
            </div>
          </div>
        </div>

        <div class="cat-card-stats">
          <div class="stat-item">
            <span class="label">Budget Limit</span>
            <span class="val">₹${formatINR(b.budget)}</span>
          </div>
          <div class="stat-item">
            <span class="label">Spent</span>
            <span class="val" style="color: ${b.spent > b.budget ? '#F06575' : '#11183F'};">₹${formatINR(b.spent)}</span>
          </div>
          <div class="stat-item">
            <span class="label">Remaining</span>
            <span class="val" style="color: ${remaining >= 0 ? '#23B981' : '#F06575'};">
              ${remaining >= 0 ? `₹${formatINR(remaining)}` : `-₹${formatINR(Math.abs(remaining))}`}
            </span>
          </div>
        </div>

        <div>
          <div class="cat-progress-track">
            <div class="cat-progress-fill" style="width: ${visualWidth}%; background-color: ${status.color};"></div>
          </div>
        </div>

        <div class="cat-card-footer">
          <span>${percentStr}% of budget used</span>
          <span>Threshold: ${b.threshold}%</span>
        </div>
      `;

      categoryCardsContainer.appendChild(card);
    });

    // Attach menu toggles
    document.querySelectorAll('.card-action-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        toggleActionMenu(id);
      });
    });
  };

  // 5. Toggle Dropdown Menu
  const toggleActionMenu = (id) => {
    const allMenus = document.querySelectorAll('.dropdown-menu');
    allMenus.forEach(m => {
      if (m.id !== `menu-${id}`) m.classList.remove('show');
    });

    const targetMenu = document.getElementById(`menu-${id}`);
    if (targetMenu) {
      targetMenu.classList.toggle('show');
      activeMenuId = targetMenu.classList.contains('show') ? id : null;
    }
  };

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    activeMenuId = null;
  });

  // 6. Action Functions Attached to Window for onclick
  window.editBudget = (id) => {
    const item = budgets.find(b => b.id === id);
    if (!item) return;
    editingBudgetId = id;
    if (modalTitle) modalTitle.textContent = 'Edit Budget';
    if (inputName) inputName.value = item.name;
    if (selectCat) selectCat.value = item.category;
    if (inputAmount) inputAmount.value = item.budget;
    if (selectPeriod) selectPeriod.value = item.period;
    if (selectThreshold) selectThreshold.value = item.threshold;
    openModal();
  };

  window.adjustBudget = (id) => {
    const item = budgets.find(b => b.id === id);
    if (!item) return;
    const newLimit = prompt(`Enter new spending limit for "${item.name}" (Current: ₹${formatINR(item.budget)}):`, item.budget);
    if (newLimit !== null) {
      const parsed = parseFloat(newLimit);
      if (!isNaN(parsed) && parsed > 0) {
        item.budget = parsed;
        renderSummaries();
        renderCategoryCards();
        renderBudgetVsActualChart();
        showToast(`Budget for "${item.name}" adjusted to ₹${formatINR(parsed)}.`);
      } else {
        alert('Please enter a valid positive number.');
      }
    }
  };

  window.viewDetails = (id) => {
    const item = budgets.find(b => b.id === id);
    if (!item) return;
    const remaining = item.budget - item.spent;
    alert(
      `Budget Details:\n` +
      `Category: ${item.name}\n` +
      `Limit: ₹${formatINR(item.budget)}\n` +
      `Spent: ₹${formatINR(item.spent)}\n` +
      `Remaining: ${remaining >= 0 ? `₹${formatINR(remaining)}` : `-₹${formatINR(Math.abs(remaining))} (Overspent)`}\n` +
      `Alert Threshold: ${item.threshold}%\n` +
      `Period: ${item.period}`
    );
  };

  window.deleteBudget = (id) => {
    const item = budgets.find(b => b.id === id);
    if (!item) return;
    const confirmDelete = confirm(`Are you sure you want to delete the budget for "${item.name}"?\nNote: Existing transaction records will not be deleted.`);
    if (confirmDelete) {
      budgets = budgets.filter(b => b.id !== id);
      renderSummaries();
      renderCategoryCards();
      renderBudgetVsActualChart();
      showToast(`Budget for "${item.name}" deleted successfully.`);
    }
  };

  // 7. Modal Handlers
  const openModal = () => {
    if (modalBackdrop) modalBackdrop.classList.add('active');
  };

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    if (modalForm) modalForm.reset();
    editingBudgetId = null;
    if (modalTitle) modalTitle.textContent = 'Create New Budget';
  };

  const createBudgetBtn = document.getElementById('btn-create-budget');
  if (createBudgetBtn) {
    createBudgetBtn.addEventListener('click', () => {
      editingBudgetId = null;
      if (modalTitle) modalTitle.textContent = 'Create New Budget';
      if (modalForm) modalForm.reset();
      openModal();
    });
  }

  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = inputName.value.trim();
      const cat = selectCat.value;
      const amount = parseFloat(inputAmount.value);
      const period = selectPeriod.value;
      const threshold = parseInt(selectThreshold.value) || 80;

      if (!name) {
        alert('Please enter a Budget Name.');
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive Budget Amount.');
        return;
      }

      if (editingBudgetId) {
        const item = budgets.find(b => b.id === editingBudgetId);
        if (item) {
          item.name = name;
          item.category = cat;
          item.budget = amount;
          item.period = period;
          item.threshold = threshold;
          showToast(`Budget "${name}" updated successfully.`);
        }
      } else {
        const newBudget = {
          id: `b-${Date.now()}`,
          name: name,
          category: cat,
          budget: amount,
          spent: 0,
          icon: 'ri-wallet-3-line',
          color: '#7957FF',
          threshold: threshold,
          period: period
        };
        budgets.unshift(newBudget);
        showToast(`New budget "${name}" created successfully.`);
      }

      closeModal();
      renderSummaries();
      renderCategoryCards();
      renderBudgetVsActualChart();
    });
  }

  // 8. Copy Previous Budget
  const copyBtn = document.getElementById('btn-copy-budget');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      showToast('Copied September 2026 budget allocations into October 2026.');
    });
  }

  // 9. SVG Grouped Bar Chart (Budget vs Actual)
  const renderBudgetVsActualChart = () => {
    const svg = document.getElementById('budget-chart-svg');
    if (!svg) return;
    svg.innerHTML = '';

    const width = 640;
    const height = 240;
    const padX = 45;
    const padY = 25;
    const chartW = width - padX - 20;
    const chartH = height - padY * 2;

    const displayItems = budgets.slice(0, 6);
    const maxVal = Math.max(...displayItems.map(b => Math.max(b.budget, b.spent)), 12000);
    const stepX = chartW / displayItems.length;
    const barW = Math.min(18, stepX * 0.32);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const yVal = padY + (chartH / 4) * i;
      const valLabel = Math.round(maxVal - (maxVal / 4) * i);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padX);
      line.setAttribute('y1', yVal);
      line.setAttribute('x2', width - 20);
      line.setAttribute('y2', yVal);
      line.setAttribute('stroke', '#E8EBF3');
      line.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(line);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', padX - 8);
      text.setAttribute('y', yVal + 4);
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#75809A');
      text.setAttribute('text-anchor', 'end');
      text.textContent = `₹${valLabel / 1000}k`;
      svg.appendChild(text);
    }

    displayItems.forEach((b, idx) => {
      const cx = padX + stepX * idx + stepX / 2;
      const hBudget = (b.budget / maxVal) * chartH;
      const hSpent = (b.spent / maxVal) * chartH;

      const yBudget = padY + chartH - hBudget;
      const ySpent = padY + chartH - hSpent;

      // Budget Bar (Violet)
      const rectBud = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectBud.setAttribute('x', cx - barW - 2);
      rectBud.setAttribute('y', yBudget);
      rectBud.setAttribute('width', barW);
      rectBud.setAttribute('height', hBudget);
      rectBud.setAttribute('rx', '3');
      rectBud.setAttribute('fill', '#7957FF');
      svg.appendChild(rectBud);

      // Spent Bar (Blue or Coral)
      const rectSp = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectSp.setAttribute('x', cx + 2);
      rectSp.setAttribute('y', ySpent);
      rectSp.setAttribute('width', barW);
      rectSp.setAttribute('height', hSpent);
      rectSp.setAttribute('rx', '3');
      rectSp.setAttribute('fill', b.spent > b.budget ? '#F06575' : '#48B9F5');
      svg.appendChild(rectSp);

      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', height - 4);
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', '500');
      text.setAttribute('fill', '#18213D');
      text.setAttribute('text-anchor', 'middle');
      const shortName = b.name.length > 8 ? b.name.substring(0, 7) + '…' : b.name;
      text.textContent = shortName;
      svg.appendChild(text);
    });
  };

  // 10. Filter & Search listeners
  if (catSearchInput) {
    catSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCategoryCards();
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      renderCategoryCards();
      showToast(`Filter: ${filterStatus}`);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortKey = e.target.value;
      renderCategoryCards();
      showToast(`Sorted by: ${sortKey}`);
    });
  }

  // 11. Demo Switcher State Handler
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const state = btn.dataset.state;

      const errorBanner = document.getElementById('api-error-banner');
      const emptyBanner = document.getElementById('empty-state-banner');
      const mainArea = document.getElementById('main-budgets-area');

      if (state === 'api-error') {
        if (errorBanner) errorBanner.style.display = 'block';
        if (emptyBanner) emptyBanner.style.display = 'none';
        if (mainArea) mainArea.style.opacity = '0.35';
        showToast('Simulated 500 Internal Server Error.');
        return;
      } else {
        if (errorBanner) errorBanner.style.display = 'none';
        if (mainArea) mainArea.style.opacity = '1';
      }

      if (state === 'empty') {
        if (emptyBanner) emptyBanner.style.display = 'block';
        if (mainArea) mainArea.style.display = 'none';
        showToast('Empty budget state loaded.');
        return;
      } else {
        if (emptyBanner) emptyBanner.style.display = 'none';
        if (mainArea) mainArea.style.display = 'flex';
      }

      if (state === 'near-limit') {
        filterStatus = 'Near Limit';
        if (filterSelect) filterSelect.value = 'Near Limit';
        showToast('Filtered by Near Limit budgets.');
      } else if (state === 'over-budget') {
        filterStatus = 'Over Budget';
        if (filterSelect) filterSelect.value = 'Over Budget';
        showToast('Filtered by Over Budget budgets.');
      } else {
        filterStatus = 'All';
        if (filterSelect) filterSelect.value = 'All';
        showToast('Standard view (All budgets) loaded.');
      }

      renderCategoryCards();
    });
  });

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      document.querySelectorAll('.demo-btn').forEach(b => b.classList.toggle('active', b.dataset.state === 'standard'));
      document.getElementById('api-error-banner').style.display = 'none';
      document.getElementById('main-budgets-area').style.opacity = '1';
      showToast('Budgets reloaded successfully.');
    });
  }

  // Mobile navigation
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      backdrop.classList.toggle('active');
    });
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }

  // Initial renders
  renderSummaries();
  renderCategoryCards();
  renderBudgetVsActualChart();
});
