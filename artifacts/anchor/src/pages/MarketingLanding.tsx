import { useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuth } from "@workspace/replit-auth-web";

interface Props {
  active: boolean;
  onStart: () => void;
}

const steps = [
  {
    icon: "diversity_3",
    title: "Space for all perspectives",
    body: "Designed to embrace diverse life experiences. Whether you have thirty seconds or thirty minutes, Anchor meets you where you are.",
  },
  {
    icon: "accessibility_new",
    title: "Accessible interactions",
    body: "Simple, high-contrast, and keyboard-friendly. No onboarding, no account. Open and breathe.",
  },
  {
    icon: "public",
    title: "Open to the world",
    body: "Free and open-source. Shaped by a global community of contributors from all walks of life.",
  },
];

const features = [
  {
    icon: "all_inclusive",
    title: "Universal focus",
    body: "A distraction-free environment that respects your cognitive load, regardless of how your mind works.",
    dark: false,
  },
  {
    icon: "group",
    title: "Feeling-first",
    body: "Start by naming where you are. Scattered, overwhelmed, or restless — every state is valid.",
    dark: true,
  },
  {
    icon: "timer",
    title: "1, 3, or 5 minutes",
    body: "Pick how long you have. No pressure. Even one minute counts.",
    dark: false,
  },
  {
    icon: "local_fire_department",
    title: "Streak tracking",
    body: "A 28-day calendar and streak counter. No pressure — just a gentle record of showing up.",
    dark: false,
  },
];

export default function MarketingLanding({ active, onStart }: Props) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, login } = useAuth();

  const scrollTo = (id: string) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    container.scrollTo({ top: target.offsetTop - 72, behavior: "smooth" });
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font)",
    fontWeight: 500,
    fontSize: 14,
    color: "var(--color-muted-mid)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    transition: "color 150ms",
    textDecoration: "none",
  };

  return (
    <div
      ref={containerRef}
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", display: "block" }}
    >
      {/* NAV */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: "var(--shadow-nav)",
      }}>
        <nav style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "14px 24px" : "16px 32px",
        }}>
          <button
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              fontFamily: "var(--font)",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Anchor
          </button>

          {!isMobile && (
            <div style={{ display: "flex", gap: 28 }}>
              <button
                style={navLinkStyle}
                onClick={() => scrollTo("how-it-works")}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                How it works
              </button>
              <button
                style={navLinkStyle}
                onClick={() => scrollTo("features")}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                Features
              </button>
            </div>
          )}

          <button
            onClick={onStart}
            style={{
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Start
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: isMobile ? "80px 24px 80px" : "120px 32px 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "var(--font)",
          fontWeight: 800,
          fontSize: isMobile ? 44 : 56,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: "var(--color-text)",
          marginBottom: 24,
        }}>
          Stillness for everyone
        </h1>
        <p style={{
          fontFamily: "var(--font)",
          fontWeight: 400,
          fontSize: isMobile ? 17 : 18,
          lineHeight: 1.6,
          color: "var(--color-muted-mid)",
          maxWidth: 460,
          marginBottom: isMobile ? 56 : 72,
        }}>
          A visual deep breath designed for every mind, every background, and every ability. Practice presence, your way.
        </p>

        {/* Breath node */}
        <div style={{
          position: "relative",
          width: isMobile ? 220 : 260,
          height: isMobile ? 220 : 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: isMobile ? 56 : 72,
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid var(--color-outline-variant)",
            opacity: 0.25,
          }} />
          <div style={{
            position: "absolute",
            inset: "10%",
            borderRadius: "50%",
            border: "2px solid rgba(0,0,0,0.06)",
          }} />
          <div
            className="breath-node"
            style={{
              width: isMobile ? 120 : 140,
              height: isMobile ? 120 : 140,
              borderRadius: "50%",
              background: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 44, color: "var(--color-on-primary)" }}
            >
              air
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={onStart}
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
              transition: "transform 150ms, box-shadow 150ms",
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
            Start meditating
          </button>

          {!isAuthenticated && (
            <button
              onClick={login}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-mid)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
              Sign in to sync your streak
            </button>
          )}

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: 8,
            }}>
              Our three commitments
            </p>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--color-text)",
            }}>
              Free forever · Open source · For everyone
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        background: "var(--color-bg)",
        padding: isMobile ? "80px 24px" : "100px 32px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            textAlign: "center",
            marginBottom: isMobile ? 64 : 80,
            opacity: 0.7,
          }}>
            Inclusive by design
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 64 : 80 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--color-secondary-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 24, color: "var(--color-on-secondary-container)" }}
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: isMobile ? 24 : 28,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  color: "var(--color-text)",
                  marginBottom: 14,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font)",
                  fontWeight: 400,
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: 1.6,
                  color: "var(--color-muted-mid)",
                  maxWidth: 440,
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section id="features" style={{
        background: "var(--color-bg)",
        padding: isMobile ? "80px 24px" : "100px 32px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: isMobile ? 32 : 36,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: "var(--color-text)",
            textAlign: "center",
            marginBottom: isMobile ? 48 : 64,
          }}>
            Built for humanity
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 16,
          }}>
            {features.map((feat, i) => (
              <div
                key={i}
                style={{
                  background: feat.dark ? "var(--color-primary)" : "var(--color-surface)",
                  borderRadius: "var(--radius-card)",
                  padding: isMobile ? "36px 28px" : "40px",
                  boxShadow: feat.dark ? "0 30px 60px rgba(0,0,0,0.15)" : "var(--shadow-card-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 280,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 36,
                    color: feat.dark ? "var(--color-on-primary)" : "var(--color-primary)",
                    marginBottom: 28,
                  }}
                >
                  {feat.icon}
                </span>
                <div>
                  <h4 style={{
                    fontFamily: "var(--font)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    color: feat.dark ? "var(--color-on-primary)" : "var(--color-text)",
                    marginBottom: 10,
                  }}>
                    {feat.title}
                  </h4>
                  <p style={{
                    fontFamily: "var(--font)",
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: feat.dark ? "rgba(255,255,255,0.6)" : "var(--color-muted-mid)",
                  }}>
                    {feat.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARK CTA */}
      <section style={{
        background: "var(--color-primary)",
        padding: isMobile ? "80px 24px" : "100px 32px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 20,
          }}>
            Start now
          </p>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 36 : 48,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--color-on-primary)",
            marginBottom: 16,
          }}>
            Take a breath.<br />You deserve it.
          </h2>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 18,
            color: "rgba(255,255,255,0.45)",
            marginBottom: 44,
          }}>
            Free. No account. Open right now.
          </p>
          <button
            onClick={onStart}
            style={{
              background: "var(--color-on-primary)",
              color: "var(--color-primary)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "20px 48px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              width: isMobile ? "100%" : "auto",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-high)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-on-primary)"; }}
          >
            Open Anchor
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "var(--color-bg)",
        padding: isMobile ? "48px 24px" : "64px 32px",
        borderTop: "1px solid var(--color-surface-high)",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-secondary)",
          }}>
            Free forever · Open source · For everyone
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {["How it works", "Features"].map((label) => (
              <button
                key={label}
                onClick={() => scrollTo(label === "How it works" ? "how-it-works" : "features")}
                style={{
                  fontFamily: "var(--font)",
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
              >
                {label}
              </button>
            ))}
          </div>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            opacity: 0.7,
          }}>
            © 2025 Anchor. Free, open, and for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
