import { useRef } from "react";
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
  onDashboard: () => void;
}

const steps = [
  {
    num: "01",
    title: "Tell us how you feel",
    body: "You pick one of three states — scattered, heavy, or overwhelmed. That's it. No long questionnaire, no setup, no explaining yourself.",
  },
  {
    num: "02",
    title: "Choose how long you have",
    body: "One minute, three minutes, or five. All of them are real sessions. We're not going to tell you that one minute doesn't count.",
  },
  {
    num: "03",
    title: "Follow the breath",
    body: "A breathing node walks you through inhale, hold, and exhale. Move your mouse and it spawns particle trails around the node — something for your hands to do while your mind slows down.",
  },
];

const cards = [
  {
    icon: "lock_open",
    title: "No cost, ever",
    body: "No free trial that ends. No premium tier. Nothing locked behind a paywall.",
  },
  {
    icon: "code",
    title: "Fully open source",
    body: "MIT licensed and on GitHub. Read the code, fork it, suggest changes. It belongs to everyone.",
  },
  {
    icon: "devices",
    title: "Syncs with Replit",
    body: "Sign in with your Replit account and your streak follows you across devices. Or don't sign in. Either way it works.",
  },
];

const story = [
  "Meditation apps have a problem. They're polished, expensive, and designed around the assumption that you have the time and headspace to sit quietly for twenty minutes. A lot of people don't.",
  "Anchor started as a hackathon project built in under 24 hours. The goal was simple: make something anyone could open in a moment of stress and actually use. No onboarding. No account. No paywall standing between you and one minute of breathing.",
  "It's free because it should be free. Stress doesn't check your subscription status. Neither should the thing that helps you manage it.",
  "Anchor is open source and will stay that way. If you want to contribute, the GitHub is open.",
];

export default function MarketingLanding({ active, onStart }: Props) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  void isAuthenticated;

  const scrollTo = (id: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(`#${id}`);
    if (el) containerRef.current?.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
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
  };

  const footerLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#a8a29e",
    textDecoration: "none",
    transition: "color 150ms",
  };

  return (
    <div
      ref={containerRef}
      className={`screen${active ? " active" : ""}`}
      style={{ background: "var(--color-bg)", overflowY: "auto", display: "block" }}
    >
      <style>{`
        @keyframes hero-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 30px 60px rgba(0,0,0,0.06); }
          50% { transform: scale(1.05); box-shadow: 0 40px 80px rgba(0,0,0,0.10); }
        }
        .hero-node { animation: hero-pulse 5s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,248,248,0.85)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "14px 24px" : "16px 40px",
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
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <button
                style={navLinkStyle}
                onClick={() => scrollTo("how-it-works")}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                How it works
              </button>
              <a
                href="https://github.com/mikaelaldy/Anchor"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...navLinkStyle, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                Open Source
              </a>
              <button
                style={navLinkStyle}
                onClick={() => scrollTo("support")}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted-mid)"; }}
              >
                Support
              </button>
            </div>
          )}

          <button
            onClick={onStart}
            style={{
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font)",
              fontWeight: 600,
              fontSize: 14,
              padding: "9px 20px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Open App
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "60px 24px 80px" : "80px 40px 100px",
      }}>
        <div style={{ maxWidth: 640, width: "100%", textAlign: "center", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 40 : 64,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--color-text)",
            marginBottom: 20,
          }}>
            {isMobile
              ? "Stillness for the restless mind."
              : <>Stillness for<br />the restless mind.</>}
          </h1>

          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: 19,
            lineHeight: 1.7,
            color: "var(--color-muted-mid)",
            maxWidth: 460,
            margin: "0 auto 40px",
          }}>
            Anchor is a free meditation app. Pick how you feel, choose how long you have, and follow a breathing node that guides you through the whole thing. No account. No paywall. Just open it.
          </p>

          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}>
            <button
              onClick={onStart}
              style={{
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: 16,
                padding: "16px 32px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 28px 56px rgba(0,0,0,0.24)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.18)";
              }}
            >
              Start breathing
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              style={{
                background: "transparent",
                color: "var(--color-text)",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: 16,
                padding: "16px 32px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-outline-variant)",
                cursor: "pointer",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-low)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              See how it works
            </button>
          </div>

          <p style={{
            fontFamily: "var(--font)",
            fontSize: 13,
            color: "var(--color-muted)",
            letterSpacing: "0.06em",
            marginBottom: 64,
          }}>
            Free forever · No sign-up needed · MIT licensed
          </p>

          {/* Breathing node */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              position: "relative",
              width: 200,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid var(--color-outline-variant)",
                opacity: 0.3,
              }} />
              <div
                className="hero-node"
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background: "var(--color-surface)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--color-text)",
                }}>
                  Breathe
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" style={{
        padding: isMobile ? "80px 24px" : "128px 40px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-on-secondary-container)",
            textAlign: "center",
            marginBottom: 80,
          }}>
            HOW IT WORKS
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {steps.map(({ num, title, body }) => (
              <div key={num} style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                <span style={{
                  fontFamily: "var(--font)",
                  fontWeight: 800,
                  fontSize: 48,
                  color: "var(--color-outline-variant)",
                  opacity: 0.4,
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 72,
                }}>
                  {num}
                </span>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--color-text)",
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font)",
                    fontWeight: 400,
                    fontSize: 17,
                    color: "var(--color-muted-mid)",
                    lineHeight: 1.7,
                  }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHO IT'S FOR */}
      <section style={{
        background: "var(--color-surface-low)",
        padding: isMobile ? "80px 24px" : "128px 40px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 30 : 38,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--color-text)",
            marginBottom: 24,
          }}>
            Built for every kind of mind.
          </h2>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: 1.75,
            color: "var(--color-muted-mid)",
            maxWidth: 480,
            margin: "0 auto 64px",
          }}>
            Most wellness apps feel like they were made for one type of person. Anchor wasn't. It's for people of every age, background, culture, ability, thinking style, and life experience. You don't need to already be calm to use it.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: 20,
            textAlign: "left",
          }}>
            {cards.map(({ icon, title, body }) => (
              <div key={title} style={{
                background: "var(--color-surface)",
                padding: 32,
                borderRadius: 28,
                boxShadow: "0 16px 40px rgba(0,0,0,0.04)",
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 28,
                  color: "var(--color-on-secondary-container)",
                  display: "block",
                  marginBottom: 20,
                }}>
                  {icon}
                </span>
                <h4 style={{
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--color-text)",
                  marginBottom: 8,
                }}>
                  {title}
                </h4>
                <p style={{
                  fontFamily: "var(--font)",
                  fontWeight: 400,
                  fontSize: 15,
                  color: "var(--color-muted-mid)",
                  lineHeight: 1.6,
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE STORY */}
      <section style={{
        padding: isMobile ? "80px 24px" : "128px 40px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: isMobile ? 30 : 38,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--color-text)",
            marginBottom: 32,
          }}>
            Why we built this.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {story.map((text, i) => (
              <p key={i} style={{
                fontFamily: "var(--font)",
                fontWeight: 400,
                fontSize: 18,
                lineHeight: 1.8,
                color: "var(--color-muted-mid)",
              }}>
                {text}
              </p>
            ))}
          </div>

          <div style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}>
            <a
              href="https://github.com/mikaelaldy/Anchor"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-outline-variant)",
                background: "transparent",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: 15,
                color: "var(--color-text)",
                textDecoration: "none",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-low)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <GitHubIcon size={16} />
              Open on GitHub
            </a>
            <button
              onClick={onStart}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontFamily: "var(--font)",
                fontWeight: 600,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                transition: "transform 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Try the app
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: KO-FI SUPPORT */}
      <section id="support" style={{
        background: "var(--color-surface-low)",
        padding: isMobile ? "80px 24px" : "80px 40px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-on-secondary-container)",
            marginBottom: 16,
          }}>
            SUPPORT THE PROJECT
          </p>
          <h2 style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            marginBottom: 16,
          }}>
            Keep Anchor free for everyone.
          </h2>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--color-muted-mid)",
            maxWidth: 460,
            margin: "0 auto 40px",
          }}>
            Anchor is free and open source. If it has helped you find a moment of calm, consider buying me a coffee. It helps keep the project alive and ad-free.
          </p>

          <div style={{
            background: "var(--color-surface)",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
            maxWidth: 380,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#FF5E5B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}>
              ☕
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 17,
                color: "var(--color-text)",
                marginBottom: 6,
              }}>
                Buy me a coffee
              </p>
              <p style={{
                fontFamily: "var(--font)",
                fontSize: 14,
                color: "var(--color-muted)",
                lineHeight: 1.5,
              }}>
                Keep Anchor free and open source
              </p>
            </div>
            <a
              href="https://ko-fi.com/mikascend"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontFamily: "var(--font)",
                fontWeight: 700,
                fontSize: 14,
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
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>favorite</span>
              Support on Ko-fi
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section style={{
        background: "var(--color-primary)",
        padding: isMobile ? "80px 24px" : "112px 40px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font)",
          fontWeight: 800,
          fontSize: isMobile ? 36 : 48,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--color-on-primary)",
          marginBottom: 16,
        }}>
          Your brain deserves a break.
        </h2>
        <p style={{
          fontFamily: "var(--font)",
          fontWeight: 400,
          fontSize: 18,
          color: "var(--color-on-primary)",
          opacity: 0.6,
          marginBottom: 40,
        }}>
          No account. No download. Open right now.
        </p>
        <button
          onClick={onStart}
          style={{
            background: "#fff",
            color: "var(--color-primary)",
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 16,
            padding: "20px 40px",
            borderRadius: "var(--radius-pill)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            transition: "transform 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Open Anchor
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#fafaf9",
        padding: isMobile ? "48px 24px" : "56px 40px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <span style={{
              fontFamily: "var(--font)",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
            }}>
              Anchor
            </span>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { label: "Privacy", href: "#", external: false },
                { label: "Terms", href: "#", external: false },
                { label: "GitHub", href: "https://github.com/mikaelaldy/Anchor", external: true },
              ].map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={!external ? (e) => e.preventDefault() : undefined}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#a8a29e"; }}
                >
                  {label}
                </a>
              ))}
              <a
                href="https://ko-fi.com/mikascend"
                target="_blank"
                rel="noopener noreferrer"
                style={footerLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#a8a29e"; }}
              >
                Support
              </a>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e7e5e4", margin: "32px 0" }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <span style={{ fontFamily: "var(--font)", fontSize: 12, color: "#a8a29e" }}>
              © 2026 Anchor. Free, open, for everyone.
            </span>
            <span style={{ fontFamily: "var(--font)", fontSize: 12, color: "#a8a29e" }}>
              Built with Replit Agent
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
