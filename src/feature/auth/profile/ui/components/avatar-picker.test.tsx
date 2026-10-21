import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import AvatarPicker from "./avatar-picker";

function renderPicker(props: Partial<Parameters<typeof AvatarPicker>[0]> = {}) {
  const onSelect = vi.fn();
  const onRemove = vi.fn();
  render(
    <AvatarPicker
      name="Jane Doe"
      uploading={false}
      removing={false}
      onSelect={onSelect}
      onRemove={onRemove}
      {...props}
    />,
  );
  return { onRemove, onSelect };
}

test("the avatar itself picks a photo", async () => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  const user = userEvent.setup();
  const { onSelect } = renderPicker();
  expect(screen.getByRole("button", { name: "Upload photo" })).toBeEnabled();
  const file = new File(["png"], "me.png", { type: "image/png" });
  await user.upload(screen.getByTestId("avatar-input"), file);
  expect(onSelect).toHaveBeenCalledWith(file);
});

test("Remove shows only when there is a photo", async () => {
  const user = userEvent.setup();
  const { onRemove } = renderPicker({ avatarUrl: "https://img/me.webp" });
  expect(screen.getByRole("button", { name: "Change photo" })).toBeEnabled();
  await user.click(screen.getByRole("button", { name: "Remove photo" }));
  expect(onRemove).toHaveBeenCalled();
});

test("no Remove without a photo", () => {
  renderPicker();
  expect(screen.queryByRole("button", { name: "Remove photo" })).toBeNull();
});

test("locks while uploading", () => {
  renderPicker({ avatarUrl: "https://img/me.webp", uploading: true });
  expect(screen.getByRole("button", { name: "Change photo" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: "Remove photo" })).toBeNull();
});
