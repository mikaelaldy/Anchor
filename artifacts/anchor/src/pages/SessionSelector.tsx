import { useRef } from "react";
import { Mood, Duration } from "@/App";

interface Props {
  active: boolean;
  mood: Mood;
  onDurationSelect: (duration: Duration) => void;
  onBack: () => void;
}

const durations: { value: Duration; label: string }[] = [
  { value: 1, label: "Quick reset" },
  { value: 3, label: "Reground" },
  { value: 5, label: "Full anchor" },
];

export default function SessionSelector({ active, mood, onDurationSelect, onBack }: Props) {
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

    setTimeout(() => {
      ripple.remove();
      onDurationSelect(duration);
    }, 400);
  };

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)" }}
    >
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: 24,
          left: 32,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 14,
          color: "var(--color-muted)",
          padding: 0,
          zIndex: 10,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: 900,
          width: "100%",
          padding: "0 32px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 32,
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            You're feeling {mood}.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 18,
              color: "var(--color-muted)",
              marginTop: 8,
            }}
          >
            Let's ground.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 16,
              color: "var(--color-muted)",
              marginTop: 24,
            }}
          >
            Choose how long you have.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {durations.map(({ value, label }, i) => (
            <div
              key={value}
              ref={(el) => { tileRefs.current[i] = el; }}
              onClick={(e) => handleSelect(value, i, e)}
              style={{
                width: "100%",
                padding: 32,
                borderRadius: 24,
                background: "var(--color-surface)",
                border: "var(--border-light)",
                boxShadow: "var(--shadow-card)",
                cursor: "pointer",
                transition: "border-color 200ms, box-shadow 200ms, transform 200ms",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = "var(--color-primary)";
                t.style.boxShadow = "0 8px 32px rgba(99,102,241,0.15)";
                t.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = "rgba(15,23,42,0.08)";
                t.style.boxShadow = "var(--shadow-card)";
                t.style.transform = "translateY(0)";
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: 48,
                  color: "var(--color-primary)",
                  lineHeight: 1,
                }}
              >
                {value} min
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  fontSize: 16,
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
