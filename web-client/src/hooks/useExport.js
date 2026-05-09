import { useMutation } from '@tanstack/react-query';
import * as api from '../api/export';
import { saveAs } from 'file-saver';

export function useExportCSV() {
  return useMutation({
    mutationFn: (params) => api.exportCSV(params),
    onSuccess: (blob) => saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.csv`),
  });
}

export function useExportExcel() {
  return useMutation({
    mutationFn: (params) => api.exportExcel(params),
    onSuccess: (blob) => saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`),
  });
}
