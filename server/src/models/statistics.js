const { getDb } = require('../db/connection');

const Statistics = {
  getSummary(period, year, month) {
    const db = getDb();

    if (period === 'monthly') {
      const y = Number(year);
      const m = Number(month);
      const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      const nextMonth = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;

      const rows = db.prepare(`
        SELECT type, SUM(amount) as total
        FROM transactions
        WHERE date >= ? AND date < ?
        GROUP BY type
      `).all(startDate, nextMonth);

      const income = rows.find(r => r.type === 'income')?.total || 0;
      const expense = rows.find(r => r.type === 'expense')?.total || 0;

      return {
        period: 'monthly',
        year: y,
        month: m,
        total_income: income,
        total_expense: expense,
        balance: income - expense,
      };
    }

    if (period === 'yearly') {
      const y = Number(year);
      const startDate = `${y}-01-01`;
      const nextYear = `${y + 1}-01-01`;

      const rows = db.prepare(`
        SELECT type, SUM(amount) as total
        FROM transactions
        WHERE date >= ? AND date < ?
        GROUP BY type
      `).all(startDate, nextYear);

      const income = rows.find(r => r.type === 'income')?.total || 0;
      const expense = rows.find(r => r.type === 'expense')?.total || 0;

      return {
        period: 'yearly',
        year: y,
        total_income: income,
        total_expense: expense,
        balance: income - expense,
      };
    }

    throw new Error('Invalid period');
  },

  getByCategory(period, year, month, type) {
    const db = getDb();
    const y = Number(year);

    let startDate, endDate;
    if (period === 'monthly') {
      const m = Number(month);
      startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      endDate = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
    } else {
      startDate = `${y}-01-01`;
      endDate = `${y + 1}-01-01`;
    }

    let whereType = '';
    const params = [startDate, endDate];
    if (type) {
      whereType = 'AND t.type = ?';
      params.push(type);
    }

    const rows = db.prepare(`
      SELECT
        t.category_id,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        t.type,
        SUM(t.amount) as total,
        COUNT(*) as transaction_count
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.date >= ? AND t.date < ? ${whereType}
      GROUP BY t.category_id
      ORDER BY total DESC
    `).all(...params);

    const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

    return rows.map(r => ({
      category_id: r.category_id,
      category_name: r.category_name,
      category_icon: r.category_icon,
      category_color: r.category_color,
      type: r.type,
      total: r.total,
      percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 1000) / 10 : 0,
      transaction_count: r.transaction_count,
    }));
  },

  getMonthlyTrend(year) {
    const db = getDb();
    const y = Number(year);

    const rows = db.prepare(`
      SELECT
        CAST(substr(date, 6, 2) AS INTEGER) as month,
        type,
        SUM(amount) as total
      FROM transactions
      WHERE date >= ? AND date < ?
      GROUP BY month, type
      ORDER BY month
    `).all(`${y}-01-01`, `${y + 1}-01-01`);

    const months = [];
    for (let m = 1; m <= 12; m++) {
      const income = rows.find(r => r.month === m && r.type === 'income')?.total || 0;
      const expense = rows.find(r => r.month === m && r.type === 'expense')?.total || 0;
      months.push({ month: m, income, expense });
    }

    return months;
  },
};

module.exports = { Statistics };
