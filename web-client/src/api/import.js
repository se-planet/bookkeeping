import apiClient from './client';

export function importCSV(filePath) {
  return apiClient.post('/import/csv', { filePath }).then(r => r.data);
}
