"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterMenuProps = {
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  allLabel?: string;
  align?: "start" | "end";
  disabled?: boolean;
  className?: string;
};

function summarize(selected: FilterOption[], allLabel: string) {
  if (selected.length === 0) return allLabel;
  if (selected.length === 1) return selected[0].label;
  return `${selected[0].label} +${selected.length - 1}`;
}

function OptionCount({ count }: { count?: number }) {
  if (count === undefined) return null;
  return (
    <span className="ml-auto pl-4 text-xs tabular-nums text-muted-foreground">
      {count}
    </span>
  );
}

export default function FilterMenu({
  label,
  options,
  value,
  onChange,
  multiple = true,
  allLabel = "All",
  align = "end",
  disabled,
  className,
}: FilterMenuProps) {
  const selected = options.filter((option) => value.includes(option.value));
  const active = selected.length > 0;
  const summary = summarize(selected, allLabel);

  const toggle = (option: string, checked: boolean) =>
    onChange(
      checked ? [...value, option] : value.filter((item) => item !== option),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={`${label}: ${summary}`}
        render={
          <Button
            variant="outline"
            size="sm"
            data-active={active}
            className={cn(
              "group gap-0 overflow-hidden px-0 data-[active=true]:border-foreground/25",
              className,
            )}
          />
        }
      >
        <span className="px-2.5 font-normal text-muted-foreground">
          {label}
        </span>
        <span aria-hidden className="h-full w-px bg-border" />
        <span className="flex items-center gap-1.5 px-2.5 font-normal text-muted-foreground group-data-[active=true]:font-medium group-data-[active=true]:text-foreground">
          {summary}
          <ChevronDownIcon
            aria-hidden
            className="size-3.5 text-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-180"
          />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-auto min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {multiple ? (
            options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) => toggle(option.value, checked)}
              >
                {option.label}
                <OptionCount count={option.count} />
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <DropdownMenuRadioGroup
              value={value[0] ?? ""}
              onValueChange={(next) => onChange(next ? [next] : [])}
            >
              <DropdownMenuRadioItem value="">{allLabel}</DropdownMenuRadioItem>
              {options.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                  <OptionCount count={option.count} />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          )}
        </DropdownMenuGroup>
        {multiple && active && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange([])}>
              Clear {label.toLowerCase()}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
