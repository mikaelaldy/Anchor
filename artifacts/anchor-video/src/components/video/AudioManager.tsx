import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;

const NARRATION: Record<string, string> = {
  open:    `${BASE}audio/n1.mp3`,
  mind:    `${BASE}audio/n2.mp3`,
  breath:  `${BASE}audio/n3.mp3`,
  journey: `${BASE}audio/n4.mp3`,
  close:   `${BASE}audio/n5.mp3`,
};

// A minor ambient pad: sine oscillators on A2, E3, A3, C4, E4
function makeAmbientPad(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.048, ctx.currentTime + 5);
  master.connect(ctx.destination);

  // Very slow tremolo LFO (~8 s cycle)
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
      oscs.forEach(o => { try { o.stop(); } catch { /* noop */ } });
      try { lfo.stop(); } catch { /* noop */ }
    }, 1700);
  };
}

// Pink noise filtered for soft breath sound (4s inhale / 2s hold / 4s exhale / 2s rest)
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
    gain.gain.linearRampToValueAtTime(0.085, t + 4);       // inhale
    gain.gain.setValueAtTime(0.085, t + 6);                // hold
    gain.gain.linearRampToValueAtTime(0, t + 10);          // exhale
    setTimeout(() => runCycle(), 12000);
  };
  runCycle();

  return () => {
    active = false;
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => { try { src.stop(); } catch { /* noop */ } }, 700);
  };
}

export function AudioManager({ sceneKey }: { sceneKey: string }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopAmbientRef = useRef<(() => void) | null>(null);
  const stopBreathRef = useRef<(() => void) | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  // Ambient pad — persists for the life of the video
  useEffect(() => {
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      ctxRef.current = ctx;
      stopAmbientRef.current = makeAmbientPad(ctx);
    } catch { /* AudioContext blocked */ }

    return () => {
      stopAmbientRef.current?.();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  // Per-scene: narration + breathing sound
  useEffect(() => {
    const base = sceneKey.replace(/_r[12]$/, '');

    // Stop previous narration
    const prev = narrationRef.current;
    if (prev) { prev.pause(); prev.currentTime = 0; }
    narrationRef.current = null;

    // Stop previous breath sound
    stopBreathRef.current?.();
    stopBreathRef.current = null;

    // Resume audio context (needed after autoplay block)
    ctxRef.current?.resume().catch(() => {});

    // Play narration with a short delay to let the scene animate in first
    const src = NARRATION[base];
    let audio: HTMLAudioElement | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (src) {
      audio = new Audio(src);
      audio.volume = 0.88;
      narrationRef.current = audio;
      timer = setTimeout(() => {
        audio?.play().catch(() => { /* autoplay blocked — ok */ });
      }, 650);
    }

    // Add breathing sound layer during the breath scene
    if (base === 'breath' && ctxRef.current) {
      stopBreathRef.current = makeBreathSound(ctxRef.current);
    }

    return () => {
      if (timer) clearTimeout(timer);
      audio?.pause();
    };
  }, [sceneKey]);

  return null;
}
