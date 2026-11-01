import { useTheme } from "next-themes";
import { useCallback } from "react";
import { flushSync } from "react-dom";

export function useThemeTransition() {
  const { setTheme, ...theme } = useTheme();

  const changeTheme = useCallback(
    (next: string) => {
      const calm = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (calm || typeof document.startViewTransition !== "function") {
        setTheme(next);
        return;
      }
      document.startViewTransition(() => flushSync(() => setTheme(next)));
    },
    [setTheme],
  );

  return { ...theme, setTheme: changeTheme };
}
