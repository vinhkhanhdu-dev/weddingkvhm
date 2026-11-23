/**
 * "Song Hỷ – Xanh" invitation layout, rebuilt from the Chung Đôi template
 * (used with the couple's permission) and filled with this couple's WeddingConfig.
 *
 * Template artwork is read from /assets/themes/song-hy-green/*. Each image has a
 * drawn stand-in (CSS / SVG) so the page looks complete before the files are added.
 */
import React, { useMemo, useState } from 'react';
import { CeremonyTab, RsvpSubmission, WeddingConfig, WishEntry } from '../../types/wedding';
import { resolveAssetUrl } from '../ResilientImage';
import {
  Album,
  DateInfo,
  GiftModal,
  KitPalette,
  Lightbox,
  MonthCalendar,
  RsvpModal,
  firstTime,
  getDateInfo,
  googleCalendarUrl,
  isoAt,
  lunarLine,
} from '../minimalism/MinimalismInvitation';

// ---------- Design tokens (taken from the template) ----------
const C = {
  green: '#1F3A25',
  greenDark: '#0B2512',
  mint: '#E8F0E4',
  page: '#FFF7EB',
  grey: '#666666',
  sparkle: '#7CB882',
};
const F = {
  names: '"EB Garamond", "Cormorant Garamond", Georgia, serif',
  intro: '"Playfair Display", Baskerville, "Times New Roman", serif',
  bask: 'Baskerville, "Times New Roman", serif',
  tnr: '"Times New Roman", serif',
  corm: '"Cormorant Garamond", "Times New Roman", serif',
  caslon: '"Big Caslon", Baskerville, "Times New Roman", serif',
  sans: '"Avenir Next", "Be Vietnam Pro", system-ui, sans-serif',
  lora: '"Lora", "Times New Roman", serif',
};
const PALETTE: KitPalette = { primary: C.green, onPrimary: C.mint, page: C.page };
const asset = (file: string) => resolveAssetUrl(`/assets/themes/song-hy-green/${file}`);

// ---------- Artwork with drawn fallbacks ----------

/** Image that swaps to `fallback` when the file is missing. */
const Art: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { file: string; fallback?: React.ReactNode }
> = ({ file, fallback = null, ...rest }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return <img alt="" aria-hidden="true" src={asset(file)} onError={() => setFailed(true)} {...rest} />;
};

/** Double-happiness mark drawn with strokes (stand-in for chu-hy.webp). */
const HyMark: React.FC<{ className?: string; color?: string }> = ({ className = '', color = C.mint }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke={color} strokeWidth="7" strokeLinecap="square" aria-hidden="true">
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

const GreenBand: React.FC<{ children: React.ReactNode; as?: 'h2' | 'h3' }> = ({ children, as = 'h2' }) => {
  const Tag = as;
  return (
    <div className="w-full py-3 md:py-4" style={{ backgroundColor: C.green }}>
      <Tag
        className="font-bold text-[20px] md:text-[24px] text-center uppercase tracking-wide px-2"
        style={{ color: C.mint, fontFamily: F.tnr }}
      >
        {children}
      </Tag>
    </div>
  );
};

/** "THỨ NĂM | 30 | THÁNG 07" + year + lunar line */
const DateRow: React.FC<{ info: DateInfo; lunar: string; upperLunar?: boolean }> = ({ info, lunar, upperLunar }) => (
  <>
    <div className="flex items-center justify-center mt-5" style={{ fontFamily: F.bask }}>
      <span className="text-[14px] md:text-[15px] w-[78px] md:w-[90px] uppercase whitespace-nowrap text-right" style={{ color: C.grey }}>
        {info.weekday}
      </span>
      <span className="w-px h-[25px] self-center opacity-50 mx-3 md:mx-4" style={{ backgroundColor: C.grey }} />
      <span className="text-[32px] md:text-[38px]" style={{ color: C.green }}>
        {String(info.day).padStart(2, '0')}
      </span>
      <span className="w-px h-[25px] self-center opacity-50 mx-3 md:mx-4" style={{ backgroundColor: C.grey }} />
      <span className="text-[14px] md:text-[15px] w-[78px] md:w-[90px] uppercase whitespace-nowrap text-left" style={{ color: C.grey }}>
        THÁNG {String(info.month).padStart(2, '0')}
      </span>
    </div>
    <div className="text-[20px] md:text-[22px] mt-2 text-center" style={{ color: C.grey, fontFamily: F.bask }}>
      {info.year}
    </div>
    <div
      className={`text-[13px] md:text-[14px] text-center mt-2 px-4 ${upperLunar ? 'uppercase tracking-wide' : ''}`}
      style={{ color: C.grey, fontFamily: F.bask }}
    >
      {lunar}
    </div>
  </>
);

// ---------- Intro overlay ----------

const IntroOverlay: React.FC<{ config: WeddingConfig; dateInfo: DateInfo | null; onOpen: () => void }> = ({
  config,
  dateInfo,
  onOpen,
}) => {
  const [leaving, setLeaving] = useState(false);
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        left: Math.random() * 95,
        size: 11 + Math.random() * 12,
        sway: (Math.random() - 0.5) * 50,
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
        background: 'linear-gradient(to bottom right, #0a1f0e, #122418, #1F3A25)',
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
            <HyMark className="w-full h-full" color="#a8e6a3" />
          </div>
        ))}
      </div>

      <div className="relative" style={{ zIndex: 10 }}>
        <div className="relative w-[310px] sm:w-[340px] md:w-[520px]">
          <div
            className="absolute left-1/2 rounded-full flex items-center justify-center"
            style={{
              top: 50,
              width: 56,
              height: 56,
              background: `radial-gradient(circle at 30% 30%, ${C.mint}, rgb(202, 210, 198))`,
              ['--shadow-color' as string]: 'rgba(232, 240, 228, 0.5)',
              boxShadow: '0 4px 20px rgba(232, 240, 228, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              zIndex: 30,
              animation: leaving ? 'mdrSealBreak 0.6s ease-out forwards' : 'mdrSealPulse 2s ease-in-out infinite',
            }}
          >
            <HyMark className="w-7 h-7" color={C.green} />
          </div>

          <div
            className="relative rounded-lg"
            style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2), 0 0 40px rgba(232,240,228,0.15)' }}
          >
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{ background: C.green, border: '1px solid rgba(232, 240, 228, 0.15)' }}
            >
              <Art
                file="chu-hy.webp"
                className="absolute pointer-events-none w-[220px] -top-[65px] -left-[124px] opacity-[0.15] rotate-[30deg]"
                style={{ filter: 'hue-rotate(100deg) saturate(0.7)' }}
                fallback={<HyMark className="absolute pointer-events-none w-[220px] h-[220px] -top-[65px] -left-[124px] opacity-[0.15] rotate-[30deg]" />}
              />
              <Art
                file="chu-hy.webp"
                className="absolute pointer-events-none w-[220px] -bottom-[39px] -right-[156px] opacity-[0.15] rotate-[30deg]"
                style={{ filter: 'hue-rotate(100deg) saturate(0.7)' }}
                fallback={<HyMark className="absolute pointer-events-none w-[220px] h-[220px] -bottom-[39px] -right-[156px] opacity-[0.15] rotate-[30deg]" />}
              />
            </div>

            <div className="relative z-10 text-center px-6 pt-28 pb-14 md:pt-24 md:pb-10">
              <h1 className="mb-2 flex flex-col items-center leading-tight text-3xl sm:text-4xl" style={{ color: C.mint, fontFamily: F.intro }}>
                <span className="block w-full">{config.groomName}</span>
                <span className="block w-full text-lg leading-none sm:text-xl" style={{ fontFamily: F.bask }}>
                  &amp;
                </span>
                <span className="block w-full">{config.brideName}</span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.mint})` }} />
                <span className="text-sm" style={{ color: C.mint, opacity: 0.7 }}>
                  ❦
                </span>
                <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.mint})` }} />
              </div>
              <div className="text-[18px] mb-5" style={{ color: 'rgba(232, 240, 228, 0.85)', fontFamily: F.lora }}>
                {dateInfo?.longVi || config.displayDate}
              </div>
              <p className="text-[18px] font-light mb-8" style={{ color: 'rgba(232, 240, 228, 0.85)', fontFamily: F.lora }}>
                Thân Mời
              </p>
              <button
                type="button"
                onClick={open}
                className="relative px-8 py-2.5 text-lg font-semibold rounded-full shadow-lg cursor-pointer flex w-fit items-center justify-center mx-auto overflow-hidden"
                style={{ backgroundColor: C.mint, color: C.green, boxShadow: '0 4px 14px rgba(232, 240, 228, 0.35)', fontFamily: F.lora }}
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

export const SongHyInvitation: React.FC<Props> = ({ config, wishes, onAddWish, onSubmitRsvp, showIntro, onIntroDone }) => {
  const dateInfo = useMemo(() => getDateInfo(config.weddingDateISO), [config.weddingDateISO]);
  const ceremony: CeremonyTab | undefined = config.ceremonies[0];
  const reception: CeremonyTab | undefined = config.ceremonies.find((c) => c.id === 'tiec-cuoi') || config.ceremonies[1];
  const ceremonyTime = firstTime(ceremony?.timeRange) || firstTime(ceremony?.events[0]?.time);
  const receptionTime = firstTime(reception?.timeRange) || firstTime(reception?.events[0]?.time);
  const lunar = lunarLine(ceremony?.lunarDate || config.lunarDisplayDate);
  const mapPlace = reception || ceremony;
  const mapQuery = mapPlace?.mapQuery || mapPlace?.address || '';
  const directionsUrl = mapPlace?.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const calendarUrl = googleCalendarUrl(
    `Đám cưới ${config.groomFullName} & ${config.brideFullName}`,
    isoAt(dateInfo, receptionTime) || config.weddingDateISO,
    mapPlace?.address || '',
    `${reception?.label || 'Tiệc cưới'} của ${config.groomFullName} & ${config.brideFullName}`
  );
  const schedule = [...(ceremony?.events || []), ...(reception?.events || [])].filter((e) => firstTime(e.time));

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

  const nameTop = { color: C.mint, textShadow: `${C.green} 0 1px 4px` };
  const family = [
    { key: 'groom', father: config.groomParents.father, mother: config.groomParents.mother, address: config.groomParents.address },
    { key: 'bride', father: config.brideParents.father, mother: config.brideParents.mother, address: config.brideParents.address },
  ];

  return (
    <>
      {showIntro && <IntroOverlay config={config} dateInfo={dateInfo} onOpen={onIntroDone} />}

      <main className="min-h-screen w-full">
        <div className="flex w-full justify-center overflow-x-hidden bg-white">
          <div
            className="relative w-full max-w-[480px] md:max-w-[900px] md:mx-auto overflow-hidden md:border md:border-[#1F3A2522] isolate flex flex-col"
            style={{ backgroundColor: C.page }}
          >
            {/* ---------- Header ---------- */}
            <header className="relative w-full overflow-hidden pb-[100px] md:pb-[130px]" style={{ backgroundColor: C.page }}>
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 aspect-square w-[min(671px,130vw)] -translate-x-1/2 -translate-y-1/2 pointer-events-none md:w-[min(872px,100%)]"
              >
                <Art
                  file="sunburst.svg"
                  className="w-full h-full"
                  style={{ filter: 'hue-rotate(100deg) saturate(0.6) brightness(0.7)' }}
                  fallback={<div className="w-full h-full rounded-full" style={{ background: `radial-gradient(circle, #123a1d 0%, ${C.greenDark} 70%)` }} />}
                />
              </div>
              <p
                className="relative z-10 px-4 pt-10 text-center text-[11px] uppercase tracking-[0.35em] md:pt-[52px] md:text-[14px]"
                style={{ ...nameTop, fontFamily: F.corm }}
              >
                Welcome to our wedding
              </p>
              <div className="relative z-10 mx-auto mt-3 flex w-full max-w-[872px] items-center justify-center gap-4 px-4 md:mt-4 md:gap-5 md:px-10">
                {[
                  { rank: config.groomRank || 'Trưởng Nam', name: config.groomName },
                  null,
                  { rank: config.brideRank || 'Út Nữ', name: config.brideName },
                ].map((p, i) =>
                  p ? (
                    <div key={i} className="flex-1 min-w-0 text-center">
                      <p className="mb-1 text-[11px] md:text-[14px]" style={{ ...nameTop, fontFamily: F.sans }}>
                        {p.rank}
                      </p>
                      <p className="whitespace-nowrap uppercase text-[clamp(14px,4.6vw,18px)]" style={{ ...nameTop, fontFamily: F.caslon }}>
                        {p.name}
                      </p>
                    </div>
                  ) : (
                    <div key={i} className="flex w-[64px] shrink-0 items-center justify-center md:w-[83px]">
                      <Art
                        file="chu-hy.webp"
                        className="h-[64px] w-[64px] object-contain md:h-[83px] md:w-[83px]"
                        style={{ filter: 'hue-rotate(100deg) saturate(0.7)' }}
                        fallback={<HyMark className="h-[56px] w-[56px] md:h-[72px] md:w-[72px]" color="#CDEBD6" />}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="relative z-10 mt-2 flex justify-center px-6 md:mt-3">
                <div className="relative mx-auto w-full max-w-[286px] md:max-w-[372px]">
                  <div className="relative w-full translate-y-[50px] md:translate-y-[73px]">
                    <div className="relative w-full aspect-[286/481]">
                      <div className="absolute inset-0 overflow-hidden rounded-t-full bg-[#d9d9d9]">
                        <img src={resolveAssetUrl(config.heroImage)} alt={`${config.groomName} & ${config.brideName}`} className="h-full w-full object-cover object-bottom" />
                      </div>
                      {/* Arched "LOVE NEVER FAILS" caption */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 aspect-[2/1] w-full overflow-visible">
                        <div className="absolute inset-0 size-full -translate-y-5 md:-translate-y-[15px]">
                          <svg className="h-full w-full overflow-visible" viewBox="0 0 286 143" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
                            <defs>
                              <path id="shy-arc" d="M -5.32 143 A 148.32 148.32 0 0 1 291.32 143" fill="none" />
                            </defs>
                            <text fill={C.mint} fontSize="14" fontFamily={F.corm} letterSpacing="0.22em" dominantBaseline="central">
                              <textPath href="#shy-arc" startOffset="50%" textAnchor="middle">
                                LOVE NEVER FAILS
                              </textPath>
                            </text>
                            {[40.7, 233.3].map((x) => (
                              <text key={x} x={x + 6} y={30} fill={C.mint} fontSize="12" textAnchor="middle" opacity="0.9">
                                ✦
                              </text>
                            ))}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* ---------- Thông tin lễ cưới ---------- */}
            <GreenBand>Thông tin lễ cưới</GreenBand>
            <div className="relative w-full" style={{ backgroundColor: C.page }}>
              <div
                className="w-full grid grid-cols-[1fr_auto_1fr] justify-center gap-x-3 md:gap-x-8 mt-6 px-2 sm:px-4"
                style={{ color: C.green, fontFamily: F.bask }}
              >
                {family.map((f, idx) => (
                  <React.Fragment key={f.key}>
                    {idx === 1 && <div className="w-px h-[60px] self-center" style={{ backgroundColor: C.green }} />}
                    <div className="flex flex-col items-center justify-self-center min-w-0 text-center max-w-[160px] md:max-w-[280px] gap-1">
                      <span className="text-[14px] md:text-[15px]" style={{ color: C.grey }}>
                        {f.father && f.mother ? 'Ông Bà' : f.father ? 'Ông' : 'Bà'}
                      </span>
                      {[f.father, f.mother].filter(Boolean).map((n) => (
                        <span key={n} className="font-semibold text-[14px] [overflow-wrap:anywhere]">
                          {n.replace(/^(Ông|Bà)\s+/i, '')}
                        </span>
                      ))}
                      <span className="text-[12px] md:text-[13px] mt-1 leading-tight [overflow-wrap:anywhere]" style={{ color: C.grey }}>
                        {f.address}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="text-center text-[16px] md:text-[20px] uppercase tracking-wider mt-8 px-4 whitespace-pre-line" style={{ color: C.green, fontFamily: F.bask }}>
                {'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI'}
              </div>
              <div className="w-full flex flex-col items-center text-center gap-3 md:gap-4 mt-4 mb-6">
                {[
                  { name: config.groomFullName, rank: config.groomRank || 'Trưởng Nam' },
                  { name: config.brideFullName, rank: config.brideRank || 'Út Nữ' },
                ].map((p, i) => (
                  <React.Fragment key={p.name}>
                    {i === 1 && (
                      <div className="text-[30px] md:text-[35px]" style={{ color: C.grey, fontFamily: F.names }}>
                        &amp;
                      </div>
                    )}
                    <h3 className="w-[92%] flex items-center justify-center leading-[50px] whitespace-nowrap text-[clamp(26px,9vw,35px)] md:text-[42px]" style={{ color: C.green, fontFamily: F.names }}>
                      {p.name}
                    </h3>
                    <div className="text-[12px] md:text-[13px] uppercase tracking-[0.2em]" style={{ color: C.grey, fontFamily: F.bask }}>
                      {p.rank}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {dateInfo && (
                <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 py-8" style={{ fontFamily: F.bask }}>
                  <span className="whitespace-pre-line text-[16px] md:text-[20px] text-center leading-relaxed" style={{ color: C.green }}>
                    {`LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI\n${(ceremony?.venueName || 'TƯ GIA').split('—')[0].trim().toUpperCase()}`}
                  </span>
                  <p className="text-[14px] md:text-[15px] mt-2 text-center uppercase" style={{ color: C.grey }}>
                    VÀO LÚC {ceremonyTime}
                  </p>
                  <DateRow info={dateInfo} lunar={lunar} upperLunar />
                </div>
              )}
            </div>

            {/* ---------- Album ---------- */}
            {config.gallery.length > 0 && (
              <>
                <GreenBand>Album ảnh</GreenBand>
                <div className="relative w-full" style={{ backgroundColor: C.page }}>
                  <div className="relative z-10 w-full max-w-lg mx-auto py-4 px-2 sm:px-4 flex justify-center">
                    <Album photos={config.gallery} onOpen={setLightbox} color={C.green} />
                  </div>
                </div>
              </>
            )}

            {/* ---------- Thông tin tiệc cưới ---------- */}
            {reception && dateInfo && (
              <>
                <GreenBand>Thông tin tiệc cưới</GreenBand>
                <div className="relative w-full" style={{ backgroundColor: C.page }}>
                  <div className="flex flex-col items-center justify-center w-full px-2 sm:px-4 pt-6 pb-8" style={{ fontFamily: F.bask }}>
                    <h3 className="text-[16px] md:text-[20px] text-center uppercase" style={{ color: C.green }}>
                      Tiệc cưới sẽ diễn ra vào lúc:
                    </h3>
                    <div className="text-[20px] md:text-[24px] font-semibold mt-2 text-center" style={{ color: C.green }}>
                      {receptionTime}
                    </div>
                    <DateRow info={dateInfo} lunar={lunar} />
                    {reception.events.length > 1 && (
                      <div className="flex items-start justify-center gap-8 mt-4">
                        {reception.events.slice(0, 2).map((ev) => (
                          <div key={ev.time + ev.title} className="flex flex-col items-center max-w-[140px]">
                            <span className="text-[11px] uppercase text-center" style={{ color: C.grey }}>
                              {ev.title.split('&')[0].trim()}
                            </span>
                            <span className="text-[20px] font-semibold mt-1" style={{ color: C.green }}>
                              {ev.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <MonthCalendar info={dateInfo} variant="plain" color={C.green} />
                    {calendarUrl && (
                      <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="mt-6 text-sm tracking-wider underline underline-offset-4 hover:opacity-70" style={{ color: C.green }}>
                        Thêm vào lịch
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center w-full pt-2 pb-8">
                    <button
                      type="button"
                      onClick={() => setRsvpOpen(true)}
                      className="text-sm md:text-base tracking-wider rounded-[10px] px-4 py-2 font-semibold transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: C.green, color: C.mint, fontFamily: F.bask }}
                    >
                      XÁC NHẬN THAM DỰ
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ---------- Bản đồ ---------- */}
            {mapPlace && (
              <section className="relative flex flex-col items-center w-full pb-8" style={{ backgroundColor: C.page }}>
                <GreenBand as="h3">Tiệc cưới sẽ tổ chức tại</GreenBand>
                <div className="w-[92%] max-w-3xl mt-6 p-4 text-center text-sm md:text-base font-medium" style={{ color: C.grey, fontFamily: F.bask }}>
                  {mapPlace.address}
                </div>
                <iframe
                  title={`Bản đồ ${mapPlace.venueName}`}
                  className="w-[92%] max-w-3xl mt-4 rounded-xl h-[350px] md:h-[450px]"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm md:text-base font-semibold transition-transform hover:scale-[1.03]"
                  style={{ color: C.grey, fontFamily: F.bask }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Chỉ đường
                </a>
              </section>
            )}

            {/* ---------- Dress code ---------- */}
            {config.dressCode?.swatches?.length > 0 && (
              <div className="relative flex flex-col items-center gap-5 px-6 md:px-10 py-10 md:py-12">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="font-bold text-[20px] md:text-[24px] text-center uppercase tracking-wide" style={{ color: C.green, fontFamily: F.tnr }}>
                    Dress Code
                  </h2>
                  <p className="text-sm md:text-base text-center opacity-70" style={{ color: C.green, fontFamily: F.bask }}>
                    {config.dressCode.title || 'Trang phục dự tiệc'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {config.dressCode.swatches.map((s) => (
                    <div key={s.hex} title={s.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md" style={{ backgroundColor: s.hex, border: '1.5px solid rgba(31,58,37,0.19)' }} />
                  ))}
                </div>
              </div>
            )}

            {/* ---------- Lịch trình ---------- */}
            {schedule.length > 0 && (
              <div className="relative flex flex-col gap-6 md:gap-8 px-4 mt-4 mb-10 md:mb-12">
                <h2 className="font-bold text-[20px] md:text-[24px] text-center uppercase tracking-wide" style={{ color: C.green, fontFamily: F.tnr }}>
                  Lịch trình ngày cưới
                </h2>
                <ol className="relative mx-auto grid w-full max-w-[460px] grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-center gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10" style={{ fontFamily: F.bask }}>
                  {schedule.map((ev, i) => (
                    <li key={`${ev.time}-${i}`} className="contents">
                      <span className="pt-0.5 text-right text-[16px] md:text-[17px] tabular-nums tracking-wide leading-snug" style={{ color: C.green }}>
                        {firstTime(ev.time) || ev.time}
                      </span>
                      <span aria-hidden="true" className="relative flex items-center justify-center self-stretch">
                        <span
                          className={`absolute left-1/2 -translate-x-1/2 w-px ${i === 0 ? 'top-1/2' : '-top-8 md:-top-10'} ${i === schedule.length - 1 ? 'bottom-1/2' : '-bottom-8 md:-bottom-10'}`}
                          style={{ backgroundColor: 'color-mix(in srgb, #1F3A25 40%, transparent)' }}
                        />
                        <span className="relative block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.green, boxShadow: '0 0 0 2px color-mix(in srgb, #1F3A25 13%, transparent)' }} />
                      </span>
                      <span className="pt-0.5 text-start text-[15px] md:text-[19px] font-medium leading-snug" style={{ color: C.grey }}>
                        {ev.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* ---------- Sổ lưu bút ---------- */}
            <GreenBand>Sổ lưu bút</GreenBand>
            <section className="relative flex flex-col items-center justify-center w-full py-8 px-2 sm:px-4" style={{ color: C.grey, backgroundColor: C.page }}>
              <form onSubmit={submitWish} className="mt-2 mx-auto w-full md:max-w-[600px]">
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <input
                    required
                    maxLength={80}
                    value={wName}
                    onChange={(e) => setWName(e.target.value)}
                    placeholder="Nhập tên của bạn*"
                    className="mb-4 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none text-base sm:text-sm"
                  />
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    value={wMsg}
                    onChange={(e) => setWMsg(e.target.value)}
                    placeholder="Nhập lời chúc của bạn*"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none resize-none text-base sm:text-sm"
                  />
                  {wError && <p className="text-xs mt-1 text-red-700" role="alert">{wError}</p>}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={wSending}
                      className="px-8 py-3 rounded-full text-white font-medium transition-all hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
                      style={{ backgroundColor: C.green }}
                    >
                      {wSending ? 'ĐANG GỬI…' : 'GỬI LỜI CHÚC'}
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-8 w-full space-y-3 max-h-[520px] overflow-y-auto pr-2 mx-auto md:max-w-[600px]">
                {wishes.map((w) => (
                  <div key={w.id} className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-lg" style={{ color: C.green, fontFamily: F.tnr }}>
                        {w.author}
                      </span>
                      <span className="text-xs opacity-70 shrink-0">{w.createdAt}</span>
                    </div>
                    <p className="mt-2 leading-relaxed text-sm">{w.message}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- Hộp quà mừng ---------- */}
            {config.bankAccounts.length > 0 && (
              <div className="relative w-full" style={{ backgroundColor: C.page }}>
                <div className="flex flex-col items-center justify-center py-8">
                  <h2 className="mb-4 font-bold text-[20px] md:text-[24px] uppercase tracking-wide" style={{ color: C.green, fontFamily: F.bask }}>
                    Hộp Quà Mừng
                  </h2>
                  <button type="button" aria-label="Mở hộp mừng cưới" onClick={() => setGiftOpen(true)} className="shy-gift group relative cursor-pointer" style={{ width: 260, height: 280 }}>
                    <div className="relative w-full h-full flex items-end justify-center pb-[26px]">
                      {[
                        { top: '8%', left: '14%', size: 22, cls: 'mdr-sparkle' },
                        { top: '18%', right: '10%', size: 16, cls: 'mdr-sparkle-2' },
                        { top: '32%', left: '5%', size: 14, cls: 'mdr-sparkle-3' },
                        { top: '26%', right: '5%', size: 14, cls: 'mdr-sparkle-4' },
                      ].map((s) => (
                        <span key={s.cls} className={`${s.cls} absolute pointer-events-none z-20`} style={{ top: s.top, left: s.left, right: s.right, color: C.sparkle, fontSize: s.size }}>
                          ✦
                        </span>
                      ))}
                      <div className="shy-gift-bob relative" style={{ width: 200, height: 220 }}>
                        <div className="mdr-gift-shadow absolute pointer-events-none" style={{ left: '50%', bottom: -8, width: 144, height: 12, marginLeft: -72, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', filter: 'blur(4px)' }} />
                        <Art
                          file="gift-box.webp"
                          className="shy-gift-box absolute pointer-events-none"
                          style={{ left: '50%', bottom: 0, width: 170, maxHeight: 220, objectFit: 'contain', marginLeft: -85, zIndex: 2, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.25))' }}
                          fallback={
                            // Drawn gift box: green box, mint ribbon, double-happiness tag
                            <div className="shy-gift-box absolute" style={{ left: '50%', bottom: 0, width: 150, height: 150, marginLeft: -75, zIndex: 2, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.25))' }}>
                              <div className="absolute inset-x-0 bottom-0 h-[78%] rounded-md" style={{ background: `linear-gradient(180deg, #2c5235, ${C.green})` }} />
                              <div className="absolute inset-x-[-6px] top-[14%] h-[20%] rounded-md" style={{ background: 'linear-gradient(180deg, #36623f, #24452c)' }} />
                              <div className="absolute left-1/2 -translate-x-1/2 top-[14%] bottom-0 w-[16%]" style={{ background: C.mint, opacity: 0.9 }} />
                              <div className="absolute left-1/2 top-[2%] -translate-x-1/2 w-12 h-8" style={{ borderRadius: '50% 50% 0 0', border: `4px solid ${C.mint}`, borderBottom: 'none' }} />
                              <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#b8322f' }}>
                                <HyMark className="w-6 h-6" color="#F6D58A" />
                              </span>
                            </div>
                          }
                        />
                      </div>
                      <p className="mdr-gift-hint absolute bottom-0 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap font-medium" style={{ color: 'rgb(70,70,70)' }}>
                        Nhấn để mở
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <footer className="w-full flex flex-col items-center justify-center gap-2 px-6 pb-4 pt-2 text-center" style={{ backgroundColor: C.page }}>
              <span className="text-[12px]" style={{ color: C.grey, fontFamily: F.tnr }}>
                {config.invitationGreeting}
              </span>
              <a href="https://chungdoi.com" target="_blank" rel="noopener noreferrer" className="text-xs opacity-50 hover:opacity-70 transition-opacity" style={{ color: C.grey }}>
                ♡ Mẫu thiệp: chungdoi.com
              </a>
            </footer>
          </div>
        </div>
      </main>

      {lightbox !== null && config.gallery[lightbox] && (
        <Lightbox photos={config.gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} accent={C.green} />
      )}
      {rsvpOpen && <RsvpModal config={config} onClose={() => setRsvpOpen(false)} onSubmit={onSubmitRsvp} palette={PALETTE} />}
      {giftOpen && <GiftModal config={config} onClose={() => setGiftOpen(false)} palette={PALETTE} />}
    </>
  );
};
