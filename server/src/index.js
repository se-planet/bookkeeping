const { createApp } = require('./app');
const { PORT } = require('./config');
const { initializeDatabase } = require('./db/schema');
const { seedDatabase } = require('./db/seed');

initializeDatabase();
seedDatabase();

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
