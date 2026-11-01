import { getAvatarColor, getInitials } from "@/components/dashboardblocks/team";
import { cn } from "@/lib/utils";
import type { Plan } from "../types/plans.types";

type PlanMarkProps = {
  className?: string;
  plan: Pick<Plan, "name">;
};

export default function PlanMark({ className, plan }: PlanMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium",
        getAvatarColor(plan.name),
        className,
      )}
    >
      {getInitials(plan.name)}
    </span>
  );
}
