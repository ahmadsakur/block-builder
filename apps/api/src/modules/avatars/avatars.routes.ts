import { AVATAR_MAX_BYTES, isAvatarType } from "@block-builder/shared/avatar";
import { Hono } from "hono";
import { auth } from "../auth/auth";
import { type AuthEnv, requireAuth } from "../auth/auth.middleware";
import { deleteAvatarFile, readAvatar, storeAvatar } from "./avatars.service";

export const avatars = new Hono<AuthEnv>()
  .get("/:userId/:file", async (c) => {
    const { userId, file } = c.req.param();
    const object = await readAvatar(userId, file);
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
    const image = await storeAvatar(
      user.id,
      file.type,
      new Uint8Array(await file.arrayBuffer()),
    );
    await replaceImage(c.req.raw.headers, user.image, image);
    return c.json({ image });
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
  await deleteAvatarFile(previous).catch(() => undefined);
}
