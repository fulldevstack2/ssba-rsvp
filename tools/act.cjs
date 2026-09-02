/* Scroll each act into view, let it play, screenshot. */
const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const [,, file, out, sels, wait = '3400'] = process.argv;
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  for (const sel of sels.split(',')) {
    const ok = await page.evaluate((s) => {
      const el = document.querySelector(s); if (!el) return false;
      el.scrollIntoView({ block: 'center' }); return true;
    }, sel);
    if (!ok) { console.log('  missing', sel); continue; }
    await page.waitForTimeout(+wait);
    const played = await page.evaluate((s) => {
      const el = document.querySelector(s);
      return el.classList.contains('played') || !!el.querySelector('.played');
    }, sel);
    const f = `${out}-${sel.replace(/[^a-z]/gi, '')}.png`;
    await page.screenshot({ path: f });
    console.log(`saved ${f}  played=${played}`);
  }
  if (errs.length) console.log('ERRORS:', errs.slice(0, 3).join(' | '));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
