import { RsvpSubmission, WeddingConfig, WishEntry } from '../types/wedding';

/**
 * API base URL.
 * - Dev: '' → same origin, Vite proxies /api to the local Express server.
 * - Production: set VITE_API_URL at build time (e.g. https://wedding-api.example.com).
 *   When unset in production the API is disabled and the app falls back to localStorage.
 */
const configured = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE: string | null =
  configured !== undefined && configured !== ''
    ? configured.replace(/\/+$/, '')
    : import.meta.env.DEV
      ? ''
      : null;

export const isApiConfigured = API_BASE !== null;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (API_BASE === null) throw new ApiError(0, 'API chưa được cấu hình');
  const controller = new AbortController();
  // Free API hosts sleep when idle and need ~30–50s to wake on the first request
  const timeout = window.setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      // Never answer from the browser's HTTP cache — always ask the server
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(
        res.status,
        (body as { error?: string }).error || 'Không gửi được, vui lòng thử lại.'
      );
    }
    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'Không kết nối được máy chủ, vui lòng kiểm tra mạng và thử lại.');
  } finally {
    window.clearTimeout(timeout);
  }
}

interface WishDto {
  id: string;
  author: string;
  relation: string;
  message: string;
  hearts: number;
  createdAt: string;
}

const relativeFormatter = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });

/** "Vừa xong", "5 phút trước", "2 ngày trước"... */
export function formatRelativeTime(iso: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return iso;
  const seconds = Math.round((time - Date.now()) / 1000);
  if (Math.abs(seconds) < 60) return 'Vừa xong';
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2592000],
    ['year', 31536000],
  ];
  let chosen: [Intl.RelativeTimeFormatUnit, number] = units[0];
  for (const unit of units) {
    if (Math.abs(seconds) >= unit[1]) chosen = unit;
  }
  return relativeFormatter.format(Math.round(seconds / chosen[1]), chosen[0]);
}

const toWishEntry = (dto: WishDto): WishEntry => ({
  id: dto.id,
  author: dto.author,
  relation: dto.relation,
  message: dto.message,
  hearts: dto.hearts,
  createdAt: formatRelativeTime(dto.createdAt),
});

export async function fetchWishes(): Promise<WishEntry[]> {
  const list = await request<WishDto[]>('/api/wishes');
  return list.map(toWishEntry);
}

export async function createWish(
  wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>
): Promise<WishEntry> {
  const dto = await request<WishDto>('/api/wishes', {
    method: 'POST',
    body: JSON.stringify(wish),
  });
  return toWishEntry(dto);
}

export async function heartWish(id: string): Promise<number> {
  const res = await request<{ hearts: number }>(
    `/api/wishes/${encodeURIComponent(id)}/heart`,
    { method: 'POST' }
  );
  return res.hearts;
}

export async function createRsvp(
  rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>
): Promise<{ id: string; submittedAt: string }> {
  return request('/api/rsvps', { method: 'POST', body: JSON.stringify(rsvp) });
}

export async function fetchRsvpSummary(): Promise<{ responses: number; attendingGuests: number }> {
  return request('/api/rsvps/summary');
}

/** Invitation content (couple, families, schedule, story, gallery, bank accounts). */
export async function fetchConfig(): Promise<WeddingConfig> {
  const res = await request<{ config: WeddingConfig }>('/api/config');
  return res.config;
}

export async function saveConfig(config: WeddingConfig, passcode: string): Promise<void> {
  await request('/api/config', {
    method: 'PUT',
    headers: { 'X-Admin-Passcode': passcode },
    body: JSON.stringify({ config }),
  });
}

/** Resolves when the passcode is accepted by the server; rejects otherwise. */
export async function verifyAdminPasscode(passcode: string): Promise<void> {
  await request('/api/admin/verify', {
    method: 'POST',
    headers: { 'X-Admin-Passcode': passcode },
  });
}
