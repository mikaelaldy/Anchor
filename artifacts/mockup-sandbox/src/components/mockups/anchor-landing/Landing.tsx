import React from 'react';

const T = {
  bg: '#F5F4F0',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#A89F97',
  accent: '#8C7A6B',
  border: '1px solid rgba(26,26,26,0.10)',
  shadow: '0 4px 24px rgba(26,26,26,0.06)',
  shadowCard: '0 8px 32px rgba(26,26,26,0.08)',
  fontHeading: "'Space Grotesk', sans-serif",
  fontBody: "'Outfit', sans-serif",
};

export default function Landing() {
  return (
    <div style={{ fontFamily: T.fontBody, background: T.bg, minWidth: 1280 }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: T.surface, borderBottom: T.border }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, padding: '0 32px' }}>
          <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 20, color: T.text, letterSpacing: '-0.02em' }}>
            Anchor
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <span style={{ fontFamily: T.fontBody, fontSize: 14, color: T.muted, cursor: 'pointer' }}>How it works</span>
            <span style={{ fontFamily: T.fontBody, fontSize: 14, color: T.muted, cursor: 'pointer' }}>Features</span>
            <button style={{ backgroundColor: T.text, color: T.surface, fontFamily: T.fontHeading, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 24px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              Try it free
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse at 60% 40%, rgba(140,122,107,0.06), transparent 60%)` }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '80px 32px', gap: 80 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(140,122,107,0.10)', color: T.accent, fontFamily: T.fontBody, fontWeight: 500, fontSize: 13, padding: '8px 16px', borderRadius: 100, marginBottom: 32 }}>
              Free &middot; No sign-up &middot; ADHD-friendly
            </div>
            <h1 style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 72, color: T.text, lineHeight: 1.05, margin: 0 }}>
              Stillness for the<br />restless mind.
            </h1>
            <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 20, color: T.muted, marginTop: 24, lineHeight: 1.6, maxWidth: 540 }}>
              Anchor is an ADHD-first meditation app that meets your brain where it is — scattered, buzzing, or paralyzed. No subscriptions. No judgement.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
              <button style={{ backgroundColor: T.text, color: T.surface, fontFamily: T.fontHeading, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 36px', borderRadius: 100, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,26,26,0.15)' }}>
                Start meditating
              </button>
              <button style={{ backgroundColor: 'transparent', color: T.text, fontFamily: T.fontHeading, fontWeight: 600, fontSize: 14, padding: '16px 32px', borderRadius: 100, border: T.border, cursor: 'pointer' }}>
                See how it works
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 420, height: 420,
              borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
              background: 'radial-gradient(circle, rgba(140,122,107,0.12), rgba(140,122,107,0.04))',
              border: '2px solid rgba(140,122,107,0.20)',
              boxShadow: '0 0 80px rgba(140,122,107,0.10), 0 0 160px rgba(140,122,107,0.05)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="14" r="5" stroke="#8C7A6B" strokeWidth="2" fill="none" />
                <line x1="28" y1="19" x2="28" y2="42" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 30 Q14 42 28 42 Q42 42 42 30" stroke="#8C7A6B" strokeWidth="2" fill="none" strokeLinecap="round" />
                <line x1="10" y1="30" x2="18" y2="30" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
                <line x1="38" y1="30" x2="46" y2="30" stroke="#8C7A6B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 28, color: T.accent, marginTop: 20 }}>Breathe.</div>
            </div>
          </div>
        </div>
      </header>

      {/* SOCIAL PROOF STRIP */}
      <section style={{ backgroundColor: T.surface, borderTop: T.border, borderBottom: T.border }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 32px' }}>
          {[
            { stat: "1 min", label: "Shortest session" },
            { stat: "3 moods", label: "Scattered · Paralyzed · Buzzing" },
            { stat: "0 sign-ups", label: "Just open and breathe" },
            { stat: "Streak tracking", label: "Built into the app" },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 32, color: T.text }}>{item.stat}</div>
                <div style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 14, color: T.muted, marginTop: 8 }}>{item.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 48, backgroundColor: 'rgba(26,26,26,0.08)' }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ backgroundColor: T.bg, padding: '120px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: T.fontBody, fontWeight: 500, fontSize: 13, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 48, color: T.text, marginTop: 16, marginBottom: 16 }}>Three steps to stillness.</h2>
            <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 18, color: T.muted }}>No warm-up. No sign-in. Just open and breathe.</p>
          </div>

          <div style={{ display: 'flex', gap: 24, maxWidth: 960, margin: '0 auto' }}>
            {[
              { num: "01", title: "Tell us how you feel", body: "Scattered, Paralyzed, or Buzzing — pick the state that matches right now." },
              { num: "02", title: "Pick your time", body: "1, 3, or 5 minutes. No judgment. Even a minute counts." },
              { num: "03", title: "Follow the breath", body: "The breath node guides you through inhale, hold, and exhale cycles." },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: T.surface, borderRadius: 24, padding: 40, border: T.border, boxShadow: T.shadowCard }}>
                <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 13, color: T.accent, letterSpacing: '0.1em', marginBottom: 24 }}>{step.num}</div>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(140,122,107,0.10)', marginBottom: 20 }} />
                <h3 style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 22, color: T.text, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 16, color: T.muted, lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ backgroundColor: T.surface, padding: '120px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: T.fontBody, fontWeight: 500, fontSize: 13, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>BUILT FOR ADHD BRAINS</div>
            <h2 style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 48, color: T.text, marginTop: 16, marginBottom: 16 }}>Designed for the way you actually think.</h2>
            <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 18, color: T.muted, maxWidth: 600, margin: '0 auto' }}>Every detail works with your brain, not against it.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 960, margin: '0 auto' }}>
            {[
              { title: "Mood-first", body: "Start by naming how you feel. No pretending to be calm." },
              { title: "Instant start", body: "Zero onboarding. Tap a mood, pick a time, breathe." },
              { title: "Fidget layer", body: "Move your mouse. Watch particles trail behind it. It helps." },
              { title: "Streak tracking", body: "Build a daily habit with a simple streak counter. No pressure." },
              { title: "Works offline", body: "Installed as a PWA, it runs without internet. Always there." },
              { title: "Fully free", body: "No paywalls, no email, no account. Forever free, forever open." },
            ].map((feat, i) => (
              <div key={i} style={{ backgroundColor: T.bg, borderRadius: 20, padding: 32, border: T.border }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(140,122,107,0.12)', marginBottom: 16 }} />
                <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 17, color: T.text, marginBottom: 8 }}>{feat.title}</div>
                <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 15, color: T.muted, lineHeight: 1.6, margin: 0 }}>{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ backgroundColor: T.text, padding: '120px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: T.fontBody, fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>START NOW</div>
          <h2 style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 56, color: T.surface, marginTop: 16, marginBottom: 0, lineHeight: 1.05 }}>Your brain deserves a break.</h2>
          <p style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: 20 }}>Free. No account. Open right now.</p>
          <button style={{ backgroundColor: T.surface, color: T.text, fontFamily: T.fontHeading, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 48px', borderRadius: 100, border: 'none', cursor: 'pointer', marginTop: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            Open Anchor
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: T.surface, borderTop: T.border, padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 16, color: T.text, letterSpacing: '-0.01em' }}>Anchor</div>
          <div style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 14, color: T.muted }}>Stillness for the restless mind.</div>
          <div style={{ fontFamily: T.fontBody, fontWeight: 400, fontSize: 14, color: T.muted }}>Free &middot; Open Source &middot; No Sign-up</div>
        </div>
      </footer>
    </div>
  );
}
