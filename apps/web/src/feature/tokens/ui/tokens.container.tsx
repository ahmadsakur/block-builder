import ThemeToggle from "@/components/_common/theme-toggle";
import ColorTokens from "./components/color-tokens";
import ShapeAndType from "./components/shape-and-type";

export default function TokensContainer() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 p-8">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Design tokens</h1>
        <ThemeToggle />
      </header>
      <ColorTokens />
      <ShapeAndType />
    </main>
  );
}
