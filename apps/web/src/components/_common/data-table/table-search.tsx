"use client";

import { SearchIcon } from "lucide-react";
import { useId } from "react";
import { Input } from "@/components/_ui/input";
import { cn } from "@/lib/utils";

type TableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function TableSearch({
  value,
  onChange,
  label,
  placeholder = "Search…",
  disabled,
  className,
}: TableSearchProps) {
  const id = useId();

  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 pl-8"
      />
    </div>
  );
}
