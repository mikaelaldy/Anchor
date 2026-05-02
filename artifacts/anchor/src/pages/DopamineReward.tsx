import { useEffect, useRef, useState } from "react";
import { Duration } from "@/App";

interface Props {
  active: boolean;
  duration: Duration;
  onRestart: () => void;
}

interface StreakData {
  count: number;
  lastDate: string;
}

function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem("anchor_streak");
    if (!raw) return { count: 0, lastDate: "" };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lastDate: "" };
  }
}

function updateStreak(): number {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const current = getStreak();

  let newCount: number;
  if (current.lastDate === today) {
    newCount = current.count;
  } else if (current.lastDate === yesterday) {
    newCount = current.count + 1;
  } else {
    newCount = 1;
  }

  localStorage.setItem(
    "anchor_streak",
    JSON.stringify({ count: newCount, lastDate: today })
  );

  return newCount;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
}

const COLORS = ["#6366F1", "#818CF8", "#10B981", "#0F172A", "#A5B4FC"];

export default function DopamineReward({ active, duration, onRestart }: Props) {
  const [streak, setStreak] = useState(1);
  const [launched, setLaunched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!active) {
      setLaunched(false);
      cancelAnimationFrame(animRef.current);
      return;
    }

    const newStreak = updateStreak();
    setStreak(newStreak);

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current = Array.from({ length: 60 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
      };
    });

    setLaunched(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > 2500) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.alpha = Math.max(0, 1 - elapsed / 2000);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className={launched ? "fade-in-up" : ""}
          style={{
            background: "var(--color-surface)",
            borderRadius: 24,
            padding: 48,
            boxShadow: "0 24px 48px rgba(15,23,42,0.1)",
            border: "var(--border-light)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 48,
              color: "var(--color-text)",
              lineHeight: 1,
            }}
          >
            Anchored.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 18,
              color: "var(--color-muted)",
              marginTop: 8,
            }}
          >
            You showed up for your brain.
          </p>

          <div style={{ height: 24 }} />

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 16,
              color: "var(--color-muted)",
            }}
          >
            {duration} minutes. Session complete.
          </p>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: 16,
              color: "var(--color-text)",
              marginTop: 8,
            }}
          >
            🔥 {streak} day streak
          </p>

          <div style={{ height: 32 }} />

          <button
            onClick={onRestart}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "100px",
              background: "var(--color-primary)",
              color: "#FFFFFF",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              transition: "background 200ms, box-shadow 200ms",
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget;
              t.style.background = "#4F46E5";
              t.style.boxShadow = "0 8px 24px rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget;
              t.style.background = "var(--color-primary)";
              t.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)";
            }}
          >
            Back to the noise.
          </button>
        </div>
      </div>
    </div>
  );
}
