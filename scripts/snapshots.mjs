import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const OUTPUT_DIR = path.resolve('screenshots');

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/videos', name: 'videos' },
  { path: '/lives', name: 'lives' },
  { path: '/teams', name: 'teams' },
  { path: '/schedule', name: 'schedule' },
  { path: '/news', name: 'news' },
  { path: '/carousels', name: 'carousels' },
  { path: '/carousels/novo', name: 'carousels-new' },
  { path: '/banners', name: 'banners' },
  { path: '/customization', name: 'customization' },
  { path: '/ads', name: 'ads' },
  { path: '/analytics', name: 'analytics' },
  { path: '/catalogues', name: 'catalogues' },
  { path: '/catalogues/novo', name: 'catalogues-new' },
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function waitForApp(page) {
  // Wait for body and main content to render
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(400); // small settle time for animations
}

async function run() {
  await ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await waitForApp(page);
      const outPath = path.join(OUTPUT_DIR, `${route.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Saved: ${outPath}`);
    } catch (e) {
      console.warn(`Failed to capture ${url}:`, e.message);
    }
  }

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});



