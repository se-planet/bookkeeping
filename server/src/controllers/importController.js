const { getDb } = require('../db/connection');
const fs = require('fs');
const path = require('path');

const importController = {
  importCSV(req, res) {
    const db = getDb();
    const filePath = req.body.filePath;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Prevent path traversal: restrict to safe directories
    const resolved = path.resolve(filePath);
    const allowedRoots = [path.resolve('/Users'), path.resolve('/tmp'), process.cwd()];
    if (!allowedRoots.some(root => resolved.startsWith(root))) {
      return res.status(403).json({ error: 'Access denied: file path not allowed' });
    }

    if (!fs.existsSync(resolved)) {
      return res.status(400).json({ error: 'File not found: ' + filePath });
    }

    const content = fs.readFileSync(resolved, 'utf-8');
    const lines = content.trim().split('\n');

    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file is empty or missing header' });
    }

    // Parse header using parseCSVLine for consistency with data rows
    const header = parseCSVLine(lines[0]);
    const colIndex = {
      time: header.indexOf('时间'),
      date: header.indexOf('日期'),
      type: header.indexOf('类型'),
      category: header.indexOf('分类'),
      subCategory: header.indexOf('子分类'),
      amount: header.indexOf('金额'),
      note: header.indexOf('备注'),
      tags: header.indexOf('标签'),
      paymentMethod: header.indexOf('卡券'),
    };

    // Preload categories for name lookup
    const categories = db.prepare('SELECT id, name, type FROM categories').all();
    const categoryMap = {};
    for (const c of categories) {
      categoryMap[c.name] = c;
    }

    const insertStmt = db.prepare(`
      INSERT INTO transactions (type, amount, category_id, sub_category, note, date, time, payment_method, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let imported = 0;
    let skipped = 0;

    const importAll = db.transaction(() => {
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('---') || line.startsWith('共')) continue;

        const cols = parseCSVLine(line);
        if (cols.length < 6) continue;

        const csvType = cols[colIndex.type] || '';
        const csvCategory = cols[colIndex.category] || '';
        const csvSubCategory = cols[colIndex.subCategory] || '';
        const csvAmount = parseFloat(cols[colIndex.amount]);
        const csvNote = cols[colIndex.note] || '';
        const csvDate = cols[colIndex.date] || '';
        const csvTime = cols[colIndex.time] || '';
        const csvTags = cols[colIndex.tags] || '';
        const csvPayment = cols[colIndex.paymentMethod] || '';

        if (!csvAmount || isNaN(csvAmount) || csvAmount <= 0) {
          skipped++;
          continue;
        }

        const type = csvType === '收入' ? 'income' : 'expense';

        let category = categoryMap[csvCategory];
        if (!category) {
          const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(csvCategory);
          if (existing) {
            category = existing;
            categoryMap[csvCategory] = category;
          } else {
            const result = db.prepare(
              'INSERT INTO categories (name, type, icon, color, is_default) VALUES (?, ?, ?, ?, 1)'
            ).run(csvCategory, type, '📦', '#6B7280');
            category = { id: result.lastInsertRowid, type };
            categoryMap[csvCategory] = category;
          }
        }

        insertStmt.run(type, csvAmount, category.id, csvSubCategory, csvNote, csvDate, csvTime, csvPayment, csvTags);
        imported++;
      }
    });

    try {
      importAll();
    } catch (err) {
      return res.status(500).json({ error: 'Import failed: ' + err.message });
    }

    res.json({
      message: 'Import completed',
      imported,
      skipped,
      total: imported + skipped,
    });
  },
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

module.exports = { importController };
