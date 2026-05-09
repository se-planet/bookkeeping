const { stringify } = require('csv-stringify/sync');

function generateCSV(transactions) {
  const rows = transactions.map(t => ({
    Date: t.date,
    Type: t.type,
    Category: t.category_name || '',
    Amount: t.amount,
    Note: t.note || '',
  }));

  return stringify(rows, {
    header: true,
    columns: ['Date', 'Type', 'Category', 'Amount', 'Note'],
  });
}

module.exports = { generateCSV };
