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
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

type BreathPhase = "Inhale" | "Hold" | "Exhale";

const INHALE = 4000;
const HOLD = 4000;
const EXHALE = 6000;
const CYCLE = INHALE + HOLD + EXHALE;

function getPhase(elapsed: number): BreathPhase {
  const pos = elapsed % CYCLE;
  if (pos < INHALE) return "Inhale";
  if (pos < INHALE + HOLD) return "Hold";
  return "Exhale";
}

export default function KineticPlayer({ active, mood, duration, onComplete, onBack }: Props) {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const [phase, setPhase] = useState<BreathPhase>("Inhale");
  const [phaseVisible, setPhaseVisible] = useState(true);
  const prevPhaseRef = useRef<BreathPhase>("Inhale");

  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [progress, setProgress] = useState(0);
  const [nodeVisible, setNodeVisible] = useState(true);

  const pausedRef = useRef(false);
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const accumulatedRef = useRef(0);
  const segmentStartRef = useRef(0);

  const totalMs = duration * 60 * 1000;

  const nodeSize = isMobile ? Math.min(window.innerWidth * 0.58, 260) : 300;
  const ringSize = isMobile ? Math.min(window.innerWidth * 0.95, 380) : 500;
  const ringRadius = (ringSize / 500) * 230;
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
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 3 + Math.random() * 3,
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.alpha = 1 - p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,122,107,${p.alpha * 0.7})`;
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
      completedRef.current = false;
      pausedRef.current = false;
      elapsedRef.current = 0;
      setPaused(false);
      setTimeLeft(duration * 60);
      setProgress(0);
      setPhase("Inhale");
      prevPhaseRef.current = "Inhale";
      setPhaseVisible(true);
      setNodeVisible(true);
      return;
    }

    accumulatedRef.current = 0;
    segmentStartRef.current = performance.now();
    elapsedRef.current = 0;
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed = accumulatedRef.current + (performance.now() - segmentStartRef.current);
      elapsedRef.current = elapsed;
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

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{
        background: paused ? "rgba(245,244,240,0.92)" : "var(--color-bg)",
        cursor: isMobile ? "default" : "none",
        userSelect: "none",
        transition: "background 400ms",
      }}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onTouchMove={isMobile ? handleTouchMove : undefined}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: isMobile ? 16 : 24,
          left: isMobile ? 20 : 32,
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
          position: "fixed",
          top: isMobile ? 16 : 24,
          right: isMobile ? 20 : 32,
          textAlign: "right",
          zIndex: 10,
        }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>
          {mood} · {duration} min
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 16, color: "var(--color-text)", marginTop: 2 }}>
          {formatTime(timeLeft)}
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          width={ringSize}
          height={ringSize}
          style={{ position: "absolute" }}
          viewBox="0 0 500 500"
        >
          <circle cx={250} cy={250} r={230} fill="none" stroke="#E5E3DE" strokeWidth={2} />
          <circle
            cx={250} cy={250} r={230}
            fill="none"
            stroke="#1A1A1A"
            strokeWidth={2}
            strokeDasharray={circumference * (500 / ringSize)}
            strokeDashoffset={strokeDash * (500 / ringSize)}
            strokeLinecap="round"
            transform="rotate(-90 250 250)"
            style={{ transition: "stroke-dashoffset 200ms linear" }}
          />
        </svg>

        <div
          className="breath-node"
          style={{
            width: nodeSize,
            height: nodeSize,
            background: "radial-gradient(circle, rgba(140,122,107,0.12), rgba(140,122,107,0.04))",
            border: "2px solid rgba(140,122,107,0.2)",
            boxShadow: "0 0 60px rgba(140,122,107,0.10), 0 0 120px rgba(140,122,107,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animationPlayState: paused ? "paused" : "running",
            position: "relative",
            zIndex: 2,
            opacity: nodeVisible ? 1 : 0,
            transform: nodeVisible ? "scale(1)" : "scale(1.5)",
            transition: "opacity 800ms ease-out, transform 800ms ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: isMobile ? 14 : 16,
              color: "var(--color-text)",
              opacity: phaseVisible ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            {paused ? "Paused" : phase}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: isMobile ? 32 : 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <button
          onClick={togglePause}
          style={{
            padding: isMobile ? "14px 40px" : "12px 32px",
            borderRadius: "100px",
            background: "#FFFFFF",
            border: "var(--border)",
            boxShadow: "var(--shadow)",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 15,
            color: "var(--color-text)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 200ms, color 200ms, box-shadow 200ms",
            minWidth: isMobile ? 160 : "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1A1A1A";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "var(--color-text)";
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
