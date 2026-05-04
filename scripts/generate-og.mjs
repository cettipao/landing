// Generates public/og-image.png (1200x630) from an inline SVG.
// Run with: pnpm og
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "og-image.png");

// Use platform fonts librsvg/Pango can find. On Windows: Segoe UI + Consolas.
// On Linux CI (deploy): DejaVu Sans + DejaVu Sans Mono. Both render cleanly.
const SANS = "Segoe UI, Inter, DejaVu Sans, Arial, Helvetica, sans-serif";
const MONO = "Consolas, DejaVu Sans Mono, Menlo, monospace";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.5"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <g transform="translate(80, 90)">
    <text x="0" y="0"
          font-family="${MONO}"
          font-size="32"
          font-weight="500"
          fill="#3b82f6"
          dominant-baseline="hanging">// backend &amp; cloud engineer</text>
  </g>

  <g transform="translate(80, 215)">
    <text x="0" y="0"
          font-family="${SANS}"
          font-size="150"
          font-weight="700"
          fill="#fafafa"
          dominant-baseline="hanging"
          letter-spacing="-5">Paolo Cetti</text>
  </g>

  <g transform="translate(80, 400)">
    <text x="0" y="0"
          font-family="${SANS}"
          font-size="36"
          font-weight="400"
          fill="#a3a3a3"
          dominant-baseline="hanging">Building scalable backends and serverless</text>
    <text x="0" y="50"
          font-family="${SANS}"
          font-size="36"
          font-weight="400"
          fill="#a3a3a3"
          dominant-baseline="hanging">architectures on AWS.</text>
  </g>

  <line x1="80" y1="540" x2="1120" y2="540" stroke="#262626" stroke-width="1"/>
  <g transform="translate(80, 565)">
    <text x="0" y="0"
          font-family="${MONO}"
          font-size="22"
          font-weight="500"
          fill="#525252"
          dominant-baseline="hanging">paolocetti.com</text>
  </g>

  <g transform="translate(1040, 90)">
    <text x="0" y="0"
          font-family="${MONO}"
          font-size="56"
          font-weight="700"
          dominant-baseline="hanging">
      <tspan fill="#3b82f6">pc</tspan><tspan fill="#fafafa">.</tspan>
    </text>
  </g>
</svg>
`.trim();

const buffer = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(out, buffer);
console.log(`OK — wrote ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
