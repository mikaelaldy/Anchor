import { useState, useEffect } from "react";
import MarketingLanding from "@/pages/MarketingLanding";
import SensoryLanding from "@/pages/SensoryLanding";
import SessionSelector from "@/pages/SessionSelector";
import KineticPlayer from "@/pages/KineticPlayer";
import DopamineReward from "@/pages/DopamineReward";
import Dashboard from "@/pages/Dashboard";
import { useAuth } from "@workspace/replit-auth-web";
import { type SoundType } from "@/hooks/useAmbientSound";

export type Mood = "Scattered" | "Overwhelmed" | "Restless";
export type Duration = 1 | 3 | 5;
export type Screen = "home" | "landing" | "selector" | "player" | "reward" | "dashboard";
export type { SoundType };

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mood, setMood] = useState<Mood>("Scattered");
  const [duration, setDuration] = useState<Duration>(3);
  const [sound, setSound] = useState<SoundType>("rain");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const pending = sessionStorage.getItem("anchor_pending_sync");
    if (!pending) return;
    sessionStorage.removeItem("anchor_pending_sync");
    const savedDuration = sessionStorage.getItem("anchor_pending_duration");
    if (savedDuration) {
      const d = Number(savedDuration) as Duration;
      if (d === 1 || d === 3 || d === 5) setDuration(d);
      sessionStorage.removeItem("anchor_pending_duration");
    }
    setScreen("reward");
  }, [isAuthenticated]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <MarketingLanding
        active={screen === "home"}
        onStart={() => setScreen("landing")}
        onDashboard={() => setScreen("dashboard")}
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
        sound={sound}
        onSoundChange={setSound}
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
        sound={sound}
        onComplete={() => setScreen("reward")}
        onBack={() => setScreen("selector")}
      />
      <DopamineReward
        active={screen === "reward"}
        duration={duration}
        onRestart={() => setScreen("home")}
        onDashboard={() => setScreen("dashboard")}
      />
      <Dashboard
        active={screen === "dashboard"}
        onBack={() => setScreen("home")}
        onStart={() => setScreen("landing")}
      />
    </div>
  );
}
