interface Props {
  completedDays: string[];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function CalendarMonth({
  year, month, completedSet, today,
}: {
  year: number;
  month: number;
  completedSet: Set<string>;
  today: string;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: 13,
          color: "var(--color-muted)",
          marginBottom: 8,
          textAlign: "center",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {MONTH_NAMES[month]} {year}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--color-muted)",
              paddingBottom: 4,
              letterSpacing: "0.04em",
            }}
          >
            {d}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }
          const mm = String(month + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const dateStr = `${year}-${mm}-${dd}`;
          const isCompleted = completedSet.has(dateStr);
          const isToday = dateStr === today;

          return (
            <div
              key={dateStr}
              title={dateStr}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: isCompleted
                  ? "var(--color-accent)"
                  : isToday
                  ? "rgba(140,122,107,0.15)"
                  : "transparent",
                outline: isToday && !isCompleted ? "1.5px solid var(--color-accent)" : "none",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: isCompleted ? 600 : 400,
                color: isCompleted
                  ? "#FFFFFF"
                  : isToday
                  ? "var(--color-accent)"
                  : "var(--color-text)",
                transition: "background 200ms",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarStreak({ completedDays }: Props) {
  const completedSet = new Set(completedDays);
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <CalendarMonth
          year={prevYear}
          month={prevMonth}
          completedSet={completedSet}
          today={today}
        />
        <CalendarMonth
          year={thisYear}
          month={thisMonth}
          completedSet={completedSet}
          today={today}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--color-muted)",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--color-accent)",
            marginRight: 6,
            verticalAlign: "middle",
          }}
        />
        session completed
      </p>
    </div>
  );
}
