"use client";

import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { createContext, useContext } from "react";
import { Button } from "@/components/_ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import type { Customer } from "../../../types/customers.types";

type CustomerActions = {
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
};

const CustomerActionsContext = createContext<CustomerActions | null>(null);

export const CustomerActionsProvider = CustomerActionsContext.Provider;

export default function RowActions({ customer }: { customer: Customer }) {
  const actions = useContext(CustomerActionsContext);
  if (!actions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${customer.company}`}
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem onClick={() => actions.onEdit(customer)}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => actions.onDelete(customer)}
        >
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
