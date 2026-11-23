import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import { Ornament, ThemeEmblem } from './components/Ornament';
import { resolveTheme } from './data/themes';
import { MinimalismInvitation } from './components/minimalism/MinimalismInvitation';
import { SongHyInvitation } from './components/songhy/SongHyInvitation';
import { SongHyV2Invitation } from './components/songhyv2/SongHyV2Invitation';
import {
  createRsvp,
  createWish,
  fetchConfig,
  fetchRsvpSummary,
  saveConfig,
  fetchWishes,
  heartWish,
  isApiConfigured,
} from './lib/api';

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
  return normalizeConfig(readStorage<WeddingConfig>(STORAGE_KEYS.CONFIG, DEFAULT_WEDDING_CONFIG));
}

function normalizeConfig(stored: WeddingConfig): WeddingConfig {
  return {
    ...stored,
    heroImage: mapAsset(stored.heroImage),
    venueImage: mapAsset(stored.venueImage),
    storyChapters: stored.storyChapters.map((c) => ({ ...c, image: mapAsset(c.image) })),
    gallery: stored.gallery.map((g) => ({ ...g, src: mapAsset(g.src) })),
  };
}

export default function App() {
  // Local copy paints instantly; the MongoDB version replaces it once loaded
  const [config, setConfig] = useState<WeddingConfig>(readWeddingConfig);
  const [configMode, setConfigMode] = useState<'checking' | 'online' | 'offline'>(
    isApiConfigured ? 'checking' : 'offline'
  );

  useEffect(() => {
    if (!isApiConfigured) return;
    let cancelled = false;
    fetchConfig()
      .then((remote) => {
        if (cancelled) return;
        const next = normalizeConfig(remote);
        setConfig(next);
        setConfigMode('online');
        try {
          window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
      })
      .catch(() => {
        if (!cancelled) setConfigMode('offline');
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const [wishes, setWishes] = useState<WishEntry[]>(() =>
    readStorage<WishEntry[]>(STORAGE_KEYS.WISHES, DEFAULT_WISHES)
  );
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>(() =>
    readStorage<RsvpSubmission[]>(STORAGE_KEYS.RSVPS, [])
  );
  // 'online' = wishes/RSVPs live in MongoDB via the API; 'offline' = browser-only fallback
  const [dataMode, setDataMode] = useState<'checking' | 'online' | 'offline'>(
    isApiConfigured ? 'checking' : 'offline'
  );
  const [remoteAttendingGuests, setRemoteAttendingGuests] = useState<number | null>(null);

  useEffect(() => {
    if (!isApiConfigured) return;
    let cancelled = false;
    Promise.all([fetchWishes(), fetchRsvpSummary()])
      .then(([remoteWishes, summary]) => {
        if (cancelled) return;
        setWishes(remoteWishes);
        setRemoteAttendingGuests(summary.attendingGuests);
        setDataMode('online');
      })
      .catch(() => {
        if (!cancelled) setDataMode('offline');
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Apply the chosen theme before paint so the page never flashes the wrong colours
  // ?theme=<id> previews a theme for this visitor only, without saving it
  const [previewThemeId] = useState(() =>
    typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('theme')
  );
  const theme = resolveTheme(previewThemeId || config.theme);
  useLayoutEffect(() => {
    // The settings page keeps its own neutral look
    document.documentElement.dataset.theme = isSettings ? 'classic' : theme.id;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.preview.bg);
  }, [theme.id, theme.preview.bg, isSettings]);

  useEffect(() => {
    document.title = `Thiệp Mời Thành Hôn — ${config.brideName} & ${config.groomName}`;
  }, [config.brideName, config.groomName]);

  // With the API configured, MongoDB is the source of truth: a failed save rejects so the
  // settings page can show the error instead of pretending it was published.
  const handleSaveConfig = async (nextConfig: WeddingConfig, passcode: string) => {
    if (isApiConfigured) {
      await saveConfig(nextConfig, passcode);
      setConfigMode('online');
    }
    setConfig(nextConfig);
    try {
      window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(nextConfig));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleResetConfig = async (passcode: string) => {
    if (isApiConfigured) {
      await saveConfig(DEFAULT_WEDDING_CONFIG, passcode);
    }
    setConfig(DEFAULT_WEDDING_CONFIG);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CONFIG);
    } catch {
      // Ignore
    }
  };

  const persistLocal = (key: string, value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota errors
    }
  };

  // In online mode a failed save rejects, so the form can ask the guest to retry
  // instead of silently keeping the wish in their own browser only.
  const handleAddWish = async (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => {
    if (dataMode === 'online') {
      const saved = await createWish(wish);
      setWishes((prev) => [saved, ...prev]);
      launchFireworks('celebration');
      return;
    }
    const next: WishEntry = {
      ...wish,
      id: `wish-${Date.now()}`,
      createdAt: 'Vừa xong',
      hearts: 1,
    };
    const updated = [next, ...wishes];
    setWishes(updated);
    launchFireworks('celebration');
    persistLocal(STORAGE_KEYS.WISHES, updated);
  };

  const handleHeartWish = (id: string) => {
    const bump = (delta: number) => (list: WishEntry[]) =>
      list.map((w) => (w.id === id ? { ...w, hearts: w.hearts + delta } : w));

    if (dataMode === 'online') {
      setWishes(bump(1));
      heartWish(id)
        .then((hearts) =>
          setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, hearts } : w)))
        )
        .catch(() => setWishes(bump(-1)));
      return;
    }
    const updated = bump(1)(wishes);
    setWishes(updated);
    persistLocal(STORAGE_KEYS.WISHES, updated);
  };

  const handleSubmitRsvp = async (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => {
    if (dataMode === 'online') {
      await createRsvp(rsvp);
      setRemoteAttendingGuests((prev) =>
        rsvp.attending === 'yes' ? (prev ?? 0) + rsvp.guestCount : prev
      );
      return;
    }
    const next: RsvpSubmission = {
      ...rsvp,
      id: `rsvp-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('vi-VN'),
    };
    const updated = [next, ...rsvps];
    setRsvps(updated);
    persistLocal(STORAGE_KEYS.RSVPS, updated);
  };

  const localAttendingGuests = rsvps
    .filter((r) => r.attending === 'yes')
    .reduce((acc, r) => acc + r.guestCount, 0);
  const attendingGuests =
    dataMode === 'online' ? remoteAttendingGuests : rsvps.length > 0 ? localAttendingGuests : null;

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
          serverMode={isApiConfigured}
          configMode={configMode}
        />
      </MotionConfig>
    );
  }

  if (theme.layout === 'minimalism' || theme.layout === 'songhy' || theme.layout === 'songhyv2') {
    const Layout =
      theme.layout === 'songhyv2'
        ? SongHyV2Invitation
        : theme.layout === 'songhy'
          ? SongHyInvitation
          : MinimalismInvitation;
    return (
      <MotionConfig reducedMotion="user">
        <Layout
          config={config}
          wishes={wishes}
          onAddWish={handleAddWish}
          onSubmitRsvp={handleSubmitRsvp}
          showIntro={introOpen}
          onIntroDone={() => setIntroOpen(false)}
        />
        <AmbientAudioButton />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper text-ink relative overflow-x-clip">
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
        <PetalCanvas active={!introOpen} theme={theme.id} />
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
            attendingGuests={attendingGuests}
            onSubmitRsvp={handleSubmitRsvp}
          />
        </main>

        <footer className="wine-surface relative px-6 pt-16 sm:pt-20 pb-36 lg:pb-16 text-center overflow-hidden">
          <div className="max-w-[720px] mx-auto">
            <ThemeEmblem className="mb-6 mx-auto !text-gold" />
            <p className="eyebrow eyebrow-rule !text-gold">Trân Trọng Cảm Ơn</p>
            <p className="font-script text-[clamp(1.375rem,6.6vw,2.75rem)] whitespace-nowrap text-cream mt-6 pt-2">
              {config.brideName} <span className="font-serif text-[0.8em] text-gold">&amp;</span> {config.groomName}
            </p>
            <Ornament className="text-gold mx-auto mt-5" />
            <p className="mt-6 font-serif italic text-xl text-cream-muted/85 leading-relaxed text-balance">
              Cảm ơn bạn đã là một phần trong ngày hạnh phúc của chúng mình.
            </p>
            <p className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-[11px] tracking-[0.26em] uppercase text-gold whitespace-nowrap">
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
