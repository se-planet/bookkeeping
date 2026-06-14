const { getDb } = require('../db/connection');

const Transaction = {
  findAll({ type, category_id, start_date, end_date, search, sort_by = 'date', sort_order = 'desc', page = 1, limit = 20 } = {}) {
    const db = getDb();
    const conditions = [];
    const params = [];

    if (type) {
      conditions.push('t.type = ?');
      params.push(type);
    }
    if (category_id) {
      conditions.push('t.category_id = ?');
      params.push(Number(category_id));
    }
    if (start_date) {
      conditions.push('t.date >= ?');
      params.push(start_date);
    }
    if (end_date) {
      conditions.push('t.date <= ?');
      params.push(end_date);
    }
    if (search) {
      conditions.push('(t.note LIKE ? OR c.name LIKE ?)');
      const escaped = search.replace(/[%_]/g, '\\$&');
      params.push(`%${escaped}%`, `%${escaped}%`);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const allowedSort = ['date', 'amount', 'created_at'];
    const sortCol = allowedSort.includes(sort_by) ? sort_by : 'date';
    const order = sort_order === 'asc' ? 'ASC' : 'DESC';

    const offset = (Number(page) - 1) * Number(limit);

    const countRow = db.prepare(`SELECT COUNT(*) as total FROM transactions t ${where}`).get(...params);
    const total = countRow.total;

    const rows = db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ${where}
      ORDER BY t.${sortCol} ${order}
      LIMIT ? OFFSET ?
    `).all(...params, Number(limit), offset);

    return {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);
  },

  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO transactions (type, amount, category_id, sub_category, note, date, time, payment_method, tags)
      VALUES (@type, @amount, @category_id, @sub_category, @note, @date, @time, @payment_method, @tags)
    `);
    const result = stmt.run({
      type: data.type,
      amount: data.amount,
      category_id: data.category_id,
      sub_category: data.sub_category || '',
      note: data.note || '',
      date: data.date,
      time: data.time || '',
      payment_method: data.payment_method || '',
      tags: data.tags || '',
    });
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (!existing) return null;

    const updated = {
      type: data.type !== undefined ? data.type : existing.type,
      amount: data.amount !== undefined ? data.amount : existing.amount,
      category_id: data.category_id !== undefined ? data.category_id : existing.category_id,
      sub_category: data.sub_category !== undefined ? data.sub_category : existing.sub_category,
      note: data.note !== undefined ? data.note : existing.note,
      date: data.date !== undefined ? data.date : existing.date,
      time: data.time !== undefined ? data.time : existing.time,
      payment_method: data.payment_method !== undefined ? data.payment_method : existing.payment_method,
      tags: data.tags !== undefined ? data.tags : existing.tags,
    };

    db.prepare(`
      UPDATE transactions SET type = @type, amount = @amount, category_id = @category_id,
        sub_category = @sub_category, note = @note, date = @date, time = @time,
        payment_method = @payment_method, tags = @tags, updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...updated, id });

    return this.findById(id);
  },

  remove(id) {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    if (!existing) return null;

    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return existing;
  },
};

module.exports = { Transaction };
