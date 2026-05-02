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
    <>
      <div
        className="mobile-message"
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-bg)",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          padding: 32,
          textAlign: "center",
          zIndex: 9999,
        }}
      >
        <span style={{ fontSize: 48 }}>⚓</span>
        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, color: "var(--color-text)" }}>
          Anchor
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--color-muted)", lineHeight: 1.6 }}>
          Anchor is best on desktop.<br />Mobile coming soon.
        </p>
      </div>

      <div className="app-content" style={{ position: "fixed", inset: 0 }}>
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
        />
        <KineticPlayer
          active={screen === "player"}
          mood={mood}
          duration={duration}
          onComplete={() => setScreen("reward")}
        />
        <DopamineReward
          active={screen === "reward"}
          duration={duration}
          onRestart={() => setScreen("landing")}
        />
      </div>
    </>
  );
}
