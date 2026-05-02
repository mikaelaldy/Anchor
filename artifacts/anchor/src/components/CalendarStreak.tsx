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
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
          fontSize: 13,
          color: "#A89F97",
          marginBottom: 12,
        }}
      >
        Your last 28 days
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 28px)",
          gap: 4,
        }}
      >
        {days.map((day) => {
          const isToday = day === today;
          const isDone = completedSet.has(day);
          return (
            <div
              key={day}
              title={day}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: isToday
                  ? "#4A7C59"
                  : isDone
                  ? "#1A1A1A"
                  : "rgba(26,26,26,0.08)",
                transition: "background 200ms",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
