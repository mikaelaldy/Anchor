import { useEffect, useRef } from "react";

export type SoundType = "none" | "rain" | "ocean" | "bowl";

export const SOUNDS: { id: SoundType; label: string; icon: string }[] = [
  { id: "none",  label: "None",  icon: "volume_off" },
  { id: "rain",  label: "Rain",  icon: "water_drop" },
  { id: "ocean", label: "Ocean", icon: "waves" },
  { id: "bowl",  label: "Bowl",  icon: "music_note" },
];

function makeBrownNoise(ctx: AudioContext): AudioBufferSourceNode {
  const sr  = ctx.sampleRate;
  const buf = ctx.createBuffer(2, sr * 4, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.8;
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  return src;
}

export function useAmbientSound(
  sound:  SoundType,
  active: boolean,
  paused: boolean,
  phase:  string,
) {
  const ctxRef    = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const prevPhase = useRef(phase);
  const TARGET_GAIN = 0.72;

  useEffect(() => {
    if (!active || sound === "none") return;

    const ctx    = new AudioContext();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.connect(ctx.destination);
    ctxRef.current   = ctx;
    masterRef.current = master;

    ctx.resume().catch(() => {});

    const stoppers: (() => void)[] = [];

    if (sound === "rain") {
      const src  = makeBrownNoise(ctx);
      const lp   = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 480;
      lp.Q.value = 0.6;
      const body = ctx.createGain();
      body.gain.value = 0.58;
      src.connect(lp); lp.connect(body); body.connect(master);

      const src2 = makeBrownNoise(ctx);
      const hp   = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2800;
      const shim = ctx.createGain();
      shim.gain.value = 0.07;
      src2.connect(hp); hp.connect(shim); shim.connect(master);

      src.start(); src2.start();
      stoppers.push(() => { try { src.stop();  } catch {} });
      stoppers.push(() => { try { src2.stop(); } catch {} });
    }

    if (sound === "ocean") {
      const src = makeBrownNoise(ctx);
      const lp  = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 340;
      lp.Q.value = 0.4;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.46;

      const lfo      = ctx.createOscillator();
      const lfoScale = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.07;
      lfoScale.gain.value = 0.26;
      lfo.connect(lfoScale);
      lfoScale.connect(waveGain.gain);

      src.connect(lp); lp.connect(waveGain); waveGain.connect(master);
      lfo.start(); src.start();
      stoppers.push(() => { try { lfo.stop(); } catch {} });
      stoppers.push(() => { try { src.stop(); } catch {} });
    }

    if (sound === "bowl") {
      const freqs  = [174, 261, 396];
      const gains  = [0.10, 0.06, 0.04];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = gains[i];
        osc.connect(g); g.connect(master);
        osc.start();
        stoppers.push(() => { try { osc.stop(); } catch {} });
      });
    }

    master.gain.linearRampToValueAtTime(TARGET_GAIN, ctx.currentTime + 2.2);

    return () => {
      const m = masterRef.current;
      const c = ctxRef.current;
      if (m && c) {
        try {
          m.gain.cancelScheduledValues(c.currentTime);
          m.gain.setValueAtTime(m.gain.value, c.currentTime);
          m.gain.linearRampToValueAtTime(0, c.currentTime + 1.2);
        } catch {}
      }
      setTimeout(() => {
        stoppers.forEach(s => s());
        c?.close().catch(() => {});
      }, 1500);
      ctxRef.current   = null;
      masterRef.current = null;
    };
  }, [active, sound]);

  useEffect(() => {
    const ctx    = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    try {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      if (paused) {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
      } else {
        master.gain.linearRampToValueAtTime(TARGET_GAIN, ctx.currentTime + 0.55);
      }
    } catch {}
  }, [paused]);

  useEffect(() => {
    if (sound === "none" || !active || paused) return;
    if (phase === prevPhase.current) return;
    prevPhase.current = phase;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const freq = phase === "Inhale" ? 528 : phase === "Hold" ? 432 : 396;
    try {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);
      osc.connect(env); env.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.2);
    } catch {}
  }, [phase, sound, active, paused]);
}
