import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Calendar, Copy, Check, ExternalLink } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage } from './ResilientImage';

interface CeremonyScheduleProps {
  config: WeddingConfig;
}

export const CeremonySchedule: React.FC<CeremonyScheduleProps> = ({ config }) => {
  const [activeId, setActiveId] = useState<string>(config.ceremonies[0]?.id || 'thanh-hon');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCeremony =
    config.ceremonies.find((c) => c.id === activeId) || config.ceremonies[0];

  const handleCopyAddress = async (id: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section id="lich-trinh" className="py-20 sm:py-28 bg-[#FBF9F5] border-b border-[#E5DDD0]">
      <div className="max-w-[1160px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-3">
              Thời Gian &amp; Địa Điểm
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1917] text-balance">
              Lịch Trình Hôn Lễ
            </h2>
          </div>

          {/* Interactive Segmented Control */}
          <div
            role="tablist"
            aria-label="Chọn nghi thức hôn lễ"
            className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-[#F4EFE6] border border-[#E5DDD0] rounded-sm"
          >
            {config.ceremonies.map((ceremony) => {
              const isSelected = ceremony.id === activeCeremony.id;
              return (
                <button
                  key={ceremony.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(ceremony.id)}
                  className={`relative px-4 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88292F] ${
                    isSelected ? 'text-[#FBF9F5]' : 'text-[#6B655D] hover:text-[#1C1917]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="ceremonyTabIndicator"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      className="absolute inset-0 bg-[#88292F] rounded-sm"
                    />
                  )}
                  <span className="relative z-10">{ceremony.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Active Ceremony Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCeremony.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
          >
            {/* Left Info & Venue Card */}
            <div className="lg:col-span-5 bg-[#F4EFE6]/70 border border-[#E5DDD0] p-7 sm:p-9 rounded-sm flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.16em] uppercase text-[#88292F] mb-2">
                  {activeCeremony.label}
                </p>
                <h3 className="font-serif text-3xl font-medium text-[#1C1917]">
                  {activeCeremony.venueName}
                </h3>
                <p className="text-sm text-[#6B655D] mt-2">{activeCeremony.subtitle}</p>

                <dl className="mt-7 space-y-4 pt-6 border-t border-[#E5DDD0] text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#9A7B4F] mt-0.5 shrink-0" />
                    <div>
                      <dt className="sr-only">Ngày diễn ra</dt>
                      <dd className="font-medium text-[#1C1917]">{activeCeremony.dateText}</dd>
                      <dd className="text-xs text-[#6B655D] mt-0.5">
                        ({activeCeremony.lunarDate})
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#9A7B4F] mt-0.5 shrink-0" />
                    <div>
                      <dt className="sr-only">Khung giờ</dt>
                      <dd className="font-medium text-[#1C1917] tabular-nums">
                        {activeCeremony.timeRange}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#9A7B4F] mt-0.5 shrink-0" />
                    <div>
                      <dt className="sr-only">Địa chỉ</dt>
                      <dd className="text-[#1C1917] leading-relaxed">{activeCeremony.address}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5DDD0] flex flex-wrap items-center gap-3">
                <a
                  href={
                    activeCeremony.mapUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeCeremony.mapQuery || activeCeremony.address
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded-sm hover:bg-[#36312E] transition-colors whitespace-nowrap"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyAddress(activeCeremony.id, activeCeremony.address)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] text-[#1C1917] text-xs font-medium rounded-sm hover:border-[#1C1917] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedId === activeCeremony.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>Đã sao chép địa chỉ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6B655D]" />
                      <span>Sao chép địa chỉ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Detailed Timeline + Venue Photo */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="divide-y divide-[#E5DDD0] border-t border-b border-[#E5DDD0]">
                {activeCeremony.events.map((ev, idx) => (
                  <motion.div
                    key={ev.time + ev.title}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8"
                  >
                    <span className="font-serif text-xl font-medium text-[#88292F] tabular-nums w-24 shrink-0">
                      {ev.time}
                    </span>
                    <div>
                      <h4 className="font-medium text-base text-[#1C1917]">{ev.title}</h4>
                      <p className="text-sm text-[#6B655D] mt-1 leading-relaxed">{ev.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative h-72 sm:h-80 overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#EAE2D3]">
                <ResilientImage
                  src={config.venueImage}
                  alt={`Không gian ${activeCeremony.venueName}`}
                  className="w-full h-full object-cover object-[50%_20%]"
                  fallbackTitle={activeCeremony.venueName}
                />
                <div className="absolute inset-x-0 bottom-0 px-5 py-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-[#FBF9F5] flex items-center justify-between text-xs">
                  <span>Không gian đón khách · {activeCeremony.venueName}</span>
                  <span className="tabular-nums opacity-85">{activeCeremony.timeRange}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
