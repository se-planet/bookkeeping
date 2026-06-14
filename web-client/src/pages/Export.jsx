import { useState } from 'react';
import { useExportCSV, useExportExcel } from '../hooks/useExport';

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Export() {
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(getToday());
  const [type, setType] = useState('');

  const csvExport = useExportCSV();
  const excelExport = useExportExcel();

  const params = { start_date: startDate, end_date: endDate, type: type || undefined };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="page-title">导出数据</h2>
      <p className="page-subtitle">选择日期范围，导出账单记录为文件。</p>

      <div className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-1.5 block">开始日期</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400 mb-1.5 block">结束日期</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">类型</label>
          <div className="flex gap-2">
            {['', 'expense', 'income'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`filter-pill ${type === t ? 'filter-pill-active' : ''}`}>
                {t === '' ? '全部' : t === 'expense' ? '支出' : '收入'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => csvExport.mutate(params)} disabled={csvExport.isPending}
          className="btn btn-primary w-full py-3">
          📄 {csvExport.isPending ? '导出中...' : '导出 CSV'}
        </button>

        <button onClick={() => excelExport.mutate(params)} disabled={excelExport.isPending}
          className="btn btn-excel w-full py-3">
          📊 {excelExport.isPending ? '导出中...' : '导出 Excel'}
        </button>
      </div>
    </div>
  );
}
