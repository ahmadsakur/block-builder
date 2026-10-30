import { LayoutDashboardIcon } from "lucide-react";
import EmptyState from "@/components/_common/empty-state";

export default function HomeContainer() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        <p className="text-muted-foreground text-sm">
          Your workspace at a glance.
        </p>
      </header>
      <EmptyState
        bordered
        icon={<LayoutDashboardIcon />}
        title="Nothing here yet"
        description="Your dashboard fills in as you start using the app."
      />
    </>
  );
}
