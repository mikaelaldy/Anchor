import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type BreathPhase = { label: string; duration: number; targetScale: number };

const PHASES: BreathPhase[] = [
  { label: 'Breathe in',  duration: 4000, targetScale: 1.44 },
  { label: 'Hold',        duration: 2000, targetScale: 1.44 },
  { label: 'Let go',      duration: 4000, targetScale: 0.80 },
  { label: '·  ·  ·',    duration: 2000, targetScale: 0.80 },
];

export function Scene3() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [textVis, setTextVis] = useState(true);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntro(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const phase = PHASES[phaseIdx];
    const timer = setTimeout(() => {
      setTextVis(false);
      setTimeout(() => {
        setPhaseIdx(p => (p + 1) % PHASES.length);
        setTextVis(true);
      }, 260);
    }, phase.duration);
    return () => clearTimeout(timer);
  }, [phaseIdx]);

  const phase = PHASES[phaseIdx];
  const isQuiet = phaseIdx === 1 || phaseIdx === 3;
  const nodeDur = isQuiet ? 0.3 : 3.85;
  const nodeEase: [number,number,number,number] = phaseIdx === 0
    ? [0.37, 0, 0.22, 1]
    : [0.4, 0, 0.6, 1];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(155deg, #fdf8f8 0%, #ede7e4 60%, #e8e0dc 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer ring — slow pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '62vmin', height: '62vmin', border: '1px solid rgba(62,103,75,0.1)' }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '78vmin', height: '78vmin', border: '1px solid rgba(28,27,27,0.05)' }}
        animate={{ scale: [1, 1.035, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />

      {/* Session pill */}
      <motion.div
        className="absolute"
        style={{ top: '9%' }}
        initial={{ opacity: 0, y: -10 }}
        animate={intro ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{
          background: 'rgba(191,238,201,0.28)',
          border: '1px solid rgba(62,103,75,0.28)',
          borderRadius: '9999px',
          padding: '0.55vh 2.2vw',
          display: 'flex', alignItems: 'center', gap: '0.6vw',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3e674b', opacity: 0.8 }} />
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 600,
            fontSize: 'clamp(0.52rem, 0.95vw, 0.75rem)',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3e674b',
          }}>3 min · Restless</span>
        </div>
      </motion.div>

      {/* Breathing node */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: '#1c1b1b', width: '22vmin', height: '22vmin' }}
        animate={{ scale: phase.targetScale }}
        transition={{ duration: nodeDur, ease: nodeEase }}
      />

      {/* Rotating arc around node */}
      <motion.div className="absolute" style={{ width: '22vmin', height: '22vmin' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <motion.circle
            cx="50" cy="50" r="60"
            fill="none"
            stroke="rgba(62,103,75,0.3)"
            strokeWidth="0.7"
            strokeDasharray="38 200"
            style={{ transformOrigin: '50px 50px' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Phase label */}
      <motion.div
        className="absolute"
        style={{ bottom: '25%' }}
        animate={{ opacity: textVis ? 1 : 0, y: textVis ? 0 : 10 }}
        transition={{ duration: 0.26 }}
      >
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: isQuiet ? 300 : 500,
          fontSize: isQuiet ? 'clamp(0.7rem, 1.5vw, 1.1rem)' : 'clamp(0.9rem, 2vw, 1.5rem)',
          letterSpacing: isQuiet ? '0.35em' : '0.12em',
          textTransform: 'uppercase',
          color: isQuiet ? '#a8a5a4' : '#1c1b1b',
          textAlign: 'center',
        }}>
          {phase.label}
        </p>
      </motion.div>

      {/* Sub-caption */}
      <motion.p
        className="absolute"
        style={{ top: '18%' }}
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 300,
          fontSize: 'clamp(0.6rem, 1.1vw, 0.85rem)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#868382',
        }}>One breath at a time</span>
      </motion.p>

      {/* Exhale particles */}
      {phaseIdx === 2 && [0,1,2,3,4,5].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + i}px`, height: `${2 + i}px`,
            background: 'rgba(62,103,75,0.35)',
            left: `${47 + Math.cos((i/6)*Math.PI*2)*14}%`,
            top: `${47 + Math.sin((i/6)*Math.PI*2)*14}%`,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.4, 1.3, 0.7],
            x: Math.cos((i/6)*Math.PI*2)*48,
            y: Math.sin((i/6)*Math.PI*2)*48,
          }}
          transition={{ duration: 3.6, ease: 'easeOut', delay: i * 0.12 }}
        />
      ))}
    </motion.div>
  );
}
