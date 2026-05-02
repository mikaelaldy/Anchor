import { useEffect, useRef, useState, useCallback } from "react";
import { Mood, Duration } from "@/App";

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

  const totalMs = duration * 60 * 1000;

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
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

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha * 0.7})`;
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

    elapsedRef.current = 0;

    const interval = setInterval(() => {
      if (pausedRef.current) return;

      elapsedRef.current += 100;
      const elapsed = elapsedRef.current;
      const remaining = Math.max(0, totalMs - elapsed);
      const secs = Math.ceil(remaining / 1000);

      setTimeLeft(secs);
      setProgress(Math.min(elapsed / totalMs, 1));

      const newPhase = getPhase(elapsed);
      if (newPhase !== prevPhaseRef.current) {
        prevPhaseRef.current = newPhase;
        setPhaseVisible(false);
        setTimeout(() => {
          setPhase(newPhase);
          setPhaseVisible(true);
        }, 150);
      }

      if (elapsed >= totalMs && !completedRef.current) {
        completedRef.current = true;
        clearInterval(interval);
        setNodeVisible(false);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [active, duration, totalMs, onComplete]);

  useEffect(() => {
    if (!active) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, togglePause]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (pausedRef.current) return;
    spawnParticles(e.clientX, e.clientY);
  }, [spawnParticles]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const circumference = 2 * Math.PI * 230;
  const strokeDash = circumference * (1 - progress);

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{
        background: paused ? "rgba(250,251,255,0.97)" : "var(--color-bg)",
        cursor: "none",
        userSelect: "none",
        transition: "background 400ms",
      }}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

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
          position: "fixed",
          top: 24,
          right: 32,
          textAlign: "right",
          zIndex: 10,
        }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>
          {mood} · {duration} min
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 16, color: "var(--color-text)", marginTop: 4 }}>
          {formatTime(timeLeft)}
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          width={500}
          height={500}
          style={{ position: "absolute" }}
          viewBox="0 0 500 500"
        >
          <circle cx={250} cy={250} r={230} fill="none" stroke="#E2E8F0" strokeWidth={2} />
          <circle
            cx={250}
            cy={250}
            r={230}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            transform="rotate(-90 250 250)"
            style={{ transition: "stroke-dashoffset 200ms linear" }}
          />
        </svg>

        <div
          className="breath-node"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(99,102,241,0.15), rgba(129,140,248,0.05))",
            border: "2px solid rgba(99,102,241,0.2)",
            boxShadow: "0 0 60px rgba(99,102,241,0.12), 0 0 120px rgba(99,102,241,0.06)",
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
              fontSize: 16,
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
          bottom: 40,
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
            padding: "12px 32px",
            borderRadius: "100px",
            background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.12)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 15,
            color: "var(--color-text)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "box-shadow 200ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.06)";
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
