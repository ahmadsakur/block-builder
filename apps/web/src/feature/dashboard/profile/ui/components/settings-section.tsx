import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  tone?: "default" | "destructive";
};

export default function SettingsSection({
  title,
  description,
  children,
  tone = "default",
}: SettingsSectionProps) {
  return (
    <section className="grid gap-6 border-t pt-8 md:grid-cols-[16rem_1fr] md:gap-10">
      <div className="flex flex-col gap-1">
        <h2
          className={cn(
            "font-medium",
            tone === "destructive" && "text-destructive",
          )}
        >
          {title}
        </h2>
        <p className="text-muted-foreground text-sm text-pretty">
          {description}
        </p>
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}
