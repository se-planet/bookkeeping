const ExcelJS = require('exceljs');

async function generateExcel(transactions) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions');

  sheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Note', key: 'note', width: 30 },
  ];

  for (const t of transactions) {
    const row = sheet.addRow({
      date: t.date,
      type: t.type,
      category: t.category_name || '',
      amount: t.amount,
      note: t.note || '',
    });

    if (t.type === 'income') {
      row.getCell('amount').font = { color: { argb: 'FF16A34A' } };
    } else {
      row.getCell('amount').font = { color: { argb: 'FFDC2626' } };
    }
  }

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}

module.exports = { generateExcel };
