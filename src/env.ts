import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Single source of truth for env vars. Validated when next.config.ts loads,
// so `next dev` / `next build` fail fast on a bad env.
// Add every new var here and to .env.example. Read through `env`, never `process.env`.
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  // Client and shared vars must be listed by full name so Next can inline them.
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  // Escape hatch for builds without a real env (e.g. Docker image builds).
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
