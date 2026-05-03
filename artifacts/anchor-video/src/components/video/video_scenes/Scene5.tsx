import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COMMITMENTS = ['Free forever', 'Open source', 'For everyone'];
const WORD1 = 'Stillness'.split('');
const WORD2 = 'for everyone.'.split('');

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        background: 'linear-gradient(140deg, #1a1917 0%, #141312 70%, #111110 100%)',
        paddingLeft: '9vw', paddingRight: '9vw',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6 }}
    >
      {/* Green atmospheric glow — right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '55vw', height: '55vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.13) 0%, transparent 70%)',
          right: '-10%', top: '50%', transform: 'translateY(-50%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Warm glow top-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '25vw', height: '25vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.04) 0%, transparent 70%)',
          left: '-5%', top: '10%',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Anchor name — top-left */}
      <motion.div
        className="absolute"
        style={{ top: '8%', left: '9vw' }}
        initial={{ opacity: 0, y: -10 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 800,
          fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
          letterSpacing: '-0.01em', color: '#fdf8f8',
        }}>Anchor</span>
      </motion.div>

      {/* Main headline */}
      <div className="relative z-10" style={{ perspective: '1400px' }}>
        {/* Line 1: Stillness */}
        <div className="flex flex-wrap" style={{ lineHeight: 1 }}>
          {WORD1.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
                letterSpacing: '-0.03em', lineHeight: 1.02, color: '#fdf8f8',
              }}
              initial={{ opacity: 0, y: 70, rotateX: -50 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 70, rotateX: -50 }}
              transition={{
                type: 'spring', stiffness: 300, damping: 26,
                delay: phase >= 2 ? i * 0.045 : 0,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Line 2: for everyone. */}
        <div className="flex flex-wrap" style={{ lineHeight: 1.1 }}>
          {WORD2.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: 'Manrope, sans-serif', fontWeight: 300,
                fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
                letterSpacing: '-0.03em', lineHeight: 1.1,
                color: 'rgba(253,248,248,0.45)',
              }}
              initial={{ opacity: 0, y: 70, rotateX: -50 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 70, rotateX: -50 }}
              transition={{
                type: 'spring', stiffness: 300, damping: 26,
                delay: phase >= 2 ? (WORD1.length * 0.045 + 0.12 + i * 0.038) : 0,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Three commitments */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '1.5vw', marginTop: '4.5vh' }}
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {COMMITMENTS.map((text, i) => (
            <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 500,
                fontSize: 'clamp(0.6rem, 1.2vw, 0.92rem)',
                letterSpacing: '0.1em', color: 'rgba(253,248,248,0.5)',
              }}>{text}</span>
              {i < COMMITMENTS.length - 1 && (
                <span style={{ color: 'rgba(253,248,248,0.2)', fontSize: '0.9em', lineHeight: 1 }}>·</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom right SVG mark */}
      <motion.div
        className="absolute"
        style={{ bottom: '8%', right: '8vw', width: '5.5vw', height: '5.5vw' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" stroke="rgba(253,248,248,0.2)" strokeWidth="1" />
          <circle cx="30" cy="30" r="7" fill="rgba(62,103,75,0.7)" />
          <motion.circle
            cx="30" cy="30" r="18"
            fill="none" stroke="rgba(62,103,75,0.3)" strokeWidth="0.8"
            style={{ transformOrigin: '30px 30px' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Drifting small dots — background texture */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '4px', height: '4px',
            background: 'rgba(62,103,75,0.4)',
            left: `${15 + i * 20}%`,
            top: `${65 + (i % 2) * 15}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}
    </motion.div>
  );
}
