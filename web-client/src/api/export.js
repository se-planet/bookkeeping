import apiClient from './client';

export function exportCSV(params) {
  return apiClient.get('/export/csv', { params, responseType: 'blob' }).then(r => r.data);
}

export function exportExcel(params) {
  return apiClient.get('/export/excel', { params, responseType: 'blob' }).then(r => r.data);
}
