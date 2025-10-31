// export async function getCroppedImg(
//   imageSrc: string,
//   pixelCrop: { x: number; y: number; width: number; height: number }
// ): Promise<string> {
//   const image: HTMLImageElement = await new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = imageSrc;
//     img.crossOrigin = "anonymous"; // important for CORS
//     img.onload = () => resolve(img);
//     img.onerror = (err) => reject(err);
//   });

//   const canvas = document.createElement("canvas");
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;
//   const ctx = canvas.getContext("2d");
//   if (!ctx) throw new Error("No 2d context");

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       if (!blob) return;
//       const fileUrl = URL.createObjectURL(blob);
//       resolve(fileUrl);
//     }, "image/jpeg");
//   });
// }
// utils/getCroppedImg.ts
export type CropRect = { x: number; y: number; width: number; height: number };

function inferMimeFromSrc(src: string): string | null {
  if (src.startsWith("data:")) {
    const m = /^data:([^;]+);/i.exec(src);
    return m ? m[1] : null;
  }
  // blob:/http(s): unknown — let caller specify or fallback later
  return null;
}

function extFromMime(mime: string) {
  if (/png/i.test(mime)) return "png";
  if (/webp/i.test(mime)) return "webp";
  if (/gif/i.test(mime)) return "gif";
  return "jpg";
}

/**
 * Crop an image and return a File + URL.
 * - Preserves the original mime when possible (e.g., PNG stays PNG).
 * - Falls back to JPEG if the mime can’t be inferred.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropRect,
  opts?: {
    /** e.g. "image/png". If omitted, tries to keep the original, else falls back to "image/jpeg". */
    mime?: string;
    /** 0..1 for JPEG/WEBP quality. Ignored for PNG/GIF. Default 0.92 */
    quality?: number;
    /** filename without extension; default "crop" */
    fileName?: string;
  }
): Promise<{ file: File; url: string; mime: string; blob: Blob }> {
  const quality = opts?.quality ?? 0.92;
  const hintedMime = opts?.mime ?? inferMimeFromSrc(imageSrc) ?? "image/jpeg";
  const fileName = (opts?.fileName ?? "crop") + "." + extFromMime(hintedMime);

  // Load the image
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // keep CORS safe for toBlob
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  // Prepare canvas
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  // Draw the cropped region
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Canvas → Blob (with Safari fallback)
  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob(
      (b) => {
        if (b) return resolve(b);
        // Fallback path if toBlob returns null
        const dataUrl = canvas.toDataURL(hintedMime, quality);
        const base64 = dataUrl.split(",")[1];
        const bin = atob(base64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        resolve(new Blob([arr], { type: hintedMime }));
      },
      hintedMime,
      quality
    );
  });

  const file = new File([blob], fileName, { type: blob.type || hintedMime });
  const url = URL.createObjectURL(blob);

  return { file, url, mime: file.type, blob };
}
