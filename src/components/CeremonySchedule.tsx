import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Calendar, Copy, Check, ArrowUpRight } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage } from './ResilientImage';
import { EASE, SectionHeading } from './Ornament';

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

  if (!activeCeremony) return null;

  const mapHref =
    activeCeremony.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      activeCeremony.mapQuery || activeCeremony.address
    )}`;

  return (
    <section id="lich-trinh" className="py-16 sm:py-28 bg-paper">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Thời Gian & Địa Điểm"
          title={
            <>
              Lịch Trình <em>Hôn Lễ</em>
            </>
          }
        />

        {/* Segmented control */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="no-scrollbar mt-8 mb-9 sm:mb-12 -mx-5 px-5 sm:mx-0 sm:px-0 flex overflow-x-auto"
        >
          <div
            role="tablist"
            aria-label="Chọn nghi thức hôn lễ"
            className="inline-flex shrink-0 mx-auto items-center gap-1 p-1.5 bg-linen border border-hairline rounded-lg"
          >
            {config.ceremonies.map((ceremony) => {
              const isSelected = ceremony.id === activeCeremony.id;
              return (
                <button
                  key={ceremony.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={(e) => {
                    setActiveId(ceremony.id);
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }}
                  className={`relative px-5 py-3 sm:py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected ? 'text-on-seal' : 'text-muted hover:text-seal'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="ceremonyTabIndicator"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-gradient-to-b from-seal-light to-seal-deep shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--color-seal)_70%,transparent)]"
                    />
                  )}
                  <span className="relative z-10">{ceremony.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCeremony.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
          >
            {/* Venue card */}
            <div className="wine-surface relative lg:col-span-5 rounded-lg p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[var(--shadow-lift)]">
              <div
                aria-hidden="true"
                className="absolute inset-2.5 rounded-lg border border-champagne/18 pointer-events-none"
              />
              <div className="relative">
                <p className="eyebrow eyebrow-rule-start !text-gold">{activeCeremony.label}</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream leading-tight mt-4 text-balance">
                  {activeCeremony.venueName}
                </h3>
                <p className="text-sm text-cream-muted/75 mt-3 leading-relaxed">
                  {activeCeremony.subtitle}
                </p>

                <dl className="mt-8 space-y-5 text-sm">
                  {[
                    {
                      icon: Calendar,
                      label: 'Ngày diễn ra',
                      main: activeCeremony.dateText,
                      sub: activeCeremony.lunarDate,
                    },
                    { icon: Clock, label: 'Khung giờ', main: activeCeremony.timeRange },
                    { icon: MapPin, label: 'Địa chỉ', main: activeCeremony.address },
                  ].map(({ icon: Icon, label, main, sub }) => (
                    <div key={label} className="flex items-start gap-3 sm:gap-4">
                      <span className="w-10 h-10 rounded-lg border border-champagne/30 flex items-center justify-center shrink-0 text-champagne">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="pt-0.5">
                        <dt className="text-[10px] tracking-[0.24em] uppercase text-gold">
                          {label}
                        </dt>
                        <dd className="mt-1 text-sm sm:text-[15px] text-cream leading-relaxed tabular-nums">
                          {main}
                        </dd>
                        {sub && (
                          <dd className="font-serif italic text-[15px] text-cream-muted/70">{sub}</dd>
                        )}
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm bg-champagne text-wine hover:bg-cream"
                >
                  <span>Chỉ Đường</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyAddress(activeCeremony.id, activeCeremony.address)}
                  className="btn btn-sm btn-gold"
                >
                  {copiedId === activeCeremony.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã Sao Chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép Địa Chỉ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Timeline + venue photo */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="card p-6 sm:p-9">
                <ol className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-[5px] top-2 bottom-2 w-px bg-hairline"
                  />
                  {activeCeremony.events.map((ev, idx) => (
                    <motion.li
                      key={ev.time + ev.title}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + idx * 0.09, ease: EASE }}
                      className="relative pl-9 pb-7 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[9px] w-[11px] h-[11px] rounded-full bg-surface border-2 border-seal"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                        <span className="font-serif text-2xl font-semibold text-seal tabular-nums sm:w-20 shrink-0">
                          {ev.time}
                        </span>
                        <div>
                          <h4 className="font-serif text-[17px] sm:text-xl font-semibold text-ink">
                            {ev.title}
                          </h4>
                          <p className="text-sm text-muted mt-1.5 leading-relaxed">
                            {ev.detail}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <div className="relative flex-1 min-h-64 sm:min-h-72 overflow-hidden rounded-lg bg-sand shadow-[var(--shadow-soft)]">
                <ResilientImage
                  src={config.venueImage}
                  alt={`Không gian ${activeCeremony.venueName}`}
                  className="absolute inset-0 w-full h-full object-cover object-[50%_32%]"
                  fallbackTitle={activeCeremony.venueName}
                />
                <div className="absolute inset-x-0 bottom-0 px-6 pt-16 pb-5 bg-gradient-to-t from-wine-deep/85 via-wine-deep/35 to-transparent text-cream flex items-end justify-between gap-4">
                  <span className="font-serif italic text-lg">{activeCeremony.venueName}</span>
                  <span className="text-[11px] tracking-[0.2em] uppercase tabular-nums text-champagne shrink-0">
                    {activeCeremony.timeRange}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
