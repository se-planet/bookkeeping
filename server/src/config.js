const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '..', 'data', 'bookkeeping.db');

module.exports = { PORT, DB_PATH };
