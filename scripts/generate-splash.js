// Generates solid-color PNG splash screens for iOS PWA (no dependencies)
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// CRC32 lookup table
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const byte of buf) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xFF];
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const lenBuf  = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf  = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Indexed-color PNG: one palette entry → entire image is zeros → compresses to ~50 bytes
function solidPNG(width, height, r, g, b) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 3; // 8-bit indexed color

  const plte = Buffer.from([r, g, b]);

  // Each scanline: filter byte (0) + width index bytes (all 0 = palette entry 0)
  const rowLen = 1 + width;
  const raw    = Buffer.alloc(height * rowLen, 0); // all zeros
  const idat   = deflateSync(raw, { level: 1 });   // fast; zeros compress to ~nothing

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('PLTE', plte),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

// App background color: #F7F3EC
const R = 0xF7, G = 0xF3, B = 0xEC;

const SPLASH_SIZES = [
  { w: 640,  h: 1136, name: 'splash-640x1136.png'  }, // iPhone SE 1st gen
  { w: 750,  h: 1334, name: 'splash-750x1334.png'  }, // iPhone 8 / SE 2nd-3rd gen
  { w: 1125, h: 2436, name: 'splash-1125x2436.png' }, // iPhone X / XS / 11 Pro
  { w: 828,  h: 1792, name: 'splash-828x1792.png'  }, // iPhone XR / 11
  { w: 1242, h: 2688, name: 'splash-1242x2688.png' }, // iPhone XS Max / 11 Pro Max
  { w: 1170, h: 2532, name: 'splash-1170x2532.png' }, // iPhone 12 / 13 / 14
  { w: 1284, h: 2778, name: 'splash-1284x2778.png' }, // iPhone 12/13/14 Pro Max / Plus
  { w: 1179, h: 2556, name: 'splash-1179x2556.png' }, // iPhone 14 Pro
  { w: 1290, h: 2796, name: 'splash-1290x2796.png' }, // iPhone 14 Pro Max / 15 Pro Max
];

const outDir = join(__dirname, '..', 'public');

let generated = 0;
for (const { w, h, name } of SPLASH_SIZES) {
  const filePath = join(outDir, name);
  writeFileSync(filePath, solidPNG(w, h, R, G, B));
  console.log(`  ✓ ${name}  (${w}×${h})`);
  generated++;
}
console.log(`\nGenerated ${generated} splash screens → public/`);
