const { Transaction } = require('../models/Transaction');
const { generateCSV } = require('../utils/csvExport');
const { generateExcel } = require('../utils/excelExport');

const exportController = {
  async csv(req, res) {
    const { start_date, end_date, type } = req.query;

    const result = Transaction.findAll({
      type,
      start_date,
      end_date,
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      limit: 100000,
    });

    const csv = generateCSV(result.data);

    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  },

  async excel(req, res) {
    const { start_date, end_date, type } = req.query;

    const result = Transaction.findAll({
      type,
      start_date,
      end_date,
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      limit: 100000,
    });

    const buffer = await generateExcel(result.data);

    const filename = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  },
};

module.exports = { exportController };
