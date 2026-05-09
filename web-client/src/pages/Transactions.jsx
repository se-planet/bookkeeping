import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils';

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useTransactions({
    page, limit: 20, type: filterType || undefined,
    search: search || undefined, sort_by: 'date', sort_order: 'desc',
  });
  const deleteTx = useDeleteTransaction();

  const transactions = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = (id) => {
    if (confirm('确定删除这条记录？')) deleteTx.mutate(id);
  };

  return (
    <div>
      <h2 className="page-title">账单</h2>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            className="pl-10 pr-4 py-2.5 border border-[#e8ecf1] rounded-xl text-sm w-full"
            placeholder="搜索备注、分类..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Link to="/transactions/new" className="btn btn-primary whitespace-nowrap">
          + 记一笔
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {['', 'expense', 'income'].map(t => (
          <button key={t} onClick={() => { setFilterType(t); setPage(1); }}
            className={`filter-pill ${filterType === t ? 'filter-pill-active' : ''}`}>
            {t === '' ? '全部' : t === 'expense' ? '支出' : '收入'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="tx-item animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100 mr-4" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-3 bg-gray-50 rounded w-32" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-text">加载失败，请检查后端是否启动</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">{search || filterType ? '没有匹配的记录' : '暂无记录，点击右上角 + 记一笔'}</div>
        </div>
      ) : (
        <>
          <div className="card" style={{padding: 0, overflow: 'hidden'}}>
            {transactions.map(t => (
              <div key={t.id} className="tx-item group">
                <span className="text-2xl mr-4">{t.category_icon || '📦'}</span>
                <div className="flex-1">
                  <div className="font-medium text-[15px]">
                    {t.category_name}
                    {t.sub_category && <span className="text-gray-400 text-xs ml-1">·{t.sub_category}</span>}
                    {t.payment_method && (
                      <span className={`payment-badge ml-1.5 ${t.payment_method === '微信' ? 'payment-wechat' : t.payment_method === '支付宝' ? 'payment-alipay' : t.payment_method === '银行卡' ? 'payment-card' : 'payment-cash'}`}>
                        {t.payment_method}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{t.note || formatDate(t.date)}</div>
                </div>
                <div className={`font-semibold text-[15px] mr-4 ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {formatCurrency(t.type === 'income' ? t.amount : -t.amount)}
                </div>
                <Link to={`/transactions/${t.id}/edit`} className="text-gray-300 hover:text-blue-500 mr-3 opacity-0 group-hover:opacity-100 transition-all text-sm font-medium">编辑</Link>
                <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm font-medium">删除</button>
              </div>
            ))}
          </div>

          {pagination && page < pagination.totalPages && (
            <button onClick={() => setPage(p => p + 1)} className="w-full mt-4 py-3 text-primary font-medium hover:bg-white rounded-xl transition-all border border-dashed border-[#e8ecf1]">
              加载更多
            </button>
          )}
        </>
      )}
    </div>
  );
}
