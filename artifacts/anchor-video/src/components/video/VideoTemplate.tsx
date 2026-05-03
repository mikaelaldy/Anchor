import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { useEffect } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = {
  open: 7500,
  mind: 9000,
  breath: 12000,
  journey: 8500,
  close: 8000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open: Scene1,
  mind: Scene2,
  breath: Scene3,
  journey: Scene4,
  close: Scene5,
};

// Persistent green orb position per scene index
const ORB_POS = [
  { x: '3vw',  y: '55vh', scale: 2.4, opacity: 0.22 },  // open
  { x: '65vw', y: '2vh',  scale: 1.6, opacity: 0.14 },  // mind
  { x: '30vw', y: '28vh', scale: 3.2, opacity: 0.25 },  // breath
  { x: '55vw', y: '58vh', scale: 1.3, opacity: 0.11 },  // journey
  { x: '-8vw', y: '15vh', scale: 2.8, opacity: 0.17 },  // close
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
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const safeIndex = Math.max(0, Math.min(sceneIndex, ORB_POS.length - 1));
  const pos = ORB_POS[safeIndex];
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Persistent drifting green orb — morphs position between scenes */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '20vw',
          height: '20vw',
          background: 'radial-gradient(circle, #3e674b, transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: pos.scale,
          opacity: pos.opacity,
        }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Persistent slowly-drifting warm orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '15vw',
          height: '15vw',
          background: 'radial-gradient(circle, rgba(253,248,248,0.06), transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          x: ['75vw', '80vw', '75vw'],
          y: ['8vh', '18vh', '8vh'],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Scenes — only foreground content mounts/unmounts */}
      <AnimatePresence initial={false} mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
