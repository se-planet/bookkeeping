const { Transaction } = require('../models/transaction');
const { Category } = require('../models/category');

const transactionController = {
  getAll(req, res) {
    const { type, category_id, start_date, end_date, search, sort_by, sort_order, page, limit } = req.query;
    const result = Transaction.findAll({ type, category_id, start_date, end_date, search, sort_by, sort_order, page, limit });
    res.json(result);
  },

  getById(req, res) {
    const transaction = Transaction.findById(Number(req.params.id));
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ data: transaction });
  },

  create(req, res) {
    const { type, amount, category_id, note, date } = req.body;

    const category = Category.findById(category_id);
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }
    if (category.type !== type) {
      return res.status(400).json({ error: `Category type "${category.type}" does not match transaction type "${type}"` });
    }

    const transaction = Transaction.create({
      type,
      amount: Number(amount),
      category_id: Number(category_id),
      note,
      date,
    });
    res.status(201).json({ data: transaction });
  },

  update(req, res) {
    const id = Number(req.params.id);
    const { type, amount, category_id, note, date } = req.body;

    const existing = Transaction.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const effectiveType = type !== undefined ? type : existing.type;
    const effectiveCategoryId = category_id !== undefined ? Number(category_id) : existing.category_id;

    if (type !== undefined || category_id !== undefined) {
      const category = Category.findById(effectiveCategoryId);
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
      if (category.type !== effectiveType) {
        return res.status(400).json({ error: `Category type "${category.type}" does not match transaction type "${effectiveType}"` });
      }
    }

    const transaction = Transaction.update(id, {
      type,
      amount: amount !== undefined ? Number(amount) : undefined,
      category_id: category_id !== undefined ? Number(category_id) : undefined,
      note,
      date,
    });
    res.json({ data: transaction });
  },

  remove(req, res) {
    const transaction = Transaction.remove(Number(req.params.id));
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  },
};

module.exports = { transactionController };
