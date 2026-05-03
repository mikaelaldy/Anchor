import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COMMITMENTS = ['Free forever', 'Open source', 'For everyone'];

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 4200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const w1 = 'Stillness'.split('');
  const w2 = 'for everyone.'.split('');

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        background: 'linear-gradient(140deg, #1a1917 0%, #141312 65%, #0f0e0d 100%)',
        paddingLeft: '9vw', paddingRight: '9vw',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.7 }}
    >
      {/* Green atmospheric glow — right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '58vw', height: '58vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.14) 0%, transparent 70%)',
          right: '-12%', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Warm glow — top left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '22vw', height: '22vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.04) 0%, transparent 70%)',
          left: '-5%', top: '8%', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Anchor name — top */}
      <motion.div
        className="absolute"
        style={{ top: '8%', left: '9vw' }}
        initial={{ opacity: 0, y: -10 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.7 }}
      >
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 800,
          fontSize: 'clamp(0.85rem, 1.7vw, 1.3rem)',
          letterSpacing: '-0.01em', color: '#fdf8f8',
        }}>Anchor</span>
      </motion.div>

      {/* Main headline */}
      <div className="relative z-10" style={{ perspective: '1400px' }}>
        {/* Stillness */}
        <div className="flex flex-wrap">
          {w1.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                fontSize: 'clamp(3.2rem, 10vw, 9rem)',
                letterSpacing: '-0.03em', lineHeight: 1.02, color: '#fdf8f8',
              }}
              initial={{ opacity: 0, y: 75, rotateX: -52 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 75, rotateX: -52 }}
              transition={{ type: 'spring', stiffness: 290, damping: 25, delay: phase >= 2 ? i * 0.046 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* for everyone. */}
        <div className="flex flex-wrap">
          {w2.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: 'Manrope, sans-serif', fontWeight: 300,
                fontSize: 'clamp(3.2rem, 10vw, 9rem)',
                letterSpacing: '-0.03em', lineHeight: 1.08,
                color: 'rgba(253,248,248,0.42)',
              }}
              initial={{ opacity: 0, y: 75, rotateX: -52 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 75, rotateX: -52 }}
              transition={{
                type: 'spring', stiffness: 290, damping: 25,
                delay: phase >= 2 ? (w1.length * 0.046 + 0.13 + i * 0.038) : 0,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Commitments */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '1.8vw', marginTop: '5vh' }}
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {COMMITMENTS.map((text, i) => (
            <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '1.8vw' }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 500,
                fontSize: 'clamp(0.6rem, 1.2vw, 0.92rem)',
                letterSpacing: '0.1em', color: 'rgba(253,248,248,0.48)',
              }}>{text}</span>
              {i < COMMITMENTS.length - 1 && (
                <span style={{ color: 'rgba(253,248,248,0.18)', fontSize: '0.85em' }}>·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Personal sign-off */}
        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)',
            letterSpacing: '0.06em', fontStyle: 'italic',
            color: 'rgba(253,248,248,0.28)', marginTop: '2vh',
          }}
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          — built because I needed it, shared because you might too.
        </motion.p>
      </div>

      {/* SVG mark — bottom right */}
      <motion.div
        className="absolute"
        style={{ bottom: '8%', right: '8vw', width: '5vw', height: '5vw' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" stroke="rgba(253,248,248,0.18)" strokeWidth="1" />
          <circle cx="30" cy="30" r="7" fill="rgba(62,103,75,0.7)" />
          <motion.circle
            cx="30" cy="30" r="18"
            fill="none" stroke="rgba(62,103,75,0.28)" strokeWidth="0.8"
            style={{ transformOrigin: '30px 30px' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Ambient dots */}
      {[0,1,2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '4px', height: '4px',
            background: 'rgba(62,103,75,0.38)',
            left: `${14 + i * 22}%`, top: `${68 + (i % 2) * 14}%`,
          }}
          animate={{ y: [0, -11, 0], opacity: [0.22, 0.55, 0.22] }}
          transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
        />
      ))}
    </motion.div>
  );
}
