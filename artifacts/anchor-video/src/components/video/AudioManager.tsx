import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;

const NARRATION: Record<string, string> = {
  open:    `${BASE}audio/n1.mp3`,
  mind:    `${BASE}audio/n2.mp3`,
  breath:  `${BASE}audio/n3.mp3`,
  journey: `${BASE}audio/n4.mp3`,
  close:   `${BASE}audio/n5.mp3`,
};

// Module-level flag so AudioContext unlock survives VideoTemplate remounts
// (clicking a scene button remounts VideoTemplate, which would otherwise reset
//  the per-component unlockedRef back to false and block audio again).
let _globalUnlocked = false;

// A-minor ambient pad: sine oscillators at A2 E3 A3 C4 E4
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
    }, 1800);
  };
}

// Breath-synced pink noise (envelope follows 4s in / 2s hold / 4s out / 2s rest)
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

export function AudioManager({ sceneKey }: { sceneKey: string }) {
  const ctxRef       = useRef<AudioContext | null>(null);
  const stopAmbient  = useRef<(() => void) | null>(null);
  const stopBreath   = useRef<(() => void) | null>(null);
  const narration    = useRef<HTMLAudioElement | null>(null);
  const unlockedRef  = useRef(_globalUnlocked);   // inherit module-level state on remount
  const currentBase  = useRef('');

  // ── Mount: create AudioContext + attach DOM unlock listener ──────────────
  useEffect(() => {
    let ctx: AudioContext;
    try { ctx = new AudioContext(); ctxRef.current = ctx; }
    catch { return; }

    // If audio was already unlocked in a previous mount, resume the new context immediately.
    // (This handles the remount-on-scene-jump case.)
    if (_globalUnlocked) {
      ctx.resume().then(() => {
        stopAmbient.current = makeAmbientPad(ctx);
        // Also replay the narration that the sceneKey effect already loaded
        if (narration.current) {
          narration.current.currentTime = 0;
          narration.current.play().catch(() => { /**/ });
        }
        // Restart breath if we landed on the breath scene
        if (currentBase.current === 'breath') {
          stopBreath.current?.();
          stopBreath.current = makeBreathSound(ctx);
        }
      });
    }

    // DOM listener for first-time unlock (synchronous inside gesture window)
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      _globalUnlocked = true;
      ctx.resume().then(() => {
        stopAmbient.current = makeAmbientPad(ctx);
        if (narration.current) {
          narration.current.currentTime = 0;
          narration.current.play().catch(() => { /**/ });
        }
        if (currentBase.current === 'breath') {
          stopBreath.current?.();
          stopBreath.current = makeBreathSound(ctx);
        }
      });
    };

    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('click',       unlock, { once: true });

    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('click',       unlock);
      stopAmbient.current?.();
      stopBreath.current?.();
      stopAmbient.current = null;
      stopBreath.current = null;
      narration.current?.pause();
      narration.current = null;
      ctx.close().catch(() => { /**/ });
      ctxRef.current = null;
    };
  }, []);

  // ── Per-scene: swap narration + breath sound ──────────────────────────────
  useEffect(() => {
    const base = sceneKey.replace(/_r[12]$/, '');
    currentBase.current = base;

    // Stop previous narration
    narration.current?.pause();
    narration.current = null;

    // Stop previous breath sound
    stopBreath.current?.();
    stopBreath.current = null;

    // ── Narration ──
    const src = NARRATION[base] ?? null;
    let narTimer: ReturnType<typeof setTimeout> | null = null;

    if (src) {
      const audio = new Audio(src);
      audio.volume = 0.85;
      narration.current = audio;

      if (unlockedRef.current) {
        // Small offset so the scene animation has a moment to start
        narTimer = setTimeout(() => {
          audio.play().catch(() => { /**/ });
        }, 400);
      }
      // else: the unlock handler will call play() on narration.current
    }

    // ── Breath sound (runs in parallel with narration, not instead of it) ──
    if (base === 'breath' && ctxRef.current && unlockedRef.current) {
      stopBreath.current = makeBreathSound(ctxRef.current);
    }

    return () => {
      if (narTimer !== null) clearTimeout(narTimer);
      narration.current?.pause();
      narration.current = null;
      stopBreath.current?.();
      stopBreath.current = null;
    };
  }, [sceneKey]);

  return null;
}
