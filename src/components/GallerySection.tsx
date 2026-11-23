import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '../types/wedding';
import { ResilientImage } from './ResilientImage';

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
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % photos.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, photos.length]);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section
      id="khoanh-khac"
      className="py-20 sm:py-28 bg-[#F4EFE6]/55 border-b border-[#E5DDD0]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-3">
              Album Kỷ Niệm
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1917] text-balance">
              Khoảnh Khắc Hạnh Phúc
            </h2>
          </div>
          <p className="text-sm text-[#6B655D] max-w-sm">
            Nhấn vào từng khung hình để xem kích thước lớn và lướt trọn bộ ảnh cưới.
          </p>
        </motion.div>

        {/* Editorial Portrait Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => {
            const figNum = String(index + 1).padStart(2, '0');
            return (
              <motion.figure
                key={photo.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: Math.min((index % 4) * 0.08, 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Xem ảnh ${photo.caption}`}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#EAE2D3] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88292F]"
                >
                  <ResilientImage
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover object-[50%_18%] group-hover:scale-[1.03] transition-transform duration-700"
                    fallbackTitle={photo.caption}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FBF9F5]/95 text-[#1C1917] text-xs font-medium rounded-sm shadow-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Phóng to</span>
                    </span>
                  </div>
                </button>

                <figcaption className="mt-2.5 flex items-center justify-between gap-2 text-xs text-[#6B655D]">
                  <span className="font-serif italic text-sm text-[#1C1917] truncate">
                    Fig. {figNum} — {photo.caption}
                  </span>
                  <span className="shrink-0">{photo.location}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Animated Lightbox */}
      <AnimatePresence>
        {activePhoto && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-[#141210]/94 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.caption}
          >
            <div className="w-full max-w-5xl flex items-center justify-between text-[#FBF9F5] mb-4">
              <div className="text-xs tracking-[0.14em] uppercase text-[#FBF9F5]/75 tabular-nums">
                {selectedIndex + 1} / {photos.length} · {activePhoto.location}
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Đóng trình xem ảnh"
                className="p-2 text-[#FBF9F5]/80 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
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
                className="absolute left-2 sm:-left-12 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-[75vh] overflow-hidden rounded-sm border border-white/15 bg-black"
              >
                <ResilientImage
                  src={activePhoto.src}
                  alt={activePhoto.caption}
                  className="max-h-[75vh] w-auto object-contain mx-auto"
                  fallbackTitle={activePhoto.caption}
                />
              </motion.div>

              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
                aria-label="Ảnh tiếp theo"
                className="absolute right-2 sm:-right-12 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 font-serif italic text-lg text-[#FBF9F5]/90 text-center">
              {activePhoto.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
