import { COLOR_PAIRS, SINGLE_COLORS } from "../../data/tokens.data";
import TokenSection from "./token-section";

export default function ColorTokens() {
  return (
    <>
      <TokenSection title="Color pairs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COLOR_PAIRS.map(([bg, fg]) => (
            <div
              key={bg}
              className="flex h-20 flex-col justify-end rounded-lg border p-3 text-sm"
              style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
            >
              <span className="font-medium">{bg}</span>
              <span className="font-mono text-xs opacity-80">{fg}</span>
            </div>
          ))}
        </div>
      </TokenSection>
      <TokenSection title="Lines, focus, charts">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {SINGLE_COLORS.map((name) => (
            <div key={name} className="flex flex-col gap-1.5 text-xs">
              <div
                className="h-10 rounded-md border"
                style={{ background: `var(--${name})` }}
              />
              <span className="font-mono text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </TokenSection>
    </>
  );
}
