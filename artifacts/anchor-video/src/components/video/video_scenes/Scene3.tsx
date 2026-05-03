import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Phase = { label: string; duration: number; targetScale: number };

const BREATH_PHASES: Phase[] = [
  { label: 'Inhale', duration: 4000, targetScale: 1.42 },
  { label: 'Hold', duration: 2000, targetScale: 1.42 },
  { label: 'Exhale', duration: 4000, targetScale: 0.82 },
  { label: '\u00B7\u00B7\u00B7', duration: 2000, targetScale: 0.82 },
];

const INHALE_EASE = [0.4, 0, 0.2, 1] as const;
const EXHALE_EASE = [0.4, 0, 0.6, 1] as const;

export function Scene3() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntro(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const phase = BREATH_PHASES[phaseIdx];
    const timer = setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => {
        setPhaseIdx(prev => (prev + 1) % BREATH_PHASES.length);
        setTextVisible(true);
      }, 280);
    }, phase.duration);
    return () => clearTimeout(timer);
  }, [phaseIdx]);

  const phase = BREATH_PHASES[phaseIdx];
  const isHold = phase.label === 'Hold' || phase.label === '\u00B7\u00B7\u00B7';
  const nodeDuration = isHold ? 0.3 : phase.label === 'Inhale' ? 3.8 : 3.8;
  const nodeEase = phase.label === 'Inhale' ? INHALE_EASE : EXHALE_EASE;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #fdf8f8 0%, #f0ebe8 60%, #ede5e2 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer ambient ring 1 — slow pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '60vmin', height: '60vmin', border: '1px solid rgba(62,103,75,0.1)' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Outer ambient ring 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '75vmin', height: '75vmin', border: '1px solid rgba(28,27,27,0.05)' }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Session pill at top */}
      <motion.div
        className="absolute"
        style={{ top: '8%' }}
        initial={{ opacity: 0, y: -12 }}
        animate={intro ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{
          background: 'rgba(191,238,201,0.3)',
          border: '1px solid rgba(62,103,75,0.3)',
          borderRadius: '9999px', padding: '0.6vh 2.2vw',
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 600,
            fontSize: 'clamp(0.55rem, 1vw, 0.8rem)',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3e674b',
          }}>3 min · Restless</span>
        </div>
      </motion.div>

      {/* Breathing node */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: '#1c1b1b', width: '22vmin', height: '22vmin' }}
        animate={{ scale: phase.targetScale }}
        transition={{ duration: nodeDuration, ease: nodeEase }}
      />

      {/* Ring tracing around the node */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '22vmin', height: '22vmin' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <motion.circle
            cx="50" cy="50" r="58"
            fill="none"
            stroke="rgba(62,103,75,0.35)"
            strokeWidth="0.8"
            strokeDasharray="40 200"
            style={{ transformOrigin: '50px 50px' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>

      {/* Phase label */}
      <motion.div
        className="absolute"
        style={{ bottom: '28%' }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: isHold ? 300 : 600,
          fontSize: 'clamp(0.9rem, 2.2vw, 1.6rem)',
          letterSpacing: isHold ? '0.35em' : '0.18em',
          textTransform: 'uppercase',
          color: isHold ? '#868382' : '#1c1b1b',
          textAlign: 'center',
        }}>{phase.label}</p>
      </motion.div>

      {/* Floating micro particles emanating on exhale */}
      {phaseIdx === 2 && [0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${3 + i}px`, height: `${3 + i}px`,
            background: 'rgba(62,103,75,0.4)',
            left: `${45 + Math.cos((i / 5) * Math.PI * 2) * 18}%`,
            top: `${45 + Math.sin((i / 5) * Math.PI * 2) * 18}%`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.4, 0.8], x: Math.cos((i / 5) * Math.PI * 2) * 40, y: Math.sin((i / 5) * Math.PI * 2) * 40 }}
          transition={{ duration: 3.5, ease: 'easeOut', delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}
