import { LanguageCode } from '../types';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playSuccess() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio fallback
    }
  }

  playSnap() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  playToneGuide(toneNumber: 1 | 2 | 3 | 4) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      const baseHigh = 440; // 55
      const baseMid = 350;  // 33
      const baseLow = 260;  // 11
      const now = ctx.currentTime;
      const duration = 0.8;

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      switch (toneNumber) {
        case 1: // 55 High flat
          osc.frequency.setValueAtTime(baseHigh, now);
          osc.frequency.setValueAtTime(baseHigh, now + duration);
          break;
        case 2: // 35 Mid to High rising
          osc.frequency.setValueAtTime(baseMid, now);
          osc.frequency.exponentialRampToValueAtTime(baseHigh, now + duration);
          break;
        case 3: // 214 Low dipping to very low then rising
          osc.frequency.setValueAtTime(baseMid * 0.9, now);
          osc.frequency.exponentialRampToValueAtTime(baseLow, now + duration * 0.4);
          osc.frequency.exponentialRampToValueAtTime(baseMid * 1.05, now + duration);
          break;
        case 4: // 51 High falling sharply to low
          osc.frequency.setValueAtTime(baseHigh, now);
          osc.frequency.exponentialRampToValueAtTime(baseLow, now + duration);
          break;
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio not permitted
    }
  }
}

export const soundEffects = new SoundEffectsManager();

const LANG_VOICE_MAP: Record<LanguageCode, string> = {
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
  ko: 'ko-KR',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function speakText(
  text: string,
  lang: LanguageCode,
  rate = 1.0,
  pitch = 1.0,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_VOICE_MAP[lang] || 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    const voices = window.speechSynthesis.getVoices();
    const targetTag = LANG_VOICE_MAP[lang];
    const matchingVoice = voices.find((v) => v.lang === targetTag || v.lang.startsWith(targetTag.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
