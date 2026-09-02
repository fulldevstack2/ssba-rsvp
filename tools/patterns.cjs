// Generates SVG snippets for Islamic geometric patterns used by both designs.
// Run: node tools/patterns.cjs  -> prints JSON with svg strings; writes scratch preview if PREVIEW env is set.
const SQ2 = Math.SQRT2;
const f = n => +n.toFixed(3);

// 1. Star-and-cross ("Breath of the Compassionate"): 8-point star made of two squares, tiled so tips touch.
function starCross(size = 96, stroke = '#B99A5B', sw = 0.9, op = 1) {
  const P = size, a = P / (2 * SQ2), c = P / 2;
  const sq = `M${f(c-a)},${f(c-a)}H${f(c+a)}V${f(c+a)}H${f(c-a)}Z`;
  const dia = `M${f(c)},0L${f(P)},${f(c)}L${f(c)},${f(P)}L0,${f(c)}Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}" viewBox="0 0 ${P} ${P}"><g fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"><path d="${sq}"/><path d="${dia}"/></g></svg>`;
}
// 2. Mashrabiya / truncated-square lattice: regular octagons whose gaps form tilted squares.
function octLattice(size = 72, stroke = '#B99A5B', sw = 0.9, op = 1) {
  const P = size, s = P / (1 + SQ2), R = s / (2 * Math.sin(Math.PI / 8)), c = P / 2;
  const pts = [];
  for (let k = 0; k < 8; k++) { const t = (Math.PI / 8) + k * Math.PI / 4; pts.push(`${f(c + R * Math.cos(t))},${f(c + R * Math.sin(t))}`); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}" viewBox="0 0 ${P} ${P}"><polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/></svg>`;
}
// 3. Eight-point star rosette (single ornament), with inner octagon and radiating petals. Returns inner SVG group in a 100x100 box.
function rosette(stroke = '#B99A5B', sw = 1) {
  const c = 50, R = 46, r = R / SQ2; // two squares
  const sqA = [], sqB = [];
  for (let k = 0; k < 4; k++) { const t = Math.PI / 4 + k * Math.PI / 2; sqA.push(`${f(c + R * Math.cos(t))},${f(c + R * Math.sin(t))}`); }
  for (let k = 0; k < 4; k++) { const t = k * Math.PI / 2; sqB.push(`${f(c + R * Math.cos(t))},${f(c + R * Math.sin(t))}`); }
  // inner octagon through the concave vertices
  const ri = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const oct = []; for (let k = 0; k < 8; k++) { const t = Math.PI / 8 + k * Math.PI / 4; oct.push(`${f(c + ri * Math.cos(t))},${f(c + ri * Math.sin(t))}`); }
  const inner = []; for (let k = 0; k < 8; k++) { const t = k * Math.PI / 4; inner.push(`${f(c + (ri * 0.55) * Math.cos(t))},${f(c + (ri * 0.55) * Math.sin(t))}`); }
  return `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="miter"><polygon points="${sqA.join(' ')}"/><polygon points="${sqB.join(' ')}"/><polygon points="${oct.join(' ')}"/><polygon points="${inner.join(' ')}"/><circle cx="50" cy="50" r="3"/></g>`;
}
// 4. Pointed (two-centred) arch path in objectBoundingBox units (0..1). Apex at top center.
function archPath(ratio = 1.35 /* height/width */) {
  const W = 1, H = ratio; // work in width units then normalise y by H
  const r = 0.75 * W, spring = 0.707 * W; // apex at spring - sqrt(r^2 - (W/4)^2) = spring - 0.7071W
  const apexY = spring - Math.sqrt(r * r - (W / 4) ** 2);
  const y = v => f(v / H);
  return `M0,1 L0,${y(spring)} A${f(r)},${f(r / H)} 0 0 1 0.5,${y(apexY)} A${f(r)},${f(r / H)} 0 0 1 1,${y(spring)} L1,1 Z`;
}
// 5. Merdeka-118 inspired faceted diamond grid (triangular facets), faint.
function facets(size = 64, stroke = '#B99A5B', sw = 0.6, op = 1) {
  const P = size, h = P;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${h}" viewBox="0 0 ${P} ${h}"><g fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"><path d="M0,0L${P/2},${h/2}L0,${h}M${P},0L${P/2},${h/2}L${P},${h}M${P/2},0V${h}"/></g></svg>`;
}
const enc = s => 'data:image/svg+xml;utf8,' + encodeURIComponent(s).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%22/g, "'");
module.exports = { starCross, octLattice, rosette, archPath, facets, enc };
if (require.main === module) {
  const out = { starCross: enc(starCross()), octLattice: enc(octLattice()), facets: enc(facets()), rosette: rosette(), arch: archPath() };
  if (process.env.PREVIEW) {
    const fs = require('fs');
    fs.writeFileSync(process.env.PREVIEW, `<html><body style="margin:0;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;background:#fff">
<div style="height:260px;background:url(&quot;${out.starCross}&quot;) #F7F4EE"></div>
<div style="height:260px;background:url(&quot;${out.octLattice}&quot;) #F7F4EE"></div>
<div style="height:260px;background:url(&quot;${out.facets}&quot;) #F7F4EE"></div>
<div style="height:260px;display:flex;gap:12px;align-items:center;justify-content:center;background:#F7F4EE">
<svg viewBox="0 0 100 100" width="200" height="200">${out.rosette}</svg>
<svg viewBox="0 0 100 135" width="120" height="162"><defs><clipPath id="arch" clipPathUnits="objectBoundingBox"><path d="${out.arch}"/></clipPath></defs><rect width="100" height="135" fill="#B99A5B" clip-path="url(#arch)"/></svg>
</div></body></html>`);
  } else console.log(JSON.stringify(out, null, 1));
}

/* ---------------------------------------------------------------------------
   The khatam ("seal") — the eight-point star — CONSTRUCTED the way the pattern
   is really made: the governing circle, the compass marks, the straightedge
   radii, the two squares, then the star, then the inner rosette. Returned as
   separate layers so the page can draw it in that order.
--------------------------------------------------------------------------- */
function khatam(size = 1000) {
  const c = size / 2, R = size * 0.42;
  const pt = (r, deg) => [f(c + r * Math.cos(deg * Math.PI / 180)), f(c + r * Math.sin(deg * Math.PI / 180))];
  const circle = [], marks = [], radii = [], squares = [], star = [], rosette = [];

  circle.push(`<circle cx="${c}" cy="${c}" r="${f(R)}"/>`);
  circle.push(`<circle cx="${c}" cy="${c}" r="${f(R * 0.7071)}"/>`);
  for (let k = 0; k < 8; k++) {
    const [x, y] = pt(R, k * 45);
    marks.push(`<circle cx="${x}" cy="${y}" r="${f(size * 0.0035)}"/>`);
    radii.push(`<line x1="${c}" y1="${c}" x2="${x}" y2="${y}"/>`);
  }
  squares.push(`<polygon points="${[0, 90, 180, 270].map(d => pt(R, d).join(',')).join(' ')}"/>`);
  squares.push(`<polygon points="${[45, 135, 225, 315].map(d => pt(R, d).join(',')).join(' ')}"/>`);

  const rIn = R * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
  const outline = [];
  for (let k = 0; k < 8; k++) { outline.push(pt(R, k * 45).join(',')); outline.push(pt(rIn, k * 45 + 22.5).join(',')); }
  star.push(`<polygon points="${outline.join(' ')}"/>`);

  const oct = [];
  for (let k = 0; k < 8; k++) oct.push(pt(rIn * 0.62, k * 45 + 22.5).join(','));
  rosette.push(`<polygon points="${oct.join(' ')}"/>`);
  for (let k = 0; k < 8; k++) {
    const a = pt(rIn * 0.62, k * 45 + 22.5), b = pt(rIn * 0.62, (k + 1) * 45 + 22.5), m = pt(rIn * 0.30, k * 45 + 45);
    rosette.push(`<path d="M${a} Q${m} ${b}"/>`);
  }
  rosette.push(`<circle cx="${c}" cy="${c}" r="${f(rIn * 0.14)}"/>`);

  const layer = (arr, cls) => `<g class="${cls}">${arr.join('')}</g>`;
  return `<svg class="kh" viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor" ` +
    `stroke-width="${f(size * 0.0016)}" stroke-linejoin="miter" aria-hidden="true">` +
    layer(circle, 'kh-circle') + layer(marks, 'kh-mark') + layer(radii, 'kh-radii') +
    layer(squares, 'kh-square') + layer(star, 'kh-star') + layer(rosette, 'kh-rosette') + '</svg>';
}
module.exports.khatam = khatam;



/* ---------------------------------------------------------------------------
   MELUR — Jasminum sambac, the Malay bridal flower, strung into garlands for
   the bride and scattered through bunga rampai. Drawn here as single-stroke
   line art so the page can trace it the way a hand would draw it: stem first,
   then leaves, then buds, then the blossoms opening last.

   Authored in a 200 x 620 box. Every part is its own group so the trace can be
   ordered, and every path is open (no fills) so stroke-dashoffset works.
--------------------------------------------------------------------------- */
function melur(w = 200, h = 620) {
  const stem = [
    'M100,620 C96,560 104,520 99,470 C95,424 106,388 100,340',
    'M100,340 C95,296 104,258 99,214 C96,182 103,150 100,120'
  ];
  // a leaf is two mirrored arcs meeting at tip and base, with a midrib
  const leaf = (x, y, len, lean, dir) => {
    const tipX = x + dir * len * 0.62, tipY = y - len * 0.72;
    const c1 = `${x + dir * len * 0.06},${y - len * 0.44}`;
    const c2 = `${x + dir * len * 0.34},${y - len * 0.80}`;
    const d1 = `${x + dir * len * 0.64},${y - len * 0.30}`;
    const d2 = `${x + dir * len * 0.30},${y - len * 0.06}`;
    return [
      `M${x},${y} C${c1} ${c2} ${tipX},${tipY} C${d1} ${d2} ${x},${y}`,
      `M${x},${y} Q${x + dir * len * 0.30},${y - len * 0.40} ${tipX},${tipY}`
    ];
  };
  const leaves = [
    ...leaf(99, 500, 96, 0, -1), ...leaf(101, 452, 84, 0, 1),
    ...leaf(99, 384, 88, 0, -1), ...leaf(101, 330, 76, 0, 1),
    ...leaf(100, 258, 70, 0, -1)
  ];
  // a blossom: five narrow petals round a small eye
  const bloom = (cx, cy, r, turn) => {
    const out = [`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.17)}"/>`];
    for (let k = 0; k < 5; k++) {
      const a = turn + k * (Math.PI * 2 / 5);
      const tx = cx + Math.cos(a) * r, ty = cy + Math.sin(a) * r;
      const s = 0.42, wA = a + 0.55, wB = a - 0.55;
      out.push(`<path d="M${f(cx)},${f(cy)} C${f(cx + Math.cos(wA) * r * s)},${f(cy + Math.sin(wA) * r * s)} ` +
        `${f(tx - Math.cos(a) * r * 0.18 + Math.cos(wA) * r * 0.3)},${f(ty - Math.sin(a) * r * 0.18 + Math.sin(wA) * r * 0.3)} ${f(tx)},${f(ty)} ` +
        `C${f(tx - Math.cos(a) * r * 0.18 + Math.cos(wB) * r * 0.3)},${f(ty - Math.sin(a) * r * 0.18 + Math.sin(wB) * r * 0.3)} ` +
        `${f(cx + Math.cos(wB) * r * s)},${f(cy + Math.sin(wB) * r * s)} ${f(cx)},${f(cy)}"/>`);
    }
    return out;
  };
  const buds = [
    'M100,214 C88,200 88,178 100,168 C112,178 112,200 100,214',
    'M100,168 L100,150',
    'M99,290 C89,278 89,260 99,252 C109,260 109,278 99,290'
  ];
  const blooms = [...bloom(100, 104, 40, -Math.PI / 2), ...bloom(62, 158, 26, -1.9), ...bloom(139, 176, 22, -1.2)];

  const g = (cls, arr, isPath) => `<g class="${cls}">` +
    arr.map(d => (isPath ? `<path d="${d}"/>` : d)).join('') + '</g>';
  return `<svg class="melur" viewBox="0 0 ${w} ${h}" fill="none" stroke="currentColor" ` +
    `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    g('ml-stem', stem, true) + g('ml-leaf', leaves, true) +
    g('ml-bud', buds, true) + g('ml-bloom', blooms, false) + '</svg>';
}
module.exports.melur = melur;
