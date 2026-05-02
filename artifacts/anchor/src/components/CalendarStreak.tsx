interface Props {
  completedDays: string[];
}

export default function CalendarStreak({ completedDays }: Props) {
  const completedSet = new Set(completedDays);
  const today = new Date().toISOString().split("T")[0];

  const days: string[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 8,
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-text)",
          }}>
            Your Mindfulness Journey
          </p>
          <p style={{
            fontFamily: "var(--font)",
            fontWeight: 400,
            fontSize: 13,
            color: "var(--color-muted)",
            marginTop: 4,
          }}>
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
        }}>
          Consistency is clarity
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6,
      }}>
        {days.map((day) => {
          const isToday = day === today;
          const isDone = completedSet.has(day);
          const isActive = isDone;

          return (
            <div
              key={day}
              title={day}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                background: isActive
                  ? "var(--color-secondary)"
                  : "rgba(228,226,225,0.4)",
                boxShadow: isActive && isToday
                  ? "0 10px 20px rgba(62,103,75,0.3)"
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 300ms",
              }}
            >
              {isActive && (
                <span
                  className="material-symbols-filled"
                  style={{
                    fontSize: 12,
                    color: "var(--color-on-secondary)",
                  }}
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
        fontWeight: 400,
        fontSize: 13,
        color: "var(--color-muted)",
      }}>
        Take it one breath at a time. No pressure, just presence.
      </p>
    </div>
  );
}
