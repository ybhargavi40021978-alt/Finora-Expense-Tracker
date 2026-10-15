/**
 * Finora Centralized Currency Formatter (Indian Rupee - INR)
 * Global helper for en-IN currency presentation across all application screens.
 */
(function (window) {
  'use strict';

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const inrNoDecimals = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  window.formatINR = function (amount, withDecimals = true) {
    const num = Number(amount ?? 0);
    return withDecimals ? inrFormatter.format(num) : inrNoDecimals.format(num);
  };

  window.formatINRCompact = function (amount) {
    const num = Number(amount ?? 0);
    if (Math.abs(num) >= 10000000) {
      return '₹' + (num / 10000000).toFixed(2) + ' Cr';
    }
    if (Math.abs(num) >= 100000) {
      return '₹' + (num / 100000).toFixed(2) + ' L';
    }
    if (Math.abs(num) >= 1000) {
      return '₹' + (num / 1000).toFixed(1) + ' k';
    }
    return window.formatINR(num);
  };
})(window);
