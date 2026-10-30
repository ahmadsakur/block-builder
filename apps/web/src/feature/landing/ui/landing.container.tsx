import Link from "next/link";
import ThemeToggle from "@/components/_common/theme-toggle";
import { buttonVariants } from "@/components/_ui/button";

export default function LandingContainer() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        block-builder
      </h1>
      <p className="text-muted-foreground">Sign in to open your dashboard.</p>
      <div className="flex gap-2">
        <Link href="/dashboard" className={buttonVariants()}>
          Open dashboard
        </Link>
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign in
        </Link>
        <ThemeToggle />
      </div>
    </main>
  );
}
