/* node tools/shot.cjs <file> <out.png> [w] [h] [full] [waitMs] [sections] [motion] */
const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const [,, file, out, w='390', h='844', full='true', wait='4200', sections='', motion='no-preference'] = process.argv;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{width:+w,height:+h}, deviceScaleFactor:2, reducedMotion: motion });
  const page = await ctx.newPage();
  const errs=[];
  page.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  page.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text());});
  await page.goto('file://'+path.resolve(file),{waitUntil:'networkidle'});
  await page.waitForTimeout(+wait);
  await page.evaluate(()=>{document.querySelectorAll('.armed').forEach(e=>e.classList.add('in'));});
  await page.waitForTimeout(900);
  if (sections) {
    const sels = sections.split(',').map(s=>s.trim()).filter(Boolean);
    for (let i=0;i<sels.length;i++){
      const el = await page.$(sels[i]);
      if(!el){console.log('  miss '+sels[i]);continue;}
      await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
      const f = out.replace(/\.png$/,`-${i+1}.png`);
      await el.screenshot({path:f}); console.log('saved '+f+'  ('+sels[i]+')');
    }
  } else { await page.screenshot({path:out, fullPage: full==='true'}); console.log('saved '+out); }
  if(errs.length) console.log('--- errors ---\n'+errs.join('\n'));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
