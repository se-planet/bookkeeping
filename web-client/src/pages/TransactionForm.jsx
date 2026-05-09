import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useTransaction, useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions';

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TransactionForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing } = useTransaction(isEdit ? Number(id) : null);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getToday());
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setAmount(String(existing.amount));
      setCategoryId(String(existing.category_id));
      setSubCategory(existing.sub_category || '');
      setNote(existing.note || '');
      setDate(existing.date);
      setPaymentMethod(existing.payment_method || '');
    }
  }, [existing]);

  const { data: catData } = useCategories(type);
  const categories = catData?.data || [];

  useEffect(() => {
    if (!isEdit && categories.length > 0 && !categoryId) {
      setCategoryId(String(categories[0].id));
    }
  }, [categories, isEdit, categoryId]);

  const createTx = useCreateTransaction();
  const updateTx = useUpdateTransaction();

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return alert('请输入有效金额');
    if (!categoryId) return alert('请选择分类');

    const data = { type, amount: numAmount, category_id: Number(categoryId), sub_category: subCategory, note, date, payment_method: paymentMethod };
    const onSuccess = () => navigate('/transactions');
    const onError = (err) => alert(err.response?.data?.error || '操作失败');

    if (isEdit) {
      updateTx.mutate({ id: Number(id), data }, { onSuccess, onError });
    } else {
      createTx.mutate(data, { onSuccess, onError });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="page-title">{isEdit ? '编辑记录' : '记一笔'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="type-toggle">
          <button type="button" onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}>支出</button>
          <button type="button" onClick={() => { setType('income'); setCategoryId(''); }}
            className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}>收入</button>
        </div>

        <div className="card text-center">
          <label className="text-sm font-medium text-gray-400 mb-2 block">金额</label>
          <div className="flex items-center justify-center text-4xl font-extrabold" style={{letterSpacing: '-1px'}}>
            <span className="mr-1 text-gray-300">¥</span>
            <input className="text-center outline-none" style={{width: '70%'}} value={amount} onChange={e => setAmount(e.target.value)}
              type="number" step="0.01" min="0" placeholder="0.00" required />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">分类</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c.id} type="button" onClick={() => setCategoryId(String(c.id))}
                className={`cat-chip ${String(c.id) === categoryId ? 'cat-chip-active' : ''}`}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">子分类</label>
            <input placeholder="如：午餐、早餐" value={subCategory}
              onChange={e => setSubCategory(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">支付方式</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="">不限</option>
              <option value="支付宝">支付宝</option>
              <option value="微信">微信</option>
              <option value="银行卡">银行卡</option>
              <option value="现金">现金</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-1 block">日期</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-1 block">备注（选填）</label>
          <input placeholder="商家名称或备注..." value={note}
            onChange={e => setNote(e.target.value)} maxLength={200} />
        </div>

        <button type="submit" disabled={createTx.isPending || updateTx.isPending}
          className="btn btn-primary w-full py-3 text-base">
          {createTx.isPending || updateTx.isPending ? '保存中...' : '保存'}
        </button>

        <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost w-full py-2">取消</button>
      </form>
    </div>
  );
}
