"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { type ReactNode, useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/_ui/radio-group";
import type { ThemePreference } from "../../types/profile.types";

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}[] = [
  { icon: <SunIcon />, label: "Light", value: "light" },
  { icon: <MoonIcon />, label: "Dark", value: "dark" },
  { icon: <MonitorIcon />, label: "System", value: "system" },
];

type AppearanceSettingsProps = {
  theme?: ThemePreference;
  onChange: (theme: ThemePreference) => void;
};

export default function AppearanceSettings({
  theme,
  onChange,
}: AppearanceSettingsProps) {
  const id = useId();

  return (
    <RadioGroup
      aria-label="Theme"
      value={theme ?? null}
      onValueChange={(value) => onChange(value as ThemePreference)}
      className="grid-cols-3"
    >
      {THEME_OPTIONS.map((option) => (
        <label
          key={option.value}
          htmlFor={`${id}-${option.value}`}
          className="hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5 relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors [&>svg]:size-5"
        >
          <RadioGroupItem
            id={`${id}-${option.value}`}
            value={option.value}
            className="absolute top-2.5 right-2.5"
          />
          {option.icon}
          {option.label}
        </label>
      ))}
    </RadioGroup>
  );
}
