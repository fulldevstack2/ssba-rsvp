/* End-to-end check of the RSVP flow, language switch and calendar, in demo mode. */
const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch();
  const { concepts } = require('../src/concepts.cjs');
  for (const file of concepts.map((c) => `design/${c.id}/index.html`)) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
    await page.goto('file://' + path.resolve(file) + '?to=Keluarga%20Ahmad', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3600);

    const out = [file];
    out.push('  preloader finished: ' + await page.evaluate(() => document.documentElement.classList.contains('ready')));

    // language switch
    await page.click('[data-lang-btn="en"]');
    await page.waitForTimeout(200);
    out.push('  EN nav: ' + (await page.textContent('[data-nav] a[href="#story"]')).trim() +
             ' | events rendered: ' + await page.locator('.card').count() +
             ' | wishes: ' + await page.locator('.wish').count());
    await page.click('[data-lang-btn="ms"]');
    await page.waitForTimeout(200);
    out.push('  BM nav: ' + (await page.textContent('[data-nav] a[href="#story"]')).trim());

    // name should be pre-filled from ?to=
    out.push('  prefill: "' + await page.inputValue('#rsvp-form [name="name"]') + '"');

    // validation must block an empty step
    await page.click('#rsvp-form [data-step="who"] [data-next]');
    await page.waitForTimeout(150);
    const visibleSteps = await page.locator('#rsvp-form fieldset:not([hidden])').count();
    out.push('  blocked on empty phone: ' + (await page.locator('#rsvp-form [data-step="who"]').isVisible()) +
             ' | visible steps: ' + visibleSteps);

    await page.fill('#rsvp-form [name="name"]', 'Keluarga Ahmad');
    await page.fill('#rsvp-form [name="phone"]', '012-345 6789');
    await page.click('#rsvp-form [data-step="who"] [data-next]');
    await page.waitForTimeout(200);

    await page.click('#rsvp-form label.choice:has(input[name="attending"][value="yes"])');
    // must refuse to continue with no event chosen
    await page.click('#rsvp-form [data-step="attend"] [data-next]');
    await page.waitForTimeout(150);
    out.push('  blocked with no event: ' + await page.locator('[data-error-for="events"]').isVisible());

    await page.click('#rsvp-form label.choice:has(input[name="events"][value="akad"])');
    await page.click('#rsvp-form label.choice:has(input[name="events"][value="sabah"])');
    await page.click('#rsvp-form [data-step="attend"] [data-next]');
    await page.waitForTimeout(200);

    await page.click('[data-stepper="adults"][data-delta="1"]');
    await page.click('[data-stepper="children"][data-delta="1"]');
    out.push('  pax: ' + await page.inputValue('[name="adults"]') + ' adults, ' + await page.inputValue('[name="children"]') + ' children');
    await page.fill('[name="dietary"]', 'Alahan kacang');
    await page.fill('[name="message"]', 'Barakallahu lakuma!');
    await page.click('#rsvp-form [data-step="detail"] [data-next]');
    await page.waitForTimeout(250);

    const review = (await page.textContent('[data-review]')).replace(/\s+/g, ' ').trim();
    out.push('  review: ' + review.slice(0, 150));

    await page.click('#rsvp-form [type="submit"]');
    await page.waitForTimeout(1400);
    out.push('  success shown: ' + await page.locator('#rsvp-success').isVisible() +
             ' | form hidden: ' + !(await page.locator('#rsvp-form').isVisible()));
    out.push('  success text: ' + (await page.textContent('[data-success-body]')).replace(/\s+/g,' ').trim());
    out.push('  wish posted to wall: ' + await page.locator('.wish:not(.wish--seed)').count());

    // reload: the site should remember and offer an edit
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3600);
    out.push('  remembered on return: ' + await page.locator('[data-rsvp-saved]').isVisible());

    // decliners must skip the guest-count step
    await page.click('[data-rsvp-edit]');
    await page.waitForTimeout(250);
    await page.click('#rsvp-form [data-step="who"] [data-next]');
    await page.waitForTimeout(150);
    await page.click('#rsvp-form label.choice:has(input[name="attending"][value="no"])');
    await page.click('#rsvp-form [data-step="attend"] [data-next]');
    await page.waitForTimeout(200);
    out.push('  decline skips guest count: ' + await page.locator('#rsvp-form [data-step="review"]').isVisible());

    out.push(errs.length ? '  ERRORS:\n    ' + errs.join('\n    ') : '  no console/page errors');
    console.log(out.join('\n') + '\n');
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
