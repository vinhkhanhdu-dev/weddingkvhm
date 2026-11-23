import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  RotateCcw,
  Upload,
  Check,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  QrCode,
  Trash2,
} from 'lucide-react';
import { WeddingConfig } from '../types/wedding';

function resizeImageFileToDataUrl(file: File, maxDim = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read error'));
    reader.onload = () => {
      const rawUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawUrl) {
        reject(new Error('Empty file'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(rawUrl);
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

interface SettingsPageProps {
  config: WeddingConfig;
  onBackToInvitation: () => void;
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

export const SettingsPage: React.FC<SettingsPageProps> = ({
  config,
  onBackToInvitation,
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

  React.useEffect(() => {
    setDraft(config);
  }, [config]);

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'hero' | 'venue'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await resizeImageFileToDataUrl(file, 1400);
      setDraft((prev) => ({
        ...prev,
        heroImage: target === 'hero' ? result : prev.heroImage,
        venueImage: target === 'venue' ? result : prev.venueImage,
      }));
    } catch {
      // Ignore upload errors
    }
  };

  const handleBankQrUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    accountIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await resizeImageFileToDataUrl(file, 900);
      setDraft((prev) => {
        const next = [...prev.bankAccounts];
        if (!next[accountIndex]) return prev;
        next[accountIndex] = { ...next[accountIndex], qrImage: result };
        return { ...prev, bankAccounts: next };
      });
    } catch {
      // Ignore upload errors
    }
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
    }, 2600);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E5DDD0]">
        <div className="max-w-[960px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToInvitation}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6B655D] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại thiệp cưới</span>
          </button>

          <span className="font-serif italic text-lg text-[#88292F]">
            Cài Đặt Thiệp Cưới
          </span>

          {unlocked ? (
            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B655D] hover:text-[#88292F] border border-[#E5DDD0] rounded-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Khóa lại</span>
            </button>
          ) : (
            <div className="w-20" aria-hidden="true" />
          )}
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10 sm:py-14">
        {!unlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[65vh] flex items-center justify-center"
          >
            <form
              onSubmit={handleUnlockSubmit}
              className="w-full max-w-md bg-[#F4EFE6]/70 border border-[#E5DDD0] p-8 rounded-sm space-y-5 shadow-xs"
            >
              <div className="w-11 h-11 rounded-full bg-[#88292F]/10 border border-[#88292F]/25 flex items-center justify-center text-[#88292F]">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#9A7B4F]">
                  Quyền Quản Trị Thiệp Cưới
                </p>
                <h1 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
                  Xác Thực Mật Khẩu
                </h1>
                <p className="text-xs text-[#6B655D] mt-2 leading-relaxed">
                  Khu vực này dành riêng cho cô dâu &amp; chú rể để chỉnh sửa thông tin và tài khoản mừng cưới.
                </p>
              </div>

              <div>
                <label
                  htmlFor="settings-passcode"
                  className="block text-xs font-medium text-[#1C1917] mb-1.5"
                >
                  Mật khẩu truy cập
                </label>
                <div className="relative">
                  <input
                    id="settings-passcode"
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
                {checking ? 'Đang kiểm tra...' : 'Mở Khóa Trang Cài Đặt'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="space-y-8 bg-[#F4EFE6]/45 border border-[#E5DDD0] p-6 sm:p-10 rounded-sm"
          >
            <div className="pb-5 border-b border-[#E5DDD0]">
              <p className="text-xs tracking-[0.18em] uppercase text-[#9A7B4F]">
                Cá Nhân Hóa Thiệp Cưới
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] mt-1">
                Chỉnh Sửa Thông Tin Thiệp
              </h1>
            </div>

            {/* Couple Names */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
                Thông Tin Cô Dâu &amp; Chú Rể
              </h2>
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
            <div className="space-y-4 pt-5 border-t border-[#E5DDD0]">
              <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
                Ngày Cưới &amp; Lời Ngỏ
              </h2>
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
            <div className="space-y-4 pt-5 border-t border-[#E5DDD0]">
              <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
                Song Thân Hai Họ
              </h2>
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

            {/* Cover images & Bank accounts */}
            <div className="space-y-5 pt-5 border-t border-[#E5DDD0]">
              <h2 className="font-serif text-2xl font-medium text-[#1C1917]">
                Ảnh Bìa &amp; Tài Khoản Mừng Cưới (STK)
              </h2>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm cursor-pointer hover:border-[#1C1917]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Thay ảnh bìa chính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero')}
                    className="hidden"
                  />
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm cursor-pointer hover:border-[#1C1917]">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {draft.bankAccounts.map((acc, idx) => (
                  <div
                    key={acc.role}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DDD0] rounded-sm space-y-3"
                  >
                    <p className="text-xs tracking-[0.14em] uppercase text-[#88292F] font-medium">
                      {acc.role}
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-[#6B655D] mb-1">
                        Ngân hàng
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
                        Chủ tài khoản
                      </label>
                      <input
                        type="text"
                        value={acc.ownerName}
                        onChange={(e) => {
                          const next = [...draft.bankAccounts];
                          next[idx] = { ...acc, ownerName: e.target.value };
                          setDraft({ ...draft, bankAccounts: next });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B655D] mb-1">
                        Số tài khoản (STK)
                      </label>
                      <input
                        type="text"
                        value={acc.accountNumber}
                        onChange={(e) => {
                          const next = [...draft.bankAccounts];
                          next[idx] = { ...acc, accountNumber: e.target.value };
                          setDraft({ ...draft, bankAccounts: next });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B655D] mb-1">
                        Chi nhánh
                      </label>
                      <input
                        type="text"
                        value={acc.branch}
                        onChange={(e) => {
                          const next = [...draft.bankAccounts];
                          next[idx] = { ...acc, branch: e.target.value };
                          setDraft({ ...draft, bankAccounts: next });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#D8CBB8] rounded-sm text-sm"
                      />
                    </div>

                    <div className="pt-2 border-t border-[#E5DDD0]/70 space-y-2.5">
                      <span className="block text-xs font-medium text-[#6B655D]">
                        Ảnh QR Ngân Hàng
                      </span>
                      <div className="flex items-center gap-3">
                        {acc.qrImage ? (
                          <div className="w-20 h-20 bg-white border border-[#D8CBB8] rounded-sm p-1 shrink-0">
                            <img
                              src={acc.qrImage}
                              alt={`QR ${acc.role}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-[#F4EFE6] border border-dashed border-[#D8CBB8] rounded-sm flex items-center justify-center text-[#9A7B4F] shrink-0">
                            <QrCode className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#D8CBB8] text-xs font-medium text-[#1C1917] rounded-sm cursor-pointer hover:border-[#1C1917] whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{acc.qrImage ? 'Đổi ảnh QR' : 'Tải ảnh QR lên'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBankQrUpload(e, idx)}
                              className="hidden"
                            />
                          </label>

                          {acc.qrImage && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...draft.bankAccounts];
                                next[idx] = { ...acc, qrImage: undefined };
                                setDraft({ ...draft, bankAccounts: next });
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-[#88292F] hover:underline cursor-pointer w-fit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa ảnh QR đã tải</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-[#E5DDD0] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#6B655D] hover:text-[#88292F] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục mặc định</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onBackToInvitation}
                  className="px-5 py-2.5 border border-[#D8CBB8] bg-white text-xs font-medium text-[#1C1917] rounded-sm hover:border-[#1C1917] transition-colors cursor-pointer"
                >
                  Xem Thiệp Cưới
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
            </div>
          </motion.form>
        )}
      </main>
    </div>
  );
};
