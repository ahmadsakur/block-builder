import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { env } from "@/env";

// Dev-only preview of every design token. Use it while tuning globals.css.

export const metadata: Metadata = { title: "Design tokens" };

const colorPairs = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "background"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
] as const;

const singleColors = [
  "border",
  "input",
  "ring",
  "sidebar-border",
  "sidebar-ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

const radii = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

export default function TokensPage() {
  if (env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 p-8">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Design tokens</h1>
        <ThemeToggle />
      </header>

      <Section title="Color pairs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colorPairs.map(([bg, fg]) => (
            <div
              key={bg}
              className="flex h-20 flex-col justify-end rounded-lg border p-3 text-sm"
              style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
            >
              <span className="font-medium">{bg}</span>
              <span className="font-mono text-xs opacity-80">{fg}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lines, focus, charts">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {singleColors.map((name) => (
            <div key={name} className="flex flex-col gap-1.5 text-xs">
              <div
                className="h-10 rounded-md border"
                style={{ background: `var(--${name})` }}
              />
              <span className="font-mono text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-4">
          {radii.map((r) => (
            <div key={r} className="flex flex-col items-center gap-1.5 text-xs">
              <div
                className="size-14 border-2 border-primary bg-muted"
                style={{ borderRadius: `var(--radius-${r})` }}
              />
              <span className="font-mono text-muted-foreground">{r}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type">
        <p className="font-heading text-xl font-semibold">
          Heading: The quick brown fox
        </p>
        <p className="font-sans">Sans: The quick brown fox jumps over</p>
        <p className="font-mono text-sm">Mono: const answer = 42;</p>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap gap-2">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
