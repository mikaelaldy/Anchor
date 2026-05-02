import React from 'react';

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAFBFF', minWidth: 1280 }}>
      {/* 1. NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, padding: '0 32px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚓</span> Anchor
          </div>
          <button style={{ backgroundColor: '#6366F1', color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, textTransform: 'uppercase', padding: '12px 24px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
            Try it free &rarr;
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 60% 30%, rgba(99,102,241,0.08), transparent 60%)' }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 80 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(99,102,241,0.08)', color: '#6366F1', fontWeight: 500, fontSize: 13, padding: '8px 16px', borderRadius: 100, marginBottom: 32 }}>
              Free &middot; No sign-up &middot; ADHD-friendly
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 72, color: '#0F172A', lineHeight: 1.05, margin: 0, whiteSpace: 'pre-line' }}>
              Stillness for the{'\n'}restless mind.
            </h1>
            <p style={{ fontWeight: 400, fontSize: 20, color: '#94A3B8', marginTop: 24, lineHeight: 1.5, maxWidth: 540 }}>
              Anchor is a ADHD-first meditation app that meets your brain where it is &mdash; scattered, buzzing, or paralyzed. No subscriptions. No judgement.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
              <button style={{ backgroundColor: '#6366F1', color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, textTransform: 'uppercase', padding: '16px 32px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                Start meditating &rarr;
              </button>
              <button style={{ backgroundColor: 'transparent', color: '#0F172A', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, padding: '16px 32px', borderRadius: 100, border: '1px solid rgba(15,23,42,0.15)', cursor: 'pointer' }}>
                See how it works
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 420, height: 420, borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), rgba(129,140,248,0.03))', border: '2px solid rgba(99,102,241,0.15)', boxShadow: '0 0 80px rgba(99,102,241,0.12), 0 0 160px rgba(99,102,241,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 64, lineHeight: 1 }}>⚓</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: '#6366F1', marginTop: 16 }}>Breathe.</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SOCIAL PROOF STRIP */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.08)', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 32px' }}>
          {[
            { stat: "1 min", label: "Shortest session" },
            { stat: "3 moods", label: "Scattered · Paralyzed · Buzzing" },
            { stat: "0 sign-ups", label: "Just open and breathe" },
            { stat: "🔥 Streak tracking", label: "Built into the app" }
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, color: '#0F172A' }}>{item.stat}</div>
                <div style={{ fontWeight: 400, fontSize: 14, color: '#94A3B8', marginTop: 8 }}>{item.label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 48, backgroundColor: 'rgba(15,23,42,0.06)' }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section style={{ backgroundColor: '#FAFBFF', padding: '120px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 48, color: '#0F172A', marginTop: 16, marginBottom: 16 }}>Three steps to stillness.</h2>
            <p style={{ fontWeight: 400, fontSize: 18, color: '#94A3B8' }}>No warm-up. No sign-in. Just open and breathe.</p>
          </div>
          
          <div style={{ display: 'flex', gap: 32, maxWidth: 900, margin: '0 auto' }}>
            {[
              { num: "01", icon: "🎭", title: "Tell us how you feel", body: "Scattered, Paralyzed, or Buzzing — pick the state that matches right now." },
              { num: "02", icon: "⏱️", title: "Pick your time", body: "1, 3, or 5 minutes. No judgment. Even a minute counts." },
              { num: "03", icon: "🫁", title: "Follow the breath", body: "The breath node guides you through inhale, hold, and exhale cycles." }
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 40, border: '1px solid rgba(15, 23, 42, 0.08)', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#6366F1', letterSpacing: '0.1em', marginBottom: 16 }}>{step.num}</div>
                <div style={{ fontSize: 32 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#0F172A', marginTop: 12, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontWeight: 400, fontSize: 16, color: '#94A3B8', lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '120px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BUILT FOR ADHD BRAINS</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 48, color: '#0F172A', marginTop: 16, marginBottom: 16 }}>Designed for the way you actually think.</h2>
            <p style={{ fontWeight: 400, fontSize: 18, color: '#94A3B8', maxWidth: 600, margin: '0 auto' }}>We know focus is hard. So we made every detail work with your brain, not against it.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            {[
              { icon: "🎯", title: "Mood-first", body: "Start by naming how you feel. No pretending to be calm." },
              { icon: "⚡", title: "Instant start", body: "Zero onboarding. Tap a mood, pick a time, breathe." },
              { icon: "🫧", title: "Fidget layer", body: "Move your mouse. Watch particles trail behind it. It helps." },
              { icon: "🔥", title: "Streak tracking", body: "Build a daily habit with a simple streak counter. No pressure." },
              { icon: "📴", title: "Works offline", body: "Installed as a PWA, it runs without internet. Always there." },
              { icon: "🔓", title: "Fully free", body: "No paywalls, no email, no account. Forever free, forever open." }
            ].map((feat, i) => (
              <div key={i} style={{ backgroundColor: '#FAFBFF', borderRadius: 20, padding: 32, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{feat.icon}</span> {feat.title}
                </div>
                <p style={{ fontWeight: 400, fontSize: 15, color: '#94A3B8', marginTop: 8, lineHeight: 1.5 }}>{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section style={{ backgroundColor: '#6366F1', padding: '120px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>START NOW</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 56, color: '#FFFFFF', marginTop: 16, marginBottom: 16 }}>Your brain deserves a break.</h2>
          <p style={{ fontWeight: 400, fontSize: 20, color: 'rgba(255,255,255,0.7)', marginTop: 16 }}>Free. No account. Open right now.</p>
          <button style={{ backgroundColor: '#FFFFFF', color: '#6366F1', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, textTransform: 'uppercase', padding: '16px 48px', borderRadius: 100, border: 'none', cursor: 'pointer', marginTop: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            Open Anchor &rarr;
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(15, 23, 42, 0.08)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 400, fontSize: 14, color: '#94A3B8' }}>⚓ Anchor &mdash; Stillness for the restless mind.</div>
          <div style={{ fontWeight: 400, fontSize: 14, color: '#94A3B8', textAlign: 'right' }}>Free &middot; Open Source &middot; No Sign-up</div>
        </div>
      </footer>
    </div>
  );
}