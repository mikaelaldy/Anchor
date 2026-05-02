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
  } catch { return []; }
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
    } else { break; }
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

const COLORS = ["#3e674b", "#1c1b1b", "#bfeec9", "#264f34", "#ffffff"];

export default function DopamineReward({ active, duration, onRestart }: Props) {
  const isMobile = useIsMobile();
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth();
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [streak, setStreak]               = useState(0);
  const [launched, setLaunched]           = useState(false);
  const [synced, setSynced]               = useState(false);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const animRef      = useRef<number>(0);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const recordedRef  = useRef(false);

  const mergeAndSet = useCallback((serverDays: string[]) => {
    const local  = getLocalDays();
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

    if (isAuthenticated)      { syncWithServer(); }
    else if (!authLoading)    { loadServerStreak(); }

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.3;

    particlesRef.current = Array.from({ length: 70 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
      };
    });
    setLaunched(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const startTime = performance.now();
    const loop = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > 2800) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.18; p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.alpha = Math.max(0, 1 - elapsed / 2400);
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

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{
        background: "var(--color-bg)",
        overflowY: "auto",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      />

      {/* Top bar */}
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
          justifyContent: "center",
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

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 640,
        width: "100%",
        margin: "0 auto",
        padding: isMobile ? "48px 24px 64px" : "64px 32px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>

        {/* Success header */}
        <section className={launched ? "fade-in-up" : ""} style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "var(--color-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
              position: "relative",
            }}>
              <span
                className="material-symbols-filled"
                style={{
                  fontSize: 56,
                  color: "var(--color-secondary)",
                }}
              >
                task_alt
              </span>
              <div style={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.04)",
                transform: "scale(1.12)",
                opacity: 0.25,
              }} />
            </div>
          </div>
          <h1 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 44 : 56,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--color-text)",
            marginBottom: 12,
          }}>
            Anchored.
          </h1>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.6,
            color: "var(--color-muted-mid)",
            maxWidth: 380,
            margin: "0 auto",
          }}>
            You showed up for yourself.
          </p>
        </section>

        {/* Session card */}
        <div
          className={launched ? "fade-in-up-1" : ""}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            padding: isMobile ? "32px 28px" : "40px",
            boxShadow: "var(--shadow-card)",
            textAlign: "center",
          }}
        >
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 10,
          }}>
            Last Session
          </p>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: isMobile ? 22 : 26,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
          }}>
            {duration} {duration === 1 ? "minute" : "minutes"} · Session complete
          </p>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {/* Streak badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(191,238,201,0.3)",
              padding: "12px 24px",
              borderRadius: "var(--radius-pill)",
            }}>
              <span
                className="material-symbols-filled"
                style={{ fontSize: 20, color: "var(--color-on-secondary-fv)" }}
              >
                local_fire_department
              </span>
              <span style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--color-on-secondary-fv)",
              }}>
                {streak} {streak === 1 ? "day" : "days"} streak
              </span>
            </div>

            {/* Auth sync row */}
            {!authLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isAuthenticated ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, color: "var(--color-muted)", animationName: "none" }}
                    >
                      cloud_done
                    </span>
                    <span style={{
                      fontFamily: "var(--font)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}>
                      {synced ? `Synced as ${username}` : `Signed in as ${username}`}
                    </span>
                    <span style={{ color: "var(--color-muted)", fontSize: 12 }}>·</span>
                    <button
                      onClick={logout}
                      style={{
                        fontFamily: "var(--font)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "none",
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sessionStorage.setItem("anchor_pending_sync", "1");
                      sessionStorage.setItem("anchor_pending_duration", String(duration));
                      login();
                    }}
                    style={{
                      fontFamily: "var(--font)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
                  >
                    Sync streak across devices →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div
          className={launched ? "fade-in-up-2" : ""}
          style={{
            background: "var(--color-surface-low)",
            borderRadius: "var(--radius-card)",
            padding: isMobile ? "28px 24px" : "36px 40px",
            boxShadow: "var(--shadow-card-sm)",
          }}
        >
          <CalendarStreak completedDays={completedDays} />
        </div>

        {/* CTAs */}
        <div className={launched ? "fade-in-up-3" : ""} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
          <button
            onClick={onRestart}
            style={{
              width: "100%",
              padding: "22px",
              borderRadius: "var(--radius-pill)",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              boxShadow: "var(--shadow-cta)",
              transition: "transform 200ms, box-shadow 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 28px 56px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "var(--shadow-cta)";
            }}
          >
            Back to the noise
          </button>

          <button
            style={{
              width: "100%",
              padding: "22px",
              borderRadius: "var(--radius-pill)",
              background: "transparent",
              color: "var(--color-text)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "2px solid rgba(28,27,27,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(28,27,27,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>favorite</span>
            Support Anchor
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginTop: 12,
        }}>
          Free forever · Open source · For everyone
        </p>
      </div>
    </div>
  );
}
