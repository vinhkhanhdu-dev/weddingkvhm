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
          dark ? '!text-[#C9A66B]' : ''
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`display-title mt-4 ${dark ? '!text-[#FBF3E4] [&_em]:!text-[#EBD9B4]' : ''}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15px] leading-[1.75] ${
            dark ? 'text-[#E9D9C4]/75' : 'text-[#75675E]'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};
