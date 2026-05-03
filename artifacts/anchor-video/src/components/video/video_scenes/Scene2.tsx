import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const moods = [
  { word: 'Scattered', desc: 'Mind jumping between everything', color: '#1c1b1b', weight: 800 },
  { word: 'Overwhelmed', desc: 'Too much, all at once', color: '#a09d9c', weight: 700 },
  { word: 'Restless', desc: 'Buzzing energy with nowhere to go', color: '#3e674b', weight: 800 },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 5400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ background: '#fdf8f8', paddingLeft: '9vw', paddingRight: '9vw' }}
      initial={{ opacity: 1, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient green blob — top right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '38vw', height: '38vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.07) 0%, transparent 70%)',
          top: '-8%', right: '-6%', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Drifting micro-dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3) * 2}px`, height: `${2 + (i % 3) * 2}px`,
            background: i % 2 === 0 ? 'rgba(62,103,75,0.13)' : 'rgba(28,27,27,0.07)',
            left: `${8 + (i * 7.1) % 82}%`,
            top: `${12 + (i * 9.3) % 76}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.5 + (i % 3) * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.28 }}
        />
      ))}

      <div className="relative z-10" style={{ maxWidth: '62vw' }}>
        {/* Opening line */}
        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 300,
            fontSize: 'clamp(1rem, 2.1vw, 1.65rem)',
            color: '#868382', marginBottom: '3.5vh',
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          You know this feeling.
        </motion.p>

        {/* The three moods — large, editorial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', marginBottom: '4vh' }}>
          {moods.map((mood, i) => (
            <motion.div
              key={mood.word}
              style={{ display: 'flex', alignItems: 'baseline', gap: '1.4vw' }}
              initial={{ opacity: 0, x: -30 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: phase >= 2 ? i * 0.18 : 0 }}
            >
              <span style={{ color: mood.color, opacity: 0.5, fontSize: '0.65rem', marginBottom: '0.3rem', flexShrink: 0 }}>
                {'—'}
              </span>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: mood.weight,
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                color: mood.color,
                letterSpacing: '-0.025em',
                lineHeight: 1.08,
              }}>
                {mood.word}
              </span>
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 400,
                fontSize: 'clamp(0.55rem, 0.95vw, 0.75rem)',
                color: '#b5b2b1', alignSelf: 'center',
              }}>
                {mood.desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Closing lines */}
        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 400,
            fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
            color: '#868382',
          }}
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          Most of us carry this around. Alone.
        </motion.p>

        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 600,
            fontSize: 'clamp(0.7rem, 1.4vw, 1rem)',
            color: '#3e674b', marginTop: '1.2vh',
            letterSpacing: '0.04em',
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.8 }}
        >
          Until now.
        </motion.p>
      </div>
    </motion.div>
  );
}
