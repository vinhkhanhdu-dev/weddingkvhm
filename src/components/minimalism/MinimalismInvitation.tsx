/**
 * "Minimalism – Đỏ Đậm" invitation layout, rebuilt from the Chung Đôi template
 * (used with the couple's permission) and filled with this couple's WeddingConfig.
 *
 * Decorative artwork is loaded from /assets/themes/minimalism-dark-red/*.webp.
 * Every image falls back gracefully (CSS shapes or nothing) when a file is missing.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CeremonyTab, RsvpSubmission, WeddingConfig, WishEntry } from '../../types/wedding';
import { resolveAssetUrl } from '../ResilientImage';
import { getVietQrUrl } from '../RsvpAndWishes';

// ---------- Design tokens (taken from the template) ----------
const C = {
  primary: '#511419',
  primaryDeep: '#590310',
  cream: '#ECE4D8',
  creamSoft: 'rgba(236, 228, 216, 0.7)',
  page: '#FFF7EB',
  gold: '#C9A24A',
  goldDeep: '#B58B2F',
};
const F = {
  title: '"Viaoda Libre", "The Nautigal", serif',
  tnr: '"Times New Roman", serif',
  bask: 'Baskerville, "Times New Roman", serif',
  corm: '"Cormorant Garamond", "Times New Roman", serif',
  nautigal: '"The Nautigal", cursive',
  madi: '"Ms Madi", cursive',
  uchen: 'Uchen, Baskerville, serif',
  lora: '"Lora", "Times New Roman", serif',
};
const asset = (name: string) => resolveAssetUrl(`/assets/themes/minimalism-dark-red/${name}.webp`);

/** Colours a shared widget (album dots, calendar, modals) is drawn with. */
export interface KitPalette {
  primary: string;
  onPrimary: string;
  page: string;
}
const DEFAULT_PALETTE: KitPalette = { primary: C.primary, onPrimary: C.cream, page: C.page };

// ---------- Helpers ----------

/** Decorative image that removes itself when the file is missing. */
const Deco: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { name: string }> = ({
  name,
  className = '',
  ...rest
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      alt=""
      aria-hidden="true"
      src={asset(name)}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
};

function useImageAvailable(name: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = asset(name);
  }, [name]);
  return ok;
}

const pad = (n: number) => String(n).padStart(2, '0');

export interface DateInfo {
  date: Date;
  day: number;
  month: number;
  year: number;
  weekday: string; // "CHỦ NHẬT"
  longVi: string; // "29 tháng 11, 2026"
}

export function getDateInfo(iso: string): DateInfo | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);
  const pick = (t: string) => parts.find((p) => p.type === t)?.value || '';
  const day = Number(pick('day'));
  const month = Number(pick('month'));
  const year = Number(pick('year'));
  return {
    date,
    day,
    month,
    year,
    weekday: pick('weekday').toUpperCase(),
    longVi: `${day} tháng ${month}, ${year}`,
  };
}

export const firstTime = (text?: string) => text?.match(/\d{1,2}:\d{2}/)?.[0] || '';

/** "Nhằm ngày 21 tháng 10 năm Bính Ngọ" → "(Tức ngày 21 tháng 10 năm Bính Ngọ)" */
export const lunarLine = (lunar: string) =>
  lunar ? `(${lunar.replace(/^\s*(nhằm|tức)\s+/i, 'Tức ')})` : '';

export function googleCalendarUrl(title: string, startIso: string, location: string, details: string) {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return '';
  const end = new Date(start.getTime() + 2 * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    ctz: 'Asia/Ho_Chi_Minh',
    details,
    location,
  });
  return `https://www.google.com/calendar/render?${q.toString()}`;
}

/** Same calendar day as the wedding, at a different "HH:MM" (Vietnam time). */
export function isoAt(info: DateInfo | null, hhmm: string): string {
  if (!info || !hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  return `${info.year}-${pad(info.month)}-${pad(info.day)}T${pad(h)}:${pad(m)}:00+07:00`;
}

export const HeartPath = (
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
);

/** Floating flower spray, as used throughout the template. */
const Flower: React.FC<{
  className: string;
  duration: number;
  delay: number;
  imgClass?: string;
}> = ({ className, duration, delay, imgClass = '' }) => (
  <span aria-hidden="true" className={`pointer-events-none absolute block ${className}`}>
    <span
      className="block"
      style={{ animation: `drFloat ${duration}s ease-in-out ${delay}s infinite` }}
    >
      <Deco
        name="flower2-decoration"
        className={`block w-full max-w-none object-contain drop-shadow-[3px_4px_3px_rgba(0,0,0,0.3)] ${imgClass}`}
      />
    </span>
  </span>
);

const Castle: React.FC<{ className: string }> = ({ className }) => (
  <Deco
    name="castle-background"
    className={`pointer-events-none absolute max-w-none object-contain opacity-[0.1] left-1/2 -translate-x-1/2 ${className}`}
  />
);

const SectionTitle: React.FC<{ children: React.ReactNode; light?: boolean; className?: string }> = ({
  children,
  light,
  className = '',
}) => (
  <h2
    className={`uppercase text-center relative z-10 text-[20px] ${className}`}
    style={{
      color: light ? C.cream : C.primary,
      fontFamily: F.tnr,
      fontWeight: 700,
      letterSpacing: '0.03em',
    }}
  >
    {children}
  </h2>
);

/** Burgundy paper card used for the info blocks. */
const PaperCard: React.FC<{ radius: number; className?: string; children: React.ReactNode }> = ({
  radius,
  className = '',
  children,
}) => (
  <div
    className={`relative overflow-hidden text-center shadow-[4px_4px_10px_rgba(0,0,0,0.25)] ${className}`}
    style={{ borderRadius: radius }}
  >
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: C.primary, borderRadius: radius }} />
    <Deco
      name="paper"
      className="pointer-events-none absolute inset-0 size-full max-w-none object-cover mix-blend-multiply opacity-40"
      style={{ borderRadius: radius }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

const BigDate: React.FC<{ info: DateInfo; time: string; small?: boolean }> = ({ info, time, small }) => (
  <>
    <div
      className={`flex w-full ${small ? 'max-w-[130px]' : 'max-w-[180px]'} items-center justify-between text-[13px] uppercase whitespace-nowrap min-w-max gap-x-3`}
      style={{ color: C.creamSoft, fontFamily: F.bask }}
    >
      <span>{small ? time : `VÀO LÚC ${time}`}</span>
      <span>{info.weekday}</span>
    </div>
    <div className="flex items-center justify-center gap-4" style={{ color: C.cream, fontFamily: F.tnr }}>
      <span className="text-[40px] leading-none">{pad(info.day)}</span>
      <div className="h-[46px] w-px" style={{ backgroundColor: 'rgba(236, 228, 216, 0.45)' }} />
      <div className="flex flex-col items-start justify-center gap-1 text-left">
        <span className={`${small ? 'text-[12px]' : 'text-[14px]'} uppercase`}>THÁNG {pad(info.month)}</span>
        <span className={small ? 'text-[18px]' : 'text-[14px]'}>{info.year}</span>
      </div>
    </div>
  </>
);

// ---------- Intro overlay ----------

const HEART_COLORS = ['#a8323b', '#ece4d8', '#c9a24a', '#7a1f26'];

const IntroOverlay: React.FC<{
  config: WeddingConfig;
  dateInfo: DateInfo | null;
  onOpen: () => void;
}> = ({ config, dateInfo, onOpen }) => {
  const [leaving, setLeaving] = useState(false);
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: Math.random() * 95,
        color: HEART_COLORS[i % HEART_COLORS.length],
        size: 12 + Math.random() * 11,
        sway: (Math.random() - 0.5) * 60,
        duration: 18 + Math.random() * 8,
        delay: -Math.random() * 24,
      })),
    []
  );

  const handleOpen = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onOpen, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #6e1a20, #511419, #380a0e)',
        animation: leaving ? 'mdrEnvelopeAway 0.9s ease-in forwards' : undefined,
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {hearts.map((h, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${h.left}%`,
              top: -30,
              color: h.color,
              fontSize: h.size,
              ['--sway' as string]: `${h.sway}px`,
              animation: `mdrAmbientFall ${h.duration}s ease-in-out ${h.delay}s infinite`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              {HeartPath}
            </svg>
          </div>
        ))}
      </div>

      <div className="relative" style={{ zIndex: 10 }}>
        <div className="relative w-[310px] sm:w-[340px] md:w-[520px]">
          {/* Wax seal */}
          <div
            className="absolute left-1/2 rounded-full flex items-center justify-center"
            style={{
              top: 50,
              width: 56,
              height: 56,
              background: 'radial-gradient(circle at 30% 30%, #511419, rgb(51, 0, 0))',
              ['--shadow-color' as string]: 'rgba(81, 20, 25, 0.5)',
              boxShadow: '0 4px 20px rgba(81, 20, 25, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              zIndex: 30,
              animation: leaving
                ? 'mdrSealBreak 0.6s ease-out forwards'
                : 'mdrSealPulse 2s ease-in-out infinite',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ fill: '#f3e8de' }}>
              {HeartPath}
            </svg>
          </div>

          <div
            className="relative rounded-lg"
            style={{
              boxShadow:
                '0 25px 60px -12px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2), 0 0 40px rgba(81,20,25,0.15)',
            }}
          >
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                background: 'rgba(255, 250, 243, 0.96)',
                border: '1px solid rgba(81, 20, 25, 0.15)',
              }}
            >
              <Deco
                name="flower2-decoration"
                className="absolute pointer-events-none h-36 w-auto max-w-none top-[-5%] left-[-10px] -translate-x-[6%] opacity-80 rotate-[25deg]"
              />
              <Deco
                name="flower2-decoration"
                className="absolute pointer-events-none h-36 w-auto max-w-none bottom-[-5%] right-[-10px] translate-x-[6%] -scale-x-100 opacity-80 -rotate-[25deg]"
              />
            </div>

            <div className="relative z-10 text-center px-6 pt-28 pb-14 md:pt-24 md:pb-10">
              <h1
                className="mb-2 flex flex-col items-center leading-tight text-3xl sm:text-4xl"
                style={{ color: C.primary, fontFamily: F.title }}
              >
                <span className="block w-full text-center">{config.brideName}</span>
                <span className="block w-full text-center text-lg leading-none sm:text-xl" style={{ fontFamily: F.bask }}>
                  &amp;
                </span>
                <span className="block w-full text-center">{config.groomName}</span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.primary})` }} />
                <span className="text-sm" style={{ color: C.primary, opacity: 0.7 }}>
                  ❦
                </span>
                <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.primary})` }} />
              </div>
              <div className="text-[18px] mb-5" style={{ color: 'rgba(81, 20, 25, 0.72)', fontFamily: F.lora }}>
                {dateInfo?.longVi || config.displayDate}
              </div>
              <p className="text-[18px] font-light mb-8" style={{ color: 'rgba(81, 20, 25, 0.72)', fontFamily: F.lora }}>
                Thân Mời
              </p>
              <button
                type="button"
                onClick={handleOpen}
                className="relative px-8 py-2.5 text-lg font-semibold rounded-full shadow-lg cursor-pointer flex w-fit items-center justify-center mx-auto overflow-hidden"
                style={{
                  backgroundColor: C.primary,
                  color: '#f3e8de',
                  boxShadow: '0 4px 14px rgba(81, 20, 25, 0.35)',
                  fontFamily: F.lora,
                }}
              >
                <span>Mở thiệp</span>
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-full w-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'mdrShine 3s ease-in-out infinite',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Album (3D coverflow) ----------

const COVERFLOW: Record<number, { x: number; z: number; ry: number; s: number; o: number }> = {
  0: { x: 0, z: 0, ry: 0, s: 1, o: 1 },
  1: { x: 60, z: -150, ry: 45, s: 0.85, o: 0.75 },
  2: { x: 120, z: -300, ry: 90, s: 0.7, o: 0.5 },
  3: { x: 180, z: -450, ry: 135, s: 0.7, o: 0.3 },
};

export const Album: React.FC<{
  photos: WeddingConfig['gallery'];
  onOpen: (i: number) => void;
  color?: string;
  /** 'dots' (default) or a "3 / 9" counter, as some templates use */
  indicator?: 'dots' | 'counter';
}> = ({ photos, onOpen, color = C.primary, indicator = 'dots' }) => {
  const n = photos.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => window.clearInterval(t);
  }, [paused, n]);

  if (!n) return null;
  const go = (i: number) => {
    setPaused(true);
    setActive(((i % n) + n) % n);
  };

  return (
    <div className="relative z-10 mt-5 w-full max-w-[380px] md:max-w-[600px]">
      <div
        className="relative h-[340px] md:h-[520px] touch-pan-y"
        onPointerDown={(e) => (dragX.current = e.clientX)}
        onPointerUp={(e) => {
          if (dragX.current === null) return;
          const dx = e.clientX - dragX.current;
          dragX.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: 1000 }}>
          {photos.map((p, i) => {
            let d = i - active;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const cfg = COVERFLOW[Math.abs(d)];
            const sign = Math.sign(d);
            const visible = Boolean(cfg);
            const c = cfg || COVERFLOW[3];
            return (
              <button
                type="button"
                key={p.id}
                aria-label={d === 0 ? `Xem ảnh ${p.caption}` : `Chuyển tới ảnh ${p.caption}`}
                onClick={() => (d === 0 ? onOpen(i) : go(i))}
                className={`absolute h-[92%] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all ease-in-out ${
                  d === 0 ? 'ring-2 ring-white/30' : ''
                }`}
                style={{
                  aspectRatio: '2 / 3',
                  transitionDuration: '1100ms',
                  transform: `translateX(${sign * c.x}%) translateZ(${c.z}px) rotateY(${sign * c.ry}deg) scale(${c.s})`,
                  opacity: visible ? c.o : 0,
                  zIndex: 100 - Math.abs(d),
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <img src={resolveAssetUrl(p.src)} alt={p.caption} className="h-full w-full object-cover" draggable={false} />
              </button>
            );
          })}
        </div>
      </div>
      {indicator === 'counter' ? (
        <div className="flex justify-center mt-3 text-sm tabular-nums opacity-60" style={{ color }}>
          {active + 1} / {n}
        </div>
      ) : (
      <div className="flex justify-center gap-1.5 mt-3" style={{ color }}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Tới ảnh ${i + 1}`}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 h-2 bg-current ${
              i === active ? 'w-6 opacity-70' : 'w-2 opacity-25 hover:opacity-40'
            }`}
          />
        ))}
      </div>
      )}
    </div>
  );
};

export const Lightbox: React.FC<{
  photos: WeddingConfig['gallery'];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  accent?: string;
}> = ({ photos, index, onClose, onIndex, accent = C.primary }) => {
  const n = photos.length;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % n);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, n, onClose, onIndex]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 flex flex-col items-center px-2 pt-10 pb-4" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} aria-label="Đóng" className="absolute right-3 top-2 w-9 h-9 text-white text-2xl">
        ✕
      </button>
      <div className="absolute top-2 left-3 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
        {index + 1} / {n}
      </div>
      <div className="relative flex flex-1 w-full max-w-5xl items-center justify-center px-10 min-h-0" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Ảnh trước" onClick={() => onIndex((index - 1 + n) % n)} className="absolute left-0 text-white text-4xl px-2">
          ‹
        </button>
        <img src={resolveAssetUrl(photos[index].src)} alt={photos[index].caption} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl select-none" />
        <button type="button" aria-label="Ảnh sau" onClick={() => onIndex((index + 1) % n)} className="absolute right-0 text-white text-4xl px-2">
          ›
        </button>
      </div>
      <div className="flex-shrink-0 flex gap-2 overflow-x-auto px-2 py-2 mt-3 bg-black/30 rounded-lg max-w-[90vw] no-scrollbar" onClick={(e) => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            className={`flex-shrink-0 h-12 w-12 rounded-md overflow-hidden transition-all ${i === index ? 'scale-105' : 'opacity-60'}`}
            style={i === index ? { outline: `2px solid ${accent}`, outlineOffset: 2 } : undefined}
          >
            <img src={resolveAssetUrl(p.src)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------- Month calendar ----------

export const MonthCalendar: React.FC<{
  info: DateInfo;
  /** 'cream': template's cream card + script header; 'plain': bordered, bold header */
  variant?: 'cream' | 'plain';
  color?: string;
}> = ({ info, variant = 'cream', color = C.primary }) => {
  const plain = variant === 'plain';
  const first = new Date(info.year, info.month - 1, 1);
  const daysInMonth = new Date(info.year, info.month, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const cells: Array<number | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div
      className={plain ? 'mt-2 mx-auto w-[296px] max-w-full' : 'mt-3 mx-auto w-fit max-w-full overflow-hidden rounded-[10px] px-4 pb-4 pt-2'}
      style={plain ? undefined : { backgroundColor: C.cream }}
    >
      <div
        className={`${plain ? 'w-full border' : 'w-[280px]'} mx-auto rounded-lg overflow-hidden`}
        style={{ color, borderColor: `color-mix(in srgb, ${color} 27%, transparent)` }}
      >
        <div
          className={`text-center py-2.5 border-b ${plain ? 'text-[13px] font-semibold tracking-wide' : ''}`}
          style={{
            borderColor: `color-mix(in srgb, ${color} 27%, transparent)`,
            ...(plain ? {} : { fontFamily: F.nautigal, fontSize: 25 }),
          }}
        >
          Tháng {info.month} / {info.year}
        </div>
        <div className="grid grid-cols-7 border-b-2" style={{ borderColor: color }}>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
            <div key={d} className="text-center py-1.5 text-[10px] font-medium opacity-60">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5 px-1 py-2">
          {cells.map((d, i) => (
            <div key={i} className="flex items-center justify-center h-[30px]">
              {d === info.day ? (
                <div className="relative w-[26px] h-[24px] flex items-center justify-center">
                  <svg viewBox="0 0 24 22" className="absolute inset-0 w-full h-full drop-shadow-sm" fill={color}>
                    <path d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z" />
                  </svg>
                  <span className="relative z-10 text-[11px] font-bold text-white">{d}</span>
                </div>
              ) : d ? (
                <span className="text-[12px]">{d}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- Modals ----------

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  palette: KitPalette;
}> = ({ title, onClose, children, palette }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ backgroundColor: palette.page, animation: 'mdrSlideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 pt-6 pb-4 text-center" style={{ backgroundColor: palette.primary }}>
          <button type="button" onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/20">
            ✕
          </button>
          <h2 className="uppercase text-[20px] text-white" style={{ fontFamily: F.tnr, fontWeight: 700, letterSpacing: '0.03em', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            {title}
          </h2>
        </div>
        <div className="p-5 sm:p-6" style={{ color: palette.primary, fontFamily: F.tnr }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const fieldStyle = (color: string): React.CSSProperties => ({
  borderColor: color,
  color,
  backgroundColor: 'transparent',
});
const inputStyle = fieldStyle(C.primary);

export const RsvpModal: React.FC<{
  config: WeddingConfig;
  onClose: () => void;
  onSubmit: (r: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  palette?: KitPalette;
}> = ({ config, onClose, onSubmit, palette = DEFAULT_PALETTE }) => {
  const inputStyle = fieldStyle(palette.primary);
  const solid = { backgroundColor: palette.primary, color: palette.onPrimary };
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [count, setCount] = useState(1);
  const [choice, setChoice] = useState(config.ceremonies[0]?.label || '');
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || state === 'sending') return;
    setState('sending');
    setError('');
    try {
      await onSubmit({
        fullName: name.trim(),
        phone: phone.trim(),
        attending,
        ceremonyChoice: choice,
        guestCount: attending === 'yes' ? count : 0,
        dietaryNote: note.trim(),
      });
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được, vui lòng thử lại.');
      setState('idle');
    }
  };

  return (
    <Modal title="Xác Nhận Tham Dự" onClose={onClose} palette={palette}>
      {state === 'done' ? (
        <div className="text-center py-6">
          <p className="text-2xl" style={{ fontFamily: F.title }}>
            Cảm ơn {name}!
          </p>
          <p className="mt-2 text-sm opacity-80">
            {attending === 'yes'
              ? 'Gia đình đã ghi nhận xác nhận của bạn. Hẹn gặp bạn trong ngày vui!'
              : 'Cảm ơn bạn đã báo tin. Rất tiếc vì bạn không thể tham dự.'}
          </p>
          <button type="button" onClick={onClose} className="mt-5 rounded-full px-6 py-2 text-sm" style={solid}>
            Đóng
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 text-sm">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên*" className="w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none" style={inputStyle} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" type="tel" className="w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none" style={inputStyle} />
          <div className="grid grid-cols-2 gap-2">
            {(['yes', 'no'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAttending(v)}
                className="rounded-full border py-2.5"
                style={attending === v ? { ...solid, borderColor: palette.primary } : inputStyle}
              >
                {v === 'yes' ? 'Sẽ tham dự' : 'Không thể tham dự'}
              </button>
            ))}
          </div>
          {attending === 'yes' && (
            <>
              <select value={choice} onChange={(e) => setChoice(e.target.value)} className="w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none" style={inputStyle}>
                {config.ceremonies.map((c) => (
                  <option key={c.id} value={c.label}>
                    {c.label} ({c.timeRange})
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between rounded-lg border px-2 py-1" style={inputStyle}>
                <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="w-10 h-10 text-xl" aria-label="Giảm số khách">
                  −
                </button>
                <span>{count} người</span>
                <button type="button" onClick={() => setCount((c) => Math.min(10, c + 1))} className="w-10 h-10 text-xl" aria-label="Tăng số khách">
                  +
                </button>
              </div>
            </>
          )}
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (nếu có)" className="w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none" style={inputStyle} />
          {error && <p className="text-sm" role="alert">{error}</p>}
          <button type="submit" disabled={state === 'sending'} className="w-full rounded-full py-3 font-semibold disabled:opacity-60" style={solid}>
            {state === 'sending' ? 'ĐANG GỬI…' : 'GỬI XÁC NHẬN'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export const GiftModal: React.FC<{
  config: WeddingConfig;
  onClose: () => void;
  palette?: KitPalette;
}> = ({ config, onClose, palette = DEFAULT_PALETTE }) => {
  const tint = `color-mix(in srgb, ${palette.primary} 9%, transparent)`;
  const [copied, setCopied] = useState('');
  return (
    <Modal title="Hộp Quà Mừng" onClose={onClose} palette={palette}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        {config.bankAccounts.map((acc) => {
          const qr = acc.qrImage || getVietQrUrl(acc.bankName, acc.accountNumber, acc.ownerName);
          return (
            <div key={acc.role} className="flex flex-col items-center flex-1 max-w-[200px]">
              <h3 className="mb-2 text-xs min-h-[2rem] font-medium text-center">
                {acc.role} - {acc.ownerName}
              </h3>
              <div className="w-36 h-36 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center" style={{ border: `2px solid color-mix(in srgb, ${palette.primary} 13%, transparent)` }}>
                {qr ? (
                  <img src={qr} alt={`QR ${acc.role}`} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[11px] text-center opacity-60 px-2">Chưa có mã QR</span>
                )}
              </div>
              <div className="mt-2 text-center space-y-0.5">
                <p className="text-[11px]">{acc.bankName}</p>
                <p className="text-[12px] font-mono">{acc.accountNumber}</p>
                <p className="text-[11px] font-semibold">{acc.ownerName}</p>
                <div className="flex gap-1.5 justify-center mt-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(acc.accountNumber.replace(/\s+/g, ''));
                        setCopied(acc.accountNumber);
                        window.setTimeout(() => setCopied(''), 2000);
                      } catch {
                        // Ignore
                      }
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: tint }}
                  >
                    {copied === acc.accountNumber ? 'Đã chép' : 'Chép STK'}
                  </button>
                  {qr && (
                    <a href={qr} download={`QR-${acc.bankName}.png`} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: tint }}>
                      Lưu QR
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

// ---------- Page ----------

interface Props {
  config: WeddingConfig;
  wishes: WishEntry[];
  onAddWish: (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => Promise<void>;
  onSubmitRsvp: (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  showIntro: boolean;
  onIntroDone: () => void;
}

export const MinimalismInvitation: React.FC<Props> = ({
  config,
  wishes,
  onAddWish,
  onSubmitRsvp,
  showIntro,
  onIntroDone,
}) => {
  const dateInfo = useMemo(() => getDateInfo(config.weddingDateISO), [config.weddingDateISO]);
  const ceremony: CeremonyTab | undefined = config.ceremonies[0];
  const reception: CeremonyTab | undefined =
    config.ceremonies.find((c) => c.id === 'tiec-cuoi') || config.ceremonies[1];
  const ceremonyTime = firstTime(ceremony?.timeRange) || firstTime(ceremony?.events[0]?.time);
  const receptionTime = firstTime(reception?.timeRange) || firstTime(reception?.events[0]?.time);
  const lunar = lunarLine(ceremony?.lunarDate || config.lunarDisplayDate);
  const mapPlace = reception || ceremony;

  const envelopeArt = useImageAvailable('envelope-background');
  const giftArt = useImageAvailable('gift-envelope');

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  // Guestbook
  const [wName, setWName] = useState('');
  const [wMsg, setWMsg] = useState('');
  const [wState, setWState] = useState<'idle' | 'sending'>('idle');
  const [wError, setWError] = useState('');

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim() || !wMsg.trim() || wState === 'sending') return;
    setWState('sending');
    setWError('');
    try {
      await onAddWish({ author: wName.trim(), relation: 'Khách mời', message: wMsg.trim() });
      setWName('');
      setWMsg('');
    } catch (err) {
      setWError(err instanceof Error ? err.message : 'Không gửi được, vui lòng thử lại.');
    } finally {
      setWState('idle');
    }
  };

  const schedule = [...(ceremony?.events || []), ...(reception?.events || [])].filter((e) => firstTime(e.time));
  const scheduleIcons = ['', 'camera', 'cake', 'cook'];

  const coupleTitle = `Đám cưới ${config.groomFullName} & ${config.brideFullName}`;
  const calendarUrl = googleCalendarUrl(
    coupleTitle,
    isoAt(dateInfo, receptionTime) || config.weddingDateISO,
    mapPlace?.address || '',
    `${reception?.label || 'Tiệc cưới'} của ${config.groomFullName} & ${config.brideFullName}`
  );
  const mapQuery = mapPlace?.mapQuery || mapPlace?.address || '';
  const directionsUrl =
    mapPlace?.mapUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

  const family = [
    {
      key: 'groom',
      father: config.groomParents.father,
      mother: config.groomParents.mother,
      address: config.groomParents.address,
    },
    {
      key: 'bride',
      father: config.brideParents.father,
      mother: config.brideParents.mother,
      address: config.brideParents.address,
    },
  ];

  return (
    <>
      {showIntro && <IntroOverlay config={config} dateInfo={dateInfo} onOpen={onIntroDone} />}

      <main className="min-h-screen w-full">
        <div className="flex w-full justify-center overflow-x-clip bg-white">
          <div
            className="relative w-full max-w-[480px] md:max-w-[900px] md:mx-auto overflow-hidden md:border md:border-[#51141922] isolate"
            style={{ backgroundColor: C.page, color: C.primary }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: `url("${asset('paper')}")`,
                backgroundSize: '100% auto',
                backgroundPosition: 'center top',
                mixBlendMode: 'multiply',
                opacity: 0.5,
              }}
            />

            {/* ---------- Save the date ---------- */}
            <header className="relative z-10 flex flex-col items-center overflow-x-clip px-9 pt-15 pb-14 text-center">
              <Castle className="top-[26%] w-[170%]" />
              <p
                className="relative z-10 text-[15px] uppercase md:text-[18px]"
                style={{ fontFamily: F.corm, color: C.primaryDeep, letterSpacing: '0.16em', fontWeight: 600 }}
              >
                Save The Date
              </p>
              <div className="relative z-10 mt-24 w-[82%] max-w-[330px] md:mt-28 md:max-w-[420px]">
                <div className="relative aspect-[333/384]">
                  {envelopeArt ? (
                    <Deco name="envelope-background" className="pointer-events-none absolute inset-0 z-10 w-full max-w-none" />
                  ) : (
                    // CSS stand-in for the envelope back while the artwork is missing
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 top-[22%] z-10 rounded-[6px]"
                      style={{ background: 'linear-gradient(180deg,#5a161d,#4a1016)' }}
                    />
                  )}
                  <div className="absolute left-[33%] top-[-2%] z-20 w-[64%]" style={{ animation: 'drFloat 6.5s ease-in-out 0.4s infinite' }}>
                    <div className="aspect-[221/309] rotate-[12deg] border-[7px] border-white bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
                      <img src={resolveAssetUrl(config.heroImage)} alt={`${config.brideName} & ${config.groomName}`} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <Flower className="-left-[2%] -top-[12%] z-[25] w-[42%]" duration={5} delay={0} imgClass="rotate-[-17deg]" />
                  {envelopeArt ? (
                    <Deco name="envelope-cover" className="pointer-events-none absolute bottom-0 left-0 z-30 w-full max-w-none" />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[45%] z-30">
                      <div
                        className="absolute inset-0 rounded-b-[6px]"
                        style={{
                          background: 'linear-gradient(180deg,#6a1a22,#511419)',
                          clipPath: 'polygon(0 0, 50% 42%, 100% 0, 100% 100%, 0 100%)',
                          filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.3))',
                        }}
                      />
                      <span
                        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle at 35% 30%, #F3DB9A, #D4AE62 55%, #A9812F)',
                          boxShadow: 'inset 0 0 0 3px rgba(138,100,32,0.35), 0 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#8A6420' }}>
                          {HeartPath}
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative z-10 mt-16 flex flex-col items-center gap-[22px] md:mt-20">
                <p className="text-[clamp(38px,11vw,46px)] leading-none md:text-[58px]" style={{ fontFamily: F.title }}>
                  {config.brideName}
                </p>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[37%] -translate-y-1/2 text-[92px] leading-none md:text-[120px]"
                  style={{ fontFamily: F.nautigal, color: 'rgba(81, 20, 25, 0.15)' }}
                >
                  &amp;
                </span>
                <p className="text-[clamp(38px,11vw,46px)] leading-none md:text-[58px]" style={{ fontFamily: F.title }}>
                  {config.groomName}
                </p>
              </div>
            </header>

            {/* ---------- Thông tin lễ cưới ---------- */}
            <section className="relative z-10 mx-auto w-[88%] max-w-[420px] md:max-w-[560px]">
              <Flower className="-right-[22%] bottom-[30%] z-20 w-[40%]" duration={5.5} delay={0.6} />
              <PaperCard radius={13} className="px-5 pb-10 pt-9">
                <div className="flex flex-col items-center gap-6">
                  <SectionTitle light>Thông tin lễ cưới</SectionTitle>
                  <div className="relative grid grid-cols-[1fr_auto_1fr] justify-center gap-x-8 text-center" style={{ color: C.cream, fontFamily: F.bask }}>
                    {family.map((f, idx) => (
                      <React.Fragment key={f.key}>
                        {idx === 1 && <div className="h-[50px] w-px self-center" style={{ backgroundColor: 'rgba(236,228,216,0.4)' }} />}
                        <div className="flex min-w-0 flex-col items-center gap-[3px]">
                          <span className="text-[12px]" style={{ color: C.creamSoft }}>
                            {f.father && f.mother ? 'Ông Bà' : f.father ? 'Ông' : 'Bà'}
                          </span>
                          {[f.father, f.mother]
                            .filter(Boolean)
                            .map((n) => (
                              <span key={n} className="text-[12px] font-semibold [overflow-wrap:anywhere]">
                                {n.replace(/^(Ông|Bà)\s+/i, '')}
                              </span>
                            ))}
                          <span className="mt-1 text-[10px] leading-tight [overflow-wrap:anywhere]" style={{ color: C.creamSoft }}>
                            {f.address}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-[16px] md:text-[20px] whitespace-pre-line" style={{ fontFamily: F.bask, color: C.cream }}>
                    {'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI'}
                  </div>
                  <div className="w-full flex flex-col items-center gap-3">
                    {[
                      { name: config.groomFullName, rank: config.groomRank || 'Trưởng Nam' },
                      { name: config.brideFullName, rank: config.brideRank || 'Út Nữ' },
                    ].map((p, i) => (
                      <React.Fragment key={p.name}>
                        {i === 1 && (
                          <div className="text-[35px]" style={{ color: C.cream, fontFamily: F.madi }}>
                            &amp;
                          </div>
                        )}
                        <h3
                          className="w-[92%] min-h-[64px] flex items-center justify-center leading-[52px] whitespace-nowrap text-[clamp(26px,8.4vw,32px)]"
                          style={{ fontFamily: F.title, color: C.cream }}
                        >
                          {p.name}
                        </h3>
                        <div className="text-[10px] uppercase" style={{ color: C.creamSoft, fontFamily: F.uchen, letterSpacing: '0.14em' }}>
                          {p.rank}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {dateInfo && (
                    <div className="flex flex-col items-center gap-4" style={{ fontFamily: F.bask }}>
                      <span className="whitespace-pre-line text-[16px]" style={{ color: C.creamSoft }}>
                        {`LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI\n${(ceremony?.venueName || 'TƯ GIA').split('—')[0].trim().toUpperCase()}`}
                      </span>
                      <BigDate info={dateInfo} time={ceremonyTime} />
                      <div className="text-xs uppercase tracking-[0.12em]" style={{ color: C.creamSoft }}>
                        {lunar}
                      </div>
                    </div>
                  )}
                </div>
              </PaperCard>
            </section>

            {/* ---------- Album ---------- */}
            <div className="relative z-10 overflow-x-clip">
              <Castle className="top-[-6%] w-[150%]" />
              <div className="relative z-10 flex flex-col items-center px-6 pb-10 pt-10">
                <SectionTitle>Album Ảnh</SectionTitle>
                <Album photos={config.gallery} onOpen={setLightbox} />
              </div>
            </div>

            {/* ---------- Thông tin tiệc cưới ---------- */}
            {reception && dateInfo && (
              <section className="relative z-10 mx-auto mb-4 w-[88%] max-w-[420px] md:max-w-[560px]">
                <Flower className="-left-[18%] top-[10%] z-20 w-[24%]" duration={6} delay={0.3} />
                <PaperCard radius={10} className="px-5 py-9">
                  <div className="flex flex-col items-center gap-6">
                    <SectionTitle light>Thông tin tiệc cưới</SectionTitle>
                    <div className="flex flex-col items-center gap-4" style={{ fontFamily: F.bask, color: C.cream }}>
                      <h3 className="uppercase text-[16px]">Tiệc cưới sẽ diễn ra vào lúc:</h3>
                      <BigDate info={dateInfo} time={receptionTime} small />
                      <div className="text-xs uppercase tracking-[0.12em]" style={{ color: C.creamSoft }}>
                        {lunar}
                      </div>
                      {reception.events.length > 1 && (
                        <div className="flex items-start justify-center gap-8 mt-4">
                          {reception.events.slice(0, 2).map((ev) => (
                            <div key={ev.time + ev.title} className="flex flex-col items-center max-w-[130px]">
                              <span className="text-xs uppercase tracking-wider text-center" style={{ color: C.creamSoft }}>
                                {ev.title.split('&')[0].trim()}
                              </span>
                              <span className="text-lg font-medium mt-1">{ev.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <MonthCalendar info={dateInfo} />
                      {calendarUrl && (
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm underline underline-offset-4" style={{ color: C.cream, fontFamily: F.tnr }}>
                          Thêm vào lịch
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setRsvpOpen(true)}
                      className="mt-1 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm tracking-wide transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: C.cream, color: C.primary, fontFamily: F.bask }}
                    >
                      XÁC NHẬN THAM DỰ
                    </button>
                  </div>
                </PaperCard>
              </section>
            )}

            {/* ---------- Bản đồ ---------- */}
            {mapPlace && (
              <div className="relative z-10 overflow-x-clip">
                <Castle className="top-[-1%] w-[158%]" />
                <section className="relative z-10 flex w-full flex-col items-center px-6 pb-8 pt-8">
                  <div className="relative text-center">
                    <h3 className="uppercase" style={{ fontFamily: F.tnr, fontWeight: 700, letterSpacing: '0.03em' }}>
                      Tiệc cưới sẽ tổ chức tại
                    </h3>
                    <div className="mx-auto mt-2 max-w-[260px] md:max-w-[440px] text-[12px] md:text-[14px] leading-relaxed" style={{ color: 'rgba(81,20,25,0.8)', fontFamily: F.bask }}>
                      {mapPlace.address}
                    </div>
                  </div>
                  <iframe
                    title={`Bản đồ ${mapPlace.venueName}`}
                    className="mt-3 h-[268px] w-full max-w-[338px] rounded-[15px] border md:h-[380px] md:max-w-[560px]"
                    style={{ borderColor: C.primary }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]"
                    style={{ color: 'rgba(81,20,25,0.8)', fontFamily: F.bask }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Chỉ đường
                  </a>
                </section>
              </div>
            )}

            {/* ---------- Dress code ---------- */}
            {config.dressCode?.swatches?.length > 0 && (
              <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-10">
                <div className="flex flex-col items-center gap-1">
                  <SectionTitle>Dress Code</SectionTitle>
                  <p className="text-sm text-center" style={{ color: 'rgba(81,20,25,0.8)', fontFamily: F.tnr }}>
                    {config.dressCode.title || 'Trang phục dự tiệc'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {config.dressCode.swatches.map((s) => (
                    <div
                      key={s.hex}
                      title={s.name}
                      className="w-10 h-10 rounded-full shadow-md"
                      style={{ backgroundColor: s.hex, border: '1.5px solid rgba(81,20,25,0.19)' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ---------- Lịch trình ---------- */}
            {schedule.length > 0 && (
              <section className="relative z-10 mx-auto my-4 w-[88%] max-w-[420px] md:max-w-[560px]">
                <Flower className="-right-[16%] -top-[12%] z-20 w-[30%]" duration={5.2} delay={0.9} />
                <PaperCard radius={10} className="px-6 py-9">
                  <div className="flex flex-col gap-4 px-2">
                    <SectionTitle light>Lịch trình ngày cưới</SectionTitle>
                    <ol className="relative mx-auto grid w-full max-w-[460px] grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-center gap-x-6 gap-y-8" style={{ fontFamily: F.tnr }}>
                      {schedule.map((ev, i) => {
                        const icon = scheduleIcons[i];
                        const first = i === 0;
                        const last = i === schedule.length - 1;
                        return (
                          <li key={`${ev.time}-${i}`} className="contents">
                            <span className="pt-0.5 text-right text-[16px] tabular-nums tracking-wide leading-snug" style={{ color: C.cream }}>
                              <span className="relative inline-block">
                                {icon && (
                                  <span aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 right-full" style={{ marginRight: 30 }}>
                                    <Deco name={icon} className="block h-10 w-10 object-contain" />
                                  </span>
                                )}
                                {firstTime(ev.time) || ev.time}
                              </span>
                            </span>
                            <span aria-hidden="true" className="relative flex items-center justify-center self-stretch">
                              <span
                                className={`absolute left-1/2 -translate-x-1/2 w-px ${first ? 'top-1/2' : '-top-8'} ${last ? 'bottom-1/2' : '-bottom-8'}`}
                                style={{ backgroundColor: 'color-mix(in srgb, #ECE4D8 40%, transparent)' }}
                              />
                              <span className="relative block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.cream, boxShadow: '0 0 0 2px color-mix(in srgb, #ECE4D8 13%, transparent)' }} />
                            </span>
                            <span className="text-[13px]" style={{ color: C.creamSoft }}>
                              {ev.title}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </PaperCard>
              </section>
            )}

            {/* ---------- Sổ lưu bút ---------- */}
            <div className="relative z-10 overflow-x-clip">
              <Deco
                name="papernote-background"
                className="pointer-events-none absolute left-1/2 top-[-15px] w-[120%] max-w-[650px] -translate-x-1/2 object-contain opacity-95 drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
              />
              <section className="relative z-10 px-6 pb-8 pt-[74px] md:pt-[120px]" style={{ fontFamily: F.tnr }}>
                <SectionTitle className="translate-y-4">Sổ lưu bút</SectionTitle>
                <form onSubmit={submitWish} className="mt-6 mx-auto w-full max-w-[280px] md:max-w-[380px]">
                  <div className="p-4">
                    <input required maxLength={80} value={wName} onChange={(e) => setWName(e.target.value)} placeholder="Nhập tên*" className="mb-4 w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none" style={inputStyle} />
                    <textarea required maxLength={1000} value={wMsg} onChange={(e) => setWMsg(e.target.value)} placeholder="Nhập lời chúc*" className="h-[56px] md:h-[110px] w-full rounded-lg border px-4 py-3 text-base sm:text-sm focus:outline-none resize-none" style={inputStyle} />
                    {wError && <p className="text-xs mt-1" role="alert">{wError}</p>}
                    <div className="mt-1 flex justify-end">
                      <button type="submit" disabled={wState === 'sending'} className="rounded-full px-6 py-2 text-sm font-semibold transition-transform hover:scale-105 disabled:opacity-60" style={{ backgroundColor: C.primary, color: '#DED9D7' }}>
                        {wState === 'sending' ? 'ĐANG GỬI…' : 'GỬI LỜI CHÚC'}
                      </button>
                    </div>
                  </div>
                </form>
                <div className="mt-[60px] md:mt-[110px] w-full space-y-3 max-h-[520px] overflow-y-auto pr-2 mx-auto max-w-[600px]">
                  {wishes.map((w) => (
                    <div key={w.id} className="rounded-[8px] border p-4 text-sm" style={{ borderColor: 'rgba(81,20,25,0.333)', backgroundColor: 'rgba(255,255,255,0.55)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{w.author}</span>
                        <span className="text-xs opacity-70 shrink-0">{w.createdAt}</span>
                      </div>
                      <p className="mt-2 leading-relaxed">{w.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ---------- Hộp quà mừng ---------- */}
            {config.bankAccounts.length > 0 && (
              <div className="relative z-10 overflow-x-clip">
                <Castle className="top-[6%] w-[155%]" />
                <div className="relative z-10 flex flex-col items-center px-6 pb-10 pt-8">
                  <SectionTitle className="mb-4">Hộp Quà Mừng</SectionTitle>
                  <button type="button" aria-label="Mở hộp mừng cưới" onClick={() => setGiftOpen(true)} className="mdr-gift group relative cursor-pointer" style={{ width: 250, height: 357 }}>
                    <div className="relative w-full h-full flex items-end justify-center pb-[48px]">
                      {[
                        { top: '6%', left: '12%', size: 20.9, cls: 'mdr-sparkle' },
                        { top: '14%', right: '8%', size: 15.2, cls: 'mdr-sparkle-2' },
                        { top: '34%', left: '3%', size: 13.3, cls: 'mdr-sparkle-3' },
                        { top: '24%', right: '3%', size: 13.3, cls: 'mdr-sparkle-4' },
                      ].map((s) => (
                        <span key={s.cls} className={`${s.cls} absolute pointer-events-none z-20`} style={{ top: s.top, left: s.left, right: s.right, color: C.goldDeep, fontSize: s.size }}>
                          ✦
                        </span>
                      ))}
                      <div className="relative" style={{ width: 190, height: 275 }}>
                        <div className="mdr-gift-shadow absolute pointer-events-none" style={{ left: '50%', bottom: -6, width: 125, height: 11, marginLeft: -62.5, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', filter: 'blur(4px)' }} />
                        {giftArt ? (
                          <>
                            <Deco name="gift-envelope" className="mdr-gift-back absolute inset-0 w-full h-full object-contain object-bottom" style={{ translate: '15% 0', opacity: 0.85 }} />
                            <Deco name="gift-envelope" className="mdr-gift-card absolute inset-0 w-full h-full object-contain object-bottom" style={{ rotate: '-10deg', zIndex: 2, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.22))' }} />
                          </>
                        ) : (
                          <div className="mdr-gift-card absolute inset-x-0 bottom-0 h-[62%] rounded-md" style={{ rotate: '-10deg', zIndex: 2, background: 'linear-gradient(180deg,#6a1a22,#511419)', boxShadow: '0 10px 18px rgba(0,0,0,0.22)' }}>
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)', clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }} />
                            <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 30%, #F3DB9A, #D4AE62 55%, #A9812F)' }}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: '#8A6420' }}>
                                {HeartPath}
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mdr-gift-hint absolute bottom-0 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap font-medium">Nhấn để mở</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <footer className="relative z-10 flex flex-col items-center px-6 pb-10 text-center">
              <span className="text-[12px] md:text-[13px]" style={{ fontFamily: F.tnr }}>
                {config.invitationGreeting || 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!'}
              </span>
            </footer>
            <div className="relative z-20 flex items-center justify-center pb-3">
              <a href="https://chungdoi.com" target="_blank" rel="noopener noreferrer" className="text-xs opacity-50 hover:opacity-70 transition-opacity">
                ♡ Mẫu thiệp: chungdoi.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {lightbox !== null && config.gallery[lightbox] && (
        <Lightbox photos={config.gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
      )}
      {rsvpOpen && <RsvpModal config={config} onClose={() => setRsvpOpen(false)} onSubmit={onSubmitRsvp} />}
      {giftOpen && <GiftModal config={config} onClose={() => setGiftOpen(false)} />}
    </>
  );
};
