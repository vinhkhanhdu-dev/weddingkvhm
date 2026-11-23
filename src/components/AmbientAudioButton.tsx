import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

// Gentle romantic piano arpeggio progression (Fmaj7 - Dm9 - Bbmaj7 - C7sus4)
const CHORD_PROGRESSIONS: number[][] = [
  [174.61, 261.63, 329.63, 440.0, 523.25], // Fmaj7
  [146.83, 220.0, 261.63, 329.63, 440.0], // Dm9
  [116.54, 233.08, 293.66, 349.23, 440.0], // Bbmaj7
  [130.81, 261.63, 349.23, 392.0, 466.16], // C9sus4
];

export const AmbientAudioButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const playNote = (freq: number, ctx: AudioContext, duration = 2.4, gainLevel = 0.045) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscOver = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    oscOver.type = 'triangle';
    oscOver.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(0.15, now);

    osc.connect(filter);
    oscOver.connect(overGain);
    overGain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    oscOver.start(now);
    osc.stop(now + duration + 0.05);
    oscOver.stop(now + duration + 0.05);
  };

  const stopMusic = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    setIsPlaying(false);
  };

  const startMusic = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      stepRef.current = 0;

      const tick = () => {
        if (!ctxRef.current) return;
        const chordIdx = Math.floor(stepRef.current / 5) % CHORD_PROGRESSIONS.length;
        const noteIdx = stepRef.current % 5;
        const chord = CHORD_PROGRESSIONS[chordIdx];
        const freq = chord[noteIdx];
        playNote(freq, ctxRef.current, noteIdx === 0 ? 3.2 : 2.1, noteIdx === 0 ? 0.055 : 0.036);
        stepRef.current += 1;
      };

      tick();
      timerRef.current = window.setInterval(tick, 680);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      if (ctxRef.current) ctxRef.current.close().catch(() => {});
    };
  }, []);

  const toggle = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className="fixed z-40 right-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:right-auto lg:left-5 lg:bottom-5 w-11 h-11 lg:w-auto lg:h-auto flex items-center justify-center gap-2.5 lg:pl-3.5 lg:pr-4 lg:py-2.5 bg-[#FFFDF9]/90 backdrop-blur-xl border border-[#E4D9C8] text-[#2B1F1C] rounded-full shadow-[0_12px_28px_-14px_rgba(59,15,21,0.45)] hover:border-[#88292F]/50 transition-colors cursor-pointer"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-[#88292F] shrink-0" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#6B655D] shrink-0" />
      )}
      <span className="hidden lg:inline text-xs font-medium tracking-wide whitespace-nowrap">
        {isPlaying ? 'Nhạc Đang Phát' : 'Bật Nhạc Nền'}
      </span>
      {isPlaying && (
        <span className="hidden lg:flex items-end gap-0.5 h-3" aria-hidden="true">
          {[0, 1, 2].map((bar) => (
            <motion.span
              key={bar}
              className="w-0.5 bg-[#88292F] rounded-full"
              animate={{ height: ['35%', '100%', '45%'] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: bar * 0.22,
                ease: 'easeInOut',
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
};
