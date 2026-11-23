import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, Gift, Copy, Check, Send, X } from 'lucide-react';
import { RsvpSubmission, WeddingConfig, WishEntry } from '../types/wedding';

interface RsvpAndWishesProps {
  config: WeddingConfig;
  wishes: WishEntry[];
  onAddWish: (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => void;
  onHeartWish: (id: string) => void;
  rsvps: RsvpSubmission[];
  onSubmitRsvp: (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => void;
}

export const RsvpAndWishes: React.FC<RsvpAndWishesProps> = ({
  config,
  wishes,
  onAddWish,
  onHeartWish,
  rsvps,
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

  // Wish state
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishSent, setWishSent] = useState(false);

  // Gift modal
  const [giftOpen, setGiftOpen] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      attending,
      ceremonyChoice,
      guestCount: attending === 'yes' ? guestCount : 0,
      dietaryNote: dietaryNote.trim(),
    };
    onSubmitRsvp(payload);
    setRsvpDone({
      ...payload,
      id: Date.now().toString(),
      submittedAt: 'Vừa xong',
    });
    setFullName('');
    setPhone('');
    setDietaryNote('');
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishMessage.trim()) return;
    onAddWish({
      author: wishAuthor.trim(),
      relation: wishRelation.trim() || 'Khách mời thân thiết',
      message: wishMessage.trim(),
    });
    setWishAuthor('');
    setWishRelation('');
    setWishMessage('');
    setWishSent(true);
    window.setTimeout(() => setWishSent(false), 3800);
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

  const totalAttendingGuests = rsvps
    .filter((r) => r.attending === 'yes')
    .reduce((acc, r) => acc + r.guestCount, 0);

  return (
    <section id="xac-nhan" className="py-20 sm:py-28 bg-[#FBF9F5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: RSVP Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-[#F4EFE6]/70 border border-[#E5DDD0] p-7 sm:p-10 rounded-sm"
          >
            <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-2">
              Hồi Âm Tham Dự
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917]">
              Xác Nhận Tham Dự
            </h2>
            <p className="mt-3 text-sm text-[#6B655D] leading-relaxed">
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
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 bg-[#FBF9F5] border border-[#E5DDD0] p-7 rounded-sm text-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#14532D] mx-auto mb-3" />
                  <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                    Cảm ơn {rsvpDone.fullName}!
                  </h3>
                  <p className="text-sm text-[#6B655D] mt-2 leading-relaxed">
                    {rsvpDone.attending === 'yes'
                      ? `Gia đình đã ghi nhận xác nhận tham dự ${rsvpDone.ceremonyChoice} (${rsvpDone.guestCount} khách). Hẹn gặp bạn trong ngày vui!`
                      : 'Rất tiếc vì bạn chưa thể thu xếp tham dự. Cảm ơn bạn đã gửi lời hồi âm ấm áp đến cô dâu chú rể.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRsvpDone(null)}
                    className="mt-6 px-5 py-2.5 border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm hover:border-[#1C1917] transition-colors cursor-pointer"
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
                  className="mt-7 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="rsvp-name"
                      className="block text-xs font-medium text-[#1C1917] mb-1.5"
                    >
                      Họ và tên khách mời *
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Minh Tuấn"
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="rsvp-phone"
                        className="block text-xs font-medium text-[#1C1917] mb-1.5"
                      >
                        Số điện thoại
                      </label>
                      <input
                        id="rsvp-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="090x xxx xxx"
                        className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                      />
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-[#1C1917] mb-1.5">
                        Bạn sẽ tham dự chứ?
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAttending('yes')}
                          className={`py-2.5 px-3 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                            attending === 'yes'
                              ? 'bg-[#88292F] text-[#FBF9F5] border-[#88292F]'
                              : 'bg-[#FBF9F5] text-[#6B655D] border-[#D8CBB8] hover:text-[#1C1917]'
                          }`}
                        >
                          Sẽ Tham Dự
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttending('no')}
                          className={`py-2.5 px-3 text-xs font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                            attending === 'no'
                              ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]'
                              : 'bg-[#FBF9F5] text-[#6B655D] border-[#D8CBB8] hover:text-[#1C1917]'
                          }`}
                        >
                          Vắng Mặt
                        </button>
                      </div>
                    </div>
                  </div>

                  {attending === 'yes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="rsvp-ceremony"
                          className="block text-xs font-medium text-[#1C1917] mb-1.5"
                        >
                          Nghi thức tham dự
                        </label>
                        <select
                          id="rsvp-ceremony"
                          value={ceremonyChoice}
                          onChange={(e) => setCeremonyChoice(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
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
                        <label
                          htmlFor="rsvp-count"
                          className="block text-xs font-medium text-[#1C1917] mb-1.5"
                        >
                          Số lượng người tham dự
                        </label>
                        <div className="flex items-center border border-[#D8CBB8] bg-[#FBF9F5] rounded-sm">
                          <button
                            type="button"
                            onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                            aria-label="Giảm số khách"
                            className="px-4 py-2.5 text-sm text-[#1C1917] hover:bg-[#EAE2D3] cursor-pointer"
                          >
                            −
                          </button>
                          <span
                            id="rsvp-count"
                            className="flex-1 text-center text-sm font-medium tabular-nums"
                          >
                            {guestCount} khách
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                            aria-label="Tăng số khách"
                            className="px-4 py-2.5 text-sm text-[#1C1917] hover:bg-[#EAE2D3] cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="rsvp-note"
                      className="block text-xs font-medium text-[#1C1917] mb-1.5"
                    >
                      Lưu ý thực đơn / Dị ứng thực phẩm (nếu có)
                    </label>
                    <input
                      id="rsvp-note"
                      type="text"
                      value={dietaryNote}
                      onChange={(e) => setDietaryNote(e.target.value)}
                      placeholder="Ví dụ: Ăn chay, không dùng hải sản..."
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#88292F] text-[#FBF9F5] text-sm font-medium rounded-sm hover:bg-[#702025] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Gửi Xác Nhận Tham Dự
                    </button>

                    {rsvps.length > 0 && (
                      <span className="text-xs text-[#6B655D] tabular-nums">
                        Đã có {totalAttendingGuests} khách xác nhận tham dự
                      </span>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Wedding Gift Box CTA */}
            <div
              id="mung-cuoi"
              className="mt-8 pt-6 border-t border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Hộp Mừng Cưới Trực Tuyến
                </h3>
                <p className="text-xs text-[#6B655D] mt-0.5">
                  Dành cho bạn bè ở xa muốn gửi quà mừng đến cô dâu &amp; chú rể.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGiftOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FBF9F5] border border-[#88292F]/40 text-[#88292F] text-xs font-medium rounded-sm hover:bg-[#88292F] hover:text-[#FBF9F5] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Gift className="w-4 h-4" />
                <span>Mở Hộp Mừng Cưới</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Live Guestbook Wishes */}
          <motion.div
            id="loi-chuc"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <p className="text-xs tracking-[0.22em] uppercase text-[#9A7B4F] mb-2">
              Sổ Lưu Bút
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917]">
              Lời Chúc Phúc
            </h2>

            {/* Add Wish Form */}
            <form
              onSubmit={handleWishSubmit}
              className="mt-6 bg-[#FBF9F5] border border-[#E5DDD0] p-5 rounded-sm space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={wishAuthor}
                  onChange={(e) => setWishAuthor(e.target.value)}
                  placeholder="Tên của bạn *"
                  aria-label="Tên của bạn"
                  className="px-3.5 py-2.5 bg-[#F4EFE6]/50 border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                />
                <input
                  type="text"
                  value={wishRelation}
                  onChange={(e) => setWishRelation(e.target.value)}
                  placeholder="Mối quan hệ (Bạn thân, Đồng nghiệp...)"
                  aria-label="Mối quan hệ"
                  className="px-3.5 py-2.5 bg-[#F4EFE6]/50 border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                />
              </div>
              <textarea
                rows={3}
                required
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                placeholder="Viết lời chúc tốt đẹp nhất gửi đến cô dâu chú rể..."
                aria-label="Lời chúc"
                className="w-full px-3.5 py-2.5 bg-[#F4EFE6]/50 border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F] resize-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-h-5">
                  {wishSent && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#14532D]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Cảm ơn bạn đã gửi lời chúc phúc!</span>
                    </motion.span>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-[#FBF9F5] text-xs font-medium rounded-sm hover:bg-[#36312E] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Lời Chúc</span>
                </button>
              </div>
            </form>

            {/* Wishes List */}
            <div className="mt-6 space-y-4 max-h-[540px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {wishes.map((wish) => (
                  <motion.article
                    key={wish.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 bg-[#F4EFE6]/45 border border-[#E5DDD0] rounded-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-sm text-[#1C1917]">{wish.author}</h3>
                        <p className="text-xs text-[#6B655D] mt-0.5">
                          {wish.relation} · {wish.createdAt}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onHeartWish(wish.id)}
                        aria-label={`Thả tim lời chúc của ${wish.author}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#88292F] hover:bg-[#88292F]/10 rounded-sm transition-colors cursor-pointer tabular-nums"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#88292F]/20" />
                        <span>{wish.hearts}</span>
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-[#1C1917]/90 leading-relaxed">
                      “{wish.message}”
                    </p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wedding Gift Modal */}
      <AnimatePresence>
        {giftOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGiftOpen(false)}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Hộp Mừng Cưới"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#FBF9F5] border border-[#E5DDD0] rounded-sm p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E5DDD0]">
                <div>
                  <p className="text-xs tracking-[0.18em] uppercase text-[#9A7B4F]">
                    Gửi Trao Yêu Thương
                  </p>
                  <h3 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
                    Hộp Mừng Cưới
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setGiftOpen(false)}
                  aria-label="Đóng hộp mừng cưới"
                  className="p-2 text-[#6B655D] hover:text-[#1C1917] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {config.bankAccounts.map((acc) => (
                  <div
                    key={acc.role}
                    className="p-5 bg-[#F4EFE6]/75 border border-[#E5DDD0] rounded-sm flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs tracking-[0.14em] uppercase text-[#88292F]">
                        {acc.role}
                      </span>
                      <h4 className="font-serif text-2xl font-medium text-[#1C1917] mt-2">
                        {acc.bankName}
                      </h4>
                      <p className="text-xs text-[#6B655D] mt-0.5">{acc.branch}</p>

                      <div className="mt-4 pt-4 border-t border-[#E5DDD0] space-y-1.5 text-sm">
                        <p className="text-xs text-[#6B655D]">Chủ tài khoản</p>
                        <p className="font-medium text-[#1C1917]">{acc.ownerName}</p>
                        <p className="text-xs text-[#6B655D] pt-1">Số tài khoản</p>
                        <p className="font-medium text-base text-[#1C1917] tabular-nums">
                          {acc.accountNumber}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAccount(acc.accountNumber)}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FBF9F5] border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm hover:border-[#1C1917] transition-colors cursor-pointer"
                    >
                      {copiedAcc === acc.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#14532D]" />
                          <span>Đã sao chép số tài khoản</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#6B655D]" />
                          <span>Sao chép số tài khoản</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
