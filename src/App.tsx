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
import { SettingsPage } from './components/SettingsPage';
import { Ornament } from './components/Ornament';

function isSettingsRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash.replace(/\/+$/, '');
  return path.endsWith('/settings') || hash === '#/settings';
}

function getInvitationHomeUrl(): string {
  if (typeof window === 'undefined') return '/';
  if (window.location.hash.replace(/\/+$/, '') === '#/settings') {
    return `${window.location.pathname}${window.location.search}`;
  }
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanedPath = window.location.pathname.replace(/\/settings\/?$/, '');
  if (cleanedPath && cleanedPath !== window.location.pathname) {
    return `${cleanedPath}/`.replace(/\/+$/, '/');
  }
  return base ? `${base}/` : '/';
}

const STORAGE_KEYS = {
  CONFIG: 'personal_wedding_config_v4',
  WISHES: 'personal_wedding_wishes_v4',
  RSVPS: 'personal_wedding_rsvps_v4',
};

const LEGACY_ASSET_MAP: Record<string, string> = {
  '/assets/aistudio/in60x90__2___1__65fbed59.jpg': '/assets/web/hero-couple.jpg',
  '/assets/aistudio/SAN_3205_0d713cd4.JPG': '/assets/web/san-3205.jpg',
  '/assets/aistudio/SAN_2959_e125ebef.JPG': '/assets/web/san-2959.jpg',
  '/assets/aistudio/SAN_3159_1de2d97d.JPG': '/assets/web/san-3159.jpg',
  '/assets/aistudio/SAN_3334_d475fda9.JPG': '/assets/web/san-3334.jpg',
  '/assets/aistudio/SAN_3017_1e5c3a6f.JPG': '/assets/web/san-3017.jpg',
  '/assets/aistudio/SAN_2935_063b0890.JPG': '/assets/web/san-2935.jpg',
  '/assets/aistudio/SAN_2965_1f4062d5.JPG': '/assets/web/san-2965.jpg',
  '/assets/aistudio/SAN_3222_47b68d47.JPG': '/assets/web/san-3222.jpg',
  '/assets/aistudio/SAN_3362_2f2a0e73.JPG': '/assets/web/san-3362.jpg',
  '/assets/aistudio/SAN_3383_d7bdf350.JPG': '/assets/web/san-3383.jpg',
};

function mapAsset(url: string): string {
  return LEGACY_ASSET_MAP[url] || url;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readWeddingConfig(): WeddingConfig {
  const stored = readStorage<WeddingConfig>(STORAGE_KEYS.CONFIG, DEFAULT_WEDDING_CONFIG);
  return {
    ...stored,
    heroImage: mapAsset(stored.heroImage),
    venueImage: mapAsset(stored.venueImage),
    storyChapters: stored.storyChapters.map((c) => ({ ...c, image: mapAsset(c.image) })),
    gallery: stored.gallery.map((g) => ({ ...g, src: mapAsset(g.src) })),
  };
}

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(readWeddingConfig);
  const [wishes, setWishes] = useState<WishEntry[]>(() =>
    readStorage<WishEntry[]>(STORAGE_KEYS.WISHES, DEFAULT_WISHES)
  );
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>(() =>
    readStorage<RsvpSubmission[]>(STORAGE_KEYS.RSVPS, [])
  );

  const [introOpen, setIntroOpen] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [isSettings, setIsSettings] = useState<boolean>(isSettingsRoute);
  const [fireworkTrigger, setFireworkTrigger] = useState<FireworkTrigger | null>(null);

  useEffect(() => {
    const syncRoute = () => setIsSettings(isSettingsRoute());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const handleBackToInvitation = () => {
    const target = getInvitationHomeUrl();
    window.history.pushState({}, '', target);
    setIsSettings(false);
    setIntroOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (isSettings) {
    return (
      <MotionConfig reducedMotion="user">
        <SettingsPage
          config={config}
          onBackToInvitation={handleBackToInvitation}
          onSave={handleSaveConfig}
          onReset={handleResetConfig}
        />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FBF8F2] text-[#2B1F1C] relative overflow-x-clip">
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

        <footer className="wine-surface relative px-6 pt-16 sm:pt-20 pb-36 lg:pb-16 text-center overflow-hidden">
          <div className="max-w-[720px] mx-auto">
            <p className="eyebrow eyebrow-rule !text-[#C9A66B]">Trân Trọng Cảm Ơn</p>
            <p className="font-script text-[clamp(1.5rem,7.6vw,4rem)] whitespace-nowrap text-[#FBF3E4] mt-6 pt-2">
              {config.brideName} <span className="text-[#C9A66B]">&amp;</span> {config.groomName}
            </p>
            <Ornament className="text-[#C9A66B] mx-auto mt-5" />
            <p className="mt-6 font-serif italic text-xl text-[#E9D9C4]/85 leading-relaxed text-balance">
              Cảm ơn bạn đã là một phần trong ngày hạnh phúc của chúng mình.
            </p>
            <p className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-[11px] tracking-[0.26em] uppercase text-[#C9A66B] whitespace-nowrap">
              <span>{config.displayDate}</span>
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <span>{config.city}</span>
            </p>
            <button type="button" onClick={handleReplayIntro} className="btn btn-gold btn-sm mt-9">
              Mở Lại Phong Bì
            </button>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
