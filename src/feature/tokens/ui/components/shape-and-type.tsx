import { Button } from "@/components/_ui/button";
import { BUTTON_VARIANTS, RADII } from "../../data/tokens.data";
import TokenSection from "./token-section";

export default function ShapeAndType() {
  return (
    <>
      <TokenSection title="Radius">
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col items-center gap-1.5 text-xs">
              <div
                className="size-14 border-2 border-primary bg-muted"
                style={{ borderRadius: `var(--radius-${r})` }}
              />
              <span className="font-mono text-muted-foreground">{r}</span>
            </div>
          ))}
        </div>
      </TokenSection>
      <TokenSection title="Type">
        <p className="font-heading text-xl font-semibold">
          Heading: The quick brown fox
        </p>
        <p className="font-sans">Sans: The quick brown fox jumps over</p>
        <p className="font-mono text-sm">Mono: const answer = 42;</p>
      </TokenSection>
      <TokenSection title="Button">
        <div className="flex flex-wrap gap-2">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </TokenSection>
    </>
  );
}
