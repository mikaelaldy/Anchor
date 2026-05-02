import { pgTable, text, date, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const streakDaysTable = pgTable(
  "streak_days",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);

export type StreakDay = typeof streakDaysTable.$inferSelect;
