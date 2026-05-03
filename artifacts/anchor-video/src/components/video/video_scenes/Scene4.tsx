import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WEEKS = 12;
const DAYS = 7;
const TOTAL = WEEKS * DAYS;

function makeGrid(): number[][] {
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      const pos = w * DAYS + d;
      const v = Math.abs(Math.sin(pos * 17.43 + 5.91));
      const thresh = 0.74 - (pos / TOTAL) * 0.36;
      return v > thresh ? 1 : 0;
    })
  );
}
const GRID = makeGrid();

const CODE_LINES = [
  { indent: 0, text: 'const breath = useBreathTimer();', dim: false },
  { indent: 0, text: '// 4s inhale · 2s hold · 4s exhale', dim: true },
  { indent: 0, text: 'return <MindfulNode phase={breath} />;', dim: false },
];

const STATS = [
  { value: '5', label: 'Day streak' },
  { value: '23', label: 'Sessions' },
  { value: '69', label: 'Minutes' },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);
  const [cellsShown, setCellsShown] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 5800);

    let raf: number;
    let start: number;
    const DELAY = 1400;
    const DUR = 4200;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start - DELAY;
      const p = Math.max(0, Math.min(1, elapsed / DUR));
      setCellsShown(Math.floor(p * TOTAL));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ background: '#fdf8f8', paddingLeft: '9vw', paddingRight: '9vw' }}
      initial={{ opacity: 1, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '42vw', height: '42vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.07) 0%, transparent 70%)',
          bottom: '-8%', right: '-6%', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Heading */}
      <motion.h2
        style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)',
          color: '#1c1b1b', marginBottom: '0.3rem', lineHeight: 1,
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Built in the open.
      </motion.h2>

      <motion.p
        style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 400,
          fontSize: 'clamp(0.6rem, 1.2vw, 0.88rem)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#868382', marginBottom: '2.8vh',
        }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        For everyone
      </motion.p>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '5vw', alignItems: 'flex-start' }}>
        {/* Left — code snippet + tagline */}
        <div style={{ flex: '0 0 auto', width: '30vw' }}>
          {/* Code block */}
          <motion.div
            style={{
              background: '#1c1b1b',
              borderRadius: '10px',
              padding: '1.8vh 1.8vw',
              marginBottom: '2.5vh',
              fontFamily: "'Courier New', monospace",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Window dots */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '1.2vh' }}>
              {['#ff6058','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            {CODE_LINES.map((line, i) => (
              <motion.div
                key={i}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 'clamp(0.55rem, 0.9vw, 0.72rem)',
                  color: line.dim ? '#5a6a5e' : '#bfeec9',
                  lineHeight: 1.7,
                  paddingLeft: `${line.indent * 1.2}em`,
                }}
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: phase >= 1 ? 0.35 + i * 0.15 : 0 }}
              >
                {line.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 700,
              fontSize: 'clamp(0.7rem, 1.3vw, 1rem)',
              color: '#1c1b1b', lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            No sign-ups.<br />
            No paywalls.<br />
            <span style={{ color: '#3e674b' }}>No BS.</span>
          </motion.p>
        </div>

        {/* Right — activity heatmap + stats */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
            gap: 'clamp(2px, 0.4vw, 5px)',
            marginBottom: '2.2vh',
          }}>
            {GRID.map((week, w) =>
              week.map((active, d) => {
                const idx = w * DAYS + d;
                const shown = idx < cellsShown;
                return (
                  <motion.div
                    key={idx}
                    style={{
                      aspectRatio: '1', borderRadius: '2px',
                      background: shown
                        ? active ? '#3e674b' : 'rgba(62,103,75,0.11)'
                        : 'transparent',
                    }}
                    animate={{ scale: shown ? 1 : 0.3, opacity: shown ? 1 : 0 }}
                    transition={{ duration: 0.16 }}
                  />
                );
              })
            )}
          </div>

          {/* Stats */}
          <motion.div
            style={{ display: 'flex', gap: '4vw' }}
            initial={{ opacity: 0, y: 12 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {STATS.map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(1.3rem, 2.8vw, 2.4rem)', color: '#1c1b1b',
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontWeight: 400,
                  fontSize: 'clamp(0.5rem, 0.9vw, 0.7rem)',
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: '#868382',
                }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
