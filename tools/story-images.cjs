/* Search Wikimedia Commons for freely-licensed photographs for each beat of
   Kisah Kami, keep only licences we can actually ship, and write a contact
   sheet to choose from. Nothing is used until it is picked. */
const fs = require('node:fs');
const path = require('node:path');
const API = 'https://commons.wikimedia.org/w/api.php';
const OK = /^(cc0|public domain|pd|cc by|cc by-sa|attribution)/i;

const BEATS = [
  { id: 'perkenalan', q: ['ketupat', 'pelita oil lamp Malaysia', 'songket textile', 'Malaysia lantern Raya'] },
  { id: 'lamaran',    q: ['Mount Kinabalu summit sunrise', "Low's Peak Kinabalu", 'Mount Kinabalu Sabah'] },
  { id: 'pertunangan',q: ['sirih junjung', 'bunga telur', 'pelamin Malay wedding dais', 'hantaran gifts Malay', 'Malay wedding Malaysia'] },
  { id: 'pernikahan', q: ['Merdeka 118', 'Merdeka 118 tower Kuala Lumpur'] }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(params) {
  await sleep(1200);   // Commons throttles anonymous bursts
  const u = API + '?' + new URLSearchParams({ format: 'json', ...params });
  for (var i = 0; i < 5; i++) {
    const r = await fetch(u, { headers: { 'User-Agent': 'ssba-rsvp/1.0 (wedding invitation asset sourcing; contact: local)' } });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch (e) { await sleep(3000 * (i + 1)); }
  }
  throw new Error('Commons kept refusing: ' + u);
}
async function search(q, n = 8) {
  const j = await get({ action: 'query', list: 'search', srsearch: q, srnamespace: '6', srlimit: String(n) });
  return (j.query && j.query.search || []).map(s => s.title);
}
async function info(titles) {
  if (!titles.length) return [];
  const j = await get({ action: 'query', titles: titles.join('|'), prop: 'imageinfo',
    iiprop: 'url|extmetadata|size', iiurlwidth: '1600' });
  const pages = (j.query && j.query.pages) || {};
  return Object.values(pages).map(p => {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii) return null;
    const m = ii.extmetadata || {};
    const val = k => (m[k] && String(m[k].value || '').replace(/<[^>]*>/g, '').trim()) || '';
    return { title: p.title, lic: val('LicenseShortName'), artist: val('Artist'),
      credit: val('Credit'), desc: val('ImageDescription').slice(0, 180),
      w: ii.width, h: ii.height, url: ii.url, thumb: ii.thumburl,
      page: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title) };
  }).filter(Boolean);
}

(async () => {
  const out = { };
  for (const b of BEATS) {
    const titles = [];
    for (const q of b.q) titles.push(...await search(q));
    const uniq = [...new Set(titles)].filter(t => /\.(jpe?g|png)$/i.test(t)).slice(0, 18);
    const rows = (await info(uniq))
      .filter(r => OK.test(r.lic))
      .filter(r => r.w >= 1400 && r.w / r.h > 0.6)
      .slice(0, 8);
    out[b.id] = rows;
    console.log(b.id, rows.length, 'candidates');
  }
  fs.writeFileSync(path.join('assets/story', 'candidates.json'), JSON.stringify(out, null, 2));

  const html = ['<meta charset="utf-8"><title>Kisah Kami — candidates</title>',
    '<style>body{font:13px/1.5 system-ui;background:#f6f1e8;color:#2c2620;margin:24px}',
    'h2{font:600 15px system-ui;letter-spacing:.14em;text-transform:uppercase;margin:2.4rem 0 .8rem}',
    'ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}',
    'li{background:#fff;padding:10px;border:1px solid #e6ded0}img{width:100%;height:170px;object-fit:cover;display:block}',
    'code{font-size:11px;color:#6b6152;word-break:break-all}b{display:block;margin:6px 0 2px}</style>'];
  for (const b of BEATS) {
    html.push('<h2>' + b.id + '</h2><ul>');
    for (const r of out[b.id]) {
      html.push('<li><img src="' + r.thumb + '"><b>' + r.title.replace('File:', '') + '</b>' +
        '<code>' + r.lic + ' — ' + (r.artist || '?') + '</code><br><code>' + r.page + '</code></li>');
    }
    html.push('</ul>');
  }
  fs.writeFileSync(path.join('assets/story', 'candidates.html'), html.join('\n'));
  console.log('wrote assets/story/candidates.html');
})();
