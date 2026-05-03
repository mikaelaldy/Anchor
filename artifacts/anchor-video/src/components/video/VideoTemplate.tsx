import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { useEffect } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { AudioManager } from './AudioManager';

export const SCENE_DURATIONS = {
  open:    7500,
  mind:    9000,
  breath:  12000,
  journey: 9000,
  close:   8000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open:    Scene1,
  mind:    Scene2,
  breath:  Scene3,
  journey: Scene4,
  close:   Scene5,
};

// Persistent green orb — drifts to a new position each scene
const ORB_POS = [
  { x: '2vw',  y: '52vh', scale: 2.6, opacity: 0.20 },  // open
  { x: '62vw', y: '2vh',  scale: 1.7, opacity: 0.13 },  // mind
  { x: '28vw', y: '26vh', scale: 3.4, opacity: 0.22 },  // breath
  { x: '52vw', y: '55vh', scale: 1.4, opacity: 0.10 },  // journey
  { x: '-6vw', y: '14vh', scale: 3.0, opacity: 0.16 },  // close
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const safeIdx = Math.max(0, Math.min(sceneIndex, ORB_POS.length - 1));
  const pos = ORB_POS[safeIdx];
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Audio manager — ambient pad + per-scene narration + breath sound */}
      <AudioManager sceneKey={currentSceneKey} />

      {/* Persistent green orb that morphs position between scenes */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '20vw', height: '20vw',
          background: 'radial-gradient(circle, #3e674b, transparent)',
          pointerEvents: 'none', zIndex: 0,
        }}
        animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
        transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Warm mist orb — slow ambient drift */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '14vw', height: '14vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.05), transparent)',
          pointerEvents: 'none', zIndex: 0,
        }}
        animate={{ x: ['72vw', '78vw', '72vw'], y: ['6vh', '16vh', '6vh'], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Scenes */}
      <AnimatePresence initial={false} mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
