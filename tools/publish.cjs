/* Publish one design as the whole site.
   node tools/publish.cjs [id]   ->  docs/  (GitHub Pages serves main /docs)

   Only the chosen design goes out. The other concepts and the chooser stay in
   the repo but are never served, because nothing copies them here. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const id = process.argv[2] || 'nur';
const from = path.join(root, 'design', id);
const to = path.join(root, 'docs');

if (!fs.existsSync(path.join(from, 'index.html'))) {
  console.error(`no build at design/${id}/index.html — run: node tools/build.cjs`);
  process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true });
fs.writeFileSync(path.join(to, '.nojekyll'), '');   // serve files that start with _

const list = [];
(function walk(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name), r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walk(p, r);
    else list.push(`${r}  ${(fs.statSync(p).size / 1024).toFixed(1)} kB`);
  }
})(to, '');
console.log(`published design/${id} -> docs/`);
list.forEach((l) => console.log('  ' + l));
