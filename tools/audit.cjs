/* Layout audit: overflow, overlapping siblings, clipped text, off-canvas
   elements — every section, every breakpoint. */
const { chromium } = require('playwright');
const path = require('node:path');
const SIZES = [[360,740],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]];
(async () => {
  const file = process.argv[2] || 'design/nur/index.html';
  const b = await chromium.launch();
  let total = 0;
  for (const [w, h] of SIZES) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage();
    await p.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
    await p.waitForTimeout(1400);
    await p.evaluate(async () => {
      // walk the page so every section lays out and plays
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) {
        scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
      }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 200));
    });
    const issues = await p.evaluate(() => {
      const out = [];
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== 'hidden'; };
      const de = document.documentElement;
      if (de.scrollWidth - de.clientWidth > 1) out.push(`page scrolls sideways by ${de.scrollWidth - de.clientWidth}px`);
      document.querySelectorAll('section, footer, .beat, .card, .tip, .wish, .run').forEach(sec => {
        const name = sec.id || (sec.className || '').split(' ').slice(0, 2).join('.');
        if (sec.scrollWidth > sec.clientWidth + 2 && getComputedStyle(sec).overflowX === 'visible')
          out.push(`${name}: content wider than box by ${sec.scrollWidth - sec.clientWidth}px`);
      });
      // stacked siblings that overlap each other vertically
      document.querySelectorAll('#rsvp-form fieldset:not([hidden]), .tips, .wishes, .hosts, .cd, .split__grid, .spread .beat__body').forEach(par => {
        const kids = [...par.children].filter(vis);
        const rows = {};
        kids.forEach(k => { const r = k.getBoundingClientRect(); (rows[Math.round(r.left)] = rows[Math.round(r.left)] || []).push([k, r]); });
        Object.values(rows).forEach(col => {
          col.sort((a, c) => a[1].top - c[1].top);
          for (let i = 1; i < col.length; i++)
            if (col[i][1].top < col[i - 1][1].bottom - 3)
              out.push(`${(par.className||'').split(' ')[0]}: "${(col[i][0].textContent||'').trim().slice(0,18)}" overlaps the one above`);
        });
      });
      // text wider than the box it sits in
      document.querySelectorAll('h1,h2,h3,.card__title,.beat__title,.split__h,.cd__num,.foot__names').forEach(t => {
        if (vis(t) && t.scrollWidth > t.clientWidth + 2)
          out.push(`text clipped: "${(t.textContent||'').trim().slice(0,22)}"`);
      });
      return [...new Set(out)];
    });
    total += issues.length;
    console.log(`${String(w).padStart(4)}x${h}  ${issues.length ? issues.length + ' issue(s)' : 'clean'}`);
    issues.slice(0, 6).forEach(i => console.log('        - ' + i));
    await p.close();
  }
  console.log(total ? `\n${total} issue(s) total` : '\nall breakpoints clean');
  await b.close();
})();
