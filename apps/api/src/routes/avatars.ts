import { AVATAR_MAX_BYTES, isAvatarType } from "@block-builder/shared/avatar";
import { Hono } from "hono";
import { auth } from "../auth";
import {
  avatarImageUrl,
  avatarKeyFromImage,
  newAvatarKey,
} from "../lib/avatar";
import { storage } from "../lib/storage";
import { type AuthEnv, requireAuth } from "../middleware/require-auth";

export const avatars = new Hono<AuthEnv>()
  .get("/:userId/:file", async (c) => {
    const { userId, file } = c.req.param();
    const object = await storage.get(`avatars/${userId}/${file}`);
    if (!object) return c.notFound();
    return c.body(object.body, 200, {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": object.contentType,
    });
  })
  .put("/", requireAuth(), async (c) => {
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !isAvatarType(file.type)) {
      return c.json({ message: "Upload a PNG, JPEG or WebP image." }, 400);
    }
    if (file.size > AVATAR_MAX_BYTES) {
      return c.json({ message: "Keep the image under 1 MB." }, 400);
    }
    const user = c.get("user");
    const key = newAvatarKey(user.id, file.type);
    await storage.put(key, new Uint8Array(await file.arrayBuffer()), file.type);
    await replaceImage(c.req.raw.headers, user.image, avatarImageUrl(key));
    return c.json({ image: avatarImageUrl(key) });
  })
  .delete("/", requireAuth(), async (c) => {
    await replaceImage(c.req.raw.headers, c.get("user").image, null);
    return c.json({ image: null });
  });

async function replaceImage(
  headers: Headers,
  previous: string | null | undefined,
  image: string | null,
) {
  await auth.api.updateUser({ body: { image }, headers });
  const key = avatarKeyFromImage(previous);
  if (key) await storage.delete(key).catch(() => undefined);
}
