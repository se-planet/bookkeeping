import { useState } from 'react';
import { importCSV } from '../api/import';

export default function Import() {
  const [filePath, setFilePath] = useState('/Users/qingxuly/Documents/Code/CC01/苏打水_20260508_131143.csv');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!filePath.trim()) return setError('请输入文件路径');
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await importCSV(filePath.trim());
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.error || '导入失败，请检查文件路径是否正确');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="page-title">导入数据</h2>
      <p className="page-subtitle">从 CSV 文件导入历史记账数据。</p>

      <div className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-1.5 block">CSV 文件路径</label>
          <input
            className="font-mono text-sm"
            value={filePath}
            onChange={e => setFilePath(e.target.value)}
            placeholder="/path/to/file.csv"
          />
          <p className="text-xs text-gray-400 mt-1.5">输入服务器上 CSV 文件的完整路径</p>
        </div>

        <div className="rounded-xl p-4 text-sm text-gray-500" style={{background: '#f8fafc', border: '1px solid #e8ecf1'}}>
          <p className="font-semibold mb-2 text-gray-600">支持的 CSV 格式：</p>
          <code className="text-xs text-gray-400">时间,日期,类型,分类,子分类,金额,备注,标签,卡券</code>
          <ul className="mt-2 space-y-1 text-xs">
            <li>· 类型：支出 / 收入</li>
            <li>· 分类自动匹配已有分类，未匹配的自动创建</li>
            <li>· 子分类、标签、支付方式等字段会自动导入</li>
          </ul>
        </div>

        <button
          onClick={handleImport}
          disabled={loading}
          className="btn btn-primary w-full py-3"
        >
          📥 {loading ? '正在导入...' : '开始导入'}
        </button>

        {error && (
          <div className="result-error">{error}</div>
        )}

        {result && (
          <div className="result-success">
            <div className="font-semibold mb-1.5 text-green-700">导入完成</div>
            <div className="text-sm space-y-1 text-green-700">
              <div>成功导入：{result.imported} 条</div>
              <div>跳过：{result.skipped} 条</div>
              <div>总计：{result.total} 条</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
