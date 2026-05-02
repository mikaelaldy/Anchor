import { Mood } from "@/App";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  active: boolean;
  onMoodSelect: (mood: Mood) => void;
}

const moodConfig: { mood: Mood; icon: string }[] = [
  { mood: "Scattered", icon: "air" },
  { mood: "Overwhelmed", icon: "waves" },
  { mood: "Restless", icon: "cyclone" },
];

export default function SensoryLanding({ active, onMoodSelect }: Props) {
  const isMobile = useIsMobile();

  const handleMoodClick = (mood: Mood, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.style.transform = "scale(0.97)";
    setTimeout(() => {
      btn.style.transform = "";
      onMoodSelect(mood);
    }, 150);
  };

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflow: "hidden" }}
    >
      {/* Background decorative ring */}
      <div
        className="ring-pulse"
        style={{
          position: "absolute",
          width: "min(620px, 130vw)",
          height: "min(620px, 130vw)",
          borderRadius: "50%",
          border: "1px solid var(--color-outline-variant)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: "var(--shadow-nav)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "14px 24px" : "16px 32px",
        }}>
          <span style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}>
            Anchor
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 640,
        width: "100%",
        padding: isMobile ? "0 24px" : "0 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: isMobile ? 44 : 56 }}>
          <h1 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 36 : 48,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            marginBottom: 16,
          }}>
            Where is your mind<br />right now?
          </h1>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.6,
            color: "var(--color-muted-mid)",
          }}>
            Find your center, wherever you are.
          </p>
        </div>

        {/* Mood pills */}
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}>
          {moodConfig.map(({ mood, icon }) => (
            <button
              key={mood}
              onClick={(e) => handleMoodClick(mood, e)}
              style={{
                width: "100%",
                maxWidth: 420,
                padding: isMobile ? "22px 28px" : "24px 32px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-surface)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "var(--shadow-pill)",
                transition: "all 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 40px 70px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
                const arrow = e.currentTarget.querySelector<HTMLElement>(".mood-arrow");
                if (arrow) arrow.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-pill)";
                e.currentTarget.style.transform = "translateY(0)";
                const arrow = e.currentTarget.querySelector<HTMLElement>(".mood-arrow");
                if (arrow) arrow.style.opacity = "0";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--color-outline)", fontSize: 22 }}
                >
                  {icon}
                </span>
                <span style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text)",
                }}>
                  {mood}
                </span>
              </div>
              <span
                className="material-symbols-outlined mood-arrow"
                style={{
                  color: "var(--color-outline)",
                  fontSize: 16,
                  opacity: 0,
                  transition: "opacity 200ms",
                }}
              >
                arrow_forward_ios
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 5,
        pointerEvents: "none",
      }}>
        <p style={{
          fontFamily: "var(--font)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
        }}>
          Free forever · Open source · For everyone
        </p>
      </div>
    </div>
  );
}
