// Removes the white background from public/images/profile.png and writes
// public/images/profile-cutout.png with a clean alpha channel.
//
//   1. Flood-fill from the borders. Any pixel with R, G and B all above
//      FILL_THRESHOLD is treated as background. The fill stops at the
//      subject; interior near-white areas (the cream t-shirt) are safe
//      because the fill cannot reach them.
//   2. Halo cleanup pass. For every opaque pixel that touches a transparent
//      one, reduce its alpha based on its luminance — this eats the gray
//      anti-aliased edge that the threshold-based fill leaves behind.
//
// Run with: pnpm cutout
//
// IMPORTANT — algorithmic chroma key has limits. If the original photo has
// soft shadows on the white backdrop or the subject color is too close to
// white, this will leave artifacts. The reliable path is to drop the
// original at https://www.remove.bg, save the transparent PNG over
// public/images/profile-cutout.png, and skip this script entirely.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const input = resolve(__dirname, "..", "public", "images", "profile.png");
const output = resolve(__dirname, "..", "public", "images", "profile-cutout.png");

const FILL_THRESHOLD = 240; // R,G,B all above this → background candidate
const HALO_LIGHT = 200;
const HALO_DARK = 110;
const HALO_PASSES = 2;

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = Buffer.from(data);

const lumOf = (idx) =>
  (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;

const isBg = (idx) =>
  pixels[idx] > FILL_THRESHOLD &&
  pixels[idx + 1] > FILL_THRESHOLD &&
  pixels[idx + 2] > FILL_THRESHOLD;

// Pass 1: flood-fill background
const visited = new Uint8Array(width * height);
const queue = [];
const enqueue = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;
  if (!isBg(p * channels)) return;
  visited[p] = 1;
  queue.push([x, y]);
};

for (let x = 0; x < width; x++) {
  enqueue(x, 0);
  enqueue(x, height - 1);
}
for (let y = 0; y < height; y++) {
  enqueue(0, y);
  enqueue(width - 1, y);
}

let erased = 0;
while (queue.length > 0) {
  const [x, y] = queue.pop();
  const idx = (y * width + x) * channels;
  pixels[idx + 3] = 0;
  erased++;
  enqueue(x + 1, y);
  enqueue(x - 1, y);
  enqueue(x, y + 1);
  enqueue(x, y - 1);
}

// Pass 2: halo cleanup
let smoothed = 0;
for (let pass = 0; pass < HALO_PASSES; pass++) {
  const alphaSnapshot = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p++) {
    alphaSnapshot[p] = pixels[p * channels + 3];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const a = alphaSnapshot[p];
      if (a === 0) continue;

      const neighbors = [
        x > 0 ? alphaSnapshot[p - 1] : 255,
        x < width - 1 ? alphaSnapshot[p + 1] : 255,
        y > 0 ? alphaSnapshot[p - width] : 255,
        y < height - 1 ? alphaSnapshot[p + width] : 255,
      ];
      if (Math.min(...neighbors) !== 0) continue;

      const idx = p * channels;
      const lum = lumOf(idx);
      if (lum <= HALO_DARK) continue;

      const t = Math.max(
        0,
        Math.min(1, (lum - HALO_DARK) / (HALO_LIGHT - HALO_DARK)),
      );
      const newAlpha = Math.round(a * (1 - t));
      if (newAlpha < a) {
        pixels[idx + 3] = newAlpha;
        smoothed++;
      }
    }
  }
}

const buffer = await sharp(pixels, { raw: info }).png().toBuffer();
writeFileSync(output, buffer);

const total = width * height;
console.log(
  `OK — wrote ${output} (${(buffer.length / 1024).toFixed(1)} KB)\n` +
    `   ${erased.toLocaleString()} bg pixels erased (${((erased / total) * 100).toFixed(1)}%)\n` +
    `   ${smoothed.toLocaleString()} halo pixels smoothed`,
);
