import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import Skeleton from '../components/Skeleton';
import TransactionItem from '../components/TransactionItem';

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
        <Skeleton lines={5} />
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
              <TransactionItem key={t.id} transaction={t} showActions onDelete={handleDelete} />
            ))}
          </div>

          {pagination && page < pagination.totalPages && (
            <button onClick={() => setPage(p => p + 1)} className="load-more-btn">
              加载更多
            </button>
          )}
        </>
      )}

      <Link to="/transactions/new" className="fab">+</Link>
    </div>
  );
}
