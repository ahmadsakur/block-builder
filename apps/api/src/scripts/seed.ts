import { and, eq, ne } from "drizzle-orm";
import { db } from "../db/client";
import { user } from "../db/schema";
import { env } from "../env";
import { storage } from "../lib/storage";
import { auth } from "../modules/auth/auth";

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

await storage.init();
await seedRoot();
process.exit(0);
