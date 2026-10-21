import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/env";
import TokensContainer from "@/feature/tokens/ui/tokens.container";

export const metadata: Metadata = { title: "Design tokens" };

export default function TokensPage() {
  if (env.NODE_ENV === "production") notFound();
  return <TokensContainer />;
}
