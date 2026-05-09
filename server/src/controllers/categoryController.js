const { Category } = require('../models/Category');

const categoryController = {
  getAll(req, res) {
    const { type } = req.query;
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be "income" or "expense"' });
    }
    const categories = Category.findAll(type);
    res.json({ data: categories });
  },

  getById(req, res) {
    const category = Category.findById(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ data: category });
  },

  create(req, res) {
    const { name, type, icon, color } = req.body;
    const category = Category.create({ name, type, icon, color, sort_order: 0 });
    res.status(201).json({ data: category });
  },

  update(req, res) {
    const id = Number(req.params.id);
    const existing = Category.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { name, icon, color, sort_order } = req.body;
    const category = Category.update(id, { name, icon, color, sort_order });
    res.json({ data: category });
  },

  remove(req, res) {
    const id = Number(req.params.id);
    const existing = Category.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (existing.is_default) {
      return res.status(409).json({ error: 'Cannot delete a default category' });
    }

    const count = Category.countTransactions(id);
    if (count > 0) {
      return res.status(409).json({ error: `Cannot delete category with ${count} transactions` });
    }

    Category.remove(id);
    res.json({ message: 'Category deleted successfully' });
  },
};

module.exports = { categoryController };
