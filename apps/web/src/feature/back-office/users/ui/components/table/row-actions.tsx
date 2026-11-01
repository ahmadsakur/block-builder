"use client";

import { ArrowRightLeftIcon, EllipsisIcon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import type { ManagedUser } from "../../../types/users.types";
import { useUserTable } from "./user-table-context";

export default function RowActions({ user }: { user: ManagedUser }) {
  const table = useUserTable();
  if (!table) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${user.name}`}
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => table.onChangePlan(user)}>
          <ArrowRightLeftIcon />
          Change plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
