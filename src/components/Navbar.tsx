import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';

interface NavbarProps {
  brideName: string;
  groomName: string;
}

const NAV_LINKS = [
  { href: '#gia-dinh', label: 'Lời Mời' },
  { href: '#cau-chuyen', label: 'Câu Chuyện' },
  { href: '#lich-trinh', label: 'Hôn Lễ' },
  { href: '#khoanh-khac', label: 'Album Ảnh' },
  { href: '#loi-chuc', label: 'Lưu Bút' },
];

export const Navbar: React.FC<NavbarProps> = ({ brideName, groomName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/92 backdrop-blur-md border-b border-[#E5DDD0]">
      {/* Scroll reading progress hairline */}
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#88292F]"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#top"
          className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88292F]"
        >
          {brideName} <span className="italic text-[#88292F]">&amp;</span> {groomName}
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B655D]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#88292F] hover:after:w-full after:transition-all after:duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#xac-nhan"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#88292F] text-[#FBF9F5] text-xs font-medium tracking-wide rounded-sm hover:bg-[#702025] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88292F]"
          >
            Xác Nhận Tham Dự
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            className="md:hidden p-2 text-[#1C1917] hover:text-[#88292F] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#E5DDD0] bg-[#FBF9F5] px-6 py-4 flex flex-col gap-3"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-[#1C1917] border-b border-[#E5DDD0]/60 last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#xac-nhan"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center justify-center px-4 py-2.5 bg-[#88292F] text-[#FBF9F5] text-xs font-medium rounded-sm"
            >
              Xác Nhận Tham Dự
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
