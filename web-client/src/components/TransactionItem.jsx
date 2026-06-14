import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils';

const PAYMENT_CLASS = {
  '微信': 'payment-wechat',
  '支付宝': 'payment-alipay',
  '银行卡': 'payment-card',
  '现金': 'payment-cash',
};

export default function TransactionItem({ transaction: t, showActions, onEdit, onDelete }) {
  return (
    <div className="tx-item group">
      <span className="text-2xl mr-4">{t.category_icon || '📦'}</span>
      <div className="flex-1">
        <div className="font-medium text-[15px]">
          {t.category_name}
          {t.sub_category && <span className="text-gray-400 text-xs ml-1">·{t.sub_category}</span>}
          {t.payment_method && (
            <span className={`payment-badge ml-1.5 ${PAYMENT_CLASS[t.payment_method] || 'payment-cash'}`}>
              {t.payment_method}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400 mt-0.5">{t.note || formatDate(t.date)}</div>
      </div>
      <div className={`font-semibold text-[15px] tabular-nums ${showActions ? 'mr-4' : ''} ${t.type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}`}>
        {formatCurrency(t.type === 'income' ? t.amount : -t.amount)}
      </div>
      {showActions && (
        <>
          <Link to={`/transactions/${t.id}/edit`} className="text-gray-300 hover:text-blue-500 mr-3 opacity-0 group-hover:opacity-100 transition-all text-sm font-medium">编辑</Link>
          <button onClick={() => onDelete(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm font-medium">删除</button>
        </>
      )}
    </div>
  );
}
