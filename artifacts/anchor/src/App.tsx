import { useState } from "react";
import SensoryLanding from "@/pages/SensoryLanding";
import SessionSelector from "@/pages/SessionSelector";
import KineticPlayer from "@/pages/KineticPlayer";
import DopamineReward from "@/pages/DopamineReward";

export type Mood = "Scattered" | "Paralyzed" | "Buzzing";
export type Duration = 1 | 3 | 5;
export type Screen = "landing" | "selector" | "player" | "reward";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [mood, setMood] = useState<Mood>("Scattered");
  const [duration, setDuration] = useState<Duration>(3);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <SensoryLanding
        active={screen === "landing"}
        onMoodSelect={(m) => {
          setMood(m);
          setScreen("selector");
        }}
      />
      <SessionSelector
        active={screen === "selector"}
        mood={mood}
        onDurationSelect={(d) => {
          setDuration(d);
          setScreen("player");
        }}
        onBack={() => setScreen("landing")}
      />
      <KineticPlayer
        active={screen === "player"}
        mood={mood}
        duration={duration}
        onComplete={() => setScreen("reward")}
        onBack={() => setScreen("selector")}
      />
      <DopamineReward
        active={screen === "reward"}
        duration={duration}
        onRestart={() => setScreen("landing")}
      />
    </div>
  );
}
