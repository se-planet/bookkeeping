import apiClient from './client';

export function fetchTransactions(params) {
  return apiClient.get('/transactions', { params }).then(r => r.data);
}

export function createTransaction(data) {
  return apiClient.post('/transactions', data).then(r => r.data);
}

export function updateTransaction(id, data) {
  return apiClient.put(`/transactions/${id}`, data).then(r => r.data);
}

export function fetchTransactionById(id) {
  return apiClient.get(`/transactions/${id}`).then(r => r.data);
}

export function deleteTransaction(id) {
  return apiClient.delete(`/transactions/${id}`).then(r => r.data);
}
