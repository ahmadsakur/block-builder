export function centerSquare(width: number, height: number) {
  const side = Math.min(width, height);
  return { side, x: (width - side) / 2, y: (height - side) / 2 };
}

export async function squareImage(
  file: Blob,
  size: number,
  type = "image/webp",
  quality = 0.9,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { side, x, y } = centerSquare(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser can't process images.");
  context.drawImage(bitmap, x, y, side, side, 0, 0, size, size);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Couldn't process this image.")),
      type,
      quality,
    );
  });
}
