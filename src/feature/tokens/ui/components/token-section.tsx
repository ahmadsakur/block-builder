import type { ReactNode } from "react";

type TokenSectionProps = {
  title: string;
  children: ReactNode;
};

export default function TokenSection({ title, children }: TokenSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
