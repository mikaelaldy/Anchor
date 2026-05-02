import { Router, type IRouter, type Request, type Response } from "express";
import { db, streakDaysTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/streak", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select({ day: streakDaysTable.day })
    .from(streakDaysTable)
    .where(eq(streakDaysTable.userId, req.user.id));
  res.json({ days: rows.map((r) => r.day) });
});

router.post("/streak/record", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const today = new Date().toISOString().split("T")[0];
  await db
    .insert(streakDaysTable)
    .values({ userId: req.user.id, day: today })
    .onConflictDoNothing();
  const rows = await db
    .select({ day: streakDaysTable.day })
    .from(streakDaysTable)
    .where(eq(streakDaysTable.userId, req.user.id));
  res.json({ days: rows.map((r) => r.day) });
});

export default router;
