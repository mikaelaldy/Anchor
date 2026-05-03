import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const chars = 'ANCHOR'.split('');

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(145deg, #1a1917 0%, #222120 55%, #1c1b1b 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient green glow — bottom left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '45vw', height: '45vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.14) 0%, transparent 70%)',
          bottom: '-10%', left: '-8%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ambient warm glow — top right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.04) 0%, transparent 70%)',
          top: '5%', right: '5%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.12, 1], x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer SVG ring — traces in */}
      <motion.div
        className="absolute"
        style={{ width: '30vmin', height: '30vmin', pointerEvents: 'none' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <motion.circle
            cx="100" cy="100" r="92"
            fill="none"
            stroke="rgba(253,248,248,0.08)"
            strokeWidth="0.8"
            pathLength={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="100" cy="100" r="92"
            fill="none"
            stroke="rgba(62,103,75,0.45)"
            strokeWidth="0.6"
            strokeDasharray="30 200"
            initial={{ rotate: -90 }}
            animate={{ rotate: 270 }}
            style={{ transformOrigin: '100px 100px' }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Inner node */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '6vmin', height: '6vmin', background: '#fdf8f8' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 0.9 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.2 }}
      />

      {/* ANCHOR letters */}
      <div className="relative z-10 text-center" style={{ perspective: '1200px' }}>
        <div className="flex items-center justify-center">
          {chars.map((char, i) => (
            <motion.span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: '#fdf8f8',
                lineHeight: 1,
              }}
              initial={{ opacity: 0, y: 50, rotateX: -50 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -50 }}
              transition={{
                type: 'spring', stiffness: 340, damping: 26,
                delay: phase >= 2 ? i * 0.07 : 0,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.4vw, 1rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(253,248,248,0.4)',
            marginTop: '1.8vh',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          A visual deep breath
        </motion.p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute"
        style={{
          bottom: '12%', left: '50%', height: '1px',
          width: '18vw',
          background: 'rgba(253,248,248,0.12)',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0, x: '-50%' }}
        animate={phase >= 3 ? { scaleX: 1, x: '-50%' } : { scaleX: 0, x: '-50%' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />

      {/* Floating micro dots */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${3 + i}px`, height: `${3 + i}px`,
            background: 'rgba(62,103,75,0.5)',
            left: `${20 + i * 18}%`,
            top: `${70 + (i % 2) * 12}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
    </motion.div>
  );
}
