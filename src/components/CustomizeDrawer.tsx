import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Upload, Check, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

interface CustomizeDrawerProps {
  open: boolean;
  config: WeddingConfig;
  onClose: () => void;
  onSave: (nextConfig: WeddingConfig) => void;
  onReset: () => void;
}

const PASSCODE_HASH = '6e92eeca51cdcb24d00be55afe60719607ca9f2fb5d718e3bd905590353ecacb';
const UNLOCK_STORAGE_KEY = 'wedding_customizer_unlocked_v1';

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  open,
  config,
  onClose,
  onSave,
  onReset,
}) => {
  const [draft, setDraft] = useState<WeddingConfig>(config);
  const [savedNotice, setSavedNotice] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(UNLOCK_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passInput, setPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleOpenSync = () => {
    setDraft(config);
    setAuthError('');
  };

  React.useEffect(() => {
    if (open) handleOpenSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput || checking) return;
    setChecking(true);
    setAuthError('');
    try {
      const hashed = await sha256Hex(passInput);
      if (hashed === PASSCODE_HASH) {
        setUnlocked(true);
        setPassInput('');
        try {
          window.sessionStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
        } catch {
          // Ignore storage errors
        }
      } else {
        setAuthError('Mật khẩu không chính xác. Vui lòng thử lại.');
      }
    } catch {
      setAuthError('Không thể xác thực mật khẩu trên trình duyệt này.');
    } finally {
      setChecking(false);
    }
  };

  const handleLock = () => {
    setUnlocked(false);
    setPassInput('');
    setAuthError('');
    try {
      window.sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'hero' | 'venue'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setDraft((prev) => ({
        ...prev,
        heroImage: target === 'hero' ? result : prev.heroImage,
        venueImage: target === 'venue' ? result : prev.venueImage,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monogram = `${draft.brideName.trim().charAt(0) || 'M'} & ${
      draft.groomName.trim().charAt(0) || 'V'
    }`;
    onSave({ ...draft, monogram });
    setSavedNotice(true);
    window.setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Tùy chỉnh thông tin thiệp cưới cá nhân"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#FBF9F5] h-full overflow-y-auto border-l border-[#E5DDD0] p-6 sm:p-8 flex flex-col justify-between"
          >
            {!unlocked ? (
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5DDD0]">
                  <div>
                    <p className="text-xs tracking-[0.18em] uppercase text-[#9A7B4F]">
                      Quyền Quản Trị Thiệp Cưới
                    </p>
                    <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
                      Xác Thực Mật Khẩu
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Đóng bảng tùy chỉnh"
                    className="p-2 text-[#6B655D] hover:text-[#1C1917] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center py-10">
                  <form
                    onSubmit={handleUnlockSubmit}
                    className="w-full max-w-sm bg-[#F4EFE6]/70 border border-[#E5DDD0] p-7 rounded-sm space-y-5"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#88292F]/10 border border-[#88292F]/25 flex items-center justify-center text-[#88292F]">
                      <Lock className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                        Nhập Mật Khẩu Chỉnh Sửa
                      </h3>
                      <p className="text-xs text-[#6B655D] mt-1.5 leading-relaxed">
                        Khu vực này dành riêng cho cô dâu &amp; chú rể để cập nhật thông tin thiệp cưới.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="customizer-passcode"
                        className="block text-xs font-medium text-[#1C1917] mb-1.5"
                      >
                        Mật khẩu truy cập
                      </label>
                      <div className="relative">
                        <input
                          id="customizer-passcode"
                          type={showPass ? 'text' : 'password'}
                          required
                          autoFocus
                          value={passInput}
                          onChange={(e) => {
                            setPassInput(e.target.value);
                            if (authError) setAuthError('');
                          }}
                          placeholder="Nhập mật khẩu..."
                          className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-[#D8CBB8] rounded-sm text-sm text-[#1C1917] focus:outline-none focus:border-[#88292F]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#6B655D] hover:text-[#1C1917] cursor-pointer"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {authError && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#88292F]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{authError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={checking}
                      className="w-full py-2.5 px-4 bg-[#88292F] text-[#FBF9F5] text-xs font-medium tracking-wide rounded-sm hover:bg-[#702025] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {checking ? 'Đang kiểm tra...' : 'Mở Khóa Tùy Chỉnh'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5DDD0]">
                <div>
                  <p className="text-xs tracking-[0.18em] uppercase text-[#9A7B4F]">
                    Cá Nhân Hóa Thiệp Cưới
                  </p>
                  <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
                    Chỉnh Sửa Thông Tin Của Bạn
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleLock}
                    title="Khóa phần tùy chỉnh"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#6B655D] hover:text-[#88292F] border border-[#E5DDD0] rounded-sm cursor-pointer whitespace-nowrap"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Khóa lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Đóng bảng tùy chỉnh"
                    className="p-2 text-[#6B655D] hover:text-[#1C1917] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Couple Names */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Thông Tin Cô Dâu &amp; Chú Rể
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Tên ngắn Cô Dâu
                    </label>
                    <input
                      type="text"
                      value={draft.brideName}
                      onChange={(e) => setDraft({ ...draft, brideName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Tên ngắn Chú Rể
                    </label>
                    <input
                      type="text"
                      value={draft.groomName}
                      onChange={(e) => setDraft({ ...draft, groomName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Họ tên đầy đủ Cô Dâu
                    </label>
                    <input
                      type="text"
                      value={draft.brideFullName}
                      onChange={(e) => setDraft({ ...draft, brideFullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Họ tên đầy đủ Chú Rể
                    </label>
                    <input
                      type="text"
                      value={draft.groomFullName}
                      onChange={(e) => setDraft({ ...draft, groomFullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Quote */}
              <div className="space-y-4 pt-4 border-t border-[#E5DDD0]">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Ngày Cưới &amp; Lời Ngỏ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Ngày hiển thị (Dương lịch)
                    </label>
                    <input
                      type="text"
                      value={draft.displayDate}
                      onChange={(e) => setDraft({ ...draft, displayDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Ngày đếm ngược (ISO)
                    </label>
                    <input
                      type="datetime-local"
                      value={draft.weddingDateISO.slice(0, 16)}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          weddingDateISO: e.target.value
                            ? `${e.target.value}:00+07:00`
                            : draft.weddingDateISO,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B655D] mb-1">
                    Câu trích dẫn đầu trang
                  </label>
                  <textarea
                    rows={2}
                    value={draft.heroQuote}
                    onChange={(e) => setDraft({ ...draft, heroQuote: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm resize-none"
                  />
                </div>
              </div>

              {/* Parents */}
              <div className="space-y-4 pt-4 border-t border-[#E5DDD0]">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Song Thân Hai Họ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Ba Cô Dâu
                    </label>
                    <input
                      type="text"
                      value={draft.brideParents.father}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          brideParents: { ...draft.brideParents, father: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Mẹ Cô Dâu
                    </label>
                    <input
                      type="text"
                      value={draft.brideParents.mother}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          brideParents: { ...draft.brideParents, mother: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Ba Chú Rể
                    </label>
                    <input
                      type="text"
                      value={draft.groomParents.father}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          groomParents: { ...draft.groomParents, father: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B655D] mb-1">
                      Mẹ Chú Rể
                    </label>
                    <input
                      type="text"
                      value={draft.groomParents.mother}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          groomParents: { ...draft.groomParents, mother: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Reception Venue & Bank */}
              <div className="space-y-4 pt-4 border-t border-[#E5DDD0]">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Ảnh Bìa &amp; Tài Khoản Mừng Cưới
                </h3>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm cursor-pointer hover:border-[#1C1917]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Thay ảnh bìa chính</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero')}
                      className="hidden"
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm cursor-pointer hover:border-[#1C1917]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Thay ảnh sảnh tiệc</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'venue')}
                      className="hidden"
                    />
                  </label>
                </div>

                {draft.bankAccounts.map((acc, idx) => (
                  <div key={acc.role} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#6B655D] mb-1">
                        Ngân hàng ({acc.role})
                      </label>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const next = [...draft.bankAccounts];
                          next[idx] = { ...acc, bankName: e.target.value };
                          setDraft({ ...draft, bankAccounts: next });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B655D] mb-1">
                        Số tài khoản
                      </label>
                      <input
                        type="text"
                        value={acc.accountNumber}
                        onChange={(e) => {
                          const next = [...draft.bankAccounts];
                          next[idx] = { ...acc, accountNumber: e.target.value };
                          setDraft({ ...draft, bankAccounts: next });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-[#E5DDD0] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#6B655D] hover:text-[#88292F] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục mặc định</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#88292F] text-[#FBF9F5] text-xs font-medium rounded-sm hover:bg-[#702025] transition-colors cursor-pointer"
                >
                  {savedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã lưu thay đổi</span>
                    </>
                  ) : (
                    <span>Lưu Thiệp Cưới</span>
                  )}
                </button>
              </div>
            </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
