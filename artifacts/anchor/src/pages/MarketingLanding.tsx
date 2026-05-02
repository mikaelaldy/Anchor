import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  active: boolean;
  onStart: () => void;
}

const steps = [
  { num: "01", title: "Tell us how you feel", body: "Scattered, Paralyzed, or Buzzing — pick the state that matches right now." },
  { num: "02", title: "Pick your time", body: "1, 3, or 5 minutes. No judgment. Even one minute counts." },
  { num: "03", title: "Follow the breath", body: "The breath node guides you through inhale, hold, and exhale cycles." },
];

const features = [
  { title: "Mood-first", body: "Start by naming how you feel. No pretending to be calm." },
  { title: "Instant start", body: "Zero onboarding. Tap a mood, pick a time, breathe." },
  { title: "Fidget layer", body: "Move your mouse. Particles trail behind it. It helps." },
  { title: "Streak tracking", body: "Build a daily habit with a simple streak counter. No pressure." },
  { title: "Works offline", body: "Install as a PWA and use it anywhere, even without internet." },
  { title: "Fully free", body: "No paywalls, no email, no account. Forever free, forever open." },
];

export default function MarketingLanding({ active, onStart }: Props) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`screen${active ? " active" : ""}`}
      style={{ overflowY: "auto", display: "block", background: "#F5F4F0" }}
    >
      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid rgba(26,26,26,0.10)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: isMobile ? 64 : 80,
          padding: isMobile ? "0 20px" : "0 40px",
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: isMobile ? 18 : 20,
            color: "#1A1A1A", letterSpacing: "-0.02em",
          }}>
            Anchor
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#A89F97", cursor: "pointer" }}>How it works</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#A89F97", cursor: "pointer" }}>Features</span>
            </div>
          )}
          <button
            onClick={onStart}
            style={{
              backgroundColor: "#1A1A1A", color: "#FFFFFF",
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
              fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em",
              padding: isMobile ? "10px 20px" : "12px 24px",
              borderRadius: 100, border: "none", cursor: "pointer",
            }}
          >
            Try it free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header style={{
        minHeight: isMobile ? "80vh" : "calc(100vh - 80px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 60% 40%, rgba(140,122,107,0.07), transparent 60%)",
        padding: isMobile ? "60px 20px" : "80px 40px",
      }}>
        <div style={{
          maxWidth: 1200, width: "100%", margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", gap: isMobile ? 48 : 80,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-block",
              backgroundColor: "rgba(140,122,107,0.10)", color: "#8C7A6B",
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13,
              padding: "8px 16px", borderRadius: 100, marginBottom: 28,
            }}>
              Free · No sign-up · ADHD-friendly
            </div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: isMobile ? 44 : 72, color: "#1A1A1A",
              lineHeight: 1.05, margin: 0,
            }}>
              Stillness for the<br />restless mind.
            </h1>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 400,
              fontSize: isMobile ? 17 : 20, color: "#A89F97",
              marginTop: 24, lineHeight: 1.6,
              maxWidth: isMobile ? "100%" : 520,
            }}>
              Anchor is an ADHD-first meditation app that meets your brain where it is — scattered, buzzing, or paralyzed. No subscriptions. No judgement.
            </p>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginTop: 40 }}>
              <button
                onClick={onStart}
                style={{
                  backgroundColor: "#1A1A1A", color: "#FFFFFF",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                  fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em",
                  padding: "16px 36px", borderRadius: 100, border: "none", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(26,26,26,0.15)",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Start meditating
              </button>
              <a
                href="#how-it-works"
                style={{
                  backgroundColor: "transparent", color: "#1A1A1A",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                  fontSize: 14, padding: "16px 32px", borderRadius: 100,
                  border: "1px solid rgba(26,26,26,0.10)", cursor: "pointer",
                  textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                See how it works
              </a>
            </div>
          </div>

          <div style={{ flex: isMobile ? "none" : 1, display: "flex", justifyContent: "center" }}>
            <div style={{
              width: isMobile ? 280 : 400, height: isMobile ? 280 : 400,
              borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
              background: "radial-gradient(circle, rgba(140,122,107,0.12), rgba(140,122,107,0.04))",
              border: "2px solid rgba(140,122,107,0.20)",
              boxShadow: "0 0 80px rgba(140,122,107,0.10), 0 0 160px rgba(140,122,107,0.05)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="13" r="5" stroke="#8C7A6B" strokeWidth="2" fill="none" />
                <line x1="28" y1="18" x2="28" y2="40" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 30 Q14 42 28 42 Q42 42 42 30" stroke="#8C7A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
                <line x1="10" y1="30" x2="18" y2="30" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
                <line x1="38" y1="30" x2="46" y2="30" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: isMobile ? 22 : 28, color: "#8C7A6B", marginTop: 18,
              }}>
                Breathe.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOCIAL PROOF STRIP */}
      <section style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(26,26,26,0.10)", borderBottom: "1px solid rgba(26,26,26,0.10)" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "40px 20px" : "48px 40px",
          gap: isMobile ? 32 : 0,
        }}>
          {[
            { stat: "1 min", label: "Shortest session" },
            { stat: "3 moods", label: "Scattered · Paralyzed · Buzzing" },
            { stat: "0 sign-ups", label: "Just open and breathe" },
            { stat: "Streak tracking", label: "Built into the app" },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 26 : 32, color: "#1A1A1A" }}>{item.stat}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 14, color: "#A89F97", marginTop: 6 }}>{item.label}</div>
              </div>
              {!isMobile && i < arr.length - 1 && (
                <div style={{ width: 1, height: 48, backgroundColor: "rgba(26,26,26,0.08)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ backgroundColor: "#F5F4F0", padding: isMobile ? "80px 20px" : "120px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 48 : 64 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, color: "#8C7A6B", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 36 : 48, color: "#1A1A1A", marginTop: 16, marginBottom: 12 }}>
              Three steps to stillness.
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: isMobile ? 16 : 18, color: "#A89F97" }}>
              No warm-up. No sign-in. Just open and breathe.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                flex: 1, backgroundColor: "#FFFFFF", borderRadius: 24, padding: isMobile ? 28 : 40,
                border: "1px solid rgba(26,26,26,0.10)",
                boxShadow: "0 8px 32px rgba(26,26,26,0.08)",
              }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#8C7A6B", letterSpacing: "0.1em", marginBottom: 20 }}>{step.num}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(140,122,107,0.10)", marginBottom: 18 }} />
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#1A1A1A", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 15, color: "#A89F97", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ backgroundColor: "#FFFFFF", padding: isMobile ? "80px 20px" : "120px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 48 : 64 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, color: "#8C7A6B", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              BUILT FOR ADHD BRAINS
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 36 : 48, color: "#1A1A1A", marginTop: 16, marginBottom: 12 }}>
              Designed for the way<br />you actually think.
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: isMobile ? 16 : 18, color: "#A89F97", maxWidth: 560, margin: "0 auto" }}>
              Every detail works with your brain, not against it.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 16, maxWidth: 960, margin: "0 auto",
          }}>
            {features.map((feat, i) => (
              <div key={i} style={{
                backgroundColor: "#F5F4F0", borderRadius: 20, padding: isMobile ? 24 : 32,
                border: "1px solid rgba(26,26,26,0.10)",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(140,122,107,0.12)", marginBottom: 14 }} />
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A1A1A", marginBottom: 6 }}>{feat.title}</div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 15, color: "#A89F97", lineHeight: 1.6, margin: 0 }}>{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ backgroundColor: "#1A1A1A", padding: isMobile ? "80px 20px" : "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            START NOW
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: isMobile ? 40 : 56, color: "#FFFFFF",
            marginTop: 16, lineHeight: 1.05,
          }}>
            Your brain deserves a break.
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: isMobile ? 16 : 20, color: "rgba(255,255,255,0.45)", marginTop: 16 }}>
            Free. No account. Open right now.
          </p>
          <button
            onClick={onStart}
            style={{
              backgroundColor: "#FFFFFF", color: "#1A1A1A",
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
              fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em",
              padding: "16px 48px", borderRadius: 100, border: "none", cursor: "pointer",
              marginTop: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Open Anchor
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(26,26,26,0.10)", padding: isMobile ? "32px 20px" : "40px 40px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Anchor</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 14, color: "#A89F97" }}>Stillness for the restless mind.</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 14, color: "#A89F97" }}>Free · Open Source · No Sign-up</div>
        </div>
      </footer>
    </div>
  );
}
