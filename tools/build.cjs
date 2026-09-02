/* Build: src/<a|b>/index.html  ->  design-<a|b>/index.html
   Replaces {{inline:path}}, {{pattern:...}}, {{rosette:...}}, {{arch:ratio}},
   {{khatam:size}}, {{asset:file}} */
const fs = require('fs'), path = require('path');
const P = require('./patterns.cjs');
const root = path.resolve(__dirname, '..');
const targets = { 'src/a/index.html': 'design-a/index.html', 'src/b/index.html': 'design-b/index.html' };

function expand(html, seen) {
  html = html.replace(/\{\{inline:([^}]+)\}\}/g, (_, f) => {
    const fp = path.join(root, f.trim());
    if (!fs.existsSync(fp)) throw new Error('inline target missing: ' + f);
    return expand(fs.readFileSync(fp, 'utf8'), seen);
  });
  html = html.replace(/\{\{pattern:(\w+):([^:}]+)(?::([\d.]+))?(?::([\d.]+))?\}\}/g,
    (_, name, color, size, sw) => P.enc(P[name](size ? +size : undefined, color, sw ? +sw : undefined)));
  html = html.replace(/\{\{rosette:([^:}]+)(?::([\d.]+))?\}\}/g, (_, color, sw) => P.rosette(color, sw ? +sw : undefined));
  html = html.replace(/\{\{arch(?::([\d.]+))?\}\}/g, (_, r) => P.archPath(r ? +r : undefined));
  html = html.replace(/\{\{khatam(?::(\d+))?\}\}/g, (_, sz) => P.khatam(sz ? +sz : undefined));
  // {{asset:name.webp}} -> inline data URI, so each design stays one droppable file
  return html;
}

let built = 0;
for (const [src, out] of Object.entries(targets)) {
  const sp = path.join(root, src);
  if (!fs.existsSync(sp)) { console.log(`skip  ${src} (not written yet)`); continue; }
  const html = expand(fs.readFileSync(sp, 'utf8'), new Set());
  const left = html.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error(`${src}: unresolved tokens ${[...new Set(left)].join(', ')}`);
  fs.mkdirSync(path.dirname(path.join(root, out)), { recursive: true });
  fs.writeFileSync(path.join(root, out), html);
  console.log(`built ${out}  ${(html.length / 1024).toFixed(1)} kB`);
  built++;
}
if (!built) console.log('nothing to build');
