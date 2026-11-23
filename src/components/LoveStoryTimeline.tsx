import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { WeddingConfig } from '../types/wedding';
import { ResilientImage } from './ResilientImage';

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
      className="py-20 sm:py-28 bg-[#F4EFE6]/55 border-b border-[#E5DDD0]"
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-3">
            Chặng Đường Đã Qua
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1917] text-balance">
            Câu Chuyện Tình Yêu
          </h2>
          <p className="mt-4 text-[15px] text-[#6B655D] leading-relaxed">
            Mỗi cột mốc đều là một mảnh ghép dịu dàng đưa chúng mình đến ngày hôm nay.
          </p>
        </motion.div>

        {/* Scroll-driven Timeline Spine */}
        <div className="relative">
          {/* Static background spine */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[#E5DDD0]"
          />
          {/* Animated active spine */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: spineScale, transformOrigin: 'top center' }}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-1/2 bg-[#88292F]"
          />

          <div className="space-y-16 sm:space-y-24">
            {config.storyChapters.map((chapter, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={chapter.id}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                >
                  {/* Timeline center marker on desktop */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden="true"
                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#FBF9F5] border border-[#88292F] items-center justify-center text-[11px] font-serif italic text-[#88292F]"
                  >
                    0{index + 1}
                  </motion.div>

                  {/* Image Column */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -28 : 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className={`md:col-span-5 ${
                      isEven ? 'md:order-1 md:pr-6' : 'md:order-2 md:col-start-8 md:pl-6'
                    }`}
                  >
                    <div className="overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#EAE2D3] aspect-[3/4]">
                      <ResilientImage
                        src={chapter.image}
                        alt={chapter.title}
                        className="w-full h-full object-cover object-[50%_18%] hover:scale-[1.03] transition-transform duration-700"
                        fallbackTitle={chapter.title}
                      />
                    </div>
                  </motion.div>

                  {/* Text Column */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 28 : -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`md:col-span-5 ${
                      isEven ? 'md:order-2 md:col-start-8 md:pl-6' : 'md:order-1 md:pr-6 md:text-right'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#9A7B4F] mb-2 ${
                        isEven ? '' : 'md:justify-end'
                      }`}
                    >
                      <span>{chapter.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{chapter.location}</span>
                    </div>
                    <h3 className="font-serif text-3xl font-medium text-[#1C1917] text-balance">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.75] text-[#6B655D]">
                      {chapter.description}
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
