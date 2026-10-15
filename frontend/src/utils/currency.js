/**
 * Finora Currency Formatting Utility — Indian Rupee (INR)
 * Formats monetary amounts according to the Indian numbering system (Lakhs, Crores).
 */

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));
};

export const formatINRCompact = (amount) => {
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
  return formatINR(num);
};

export const parseINRAmount = (input) => {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  if (!input) return 0;
  const cleaned = String(input).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};
