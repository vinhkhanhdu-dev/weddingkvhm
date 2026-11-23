import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  CheckCircle2,
  Gift,
  Copy,
  Check,
  Send,
  Landmark,
  Minus,
  Plus,
  Maximize2,
  Download,
  X,
} from 'lucide-react';
import { RsvpSubmission, WeddingConfig, WishEntry } from '../types/wedding';
import { EASE, SectionHeading } from './Ornament';

export function getVietQrUrl(bankName: string, accountNumber: string, ownerName: string): string | null {
  const cleanAcc = accountNumber.replace(/\s+/g, '');
  const normalizedBank = bankName.trim().toLowerCase();
  const bankMap: Record<string, string> = {
    vietcombank: 'VCB',
    vcb: 'VCB',
    techcombank: 'TCB',
    tcb: 'TCB',
    mb: 'MB',
    mbbank: 'MB',
    'mb bank': 'MB',
    acb: 'ACB',
    bidv: 'BIDV',
    vietinbank: 'ICB',
    icb: 'ICB',
    vpbank: 'VPB',
    tpbank: 'TPB',
    sacombank: 'STB',
    agribank: 'VBA',
    ocb: 'OCB',
    msb: 'MSB',
    hdbank: 'HDB',
    vib: 'VIB',
    shb: 'SHB',
    seabank: 'SEAB',
    eximbank: 'EIB',
  };
  const code = bankMap[normalizedBank];
  if (!code || !cleanAcc) return null;
  return `https://img.vietqr.io/image/${code}-${cleanAcc}-qr_only.png?accountName=${encodeURIComponent(
    ownerName
  )}&addInfo=${encodeURIComponent('Mung cuoi Hoang My & Khanh Vinh')}`;
}

const WISH_PREVIEW_COUNT = 4;

interface RsvpAndWishesProps {
  config: WeddingConfig;
  wishes: WishEntry[];
  /** Resolves once saved; rejects with a user-facing message when saving fails. */
  onAddWish: (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => Promise<void>;
  onHeartWish: (id: string) => void;
  /** Total confirmed guests to show under the form, or null to hide it. */
  attendingGuests: number | null;
  /** Resolves once saved; rejects with a user-facing message when saving fails. */
  onSubmitRsvp: (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => Promise<void>;
}

const errorMessage = (err: unknown) =>
  err instanceof Error && err.message ? err.message : 'Không gửi được, vui lòng thử lại.';

export const RsvpAndWishes: React.FC<RsvpAndWishesProps> = ({
  config,
  wishes,
  onAddWish,
  onHeartWish,
  attendingGuests,
  onSubmitRsvp,
}) => {
  // RSVP state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [ceremonyChoice, setCeremonyChoice] = useState(
    'Cả Lễ Thành Hôn (09:00) & Tiệc Rượu (13:00)'
  );
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryNote, setDietaryNote] = useState('');
  const [rsvpDone, setRsvpDone] = useState<RsvpSubmission | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // Wish state
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishSent, setWishSent] = useState(false);
  const [showAllWishes, setShowAllWishes] = useState(false);
  const [wishSubmitting, setWishSubmitting] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);

  // Gift copy & QR error state
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);
  const [failedQrMap, setFailedQrMap] = useState<Record<string, boolean>>({});
  const [zoomedQr, setZoomedQr] = useState<{
    src: string;
    role: string;
    ownerName: string;
    bankName: string;
    accountNumber: string;
  } | null>(null);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || rsvpSubmitting) return;
    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      attending,
      ceremonyChoice,
      guestCount: attending === 'yes' ? guestCount : 0,
      dietaryNote: dietaryNote.trim(),
    };
    setRsvpSubmitting(true);
    setRsvpError(null);
    try {
      await onSubmitRsvp(payload);
      setRsvpDone({
        ...payload,
        id: Date.now().toString(),
        submittedAt: 'Vừa xong',
      });
      setFullName('');
      setPhone('');
      setDietaryNote('');
    } catch (err) {
      setRsvpError(errorMessage(err));
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishMessage.trim() || wishSubmitting) return;
    setWishSubmitting(true);
    setWishError(null);
    try {
      await onAddWish({
        author: wishAuthor.trim(),
        relation: wishRelation.trim() || 'Khách mời thân thiết',
        message: wishMessage.trim(),
      });
      setWishAuthor('');
      setWishRelation('');
      setWishMessage('');
      setWishSent(true);
      window.setTimeout(() => setWishSent(false), 3800);
    } catch (err) {
      setWishError(errorMessage(err));
    } finally {
      setWishSubmitting(false);
    }
  };

  const handleCopyAccount = async (accNum: string) => {
    try {
      await navigator.clipboard.writeText(accNum.replace(/\s+/g, ''));
      setCopiedAcc(accNum);
      window.setTimeout(() => setCopiedAcc(null), 2200);
    } catch {
      setCopiedAcc(null);
    }
  };

  const toggleClass = (selected: boolean) =>
    `py-3 px-3 text-[11px] font-medium tracking-[0.1em] uppercase rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
      selected
        ? 'bg-seal text-on-seal border-seal shadow-[0_8px_18px_-10px_color-mix(in_srgb,var(--color-seal)_80%,transparent)]'
        : 'bg-surface text-muted border-hairline hover:border-seal/40 hover:text-seal'
    }`;

  return (
    <>
      <section id="xac-nhan" className="py-16 sm:py-28 bg-paper paper-texture">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* RSVP */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: EASE }}
              className="card lg:col-span-6 rounded-lg p-6 sm:p-10 lg:sticky lg:top-24"
            >
              <p className="eyebrow eyebrow-rule-start">Hồi Âm Tham Dự</p>
              <h2 className="display-title mt-4 !text-[clamp(2rem,3.6vw,2.75rem)]">
                Xác Nhận <em>Tham Dự</em>
              </h2>
              <p className="mt-4 text-sm text-muted leading-[1.8]">
                Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của chúng mình. Vui lòng phản hồi
                trước ngày 27 tháng 11 để gia đình chuẩn bị tiếp đón chu đáo nhất.
              </p>

              <AnimatePresence mode="wait">
                {rsvpDone ? (
                  <motion.div
                    key="rsvp-success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="mt-8 bg-linen/70 border border-hairline p-8 rounded-lg text-center"
                  >
                    <span className="w-14 h-14 mx-auto rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-success" />
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-ink mt-4">
                      Cảm ơn {rsvpDone.fullName}!
                    </h3>
                    <p className="text-sm text-muted mt-2 leading-[1.8]">
                      {rsvpDone.attending === 'yes'
                        ? `Gia đình đã ghi nhận xác nhận tham dự ${rsvpDone.ceremonyChoice} (${rsvpDone.guestCount} khách). Hẹn gặp bạn trong ngày vui!`
                        : 'Rất tiếc vì bạn chưa thể thu xếp tham dự. Cảm ơn bạn đã gửi lời hồi âm ấm áp đến cô dâu chú rể.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setRsvpDone(null)}
                      className="btn btn-outline btn-sm mt-6"
                    >
                      Gửi xác nhận cho khách khác
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="rsvp-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleRsvpSubmit}
                    className="mt-8 space-y-5"
                  >
                    <div>
                      <label htmlFor="rsvp-name" className="field-label">
                        Họ và tên khách mời *
                      </label>
                      <input
                        id="rsvp-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Minh Tuấn"
                        className="field"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="rsvp-phone" className="field-label">
                          Số điện thoại
                        </label>
                        <input
                          id="rsvp-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="090x xxx xxx"
                          className="field"
                        />
                      </div>

                      <div>
                        <span className="field-label">Bạn sẽ tham dự chứ?</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-pressed={attending === 'yes'}
                            onClick={() => setAttending('yes')}
                            className={toggleClass(attending === 'yes')}
                          >
                            Sẽ Tham Dự
                          </button>
                          <button
                            type="button"
                            aria-pressed={attending === 'no'}
                            onClick={() => setAttending('no')}
                            className={toggleClass(attending === 'no')}
                          >
                            Vắng Mặt
                          </button>
                        </div>
                      </div>
                    </div>

                    {attending === 'yes' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="rsvp-ceremony" className="field-label">
                            Nghi thức tham dự
                          </label>
                          <select
                            id="rsvp-ceremony"
                            value={ceremonyChoice}
                            onChange={(e) => setCeremonyChoice(e.target.value)}
                            className="field cursor-pointer"
                          >
                            {config.ceremonies.map((c) => (
                              <option key={c.id} value={c.label}>
                                {c.label} ({c.timeRange})
                              </option>
                            ))}
                            <option value="Cả Lễ Thành Hôn (09:00) & Tiệc Rượu (13:00)">
                              Cả Lễ Thành Hôn (09:00) &amp; Tiệc Rượu (13:00)
                            </option>
                          </select>
                        </div>

                        <div>
                          <span id="rsvp-count-label" className="field-label">
                            Số lượng người tham dự
                          </span>
                          <div
                            role="group"
                            aria-labelledby="rsvp-count-label"
                            className="flex items-center justify-between p-1 border border-hairline bg-surface rounded-lg"
                          >
                            <button
                              type="button"
                              onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                              aria-label="Giảm số khách"
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-seal hover:bg-linen cursor-pointer transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium tabular-nums" aria-live="polite">
                              {guestCount} khách
                            </span>
                            <button
                              type="button"
                              onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                              aria-label="Tăng số khách"
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-seal hover:bg-linen cursor-pointer transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="rsvp-note" className="field-label">
                        Lưu ý thực đơn / dị ứng (nếu có)
                      </label>
                      <input
                        id="rsvp-note"
                        type="text"
                        value={dietaryNote}
                        onChange={(e) => setDietaryNote(e.target.value)}
                        placeholder="Ví dụ: Ăn chay, không dùng hải sản..."
                        className="field"
                      />
                    </div>

                    {rsvpError && (
                      <p
                        role="alert"
                        className="px-4 py-3 rounded-lg bg-seal/[0.07] border border-seal/20 text-sm text-seal"
                      >
                        {rsvpError}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={rsvpSubmitting}
                        className="btn btn-primary w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait"
                      >
                        {rsvpSubmitting ? 'Đang Gửi…' : 'Gửi Xác Nhận'}
                      </button>

                      {attendingGuests !== null && attendingGuests > 0 && (
                        <span className="text-xs text-muted tabular-nums">
                          Đã có {attendingGuests} khách xác nhận tham dự
                        </span>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-9 pt-7 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="w-11 h-11 rounded-lg bg-seal/[0.08] text-seal flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-ink leading-tight">
                      Hộp Mừng Cưới
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Dành cho bạn bè ở xa muốn gửi quà mừng.
                    </p>
                  </div>
                </div>
                <a href="#mung-cuoi" className="btn btn-outline btn-sm shrink-0 w-full sm:w-auto">
                  Xem Số Tài Khoản
                </a>
              </div>
            </motion.div>

            {/* Guestbook */}
            <motion.div
              id="loi-chuc"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
              className="lg:col-span-6 lg:pt-10"
            >
              <p className="eyebrow eyebrow-rule-start">Sổ Lưu Bút</p>
              <h2 className="display-title mt-4 !text-[clamp(2rem,3.6vw,2.75rem)]">
                Lời <em>Chúc Phúc</em>
              </h2>

              <form onSubmit={handleWishSubmit} className="mt-7 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={wishAuthor}
                    onChange={(e) => setWishAuthor(e.target.value)}
                    placeholder="Tên của bạn *"
                    aria-label="Tên của bạn"
                    className="field"
                  />
                  <input
                    type="text"
                    value={wishRelation}
                    onChange={(e) => setWishRelation(e.target.value)}
                    placeholder="Mối quan hệ (Bạn thân, Đồng nghiệp...)"
                    aria-label="Mối quan hệ"
                    className="field"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder="Viết lời chúc tốt đẹp nhất gửi đến cô dâu chú rể..."
                  aria-label="Lời chúc"
                  className="field resize-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="sm:min-h-5" aria-live="polite">
                    {wishError && (
                      <span role="alert" className="text-xs font-medium text-seal">
                        {wishError}
                      </span>
                    )}
                    {wishSent && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-success"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Cảm ơn bạn đã gửi lời chúc phúc!</span>
                      </motion.span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={wishSubmitting}
                    className="btn btn-dark btn-sm w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{wishSubmitting ? 'Đang Gửi…' : 'Gửi Lời Chúc'}</span>
                  </button>
                </div>
              </form>

              <div className="thin-scroll mt-8 space-y-4 lg:max-h-[560px] lg:overflow-y-auto lg:pr-2 lg:-mr-2">
                <AnimatePresence initial={false}>
                  {(showAllWishes ? wishes : wishes.slice(0, WISH_PREVIEW_COUNT)).map((wish) => (
                    <motion.article
                      key={wish.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="relative p-6 bg-surface border border-hairline rounded-lg overflow-hidden"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 right-5 font-serif text-[7rem] leading-none text-gold/20 select-none"
                      >
                        ”
                      </span>
                      <p className="relative font-serif italic text-[1.2rem] leading-[1.6] text-ink">
                        {wish.message}
                      </p>
                      <div className="relative mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-seal-light to-seal-deep text-on-seal font-serif text-lg flex items-center justify-center shrink-0">
                            {wish.author.trim().charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-sans font-medium text-sm text-ink truncate">
                              {wish.author}
                            </h3>
                            <p className="text-xs text-muted mt-0.5 truncate">
                              {wish.relation} · {wish.createdAt}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onHeartWish(wish.id)}
                          aria-label={`Thả tim lời chúc của ${wish.author}`}
                          className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-seal border border-seal/20 hover:bg-seal/[0.07] rounded-lg transition-colors cursor-pointer tabular-nums shrink-0"
                        >
                          <Heart className="w-3.5 h-3.5 fill-seal/25 group-hover:fill-seal group-active:scale-125 transition-all" />
                          <span>{wish.hearts}</span>
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {wishes.length > WISH_PREVIEW_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAllWishes((v) => !v)}
                  aria-expanded={showAllWishes}
                  className="btn btn-outline btn-sm mt-5 w-full sm:w-auto"
                >
                  {showAllWishes
                    ? 'Thu Gọn'
                    : `Xem Thêm ${wishes.length - WISH_PREVIEW_COUNT} Lời Chúc`}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wedding gift / bank accounts */}
      <section id="mung-cuoi" className="py-16 sm:py-28 bg-linen border-t border-hairline">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <SectionHeading
            eyebrow="Gửi Trao Yêu Thương"
            title={
              <>
                Hộp <em>Mừng Cưới</em>
              </>
            }
            description="Nếu không thể đến chung vui trực tiếp, bạn có thể gửi tấm lòng mừng cưới qua thông tin tài khoản hoặc mã QR dưới đây."
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[920px] mx-auto">
            {config.bankAccounts.map((acc, idx) => {
              const qrUrl =
                acc.qrImage || getVietQrUrl(acc.bankName, acc.accountNumber, acc.ownerName);
              const qrKey = `${acc.role}:${qrUrl || ''}`;
              const showQr = Boolean(qrUrl) && !failedQrMap[qrKey];

              return (
                <motion.div
                  key={acc.role}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: EASE }}
                  className="card rounded-lg p-7 sm:p-8 flex flex-col items-center text-center"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-seal/[0.07] text-[10px] font-medium tracking-[0.24em] uppercase text-seal">
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                    <span>{acc.role}</span>
                  </span>

                  {showQr && qrUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setZoomedQr({
                            src: qrUrl,
                            role: acc.role,
                            ownerName: acc.ownerName,
                            bankName: acc.bankName,
                            accountNumber: acc.accountNumber,
                          })
                        }
                        aria-label={`Phóng to mã QR ${acc.role}`}
                        className="group relative mt-6 w-48 h-48 sm:w-52 sm:h-52 p-3 bg-white border border-hairline rounded-lg shadow-[var(--shadow-soft)] hover:border-seal/50 transition-colors cursor-pointer"
                      >
                        <img
                          key={qrKey}
                          src={qrUrl}
                          alt={`Mã QR chuyển khoản ${acc.role} — ${acc.ownerName}`}
                          loading="lazy"
                          onError={() =>
                            setFailedQrMap((prev) => ({ ...prev, [qrKey]: true }))
                          }
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-surface border border-hairline text-muted flex items-center justify-center group-hover:text-seal transition-colors">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </button>
                      <p className="text-[11px] text-muted mt-2.5">
                        Chạm vào mã QR để phóng to hoặc lưu ảnh
                      </p>
                    </>
                  )}

                  <h3 className="font-serif text-2xl font-medium text-ink mt-6 leading-tight">
                    {acc.bankName}
                  </h3>
                  {acc.branch && <p className="text-xs text-muted mt-1">{acc.branch}</p>}

                  <p className="mt-5 font-serif text-[1.625rem] font-semibold text-seal tabular-nums tracking-wide leading-none">
                    {acc.accountNumber}
                  </p>
                  <p className="mt-2.5 text-[11px] tracking-[0.2em] uppercase text-muted">
                    {acc.ownerName}
                  </p>

                  <div className="mt-7 w-full flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(acc.accountNumber)}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      {copiedAcc === acc.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã Sao Chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao Chép STK</span>
                        </>
                      )}
                    </button>

                    {showQr && qrUrl && (
                      <a
                        href={qrUrl}
                        download={`QR-${acc.bankName}-${acc.accountNumber.replace(/\s+/g, '')}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Lưu QR</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fullscreen QR lightbox */}
      <AnimatePresence>
        {zoomedQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedQr(null)}
            className="fixed inset-0 z-50 bg-wine-deep/85 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Mã QR ${zoomedQr.role}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.26, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="card relative w-full max-w-sm rounded-lg p-7 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setZoomedQr(null)}
                aria-label="Đóng mã QR"
                className="absolute right-4 top-4 w-9 h-9 rounded-lg border border-hairline text-muted hover:text-seal hover:border-seal/40 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-[10px] font-medium tracking-[0.24em] uppercase text-seal">
                {zoomedQr.role}
              </p>
              <h3 className="font-serif text-2xl font-medium text-ink mt-1.5 leading-tight">
                {zoomedQr.bankName}
              </h3>

              <div className="mt-5 mx-auto w-full max-w-[280px] aspect-square p-3 bg-white border border-hairline rounded-lg flex items-center justify-center">
                <img
                  src={zoomedQr.src}
                  alt={`Mã QR ${zoomedQr.ownerName}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="mt-5 font-serif text-[1.625rem] font-semibold text-seal tabular-nums tracking-wide leading-none">
                {zoomedQr.accountNumber}
              </p>
              <p className="mt-2.5 text-[11px] tracking-[0.2em] uppercase text-muted">
                {zoomedQr.ownerName}
              </p>

              <a
                href={zoomedQr.src}
                download={`QR-${zoomedQr.bankName}-${zoomedQr.accountNumber.replace(/\s+/g, '')}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm mt-6 w-full"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Lưu Mã QR</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
