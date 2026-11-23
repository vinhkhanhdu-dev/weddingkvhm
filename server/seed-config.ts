/**
 * Copies the invitation content from src/data/defaultWedding.ts into MongoDB.
 *
 *   npm run seed:config            → only writes if the database has no invitation yet
 *   npm run seed:config -- --force → overwrites what is in the database
 */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { DEFAULT_WEDDING_CONFIG } from '../src/data/defaultWedding';

dotenv.config({ path: '.env.local' });
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'wedding_kvhm';
const force = process.argv.includes('--force');

if (!uri) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });

try {
  await client.connect();
  const settings = client.db(dbName).collection<{
    _id: string;
    config: unknown;
    updatedAt: Date;
  }>('settings');

  const existing = await settings.findOne({ _id: 'wedding' });
  if (existing && !force) {
    console.log(
      `Invitation already in ${dbName}.settings (updated ${existing.updatedAt.toISOString()}). ` +
        'Use --force to overwrite.'
    );
  } else {
    const updatedAt = new Date();
    await settings.updateOne(
      { _id: 'wedding' },
      { $set: { config: DEFAULT_WEDDING_CONFIG, updatedAt } },
      { upsert: true }
    );
    console.log(
      `${existing ? 'Overwrote' : 'Saved'} invitation for ` +
        `${DEFAULT_WEDDING_CONFIG.brideName} & ${DEFAULT_WEDDING_CONFIG.groomName} ` +
        `into ${dbName}.settings`
    );
  }
} finally {
  await client.close();
}
