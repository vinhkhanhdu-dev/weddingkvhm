import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage } from './ResilientImage';
import { EASE, Ornament } from './Ornament';

interface HeroSectionProps {
  config: WeddingConfig;
  onReplayIntro: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateRemaining(targetISO: string): TimeRemaining {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }
  const diff = target - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

interface DateParts {
  weekday: string;
  day: string;
  month: string;
  year: string;
  time: string;
}

function getDateParts(iso: string): DateParts | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'long',
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const pick = (type: string) => parts.find((p) => p.type === type)?.value || '';
    return {
      weekday: pick('weekday'),
      day: pick('day'),
      month: pick('month'),
      year: pick('year'),
      time: `${pick('hour')}:${pick('minute')}`,
    };
  } catch {
    return null;
  }
}

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const formatted = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center justify-center px-2 py-1 sm:border-l sm:first:border-l-0 border-[#EBD9B4]/15">
      <div className="relative h-12 sm:h-16 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="font-serif text-[2.75rem] sm:text-6xl font-medium text-[#FBF3E4] tabular-nums leading-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#C9A66B]">
        {label}
      </span>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onReplayIntro }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateRemaining(config.weddingDateISO)
  );
  const dateParts = useMemo(() => getDateParts(config.weddingDateISO), [config.weddingDateISO]);

  useEffect(() => {
    setTimeLeft(calculateRemaining(config.weddingDateISO));
    const timer = window.setInterval(() => {
      setTimeLeft(calculateRemaining(config.weddingDateISO));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [config.weddingDateISO]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: EASE },
  });

  return (
    <section id="top" ref={heroRef} className="relative paper-texture overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-14 sm:pt-14 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Invitation copy */}
          <div className="contents lg:block lg:col-span-6 text-center lg:text-left">
            <div className="order-1">
            <motion.p {...rise(0)} className="eyebrow eyebrow-rule lg:hidden">
              Thiệp Mời Thành Hôn
            </motion.p>
            <motion.p {...rise(0)} className="eyebrow eyebrow-rule-start hidden lg:inline-flex">
              Thiệp Mời Thành Hôn
            </motion.p>

            <motion.h1
              {...rise(0.1)}
              className="font-script text-[#88292F] mt-6 whitespace-nowrap text-[clamp(3.25rem,14vw,5.5rem)] lg:text-[clamp(4.25rem,6.2vw,5.75rem)]"
            >
              <span className="block pt-2">{config.brideName}</span>
              <span className="flex items-center justify-center lg:justify-start gap-4 lg:pl-20 -my-1">
                <span className="h-px w-10 bg-[#A8834E]/50" aria-hidden="true" />
                <span className="font-serif italic text-[0.42em] text-[#A8834E] leading-none">
                  &amp;
                </span>
                <span className="h-px w-10 bg-[#A8834E]/50" aria-hidden="true" />
              </span>
              <span className="block lg:pl-24">{config.groomName}</span>
            </motion.h1>
            </div>

            <div className="order-3">

            {/* Formal date block */}
            <motion.div {...rise(0.22)} className="lg:mt-9 flex justify-center lg:justify-start">
              {dateParts ? (
                <div className="inline-flex flex-col items-center">
                  <div className="flex items-center gap-4 sm:gap-7 whitespace-nowrap">
                    <span className="w-24 sm:w-32 py-2.5 border-y border-[#A8834E]/45 text-center text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.26em] uppercase text-[#2B1F1C]">
                      {dateParts.weekday}
                    </span>
                    <span className="font-serif text-6xl sm:text-7xl font-medium text-[#88292F] leading-none tabular-nums">
                      {dateParts.day}
                    </span>
                    <span className="w-24 sm:w-32 py-2.5 border-y border-[#A8834E]/45 text-center text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.26em] uppercase text-[#2B1F1C]">
                      Tháng {dateParts.month}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] sm:text-xs tracking-[0.24em] sm:tracking-[0.3em] uppercase text-[#2B1F1C] whitespace-nowrap">
                    Năm {dateParts.year}
                    <span className="mx-3 text-[#A8834E]" aria-hidden="true">
                      ◆
                    </span>
                    Lúc {dateParts.time}
                  </p>
                  <p className="mt-2 font-serif italic text-[15px] sm:text-base text-[#75675E] whitespace-nowrap">
                    ({config.lunarDisplayDate})
                  </p>
                </div>
              ) : (
                <p className="font-serif text-2xl text-[#88292F]">{config.displayDate}</p>
              )}
            </motion.div>

            <motion.p
              {...rise(0.32)}
              className="mt-8 text-[15px] leading-[1.85] text-[#75675E] max-w-xl mx-auto lg:mx-0 text-balance"
            >
              {config.heroQuote}
            </motion.p>

            <motion.div
              {...rise(0.42)}
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-[18rem] sm:max-w-none mx-auto lg:mx-0"
            >
              <a href="#xac-nhan" className="btn btn-primary">
                <span>Xác Nhận Tham Dự</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
              <button type="button" onClick={onReplayIntro} className="btn btn-outline">
                Xem Lại Phong Bì
              </button>
            </motion.div>
            </div>
          </div>

          {/* Arched portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="order-2 lg:order-none lg:col-span-6 xl:col-span-5 xl:col-start-8 relative w-full max-w-[19rem] sm:max-w-[460px] mx-auto"
          >
            <div
              aria-hidden="true"
              className="arch-outline absolute -inset-3 sm:-inset-4 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3"
            />
            <div className="arch relative aspect-[4/5] bg-[#E9DFCE] shadow-[var(--shadow-lift)]">
              <motion.div style={{ scale: imageScale }} className="w-full h-full">
                <ResilientImage
                  src={config.heroImage}
                  alt={`Ảnh cưới ${config.brideName} và ${config.groomName}`}
                  loading="eager"
                  className="w-full h-full object-cover object-bottom"
                  fallbackTitle={`${config.brideName} & ${config.groomName}`}
                />
              </motion.div>
              <div
                aria-hidden="true"
                className="absolute inset-0 ring-1 ring-inset ring-white/25 arch pointer-events-none"
              />
            </div>

            {/* Wax-seal badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
              className="absolute -bottom-5 -left-2 sm:-left-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#A03A42] via-[#88292F] to-[#5E1820] shadow-[0_18px_30px_-12px_rgba(94,24,32,0.7)] flex items-center justify-center"
            >
              <div className="w-[82%] h-[82%] rounded-full border border-[#EBD9B4]/45 flex flex-col items-center justify-center text-[#FBF3E4]">
                <span className="text-[6px] sm:text-[7px] tracking-[0.2em] uppercase whitespace-nowrap text-[#EBD9B4]">
                  Save the date
                </span>
                <span className="font-serif italic text-xl sm:text-2xl leading-tight mt-0.5">
                  {config.monogram}
                </span>
              </div>
            </motion.div>

            <p className="mt-8 sm:mt-9 text-center font-serif italic text-[15px] sm:text-lg text-[#75675E] whitespace-nowrap">
              {config.brideFullName} <span className="text-[#A8834E] not-italic">♡</span>{' '}
              {config.groomFullName}
            </p>
          </motion.div>
        </div>

        {/* Countdown band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="wine-surface relative mt-12 lg:mt-20 rounded-[1.75rem] px-5 py-8 sm:px-12 sm:py-10 shadow-[var(--shadow-lift)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-2.5 rounded-[1.25rem] border border-[#EBD9B4]/18 pointer-events-none"
          />
          {timeLeft.isPast ? (
            <p className="relative font-serif italic text-2xl sm:text-3xl text-[#FBF3E4] text-center text-balance">
              Ngày trọng đại đã chính thức diễn ra — Cảm ơn bạn đã đồng hành!
            </p>
          ) : (
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center lg:text-left">
                <Ornament className="text-[#C9A66B] mx-auto lg:mx-0" />
                <p className="mt-3 font-serif italic text-2xl sm:text-[1.75rem] text-[#FBF3E4] leading-snug">
                  Cùng đếm ngược
                  <br />
                  đến ngày chung đôi
                </p>
              </div>
              <div className="lg:col-span-8 grid grid-cols-4 gap-1 sm:gap-0">
                <CountdownUnit value={timeLeft.days} label="Ngày" />
                <CountdownUnit value={timeLeft.hours} label="Giờ" />
                <CountdownUnit value={timeLeft.minutes} label="Phút" />
                <CountdownUnit value={timeLeft.seconds} label="Giây" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
