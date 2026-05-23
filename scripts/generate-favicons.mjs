import sharp from "sharp";
import { unlink } from "fs/promises";

const logo = "public/logo.png";
const bg = { r: 0, g: 0, b: 0, alpha: 1 };

async function writeIcon(out, size) {
  await sharp(logo)
    .resize(size, size, { fit: "contain", background: bg })
    .png()
    .toFile(out);
}

await writeIcon("app/icon.png", 32);
await writeIcon("app/apple-icon.png", 180);
await writeIcon("public/favicon.png", 32);
await writeIcon("public/apple-touch-icon.png", 180);

// Remove default Next/Vercel favicon so app/icon.png is used
try {
  await unlink("app/favicon.ico");
} catch {
  /* already removed */
}

console.log("Favicons generated from logo.png");
