import 'dotenv/config';
import app from './app.js';
import { initializeDatabase } from './database.js';

const PORT = process.env.PORT || 3001;

initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Novelist Studio API ready`);
});
