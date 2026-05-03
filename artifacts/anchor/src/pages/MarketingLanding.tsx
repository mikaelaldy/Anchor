import { useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuth } from "@workspace/replit-auth-web";

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

interface Props {
  active: boolean;
  onStart: () => void;
}

const steps = [
  {
    icon: "diversity_3",
    title: "Space for all perspectives",
    body: "Designed to embrace neurodiversity and diverse life experiences. We believe stillness is a universal human right.",
  },
  {
    icon: "accessibility_new",
    title: "Accessible interactions",
    body: "Simple, high-contrast, and keyboard-friendly. Whether you have thirty seconds or thirty minutes, Anchor meets you where you are.",
  },
  {
    icon: "public",
    title: "Open to the world",
    body: "As an open-source project, Anchor is shaped by a global community of contributors from all walks of life.",
  },
];

export default function MarketingLanding({ active, onStart }: Props) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, login } = useAuth();

  const sectionGap = isMobile ? 80 : 120;
  const px = isMobile ? 24 : 32;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.async = true;
    script.onload = () => {
      (window as any).kofiWidgetOverlay?.draw("mikascend", {
        type: "floating-chat",
        "floating-chat.donateButton.text": "Support Anchor",
        "floating-chat.donateButton.background-color": "#000000",
        "floating-chat.donateButton.text-color": "#ffffff",
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      document.querySelector(".kofi-overlay")?.remove();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(`#${id}`);
    if (el) containerRef.current?.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", display: "block" }}
    >
      {/* NAV */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
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
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[
                { label: "Practice", id: "process" },
                { label: "Community", id: "features" },
              ].map(({ label, id }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(id)}
                  style={{
                    fontFamily: "var(--font)",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "var(--color-muted-mid)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                    transition: "color 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
                >
                  {label}
                </button>
              ))}
              <button
                style={{
                  fontFamily: "var(--font)",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "var(--color-muted-mid)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                Support
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>favorite</span>
              </button>
              <a
                href="https://github.com/mikaelaldy/Anchor"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "var(--color-muted-mid)",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                <GitHubIcon size={18} />
              </a>
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
              padding: "9px 20px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Start
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: `0 ${px}px` }}>

        {/* HERO — large top margin matching reference mt-[240px] */}
        <section style={{
          marginTop: isMobile ? 120 : 200,
          marginBottom: sectionGap,
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
            maxWidth: 480,
            marginBottom: sectionGap,
          }}>
            A visual deep breath designed for every mind, every background, and every ability. Practice presence, your way.
          </p>

          {/* Breath node — three-layer */}
          <div style={{
            position: "relative",
            width: isMobile ? 240 : 256,
            height: isMobile ? 240 : 256,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Outer thin border ring */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid var(--color-outline-variant)",
              opacity: 0.2,
            }} />
            {/* Inner thicker border ring */}
            <div style={{
              position: "absolute",
              inset: "10%",
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.08)",
            }} />
            {/* Black circle with air icon */}
            <div
              className="breath-node"
              style={{
                width: isMobile ? 124 : 136,
                height: isMobile ? 124 : 136,
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--color-on-primary)" }}>
                air
              </span>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ marginBottom: sectionGap, display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={onStart}
            style={{
              width: "100%",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "24px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              transition: "transform 200ms, box-shadow 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 28px 56px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
            }}
          >
            Start meditating
          </button>

          {!isAuthenticated && (
            <button
              onClick={login}
              style={{
                width: "100%",
                background: "var(--color-surface)",
                color: "var(--color-primary)",
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "20px 24px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-mid)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
              Sign in with Replit
            </button>
          )}

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(68,71,72,0.6)",
              marginBottom: 8,
            }}>
              Our Three Commitments
            </p>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 600,
              fontSize: 15,
              color: "var(--color-text)",
            }}>
              Free forever • Open source • For everyone
            </p>
          </div>
        </section>

        {/* PROCESS — INCLUSIVE BY DESIGN */}
        <section id="process" style={{ marginBottom: sectionGap }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
            color: "var(--color-text)",
            opacity: 0.6,
            marginBottom: sectionGap,
          }}>
            Inclusive by design
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--color-secondary-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "var(--color-on-secondary-container)" }}>
                    {step.icon}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: isMobile ? 26 : 32,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  color: "var(--color-text)",
                  marginBottom: 16,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font)",
                  fontWeight: 400,
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: 1.6,
                  color: "var(--color-muted-mid)",
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES BENTO */}
        <section id="features" style={{ marginBottom: sectionGap }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: isMobile ? 28 : 32,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: "var(--color-text)",
            textAlign: "center",
            marginBottom: sectionGap,
          }}>
            Built for humanity
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 16,
          }}>
            {/* Card 1 — white */}
            <div style={{
              background: "var(--color-surface)",
              padding: isMobile ? 32 : 40,
              borderRadius: "var(--radius-card)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 320,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--color-primary)", marginBottom: 28 }}>
                all_inclusive
              </span>
              <div>
                <h4 style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: 1.2,
                  color: "var(--color-text)",
                  marginBottom: 10,
                }}>
                  Universal Focus
                </h4>
                <p style={{
                  fontFamily: "var(--font)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--color-muted-mid)",
                }}>
                  A distraction-free environment that respects your cognitive load, regardless of how your mind works.
                </p>
              </div>
            </div>

            {/* Card 2 — black */}
            <div style={{
              background: "var(--color-primary)",
              padding: isMobile ? 32 : 40,
              borderRadius: "var(--radius-card)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 320,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--color-on-primary)", marginBottom: 28 }}>
                group
              </span>
              <div>
                <h4 style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: 1.2,
                  color: "var(--color-on-primary)",
                  marginBottom: 10,
                }}>
                  Diverse Anchors
                </h4>
                <p style={{
                  fontFamily: "var(--font)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  Visual and auditory cues for different sensory preferences and cultural contexts.
                </p>
              </div>
            </div>

            {/* Card 3 — wide, spans 2 cols */}
            <div style={{
              gridColumn: isMobile ? "1" : "1 / -1",
              background: "rgba(191,238,201,0.25)",
              padding: isMobile ? 32 : 40,
              borderRadius: "var(--radius-card)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.02)",
            }}>
              <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 32,
                alignItems: "center",
              }}>
                {/* Image placeholder */}
                <div style={{
                  width: isMobile ? "100%" : "50%",
                  height: 192,
                  flexShrink: 0,
                  borderRadius: 24,
                  background: "linear-gradient(135deg, var(--color-secondary-container) 0%, var(--color-surface-high) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-on-secondary-container)", opacity: 0.5 }}>
                    people
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontFamily: "var(--font)",
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: "var(--color-text)",
                    marginBottom: 16,
                  }}>
                    Empathetic Architecture
                  </h4>
                  <p style={{
                    fontFamily: "var(--font)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-muted-mid)",
                  }}>
                    We reduce decision fatigue by prioritizing clarity. Our interface is a bridge to stillness for users of all ages and technical abilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALMNESS SECTION */}
        <section style={{
          marginBottom: sectionGap,
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.08)",
        }}>
          <div style={{
            width: "100%",
            height: 360,
            background: "linear-gradient(160deg, var(--color-surface-highest) 0%, var(--color-surface-mid) 40%, var(--color-secondary-container) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: "var(--color-on-secondary-container)", opacity: 0.4 }}>
              landscape
            </span>
            <p style={{
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-on-secondary-container)",
              opacity: 0.5,
            }}>
              Stillness awaits
            </p>
          </div>
        </section>

        {/* KO-FI DONATION SECTION */}
        <section style={{ marginBottom: sectionGap }}>
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            padding: isMobile ? 32 : 40,
            boxShadow: "0 30px 60px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: 10,
              }}>
                Support the project
              </p>
              <h3 style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: isMobile ? 24 : 28,
                letterSpacing: "-0.01em",
                color: "var(--color-text)",
                marginBottom: 12,
              }}>
                Keep Anchor free for everyone
              </h3>
              <p style={{
                fontFamily: "var(--font)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--color-muted-mid)",
                maxWidth: 400,
                margin: "0 auto",
              }}>
                Anchor is free and open source. If it's helped you find a moment of calm, consider buying me a coffee.
              </p>
            </div>

            {/* Ko-fi card */}
            <a
              href="https://ko-fi.com/mikascend"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: isMobile ? "24px 28px" : "28px 36px",
                borderRadius: 24,
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-surface-high)",
                textDecoration: "none",
                transition: "background 150ms, transform 150ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-mid)";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface-low)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "#FF5E5B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 24,
                }}>
                  ☕
                </div>
                <div>
                  <p style={{
                    fontFamily: "var(--font)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--color-text)",
                    marginBottom: 3,
                  }}>
                    ko-fi.com/mikascend
                  </p>
                  <p style={{
                    fontFamily: "var(--font)",
                    fontSize: 13,
                    color: "var(--color-muted)",
                  }}>
                    Buy me a coffee to keep Anchor free
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--color-muted)", flexShrink: 0 }}>
                open_in_new
              </span>
            </a>

            <a
              href="https://ko-fi.com/mikascend"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                textDecoration: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                transition: "transform 150ms, box-shadow 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span>
              Support on Ko-fi
            </a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-surface-high)",
        padding: isMobile ? "48px 24px 56px" : "64px 32px 72px",
      }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          textAlign: "center",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 24 }}>
            {["Privacy", "Terms", "Support Anchor"].map((label) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  textDecoration: "none",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
              >
                {label}
              </a>
            ))}
            <a
              href="https://github.com/mikaelaldy/Anchor"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                textDecoration: "none",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              <GitHubIcon size={14} />
              Open Source
            </a>
          </div>

          <div style={{
            paddingTop: 20,
            borderTop: "1px solid var(--color-surface-high)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}>
            <p style={{
              fontFamily: "var(--font)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              opacity: 0.8,
            }}>
              © 2026 Anchor. Free, open, and for everyone.
            </p>
            <a
              href="https://ko-fi.com/mikascend"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-surface-high)",
                background: "transparent",
                fontFamily: "var(--font)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-muted-mid)",
                textDecoration: "none",
                transition: "background 150ms, color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-low)";
                e.currentTarget.style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-muted-mid)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span>
              Donate on Ko-fi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
