/**
 * Standalone API server (local development and Render).
 * Run locally:  npm run server   (reads .env.local)
 */
import { app, closeDb, connectDb } from './app.js';

const PORT = Number(process.env.PORT || process.env.API_PORT || 3001);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Wedding API ready on :${PORT} (db: ${process.env.MONGODB_DB || 'wedding_kvhm'})`);
    });
  })
  .catch((err) => {
    console.error('Failed to start API:', err);
    process.exit(1);
  });

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    closeDb().finally(() => process.exit(0));
  });
}
