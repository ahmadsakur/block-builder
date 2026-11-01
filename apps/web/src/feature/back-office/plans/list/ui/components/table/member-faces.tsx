import { PersonAvatar } from "@/components/dashboardblocks/team";
import { pluralize } from "../../../../_shared/logic/plans.logic";
import type { PlanRow } from "../../../../_shared/types/plans.types";
import { othersLabel } from "../../../logic/plan-list.logic";

export default function MemberFaces({ plan }: { plan: PlanRow }) {
  if (plan.members === 0) {
    return <span className="text-muted-foreground text-xs">Nobody yet</span>;
  }

  const others = othersLabel(plan);

  return (
    <ul
      aria-label={`${pluralize(plan.members, "user")} on ${plan.name}`}
      className="flex -space-x-2"
    >
      {plan.faces.map((face) => (
        <li key={face.id} className="flex" title={face.name}>
          <PersonAvatar
            className="ring-background ring-2"
            person={{ avatar: face.avatarUrl, name: face.name }}
          />
          <span className="sr-only">{face.name}</span>
        </li>
      ))}
      {others && (
        <li
          aria-hidden
          className="bg-muted text-foreground ring-background relative flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums ring-2"
        >
          {others}
        </li>
      )}
    </ul>
  );
}
