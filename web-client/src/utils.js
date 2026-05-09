export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '¥0.00';
  const prefix = amount < 0 ? '-' : '';
  return `${prefix}¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length < 3) return dateString;
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const d = parseInt(parts[2]);
  if (isNaN(m) || isNaN(d)) return dateString;
  return `${m}月${d}日`;
}

export function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return '0.00';
  return amount.toFixed(2);
}
