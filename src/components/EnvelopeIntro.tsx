import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveAssetUrl } from './ResilientImage';
import { ThemeEmblem } from './Ornament';

interface EnvelopeIntroProps {
  groomName: string;
  brideName: string;
  monogram: string;
  displayDate: string;
  city: string;
  onCelebrateOpen?: () => void;
  onOpenComplete: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  groomName,
  brideName,
  monogram,
  displayDate,
  city,
  onCelebrateOpen,
  onOpenComplete,
}) => {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'done'>('sealed');

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    onCelebrateOpen?.();
    window.setTimeout(() => {
      setStage('done');
      onOpenComplete();
    }, 1550);
  };

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 'opening' ? 1 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linen paper-texture px-4 overflow-hidden"
        >
          {/* Subtle paper grain overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(154, 123, 79, 0.08), transparent 45%), radial-gradient(circle at 80% 80%, rgba(136, 41, 47, 0.06), transparent 50%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[460px] flex flex-col items-center"
          >
            {/* Heading steps aside while the flap and card rise into its space */}
            <motion.div
              animate={stage === 'opening' ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <ThemeEmblem className="mb-5" />
              <p className="eyebrow eyebrow-rule text-center">Trân Trọng Kính Mời</p>
              <p className="font-script text-[clamp(1.5rem,7vw,2.5rem)] whitespace-nowrap text-seal mt-4 pt-2 text-center">
                {brideName} <span className="font-serif text-[0.8em] text-bronze">&amp;</span> {groomName}
              </p>
              <p className="mt-2 mb-9 text-[11px] tracking-[0.3em] uppercase text-muted text-center">
                {displayDate}
              </p>
            </motion.div>

            {/* 3D Envelope Wrapper */}
            <div
              className="relative w-full aspect-[4/2.8] cursor-pointer group"
              style={{ perspective: '1400px' }}
              onClick={handleOpen}
              role="button"
              tabIndex={0}
              aria-label="Nhấn để mở thiệp cưới"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen();
                }
              }}
            >
              {/* Back Envelope Body */}
              <div className="absolute inset-0 bg-[#EAE2D3] border border-[#D8CBB8] rounded-lg shadow-[0_40px_70px_-30px_color-mix(in_srgb,var(--color-shadow)_50%,transparent)]" />

              {/* Rising Inner Invitation Card */}
              <motion.div
                initial={{ y: 0, opacity: 0.95 }}
                animate={
                  stage === 'opening'
                    ? { y: '-46%', opacity: 1, scale: 1.03 }
                    : { y: 0, opacity: 0.95, scale: 1 }
                }
                transition={{
                  delay: stage === 'opening' ? 0.38 : 0,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-x-4 top-3 bottom-3 bg-[#FBF9F5] border border-[#E5DDD0] p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-md z-10"
              >
                <div className="w-full h-full border border-[#E5DDD0]/80 flex flex-col items-center justify-center px-3 py-3">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#9A7B4F] mb-1.5">
                    Thiệp Mời Thành Hôn
                  </span>
                  {brideName === 'Hoàng Mỹ' && groomName === 'Khánh Vinh' ? (
                    <img
                      src={resolveAssetUrl('/assets/web/save-the-date-envelope.png')}
                      alt="Hoàng Mỹ & Khánh Vinh — Save The Date 29/11/2026"
                      className="w-full max-w-[300px] h-auto object-contain my-1"
                    />
                  ) : (
                    <>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium tracking-tight">
                        {brideName} <span className="italic text-[#88292F]">&amp;</span> {groomName}
                      </h2>
                      <p className="text-xs text-[#6B655D] mt-2">
                        {displayDate} · {city}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Left & Right Side Flaps */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 50% 52%, 0 100%)',
                  backgroundColor: '#EFE8DB',
                  borderLeft: '1px solid #D8CBB8',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(100% 0, 50% 52%, 100% 100%)',
                  backgroundColor: '#EBE3D5',
                  borderRight: '1px solid #D8CBB8',
                }}
              />

              {/* Bottom Flap */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)',
                  backgroundColor: '#F3ECE0',
                }}
              />

              {/* Top Flap (3D Rotating) */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 30 }}
                animate={
                  stage === 'opening' ? { rotateX: -175, zIndex: 5 } : { rotateX: 0, zIndex: 30 }
                }
                transition={{
                  rotateX: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
                  // Once the flap passes vertical it belongs behind the rising card
                  zIndex: { delay: 0.26, duration: 0 },
                }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  clipPath: 'polygon(0 0, 100% 0, 50% 58%)',
                }}
                className="absolute inset-0 z-30 bg-[#F7F2E8] border-t border-[#D8CBB8] pointer-events-none"
              />

              {/* Embossed Crimson Wax Seal */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  stage === 'opening'
                    ? { scale: 0.7, opacity: 0, y: -14 }
                    : { scale: [1, 1.03, 1], opacity: 1 }
                }
                transition={
                  stage === 'opening'
                    ? { duration: 0.35, ease: 'easeOut' }
                    : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-40 w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-seal-light via-seal to-seal-deep shadow-[0_12px_22px_-8px_color-mix(in_srgb,var(--color-seal-deep)_75%,transparent)] flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full border border-on-seal/35 flex items-center justify-center">
                  <span className="font-serif italic text-sm text-on-seal tracking-wider">
                    {monogram}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <button type="button" onClick={handleOpen} className="btn btn-primary">
                Mở Thiệp Mời
              </button>
              <button
                type="button"
                onClick={() => {
                  onCelebrateOpen?.();
                  setStage('done');
                  onOpenComplete();
                }}
                className="text-xs text-muted hover:text-ink underline underline-offset-4 cursor-pointer"
              >
                Vào thẳng trang thiệp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
