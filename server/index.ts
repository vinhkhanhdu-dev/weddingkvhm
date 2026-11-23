/**
 * Wedding invitation API — keeps the MongoDB connection string on the server so it
 * is never shipped to the static GitHub Pages bundle.
 *
 * Run locally:  npm run server   (reads .env.local)
 * Env vars:     MONGODB_URI (required), MONGODB_DB, API_PORT | PORT, ALLOWED_ORIGINS
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Collection, MongoClient, ObjectId } from 'mongodb';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'wedding_kvhm';
const PORT = Number(process.env.PORT || process.env.API_PORT || 3001);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/** SHA-256 hex of the settings-page passcode; required to change the invitation content. */
const ADMIN_PASSCODE_HASH = (process.env.ADMIN_PASSCODE_HASH || '').trim().toLowerCase();

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Add it to .env.local or the host environment.');
  process.exit(1);
}
if (!/^[0-9a-f]{64}$/.test(ADMIN_PASSCODE_HASH)) {
  console.warn('ADMIN_PASSCODE_HASH missing or invalid — saving invitation settings is disabled.');
}

// ---------- Data model ----------

interface WishDoc {
  _id?: ObjectId;
  author: string;
  relation: string;
  message: string;
  hearts: number;
  createdAt: Date;
}

interface RsvpDoc {
  _id?: ObjectId;
  fullName: string;
  phone: string;
  attending: 'yes' | 'no';
  ceremonyChoice: string;
  guestCount: number;
  dietaryNote: string;
  createdAt: Date;
}

/** The whole invitation content (couple, families, schedule, story, gallery, bank accounts). */
interface SettingsDoc {
  _id: string;
  config: Record<string, unknown>;
  updatedAt: Date;
}

const CONFIG_DOC_ID = 'wedding';

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
let wishes: Collection<WishDoc>;
let rsvps: Collection<RsvpDoc>;
let settings: Collection<SettingsDoc>;

// ---------- Helpers ----------

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function text(value: unknown, field: string, max: number, required = false): string {
  const v = typeof value === 'string' ? value.trim() : '';
  if (required && !v) throw new HttpError(400, `Thiếu thông tin: ${field}`);
  if (v.length > max) throw new HttpError(400, `${field} quá dài (tối đa ${max} ký tự)`);
  return v;
}

function toWishDto(doc: WishDoc) {
  return {
    id: String(doc._id),
    author: doc.author,
    relation: doc.relation,
    message: doc.message,
    hearts: doc.hearts,
    createdAt: doc.createdAt.toISOString(),
  };
}

/** Small in-memory limiter so one visitor cannot flood the guestbook. */
function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return next(new HttpError(429, 'Bạn thao tác quá nhanh, vui lòng thử lại sau.'));
    }
    next();
  };
}

function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!/^[0-9a-f]{64}$/.test(ADMIN_PASSCODE_HASH)) {
    return next(new HttpError(503, 'Máy chủ chưa cấu hình mật khẩu quản trị.'));
  }
  const passcode = req.get('x-admin-passcode') || '';
  const given = createHash('sha256').update(passcode, 'utf8').digest();
  const expected = Buffer.from(ADMIN_PASSCODE_HASH, 'hex');
  if (!passcode || !timingSafeEqual(given, expected)) {
    return next(new HttpError(401, 'Mật khẩu quản trị không đúng.'));
  }
  next();
}

/** Shape check so a malformed save can never blank out the live invitation. */
function validateConfig(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Dữ liệu thiệp không hợp lệ.');
  }
  const config = body as Record<string, unknown>;
  for (const key of ['brideName', 'groomName', 'brideFullName', 'groomFullName', 'weddingDateISO']) {
    if (typeof config[key] !== 'string' || !(config[key] as string).trim()) {
      throw new HttpError(400, `Thiếu thông tin: ${key}`);
    }
  }
  for (const key of ['storyChapters', 'ceremonies', 'gallery', 'bankAccounts']) {
    if (!Array.isArray(config[key])) throw new HttpError(400, `Danh sách không hợp lệ: ${key}`);
  }
  if (typeof config.groomParents !== 'object' || typeof config.brideParents !== 'object') {
    throw new HttpError(400, 'Thiếu thông tin gia đình hai bên.');
  }
  const { _id: _ignored, ...clean } = config;
  return clean;
}

const asyncRoute =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

// ---------- App ----------

const app = express();
app.set('trust proxy', 1);
// Invitation data changes from the settings page at any time — never let browsers or
// proxies keep a copy of API responses.
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0');
  next();
});
const smallJson = express.json({ limit: '16kb' });
// Settings may carry uploaded photos/QR codes as data URLs, so that one route gets a larger limit
const configJson = express.json({ limit: '8mb' });
app.use((req, res, next) => (req.path === '/api/config' ? next() : smallJson(req, res, next)));
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server requests (no Origin header)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new HttpError(403, 'Origin not allowed'));
    },
  })
);

app.get(
  '/api/health',
  asyncRoute(async (_req, res) => {
    await client.db('admin').command({ ping: 1 });
    res.json({ ok: true, db: DB_NAME });
  })
);

app.get(
  '/api/config',
  asyncRoute(async (_req, res) => {
    const doc = await settings.findOne({ _id: CONFIG_DOC_ID });
    if (!doc) throw new HttpError(404, 'Chưa có dữ liệu thiệp.');
    res.json({ config: doc.config, updatedAt: doc.updatedAt.toISOString() });
  })
);

app.put(
  '/api/config',
  rateLimit(30, 10 * 60_000),
  requireAdmin,
  configJson,
  asyncRoute(async (req, res) => {
    const config = validateConfig(req.body?.config);
    const updatedAt = new Date();
    await settings.updateOne(
      { _id: CONFIG_DOC_ID },
      { $set: { config, updatedAt } },
      { upsert: true }
    );
    res.json({ ok: true, updatedAt: updatedAt.toISOString() });
  })
);

/** Lets the settings page confirm a passcode before showing the editor. */
app.post(
  '/api/admin/verify',
  rateLimit(10, 10 * 60_000),
  requireAdmin,
  (_req, res) => {
    res.json({ ok: true });
  }
);

app.get(
  '/api/wishes',
  asyncRoute(async (_req, res) => {
    const docs = await wishes.find().sort({ createdAt: -1 }).limit(200).toArray();
    res.json(docs.map(toWishDto));
  })
);

app.post(
  '/api/wishes',
  rateLimit(10, 10 * 60_000),
  asyncRoute(async (req, res) => {
    const doc: WishDoc = {
      author: text(req.body?.author, 'Tên', 80, true),
      relation: text(req.body?.relation, 'Mối quan hệ', 80) || 'Khách mời thân thiết',
      message: text(req.body?.message, 'Lời chúc', 1000, true),
      hearts: 1,
      createdAt: new Date(),
    };
    const { insertedId } = await wishes.insertOne(doc);
    res.status(201).json(toWishDto({ ...doc, _id: insertedId }));
  })
);

app.post(
  '/api/wishes/:id/heart',
  rateLimit(60, 10 * 60_000),
  asyncRoute(async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) throw new HttpError(404, 'Không tìm thấy lời chúc');
    const updated = await wishes.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $inc: { hearts: 1 } },
      { returnDocument: 'after' }
    );
    if (!updated) throw new HttpError(404, 'Không tìm thấy lời chúc');
    res.json({ id: String(updated._id), hearts: updated.hearts });
  })
);

app.post(
  '/api/rsvps',
  rateLimit(10, 10 * 60_000),
  asyncRoute(async (req, res) => {
    const attending = req.body?.attending === 'no' ? 'no' : 'yes';
    const count = Number(req.body?.guestCount);
    const doc: RsvpDoc = {
      fullName: text(req.body?.fullName, 'Họ và tên', 100, true),
      phone: text(req.body?.phone, 'Số điện thoại', 20),
      attending,
      ceremonyChoice: text(req.body?.ceremonyChoice, 'Nghi thức', 120),
      guestCount:
        attending === 'yes' && Number.isFinite(count)
          ? Math.min(10, Math.max(1, Math.round(count)))
          : 0,
      dietaryNote: text(req.body?.dietaryNote, 'Lưu ý', 300),
      createdAt: new Date(),
    };
    const { insertedId } = await rsvps.insertOne(doc);
    res.status(201).json({ id: String(insertedId), submittedAt: doc.createdAt.toISOString() });
  })
);

/** Public aggregate only — names and phone numbers are never exposed. */
app.get(
  '/api/rsvps/summary',
  asyncRoute(async (_req, res) => {
    const [summary] = await rsvps
      .aggregate<{ responses: number; attendingGuests: number }>([
        {
          $group: {
            _id: null,
            responses: { $sum: 1 },
            attendingGuests: {
              $sum: { $cond: [{ $eq: ['$attending', 'yes'] }, '$guestCount', 0] },
            },
          },
        },
      ])
      .toArray();
    res.json({
      responses: summary?.responses ?? 0,
      attendingGuests: summary?.attendingGuests ?? 0,
    });
  })
);

app.use((_req, _res, next) => next(new HttpError(404, 'Not found')));

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Máy chủ đang bận, vui lòng thử lại sau.' });
});

async function start() {
  await client.connect();
  const db = client.db(DB_NAME);
  wishes = db.collection<WishDoc>('wishes');
  rsvps = db.collection<RsvpDoc>('rsvps');
  settings = db.collection<SettingsDoc>('settings');
  await Promise.all([
    wishes.createIndex({ createdAt: -1 }),
    rsvps.createIndex({ createdAt: -1 }),
  ]);
  app.listen(PORT, () => {
    console.log(`Wedding API ready on :${PORT} (db: ${DB_NAME})`);
  });
}

start().catch((err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    client.close().finally(() => process.exit(0));
  });
}
