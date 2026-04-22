/**
 * Generates PWA icon PNG files using only Node.js built-ins (zlib).
 * Creates: icon-192x192.png, icon-512x512.png, apple-touch-icon.png (180x180)
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// CRC32 table for PNG chunk checksums
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

// Colors
const GREEN  = [45, 106, 79];   // #2D6A4F
const CREAM  = [247, 243, 236]; // #F7F3EC
const GOLD   = [180, 130, 30];  // wheat/gold
const LGREEN = [88, 157, 120];  // lighter green for detail

function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function drawIcon(size) {
  const px = new Uint8Array(size * size * 3);
  const W = size, H = size;
  const cx = W / 2, cy = H / 2;
  const R = W / 2;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const i = (y * W + x) * 3;

      // Normalized coordinates [-1, 1]
      const nx = dx / R, ny = dy / R;

      // Default: green background
      let c = GREEN;

      // Outer ring (> 0.88): darker border
      if (dist > R * 0.88) {
        c = lerp(GREEN, [20, 70, 50], (dist - R * 0.88) / (R * 0.12));
      }

      // Inner cream circle (< 0.75)
      if (dist < R * 0.75) {
        c = CREAM;

        // --- Wheat stalk: vertical bar ---
        const stalkW = R * 0.075;
        if (Math.abs(dx) < stalkW && ny > -0.55 && ny < 0.55) {
          c = GOLD;
        }

        // --- Wheat head: oval at top ---
        const headCY = -0.22;
        const headRX = 0.2, headRY = 0.28;
        const headDist = (nx / headRX) ** 2 + ((ny - headCY) / headRY) ** 2;
        if (headDist < 1 && ny < 0.05) {
          c = GOLD;
        }

        // --- Left leaf ---
        const l1x = nx + 0.22, l1y = ny + 0.08;
        if ((l1x / 0.18) ** 2 + (l1y / 0.12) ** 2 < 1 && nx < -0.04) {
          c = LGREEN;
        }

        // --- Right leaf ---
        const r1x = nx - 0.22, r1y = ny + 0.08;
        if ((r1x / 0.18) ** 2 + (r1y / 0.12) ** 2 < 1 && nx > 0.04) {
          c = LGREEN;
        }

        // --- Ground line ---
        if (Math.abs(ny - 0.38) < 0.04 && Math.abs(nx) < 0.55) {
          c = LGREEN;
        }

        // --- Three small soil bumps below ground ---
        for (const bx of [-0.25, 0, 0.25]) {
          const bdx = nx - bx, bdy = ny - 0.44;
          if ((bdx / 0.13) ** 2 + (bdy / 0.07) ** 2 < 1) {
            c = LGREEN;
          }
        }

        // --- Green ring outline around cream area ---
        if (dist > R * 0.72 && dist < R * 0.75) {
          c = GREEN;
        }
      }

      px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
    }
  }

  // Build raw PNG scanlines (filter byte 0 = None per row)
  const raw = new Uint8Array(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    for (let x = 0; x < W; x++) {
      const s = (y * W + x) * 3;
      const d = y * (1 + W * 3) + 1 + x * 3;
      raw[d] = px[s]; raw[d + 1] = px[s + 1]; raw[d + 2] = px[s + 2];
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(raw), { level: 9 });

  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(W, 0); ihdrData.writeUInt32BE(H, 4);
  ihdrData[8] = 8; ihdrData[9] = 2; // 8-bit RGB

  return Buffer.concat([sig, chunk('IHDR', ihdrData), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

const publicDir = path.join(__dirname, 'public');
const icons = [
  { name: 'icon-192x192.png',    size: 192 },
  { name: 'icon-512x512.png',    size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of icons) {
  const buf = drawIcon(size);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`✅ ${name} (${size}x${size}) — ${buf.length} bytes`);
}

// masked-icon.svg — simple wheat SVG (monochrome, for Safari pinned tabs)
const maskedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="black"/>
  <rect x="48" y="20" width="4" height="55" fill="white"/>
  <ellipse cx="50" cy="35" rx="14" ry="18" fill="white"/>
  <ellipse cx="34" cy="50" rx="11" ry="8" fill="white"/>
  <ellipse cx="66" cy="50" rx="11" ry="8" fill="white"/>
  <rect x="20" y="72" width="60" height="4" rx="2" fill="white"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedSVG);
console.log('✅ masked-icon.svg');

console.log('\n🎉 All icons generated successfully in public/');
