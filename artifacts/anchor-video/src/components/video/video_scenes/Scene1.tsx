import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursorOn(c => !c), 520);
    const timers = [
      setTimeout(() => setPhase(1), 300),   // line 1 types in
      setTimeout(() => setPhase(2), 2200),  // line 2 types in
      setTimeout(() => setPhase(3), 4400),  // ANCHOR reveals
      setTimeout(() => setPhase(4), 5800),  // tagline fades
    ];
    return () => {
      clearInterval(blink);
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        background: 'linear-gradient(145deg, #1a1917 0%, #1e1d1c 55%, #161514 100%)',
        paddingLeft: '10vw',
        paddingRight: '10vw',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6 }}
    >
      {/* Green atmospheric glow — bottom-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '55vw', height: '55vw',
          background: 'radial-gradient(circle, rgba(62,103,75,0.13) 0%, transparent 70%)',
          bottom: '-20%', left: '-12%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Warm mist — top right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.03) 0%, transparent 70%)',
          top: '5%', right: '5%',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.12, 1], x: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Line 1 — personal opening */}
      <div style={{ marginBottom: '1.8vh', minHeight: '1.4em' }}>
        <motion.span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(1.1rem, 2.6vw, 2.1rem)',
            color: 'rgba(253,248,248,0.72)',
            letterSpacing: '-0.005em',
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          I couldn't stop thinking.
          {phase === 1 && (
            <span style={{
              display: 'inline-block',
              width: '2px', height: '1.05em',
              background: 'rgba(62,103,75,0.85)',
              marginLeft: '3px',
              verticalAlign: 'text-bottom',
              opacity: cursorOn ? 1 : 0,
              transition: 'opacity 0.05s',
            }} />
          )}
        </motion.span>
      </div>

      {/* Line 2 */}
      <div style={{ marginBottom: '6vh', minHeight: '1.4em' }}>
        <motion.span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(1.1rem, 2.6vw, 2.1rem)',
            color: 'rgba(253,248,248,0.4)',
            letterSpacing: '-0.005em',
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          So I built something.
          {phase === 2 && (
            <span style={{
              display: 'inline-block',
              width: '2px', height: '1.05em',
              background: 'rgba(62,103,75,0.75)',
              marginLeft: '3px',
              verticalAlign: 'text-bottom',
              opacity: cursorOn ? 1 : 0,
              transition: 'opacity 0.05s',
            }} />
          )}
        </motion.span>
      </div>

      {/* ANCHOR wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(3.2rem, 10vw, 8.5rem)',
          color: '#fdf8f8',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          display: 'block',
        }}>
          ANCHOR
        </span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(0.55rem, 1.1vw, 0.82rem)',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(253,248,248,0.3)',
          marginTop: '2.2vh',
        }}
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        A meditation app for every mind
      </motion.p>

      {/* Floating ambient dots */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: 'rgba(62,103,75,0.45)',
            right: `${12 + i * 7}%`,
            top: `${22 + (i % 3) * 18}%`,
          }}
          animate={{ y: [0, -9, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 3.2 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 }}
        />
      ))}
    </motion.div>
  );
}
