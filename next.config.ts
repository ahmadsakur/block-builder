import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  redirects: async () => [
    {
      destination: "/reset-password?token=:code",
      has: [{ key: "code", type: "query", value: "(?<code>.+)" }],
      missing: [{ key: "token", type: "query" }],
      permanent: false,
      source: "/reset-password",
    },
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
