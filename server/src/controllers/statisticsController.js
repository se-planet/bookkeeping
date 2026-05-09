const { Statistics } = require('../models/Statistics');

const statisticsController = {
  summary(req, res) {
    const now = new Date();
    const period = req.query.period || 'monthly';
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || (now.getMonth() + 1);

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'period must be "monthly" or "yearly"' });
    }
    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Invalid year' });
    }
    if (period === 'monthly' && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ error: 'month must be 1-12' });
    }

    const data = Statistics.getSummary(period, year, month);
    res.json({ data });
  },

  byCategory(req, res) {
    const now = new Date();
    const period = req.query.period || 'monthly';
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || (now.getMonth() + 1);
    const type = req.query.type;

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'period must be "monthly" or "yearly"' });
    }
    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Invalid year' });
    }
    if (period === 'monthly' && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ error: 'month must be 1-12' });
    }
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be "income" or "expense"' });
    }

    const data = Statistics.getByCategory(period, year, month, type);
    res.json({ data });
  },

  monthlyTrend(req, res) {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();

    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    const data = Statistics.getMonthlyTrend(year);
    res.json({ data });
  },
};

module.exports = { statisticsController };
