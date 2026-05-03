import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;

const NARRATION: Record<string, string> = {
  open:    `${BASE}audio/n1.mp3`,
  mind:    `${BASE}audio/n2.mp3`,
  breath:  `${BASE}audio/n3.mp3`,
  journey: `${BASE}audio/n4.mp3`,
  close:   `${BASE}audio/n5.mp3`,
};

// A minor ambient pad: sine oscillators on A2 E3 A3 C4 E4
function makeAmbientPad(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.048, ctx.currentTime + 5);
  master.connect(ctx.destination);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 0.005;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);
  lfo.start();

  const voices = [
    { freq: 110,   gain: 1.00 },
    { freq: 165,   gain: 0.48 },
    { freq: 220,   gain: 0.26 },
    { freq: 261.6, gain: 0.13 },
    { freq: 329.6, gain: 0.07 },
  ];
  const oscs = voices.map(({ freq, gain }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(master);
    osc.start();
    return osc;
  });

  return () => {
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.6);
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(); } catch { /**/ } });
      try { lfo.stop(); } catch { /**/ }
    }, 1700);
  };
}

// Breath-synced pink noise
function makeBreathSound(ctx: AudioContext): () => void {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(1, sr * 4, sr);
  const d = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;
    b6=w*0.115926;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = 1100; filt.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
  src.start();
  let active = true;
  const runCycle = () => {
    if (!active) return;
    const t = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(0.085, t + 4);
    gain.gain.setValueAtTime(0.085, t + 6);
    gain.gain.linearRampToValueAtTime(0, t + 10);
    setTimeout(() => runCycle(), 12000);
  };
  runCycle();
  return () => {
    active = false;
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => { try { src.stop(); } catch { /**/ } }, 700);
  };
}

export function AudioManager({ sceneKey, onUnlocked }: { sceneKey: string; onUnlocked?: () => void }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopAmbientRef = useRef<(() => void) | null>(null);
  const stopBreathRef = useRef<(() => void) | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const currentNarSrcRef = useRef<string | null>(null);

  // Create AudioContext on mount
  useEffect(() => {
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      ctxRef.current = ctx;
    } catch { return; }

    // ── CRITICAL: unlock audio synchronously inside a real DOM event ──
    // React effects run outside the browser's user-activation window,
    // so we attach a raw DOM listener that calls resume() + play() inline.
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      ctx.resume().then(() => {
        // Replay the current narration if it was blocked
        if (narrationRef.current) {
          narrationRef.current.currentTime = 0;
          narrationRef.current.play().catch(() => { /**/ });
        }
        // Start ambient pad now that context is running
        stopAmbientRef.current = makeAmbientPad(ctx);
        onUnlocked?.();
      });
    };

    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('click',       unlock, { once: true });

    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('click',       unlock);
      stopAmbientRef.current?.();
      stopBreathRef.current?.();
      ctx.close().catch(() => { /**/ });
      ctxRef.current = null;
    };
  }, []);

  // Per-scene: narration + breath sound
  useEffect(() => {
    const base = sceneKey.replace(/_r[12]$/, '');

    // Stop previous narration
    const prev = narrationRef.current;
    if (prev) { prev.pause(); prev.currentTime = 0; }
    narrationRef.current = null;

    // Stop previous breath sound
    stopBreathRef.current?.();
    stopBreathRef.current = null;

    const src = NARRATION[base] ?? null;
    currentNarSrcRef.current = src;

    if (src) {
      const audio = new Audio(src);
      audio.volume = 0.88;
      narrationRef.current = audio;

      // Only play if already unlocked — otherwise the unlock handler will play it
      if (unlockedRef.current) {
        const timer = setTimeout(() => {
          audio.play().catch(() => { /**/ });
        }, 600);
        return () => {
          clearTimeout(timer);
          audio.pause();
        };
      }
    }

    // Breath sound (only when context already unlocked)
    if (base === 'breath' && ctxRef.current && unlockedRef.current) {
      stopBreathRef.current = makeBreathSound(ctxRef.current);
    }
  }, [sceneKey]);

  return null;
}
