const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const categoriesRouter = require('./routes/categories');
const transactionsRouter = require('./routes/transactions');
const statisticsRouter = require('./routes/statistics');
const exportRouter = require('./routes/export');
const importRouter = require('./routes/import');

function createApp() {
  const app = express();

  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/categories', categoriesRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/statistics', statisticsRouter);
  app.use('/api/export', exportRouter);
  app.use('/api/import', importRouter);

  // 404 handler for unmatched API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
