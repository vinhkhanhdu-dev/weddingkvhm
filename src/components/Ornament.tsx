import React from 'react';
import { motion } from 'motion/react';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const Ornament: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 12"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    className={`w-28 h-3 ${className}`}
  >
    <path d="M0 6h44M76 6h44" strokeWidth="0.75" />
    <path d="M60 1.5 64.5 6 60 10.5 55.5 6Z" strokeWidth="0.9" />
    <circle cx="49.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="70.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Stylised double-happiness (song hỷ) mark drawn with plain strokes.
 * Hidden by default; the Song Hỷ themes switch it on via .theme-emblem in index.css.
 */
export const ThemeEmblem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span aria-hidden="true" className={`theme-emblem ${className}`}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="square"
    >
      {/* shared horizontals join the two halves */}
      <path d="M6 14h88M6 55h88" />
      {[0, 50].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          <path d="M25 5v19M11 24h28" />
          <rect x="13" y="32" width="24" height="13" />
          <path d="M18 60l3 7M32 60l-3 7M10 70h30" />
          <rect x="13" y="78" width="24" height="15" />
        </g>
      ))}
    </svg>
  </span>
);

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className = '',
}) => {
  const centered = align === 'center';
  const dark = tone === 'dark';
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`${centered ? 'text-center mx-auto' : ''} max-w-2xl ${className}`}
    >
      <p
        className={`eyebrow ${centered ? 'eyebrow-rule' : 'eyebrow-rule-start'} ${
          dark ? '!text-gold' : ''
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`display-title mt-4 ${dark ? '!text-cream [&_em]:!text-champagne' : ''}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15px] leading-[1.75] ${
            dark ? 'text-cream-muted/75' : 'text-muted'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};
