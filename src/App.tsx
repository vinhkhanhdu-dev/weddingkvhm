import React, { useEffect, useLayoutEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { DEFAULT_WEDDING_CONFIG } from './data/defaultWedding';
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

// Copies older versions of the app kept in the visitor's browser — removed on startup,
// the invitation is now always read from the API.
const LEGACY_STORAGE_KEYS = [
  'personal_wedding_config_v4',
  'personal_wedding_wishes_v4',
  'personal_wedding_rsvps_v4',
];

function purgeLegacyStorage() {
  try {
    for (const key of LEGACY_STORAGE_KEYS) window.localStorage.removeItem(key);
  } catch {
    // Storage may be blocked (private mode) — nothing to clean then
  }
}

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

function normalizeConfig(stored: WeddingConfig): WeddingConfig {
  return {
    ...stored,
    heroImage: mapAsset(stored.heroImage),
    venueImage: mapAsset(stored.venueImage),
    storyChapters: stored.storyChapters.map((c) => ({ ...c, image: mapAsset(c.image) })),
    gallery: stored.gallery.map((g) => ({ ...g, src: mapAsset(g.src) })),
  };
}

const MISSING_API_MESSAGE = 'Trang chưa được cấu hình địa chỉ máy chủ (VITE_API_URL).';

export default function App() {
  // The invitation, wishes and RSVP totals come only from the API (MongoDB) — nothing is
  // kept in the browser, so every visit shows the latest saved data.
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(
    isApiConfigured ? null : MISSING_API_MESSAGE
  );
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [attendingGuests, setAttendingGuests] = useState<number | null>(null);
  // Bumped whenever the visitor comes back to the tab, so data is re-read from the API
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(purgeLegacyStorage, []);

  useEffect(() => {
    if (!isApiConfigured) return;
    const refresh = () => {
      if (document.visibilityState === 'visible') setRefreshKey((k) => k + 1);
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('online', refresh);
    };
  }, []);

  useEffect(() => {
    if (!isApiConfigured) return;
    let cancelled = false;
    fetchConfig()
      .then((remote) => {
        if (cancelled) return;
        setConfig(normalizeConfig(remote));
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // A failed background refresh keeps the invitation already on screen
        setConfig((current) => {
          if (!current) {
            setLoadError(err instanceof Error ? err.message : 'Không tải được thiệp mời.');
          }
          return current;
        });
      });
    Promise.all([fetchWishes(), fetchRsvpSummary()])
      .then(([remoteWishes, summary]) => {
        if (cancelled) return;
        setWishes(remoteWishes);
        setAttendingGuests(summary.attendingGuests);
      })
      .catch(() => {
        // Guestbook stays as last loaded; the invitation itself still shows
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

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
  const theme = resolveTheme(previewThemeId || config?.theme);
  useLayoutEffect(() => {
    // The settings page keeps its own neutral look
    document.documentElement.dataset.theme = isSettings ? 'classic' : theme.id;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.preview.bg);
  }, [theme.id, theme.preview.bg, isSettings]);

  useEffect(() => {
    if (config) {
      document.title = `Thiệp Mời Thành Hôn — ${config.brideName} & ${config.groomName}`;
    }
  }, [config]);

  // A failed save rejects so the settings page can show the error
  const handleSaveConfig = async (nextConfig: WeddingConfig, passcode: string) => {
    await saveConfig(nextConfig, passcode);
    setConfig(nextConfig);
  };

  const handleResetConfig = async (passcode: string) => {
    await saveConfig(DEFAULT_WEDDING_CONFIG, passcode);
    setConfig(DEFAULT_WEDDING_CONFIG);
  };

  // A failed send rejects, so the form can ask the guest to retry
  const handleAddWish = async (wish: Omit<WishEntry, 'id' | 'createdAt' | 'hearts'>) => {
    const saved = await createWish(wish);
    setWishes((prev) => [saved, ...prev]);
    launchFireworks('celebration');
  };

  const handleHeartWish = (id: string) => {
    const bump = (delta: number) => (list: WishEntry[]) =>
      list.map((w) => (w.id === id ? { ...w, hearts: w.hearts + delta } : w));
    setWishes(bump(1));
    heartWish(id)
      .then((hearts) =>
        setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, hearts } : w)))
      )
      .catch(() => setWishes(bump(-1)));
  };

  const handleSubmitRsvp = async (rsvp: Omit<RsvpSubmission, 'id' | 'submittedAt'>) => {
    await createRsvp(rsvp);
    setAttendingGuests((prev) =>
      rsvp.attending === 'yes' ? (prev ?? 0) + rsvp.guestCount : prev
    );
  };

  const handleReplayIntro = () => {
    setIntroKey((k) => k + 1);
    setIntroOpen(true);
  };

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[#FBF8F2] text-[#75675E]">
        {loadError ? (
          <>
            <p className="text-sm max-w-xs" role="alert">
              {loadError}
            </p>
            {isApiConfigured && (
              <button
                type="button"
                className="px-5 py-2 rounded-full bg-[#88292F] text-white text-sm"
                onClick={() => {
                  setLoadError(null);
                  setRefreshKey((k) => k + 1);
                }}
              >
                Thử lại
              </button>
            )}
          </>
        ) : (
          <>
            <span
              className="w-9 h-9 rounded-full border-2 border-[#88292F]/20 border-t-[#88292F] animate-spin"
              aria-hidden="true"
            />
            <p className="text-sm tracking-wide" role="status">
              Đang tải thiệp mời…
            </p>
          </>
        )}
      </div>
    );
  }

  if (isSettings) {
    return (
      <MotionConfig reducedMotion="user">
        <SettingsPage
          config={config}
          onBackToInvitation={handleBackToInvitation}
          onSave={handleSaveConfig}
          onReset={handleResetConfig}
          serverMode
          configMode="online"
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
