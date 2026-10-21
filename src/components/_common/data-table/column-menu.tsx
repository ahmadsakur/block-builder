"use client";

import type { RowData } from "@tanstack/react-table";
import { Columns3Icon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import {
  type DataTableInstance,
  getColumnLabel,
} from "@/components/dashboardblocks/data-table";

type ColumnMenuProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  disabled?: boolean;
};

export default function ColumnMenu<TData extends RowData>({
  table,
  disabled,
}: ColumnMenuProps<TData>) {
  "use no memo";
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.accessorFn !== undefined && column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={<Button variant="outline" size="sm" />}
      >
        <Columns3Icon className="text-muted-foreground" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto min-w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
            >
              {getColumnLabel(column)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
