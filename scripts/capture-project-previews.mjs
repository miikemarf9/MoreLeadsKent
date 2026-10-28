// Generate genuine screenshots of the three public sites for the portfolio.
// Committed WebP files remain fallbacks if an external site cannot be reached.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const outDir = resolve('dist/assets');
await mkdir(outDir, { recursive: true });
const previews = [
  { name: 'Grab&Book', url: 'https://grabandbook.com/', file: 'grabandbook.webp', wait: 3000 },
  { name: 'Transform My Room', url: 'https://transformmyroom.com/', file: 'transform-my-room.webp', wait: 6800 },
  { name: 'Foxborough Furniture', url: 'https://foxboroughfurniture.com/', file: 'foxborough-current.webp', wait: 4800 }
];
const browser = await chromium.launch({ headless: true });
let captured = 0;

try {
  for (const preview of previews) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce'
    });
    try {
      const response = await page.goto(preview.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (!response || response.status() >= 400) throw new Error('HTTP ' + (response?.status() ?? 'no response'));
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 14000 }).catch(() => {});
      await page.waitForTimeout(preview.wait);
      const image = await page.screenshot({ type: 'png', fullPage: false, animations: 'disabled', timeout: 20000 });
      await sharp(image).resize(1440, 900, { fit: 'cover', position: 'north' })
        .webp({ quality: 79, effort: 5 }).toFile(join(outDir, preview.file));
      console.log('SCREENSHOT OK: ' + preview.name + ' from ' + preview.url + ' -> ' + preview.file);
      captured++;
    } catch (error) {
      console.warn('SCREENSHOT FALLBACK: ' + preview.name + ': ' + error.message);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log('Fresh screenshots created: ' + captured + '/' + previews.length);
