const { getDb } = require('./connection');

function initializeDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      type        TEXT    NOT NULL CHECK(type IN ('income', 'expense')),
      icon        TEXT    NOT NULL DEFAULT '📦',
      color       TEXT    NOT NULL DEFAULT '#6B7280',
      is_default  INTEGER NOT NULL DEFAULT 0,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT    NOT NULL CHECK(type IN ('income', 'expense')),
      amount      REAL    NOT NULL CHECK(amount > 0),
      category_id INTEGER NOT NULL,
      sub_category TEXT   DEFAULT '',
      note        TEXT    DEFAULT '',
      date        TEXT    NOT NULL,
      time        TEXT    DEFAULT '',
      payment_method TEXT DEFAULT '',
      tags        TEXT    DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Migration: add new columns if they don't exist (only ignore "duplicate column" errors)
  const migrate = (col, type) => {
    try {
      db.exec(`ALTER TABLE transactions ADD COLUMN ${col} ${type}`);
    } catch (e) {
      if (!e.message.includes('duplicate column')) {
        throw e;
      }
    }
  };
  migrate('sub_category', "TEXT DEFAULT ''");
  migrate('time', "TEXT DEFAULT ''");
  migrate('payment_method', "TEXT DEFAULT ''");
  migrate('tags', "TEXT DEFAULT ''");

  console.log('Database tables initialized.');
}

module.exports = { initializeDatabase };
