import React from 'react';
import { motion } from 'motion/react';
import { WeddingConfig } from '../types/wedding';
import { resolveAssetUrl } from './ResilientImage';
import { EASE, Ornament } from './Ornament';

interface FamilyInvitationProps {
  config: WeddingConfig;
}

interface FamilyColumnProps {
  side: string;
  father: string;
  mother: string;
  address: string;
  rank: string;
  fullName: string;
  delay: number;
}

const FamilyColumn: React.FC<FamilyColumnProps> = ({
  side,
  father,
  mother,
  address,
  rank,
  fullName,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.75, delay, ease: EASE }}
    className="flex flex-col items-center text-center"
  >
    <span className="inline-flex px-4 py-1.5 rounded-lg bg-seal/[0.07] text-[10px] font-medium tracking-[0.28em] uppercase text-seal">
      {side}
    </span>
    <div className="mt-5 min-h-[4.5rem] flex flex-col justify-center">
      {father && (
        <p className="font-serif text-xl sm:text-2xl font-medium text-ink leading-snug">
          {father}
        </p>
      )}
      {mother && (
        <p className="font-serif text-xl sm:text-2xl font-medium text-ink leading-snug">
          {mother}
        </p>
      )}
    </div>
    <p className="mt-3 text-[13px] leading-relaxed text-muted max-w-[17rem]">{address}</p>

    <Ornament className="text-bronze/70 mt-7" />

    <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-bronze">{rank}</p>
    <p className="font-script text-[clamp(1.375rem,6.4vw,1.75rem)] sm:text-[2rem] text-seal mt-1 pt-2 whitespace-nowrap">{fullName}</p>
  </motion.div>
);

export const FamilyInvitation: React.FC<FamilyInvitationProps> = ({ config }) => {
  const isDefaultCouple = config.brideName === 'Hoàng Mỹ' && config.groomName === 'Khánh Vinh';

  return (
    <section id="gia-dinh" className="py-16 sm:py-28 bg-paper">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8">
        <div className="card relative rounded-lg px-7 py-12 sm:px-14 sm:py-20 overflow-hidden">
          {/* Double-rule stationery frame */}
          <div
            aria-hidden="true"
            className="absolute inset-3 sm:inset-4 rounded-lg border border-bronze/35 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[1.125rem] sm:inset-6 rounded-lg border border-bronze/15 pointer-events-none"
          />

          <div className="relative text-center">
            {isDefaultCouple ? (
              <motion.img
                src={resolveAssetUrl('/assets/web/save-the-date-crest.png')}
                alt="Save The Date — Hoàng Mỹ & Khánh Vinh — 29/11/2026"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="theme-crest w-full max-w-[400px] h-auto object-contain mx-auto -mt-4"
              />
            ) : (
              <Ornament className="text-bronze mx-auto" />
            )}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-4"
            >
              <p className="eyebrow eyebrow-rule">Trân Trọng Báo Tin</p>
              <h2 className="display-title mt-4">
                Lễ Thành Hôn <em>&amp;</em> Vu Quy
              </h2>
              <p className="mt-4 text-[15px] leading-[1.8] text-muted max-w-xl mx-auto text-balance">
                {config.invitationGreeting}
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 md:gap-8 items-start">
              <FamilyColumn
                side="Nhà Trai"
                father={config.groomParents.father}
                mother={config.groomParents.mother}
                address={config.groomParents.address}
                rank={config.groomRank || 'Nhất nam'}
                fullName={config.groomFullName}
                delay={0.1}
              />

              <div
                aria-hidden="true"
                className="hidden md:flex flex-col items-center self-stretch text-bronze"
              >
                <span className="w-px flex-1 bg-gradient-to-b from-transparent via-bronze/40 to-bronze/40" />
                <span className="my-3 w-10 h-10 rounded-lg border border-bronze/45 flex items-center justify-center font-serif italic text-lg">
                  &amp;
                </span>
                <span className="w-px flex-1 bg-gradient-to-t from-transparent via-bronze/40 to-bronze/40" />
              </div>

              <FamilyColumn
                side="Nhà Gái"
                father={config.brideParents.father}
                mother={config.brideParents.mother}
                address={config.brideParents.address}
                rank={config.brideRank || 'Út nữ'}
                fullName={config.brideFullName}
                delay={0.2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
