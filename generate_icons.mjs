import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, 'public', 'logo.png');
const androidRes = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

const sizes = [
  { dir: 'mipmap-ldpi',    size: 36  },
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function generate() {
  for (const { dir, size } of sizes) {
    const destDir = path.join(androidRes, dir);
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, 'ic_launcher.png');
    const destRound = path.join(destDir, 'ic_launcher_round.png');
    await sharp(src).resize(size, size).toFile(dest);
    await sharp(src).resize(size, size).toFile(destRound);
    console.log(`✅ Generated ${dir} (${size}x${size})`);
  }
  console.log('🎉 All Android icons generated!');
}

generate().catch(console.error);
