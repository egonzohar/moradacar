import React from "react";
import { db } from "@/db";
import {
  safetyTipsPosts,
  driverApplications,
  type SafetyTipPost,
  type DriverApplication,
} from "@/db/schema";
import { ensureDbReady } from "@/lib/db-init";
import { desc } from "drizzle-orm";
import { LandingPageClient } from "@/components/LandingPageClient";
import { INITIAL_SAFETY_TIPS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: SafetyTipPost[] = [];
  let drivers: DriverApplication[] = [];

  try {
    await ensureDbReady();
    posts = await db
      .select()
      .from(safetyTipsPosts)
      .orderBy(desc(safetyTipsPosts.helpfulCount), desc(safetyTipsPosts.id));

    drivers = await db
      .select()
      .from(driverApplications)
      .orderBy(desc(driverApplications.createdAt))
      .limit(10);
  } catch (err) {
    console.error("Fallback to initial seed data during build/startup:", err);
    posts = INITIAL_SAFETY_TIPS.map((item, idx) => ({
      id: idx + 1,
      ...item,
      createdAt: new Date(),
    }));
  }

  return <LandingPageClient initialPosts={posts} initialDrivers={drivers} />;
}

