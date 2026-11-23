import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { MapPin } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage } from './ResilientImage';
import { EASE, SectionHeading } from './Ornament';

interface LoveStoryTimelineProps {
  config: WeddingConfig;
}

export const LoveStoryTimeline: React.FC<LoveStoryTimelineProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 80%'],
  });
  const spineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section
      id="cau-chuyen"
      ref={containerRef}
      className="py-16 sm:py-28 bg-[#F4EDE1] border-y border-[#E4D9C8]"
    >
      <div className="max-w-[1120px] mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Chặng Đường Đã Qua"
          title={
            <>
              Câu Chuyện <em>Tình Yêu</em>
            </>
          }
          description="Mỗi cột mốc đều là một mảnh ghép dịu dàng đưa chúng mình đến ngày hôm nay."
          className="mb-12 sm:mb-24"
        />

        <div className="relative">
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[#D9CBB5]"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: spineScale, transformOrigin: 'top center' }}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#88292F] to-[#C9A66B]"
          />

          <div className="space-y-16 sm:space-y-28">
            {config.storyChapters.map((chapter, index) => {
              const isEven = index % 2 === 0;
              const num = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={chapter.id}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    aria-hidden="true"
                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#F4EDE1] border border-[#88292F]/60 items-center justify-center font-serif italic text-base text-[#88292F] shadow-[0_0_0_6px_#F4EDE1]"
                  >
                    {num}
                  </motion.div>

                  {/* Photo */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -32 : 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className={`relative w-full max-w-[19rem] sm:max-w-[380px] mx-auto ${
                      isEven ? 'md:order-1 md:mr-0' : 'md:order-2 md:ml-0'
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className={`arch-outline absolute -inset-3 ${
                        isEven ? '-translate-x-2' : 'translate-x-2'
                      } translate-y-2`}
                    />
                    <div className="arch relative aspect-[3/4] bg-[#E9DFCE] shadow-[var(--shadow-lift)] group">
                      <ResilientImage
                        src={chapter.image}
                        alt={chapter.title}
                        className="w-full h-full object-cover object-[50%_18%] group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                        fallbackTitle={chapter.title}
                      />
                    </div>
                  </motion.div>

                  {/* Copy */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 32 : -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
                    className={`relative text-center ${
                      isEven ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="block font-serif italic text-7xl sm:text-8xl leading-none text-[#C9A66B]/35 select-none"
                    >
                      {num}
                    </span>
                    <p className="eyebrow mt-3">{chapter.dateLabel}</p>
                    <h3 className="font-serif text-[clamp(1.4rem,6.9vw,1.875rem)] sm:text-[2.5rem] font-medium text-[#2B1F1C] leading-tight mt-3 text-balance">
                      {chapter.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.85] text-[#75675E]">
                      {chapter.description}
                    </p>
                    <p
                      className={`mt-5 inline-flex items-center gap-1.5 text-xs text-[#88292F] ${
                        isEven ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="tracking-wide">{chapter.location}</span>
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
