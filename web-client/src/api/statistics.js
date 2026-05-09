import apiClient from './client';

export function fetchSummary(params) {
  return apiClient.get('/statistics/summary', { params }).then(r => r.data);
}

export function fetchByCategory(params) {
  return apiClient.get('/statistics/by-category', { params }).then(r => r.data);
}

export function fetchMonthlyTrend(params) {
  return apiClient.get('/statistics/monthly-trend', { params }).then(r => r.data);
}
