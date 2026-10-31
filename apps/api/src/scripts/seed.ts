import { and, eq, ne } from "drizzle-orm";
import { db } from "../db/client";
import { project, user } from "../db/schema";
import { env } from "../env";
import { storage } from "../lib/storage";
import { auth } from "../modules/auth/auth";
import { seedPlans } from "../modules/plans/plans.service";

async function seedRoot() {
  const { ROOT_EMAIL, ROOT_NAME, ROOT_PASSWORD } = env;
  if (!ROOT_EMAIL || !ROOT_PASSWORD) {
    console.warn(
      "ROOT_EMAIL or ROOT_PASSWORD missing, skipping the root user.",
    );
    return;
  }
  const email = ROOT_EMAIL.toLowerCase();
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (existing && existing.role !== "root") {
    throw new Error(
      `${email} already belongs to a regular user. Delete that user or pick another ROOT_EMAIL.`,
    );
  }
  if (!existing) {
    await auth.api.createUser({
      body: {
        email,
        name: ROOT_NAME,
        password: ROOT_PASSWORD,
        role: "root",
        data: { emailVerified: true },
      },
    });
    console.info(`Created root user ${email}.`);
  }
  const demoted = await db
    .update(user)
    .set({ role: "user" })
    .where(and(eq(user.role, "root"), ne(user.email, email)))
    .returning({ email: user.email });
  for (const row of demoted) console.info(`Demoted ${row.email} to user.`);
}

const DEMO_USERS = [
  {
    email: "free@demo.local",
    name: "Free Demo",
    plan: "free",
    projects: ["Landing page", "Blog"],
  },
  {
    email: "pro@demo.local",
    name: "Pro Demo",
    plan: "pro",
    projects: ["Storefront", "Docs site", "Mobile app", "Status page"],
  },
] as const;

async function seedDemoUsers() {
  if (!env.SEED_DEMO_USERS) return;
  for (const demo of DEMO_USERS) {
    const existing = await db.query.user.findFirst({
      where: eq(user.email, demo.email),
    });
    if (existing) continue;
    const { user: created } = await auth.api.createUser({
      body: {
        email: demo.email,
        name: demo.name,
        password: env.DEMO_PASSWORD,
        role: "user",
        data: { emailVerified: true },
      },
    });
    await db
      .update(user)
      .set({ plan: demo.plan })
      .where(eq(user.id, created.id));
    await db
      .insert(project)
      .values(demo.projects.map((name) => ({ name, userId: created.id })));
    console.info(`Created demo user ${demo.email} on ${demo.plan}.`);
  }
}

await storage.init();
await seedPlans();
await seedRoot();
await seedDemoUsers();
process.exit(0);
