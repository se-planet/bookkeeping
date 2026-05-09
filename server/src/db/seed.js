const { getDb } = require('./connection');

function seedDatabase() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();

  if (count.count > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const insertCategory = db.prepare(`
    INSERT INTO categories (name, type, icon, color, is_default, sort_order)
    VALUES (@name, @type, @icon, @color, 1, @sort_order)
  `);

  const expenseCategories = [
    { name: '餐饮', icon: '🍔', color: '#EF4444', sort_order: 1 },
    { name: '交通', icon: '🚌', color: '#F97316', sort_order: 2 },
    { name: '购物', icon: '🛍️', color: '#EAB308', sort_order: 3 },
    { name: '娱乐', icon: '🎮', color: '#22C55E', sort_order: 4 },
    { name: '租房', icon: '🏠', color: '#3B82F6', sort_order: 5 },
    { name: '通讯', icon: '💡', color: '#8B5CF6', sort_order: 6 },
    { name: '健康', icon: '🏥', color: '#EC4899', sort_order: 7 },
    { name: '出行', icon: '✈️', color: '#14B8A6', sort_order: 8 },
    { name: '其他支出', icon: '💸', color: '#6B7280', sort_order: 99 },
  ];

  const incomeCategories = [
    { name: '工资', icon: '💰', color: '#22C55E', sort_order: 1 },
    { name: '兼职', icon: '💻', color: '#3B82F6', sort_order: 2 },
    { name: '投资', icon: '📈', color: '#8B5CF6', sort_order: 3 },
    { name: '礼金', icon: '🎁', color: '#EC4899', sort_order: 4 },
    { name: '其他收入', icon: '💵', color: '#6B7280', sort_order: 99 },
  ];

  const insertAll = db.transaction(() => {
    for (const cat of expenseCategories) {
      insertCategory.run({ ...cat, type: 'expense' });
    }
    for (const cat of incomeCategories) {
      insertCategory.run({ ...cat, type: 'income' });
    }
  });

  insertAll();

  db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES ('currency', 'CNY')`).run();
  db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES ('language', 'zh-CN')`).run();

  console.log('Default categories seeded.');
}

module.exports = { seedDatabase };
