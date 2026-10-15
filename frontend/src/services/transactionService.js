import { request } from './api';

export const transactionService = {
  // Get unified transactions (both income and expenses)
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.type) query.set('type', params.type);
    if (params.category) query.set('category', params.category);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    return request(`/transactions${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Get single transaction by ID
  getById: async (id) => {
    return request(`/transactions/${id}`, { method: 'GET' });
  },

  // Delete transaction by ID
  delete: async (id) => {
    return request(`/transactions/${id}`, { method: 'DELETE' });
  },

  // Bulk delete transactions
  deleteBulk: async (ids) => {
    return request('/transactions/bulk-delete', {
      method: 'POST',
      body: { ids }
    });
  },

  // Aliases
  getTransactions: async (params) => transactionService.getAll(params),
  getTransactionById: async (id) => transactionService.getById(id),
  deleteTransaction: async (id) => transactionService.delete(id)
};
