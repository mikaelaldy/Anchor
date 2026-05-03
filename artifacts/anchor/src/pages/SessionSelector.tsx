import { useRef } from "react";
import { Mood, Duration, SoundType } from "@/App";
import { SOUNDS } from "@/hooks/useAmbientSound";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  active: boolean;
  mood: Mood;
  sound: SoundType;
  onSoundChange: (s: SoundType) => void;
  onDurationSelect: (duration: Duration) => void;
  onBack: () => void;
}

const durations: { value: Duration; label: string; sub: string }[] = [
  { value: 1, label: "1 min", sub: "Quick reset" },
  { value: 3, label: "3 min", sub: "Reground" },
  { value: 5, label: "5 min", sub: "Full anchor" },
];

export default function SessionSelector({ active, mood, sound, onSoundChange, onDurationSelect, onBack }: Props) {
  const isMobile = useIsMobile();
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelect = (duration: Duration, index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const tile = tileRefs.current[index];
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${x - 20}px`;
    ripple.style.top = `${y - 20}px`;
    ripple.style.width = "40px";
    ripple.style.height = "40px";
    tile.style.position = "relative";
    tile.style.overflow = "hidden";
    tile.appendChild(ripple);
    setTimeout(() => { ripple.remove(); onDurationSelect(duration); }, 400);
  };

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", justifyContent: "flex-start" }}
    >
      {/* Sticky header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.9)",
        backdropFilter: "blur(12px)",
        width: "100%",
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
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-text)",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            Back
          </button>
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

      {/* Content */}
      <div style={{
        maxWidth: 640,
        width: "100%",
        margin: "0 auto",
        padding: isMobile ? "48px 24px 64px" : "64px 32px 64px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h1 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 36 : 48,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            marginBottom: 12,
          }}>
            You're feeling<br />{mood}.
          </h1>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            color: "var(--color-muted-mid)",
            lineHeight: 1.6,
          }}>
            How long do you have right now?
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {durations.map(({ value, label, sub }, i) => (
            <div
              key={value}
              ref={(el) => { tileRefs.current[i] = el; }}
              onClick={(e) => handleSelect(value, i, e)}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-card)",
                padding: isMobile ? "28px 28px" : "36px 40px",
                boxShadow: "var(--shadow-card)",
                cursor: "pointer",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 50px 100px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
            >
              <div>
                <p style={{
                  fontFamily: "var(--font)",
                  fontWeight: 800,
                  fontSize: isMobile ? 40 : 48,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: "var(--color-text)",
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: "var(--font)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--color-muted)",
                  marginTop: 6,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {sub}
                </p>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: "var(--color-outline-variant)" }}
              >
                arrow_forward_ios
              </span>
            </div>
          ))}
        </div>

        {/* Sound picker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            textAlign: "center",
          }}>
            Background sound
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {SOUNDS.map(({ id, label, icon }) => {
              const selected = sound === id;
              return (
                <button
                  key={id}
                  onClick={() => onSoundChange(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 18px",
                    borderRadius: "var(--radius-pill)",
                    border: selected
                      ? "2px solid var(--color-text)"
                      : "2px solid var(--color-outline-variant)",
                    background: selected ? "var(--color-text)" : "transparent",
                    color: selected ? "var(--color-on-primary)" : "var(--color-muted-mid)",
                    fontFamily: "var(--font)",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{
          textAlign: "center",
          fontFamily: "var(--font)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginTop: 4,
        }}>
          No judgment. Even one minute counts.
        </p>
      </div>
    </div>
  );
}
