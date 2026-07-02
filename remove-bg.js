const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const INPUT  = path.join(__dirname, 'images', 'Lobna.jpg');
const OUTPUT = path.join(__dirname, 'frontend', 'public', 'lobna.png');

async function removeBg() {
  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const buf = Buffer.from(data);

  // Sample many border pixels for robust BG detection
  const samples = [];
  for (let x = 0; x < width; x += 4) {
    samples.push([x, 0]);
    samples.push([x, height - 1]);
  }
  for (let y = 0; y < height; y += 4) {
    samples.push([0, y]);
    samples.push([width - 1, y]);
  }

  let rSum = 0, gSum = 0, bSum = 0;
  for (const [x, y] of samples) {
    const idx = (y * width + x) * channels;
    rSum += buf[idx]; gSum += buf[idx+1]; bSum += buf[idx+2];
  }
  const bgR = Math.round(rSum / samples.length);
  const bgG = Math.round(gSum / samples.length);
  const bgB = Math.round(bSum / samples.length);
  console.log(`Detected BG color: rgb(${bgR},${bgG},${bgB})`);

  const HARD  = 40;   // fully transparent within this distance
  const SOFT  = 75;   // feather edge up to this distance

  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = buf[idx], g = buf[idx+1], b = buf[idx+2];
    const dist = Math.sqrt((r-bgR)**2 + (g-bgG)**2 + (b-bgB)**2);

    if (dist < HARD) {
      buf[idx+3] = 0;
    } else if (dist < SOFT) {
      buf[idx+3] = Math.round(255 * (dist - HARD) / (SOFT - HARD));
    }
    // else keep alpha=255
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  await sharp(buf, { raw: { width, height, channels } })
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(OUTPUT);

  console.log(`✅ Saved → ${OUTPUT}`);
}

removeBg().catch(e => { console.error('❌', e.message); process.exit(1); });
