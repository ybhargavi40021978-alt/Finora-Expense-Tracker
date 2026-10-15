/**
 * Finora Expense Tracker — Screen 16: Loading States & Skeletons JavaScript
 * Manages interactive switching between Full Page Loader, Dashboard Skeleton,
 * Transactions Table Skeleton, Analytics Skeletons, Form Submissions, and Inline Refreshers.
 */

document.addEventListener('DOMContentLoaded', () => {
  const fullScreenLoader = document.getElementById('full-page-loader');
  const viewSections = document.querySelectorAll('.loading-view-section');
  const demoButtons = document.querySelectorAll('.demo-btn');

  // ========================================================================
  // 1. View Switching Logic
  // ========================================================================
  function switchView(viewKey) {
    if (viewKey === 'full-screen') {
      if (fullScreenLoader) {
        fullScreenLoader.classList.add('active');
        // Auto-close after 3 seconds for friendly preview
        setTimeout(() => {
          fullScreenLoader.classList.remove('active');
          showToast('Full page load completed.', 'success');
        }, 3000);
      }
      return;
    }

    viewSections.forEach(section => {
      if (section.getAttribute('data-view') === viewKey) {
        section.style.display = 'flex';
      } else {
        section.style.display = 'none';
      }
    });
  }

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const viewKey = btn.getAttribute('data-view');
      switchView(viewKey);
      showToast(`Showing ${btn.textContent.trim()} skeleton view.`, 'info');
    });
  });

  // Close full screen loader on click
  if (fullScreenLoader) {
    fullScreenLoader.addEventListener('click', () => {
      fullScreenLoader.classList.remove('active');
    });
  }

  // ========================================================================
  // 2. Interactive Form Submission Simulation
  // ========================================================================
  const simButtons = document.querySelectorAll('.btn-sim-submit');
  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.getAttribute('data-original-text') || btn.innerHTML;
      const loadingText = btn.getAttribute('data-loading-text') || 'Saving...';

      btn.classList.add('btn-loading');
      btn.disabled = true;
      btn.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;

      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        btn.innerHTML = originalText;
        showToast('Operation confirmed by server!', 'success');
      }, 2000);
    });
  });

  // ========================================================================
  // 3. Inline Card Refresh Simulation
  // ========================================================================
  const refreshBtns = document.querySelectorAll('.btn-sim-refresh');
  refreshBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCard = document.getElementById(btn.getAttribute('data-target'));
      if (!targetCard) return;

      const inlineLoader = targetCard.querySelector('.inline-loading-badge');
      if (inlineLoader) inlineLoader.style.display = 'inline-flex';

      setTimeout(() => {
        if (inlineLoader) inlineLoader.style.display = 'none';
        showToast('Card data refreshed successfully.', 'success');
      }, 1800);
    });
  });

  // ========================================================================
  // 4. Toast Utility
  // ========================================================================
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 2100; display: flex; flex-direction: column; gap: 8px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'background: #11183F; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; box-shadow: 0 8px 24px rgba(17,24,63,0.25); font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 10px; animation: toastIn 0.3s ease;';
    
    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-checkbox-circle-fill';
    toast.innerHTML = `<i class="${icon}" style="color: ${type === 'success' ? '#23B981' : '#7957FF'}; font-size: 1.125rem;"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initial View
  switchView('dashboard');
});
