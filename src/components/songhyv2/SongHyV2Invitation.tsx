/**
 * "Song Hỷ V2 – Đỏ" invitation layout, rebuilt from the Chung Đôi template
 * (used with the couple's permission) and filled with this couple's WeddingConfig.
 *
 * Template artwork is read from /assets/themes/song-hy-v2-red/*. Each image has a
 * drawn stand-in (CSS / SVG) so the page looks complete before the files are added.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { CeremonyTab, RsvpSubmission, WeddingConfig, WishEntry } from '../../types/wedding';
import { resolveAssetUrl } from '../ResilientImage';
import {
  Album,
  DateInfo,
  GiftModal,
  KitPalette,
  Lightbox,
  RsvpModal,
  firstTime,
  getDateInfo,
  googleCalendarUrl,
  isoAt,
  lunarLine,
} from '../minimalism/MinimalismInvitation';

// ---------- Design tokens (taken from the template) ----------
const C = {
  page: '#8C0000',
  red: '#990000',
  redDeep: '#920002',
  ink: '#2F0000',
  gold: '#FFE8A4',
  cream: '#FFF9E6',
  peach: '#FDCB9C',
};
const F = {
  script: 'Carattere, "Ms Madi", cursive',
  madi: '"Ms Madi", Carattere, cursive',
  fraunces: 'Fraunces, "Times New Roman", serif',
  bask: 'Baskerville, "Times New Roman", serif',
  tnr: '"Times New Roman", Times, serif',
  helv: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  uchen: 'Uchen, Baskerville, serif',
  nautigal: '"The Nautigal", cursive',
  lora: '"Lora", "Times New Roman", serif',
};
const PALETTE: KitPalette = { primary: C.redDeep, onPrimary: C.cream, page: C.cream };
const asset = (file: string) => resolveAssetUrl(`/assets/themes/song-hy-v2-red/${file}`);

// ---------- Artwork with drawn fallbacks ----------

const Art: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { file: string; fallback?: React.ReactNode }
> = ({ file, fallback = null, ...rest }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return <img alt="" aria-hidden="true" src={asset(file)} onError={() => setFailed(true)} {...rest} />;
};

/** Double-happiness mark drawn with strokes (stand-in for double-happiness*.webp). */
const HyMark: React.FC<{ className?: string; color?: string; style?: React.CSSProperties }> = ({
  className = '',
  color = C.red,
  style,
}) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke={color} strokeWidth="7" strokeLinecap="square" aria-hidden="true">
    <path d="M6 14h88M6 55h88" />
    {[0, 50].map((dx) => (
      <g key={dx} transform={`translate(${dx} 0)`}>
        <path d="M25 4v20M10 24h30" />
        <rect x="12" y="32" width="26" height="13" />
        <path d="M18 60l3 7M32 60l-3 7M9 70h32" />
        <rect x="12" y="78" width="26" height="16" />
      </g>
    ))}
  </svg>
);

/** Cream panel with an arched top tab (stand-in for panel.webp border-image). */
const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative mx-auto w-[91%] ${className}`}>
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 top-[34px] rounded-[30px]"
      style={{ backgroundColor: C.cream, boxShadow: `0 0 0 2px ${C.peach}, 0 0 0 6px ${C.page}, 0 0 0 7px ${C.peach}` }}
    />
    <div
      aria-hidden="true"
      className="absolute left-[14%] right-[14%] top-0 h-[80px] rounded-t-[40px]"
      style={{ backgroundColor: C.cream, boxShadow: `0 -2px 0 0 ${C.peach}, -2px 0 0 0 ${C.peach}, 2px 0 0 0 ${C.peach}` }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

const Title: React.FC<{ children: React.ReactNode; color?: string; as?: 'h2' | 'h3'; className?: string }> = ({
  children,
  color = C.gold,
  as = 'h2',
  className = '',
}) => {
  const Tag = as;
  return (
    <Tag
      className={`uppercase font-bold text-center text-[20px] md:text-[27px] ${className}`}
      style={{ color, fontFamily: F.tnr, letterSpacing: '0.02em' }}
    >
      {children}
    </Tag>
  );
};

const DateBlock: React.FC<{ info: DateInfo; time: string; lunar: string; label?: React.ReactNode }> = ({
  info,
  time,
  lunar,
  label,
}) => (
  <div className="mt-[14px] flex w-full flex-col items-center gap-[6px] text-center" style={{ fontFamily: F.bask, color: C.red }}>
    {label && <span className="whitespace-pre-line text-[16px] md:text-[20px] uppercase leading-relaxed">{label}</span>}
    <div className="flex w-full max-w-[161px] items-center justify-between text-[12px] uppercase md:max-w-[219px] md:text-[16px] whitespace-nowrap min-w-max gap-x-3" style={{ color: C.ink, fontFamily: F.tnr }}>
      <span>VÀO LÚC {time}</span>
      <span>{info.weekday}</span>
    </div>
    <div className="flex items-center justify-center gap-[9px] md:gap-[12px]">
      <span className="text-[57px] leading-none md:text-[78px]">{String(info.day).padStart(2, '0')}</span>
      <div className="h-[46px] w-px shrink-0 self-center md:h-[63px]" style={{ backgroundColor: C.redDeep }} />
      <div className="flex flex-col items-start justify-center gap-1 text-left" style={{ fontFamily: F.tnr }}>
        <span className="text-[17px] uppercase leading-none md:text-[23px]">THÁNG {String(info.month).padStart(2, '0')}</span>
        <span className="text-[17px] leading-none md:text-[23px]">{info.year}</span>
      </div>
    </div>
    <div className="text-xs uppercase md:text-sm" style={{ color: C.ink, fontFamily: F.tnr }}>
      {lunar}
    </div>
  </div>
);

function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const diff = new Date(iso).getTime() - now;
  if (!Number.isFinite(diff) || diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${d} ngày ${h} giờ ${m} phút ${s} giây`;
}

/** Month calendar in the V2 style: Nautigal header, filled heart on the day. */
const RedCalendar: React.FC<{ info: DateInfo }> = ({ info }) => {
  const lead = (new Date(info.year, info.month - 1, 1).getDay() + 6) % 7;
  const days = new Date(info.year, info.month, 0).getDate();
  const cells = [...Array.from({ length: lead }, () => 0), ...Array.from({ length: days }, (_, i) => i + 1)];
  const line = `color-mix(in srgb, ${C.redDeep} 27%, transparent)`;
  return (
    <div className="mt-[28px] mx-auto w-[280px] max-w-full rounded-lg overflow-hidden border text-[11px]" style={{ borderColor: line, color: C.redDeep }}>
      <div className="text-center py-2.5 border-b text-[25px] leading-none" style={{ borderColor: line, fontFamily: F.nautigal }}>
        Tháng {info.month} / {info.year}
      </div>
      <div className="grid grid-cols-7 border-b-2" style={{ borderColor: C.redDeep }}>
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
                <svg viewBox="0 0 24 22" className="absolute inset-0 w-full h-full" fill={C.redDeep}>
                  <path d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z" />
                </svg>
                <span className="relative z-10 text-[11px] font-bold" style={{ color: C.cream }}>
                  {d}
                </span>
              </div>
            ) : d ? (
              <span className="text-[12px]">{d}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Faded flower spray drifting at the section edges (hidden when the file is missing). */
const SideFlowers: React.FC<{ topRight: number; topLeft: number }> = ({ topRight, topLeft }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
    <Art file="flower1.webp" className="absolute max-w-none object-contain h-[311px] w-[274px] opacity-20 right-[-62px]" style={{ top: topRight }} />
    <Art file="flower1.webp" className="absolute max-w-none object-contain h-[311px] w-[274px] opacity-20 left-[-62px] -scale-x-100" style={{ top: topLeft }} />
  </div>
);

// ---------- Intro ----------

const IntroOverlay: React.FC<{ config: WeddingConfig; dateInfo: DateInfo | null; onOpen: () => void }> = ({
  config,
  dateInfo,
  onOpen,
}) => {
  const [leaving, setLeaving] = useState(false);
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: Math.random() * 95,
        size: 11 + Math.random() * 12,
        color: i % 2 ? '#A50000' : C.peach,
        sway: (Math.random() - 0.5) * 55,
        duration: 18 + Math.random() * 8,
        delay: -Math.random() * 24,
      })),
    []
  );
  const open = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onOpen, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 40%, #5e0000, #2a0000 75%)',
        animation: leaving ? 'mdrEnvelopeAway 0.9s ease-in forwards' : undefined,
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${p.left}%`,
              bottom: -30,
              width: p.size,
              height: p.size,
              ['--sway' as string]: `${p.sway}px`,
              animation: `shyAmbientRise ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          >
            <HyMark className="w-full h-full" color={p.color} />
          </div>
        ))}
      </div>
      <div className="relative" style={{ zIndex: 10 }}>
        <div className="relative w-[310px] sm:w-[340px] md:w-[520px]">
          <div
            className="absolute left-1/2 rounded-full flex items-center justify-center"
            style={{
              top: 50,
              width: 64,
              height: 64,
              ['--shadow-color' as string]: 'rgba(255, 232, 164, 0.5)',
              background: C.page,
              zIndex: 30,
              animation: leaving ? 'mdrSealBreak 0.6s ease-out forwards' : 'mdrSealPulse 2s ease-in-out infinite',
            }}
          >
            <Art file="double-happiness-light.webp" className="w-[52px] h-[52px] object-contain" fallback={<HyMark className="w-[40px] h-[40px]" color={C.gold} />} />
          </div>
          <div className="relative rounded-lg" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2), 0 0 40px rgba(253,203,156,0.15)' }}>
            <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ background: C.page, border: '1px solid rgba(253, 203, 156, 0.15)' }}>
              <HyMark className="absolute w-[220px] h-[220px] -top-[60px] -left-[156px] opacity-[0.15] rotate-[30deg]" color={C.peach} />
              <HyMark className="absolute w-[220px] h-[220px] -bottom-[60px] -right-[156px] opacity-[0.15] rotate-[30deg]" color={C.peach} />
            </div>
            <div className="relative z-10 text-center px-6 pt-28 pb-14 md:pt-24 md:pb-10">
              <h1 className="mb-2 flex flex-col items-center leading-tight text-4xl" style={{ color: C.gold, fontFamily: F.script }}>
                <span className="block w-full">{config.groomName}</span>
                <span className="block w-full text-lg leading-none sm:text-xl" style={{ fontFamily: F.madi }}>
                  &amp;
                </span>
                <span className="block w-full">{config.brideName}</span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.peach})` }} />
                <span className="text-sm" style={{ color: C.peach, opacity: 0.7 }}>
                  ❦
                </span>
                <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.peach})` }} />
              </div>
              <div className="text-[18px] mb-5" style={{ color: 'rgba(255, 249, 230, 0.85)', fontFamily: F.lora }}>
                {dateInfo?.longVi || config.displayDate}
              </div>
              <p className="text-[18px] font-light mb-8" style={{ color: 'rgba(255, 249, 230, 0.85)', fontFamily: F.lora }}>
                Thân Mời
              </p>
              <button
                type="button"
                onClick={open}
                className="relative px-8 py-2.5 text-lg font-semibold rounded-full shadow-lg cursor-pointer flex w-fit items-center justify-center mx-auto overflow-hidden"
                style={{ backgroundColor: C.gold, color: C.page, boxShadow: '0 4px 14px rgba(255, 232, 164, 0.35)', fontFamily: F.lora }}
              >
                <span>Mở thiệp</span>
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-full w-8 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'mdrShine 3s ease-in-out infinite' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export const SongHyV2Invitation: React.FC<Props> = ({ config, wishes, onAddWish, onSubmitRsvp, showIntro, onIntroDone }) => {
  const dateInfo = useMemo(() => getDateInfo(config.weddingDateISO), [config.weddingDateISO]);
  const ceremony: CeremonyTab | undefined = config.ceremonies[0];
  const reception: CeremonyTab | undefined = config.ceremonies.find((c) => c.id === 'tiec-cuoi') || config.ceremonies[1];
  const ceremonyTime = firstTime(ceremony?.timeRange) || firstTime(ceremony?.events[0]?.time);
  const receptionTime = firstTime(reception?.timeRange) || firstTime(reception?.events[0]?.time);
  const lunar = lunarLine(ceremony?.lunarDate || config.lunarDisplayDate);
  const receptionIso = isoAt(dateInfo, receptionTime) || config.weddingDateISO;
  const countdown = useCountdown(receptionIso);
  const mapPlace = reception || ceremony;
  const mapQuery = mapPlace?.mapQuery || mapPlace?.address || '';
  const directionsUrl = mapPlace?.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const calendarUrl = googleCalendarUrl(
    `Đám cưới ${config.groomFullName} & ${config.brideFullName}`,
    receptionIso,
    mapPlace?.address || '',
    `${reception?.label || 'Tiệc cưới'} của ${config.groomFullName} & ${config.brideFullName}`
  );
  const schedule = [...(ceremony?.events || []), ...(reception?.events || [])].filter((e) => firstTime(e.time));
  const icons: Record<number, string> = { 3: 'ring.webp', 4: 'toast.webp', 5: 'cake.webp' };
  const venueShort = (c?: CeremonyTab) => (c?.venueName || 'Tư gia').split('—')[0].trim();

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [wName, setWName] = useState('');
  const [wMsg, setWMsg] = useState('');
  const [wSending, setWSending] = useState(false);
  const [wError, setWError] = useState('');

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim() || !wMsg.trim() || wSending) return;
    setWSending(true);
    setWError('');
    try {
      await onAddWish({ author: wName.trim(), relation: 'Khách mời', message: wMsg.trim() });
      setWName('');
      setWMsg('');
    } catch (err) {
      setWError(err instanceof Error ? err.message : 'Không gửi được, vui lòng thử lại.');
    } finally {
      setWSending(false);
    }
  };

  const family = [
    { key: 'groom', father: config.groomParents.father, mother: config.groomParents.mother },
    { key: 'bride', father: config.brideParents.father, mother: config.brideParents.mother },
  ];
  const goldField: React.CSSProperties = { borderColor: C.gold, color: C.gold, backgroundColor: 'transparent' };

  return (
    <>
      {showIntro && <IntroOverlay config={config} dateInfo={dateInfo} onOpen={onIntroDone} />}

      <main className="min-h-screen w-full">
        <div className="flex w-full justify-center overflow-x-hidden bg-white">
          <div
            className="relative w-full max-w-[480px] md:max-w-[900px] md:mx-auto overflow-hidden md:border md:border-[#ffe8a433] isolate"
            style={{ backgroundColor: C.page, color: C.gold }}
          >
            {/* ---------- Header ---------- */}
            <header className="relative isolate overflow-x-clip">
              <div className="relative mx-auto w-full max-w-[441px]">
                <div className="relative h-[736px]">
                  {/* Cream backdrop with a rounded red bottom edge */}
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[560px] -z-10 overflow-hidden" style={{ backgroundColor: C.cream, borderRadius: '0 0 50% 50% / 0 0 22% 22%' }}>
                    <HyMark className="absolute -left-[40px] -top-[20px] w-[520px] h-[520px] opacity-[0.05]" color={C.red} />
                  </div>
                  <div className="absolute inset-x-0 top-[77px] z-20 flex items-end justify-center gap-[3px] px-[10px]">
                    {[
                      { label: 'Chú Rể', name: config.groomName },
                      null,
                      { label: 'Cô Dâu', name: config.brideName },
                    ].map((p, i) =>
                      p ? (
                        <div key={i} className="flex min-w-0 flex-1 flex-col items-center text-center">
                          <p className="mb-[5px] text-[12px] leading-[16px]" style={{ color: C.red, fontFamily: F.helv }}>
                            {p.label}
                          </p>
                          <p className="w-full uppercase leading-[27px] whitespace-nowrap text-[clamp(15px,4.6vw,18px)]" style={{ fontFamily: F.fraunces, color: C.red }}>
                            {p.name}
                          </p>
                        </div>
                      ) : (
                        <Art key={i} file="double-happiness.webp" className="h-[31px] w-[32px] shrink-0 object-contain" fallback={<HyMark className="h-[31px] w-[32px] shrink-0" />} />
                      )
                    )}
                  </div>
                  {/* Photo inside the template's cross-shaped frame */}
                  <div className="absolute left-[13.61%] top-[151px] w-[72.79%] z-0" style={{ aspectRatio: '321 / 527' }}>
                    <svg viewBox="0 0 321 527" className="h-full w-full" aria-hidden="true">
                      <defs>
                        <clipPath id="shv2-outer">
                          <rect x="29.5" y="1" width="262" height="525" rx="23.5" ry="25" />
                          <rect x="1" y="28" width="319" height="471" rx="26.5" ry="22" />
                        </clipPath>
                        <clipPath id="shv2-inner">
                          <rect x="31.5" y="3" width="258" height="521" rx="21.5" ry="23" />
                          <rect x="3" y="30" width="315" height="467" rx="24.5" ry="20" />
                        </clipPath>
                      </defs>
                      <rect width="321" height="527" fill={C.page} clipPath="url(#shv2-outer)" />
                      <image href={resolveAssetUrl(config.heroImage)} width="321" height="527" preserveAspectRatio="xMidYMax slice" clipPath="url(#shv2-inner)" />
                    </svg>
                  </div>
                  <HyMark className="absolute -right-[60px] top-[590px] h-[130px] w-[140px] opacity-10" color={C.cream} />
                  <HyMark className="absolute -left-[60px] top-[590px] h-[130px] w-[140px] opacity-10" color={C.cream} />
                </div>
              </div>
            </header>

            {/* ---------- Thông tin lễ cưới ---------- */}
            <section className="relative isolate -mt-[60px] pb-2">
              <div className="relative mx-auto w-full max-w-[441px]">
                <Panel>
                  <div className="flex flex-col items-center pt-[50px] pb-[70px] px-[37px]">
                    <Title color={C.red}>Thông tin lễ cưới</Title>
                    <div className="mt-[10px] grid w-full grid-cols-[1fr_auto_1fr] justify-center gap-x-[14px]" style={{ color: C.red, fontFamily: F.bask }}>
                      {family.map((f, idx) => (
                        <React.Fragment key={f.key}>
                          {idx === 1 && <div className="h-[50px] w-px self-center" style={{ backgroundColor: C.peach }} />}
                          <div className="flex flex-col items-center min-w-0 text-center gap-[3px]">
                            <span className="text-[12px]" style={{ color: C.ink }}>
                              {f.father && f.mother ? 'Ông Bà' : f.father ? 'Ông' : 'Bà'}
                            </span>
                            {[f.father, f.mother].filter(Boolean).map((n) => (
                              <span key={n} className="font-semibold text-[14px] [overflow-wrap:anywhere]">
                                {n.replace(/^(Ông|Bà)\s+/i, '')}
                              </span>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-[14px] text-center text-[16px] uppercase" style={{ fontFamily: F.bask, color: C.red }}>
                      Hai gia đình trân trọng báo tin lễ thành hôn của hai con chúng tôi
                    </div>
                    <div className="mt-[12px] flex w-full flex-col items-center gap-[10px]" style={{ color: C.red }}>
                      {[
                        { name: config.groomFullName, rank: config.groomRank || 'Trưởng Nam' },
                        { name: config.brideFullName, rank: config.brideRank || 'Út Nữ' },
                      ].map((p, i) => (
                        <React.Fragment key={p.name}>
                          {i === 1 && (
                            <div className="text-[35px] leading-none" style={{ fontFamily: F.madi }}>
                              &amp;
                            </div>
                          )}
                          <h3 className="flex w-full items-center justify-center leading-[1.35] whitespace-nowrap text-[clamp(30px,10vw,40px)]" style={{ fontFamily: F.script, wordSpacing: '0.14em' }}>
                            {p.name}
                          </h3>
                          <div className="text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: F.uchen, color: C.ink }}>
                            {p.rank}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    {dateInfo && (
                      <>
                        <DateBlock info={dateInfo} time={ceremonyTime} lunar={lunar} label={`${(ceremony?.label || 'Lễ thành hôn').toUpperCase()}\n${venueShort(ceremony)}`} />
                        {reception && <DateBlock info={dateInfo} time={receptionTime} lunar={lunar} label={`${(reception.label || 'Tiệc cưới').toUpperCase()}\n${venueShort(reception)}`} />}
                      </>
                    )}
                    <Art file="double-happiness.webp" className="mt-8 h-[40px] w-[43px] object-contain" fallback={<HyMark className="mt-8 h-[40px] w-[43px]" />} />
                  </div>
                </Panel>
              </div>
            </section>

            {/* ---------- Album ---------- */}
            {config.gallery.length > 0 && (
              <section className="relative isolate overflow-x-clip mt-[23px]">
                <div className="relative mx-auto w-full max-w-[441px]">
                  <SideFlowers topRight={-17} topLeft={203} />
                  <div className="relative z-10 flex w-full flex-col items-center py-[35px]">
                    <Title className="mb-[18px]">Album ảnh</Title>
                    <div className="w-full max-w-[414px] flex justify-center">
                      <Album photos={config.gallery} onOpen={setLightbox} color={C.gold} indicator="counter" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ---------- Thông tin tiệc cưới ---------- */}
            {reception && dateInfo && (
              <section className="relative isolate pt-[10px]">
                <div className="relative mx-auto w-full max-w-[441px]">
                  <Panel>
                    <div className="flex flex-col items-center pt-[50px] pb-[70px] px-[37px]" style={{ fontFamily: F.bask }}>
                      <Title color={C.redDeep}>Thông tin tiệc cưới</Title>
                      <div className="mt-[28px] flex w-full flex-col items-center gap-[10px] text-center">
                        <h3 className="uppercase font-semibold text-[16px]" style={{ color: C.ink }}>
                          Tiệc cưới sẽ diễn ra vào lúc:
                        </h3>
                        <div className="flex w-full max-w-[155px] items-center justify-between text-[15px] font-semibold uppercase whitespace-nowrap min-w-max gap-x-3" style={{ color: C.ink }}>
                          <span>{receptionTime}</span>
                          <span>{dateInfo.weekday}</span>
                        </div>
                        <div className="flex items-center justify-center gap-[9px]" style={{ color: C.redDeep }}>
                          <span className="text-[57px] leading-none">{String(dateInfo.day).padStart(2, '0')}</span>
                          <div className="h-[46px] w-px" style={{ backgroundColor: C.redDeep }} />
                          <div className="flex flex-col items-start gap-1 text-left" style={{ fontFamily: F.tnr }}>
                            <span className="text-[17px] uppercase leading-none">THÁNG {String(dateInfo.month).padStart(2, '0')}</span>
                            <span className="text-[17px] leading-none">{dateInfo.year}</span>
                          </div>
                        </div>
                        <div className="text-xs uppercase" style={{ color: C.ink }}>
                          {lunar}
                        </div>
                        {reception.events.length > 1 && (
                          <div className="flex items-start justify-center gap-8 mt-4">
                            {reception.events.slice(0, 2).map((ev) => (
                              <div key={ev.time + ev.title} className="flex flex-col items-center max-w-[140px]">
                                <span className="text-[11px] uppercase" style={{ color: C.ink }}>
                                  {ev.title.split('&')[0].trim()}
                                </span>
                                <span className="mt-1 text-[20px] font-semibold" style={{ color: C.redDeep }}>
                                  {ev.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {countdown && (
                          <div className="flex flex-col items-center mt-4" style={{ color: C.ink }}>
                            <h2 className="mt-[12px] text-[20px] uppercase">Cùng đếm ngược</h2>
                            <p className="text-center mt-2 text-[18px] font-semibold tabular-nums">{countdown}</p>
                          </div>
                        )}
                        <RedCalendar info={dateInfo} />
                        {calendarUrl && (
                          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm underline underline-offset-4" style={{ color: C.redDeep, fontFamily: F.tnr }}>
                            Thêm vào lịch
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setRsvpOpen(true)}
                        className="mt-[20px] rounded-[7px] px-5 py-2 text-sm font-semibold tracking-wider transition-transform hover:scale-[1.03]"
                        style={{ backgroundColor: C.redDeep, color: C.cream, fontFamily: F.tnr }}
                      >
                        XÁC NHẬN THAM DỰ
                      </button>
                      <Art file="double-happiness.webp" className="mt-10 h-[40px] w-[43px] object-contain" fallback={<HyMark className="mt-10 h-[40px] w-[43px]" />} />
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {/* ---------- Bản đồ ---------- */}
            {mapPlace && (
              <section className="relative isolate overflow-x-clip mt-[23px]">
                <div className="relative mx-auto w-full max-w-[441px]">
                  <SideFlowers topRight={-37} topLeft={233} />
                  <div className="relative z-10 flex w-full flex-col items-center gap-[12px] px-[51px] py-[24px]">
                    <Title as="h3" className="!text-[18px]">Tiệc cưới sẽ tổ chức tại</Title>
                    <div className="mx-auto max-w-[247px] pb-[12px] text-center text-[12px]" style={{ color: C.gold, fontFamily: F.helv }}>
                      {mapPlace.address}
                    </div>
                    <iframe
                      title={`Bản đồ ${mapPlace.venueName}`}
                      className="h-[267px] w-full max-w-[338px] rounded-[15px]"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ color: C.gold }}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                      Chỉ đường
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* ---------- Dress code ---------- */}
            {config.dressCode?.swatches?.length > 0 && (
              <section className="relative flex flex-col items-center gap-5 px-6 py-10">
                <div className="flex flex-col items-center gap-1">
                  <Title>Dress Code</Title>
                  <p className="text-[13px] text-center opacity-70" style={{ color: C.gold, fontFamily: F.tnr }}>
                    {config.dressCode.title || 'Trang phục dự tiệc'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {config.dressCode.swatches.map((s) => (
                    <div key={s.hex} title={s.name} className="w-10 h-10 rounded-full shadow-md" style={{ backgroundColor: s.hex, border: '1.5px solid rgba(255,232,164,0.19)' }} />
                  ))}
                </div>
              </section>
            )}

            {/* ---------- Lịch trình ---------- */}
            {schedule.length > 0 && (
              <section className="relative isolate mt-[18px] pb-[12px]">
                <div className="relative mx-auto w-full max-w-[441px]">
                  <Panel>
                    <div className="mx-auto flex w-full flex-col items-center gap-[13px] px-[30px] pt-[60px] pb-[40px]">
                      <Title color={C.redDeep}>Lịch trình ngày cưới</Title>
                      <ol className="relative mx-auto grid w-full grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-center gap-x-6 gap-y-8 mt-2" style={{ fontFamily: F.tnr }}>
                        {schedule.map((ev, i) => (
                          <li key={`${ev.time}-${i}`} className="contents">
                            <span className="pt-0.5 text-right text-[13px] tabular-nums tracking-wide leading-snug" style={{ color: C.redDeep }}>
                              <span className="relative inline-block">
                                {icons[i] && (
                                  <span aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 right-full" style={{ marginRight: 30 }}>
                                    <Art file={icons[i]} className="h-[30px] w-[32px] max-w-none object-contain" />
                                  </span>
                                )}
                                {firstTime(ev.time) || ev.time}
                              </span>
                            </span>
                            <span aria-hidden="true" className="relative flex items-center justify-center self-stretch">
                              <span
                                className={`absolute left-1/2 -translate-x-1/2 w-px ${i === 0 ? 'top-1/2' : '-top-8'} ${i === schedule.length - 1 ? 'bottom-1/2' : '-bottom-8'}`}
                                style={{ backgroundColor: `color-mix(in srgb, ${C.redDeep} 40%, transparent)` }}
                              />
                              <span className="relative block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.redDeep, boxShadow: `0 0 0 2px color-mix(in srgb, ${C.redDeep} 13%, transparent)` }} />
                            </span>
                            <span className="text-[13px]" style={{ color: C.redDeep }}>
                              {ev.title}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {/* ---------- Sổ lưu bút ---------- */}
            <section className="relative isolate overflow-x-clip mt-[23px]">
              <div className="relative mx-auto w-full max-w-[441px]">
                <SideFlowers topRight={-67} topLeft={203} />
                <div className="relative z-10 pb-[30px] pt-[40px] px-[37px]" style={{ color: C.gold, fontFamily: F.helv }}>
                  <Title className="mb-[22px]">Sổ lưu bút</Title>
                  <form onSubmit={submitWish} className="mt-6 mx-auto w-full flex flex-col gap-[16px]">
                    <input required maxLength={80} value={wName} onChange={(e) => setWName(e.target.value)} placeholder="Nhập tên*" className="w-full rounded-[6px] border px-[10px] py-2 text-base focus:outline-none placeholder:text-[#ffe8a499]" style={goldField} />
                    <textarea required maxLength={1000} rows={4} value={wMsg} onChange={(e) => setWMsg(e.target.value)} placeholder="Nhập lời chúc*" className="w-full rounded-[6px] border px-[10px] py-2 text-base focus:outline-none resize-none placeholder:text-[#ffe8a499]" style={goldField} />
                    {wError && <p className="text-xs" role="alert">{wError}</p>}
                    <div className="flex justify-end">
                      <button type="submit" disabled={wSending} className="rounded-[7px] px-4 py-1.5 text-[13px] transition-transform hover:scale-105 disabled:opacity-60" style={{ backgroundColor: C.gold, color: C.redDeep, fontFamily: F.tnr }}>
                        {wSending ? 'ĐANG GỬI…' : 'GỬI LỜI CHÚC'}
                      </button>
                    </div>
                  </form>
                  <div className="mt-8 w-full space-y-3 max-h-[520px] overflow-y-auto pr-2">
                    {wishes.map((w) => (
                      <div key={w.id} className="rounded-xl border p-4 text-sm shadow" style={{ borderColor: 'rgba(255,232,164,0.4)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-semibold">{w.author}</span>
                          <span className="text-xs opacity-70 shrink-0">{w.createdAt}</span>
                        </div>
                        <p className="mt-2 leading-relaxed">{w.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- Hộp quà mừng ---------- */}
            {config.bankAccounts.length > 0 && (
              <section className="relative isolate overflow-x-clip mt-[23px]">
                <div className="relative mx-auto w-full max-w-[441px]">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <Art file="cloud-pattern.webp" className="absolute max-w-none object-contain bottom-[-38%] -left-[191px] h-[239px] w-[824px] opacity-40" />
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 pb-[24px] px-[37px]">
                    <Title className="mb-4">Hộp Quà Mừng</Title>
                    <button type="button" aria-label="Mở hộp mừng cưới" onClick={() => setGiftOpen(true)} className="mdr-gift group relative cursor-pointer" style={{ width: 250, height: 357 }}>
                      <div className="relative w-full h-full flex items-end justify-center pb-[48px]">
                        {[
                          { top: '6%', left: '12%', size: 20.9, cls: 'mdr-sparkle' },
                          { top: '14%', right: '8%', size: 15.2, cls: 'mdr-sparkle-2' },
                          { top: '34%', left: '3%', size: 13.3, cls: 'mdr-sparkle-3' },
                          { top: '24%', right: '3%', size: 13.3, cls: 'mdr-sparkle-4' },
                        ].map((s) => (
                          <span key={s.cls} className={`${s.cls} absolute pointer-events-none z-20`} style={{ top: s.top, left: s.left, right: s.right, color: C.gold, fontSize: s.size }}>
                            ✦
                          </span>
                        ))}
                        <div className="relative" style={{ width: 190, height: 275 }}>
                          <div className="mdr-gift-shadow absolute pointer-events-none" style={{ left: '50%', bottom: -6, width: 125, height: 11, marginLeft: -62.5, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', filter: 'blur(4px)' }} />
                          <Art
                            file="gift-envelope.webp"
                            className="mdr-gift-card absolute inset-0 w-full h-full object-contain object-bottom"
                            style={{ rotate: '-10deg', zIndex: 2, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.22))' }}
                            fallback={
                              <div className="mdr-gift-card absolute inset-x-0 bottom-0 h-[62%] rounded-md" style={{ rotate: '-10deg', zIndex: 2, background: `linear-gradient(180deg, ${C.cream}, #f3e2b8)`, boxShadow: '0 10px 18px rgba(0,0,0,0.3)' }}>
                                <div className="absolute inset-0 rounded-md" style={{ background: 'linear-gradient(180deg, rgba(153,0,0,0.12), transparent)', clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }} />
                                <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.red }}>
                                  <HyMark className="w-7 h-7" color={C.gold} />
                                </span>
                              </div>
                            }
                          />
                        </div>
                        <p className="mdr-gift-hint absolute bottom-0 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap font-medium" style={{ color: C.gold }}>
                          Nhấn để mở
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </section>
            )}

            <footer className="relative flex flex-col items-center gap-2 px-6 pb-4 text-center">
              <span className="text-[12px]" style={{ color: C.gold, fontFamily: F.tnr }}>
                {config.invitationGreeting}
              </span>
              <a href="https://chungdoi.com" target="_blank" rel="noopener noreferrer" className="text-xs opacity-50 hover:opacity-70 transition-opacity" style={{ color: C.gold }}>
                ♡ Mẫu thiệp: chungdoi.com
              </a>
            </footer>
          </div>
        </div>
      </main>

      {lightbox !== null && config.gallery[lightbox] && (
        <Lightbox photos={config.gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} accent={C.gold} />
      )}
      {rsvpOpen && <RsvpModal config={config} onClose={() => setRsvpOpen(false)} onSubmit={onSubmitRsvp} palette={PALETTE} />}
      {giftOpen && <GiftModal config={config} onClose={() => setGiftOpen(false)} palette={PALETTE} />}
    </>
  );
};
