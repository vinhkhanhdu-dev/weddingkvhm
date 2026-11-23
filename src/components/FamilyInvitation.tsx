import React from 'react';
import { motion } from 'motion/react';
import { WeddingConfig } from '../types/wedding';
import { resolveAssetUrl } from './ResilientImage';

interface FamilyInvitationProps {
  config: WeddingConfig;
}

export const FamilyInvitation: React.FC<FamilyInvitationProps> = ({ config }) => {
  return (
    <section id="gia-dinh" className="py-20 sm:py-24 bg-[#FBF9F5] border-b border-[#E5DDD0]">
      <div className="max-w-[960px] mx-auto px-6 text-center">
        {/* Animated Save The Date Calligraphy Crest */}
        <div className="flex justify-center mb-6">
          {config.brideName === 'Hoàng Mỹ' && config.groomName === 'Khánh Vinh' ? (
            <motion.img
              src={resolveAssetUrl('/assets/aistudio/Save_the_Date_Calligraphy_Design_90b8180c.png')}
              alt="Save The Date — Hoàng Mỹ & Khánh Vinh — 29/11/2026"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[380px] h-auto object-contain"
            />
          ) : (
            <svg
              width="92"
              height="56"
              viewBox="0 0 92 56"
              fill="none"
              aria-hidden="true"
              className="text-[#9A7B4F]"
            >
              <motion.path
                d="M46 50 C46 32, 32 18, 12 14"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M46 50 C46 32, 60 18, 80 14"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="40"
                cy="22"
                r="9"
                stroke="#88292F"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              <motion.circle
                cx="52"
                cy="22"
                r="9"
                stroke="#88292F"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.35 }}
              />
            </svg>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-3">
            Trân Trọng Báo Tin
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] text-balance">
            Lễ Thành Hôn &amp; Vu Quy
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#6B655D] max-w-2xl mx-auto">
            {config.invitationGreeting}
          </p>
        </motion.div>

        {/* Two Families Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-10 border-t border-[#E5DDD0] items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F4EFE6]/65 border border-[#E5DDD0] p-8 rounded-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-[#9A7B4F]">
                Nhà Trai
              </span>
              {config.groomParents.father && (
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-3">
                  {config.groomParents.father}
                </h3>
              )}
              {config.groomParents.mother && (
                <h3
                  className={`font-serif text-2xl font-medium text-[#1C1917] ${
                    config.groomParents.father ? 'mt-1' : 'mt-3'
                  }`}
                >
                  {config.groomParents.mother}
                </h3>
              )}
              <p className="text-xs text-[#6B655D] mt-4 leading-relaxed">
                {config.groomParents.address}
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[#E5DDD0]">
              <span className="text-xs text-[#6B655D]">
                {config.groomRank || 'Nhất nam'}
              </span>
              <p className="font-serif italic text-2xl text-[#88292F] mt-1">
                {config.groomFullName}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F4EFE6]/65 border border-[#E5DDD0] p-8 rounded-sm flex flex-col justify-between"
          >
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-[#9A7B4F]">
                Nhà Gái
              </span>
              {config.brideParents.father && (
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-3">
                  {config.brideParents.father}
                </h3>
              )}
              {config.brideParents.mother && (
                <h3
                  className={`font-serif text-2xl font-medium text-[#1C1917] ${
                    config.brideParents.father ? 'mt-1' : 'mt-3'
                  }`}
                >
                  {config.brideParents.mother}
                </h3>
              )}
              <p className="text-xs text-[#6B655D] mt-4 leading-relaxed">
                {config.brideParents.address}
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[#E5DDD0]">
              <span className="text-xs text-[#6B655D]">
                {config.brideRank || 'Út nữ'}
              </span>
              <p className="font-serif italic text-2xl text-[#88292F] mt-1">
                {config.brideFullName}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
