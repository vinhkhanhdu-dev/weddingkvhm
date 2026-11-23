import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { GalleryPhoto } from '../types/wedding';
import { ResilientImage } from './ResilientImage';
import { EASE, SectionHeading } from './Ornament';

interface GallerySectionProps {
  photos: GalleryPhoto[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex, photos.length]);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section id="khoanh-khac" className="wine-surface py-16 sm:py-28 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Album Kỷ Niệm"
          title={
            <>
              Khoảnh Khắc <em>Hạnh Phúc</em>
            </>
          }
          description="Chạm vào từng khung hình để xem ảnh lớn và lướt trọn bộ ảnh cưới."
          className="mb-10 sm:mb-14"
        />

        {/* Staggered editorial grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 pb-6 sm:pb-10 lg:pb-12">
          {photos.map((photo, index) => {
            const figNum = String(index + 1).padStart(2, '0');
            return (
              <motion.figure
                key={photo.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.75,
                  delay: Math.min((index % 4) * 0.08, 0.24),
                  ease: EASE,
                }}
                className={`${index % 2 === 1 ? 'translate-y-6 sm:translate-y-10' : ''} ${
                  index % 4 === 1 || index % 4 === 3 ? 'lg:translate-y-12' : 'lg:translate-y-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Xem ảnh ${photo.caption}`}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#2A0B10] cursor-pointer ring-1 ring-[#EBD9B4]/15 focus-visible:outline-[#EBD9B4]"
                >
                  <ResilientImage
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover object-[50%_18%] group-hover:scale-[1.06] transition-transform duration-[1200ms] ease-out"
                    fallbackTitle={photo.caption}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F0709]/90 via-[#1F0709]/30 via-40% to-transparent to-65%" />
                  <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FBF3E4]/90 text-[#3B0F15] flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <Expand className="w-4 h-4" />
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 text-left">
                    <span className="block text-[10px] tracking-[0.22em] uppercase text-[#EBD9B4] tabular-nums">
                      {figNum}
                      <span className="hidden sm:inline"> · {photo.location}</span>
                    </span>
                    <span className="block font-serif italic text-[15px] sm:text-xl text-[#FBF3E4] mt-1 leading-snug text-balance">
                      {photo.caption}
                    </span>
                  </figcaption>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-[#150406]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.caption}
          >
            <div className="w-full max-w-5xl flex items-center justify-between text-[#FBF3E4] mb-4">
              <div className="text-[11px] tracking-[0.24em] uppercase text-[#C9A66B] tabular-nums">
                {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                {String(photos.length).padStart(2, '0')}
                <span className="hidden sm:inline text-[#FBF3E4]/60"> · {activePhoto.location}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Đóng trình xem ảnh"
                className="w-10 h-10 rounded-full border border-[#FBF3E4]/25 flex items-center justify-center text-[#FBF3E4]/85 hover:bg-[#FBF3E4] hover:text-[#3B0F15] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
                }
                aria-label="Ảnh trước"
                className="absolute left-0 z-10 hidden sm:flex w-11 h-11 rounded-full bg-[#150406]/60 border border-[#FBF3E4]/25 text-[#FBF3E4] flex items-center justify-center hover:bg-[#FBF3E4] hover:text-[#3B0F15] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) {
                    setSelectedIndex((selectedIndex + 1) % photos.length);
                  } else if (info.offset.x > 60) {
                    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
                  }
                }}
                className="max-h-[70svh] sm:max-h-[74vh] overflow-hidden rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing [&_img]:pointer-events-none"
              >
                <ResilientImage
                  src={activePhoto.src}
                  alt={activePhoto.caption}
                  loading="eager"
                  className="max-h-[70svh] sm:max-h-[74vh] w-auto object-contain mx-auto"
                  fallbackTitle={activePhoto.caption}
                />
              </motion.div>

              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
                aria-label="Ảnh tiếp theo"
                className="absolute right-0 z-10 hidden sm:flex w-11 h-11 rounded-full bg-[#150406]/60 border border-[#FBF3E4]/25 text-[#FBF3E4] flex items-center justify-center hover:bg-[#FBF3E4] hover:text-[#3B0F15] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-5 font-serif italic text-xl text-[#FBF3E4] text-center">
              {activePhoto.caption}
            </p>
            <p className="sm:hidden mt-2 text-[10px] tracking-[0.24em] uppercase text-[#FBF3E4]/55">
              ← Vuốt để xem ảnh khác →
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
