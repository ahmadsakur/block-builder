"use client";

import {
  EllipsisIcon,
  PencilIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { createContext, useContext } from "react";
import { Button } from "@/components/_ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import type { PlanRow } from "../../../../_shared/types/plans.types";

type PlanRowActions = {
  onDelete: (plan: PlanRow) => void;
  onEdit: (plan: PlanRow) => void;
};

export const RowActionsContext = createContext<PlanRowActions | null>(null);

export default function PlanRowActionsMenu({ plan }: { plan: PlanRow }) {
  const actions = useContext(RowActionsContext);
  if (!actions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${plan.name}`}
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-44">
        <DropdownMenuItem
          render={<Link href={`/back-office/plans/${plan.id}`} />}
        >
          <ShieldCheckIcon />
          Edit permissions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.onEdit(plan)}>
          <PencilIcon />
          Edit details
        </DropdownMenuItem>
        {!plan.isDefault && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => actions.onDelete(plan)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
