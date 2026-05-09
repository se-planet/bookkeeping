const { getDb } = require('../db/connection');

const Category = {
  findAll(type) {
    const db = getDb();
    let query = 'SELECT * FROM categories';
    const params = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY type, sort_order ASC, id ASC';
    return db.prepare(query).all(...params);
  },

  findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  create(data) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO categories (name, type, icon, color, sort_order)
      VALUES (@name, @type, @icon, @color, @sort_order)
    `);
    const result = stmt.run({
      name: data.name,
      type: data.type,
      icon: data.icon || '📦',
      color: data.color || '#6B7280',
      sort_order: data.sort_order || 0,
    });
    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    const updated = {
      name: data.name !== undefined ? data.name : existing.name,
      type: data.type !== undefined ? data.type : existing.type,
      icon: data.icon !== undefined ? data.icon : existing.icon,
      color: data.color !== undefined ? data.color : existing.color,
      sort_order: data.sort_order !== undefined ? data.sort_order : existing.sort_order,
    };

    db.prepare(`
      UPDATE categories SET name = @name, type = @type, icon = @icon, color = @color,
        sort_order = @sort_order, updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...updated, id });

    return this.findById(id);
  },

  remove(id) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return existing;
  },

  countTransactions(id) {
    const db = getDb();
    const row = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE category_id = ?').get(id);
    return row.count;
  },
};

module.exports = { Category };
