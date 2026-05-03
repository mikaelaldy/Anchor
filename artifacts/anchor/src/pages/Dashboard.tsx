import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useIsMobile } from "@/hooks/useIsMobile";

const STORAGE_KEY = "anchor_dates";

function getLocalDays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
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

function computeLongestStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const sorted = [...days].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

interface Props {
  active: boolean;
  onBack: () => void;
  onStart: () => void;
}

const WEEKS = 12;

export default function Dashboard({ active, onBack, onStart }: Props) {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, login } = useAuth();
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const res = await fetch("/api/streak");
        if (res.ok) {
          const data = await res.json();
          const serverDays: string[] = data.days ?? [];
          const local = getLocalDays();
          const merged = Array.from(new Set([...local, ...serverDays])).sort();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setDays(merged);
          setLoading(false);
          return;
        }
      } catch { /* fall through to local */ }
    }
    setDays(getLocalDays());
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (active) load();
  }, [active, load]);

  const today = new Date().toISOString().split("T")[0];
  const streak = computeStreak(days);
  const longest = computeLongestStreak(days);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthCount = days.filter((d) => d.startsWith(thisMonth)).length;
  const practicedToday = days.includes(today);

  const gridDays: string[] = [];
  for (let i = WEEKS * 7 - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    gridDays.push(d.toISOString().split("T")[0]);
  }
  const completedSet = new Set(days);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.firstName ?? "there";

  const px = isMobile ? 20 : 32;

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", display: "block" }}
    >
      {/* NAV */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 0 var(--color-surface-high)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "14px 20px" : "16px 32px",
        }}>
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--font)",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--color-muted-mid)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            {!isMobile && "Back"}
          </button>

          <span style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}>
            My Journey
          </span>

          <button
            onClick={onStart}
            style={{
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.03em",
              padding: "9px 18px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Meditate
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: `40px ${px}px 80px` }}>

        {/* HERO — greeting + big streak */}
        <section style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 12,
          }}>
            {isAuthenticated ? `${greeting}, ${firstName}` : "Your practice"}
          </p>

          <div style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 100 : 128,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--color-text)",
            marginBottom: 6,
          }}>
            {loading ? "—" : streak}
          </div>

          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 600,
            fontSize: 17,
            color: "var(--color-muted-mid)",
            marginBottom: 24,
          }}>
            {streak === 1 ? "day streak" : "day streak"}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--color-secondary-container)",
              padding: "9px 20px",
              borderRadius: "var(--radius-pill)",
            }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: "var(--color-on-secondary-container)", fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--color-on-secondary-container)",
              }}>
                {streak > 0 ? `${streak}-day streak` : "Start your streak"}
              </span>
            </div>

            {practicedToday && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--color-surface-high)",
                padding: "9px 20px",
                borderRadius: "var(--radius-pill)",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-secondary)" }}>
                  check_circle
                </span>
                <span style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "var(--color-muted-mid)",
                }}>
                  Done for today
                </span>
              </div>
            )}
          </div>
        </section>

        {/* STATS CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            { label: "Total days", value: loading ? "—" : String(days.length), icon: "calendar_today" },
            { label: "Longest streak", value: loading ? "—" : String(longest), icon: "emoji_events" },
            { label: "This month", value: loading ? "—" : String(monthCount), icon: "today" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                background: "var(--color-surface)",
                borderRadius: 24,
                padding: isMobile ? "20px 12px" : "28px 20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--color-muted)" }}>
                {icon}
              </span>
              <p style={{
                fontFamily: "var(--font)",
                fontWeight: 800,
                fontSize: isMobile ? 28 : 36,
                letterSpacing: "-0.02em",
                color: "var(--color-text)",
                lineHeight: 1,
              }}>
                {value}
              </p>
              <p style={{
                fontFamily: "var(--font)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ACTIVITY GRID — 12 weeks */}
        <div style={{
          background: "var(--color-surface-low)",
          borderRadius: 40,
          padding: isMobile ? "28px 24px" : "40px",
          marginBottom: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 20,
            gap: 12,
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text)",
                marginBottom: 3,
              }}>
                Activity · last 12 weeks
              </p>
              <p style={{ fontFamily: "var(--font)", fontSize: 13, color: "var(--color-muted)" }}>
                Every day you show up is a win.
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              flexShrink: 0,
            }}>
              {days.length} {days.length === 1 ? "day" : "days"} total
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: isMobile ? 5 : 7,
          }}>
            {gridDays.map((day) => {
              const done = completedSet.has(day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  title={day}
                  style={{
                    aspectRatio: "1",
                    borderRadius: isMobile ? 5 : 7,
                    background: done
                      ? "var(--color-secondary)"
                      : "rgba(228,226,225,0.4)",
                    boxShadow: done && isToday
                      ? "0 8px 16px rgba(62,103,75,0.3)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 200ms",
                    outline: isToday && !done
                      ? "2px solid var(--color-outline-variant)"
                      : "none",
                    outlineOffset: 1,
                  }}
                >
                  {done && (
                    <span
                      className="material-symbols-filled"
                      style={{ fontSize: isMobile ? 9 : 11, color: "var(--color-on-secondary)" }}
                    >
                      check
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: "var(--font)",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--color-muted)",
          }}>
            Take it one breath at a time. No pressure, just presence.
          </p>
        </div>

        {/* SIGN-IN NUDGE (unauthenticated) */}
        {!isAuthenticated && (
          <div style={{
            background: "rgba(191,238,201,0.3)",
            borderRadius: 24,
            padding: "24px 28px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--color-on-secondary-container)",
                marginBottom: 4,
              }}>
                Sync your streak across devices
              </p>
              <p style={{
                fontFamily: "var(--font)",
                fontSize: 13,
                color: "var(--color-on-secondary-container)",
                opacity: 0.85,
              }}>
                Your progress is saved locally. Sign in to back it up.
              </p>
            </div>
            <button
              onClick={login}
              style={{
                background: "var(--color-secondary)",
                color: "var(--color-on-secondary)",
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 13,
                padding: "10px 22px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Sign in
            </button>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            width: "100%",
            background: practicedToday ? "var(--color-surface)" : "var(--color-primary)",
            color: practicedToday ? "var(--color-text)" : "var(--color-on-primary)",
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "22px",
            borderRadius: "var(--radius-pill)",
            border: practicedToday ? "2px solid var(--color-surface-high)" : "none",
            cursor: "pointer",
            boxShadow: practicedToday ? "none" : "0 20px 40px rgba(0,0,0,0.12)",
            transition: "transform 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {practicedToday ? "Practice again today" : "Start today's session"}
        </button>
      </main>
    </div>
  );
}
