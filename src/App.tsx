import React, { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { DEFAULT_WEDDING_CONFIG, DEFAULT_WISHES } from './data/defaultWedding';
import { RsvpSubmission, WeddingConfig, WishEntry } from './types/wedding';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { PetalCanvas } from './components/PetalCanvas';
import { FireworksCanvas, FireworkTrigger } from './components/FireworksCanvas';
import { AmbientAudioButton } from './components/AmbientAudioButton';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FamilyInvitation } from './components/FamilyInvitation';
import { LoveStoryTimeline } from './components/LoveStoryTimeline';
import { CeremonySchedule } from './components/CeremonySchedule';
import { GallerySection } from './components/GallerySection';
import { RsvpAndWishes } from './components/RsvpAndWishes';
import { CustomizeDrawer } from './components/CustomizeDrawer';

const STORAGE_KEYS = {
  CONFIG: 'personal_wedding_config_v4',
  WISHES: 'personal_wedding_wishes_v4',
  RSVPS: 'personal_wedding_rsvps_v4',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(() =>
    readStorage<WeddingConfig>(STORAGE_KEYS.CONFIG, DEFAULT_WEDDING_CONFIG)
  );
  const [wishes, setWishes] = useState<WishEntry[]>(() =>
    readStorage<WishEntry[]>(STORAGE_KEYS.WISHES, DEFAULT_WISHES)
  );
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>(() =>
    readStorage<RsvpSubmission[]>(STORAGE_KEYS.RSVPS, [])
  );

  const [introOpen, setIntroOpen] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [fireworkTrigger, setFireworkTrigger] = useState<FireworkTrigger | null>(null);

  const launchFireworks = (variant: 'grand' | 'celebration') => {
    setFireworkTrigger((prev) => ({
      id: (prev?.id || 0) + 1,
      variant,
    }));
  };

  useEffect(() => {
    document.title = `Thiệp Mời Thành Hôn — ${config.brideName} & ${config.groomName}`;
  }, [config.brideName, config.groomName]);

  const handleSaveConfig = (nextConfig: WeddingConfig) => {
    setConfig(nextConfig);
    try {
      window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(nextConfig));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_WEDDING_CONFIG);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CONFIG);
    } catch {
      // Ignore
    }
  };

  const handleAddWish = (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => {
    const next: WishEntry = {
      ...wish,
      id: `wish-${Date.now()}`,
      createdAt: 'Vừa xong',
      hearts: 1,
    };
    const updated = [next, ...wishes];
    setWishes(updated);
    launchFireworks('celebration');
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleHeartWish = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, hearts: w.hearts + 1 } : w
    );
    setWishes(updated);
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSubmitRsvp = (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => {
    const next: RsvpSubmission = {
      ...rsvp,
      id: `rsvp-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('vi-VN'),
    };
    const updated = [next, ...rsvps];
    setRsvps(updated);
    try {
      window.localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleReplayIntro = () => {
    setIntroKey((k) => k + 1);
    setIntroOpen(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] relative overflow-x-clip">
        {introOpen && (
          <EnvelopeIntro
            key={introKey}
            groomName={config.groomName}
            brideName={config.brideName}
            monogram={config.monogram}
            displayDate={config.displayDate}
            city={config.city}
            onCelebrateOpen={() => launchFireworks('grand')}
            onOpenComplete={() => setIntroOpen(false)}
          />
        )}

        <FireworksCanvas trigger={fireworkTrigger} />
        <PetalCanvas active={!introOpen} />
        <AmbientAudioButton />

        <Navbar brideName={config.brideName} groomName={config.groomName} />

        <main>
          <HeroSection
            config={config}
            onOpenCustomizer={() => setCustomizerOpen(true)}
            onReplayIntro={handleReplayIntro}
          />

          <FamilyInvitation config={config} />

          <LoveStoryTimeline config={config} />

          <CeremonySchedule config={config} />

          <GallerySection photos={config.gallery} />

          <RsvpAndWishes
            config={config}
            wishes={wishes}
            onAddWish={handleAddWish}
            onHeartWish={handleHeartWish}
            rsvps={rsvps}
            onSubmitRsvp={handleSubmitRsvp}
          />
        </main>

        <footer className="bg-[#F4EFE6] border-t border-[#E5DDD0] py-14 px-6">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="font-serif italic text-3xl text-[#1C1917]">
                {config.brideName} <span className="text-[#88292F]">&amp;</span> {config.groomName}
              </p>
              <p className="text-xs text-[#6B655D] mt-1">
                {config.displayDate} · {config.city} — Cảm ơn bạn đã là một phần trong ngày hạnh phúc của chúng mình.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleReplayIntro}
                className="text-[#6B655D] hover:text-[#1C1917] underline underline-offset-4 cursor-pointer"
              >
                Mở lại phong bì
              </button>
              <span aria-hidden="true" className="text-[#D8CBB8]">
                ·
              </span>
              <button
                type="button"
                onClick={() => setCustomizerOpen(true)}
                className="text-[#88292F] hover:underline underline-offset-4 font-medium cursor-pointer"
              >
                Tùy chỉnh thiệp cá nhân
              </button>
            </div>
          </div>
        </footer>

        <CustomizeDrawer
          open={customizerOpen}
          config={config}
          onClose={() => setCustomizerOpen(false)}
          onSave={handleSaveConfig}
          onReset={handleResetConfig}
        />
      </div>
    </MotionConfig>
  );
}
