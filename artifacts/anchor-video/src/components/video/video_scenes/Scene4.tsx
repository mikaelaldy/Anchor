import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WEEKS = 12;
const DAYS = 7;

// Deterministic pseudo-random grid
function makeGrid(): number[][] {
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      const pos = w * DAYS + d;
      const val = Math.abs(Math.sin(pos * 17.43 + 5.91));
      const thresh = 0.75 - (pos / (WEEKS * DAYS)) * 0.38;
      return val > thresh ? 1 : 0;
    })
  );
}

const grid = makeGrid();
const TOTAL_CELLS = WEEKS * DAYS;

const stats = [
  { value: '5', label: 'Day Streak' },
  { value: '23', label: 'Sessions' },
  { value: '69', label: 'Minutes' },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);
  const [cellsShown, setCellsShown] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 1100);

    // Stagger grid cells in
    let frame: number;
    let startTime: number;
    const STAGGER_MS = 1400;
    const DURATION_MS = 4000;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime - STAGGER_MS;
      const progress = Math.max(0, Math.min(1, elapsed / DURATION_MS));
      setCellsShown(Math.floor(progress * TOTAL_CELLS));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#fdf8f8' }}
      initial={{ opacity: 1, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background circle accent */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.07) 0%, transparent 70%)',
          bottom: '-5%', right: '-5%',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center" style={{ width: '100%', maxWidth: '62vw' }}>
        {/* Heading */}
        <motion.h2
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
            color: '#1c1b1b', marginBottom: '0.4rem', lineHeight: 1,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your journey
        </motion.h2>

        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.2vw, 0.88rem)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#868382', marginBottom: '2.5vh',
          }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          12 weeks of practice
        </motion.p>

        {/* Activity grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
          gap: 'clamp(3px, 0.45vw, 6px)',
          marginBottom: '2.5vh',
        }}>
          {grid.map((week, w) =>
            week.map((active, d) => {
              const idx = w * DAYS + d;
              const shown = idx < cellsShown;
              return (
                <motion.div
                  key={idx}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '3px',
                    background: shown
                      ? active ? '#3e674b' : 'rgba(62,103,75,0.12)'
                      : 'transparent',
                  }}
                  animate={{ scale: shown ? 1 : 0.4, opacity: shown ? 1 : 0 }}
                  transition={{ duration: 0.18 }}
                />
              );
            })
          )}
        </div>

        {/* Stats */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '6vw' }}
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.3rem, 2.8vw, 2.4rem)', color: '#1c1b1b',
              }}>{stat.value}</div>
              <div style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 400,
                fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                letterSpacing: '0.16em', textTransform: 'uppercase', color: '#868382',
              }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
