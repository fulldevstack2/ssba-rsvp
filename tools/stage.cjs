/* Screenshot inside a pinned stage at given fractions of its track.
   node tools/stage.cjs <file> <outPrefix> <selector> <f1,f2,...> [w] [h] */
const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const [,, file, out, sel, fracs, w = '1440', h = '900'] = process.argv;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  for (const f of fracs.split(',')) {
    const info = await page.evaluate(([s, frac]) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + scrollY;
      const travel = el.offsetHeight - innerHeight;
      scrollTo(0, Math.round(top + travel * parseFloat(frac)));
      return { travel, h: el.offsetHeight };
    }, [sel, f]);
    if (!info) { console.log('  selector not found:', sel); break; }
    await page.waitForTimeout(650);
    const pin = await page.evaluate((s) => {
      const p = document.querySelector(s + ' [data-stage-pin]');
      return p ? { p: getComputedStyle(p).getPropertyValue('--p').trim(), cut: p.getAttribute('data-cut') } : null;
    }, sel);
    const f2 = `${out}-${String(f).replace('.', '')}.png`;
    await page.screenshot({ path: f2 });
    console.log(`saved ${f2}   --p=${pin && pin.p}  cut=${pin && pin.cut}`);
  }
  if (errs.length) console.log('ERRORS:', errs.slice(0, 3).join(' | '));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
