import { useState } from "react";
import MarketingLanding from "@/pages/MarketingLanding";
import SensoryLanding from "@/pages/SensoryLanding";
import SessionSelector from "@/pages/SessionSelector";
import KineticPlayer from "@/pages/KineticPlayer";
import DopamineReward from "@/pages/DopamineReward";

export type Mood = "Scattered" | "Paralyzed" | "Buzzing";
export type Duration = 1 | 3 | 5;
export type Screen = "home" | "landing" | "selector" | "player" | "reward";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mood, setMood] = useState<Mood>("Scattered");
  const [duration, setDuration] = useState<Duration>(3);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <MarketingLanding
        active={screen === "home"}
        onStart={() => setScreen("landing")}
      />
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
        onRestart={() => setScreen("home")}
      />
    </div>
  );
}
