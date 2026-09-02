/* =============================================================================
   SSBA — motion and material layer, shared by both designs.
   Everything here is progressive: with JavaScript off, or with
   prefers-reduced-motion, the page is still complete and readable.
   ============================================================================= */
(function () {
  'use strict';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var FX = {};

  /* ---------------------------------------------------------- split letters */
  /* Wraps each character so it can rise out of a mask, word by word.          */
  FX.split = function (el) {
    if (el.dataset.splitDone) return;
    var text = el.textContent.trim();
    el.textContent = '';
    var words = text.split(/\s+/), n = 0;
    words.forEach(function (w, wi) {
      var ws = document.createElement('span');
      ws.className = 'sp-w';
      Array.prototype.forEach.call(w, function (ch) {
        var s = document.createElement('span');
        s.className = 'sp-c';
        s.textContent = ch;
        s.style.setProperty('--i', n++);
        ws.appendChild(s);
      });
      el.appendChild(ws);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.splitDone = '1';
    el.style.setProperty('--n', n);
  };

  /* ------------------------------------------------------------- film grain */
  /* Real grain has to tile at 1:1 or it smears into blobs, so the noise is
     baked to a few small tiles and cycled as a repeating background.          */
  FX.grain = function (el, opts) {
    if (!el) return;
    opts = opts || {};
    var S = 128, alpha = opts.alpha || 26, tiles = [];
    var c = document.createElement('canvas'); c.width = c.height = S;
    var cx = c.getContext('2d');
    for (var f = 0; f < 4; f++) {
      var d = cx.createImageData(S, S);
      for (var i = 0; i < d.data.length; i += 4) {
        var v = 255 * Math.random();
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = Math.random() * alpha;
      }
      cx.putImageData(d, 0, 0);
      tiles.push(c.toDataURL('image/png'));
    }
    el.style.backgroundImage = 'url(' + tiles[0] + ')';
    if (reduce) return;
    var k = 0;
    setInterval(function () { el.style.backgroundImage = 'url(' + tiles[k = (k + 1) % tiles.length] + ')'; }, 120);
  };

  /* ------------------------------------------------------- caustic lightfield */
  /* Slow gold light drifting across the ground, the way light moves through
     glass onto silk. Pure Canvas 2D; pauses when off-screen or hidden.        */
  FX.light = function (canvas, opts) {
    if (!canvas) return;
    opts = opts || {};
    var cx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), running = true;
    var warm = opts.warm || 'rgba(255,244,214,0.58)';
    var cool = opts.cool || 'rgba(214,180,110,0.30)';
    var fade = opts.fade || 'rgba(247,242,233,0)';
    var fil  = opts.filament || 'rgba(255,240,205,';
    var filA = opts.filamentAlpha == null ? 0.085 : opts.filamentAlpha;
    var blobs = [];
    for (var i = 0; i < 7; i++) blobs.push({ p: i * 1.13, s: 0.00006 + i * 0.000021, r: 0.30 + i * 0.055, a: i * 0.9 });
    function size() {
      w = canvas.width = Math.max(1, canvas.clientWidth * dpr);
      h = canvas.height = Math.max(1, canvas.clientHeight * dpr);
    }
    size();
    addEventListener('resize', size, { passive: true });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) requestAnimationFrame(frame); });
    function frame(t) {
      if (!running) return;
      cx.clearRect(0, 0, w, h);
      cx.globalCompositeOperation = 'source-over';
      blobs.forEach(function (b, i) {
        var a = b.a + t * b.s;
        var x = w * (0.5 + Math.cos(a) * b.r * 0.62);
        var y = h * (0.46 + Math.sin(a * 1.27 + b.p) * b.r * 0.44);
        var rad = Math.max(w, h) * (0.30 + 0.13 * Math.sin(a * 0.8 + i));
        var g = cx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, i % 2 === 0 ? warm : cool);
        g.addColorStop(0.45, i % 2 === 0 ? warm.replace(/[\d.]+\)$/, '0.20)') : cool.replace(/[\d.]+\)$/, '0.12)'));
        g.addColorStop(1, fade);
        cx.fillStyle = g;
        cx.beginPath(); cx.arc(x, y, rad, 0, 6.2832); cx.fill();
      });
      // caustic filaments — thin bright folds of light
      if (filA <= 0) { requestAnimationFrame(frame); return; }
      cx.globalCompositeOperation = 'lighter';
      cx.lineWidth = Math.max(w, h) * 0.006;
      for (var i2 = 0; i2 < 5; i2++) {
        var a2 = t * 0.00004 * (1 + i2 * 0.32) + i2 * 1.7;
        var x2 = w * (0.5 + Math.cos(a2 * 1.1) * 0.34);
        var y2 = h * (0.5 + Math.sin(a2 * 0.83 + i2) * 0.30);
        var r2 = Math.max(w, h) * (0.16 + 0.07 * i2);
        cx.strokeStyle = fil + Math.max(0, filA - i2 * (filA * 0.14)) + ')';
        cx.beginPath(); cx.arc(x2, y2, r2, a2, a2 + 1.5 + Math.sin(a2) * 0.5); cx.stroke();
      }
      cx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }
    if (reduce) { requestAnimationFrame(function (t) { running = false; frame(t); }); }
    else requestAnimationFrame(frame);
  };

  /* The dot-and-ring cursor and the magnetic button used to live here.
     Both were removed on purpose: they are the two most-copied gestures on
     award-site templates and they say nothing about a Malay wedding. What
     replaced them is FX.ink below — a thing only this invitation can do.    */

  /* --------------------------------------------------- scroll-linked effects */
  /* data-parallax="0.2"   moves at a fraction of scroll
     data-rise             lifts in once, from a visible resting state
     data-open             a mask that opens from a slit as it enters          */
  FX.scroll = function () {
    var items = $$('[data-parallax]').map(function (el) { return { el: el, k: +el.dataset.parallax }; });
    var bar = $('[data-progress-bar]');
    var ticking = false;
    function update() {
      ticking = false;
      var vh = innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        var mid = r.top + r.height / 2;
        var off = (mid - vh / 2) / vh;
        it.el.style.setProperty('--py', (off * it.k * 100).toFixed(2) + 'px');
      });
      if (bar) {
        var max = document.body.scrollHeight - innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
      }
      root.classList.toggle('is-scrolled', scrollY > innerHeight * 0.6);
      // 0 at the top of the page, 1 at the bottom. Kapur moves its sun with it.
      var span = document.body.scrollHeight - innerHeight;
      root.style.setProperty('--sun', span > 0 ? (scrollY / span).toFixed(4) : '0');
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();

    if (!('IntersectionObserver' in window)) { $$('[data-rise],[data-open]').forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('[data-rise],[data-open]').forEach(function (el) {
      if (reduce) { el.classList.add('in'); return; }
      if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); return; }
      el.classList.add('armed'); io.observe(el);
    });
    setTimeout(function () { $$('.armed:not(.in)').forEach(function (e) { e.classList.add('in'); }); }, 9000);
  };

  /* ------------------------------------------- sticky horizontal scroll rail */
  /* A section that pins while its rail slides sideways. Falls back to a plain
     horizontal swipe strip on touch and under reduced motion.                 */
  FX.rail = function (section) {
    if (!section) return;
    var rail = $('[data-rail-track]', section);
    if (!rail) return;
    if (reduce || !fine) { section.classList.add('rail-swipe'); return; }
    function distance() { return Math.max(0, rail.scrollWidth - innerWidth + 96); }
    function layout() { section.style.height = (innerHeight + distance()) + 'px'; }
    layout();
    addEventListener('resize', function () { layout(); update(); }, { passive: true });
    var ticking = false;
    function update() {
      ticking = false;
      var r = section.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, section.offsetHeight - innerHeight)));
      rail.style.transform = 'translate3d(' + (-p * distance()) + 'px,0,0)';
      var idx = Math.round(p * (rail.children.length - 1));
      $$('[data-rail-dot]', section).forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  };


  /* ------------------------------------------------- shrink names into header */
  FX.headerNames = function () {
    var hero = $('[data-hero-names]');
    var mark = $('[data-header-mark]');
    if (!hero || !mark || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { root.classList.toggle('names-gone', !en.isIntersecting); });
    }, { threshold: 0 }).observe(hero);
  };

  /* ------------------------------------------------------ the moving light */
  /* A jewel box has one light. On a pointer it follows the hand; otherwise it
     drifts on its own so the page is never static.                            */
  FX.spotlight = function (el) {
    if (!el) return;
    if (fine && !reduce) {
      addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      }, { passive: true });
      return;
    }
    if (reduce) return;
    (function drift(t) {
      el.style.setProperty('--mx', (50 + Math.cos(t * 0.00016) * 26).toFixed(1) + '%');
      el.style.setProperty('--my', (42 + Math.sin(t * 0.00021) * 18).toFixed(1) + '%');
      requestAnimationFrame(drift);
    })(0);
  };
  FX.petals = function (canvas, opts) {
    if (!canvas || reduce) return;
    opts = opts || {};
    var cx = canvas.getContext('2d');
    var dir = opts.dir || 1;
    var cols = opts.colors || ['#E8C9C4', '#D9A7A0', '#C9A24A'];
    var shades = opts.shades || cols.map(function (c) {
      // a darker partner tone, mixed toward the page's ink
      var n = parseInt(c.slice(1), 16), r = n >> 16, g2 = (n >> 8) & 255, b = n & 255, k = 0.62;
      return '#' + [r, g2, b].map(function (v) {
        return Math.round(v * k).toString(16).padStart(2, '0');
      }).join('');
    });
    var count = Math.round((opts.count || 26) * (innerWidth < 640 ? 0.55 : 1));
    var w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), run = true, ps = [];
    function size() {
      w = canvas.width = Math.max(1, canvas.clientWidth * dpr);
      h = canvas.height = Math.max(1, canvas.clientHeight * dpr);
    }
    function seed(p, first) {
      p.x = Math.random() * w;
      p.y = first ? Math.random() * h : (dir > 0 ? -60 * dpr : h + 60 * dpr);
      // petal length, scaled to the viewport so they stay petals on a phone
      p.s = (16 + Math.random() * 30) * dpr * Math.min(1, Math.max(0.42, (w / dpr) / 900));
      p.v = (0.14 + Math.random() * 0.34) * dpr;   // fall/rise speed
      p.z = 0.45 + Math.random() * 0.55;           // depth: near petals bigger, softer, faster
      p.a = Math.random() * 6.283;                 // spin
      p.va = (Math.random() - 0.5) * 0.018;
      p.ph = Math.random() * 6.283;                // flutter phase
      p.fr = 0.006 + Math.random() * 0.012;
      var ci = (Math.random() * cols.length) | 0;
      p.c = cols[ci];
      p.c2 = shades[ci];
      p.o = 0.30 + Math.random() * 0.45;
    }
    size();
    for (var i = 0; i < count; i++) { var p = {}; seed(p, true); ps.push(p); }
    addEventListener('resize', function () { size(); }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      run = !document.hidden; if (run) requestAnimationFrame(frame);
    });
    function petal(p, t) {
      // a petal is two mirrored curves meeting at a point — a rose petal, not a leaf
      var flut = Math.sin(t * p.fr + p.ph);
      var sx = 0.28 + 0.72 * Math.abs(flut);        // turning edge-on to the light
      var S = p.s * p.z;
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.a + flut * 0.55);
      cx.scale(sx, 1);
      // a rose petal: broad and round at the lip, narrowing to the claw
      cx.beginPath();
      cx.moveTo(0, S);                                        // the claw
      cx.bezierCurveTo(S * 1.02, S * 0.30, S * 0.86, -S * 0.78, 0, -S);
      cx.bezierCurveTo(-S * 0.86, -S * 0.78, -S * 1.02, S * 0.30, 0, S);
      cx.closePath();
      // shaded across the curl so it reads as a surface, not a sticker
      var g = cx.createLinearGradient(-S, -S, S, S);
      g.addColorStop(0, p.c);
      g.addColorStop(1, p.c2);
      cx.fillStyle = g;
      cx.globalAlpha = p.o * (0.45 + 0.55 * Math.abs(flut)) * (0.55 + 0.45 * p.z);
      cx.fill();
      cx.restore();
    }
    function frame(t) {
      if (!run) return;
      cx.clearRect(0, 0, w, h);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.y += p.v * dir * 1.9 * p.z;
        p.x += Math.sin(t * p.fr * 0.7 + p.ph) * 0.5 * dpr;   // wind
        p.a += p.va;
        if (dir > 0 ? p.y - p.s > h + 40 * dpr : p.y + p.s < -40 * dpr) seed(p, false);
        petal(p, t);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  FX.open = function () {
    root.classList.add('ready');
    document.dispatchEvent(new CustomEvent('ssba:ready'));
  };

  /* -------------------------------------------------------------- boot order */
  function boot() {
    $$('[data-split]').forEach(FX.split);
    FX.grain($('[data-grain]'), { alpha: window.GRAIN_ALPHA || 26 });
    FX.light($('[data-light]'), window.LIGHT_OPTS);
    FX.scroll();
    FX.rail($('[data-rail]'));
    FX.spotlight($('[data-spot]'));
    FX.headerNames();
    FX.petals($('[data-petals]'), window.PETALS || {});
    FX.open();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.FX = FX;
})();
