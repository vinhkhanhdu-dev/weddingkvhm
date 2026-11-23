import React, { useEffect, useState } from 'react';
import { Menu, X, MailOpen, CalendarHeart, PenLine, Images, Gift } from 'lucide-react';
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
  { href: '#mung-cuoi', label: 'Mừng Cưới' },
];

const DOCK_ITEMS = [
  { id: 'gia-dinh', label: 'Lời mời', icon: MailOpen, primary: false },
  { id: 'lich-trinh', label: 'Hôn lễ', icon: CalendarHeart, primary: false },
  { id: 'xac-nhan', label: 'Xác nhận', icon: PenLine, primary: true },
  { id: 'khoanh-khac', label: 'Album', icon: Images, primary: false },
  { id: 'mung-cuoi', label: 'Mừng cưới', icon: Gift, primary: false },
];

/** Thumb-reach quick navigation for phones and tablets. */
const MobileDock: React.FC = () => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="lg:hidden fixed z-40 inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="mx-auto max-w-md grid grid-cols-5 items-end px-1.5 py-1.5 rounded-[1.75rem] bg-surface/92 backdrop-blur-xl border border-hairline shadow-[0_16px_40px_-14px_color-mix(in_srgb,var(--color-shadow)_50%,transparent)]">
        {DOCK_ITEMS.map(({ id, label, icon: Icon, primary }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`flex flex-col items-center gap-1 pt-1.5 pb-1 text-[10px] font-medium leading-none whitespace-nowrap transition-colors ${
                  isActive || primary ? 'text-seal' : 'text-muted'
                }`}
              >
                {primary ? (
                  <span className="-mt-7 w-[3.25rem] h-[3.25rem] rounded-full bg-gradient-to-br from-seal-light via-seal to-seal-deep text-on-seal flex items-center justify-center ring-4 ring-surface shadow-[0_10px_20px_-8px_color-mix(in_srgb,var(--color-seal-deep)_80%,transparent)]">
                    <Icon className="w-5 h-5" />
                  </span>
                ) : (
                  <span
                    className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-seal/10' : ''
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </span>
                )}
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ brideName, groomName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 border-b ${
        scrolled || mobileOpen
          ? 'bg-paper/90 border-hairline shadow-[0_10px_30px_-22px_color-mix(in_srgb,var(--color-shadow)_45%,transparent)]'
          : 'bg-paper/60 border-transparent'
      }`}
    >
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-seal via-gold to-seal"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-3 sm:gap-6">
        <a
          href="#top"
          className="font-script text-[clamp(1.125rem,5.4vw,1.5rem)] sm:text-[1.625rem] text-seal whitespace-nowrap min-w-0 pt-1"
        >
          {brideName} <span className="font-serif text-[0.8em] text-bronze">&amp;</span> {groomName}
        </a>

        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.18em] uppercase text-muted"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-2 hover:text-seal transition-colors whitespace-nowrap after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-px after:w-0 after:bg-seal hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a href="#xac-nhan" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Xác Nhận Tham Dự
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg border border-hairline text-ink hover:text-seal hover:border-seal/40 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t border-hairline"
          >
            <div className="px-6 py-5 flex flex-col">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 font-serif text-xl text-ink border-b border-hairline/70 last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#xac-nhan"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-4"
              >
                Xác Nhận Tham Dự
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <MobileDock />
    </>
  );
};
