/**
 * Finora Expense Tracker — Screen 8: Analytics & Reports Logic
 * Handles interactive filters, dynamic charts (Bar, Donut, Line, Horizontal Bars),
 * CSV export, report print/download, and state demonstrations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Data (Real MongoDB Data Source)
  const reportData = {
    standard: {
      periodLabel: 'This Month',
      dateRange: '',
      totalIncome: 0,
      totalExpenses: 0,
      incomeTrend: '0%',
      expenseTrend: '0%',
      savingsTrend: '0%',
      monthlyBars: [],
      categories: [],
      sources: [],
      recentActivity: []
    }
  };

  let currentState = 'standard';
  let activeInterval = 'Monthly';
  let activeTxType = 'All';
  let seriesVisibility = { income: true, expense: true, savings: true };

  // DOM Elements
  const periodSelect = document.getElementById('period-select');
  const dateRangeDisplay = document.getElementById('date-range-display');
  const customDateInputs = document.getElementById('custom-date-inputs');
  const segmentedButtons = document.querySelectorAll('.segment-btn');
  const intervalPills = document.querySelectorAll('.interval-pill');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  const tooltip = document.getElementById('chart-tooltip');

  // Value formatting
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

  // 2. Render Financial Overview Cards
  const renderOverviewCards = (data) => {
    const income = data.totalIncome || 0;
    const expense = data.totalExpenses || 0;
    const savings = income - expense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0.0';

    const incomeEl = document.getElementById('overview-income');
    const expenseEl = document.getElementById('overview-expense');
    const savingsEl = document.getElementById('overview-savings');
    const rateEl = document.getElementById('overview-rate');

    if (incomeEl) incomeEl.textContent = `₹${formatINR(income)}`;
    if (expenseEl) expenseEl.textContent = `₹${formatINR(expense)}`;
    if (savingsEl) {
      savingsEl.textContent = `₹${formatINR(savings)}`;
      savingsEl.style.color = savings >= 0 ? '#11183F' : '#F06575';
    }
    if (rateEl) rateEl.textContent = `${savingsRate}%`;

    // Savings analysis card values
    const sIncome = document.getElementById('savings-income-val');
    const sExpense = document.getElementById('savings-expense-val');
    const sNet = document.getElementById('savings-net-val');
    const sRate = document.getElementById('savings-rate-val');
    const sExpBar = document.getElementById('savings-bar-expense');
    const sSavBar = document.getElementById('savings-bar-savings');

    if (sIncome) sIncome.textContent = `₹${formatINR(income)}`;
    if (sExpense) sExpense.textContent = `₹${formatINR(expense)}`;
    if (sNet) sNet.textContent = `₹${formatINR(savings)}`;
    if (sRate) sRate.textContent = `${savingsRate}%`;

    if (sExpBar && sSavBar && income > 0) {
      const expPercent = Math.min(100, Math.max(0, (expense / income) * 100));
      const savPercent = Math.max(0, 100 - expPercent);
      sExpBar.style.width = `${expPercent}%`;
      sSavBar.style.width = `${savPercent}%`;
    }
  };

  // 3. Render Grouped Bar Chart (Income vs Expense)
  const renderBarChart = (bars) => {
    const svg = document.getElementById('bar-chart-svg');
    if (!svg) return;
    svg.innerHTML = '';

    const width = 640;
    const height = 240;
    const padX = 45;
    const padY = 25;
    const chartW = width - padX - 20;
    const chartH = height - padY * 2;

    const maxVal = Math.max(...bars.map(b => Math.max(b.income, b.expense)), 90000);
    const stepX = chartW / bars.length;
    const barW = Math.min(22, stepX * 0.3);

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

    bars.forEach((b, idx) => {
      const cx = padX + stepX * idx + stepX / 2;
      const hIncome = (b.income / maxVal) * chartH;
      const hExpense = (b.expense / maxVal) * chartH;

      const yIncome = padY + chartH - hIncome;
      const yExpense = padY + chartH - hExpense;

      // Income Bar
      if (seriesVisibility.income) {
        const rectInc = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectInc.setAttribute('x', cx - barW - 2);
        rectInc.setAttribute('y', yIncome);
        rectInc.setAttribute('width', barW);
        rectInc.setAttribute('height', hIncome);
        rectInc.setAttribute('rx', '4');
        rectInc.setAttribute('fill', '#23B981');
        rectInc.classList.add('chart-bar');
        rectInc.addEventListener('mousemove', (e) => showChartTooltip(e, `${b.label}: Income ₹${formatINR(b.income)}`));
        rectInc.addEventListener('mouseleave', hideChartTooltip);
        svg.appendChild(rectInc);
      }

      // Expense Bar
      if (seriesVisibility.expense) {
        const rectExp = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectExp.setAttribute('x', cx + 2);
        rectExp.setAttribute('y', yExpense);
        rectExp.setAttribute('width', barW);
        rectExp.setAttribute('height', hExpense);
        rectExp.setAttribute('rx', '4');
        rectExp.setAttribute('fill', '#F06575');
        rectExp.classList.add('chart-bar');
        rectExp.addEventListener('mousemove', (e) => showChartTooltip(e, `${b.label}: Expense ₹${formatINR(b.expense)}`));
        rectExp.addEventListener('mouseleave', hideChartTooltip);
        svg.appendChild(rectExp);
      }

      // X Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', cx);
      label.setAttribute('y', height - 4);
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', '500');
      label.setAttribute('fill', '#18213D');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = b.label;
      svg.appendChild(label);
    });
  };

  // 4. Render Donut Chart (Spending by Category)
  const renderDonutChart = (cats, totalExpense) => {
    const svg = document.getElementById('donut-chart-svg');
    const legendList = document.getElementById('category-legend-list');
    const centerVal = document.getElementById('donut-center-val');

    if (centerVal) centerVal.textContent = `₹${formatINR(totalExpense)}`;
    if (!svg || !legendList) return;

    svg.innerHTML = '';
    legendList.innerHTML = '';

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    cats.forEach((cat) => {
      const strokeDash = (cat.percent / 100) * circumference;
      const strokeDashoffset = -(accumulatedPercent / 100) * circumference;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '105');
      circle.setAttribute('cy', '105');
      circle.setAttribute('r', radius);
      circle.setAttribute('stroke', cat.color);
      circle.setAttribute('stroke-dasharray', `${strokeDash} ${circumference}`);
      circle.setAttribute('stroke-dashoffset', strokeDashoffset);
      circle.classList.add('donut-segment');

      circle.addEventListener('mousemove', (e) => {
        showChartTooltip(e, `${cat.name}: ₹${formatINR(cat.amount)} (${cat.percent}%)`);
      });
      circle.addEventListener('mouseleave', hideChartTooltip);

      svg.appendChild(circle);
      accumulatedPercent += cat.percent;

      // Legend Row
      const row = document.createElement('div');
      row.className = 'category-legend-row';
      row.innerHTML = `
        <div class="cat-label-wrap">
          <span class="cat-color-chip" style="background-color: ${cat.color}"></span>
          <span>${cat.name}</span>
        </div>
        <div class="cat-meta-wrap">
          <span class="cat-amount">₹${formatINR(cat.amount)}</span>
          <span class="cat-percent">${cat.percent}%</span>
        </div>
      `;
      row.addEventListener('mouseenter', () => {
        circle.setAttribute('stroke-width', '34');
      });
      row.addEventListener('mouseleave', () => {
        circle.setAttribute('stroke-width', '28');
      });
      legendList.appendChild(row);
    });
  };

  // 5. Render Monthly Spending Trend Multi-Line Chart
  const renderTrendChart = (bars) => {
    const svg = document.getElementById('trend-line-chart-svg');
    if (!svg) return;
    svg.innerHTML = '';

    const width = 1000;
    const height = 220;
    const padX = 55;
    const padY = 25;
    const chartW = width - padX - 30;
    const chartH = height - padY * 2;

    const maxVal = 90000;
    const stepX = chartW / (bars.length - 1);

    // Horizontal grid lines
    for (let i = 0; i <= 3; i++) {
      const y = padY + (chartH / 3) * i;
      const v = Math.round(maxVal - (maxVal / 3) * i);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padX);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - 30);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#E8EBF3');
      line.setAttribute('stroke-dasharray', '3 3');
      svg.appendChild(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', padX - 8);
      label.setAttribute('y', y + 4);
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#75809A');
      label.setAttribute('text-anchor', 'end');
      label.textContent = `₹${v / 1000}k`;
      svg.appendChild(label);
    }

    // Coordinates generator
    const getCoords = (key) => {
      return bars.map((b, i) => {
        const val = key === 'savings' ? b.income - b.expense : b[key];
        const cx = padX + i * stepX;
        const cy = padY + chartH - (val / maxVal) * chartH;
        return { cx, cy, val, label: b.label };
      });
    };

    const drawLine = (coords, color) => {
      let pathD = `M ${coords[0].cx} ${coords[0].cy}`;
      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];
        const cp1x = prev.cx + (curr.cx - prev.cx) / 2;
        const cp2x = cp1x;
        pathD += ` C ${cp1x} ${prev.cy}, ${cp2x} ${curr.cy}, ${curr.cx} ${curr.cy}`;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);

      coords.forEach(pt => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', pt.cx);
        dot.setAttribute('cy', pt.cy);
        dot.setAttribute('r', '4.5');
        dot.setAttribute('fill', '#FFFFFF');
        dot.setAttribute('stroke', color);
        dot.setAttribute('stroke-width', '2.5');
        dot.classList.add('trend-point');
        dot.addEventListener('mousemove', (e) => showChartTooltip(e, `${pt.label}: ₹${formatINR(pt.val)}`));
        dot.addEventListener('mouseleave', hideChartTooltip);
        svg.appendChild(dot);
      });
    };

    if (seriesVisibility.income) drawLine(getCoords('income'), '#23B981');
    if (seriesVisibility.expense) drawLine(getCoords('expense'), '#F06575');
    if (seriesVisibility.savings) drawLine(getCoords('savings'), '#7957FF');

    // X Axis Month Labels
    bars.forEach((b, i) => {
      const cx = padX + i * stepX;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx);
      text.setAttribute('y', height - 4);
      text.setAttribute('font-size', '11');
      text.setAttribute('fill', '#18213D');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = b.label;
      svg.appendChild(text);
    });
  };

  // 6. Render Income Sources Horizontal Bars
  const renderIncomeSources = (sources) => {
    const container = document.getElementById('source-bars-stack');
    if (!container) return;
    container.innerHTML = '';

    sources.forEach(src => {
      const item = document.createElement('div');
      item.className = 'source-bar-item';
      item.innerHTML = `
        <div class="source-bar-header">
          <span class="source-name">${src.name}</span>
          <div class="source-numbers">
            <span class="source-amt">₹${formatINR(src.amount)}</span>
            <span class="source-share">${src.percent}%</span>
          </div>
        </div>
        <div class="source-track">
          <div class="source-fill" style="width: ${src.percent}%; background-color: ${src.color}"></div>
        </div>
      `;
      container.appendChild(item);
    });
  };

  // 7. Render Recent Activity Table
  const renderRecentActivity = (activity) => {
    const tbody = document.getElementById('activity-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    activity.forEach(tx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="tx-title-cell">
            <div class="tx-icon-bubble ${tx.isIncome ? 'icon-bubble-green' : 'icon-bubble-coral'}">
              <i class="${tx.icon}"></i>
            </div>
            <div>
              <div style="font-weight: 600; color: #18213D;">${tx.title}</div>
              <div style="font-size: 0.75rem; color: #75809A;">Verified transaction</div>
            </div>
          </div>
        </td>
        <td><span style="font-weight: 500;">${tx.cat}</span></td>
        <td><span style="color: #75809A;">${tx.date}</span></td>
        <td>
          <span class="tx-badge ${tx.isIncome ? 'income' : 'expense'}">${tx.type}</span>
        </td>
        <td>
          <span class="${tx.isIncome ? 'amount-income' : 'amount-expense'}">
            ${tx.isIncome ? '+' : '−'}₹${formatINR(tx.amount)}
          </span>
        </td>
        <td>
          <button style="background: none; border: none; color: #7957FF; cursor: pointer; font-size: 0.8rem; font-weight: 600;" onclick="alert('Viewing receipt for ${tx.title}')">
            View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  // Tooltip Helpers
  const showChartTooltip = (e, text) => {
    if (!tooltip) return;
    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.pageX + 12}px`;
    tooltip.style.top = `${e.pageY - 28}px`;
  };

  const hideChartTooltip = () => {
    if (tooltip) tooltip.style.display = 'none';
  };

  // 8. CSV Export Functionality
  const handleExportCSV = () => {
    const data = reportData.standard;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction Title,Category,Date,Type,Amount (INR)\n';

    data.recentActivity.forEach(tx => {
      csvContent += `"${tx.title}","${tx.cat}","${tx.date}","${tx.type}","${tx.isIncome ? '+' : '-'}${tx.amount}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finora_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics CSV exported successfully!');
  };

  // 9. Download Report (Print / PDF)
  const handleDownloadReport = () => {
    showToast('Preparing PDF Report summary...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // 10. Filter & Demo State Switcher
  const applyState = (stateKey) => {
    currentState = stateKey;
    document.querySelectorAll('.demo-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === stateKey);
    });

    const apiErrorBanner = document.getElementById('api-error-banner');
    const emptyStateBanner = document.getElementById('empty-state-banner');
    const mainAnalyticsArea = document.getElementById('main-analytics-area');

    if (stateKey === 'api-error') {
      if (apiErrorBanner) apiErrorBanner.style.display = 'block';
      if (emptyStateBanner) emptyStateBanner.style.display = 'none';
      if (mainAnalyticsArea) mainAnalyticsArea.style.opacity = '0.4';
      showToast('Simulated 500 Internal Server Error.');
      return;
    } else {
      if (apiErrorBanner) apiErrorBanner.style.display = 'none';
      if (mainAnalyticsArea) mainAnalyticsArea.style.opacity = '1';
    }

    if (stateKey === 'empty') {
      if (emptyStateBanner) emptyStateBanner.style.display = 'block';
      if (mainAnalyticsArea) mainAnalyticsArea.style.display = 'none';
      renderOverviewCards({ totalIncome: 0, totalExpenses: 0 });
      showToast('Empty period state loaded.');
      return;
    } else {
      if (emptyStateBanner) emptyStateBanner.style.display = 'none';
      if (mainAnalyticsArea) mainAnalyticsArea.style.display = 'block';
    }

    const base = JSON.parse(JSON.stringify(reportData.standard));

    if (stateKey === 'income-only') {
      base.totalExpenses = 0;
      base.categories = [];
      activeTxType = 'Income';
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'Income'));
      showToast('Filtered by Income only.');
    } else if (stateKey === 'expenses-only') {
      base.totalIncome = 0;
      base.sources = [];
      activeTxType = 'Expenses';
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'Expenses'));
      showToast('Filtered by Expenses only.');
    } else {
      activeTxType = 'All';
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'All'));
      showToast('Standard view (All data) loaded.');
    }

    renderOverviewCards(base);
    renderBarChart(base.monthlyBars);
    renderDonutChart(base.categories, base.totalExpenses);
    renderTrendChart(base.monthlyBars);
    renderIncomeSources(base.sources);
    renderRecentActivity(base.recentActivity);
  };

  // Event Listeners
  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      const isCustom = e.target.value === 'Custom Range';
      if (customDateInputs) {
        customDateInputs.classList.toggle('visible', isCustom);
      }
      if (dateRangeDisplay) {
        dateRangeDisplay.style.display = isCustom ? 'none' : 'flex';
      }
      showToast(`Period changed to: ${e.target.value}`);
    });
  }

  segmentedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTxType = btn.dataset.type;
      showToast(`Showing: ${activeTxType}`);
    });
  });

  intervalPills.forEach(pill => {
    pill.addEventListener('click', () => {
      intervalPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeInterval = pill.dataset.interval;
      showToast(`Chart Interval set to: ${activeInterval}`);
    });
  });

  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyState(btn.dataset.state);
    });
  });

  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) exportBtn.addEventListener('click', handleExportCSV);

  const downloadBtn = document.getElementById('download-report-btn');
  if (downloadBtn) downloadBtn.addEventListener('click', handleDownloadReport);

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      applyState('standard');
    });
  }

  // Mobile menu toggle
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

  async function loadAnalyticsFromAPI() {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const fetchFn = (window.FinoraAuth && window.FinoraAuth.fetchWithAuth)
        ? (url) => window.FinoraAuth.fetchWithAuth(url)
        : (url) => fetch(url);

      const [monthlyRes, yearlyRes, txnRes] = await Promise.all([
        fetchFn(`/api/summary/monthly?year=${year}&month=${month}`),
        fetchFn(`/api/summary/yearly?year=${year}`),
        fetchFn(`/api/transactions?limit=5`)
      ]);

      const monthlyData = monthlyRes.ok ? await monthlyRes.json() : null;
      const yearlyData = yearlyRes.ok ? await yearlyRes.json() : null;
      const txnData = txnRes.ok ? await txnRes.json() : null;

      const summary = (monthlyData && monthlyData.summary) || {};
      const yearlySummary = (yearlyData && yearlyData.summary) || {};

      reportData.standard.totalIncome = summary.totalIncome || 0;
      reportData.standard.totalExpenses = summary.totalExpenses || 0;

      // Category breakdown
      reportData.standard.categories = (summary.expenseByCategory || []).map(c => ({
        name: c.category,
        percent: c.percentage,
        amount: c.total,
        color: c.color || '#7957FF'
      }));

      // Source breakdown
      reportData.standard.sources = (summary.incomeByCategory || []).map(s => ({
        name: s.category,
        amount: s.total,
        percent: s.percentage,
        color: s.color || '#23B981'
      }));

      // Monthly bars
      reportData.standard.monthlyBars = (yearlySummary.monthlyData || []).map(m => ({
        label: m.monthName,
        income: m.income,
        expense: m.expense
      }));

      // Recent Activity
      reportData.standard.recentActivity = (txnData && txnData.transactions || []).map(t => ({
        title: t.title,
        cat: t.category,
        date: t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        type: t.type === 'income' ? 'Income' : 'Expense',
        amount: t.amount,
        icon: t.type === 'income' ? 'ri-wallet-3-line' : 'ri-shopping-cart-2-line',
        isIncome: t.type === 'income'
      }));

      // If zero records, show clean empty state
      if (reportData.standard.totalIncome === 0 && reportData.standard.totalExpenses === 0) {
        applyState('empty');
      } else {
        applyState('standard');
      }
    } catch (err) {
      console.error('Error fetching analytics data from MongoDB:', err);
      applyState('empty');
    }
  }

  // Initial render
  loadAnalyticsFromAPI();
});
