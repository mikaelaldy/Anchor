import { useEffect, useRef, useState, useCallback } from "react";
import { Mood, Duration } from "@/App";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  active: boolean;
  mood: Mood;
  duration: Duration;
  onComplete: () => void;
  onBack: () => void;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  life: number; maxLife: number;
}

type BreathPhase = "Inhale" | "Hold" | "Exhale";

const INHALE = 4000;
const HOLD   = 4000;
const EXHALE = 6000;
const CYCLE  = INHALE + HOLD + EXHALE;

function getPhase(elapsed: number): BreathPhase {
  const pos = elapsed % CYCLE;
  if (pos < INHALE)        return "Inhale";
  if (pos < INHALE + HOLD) return "Hold";
  return "Exhale";
}

export default function KineticPlayer({ active, mood, duration, onComplete, onBack }: Props) {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const [phase, setPhase]               = useState<BreathPhase>("Inhale");
  const [phaseVisible, setPhaseVisible] = useState(true);
  const prevPhaseRef = useRef<BreathPhase>("Inhale");

  const [paused, setPaused]       = useState(false);
  const [timeLeft, setTimeLeft]   = useState(duration * 60);
  const [progress, setProgress]   = useState(0);
  const [nodeVisible, setNodeVisible] = useState(true);

  const pausedRef       = useRef(false);
  const completedRef    = useRef(false);
  const accumulatedRef  = useRef(0);
  const segmentStartRef = useRef(0);

  const totalMs = duration * 60 * 1000;

  const ringSize   = isMobile ? Math.min(window.innerWidth * 0.82, 320) : 380;
  const ringRadius = (ringSize / 400) * 185;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDash = circumference * (1 - progress);

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    if (next) {
      accumulatedRef.current += performance.now() - segmentStartRef.current;
    } else {
      segmentStartRef.current = performance.now();
    }
    pausedRef.current = next;
    setPaused(next);
  }, []);

  const spawnParticles = useCallback((x: number, y: number) => {
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 600 + Math.random() * 400,
      });
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 16;
        p.alpha = 1 - p.life / p.maxLife;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.98; p.vy *= 0.98;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62,103,75,${p.alpha * 0.35})`;
        ctx.fill();
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      completedRef.current  = false;
      pausedRef.current     = false;
      accumulatedRef.current = 0;
      setPaused(false);
      setTimeLeft(duration * 60);
      setProgress(0);
      setPhase("Inhale");
      prevPhaseRef.current  = "Inhale";
      setPhaseVisible(true);
      setNodeVisible(true);
      return;
    }

    accumulatedRef.current  = 0;
    segmentStartRef.current = performance.now();

    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed   = accumulatedRef.current + (performance.now() - segmentStartRef.current);
      const remaining = Math.max(0, totalMs - elapsed);
      setTimeLeft(Math.ceil(remaining / 1000));
      setProgress(Math.min(elapsed / totalMs, 1));

      const newPhase = getPhase(elapsed);
      if (newPhase !== prevPhaseRef.current) {
        prevPhaseRef.current = newPhase;
        setPhaseVisible(false);
        setTimeout(() => { setPhase(newPhase); setPhaseVisible(true); }, 150);
      }

      if (elapsed >= totalMs && !completedRef.current) {
        completedRef.current = true;
        clearInterval(interval);
        setNodeVisible(false);
        setTimeout(() => onComplete(), 800);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [active, duration, totalMs, onComplete]);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); togglePause(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, togglePause]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (pausedRef.current) return;
    spawnParticles(e.clientX, e.clientY);
  }, [spawnParticles]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pausedRef.current) return;
    const t = e.touches[0];
    if (t) spawnParticles(t.clientX, t.clientY);
  }, [spawnParticles]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const phases: BreathPhase[] = ["Inhale", "Hold", "Exhale"];
  const nodeSize = isMobile ? Math.min(window.innerWidth * 0.52, 210) : 248;

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{
        background: paused ? "rgba(247,243,242,0.96)" : "var(--color-bg)",
        cursor: "default",
        userSelect: "none",
        transition: "background 400ms",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onTouchMove={isMobile ? handleTouchMove : undefined}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      {/* Header — in-flow, not fixed */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 640,
        width: "100%",
        alignSelf: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: isMobile ? "20px 24px 0" : "32px 32px 0",
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
            padding: "4px 0",
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-text)",
            transition: "opacity 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          Back
        </button>

        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 28 : 36,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "var(--color-text)",
          }}>
            {formatTime(timeLeft)}
          </p>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginTop: 4,
          }}>
            Remaining
          </p>
        </div>
      </div>

      {/* Content — flex-1, vertically centered */}
      <div style={{
        flex: 1,
        position: "relative",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "24px 24px 0" : "32px 32px 0",
      }}>
        {/* Breath node */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: ringSize,
            height: ringSize,
            opacity: nodeVisible ? 1 : 0,
            transform: nodeVisible ? "scale(1)" : "scale(1.08)",
            transition: "opacity 800ms ease-out, transform 800ms ease-out",
          }}
        >
          {/* SVG progress ring */}
          <svg
            width={ringSize}
            height={ringSize}
            style={{ position: "absolute" }}
            viewBox="0 0 400 400"
          >
            <circle cx={200} cy={200} r={185} fill="none" stroke="var(--color-surface-high)" strokeWidth={2} />
            <circle
              cx={200} cy={200} r={185}
              fill="none"
              stroke="var(--color-text)"
              strokeWidth={2}
              strokeDasharray={circumference * (400 / ringSize)}
              strokeDashoffset={strokeDash * (400 / ringSize)}
              strokeLinecap="round"
              transform="rotate(-90 200 200)"
              style={{ transition: "stroke-dashoffset 200ms linear" }}
            />
          </svg>

          {/* Outer glow ring */}
          <div style={{
            position: "absolute",
            width: nodeSize * 1.48,
            height: nodeSize * 1.48,
            borderRadius: "50%",
            background: "var(--color-surface-low)",
            opacity: 0.55,
          }} />

          {/* Mid ring */}
          <div style={{
            position: "absolute",
            width: nodeSize * 1.22,
            height: nodeSize * 1.22,
            borderRadius: "50%",
            background: "var(--color-surface-mid)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.06)",
          }} />

          {/* Inner breath node */}
          <div
            className="breath-node"
            style={{
              width: nodeSize,
              height: nodeSize,
              borderRadius: "50%",
              background: "var(--color-surface-highest)",
              border: `10px solid var(--color-surface)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animationPlayState: paused ? "paused" : "running",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 0 60px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 800,
              fontSize: isMobile ? 20 : 26,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              opacity: phaseVisible ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}>
              {paused ? "Paused" : phase}
            </p>
            <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
              {phases.map((p) => (
                <div
                  key={p}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: phase === p && !paused
                      ? "var(--color-text)"
                      : "var(--color-outline-variant)",
                    opacity: phase === p && !paused ? 1 : 0.3,
                    transition: "all 300ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phase indicators */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 20 : 28,
          marginTop: isMobile ? 28 : 36,
        }}>
          {phases.map((p) => {
            const isActive = phase === p && !paused;
            return (
              <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
                <span style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--color-text)" : "var(--color-muted-mid)",
                  opacity: isActive ? 1 : 0.3,
                  transition: "all 300ms",
                }}>
                  {p}
                </span>
                <div style={{
                  height: 2,
                  width: isMobile ? 44 : 52,
                  borderRadius: 2,
                  background: isActive ? "var(--color-text)" : "var(--color-outline-variant)",
                  opacity: isActive ? 1 : 0.2,
                  transition: "all 300ms",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pause button — in-flow at the bottom */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? "28px 24px 40px" : "32px 32px 52px",
      }}>
        <button
          onClick={togglePause}
          style={{
            padding: isMobile ? "16px 52px" : "14px 48px",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-surface)",
            border: "none",
            boxShadow: "var(--shadow-cta)",
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text)",
            cursor: "pointer",
            transition: "transform 150ms, box-shadow 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "var(--shadow-cta)";
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
