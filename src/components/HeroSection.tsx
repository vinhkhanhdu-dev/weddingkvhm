import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, ArrowDownRight } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage, resolveAssetUrl } from './ResilientImage';

interface HeroSectionProps {
  config: WeddingConfig;
  onOpenCustomizer: () => void;
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

const CountdownUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const formatted = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center justify-center py-5 px-4 border-r border-[#E5DDD0] last:border-r-0">
      <div className="relative h-11 sm:h-12 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] tabular-nums"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs tracking-[0.16em] uppercase text-[#6B655D] mt-1">
        {label}
      </span>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onOpenCustomizer,
  onReplayIntro,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateRemaining(config.weddingDateISO)
  );

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
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  return (
    <section
      id="top"
      ref={heroRef}
      className="pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#E5DDD0]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Split-column Hero with equal height via items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-4 lg:py-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#9A7B4F] mb-6"
              >
                <span>Thiệp Mời Thành Hôn</span>
                <span aria-hidden="true">·</span>
                <span>09:00 · {config.displayDate}</span>
                <span aria-hidden="true">·</span>
                <span>{config.city}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl sm:text-6xl xl:text-[4.25rem] font-medium text-[#1C1917] leading-[1.06] tracking-tight text-balance"
              >
                {config.brideName}
                <span className="flex items-center gap-3 italic text-[#88292F] font-normal my-1.5">
                  <img
                    src={resolveAssetUrl('/assets/aistudio/Deep_Red_Heart_Outline__1__8e6057b1.png')}
                    alt=""
                    aria-hidden="true"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
                  />
                  <span>{config.groomName}</span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-base sm:text-[17px] leading-[1.7] text-[#6B655D] max-w-xl"
              >
                {config.heroQuote}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 pt-8 border-t border-[#E5DDD0] flex flex-wrap items-center gap-4"
            >
              <a
                href="#xac-nhan"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#88292F] text-[#FBF9F5] text-sm font-medium tracking-wide rounded-sm hover:bg-[#702025] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Xác Nhận Tham Dự</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-[#D8CBB8] text-[#1C1917] text-sm font-medium rounded-sm hover:border-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#88292F]" />
                <span>Tùy Chỉnh Thiệp Của Bạn</span>
              </button>

              <button
                type="button"
                onClick={onReplayIntro}
                className="text-xs text-[#6B655D] hover:text-[#1C1917] underline underline-offset-4 cursor-pointer whitespace-nowrap ml-auto sm:ml-2"
              >
                Xem lại phong bì
              </button>
            </motion.div>
          </div>

          {/* Right Editorial Portrait with Scroll Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[640px] overflow-hidden rounded-sm bg-[#EAE2D3]"
          >
            <motion.div
              style={{ scale: imageScale, y: imageY }}
              className="w-full h-full"
            >
              <ResilientImage
                src={config.heroImage}
                alt={`Ảnh cưới ${config.brideName} và ${config.groomName}`}
                loading="eager"
                className="w-full h-full object-cover object-top"
                fallbackTitle={`${config.brideName} & ${config.groomName}`}
              />
            </motion.div>

            {/* Measured contrast scrim for bottom editorial caption */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-[#FBF9F5]">
              <p className="text-xs tracking-[0.16em] uppercase text-[#FBF9F5]/80">
                Save the Date · {config.lunarDisplayDate}
              </p>
              <p className="font-serif italic text-lg mt-1">
                {config.brideFullName} &amp; {config.groomFullName}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Countdown Strip directly below Hero Split */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 bg-[#F4EFE6] border border-[#E5DDD0] rounded-sm grid grid-cols-2 sm:grid-cols-4"
        >
          {timeLeft.isPast ? (
            <div className="col-span-2 sm:col-span-4 py-6 px-6 text-center">
              <p className="font-serif italic text-2xl text-[#88292F]">
                Ngày trọng đại đã chính thức diễn ra — Cảm ơn bạn đã đồng hành!
              </p>
            </div>
          ) : (
            <>
              <CountdownUnit value={timeLeft.days} label="Ngày" />
              <CountdownUnit value={timeLeft.hours} label="Giờ" />
              <CountdownUnit value={timeLeft.minutes} label="Phút" />
              <CountdownUnit value={timeLeft.seconds} label="Giây" />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};
