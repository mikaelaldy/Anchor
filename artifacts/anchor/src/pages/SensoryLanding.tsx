import { Mood } from "@/App";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  active: boolean;
  onMoodSelect: (mood: Mood) => void;
}

const moods: Mood[] = ["Scattered", "Overwhelmed", "Restless"];

export default function SensoryLanding({ active, onMoodSelect }: Props) {
  const isMobile = useIsMobile();

  const handleMoodClick = (mood: Mood, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "";
      onMoodSelect(mood);
    }, 150);
  };

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 60% 40%, rgba(140,122,107,0.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 800,
          width: "100%",
          padding: isMobile ? "0 24px" : "0 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: isMobile ? 36 : 48,
            color: "var(--color-text)",
            letterSpacing: "-0.02em",
          }}
        >
          Anchor
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            color: "var(--color-muted)",
            marginTop: 12,
          }}
        >
          A breath when you need one.
        </p>

        <div style={{ height: isMobile ? 36 : 48 }} />

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            color: "var(--color-text)",
          }}
        >
          How are you feeling right now?
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
            width: isMobile ? "100%" : "auto",
          }}
        >
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={(e) => handleMoodClick(mood, e)}
              style={{
                padding: isMobile ? "14px 0" : "12px 24px",
                width: isMobile ? "100%" : "auto",
                borderRadius: "100px",
                background: "var(--color-surface)",
                border: "var(--border)",
                color: "var(--color-text)",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                boxShadow: "var(--shadow)",
                cursor: "pointer",
                transition: "background 200ms, border-color 200ms, color 200ms, transform 150ms",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.background = "#1A1A1A";
                t.style.borderColor = "#1A1A1A";
                t.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.background = "var(--color-surface)";
                t.style.borderColor = "rgba(26,26,26,0.10)";
                t.style.color = "var(--color-text)";
              }}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--color-muted)",
            letterSpacing: "0.05em",
          }}
        >
          Free forever, open source, for everyone
        </p>
      </div>
    </div>
  );
}
