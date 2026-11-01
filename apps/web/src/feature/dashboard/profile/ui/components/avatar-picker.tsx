"use client";

import { Loader2Icon, PencilIcon, XIcon } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "../../logic/profile.logic";
import { AVATAR_TYPES } from "../../types/profile.types";

type AvatarPickerProps = {
  name: string;
  avatarUrl?: string;
  uploading: boolean;
  removing: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export default function AvatarPicker({
  name,
  avatarUrl,
  uploading,
  removing,
  onSelect,
  onRemove,
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const busy = uploading || removing;
  const shown = uploading && preview ? preview : avatarUrl;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    onSelect(file);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        disabled={busy}
        aria-label={avatarUrl ? "Change photo" : "Upload photo"}
        onClick={() => inputRef.current?.click()}
        className="group focus-visible:ring-ring/50 relative block rounded-full outline-none focus-visible:ring-3 disabled:cursor-progress"
      >
        <Avatar className="size-14 text-lg">
          {shown && <AvatarImage src={shown} alt="" />}
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "bg-background/70 text-foreground absolute inset-0 grid place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
            busy && "opacity-100",
          )}
        >
          {busy ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <PencilIcon className="size-4" />
          )}
        </span>
      </button>
      {avatarUrl && !busy && (
        <button
          type="button"
          aria-label="Remove photo"
          onClick={onRemove}
          className="bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute -top-1 -right-1 grid size-5 place-items-center rounded-full border outline-none focus-visible:ring-3"
        >
          <XIcon className="size-3" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_TYPES.join(",")}
        hidden
        data-testid="avatar-input"
        onChange={handleChange}
      />
    </div>
  );
}
