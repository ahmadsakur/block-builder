import { dylan } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

const cache = new Map<string, string>();

export function fallbackAvatar(seed: string): string {
  const cached = cache.get(seed);
  if (cached) return cached;
  const uri = createAvatar(dylan, { seed }).toDataUri();
  cache.set(seed, uri);
  return uri;
}

export function avatarFor(person: { id: string; avatarUrl?: string | null }) {
  return person.avatarUrl || fallbackAvatar(person.id);
}
