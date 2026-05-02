import { useEffect, useRef, useState, useCallback } from "react";
import { Duration } from "@/App";
import { useIsMobile } from "@/hooks/useIsMobile";
import CalendarStreak from "@/components/CalendarStreak";
import { useAuth } from "@workspace/replit-auth-web";

interface Props {
  active: boolean;
  duration: Duration;
  onRestart: () => void;
}

const STORAGE_KEY = "anchor_dates";

function getLocalDays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function recordLocalDay(): string[] {
  const today = new Date().toISOString().split("T")[0];
  const days = getLocalDays();
  if (!days.includes(today)) days.push(today);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  return days;
}

function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const sorted = [...days].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const d of sorted) {
    const dayDate = new Date(d + "T00:00:00");
    const diff = Math.round((cursor.getTime() - dayDate.getTime()) / 86400000);
    if (diff === 0 || diff === 1) {
      streak++;
      cursor = new Date(dayDate.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

interface ConfettiParticle {
  x: number; y: number;
  vx: number; vy: number;
  color: string; size: number;
  rotation: number; rotationSpeed: number;
  alpha: number;
}

const COLORS = ["#8C7A6B", "#1A1A1A", "#FFFFFF", "#4A7C59"];

export default function DopamineReward({ active, duration, onRestart }: Props) {
  const isMobile = useIsMobile();
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [synced, setSynced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const recordedRef = useRef(false);

  const mergeAndSet = useCallback((serverDays: string[]) => {
    const local = getLocalDays();
    const merged = Array.from(new Set([...local, ...serverDays])).sort();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setCompletedDays(merged);
    setStreak(computeStreak(merged));
  }, []);

  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch("/api/streak/record", { method: "POST", credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { days: string[] };
        mergeAndSet(data.days);
        setSynced(true);
      }
    } catch { /* silent */ }
  }, [mergeAndSet]);

  const loadServerStreak = useCallback(async () => {
    try {
      const res = await fetch("/api/streak", { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { days: string[] };
        mergeAndSet(data.days);
      }
    } catch { /* silent */ }
  }, [mergeAndSet]);

  useEffect(() => {
    if (!active) {
      setLaunched(false);
      recordedRef.current = false;
      setSynced(false);
      cancelAnimationFrame(animRef.current);
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;

    const days = recordLocalDay();
    setCompletedDays(days);
    setStreak(computeStreak(days));

    if (isAuthenticated) {
      syncWithServer();
    } else if (!authLoading) {
      loadServerStreak();
    }

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
        x: cx, y: cy,
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
      if (elapsed > 2500) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.15; p.vx *= 0.99;
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
    return () => cancelAnimationFrame(animRef.current);
  }, [active, isAuthenticated, authLoading, syncWithServer, loadServerStreak]);

  const username = user?.firstName || user?.email?.split("@")[0] || "you";

  const mutedLink: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#A89F97",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "none",
    transition: "text-decoration 150ms",
  };

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", alignItems: "flex-start", justifyContent: "flex-start", paddingTop: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      />

      <div
        style={{
          maxWidth: 480,
          width: "100%",
          padding: isMobile ? "28px 20px 48px" : "36px 24px 56px",
          position: "relative",
          zIndex: 1,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* HERO CARD */}
        <div
          className={launched ? "fade-in-up" : ""}
          style={{
            background: "var(--color-surface)",
            borderRadius: 24,
            padding: isMobile ? "32px 24px 28px" : "40px 40px 36px",
            boxShadow: "var(--shadow-card)",
            border: "var(--border)",
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
              fontSize: isMobile ? 40 : 48,
              color: "var(--color-text)",
              lineHeight: 1,
            }}
          >
            Anchored.
          </h1>

          <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: isMobile ? 16 : 18, color: "var(--color-muted)", marginTop: 8 }}>
            You showed up for your brain.
          </p>

          <div style={{ height: 20 }} />

          <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15, color: "var(--color-muted)" }}>
            {duration} minutes &middot; Session complete
          </p>

          <div
            style={{
              marginTop: 12,
              padding: "10px 20px",
              borderRadius: 100,
              background: "rgba(140,122,107,0.10)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>⚓</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "var(--color-accent)" }}>
              {streak} day streak
            </span>
          </div>

          {/* AUTH SYNC ROW — below streak */}
          {!authLoading && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              {isAuthenticated ? (
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#A89F97" }}>
                  {synced ? `Synced as ${username}` : `Signed in as ${username}`}
                  {" · "}
                  <button
                    style={mutedLink}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    onClick={logout}
                  >
                    Sign out
                  </button>
                </span>
              ) : (
                <button
                  style={mutedLink}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  onClick={() => {
                    sessionStorage.setItem("anchor_pending_sync", "1");
                    sessionStorage.setItem("anchor_pending_duration", String(duration));
                    login();
                  }}
                >
                  Sync streak with your account to save across devices
                </button>
              )}
            </div>
          )}
        </div>

        {/* CALENDAR */}
        <div
          className={launched ? "fade-in-up" : ""}
          style={{
            background: "var(--color-surface)",
            borderRadius: 24,
            padding: isMobile ? "24px 20px" : "28px 32px",
            boxShadow: "var(--shadow-card)",
            border: "var(--border)",
          }}
        >
          <CalendarStreak completedDays={completedDays} />
        </div>

        {/* CTA */}
        <button
          className={launched ? "fade-in-up" : ""}
          onClick={onRestart}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "100px",
            background: "#1A1A1A",
            color: "#FFFFFF",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,26,26,0.15)",
            transition: "background 200ms, box-shadow 200ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#333333";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1A1A1A";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,26,26,0.15)";
          }}
        >
          Back to the noise.
        </button>
      </div>
    </div>
  );
}
