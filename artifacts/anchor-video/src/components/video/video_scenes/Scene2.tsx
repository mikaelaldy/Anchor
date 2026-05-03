import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const moods = [
  { label: 'Scattered', desc: 'Mind jumping, unfocused', color: 'rgba(62,103,75,0.1)', border: 'rgba(62,103,75,0.35)', dot: '#3e674b' },
  { label: 'Overwhelmed', desc: 'Too much, too fast', color: 'rgba(28,27,27,0.06)', border: 'rgba(28,27,27,0.2)', dot: '#868382' },
  { label: 'Restless', desc: 'Buzzing energy within', color: 'rgba(191,238,201,0.2)', border: 'rgba(191,238,201,0.6)', dot: '#3e674b' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#fdf8f8' }}
      initial={{ opacity: 1, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Drifting background dots */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            background: i % 3 === 0 ? 'rgba(62,103,75,0.18)' : 'rgba(28,27,27,0.07)',
            left: `${8 + (i * 6.1) % 84}%`,
            top: `${10 + (i * 8.7) % 80}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 3 + (i % 4) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
        />
      ))}

      {/* Soft green blob top-right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.08) 0%, transparent 70%)',
          top: '-5%', right: '-5%',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center" style={{ width: '100%', maxWidth: '55vw' }}>
        {/* Label pill */}
        <motion.div
          style={{
            background: 'rgba(28,27,27,0.06)',
            border: '1px solid rgba(28,27,27,0.12)',
            borderRadius: '9999px',
            padding: '0.5vh 1.5vw',
            marginBottom: '2.5vh',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 600,
            fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#868382',
          }}>Check in</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)',
            color: '#1c1b1b', marginBottom: '4vh',
            lineHeight: 1.2, textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Where is your mind right now?
        </motion.h2>

        {/* Mood pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh', width: '100%', alignItems: 'center' }}>
          {moods.map((mood, i) => (
            <motion.div
              key={mood.label}
              style={{
                background: mood.color,
                border: `1px solid ${mood.border}`,
                borderRadius: '9999px',
                padding: '1.4vh 3vw',
                width: 'clamp(220px, 40vw, 460px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
              initial={{ opacity: 0, x: -28, scale: 0.95 }}
              animate={phase >= 2 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -28, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: phase >= 2 ? i * 0.14 : 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: mood.dot, flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                  fontSize: 'clamp(0.85rem, 1.7vw, 1.2rem)', color: '#1c1b1b',
                }}>{mood.label}</span>
              </div>
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 400,
                fontSize: 'clamp(0.6rem, 1vw, 0.8rem)', color: '#868382',
              }}>{mood.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* Sub-caption */}
        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.1vw, 0.82rem)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#868382', marginTop: '3.5vh',
          }}
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Your practice, your pace
        </motion.p>
      </div>
    </motion.div>
  );
}
