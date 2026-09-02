/* Build the concept sheet.
   src/page.html + src/concepts/<id>.css  ->  design/<id>/index.html
   src/chooser.html                       ->  index.html
   Tokens: {{inline:path}} {{style}} {{fonts}} {{themeColor}} {{arabicClass}}
           {{heroLayers}} {{config}} {{runtime}} {{khatam:size}} {{arch}}       */
const fs = require('fs'), path = require('path');
const P = require('./patterns.cjs');
const { concepts } = require('../src/concepts.cjs');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function geometry(html) {
  html = html.replace(/\{\{khatam(?::(\d+))?\}\}/g, (_, sz) => P.khatam(sz ? +sz : undefined));
  html = html.replace(/\{\{arch(?::([\d.]+))?\}\}/g, (_, r) => P.archPath(r ? +r : undefined));
  return html;
}
function inline(html) {
  return html.replace(/\{\{inline:([^}]+)\}\}/g, (_, f) => {
    const fp = path.join(root, f.trim());
    if (!fs.existsSync(fp)) throw new Error('missing inline target: ' + f);
    return geometry(read(f.trim()));
  });
}

/* Only the layers a concept declares are emitted, so no design carries markup
   for an effect it does not use. */
function heroLayers(c) {
  const L = c.layers || {}, out = [];
  if (L.light)  out.push('    <div class="lightwrap" aria-hidden="true"><canvas data-light></canvas></div>');
  if (L.spot)   out.push('    <div class="spot" data-spot aria-hidden="true"></div>');
  if (L.shadow) out.push('    <div class="cast" data-cast aria-hidden="true"><span></span></div>');
  if (L.nacre)  out.push('    <div class="nacre" data-nacre aria-hidden="true"></div>');
  if (L.petals) out.push('    <canvas class="petals" data-petals aria-hidden="true"></canvas>');
  return out.join('\n');
}
function runtime(c) {
  const r = c.runtime || {};
  return Object.keys(r).map((k) => `window.${k} = ${JSON.stringify(r[k])};`).join('\n');
}

let built = 0;
for (const c of concepts) {
  /* A concept owns its own markup and its own stylesheet. Nothing about how a
     design looks is shared — only the machinery underneath it. */
  const ownPage = `src/concepts/${c.id}/page.html`;
  const ownCss  = `src/concepts/${c.id}/style.css`;
  if (!fs.existsSync(path.join(root, ownPage)) || !fs.existsSync(path.join(root, ownCss))) {
    console.log(`skip  ${c.id} (not rebuilt yet)`); continue;
  }
  const page = read(ownPage);
  const cssPath = ownCss;
  let html = page
    .replace(/\{\{style\}\}/g, () => geometry(read('src/reset.css') + '\n' + read(cssPath)))
    .replace(/\{\{fonts\}\}/g, c.fonts)
    .replace(/\{\{themeColor\}\}/g, c.themeColor)
    .replace(/\{\{arabicClass\}\}/g, c.arabicClass)
    .replace(/\{\{heroLayers\}\}/g, heroLayers(c))
    .replace(/\{\{config\}\}/g, JSON.stringify({
      design: c.id, countdownTo: '2026-10-10T10:00:00+08:00', endpoint: '', audio: '', audioOnOpen: false
    }, null, 0))
    .replace(/\{\{runtime\}\}/g, runtime(c));
  html = geometry(inline(html));
  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${c.id}: unresolved ${[...new Set(left)].join(', ')}`);
  const out = path.join(root, 'design', c.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`built design/${c.id}/index.html  ${(html.length / 1024).toFixed(1)} kB`);
  built++;
}

if (fs.existsSync(path.join(root, 'src/chooser.html'))) {
  let ch = geometry(inline(read('src/chooser.html')));
  ch = ch.replace(/\{\{concepts\}\}/g, JSON.stringify(concepts));
  fs.writeFileSync(path.join(root, 'index.html'), ch);
  console.log(`built index.html (chooser)  ${(ch.length / 1024).toFixed(1)} kB`);
}
if (!built) console.log('nothing built');
