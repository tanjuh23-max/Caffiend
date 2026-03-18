import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';

const DESKTOP = path.join(os.homedir(), 'Desktop');
const URL = 'https://caffiend-one.vercel.app';

const now = Date.now();
const h = 3600000;
const entries = [
  { id: '1', name: 'Espresso', caffeine: 64, volume: 30, timestamp: now - 5.5 * h, emoji: '☕' },
  { id: '2', name: 'Flat White', caffeine: 130, volume: 220, timestamp: now - 3.2 * h, emoji: '☕' },
  { id: '3', name: 'Monster Energy', caffeine: 160, volume: 500, timestamp: now - 1.1 * h, emoji: '🥤' },
];
const settings = { weight: 80, sleepTime: '23:00', caffeineLimit: 400, weightUnit: 'kg' };

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Navigate and inject data
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(({ entries, settings }) => {
    localStorage.setItem('caffiend_entries', JSON.stringify(entries));
    localStorage.setItem('caffiend_settings', JSON.stringify(settings));
  }, { entries, settings });

  // Screenshot 1: Dashboard with gauge
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(DESKTOP, 'caffiend-screenshot-1-dashboard.png'), fullPage: false });
  console.log('✅ Screenshot 1: Dashboard');

  // Screenshot 2: Scroll to curve
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DESKTOP, 'caffiend-screenshot-2-curve.png'), fullPage: false });
  console.log('✅ Screenshot 2: Caffeine Curve');

  // Screenshot 3: History tab
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  // Click History tab
  const historyBtn = await page.$('a[href="/history"], button:has-text("History"), nav a:nth-child(2)');
  if (historyBtn) {
    await historyBtn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.goto(URL + '/history', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(DESKTOP, 'caffiend-screenshot-3-history.png'), fullPage: false });
  console.log('✅ Screenshot 3: History');

  // Screenshot 4: Add drink modal
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const addBtn = await page.$('button:has-text("+"), button[aria-label*="add"], button:has-text("Add")');
  if (addBtn) {
    await addBtn.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(DESKTOP, 'caffiend-screenshot-4-add-drink.png'), fullPage: false });
  console.log('✅ Screenshot 4: Add Drink');

  await browser.close();
  console.log('\n🎉 All screenshots saved to Desktop!');
  console.log('Files:');
  console.log('  caffiend-screenshot-1-dashboard.png');
  console.log('  caffiend-screenshot-2-curve.png');
  console.log('  caffiend-screenshot-3-history.png');
  console.log('  caffiend-screenshot-4-add-drink.png');
}

run().catch(console.error);
