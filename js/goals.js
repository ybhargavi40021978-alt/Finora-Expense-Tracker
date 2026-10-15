/**
 * Finora Expense Tracker — Screen 10: Goals & Savings Logic
 * Handles interactive goal management, contribution recording, progress calculations,
 * search & filter, contribution history, and demo state switching.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Goals Data
  let initialGoals = [
    {
      id: 'g-vacation',
      name: 'Dream Vacation',
      category: 'Travel',
      target: 100000,
      saved: 65000,
      deadline: '2027-03-31',
      icon: 'ri-plane-line',
      color: '#7957FF',
      priority: 'High',
      status: 'Active',
      description: 'Trip to Switzerland and Italy with family.',
      isFeatured: true,
      contributions: [
        { date: '01 Oct 2026', note: 'Monthly Savings Allocation', amount: 15000, source: 'Primary Bank Account' },
        { date: '15 Sep 2026', note: 'Freelance Bonus', amount: 25000, source: 'Savings Account' },
        { date: '01 Aug 2026', note: 'Initial Goal Fund', amount: 25000, source: 'Cash Wallet' }
      ]
    },
    {
      id: 'g-laptop',
      name: 'New Laptop',
      category: 'Technology',
      target: 80000,
      saved: 48000,
      deadline: '2027-01-31',
      icon: 'ri-macbook-line',
      color: '#7957FF',
      priority: 'Medium',
      status: 'Active',
      description: 'Upgrade workstation for development.',
      contributions: [
        { date: '05 Oct 2026', note: 'Tech Savings', amount: 8000, source: 'Primary Bank Account' },
        { date: '10 Sep 2026', note: 'Project Payout', amount: 20000, source: 'Primary Bank Account' },
        { date: '15 Aug 2026', note: 'Starter Deposit', amount: 20000, source: 'Savings Account' }
      ]
    },
    {
      id: 'g-emergency',
      name: 'Emergency Fund',
      category: 'Emergency Fund',
      target: 150000,
      saved: 75000,
      deadline: '2027-12-31',
      icon: 'ri-shield-check-line',
      color: '#48B9F5',
      priority: 'High',
      status: 'Active',
      description: '6 months of living expenses reserve.',
      contributions: [
        { date: '02 Oct 2026', note: 'Monthly Safety Reserve', amount: 10000, source: 'Savings Account' },
        { date: '01 Sep 2026', note: 'Monthly Safety Reserve', amount: 15000, source: 'Savings Account' },
        { date: '01 Jul 2026', note: 'Fund Seed Deposit', amount: 50000, source: 'Primary Bank Account' }
      ]
    },
    {
      id: 'g-phone',
      name: 'New Phone',
      category: 'Technology',
      target: 40000,
      saved: 40000,
      deadline: '2026-10-15',
      icon: 'ri-smartphone-line',
      color: '#23B981',
      priority: 'Low',
      status: 'Completed',
      description: 'Target reached and completed!',
      contributions: [
        { date: '12 Oct 2026', note: 'Final Goal Milestone', amount: 10000, source: 'Primary Bank Account' },
        { date: '15 Sep 2026', note: 'Second Deposit', amount: 15000, source: 'Primary Bank Account' },
        { date: '10 Aug 2026', note: 'Initial Deposit', amount: 15000, source: 'Cash Wallet' }
      ]
    },
    {
      id: 'g-course',
      name: 'Course & Certification',
      category: 'Education',
      target: 25000,
      saved: 10000,
      deadline: '2027-06-30',
      icon: 'ri-graduation-cap-line',
      color: '#F5B544',
      priority: 'Medium',
      status: 'Active',
      description: 'Cloud Architecture Certification exam.',
      contributions: [
        { date: '25 Sep 2026', note: 'Skill Fund Deposit', amount: 10000, source: 'Primary Bank Account' }
      ]
    },
    {
      id: 'g-bike',
      name: 'New Bicycle',
      category: 'Vehicle',
      target: 20000,
      saved: 5000,
      deadline: '2027-04-30',
      icon: 'ri-riding-line',
      color: '#48B9F5',
      priority: 'Low',
      status: 'Active',
      description: 'Commuter cycle for morning workouts.',
      contributions: [
        { date: '08 Oct 2026', note: 'Fitness Savings', amount: 5000, source: 'Cash Wallet' }
      ]
    }
  ];

  let goals = [...initialGoals];
  let filterStatus = 'All';
  let sortKey = 'Recently Updated';
  let searchQuery = '';
  let selectedGoalIdForAction = null;
  let activeMenuId = null;

  // Selected icon and color for create form
  let selectedIcon = 'ri-target-line';
  let selectedColor = '#7957FF';

  // DOM Elements
  const overviewTargetEl = document.getElementById('overview-total-target');
  const overviewSavedEl = document.getElementById('overview-total-saved');
  const overviewRemainingEl = document.getElementById('overview-remaining-to-save');
  const overviewCompletedEl = document.getElementById('overview-goals-completed');

  const goalsCardsContainer = document.getElementById('goals-cards-grid');
  const goalSearchInput = document.getElementById('goal-search-input');
  const filterSelect = document.getElementById('filter-select');
  const sortSelect = document.getElementById('sort-select');

  // Featured Goal Elements
  const featName = document.getElementById('featured-goal-name');
  const featDesc = document.getElementById('featured-goal-desc');
  const featDate = document.getElementById('featured-goal-date');
  const featSaved = document.getElementById('featured-goal-saved');
  const featTarget = document.getElementById('featured-goal-target');
  const featRemaining = document.getElementById('featured-goal-remaining');
  const featPercent = document.getElementById('featured-goal-percent');
  const featFill = document.getElementById('featured-goal-fill');
  const btnFeatAdd = document.getElementById('btn-featured-add');
  const btnFeatView = document.getElementById('btn-featured-view');

  // Modals
  const createModalBackdrop = document.getElementById('create-goal-modal-backdrop');
  const contribModalBackdrop = document.getElementById('contrib-modal-backdrop');
  const detailsModalBackdrop = document.getElementById('details-modal-backdrop');

  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  const formatINR = (val) => {
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const showToast = (msg) => {
    if (!toastNotice) return;
    toastText.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  };

  // 2. Render Overview Cards & Featured Goal
  const renderSummaries = () => {
    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
    const remaining = goals.reduce((acc, g) => acc + Math.max(0, g.target - g.saved), 0);
    const completedCount = goals.filter(g => g.status === 'Completed' || g.saved >= g.target).length;

    if (overviewTargetEl) overviewTargetEl.textContent = `₹${formatINR(totalTarget)}`;
    if (overviewSavedEl) overviewSavedEl.textContent = `₹${formatINR(totalSaved)}`;
    if (overviewRemainingEl) overviewRemainingEl.textContent = `₹${formatINR(remaining)}`;
    if (overviewCompletedEl) overviewCompletedEl.textContent = `${completedCount} of ${goals.length}`;

    // Render Featured Goal
    const featured = goals.find(g => g.isFeatured) || goals[0];
    if (featured) {
      const featRem = Math.max(0, featured.target - featured.saved);
      const featPct = Math.min(100, Math.round((featured.saved / featured.target) * 100));

      if (featName) featName.textContent = featured.name;
      if (featDesc) featDesc.textContent = featured.description;
      if (featDate) featDate.textContent = `Target: ${formatDate(featured.deadline)}`;
      if (featSaved) featSaved.textContent = `₹${formatINR(featured.saved)}`;
      if (featTarget) featTarget.textContent = `₹${formatINR(featured.target)}`;
      if (featRemaining) featRemaining.textContent = `₹${formatINR(featRem)}`;
      if (featPercent) featPercent.textContent = `${featPct}%`;
      if (featFill) featFill.style.width = `${featPct}%`;

      if (btnFeatAdd) {
        btnFeatAdd.onclick = () => openContributionModal(featured.id);
      }
      if (btnFeatView) {
        btnFeatView.onclick = () => openDetailsModal(featured.id);
      }
    }

    // Render Insights & Timeline
    renderInsightsAndTimeline();
  };

  // 3. Render Goal Cards Grid
  const renderGoalCards = () => {
    if (!goalsCardsContainer) return;
    goalsCardsContainer.innerHTML = '';

    // Filter
    let filtered = goals.filter(g => {
      if (filterStatus !== 'All' && g.status !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!g.name.toLowerCase().includes(q) && !g.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortKey === 'Recently Updated') return b.id.localeCompare(a.id);
      if (sortKey === 'Nearest Deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortKey === 'Highest Progress') return (b.saved / b.target) - (a.saved / a.target);
      if (sortKey === 'Lowest Progress') return (a.saved / a.target) - (b.saved / b.target);
      if (sortKey === 'Target Amount') return b.target - a.target;
      return 0;
    });

    if (filtered.length === 0) {
      goalsCardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #FFFFFF; border: 1px dashed #E8EBF3; border-radius: 14px;">
          <i class="ri-search-line" style="font-size: 32px; color: #75809A; display: block; margin-bottom: 8px;"></i>
          <p style="font-size: 0.925rem; font-weight: 600; color: #18213D;">No goals match your criteria.</p>
          <p style="font-size: 0.8rem; color: #75809A; margin-top: 2px;">Try adjusting your search terms or filter selection.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(g => {
      const remaining = Math.max(0, g.target - g.saved);
      const percent = Math.min(100, Math.round((g.saved / g.target) * 100));
      const isCompleted = g.status === 'Completed' || g.saved >= g.target;
      const statusClass = isCompleted ? 'status-completed' : g.status === 'Paused' ? 'status-paused' : 'status-active';

      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML = `
        <div>
          <div class="goal-card-header">
            <div class="goal-title-wrap">
              <div class="goal-icon-box" style="background-color: ${g.color}15; color: ${g.color};">
                <i class="${g.icon}"></i>
              </div>
              <div class="goal-name-wrap">
                <h3>${g.name}</h3>
                <span>${g.category}</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="goal-status-badge ${statusClass}">
                <i class="${isCompleted ? 'ri-checkbox-circle-fill' : 'ri-record-circle-fill'}" style="font-size: 9px;"></i>
                ${isCompleted ? 'Completed' : g.status}
              </span>
              <button class="action-more-btn" data-id="${g.id}" aria-label="Action options for ${g.name}">
                <i class="ri-more-2-fill"></i>
              </button>
              <div class="goal-dropdown-menu" id="menu-${g.id}">
                <button class="dropdown-item" onclick="window.viewGoalDetails('${g.id}')">
                  <i class="ri-eye-line"></i> View Details
                </button>
                <button class="dropdown-item" onclick="window.addGoalContribution('${g.id}')">
                  <i class="ri-add-circle-line"></i> Add Contribution
                </button>
                <button class="dropdown-item" onclick="window.pauseGoal('${g.id}')">
                  <i class="ri-pause-circle-line"></i> ${g.status === 'Paused' ? 'Resume Goal' : 'Pause Goal'}
                </button>
                <button class="dropdown-item danger" onclick="window.deleteGoal('${g.id}')">
                  <i class="ri-delete-bin-line"></i> Delete Goal
                </button>
              </div>
            </div>
          </div>

          <div style="margin-top: 14px;">
            <div class="goal-numbers-row">
              <span class="goal-saved-val">₹${formatINR(g.saved)}</span>
              <span class="goal-target-val">Target: ₹${formatINR(g.target)}</span>
            </div>

            <div class="goal-progress-track" style="margin-top: 8px;">
              <div class="goal-progress-fill" style="width: ${percent}%; background-color: ${isCompleted ? '#23B981' : g.color};"></div>
            </div>
          </div>
        </div>

        <div class="goal-card-footer">
          <div class="goal-deadline-text">
            <i class="ri-calendar-line"></i>
            <span>${formatDate(g.deadline)}</span>
          </div>

          <div class="goal-action-btn-row">
            <span style="font-weight: 700; color: #18213D; margin-right: 6px;">${percent}%</span>
            ${!isCompleted ? `
              <button class="btn-add-mini" onclick="window.addGoalContribution('${g.id}')">
                + Add
              </button>
            ` : `
              <span style="color: #23B981; font-weight: 600; font-size: 0.75rem;"><i class="ri-check-line"></i> Done</span>
            `}
          </div>
        </div>
      `;

      goalsCardsContainer.appendChild(card);
    });

    // Attach menu toggles
    document.querySelectorAll('.action-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(btn.dataset.id);
      });
    });
  };

  const toggleMenu = (id) => {
    document.querySelectorAll('.goal-dropdown-menu').forEach(m => {
      if (m.id !== `menu-${id}`) m.classList.remove('show');
    });
    const target = document.getElementById(`menu-${id}`);
    if (target) {
      target.classList.toggle('show');
      activeMenuId = target.classList.contains('show') ? id : null;
    }
  };

  document.addEventListener('click', () => {
    document.querySelectorAll('.goal-dropdown-menu').forEach(m => m.classList.remove('show'));
    activeMenuId = null;
  });

  // 4. Insights and Savings Timeline
  const renderInsightsAndTimeline = () => {
    const insightsStack = document.getElementById('insights-bars-stack');
    const timelineStack = document.getElementById('timeline-stack');

    if (insightsStack) {
      insightsStack.innerHTML = '';
      const activeList = goals.filter(g => g.status === 'Active');
      activeList.slice(0, 4).forEach(g => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const item = document.createElement('div');
        item.className = 'insight-bar-item';
        item.innerHTML = `
          <div class="insight-bar-header">
            <span class="title">${g.name}</span>
            <span class="val">₹${formatINR(g.saved)} / ₹${formatINR(g.target)} (${pct}%)</span>
          </div>
          <div class="insight-track">
            <div class="insight-fill" style="width: ${pct}%; background-color: ${g.color};"></div>
          </div>
        `;
        insightsStack.appendChild(item);
      });
    }

    if (timelineStack) {
      timelineStack.innerHTML = '';
      const sortedByDeadline = [...goals].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      sortedByDeadline.slice(0, 4).forEach(g => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const isCompleted = g.status === 'Completed' || g.saved >= g.target;

        const row = document.createElement('div');
        row.className = 'timeline-item';
        row.innerHTML = `
          <div class="timeline-left">
            <div class="timeline-icon-dot" style="background-color: ${g.color}15; color: ${g.color};">
              <i class="${g.icon}"></i>
            </div>
            <div class="timeline-title-wrap">
              <h4>${g.name}</h4>
              <span>Target: ${formatDate(g.deadline)}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: ${isCompleted ? '#23B981' : '#11183F'}; font-size: 0.84rem;">
              ${pct}%
            </div>
            <div style="font-size: 0.75rem; color: #75809A;">₹${formatINR(Math.max(0, g.target - g.saved))} left</div>
          </div>
        `;
        timelineStack.appendChild(row);
      });
    }
  };

  // 5. Global Action Functions
  window.viewGoalDetails = (id) => openDetailsModal(id);
  window.addGoalContribution = (id) => openContributionModal(id);

  window.pauseGoal = (id) => {
    const g = goals.find(item => item.id === id);
    if (!g) return;
    g.status = g.status === 'Paused' ? 'Active' : 'Paused';
    renderSummaries();
    renderGoalCards();
    showToast(`Goal "${g.name}" status changed to ${g.status}.`);
  };

  window.deleteGoal = (id) => {
    const g = goals.find(item => item.id === id);
    if (!g) return;
    if (confirm(`Are you sure you want to delete "${g.name}"?\nNote: Past financial transactions will not be deleted.`)) {
      goals = goals.filter(item => item.id !== id);
      renderSummaries();
      renderGoalCards();
      showToast(`Goal "${g.name}" deleted.`);
    }
  };

  // 6. Contribution Modal Handlers
  const openContributionModal = (id) => {
    const g = goals.find(item => item.id === id);
    if (!g) return;
    selectedGoalIdForAction = id;

    const remaining = Math.max(0, g.target - g.saved);
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));

    document.getElementById('contrib-goal-name').textContent = g.name;
    document.getElementById('contrib-goal-stats').textContent =
      `Saved ₹${formatINR(g.saved)} of ₹${formatINR(g.target)} (${pct}%) · Remaining: ₹${formatINR(remaining)}`;

    document.getElementById('contrib-amount-input').value = '';
    document.getElementById('contrib-amount-input').max = remaining > 0 ? remaining : '';
    document.getElementById('contrib-note-input').value = 'Monthly Goal Contribution';

    if (contribModalBackdrop) contribModalBackdrop.classList.add('active');
  };

  const closeContributionModal = () => {
    if (contribModalBackdrop) contribModalBackdrop.classList.remove('active');
    selectedGoalIdForAction = null;
  };

  const contribForm = document.getElementById('contrib-form');
  if (contribForm) {
    contribForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amt = parseFloat(document.getElementById('contrib-amount-input').value);
      const note = document.getElementById('contrib-note-input').value.trim() || 'Contribution';
      const source = document.getElementById('contrib-source-select').value;
      const date = document.getElementById('contrib-date-input').value || new Date().toISOString().slice(0, 10);

      if (isNaN(amt) || amt <= 0) {
        alert('Please enter a valid positive contribution amount.');
        return;
      }

      const g = goals.find(item => item.id === selectedGoalIdForAction);
      if (g) {
        g.saved += amt;
        if (!g.contributions) g.contributions = [];
        g.contributions.unshift({
          date: formatDate(date),
          note: note,
          amount: amt,
          source: source
        });

        if (g.saved >= g.target) {
          g.status = 'Completed';
          showToast(`Congratulations! You reached your goal "${g.name}"!`);
        } else {
          showToast(`Added ₹${formatINR(amt)} to "${g.name}".`);
        }

        renderSummaries();
        renderGoalCards();
      }

      closeContributionModal();
    });
  }

  // 7. Goal Details Modal Handlers
  const openDetailsModal = (id) => {
    const g = goals.find(item => item.id === id);
    if (!g) return;

    const remaining = Math.max(0, g.target - g.saved);
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));

    document.getElementById('details-title').textContent = g.name;
    document.getElementById('details-category').textContent = `${g.category} · Priority: ${g.priority || 'Medium'}`;
    document.getElementById('details-saved-val').textContent = `₹${formatINR(g.saved)}`;
    document.getElementById('details-target-val').textContent = `₹${formatINR(g.target)}`;
    document.getElementById('details-remaining-val').textContent = `₹${formatINR(remaining)}`;
    document.getElementById('details-percent-val').textContent = `${pct}%`;
    document.getElementById('details-progress-fill').style.width = `${pct}%`;

    const tableBody = document.getElementById('details-history-tbody');
    if (tableBody) {
      tableBody.innerHTML = '';
      if (!g.contributions || g.contributions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #75809A; padding: 20px;">No contributions recorded yet.</td></tr>`;
      } else {
        g.contributions.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="padding: 10px 12px; border-bottom: 1px solid #E8EBF3; font-size: 0.8125rem;">${c.date}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E8EBF3; font-size: 0.8125rem; font-weight: 500;">${c.note}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E8EBF3; font-size: 0.8125rem; color: #75809A;">${c.source}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E8EBF3; font-size: 0.8125rem; font-weight: 700; color: #23B981;">+₹${formatINR(c.amount)}</td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (detailsModalBackdrop) detailsModalBackdrop.classList.add('active');
  };

  const closeDetailsModal = () => {
    if (detailsModalBackdrop) detailsModalBackdrop.classList.remove('active');
  };

  // 8. Create Goal Modal Handlers
  const openCreateModal = () => {
    if (createModalBackdrop) createModalBackdrop.classList.add('active');
  };

  const closeCreateModal = () => {
    if (createModalBackdrop) createModalBackdrop.classList.remove('active');
    document.getElementById('create-goal-form').reset();
  };

  const btnCreateGoal = document.getElementById('btn-create-goal');
  if (btnCreateGoal) btnCreateGoal.addEventListener('click', openCreateModal);

  // Icon Selector
  document.querySelectorAll('.icon-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedIcon = btn.dataset.icon;
    });
  });

  // Color Selector
  document.querySelectorAll('.color-dot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-dot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedColor = btn.dataset.color;
    });
  });

  const createForm = document.getElementById('create-goal-form');
  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('goal-name-input').value.trim();
      const category = document.getElementById('goal-category-select').value;
      const targetAmt = parseFloat(document.getElementById('goal-target-input').value);
      const initialSaved = parseFloat(document.getElementById('goal-initial-saved-input').value) || 0;
      const deadline = document.getElementById('goal-date-input').value;
      const priority = document.getElementById('goal-priority-select').value;
      const desc = document.getElementById('goal-desc-input').value.trim();

      if (!name || isNaN(targetAmt) || targetAmt <= 0) {
        alert('Please provide a goal name and valid target amount.');
        return;
      }

      const newG = {
        id: `g-${Date.now()}`,
        name: name,
        category: category,
        target: targetAmt,
        saved: initialSaved,
        deadline: deadline || '2027-12-31',
        icon: selectedIcon,
        color: selectedColor,
        priority: priority,
        status: initialSaved >= targetAmt ? 'Completed' : 'Active',
        description: desc || 'Personal financial milestone.',
        contributions: initialSaved > 0 ? [{
          date: formatDate(new Date().toISOString()),
          note: 'Initial Savings Deposit',
          amount: initialSaved,
          source: 'Primary Bank Account'
        }] : []
      };

      goals.unshift(newG);
      renderSummaries();
      renderGoalCards();
      closeCreateModal();
      showToast(`Goal "${name}" created successfully!`);
    });
  }

  // 9. Close Modal Buttons
  document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeCreateModal();
      closeContributionModal();
      closeDetailsModal();
    });
  });

  // 10. Filter & Search listeners
  if (goalSearchInput) {
    goalSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGoalCards();
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      renderGoalCards();
      showToast(`Filter: ${filterStatus}`);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortKey = e.target.value;
      renderGoalCards();
      showToast(`Sorted by: ${sortKey}`);
    });
  }

  // 11. Demo Switcher Toolbar
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const state = btn.dataset.state;

      const errorBanner = document.getElementById('api-error-banner');
      const emptyBanner = document.getElementById('empty-state-banner');
      const mainArea = document.getElementById('main-goals-area');

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
        showToast('Empty goals state loaded.');
        return;
      } else {
        if (emptyBanner) emptyBanner.style.display = 'none';
        if (mainArea) mainArea.style.display = 'flex';
      }

      if (state === 'active-only') {
        filterStatus = 'Active';
        if (filterSelect) filterSelect.value = 'Active';
        showToast('Showing active goals only.');
      } else if (state === 'completed-only') {
        filterStatus = 'Completed';
        if (filterSelect) filterSelect.value = 'Completed';
        showToast('Showing completed milestones.');
      } else {
        filterStatus = 'All';
        if (filterSelect) filterSelect.value = 'All';
        showToast('Standard view (All goals) loaded.');
      }

      renderGoalCards();
    });
  });

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      document.querySelectorAll('.demo-btn').forEach(b => b.classList.toggle('active', b.dataset.state === 'standard'));
      document.getElementById('api-error-banner').style.display = 'none';
      document.getElementById('main-goals-area').style.opacity = '1';
      showToast('Goals reloaded successfully.');
    });
  }

  // Mobile menu
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

  // Initial render
  renderSummaries();
  renderGoalCards();
});
