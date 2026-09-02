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

  /* --------------------------------------------------- "is it really in view" */
  /* One honest test for every reveal on the page. A sliver of a section poking
     over the fold is not being looked at: a real band of it has to be inside
     the viewport — a third of the element's own height, or a third of the
     screen when the element is taller than that. Everything that plays on
     arrival asks this, so nothing can fire ahead of the reader.               */
  function seen(el, share) {
    var r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight) return false;
    // nothing plays while it is still down in the last quarter of the screen
    if (r.top > innerHeight * 0.74) return false;
    var vis = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    var need = Math.min(r.height * (share || 0.34), innerHeight * 0.34);
    return vis >= Math.max(1, need);
  }

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
    /* One tile, painted once. The shimmer is a CSS transform on the layer, not
       a swapped image: re-decoding a data URI five times a second was the most
       expensive thing on the page and it showed up as stutter during the
       section animations. */
    var S = 128, alpha = opts.alpha || 26;
    var c = document.createElement('canvas'); c.width = c.height = S;
    var cx = c.getContext('2d');
    var d = cx.createImageData(S, S);
    for (var i = 0; i < d.data.length; i += 4) {
      var v = 255 * Math.random();
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = Math.random() * alpha;
    }
    cx.putImageData(d, 0, 0);
    el.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  };

  /* ------------------------------------------------------- caustic lightfield */
  /* Slow gold light drifting across the ground, the way light moves through
     glass onto silk. Pure Canvas 2D; pauses when off-screen or hidden.        */
  FX.light = function (canvas, opts) {
    if (!canvas) return;
    opts = opts || {};
    var cx = canvas.getContext('2d');
    /* Seven full-bleed gradients a frame is the most expensive thing on the
       page. They are pure soft light, so a 1x raster is indistinguishable, and
       the drift is slow enough that 30fps is too — and it stops entirely once
       the hero is behind you. */
    var dpr = innerWidth < 700 ? 1 : Math.min(devicePixelRatio || 1, 1.25);
    var w = 0, h = 0, running = true, onScreen = true, prev = 0;
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
      if (!running || !onScreen) { running = false; return; }
      if (t - prev < 32) { requestAnimationFrame(frame); return; }
      prev = t;
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
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          onScreen = en.isIntersecting;
          if (onScreen && !running && !reduce) { running = true; requestAnimationFrame(frame); }
        });
      }, { rootMargin: '10% 0px' }).observe(canvas.parentElement || canvas);
    }
    if (reduce) { requestAnimationFrame(function (t) { prev = -1e6; frame(t); running = false; }); }
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
    /* A custom property written on :root invalidates the style of every element
       on the page. Doing that on each scroll frame cost more than everything
       else on this site put together, so --sun is only written by a design that
       actually declares it, and only when its value really changes. */
    var wantsSun = getComputedStyle(root).getPropertyValue('--sun').trim() !== '';
    var span = 0, lastSun = -1, scrolled = false, ticking = false;
    function measure() { span = Math.max(0, document.body.scrollHeight - innerHeight); }
    measure();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

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
      var p = span > 0 ? scrollY / span : 0;
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var past = scrollY > vh * 0.6;
      if (past !== scrolled) { scrolled = past; root.classList.toggle('is-scrolled', past); }
      // 0 at the top of the page, 1 at the bottom. Kapur moves its sun with it.
      if (wantsSun) {
        var v = +p.toFixed(3);
        if (v !== lastSun) { lastSun = v; root.style.setProperty('--sun', v); }
      }
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', function () { measure(); update(); }, { passive: true });
    update();

    if (!('IntersectionObserver' in window)) { $$('[data-rise],[data-open]').forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      // intersecting is only the cue to look; seen() decides
      es.forEach(function (en) {
        if (!en.isIntersecting || !seen(en.target, 0.3)) return;
        en.target.classList.add('in'); io.unobserve(en.target);
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    var waiting = [];
    $$('[data-rise],[data-open]').forEach(function (el) {
      if (reduce) { el.classList.add('in'); return; }
      if (seen(el, 0.3)) { el.classList.add('in'); return; }
      el.classList.add('armed'); waiting.push(el); io.observe(el);
    });
    // same rule while scrolling: reveal on arrival, never on a timer
    var rt = 0;
    addEventListener('scroll', function () {
      if (rt || !waiting.length) return;
      rt = requestAnimationFrame(function () {
        rt = 0;
        waiting = waiting.filter(function (e) {
          if (!seen(e, 0.3)) return true;
          e.classList.add('in'); return false;
        });
      });
    }, { passive: true });
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
    opts = Object.assign({}, opts || {});
    // a canvas may thin itself out: the hero carries the full drift, the
    // quieter sections a handful
    var over = parseInt(canvas.getAttribute('data-count') || '', 10);
    if (over > 0) opts.count = over;
    // a quieter section turns its petals more slowly than the hero does
    var spin = parseFloat(canvas.getAttribute('data-spin') || '') || 1;
    var drift = parseFloat(canvas.getAttribute('data-speed') || '') || 1;
    var cx = canvas.getContext('2d');
    var dir = opts.dir || 1;
    var cols = opts.colors || ['#E8C9C4', '#D9A7A0', '#C9A24A'];
    var shades = opts.shades || cols.map(function (c) {
      /* A lighter partner tone, mixed toward a warm white. The old one
         multiplied every channel down toward the ink, which turned a pink
         petal into a grey-brown one — a shadow on the paper rather than
         light catching the curl of a petal. */
      var n = parseInt(c.slice(1), 16), r = n >> 16, g2 = (n >> 8) & 255, b = n & 255, k = 0.55;
      var lift = function (v, t) { return Math.round(v + (t - v) * k); };
      return '#' + [lift(r, 255), lift(g2, 250), lift(b, 244)].map(function (v) {
        return v.toString(16).padStart(2, '0');
      }).join('');
    });
    var count = Math.round((opts.count || 26) * (innerWidth < 640 ? 0.55 : 1));
    var onScreen = true, running = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          onScreen = en.isIntersecting;
          if (onScreen && !running) { running = true; requestAnimationFrame(frame); }
        });
      }, { rootMargin: '12% 0px' }).observe(canvas.parentElement || canvas);
    }
    var w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1 : 1.25), run = true, ps = [];
    function size() {
      w = canvas.width = Math.max(1, canvas.clientWidth * dpr);
      h = canvas.height = Math.max(1, canvas.clientHeight * dpr);
    }
    function seed(p, first) {
      p.x = Math.random() * w;
      p.y = first ? Math.random() * h : (dir > 0 ? -60 * dpr : h + 60 * dpr);
      // petal length, scaled to the viewport so they stay petals on a phone
      p.s = (16 + Math.random() * 30) * dpr * Math.min(1, Math.max(0.42, (w / dpr) / 900));
      p.v = (0.14 + Math.random() * 0.34) * dpr * drift;   // fall/rise speed
      p.z = 0.45 + Math.random() * 0.55;           // depth: near petals bigger, softer, faster
      p.a = Math.random() * 6.283;                 // spin
      p.va = (Math.random() - 0.5) * 0.018 * spin;   // tumble
      p.ph = Math.random() * 6.283;                // flutter phase
      p.fr = (0.006 + Math.random() * 0.012) * spin;
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
      if (!onScreen) { running = false; return; }
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
      running = true; requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  FX.open = function () {
    root.classList.add('ready');
    document.dispatchEvent(new CustomEvent('ssba:ready'));
  };

  /* --------------------------------------------------------------- play once */
  /* A section is a normal height and animates itself once, when you reach it.
     No pinning and no scrubbing: the reader scrolls a little, the moment plays,
     they scroll on. Everything is a plain CSS animation keyed off `.played`, so
     a section that never enters the viewport simply sits in its finished state
     for anyone with reduced motion or no JavaScript.                         */
  FX.play = function () {
    var els = $$('[data-play]');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('played', 'instant'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        // touching the viewport is not the same as being read
        if (!en.isIntersecting || !seen(en.target)) return;
        en.target.classList.add('played');
        io.unobserve(en.target);
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    var pending = [];
    els.forEach(function (el) {
      // only what is genuinely on screen at load plays straight away
      if (seen(el)) { el.classList.add('played'); return; }
      pending.push(el); io.observe(el);
    });
    /* Safety net, but tied to position rather than a clock: a section only
       plays once it is genuinely on screen. A timer here meant every section
       had already played before the reader ever reached it. */
    var t = 0;
    addEventListener('scroll', function () {
      if (t || !pending.length) return;
      t = requestAnimationFrame(function () {
        t = 0;
        pending = pending.filter(function (el) {
          if (!seen(el)) return true;
          el.classList.add('played'); return false;
        });
      });
    }, { passive: true });
  };

  /* ------------------------------------------------------------ the fields */
  /* One particle engine, several materials. Each section gets its own canvas
     and its own material, so no two backgrounds are the same thing twice:

       Everything rises, as the hero petals do.

       mote    dust hanging in a shaft of light, barely moving
       grain   small petals, a shower of them, warmer and closer together
       thread  songket weft, fine filaments catching the light as they drift
       orb     pelita light, soft and rising
       bloom   bunga rampai, shredded petals turning as they fall

     A field only runs while its section is on screen, and never under reduced
     motion, so a page of them still costs almost nothing.                    */
  FX.field = function (canvas) {
    if (!canvas || reduce) return;
    var mode = canvas.getAttribute('data-field') || 'mote';
    var cs = getComputedStyle(canvas);
    var accent = (cs.getPropertyValue('--accent') || '#B08D4F').trim();
    var cx = canvas.getContext('2d');
    /* These are soft, slow shapes on a pale ground: a phone gains nothing from
       rastering them at 2x, and pays for it in dropped frames while scrolling. */
    var dpr = innerWidth < 700 ? 1 : Math.min(devicePixelRatio || 1, 1.25);
    var w = 0, h = 0, live = false, raf = 0, ps = [], prev = 0;

    /* Sized to actually be seen. The first pass was a few pixels across at 20%
       alpha, which is indistinguishable from paper grain. */
    var SPEC = {
      mote:   { n: 40, r: [1.6, 4.4],  vy: [-0.06, -0.20], vx: 0.06, a: [0.26, 0.62], blur: 0 },
      grain:  { n: 26, r: [6, 15],     vy: [-0.16, -0.40], vx: 0.14, a: [0.30, 0.62], blur: 0 },
      thread: { n: 22, r: [34, 96],    vy: [-0.10, -0.30], vx: 0.04, a: [0.16, 0.40], blur: 0 },
      orb:    { n: 20, r: [14, 46],    vy: [-0.07, -0.22], vx: 0.07, a: [0.10, 0.26], blur: 8 },
      bloom:  { n: 24, r: [7, 18],     vy: [-0.12, -0.34], vx: 0.18, a: [0.26, 0.60], blur: 0 }
    };
    var spec = SPEC[mode] || SPEC.mote;
    var PETAL_COLS = {
      bloom: ['#EFC9C6', '#E4AEAB', '#F6DCD8', '#E0BE84', '#EAC0BC'],
      grain: ['#EBC5C1', '#DFC59A', '#F3D9D4', '#E3B4AF', '#E8CDA6']
    };
    var cols = PETAL_COLS[mode] || PETAL_COLS.bloom;
    /* the one shape the whole page drifts in: broad and round at the lip,
       narrowing to the claw — the hero's petal, at whatever size is asked */
    function petalPath(R) {
      cx.beginPath();
      cx.moveTo(0, R);
      cx.bezierCurveTo(R * 1.02, R * 0.30, R * 0.86, -R * 0.78, 0, -R);
      cx.bezierCurveTo(-R * 0.86, -R * 0.78, -R * 1.02, R * 0.30, 0, R);
    }
    var rnd = function (a, b) { return a + Math.random() * (b - a); };

    function size() {
      w = canvas.width = Math.max(1, canvas.clientWidth * dpr);
      h = canvas.height = Math.max(1, canvas.clientHeight * dpr);
    }
    function seed(p, first) {
      p.x = Math.random() * w;
      p.y = first ? Math.random() * h : (spec.vy[0] > 0 ? -30 * dpr : h + 30 * dpr);
      p.r = rnd(spec.r[0], spec.r[1]) * dpr;
      p.vy = rnd(spec.vy[0], spec.vy[1]) * dpr;
      p.vx = (Math.random() - 0.5) * spec.vx * dpr;
      p.a = rnd(spec.a[0], spec.a[1]);
      p.rot = Math.random() * 6.283;
      p.vr = (Math.random() - 0.5) * 0.012;
      p.ph = Math.random() * 6.283;
    }
    function build() { ps = []; for (var i = 0; i < spec.n; i++) { var p = {}; seed(p, true); ps.push(p); } }

    function draw(t) {
      if (!live) { raf = 0; return; }
      // drifting petals read the same at 30fps, at half the paint
      if (t - prev < 32) { raf = requestAnimationFrame(draw); return; }
      prev = t;
      cx.clearRect(0, 0, w, h);

      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.y += p.vy; p.x += p.vx + Math.sin(t * 0.0004 + p.ph) * 0.12 * dpr; p.rot += p.vr;
        if (p.y < -60 * dpr || p.y > h + 60 * dpr) seed(p, false);

        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
        cx.globalAlpha = p.a * (0.7 + 0.3 * Math.sin(t * 0.0006 + p.ph));
        if (mode === 'thread') {
          cx.strokeStyle = accent; cx.lineWidth = 1 * dpr; cx.globalAlpha *= 0.8;
          cx.beginPath(); cx.moveTo(0, -p.r); cx.lineTo(0, p.r); cx.stroke();
        } else if (mode === 'grain' || mode === 'bloom') {
          /* bunga rampai: shreds of rose petal turning on their own axis as
             they rise, so each one reads as a surface rather than a speck. */
          cx.scale(0.42 + 0.58 * Math.abs(Math.cos(t * 0.0009 + p.ph)), 1);
          // soft rose, with the odd gold petal among them — nothing dark
          cx.fillStyle = cols[i % cols.length];
          cx.globalAlpha *= i % 4 === 3 ? 0.7 : 1;
          petalPath(p.r);
          cx.fill();
        } else if (mode === 'orb') {
          /* a pelita's glow: a radial falloff rather than a blurred disc —
             canvas filter blur re-renders the whole surface every frame */
          var g = cx.createRadialGradient(0, 0, 0, 0, 0, p.r);
          g.addColorStop(0, accent); g.addColorStop(0.45, accent); g.addColorStop(1, 'transparent');
          cx.fillStyle = g;
          cx.beginPath(); cx.arc(0, 0, p.r, 0, 6.283); cx.fill();
        } else {
          cx.fillStyle = accent;
          cx.beginPath(); cx.arc(0, 0, p.r, 0, 6.283); cx.fill();
        }
        cx.restore();
      }
      raf = requestAnimationFrame(draw);
    }

    size(); build();
    addEventListener('resize', function () { size(); build(); }, { passive: true });

    // only run while the section is actually on screen
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        live = en.isIntersecting;
        if (live && !raf) raf = requestAnimationFrame(draw);
      });
    }, { rootMargin: '10% 0px' });
    io.observe(canvas.parentElement || canvas);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { live = false; }
      else { live = true; if (!raf) raf = requestAnimationFrame(draw); }
    });
  };

  /* ----------------------------------------------------------- line tracing */
  /* Draws an imported line drawing the way a hand would. Path lengths are
     measured at runtime with getTotalLength(), so any CC0 SVG can be dropped in
     without hand-computing dasharrays. Longest strokes go first, which is the
     order the shape actually reads in.                                       */
  FX.trace = function (host) {
    if (!host) return;
    var paths = $$('path', host);
    if (!paths.length) return;
    var items = paths.map(function (el) {
      var len = 0;
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
      return { el: el, len: len };
    }).filter(function (i) { return i.len > 1; });
    if (!items.length) return;

    if (reduce) return;                       // leave it drawn, no animation
    items.sort(function (a, b) { return b.len - a.len; });
    items.forEach(function (it, i) {
      it.el.style.strokeDasharray = it.len;
      it.el.style.strokeDashoffset = it.len;
      it.el.style.setProperty('--i', i);
    });
    host.classList.add('trace-armed');

    var sec = host.closest('[data-play]') || host;
    var run = function () {
      items.forEach(function (it, i) {
        // slower and more deliberate: a hand drawing, not a machine plotting
        var dur = Math.min(3.6, 1.0 + it.len / 520);
        it.el.style.transition = 'stroke-dashoffset ' + dur.toFixed(2) + 's cubic-bezier(.22,.7,.25,1) ' +
          (0.35 + i * 0.105).toFixed(2) + 's';
        it.el.style.strokeDashoffset = '0';
      });
      host.classList.add('trace-on');
    };
    if (sec.classList.contains('played')) run();
    else new MutationObserver(function (m, o) {
      if (sec.classList.contains('played')) { run(); o.disconnect(); }
    }).observe(sec, { attributes: true, attributeFilter: ['class'] });
  };

  /* -------------------------------------------------------------- accordion */
  /* details/summary cannot transition its own height, so the open and close are
     driven here: the panel grows from nothing while its text resolves out of a
     blur. Without JavaScript the browser's own open/close still works.        */
  FX.accordion = function () {
    $$('details.faq').forEach(function (d) {
      var sum = d.querySelector('summary'), body = d.querySelector('div');
      if (!sum || !body) return;
      sum.addEventListener('click', function (e) {
        e.preventDefault();
        if (reduce) { d.open = !d.open; return; }
        if (d.open) {
          body.style.height = body.scrollHeight + 'px';
          d.classList.add('shutting');
          requestAnimationFrame(function () { body.style.height = '0px'; });
          body.addEventListener('transitionend', function done(ev) {
            if (ev.propertyName !== 'height') return;
            d.open = false; d.classList.remove('shutting'); body.style.height = '';
            body.removeEventListener('transitionend', done);
          });
        } else {
          d.open = true;
          var h = body.scrollHeight;
          body.style.height = '0px';
          requestAnimationFrame(function () { body.style.height = h + 'px'; });
          body.addEventListener('transitionend', function done(ev) {
            if (ev.propertyName !== 'height') return;
            body.style.height = 'auto';
            body.removeEventListener('transitionend', done);
          });
        }
      });
    });
  };

  /* ------------------------------------------------------------ smooth scroll */
  /* The wheel moves a target, and the page eases toward it. Real scroll
     position still changes, so sticky headers, hash links, IntersectionObserver
     and the scrollbar all keep working — this only softens the arrival.
     A touch screen already has inertia of its own and is left alone, as is
     prefers-reduced-motion.                                                   */
  FX.smooth = function () {
    if (reduce || !fine) return;
    var EASE = 0.12, doc = root;   // per 60fps frame, normalised below
    var target = scrollY, current = scrollY, raf = 0, driving = false, last = 0;

    doc.style.scrollBehavior = 'auto';   // ours stands in for the native one
    var limit = function () { return Math.max(0, doc.scrollHeight - innerHeight); };
    var clamp = function (v) { return Math.max(0, Math.min(limit(), v)); };

    function frame(now) {
      var d = target - current;
      if (Math.abs(d) < 0.4) {
        current = target; raf = 0; last = 0; driving = false; scrollTo(0, current); return;
      }
      // eased by elapsed time, so it settles the same on a 30Hz or a 120Hz screen
      var dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      current += d * (1 - Math.pow(1 - EASE, dt / 16.67));
      driving = true;
      scrollTo(0, current);
      raf = requestAnimationFrame(frame);
    }
    function push(to) {
      target = clamp(to);
      if (!raf) { current = scrollY; last = 0; raf = requestAnimationFrame(frame); }
    }
    FX.scrollTo = push;

    /* A panel with a scroll of its own — a long select, an overflowing box —
       keeps its wheel. Only the page itself is eased. */
    function ownScroll(node, dy) {
      for (var el = node; el && el !== document.body; el = el.parentElement) {
        if (el.scrollHeight - el.clientHeight <= 1) continue;
        var oy = getComputedStyle(el).overflowY;
        if (oy !== 'auto' && oy !== 'scroll') continue;
        if (dy < 0 && el.scrollTop > 0) return true;
        if (dy > 0 && el.scrollTop < el.scrollHeight - el.clientHeight - 1) return true;
      }
      return false;
    }

    addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.defaultPrevented) return;       // pinch zoom stays native
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (ownScroll(e.target, e.deltaY)) return;
      e.preventDefault();
      var m = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
      push(target + e.deltaY * m);
    }, { passive: false });

    // the keyboard gets the same easing rather than a jump
    var KEYS = { PageDown: 0.85, PageUp: -0.85, ArrowDown: 0.10, ArrowUp: -0.10, ' ': 0.85 };
    addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Home') { e.preventDefault(); return push(0); }
      if (e.key === 'End')  { e.preventDefault(); return push(limit()); }
      var k = KEYS[e.key === ' ' && e.shiftKey ? 'PageUp' : e.key];
      if (k == null) return;
      e.preventDefault();
      push(target + innerHeight * k);
    });

    // an in-page link glides instead of jumping
    addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var to = document.getElementById(id.slice(1));
      if (!to) return;
      e.preventDefault();
      var head = $('.hdr, header[class]');
      var off = head && getComputedStyle(head).position === 'sticky' ? head.offsetHeight : 0;
      push(to.getBoundingClientRect().top + scrollY - off - 8);
      if (history.replaceState) history.replaceState(null, '', id);
      to.setAttribute('tabindex', '-1');
    });

    /* Anything that moves the page by other means — a scrollbar drag, a
       scrollIntoView, a browser restore — takes the easing with it rather
       than fighting it. */
    addEventListener('scroll', function () {
      if (driving) return;
      target = current = scrollY;
    }, { passive: true });
    addEventListener('resize', function () { target = current = scrollY; }, { passive: true });
  };

  /* -------------------------------------------------------------- boot order */
  function boot() {
    FX.smooth();
    $$('[data-split]').forEach(FX.split);
    FX.grain($('[data-grain]'), { alpha: window.GRAIN_ALPHA || 26 });
    FX.light($('[data-light]'), window.LIGHT_OPTS);
    FX.scroll();
    $$('[data-field]').forEach(FX.field);
    $$('[data-trace]').forEach(FX.trace);
    FX.play();
    FX.accordion();
    FX.spotlight($('[data-spot]'));
    FX.headerNames();
    $$('[data-petals]').forEach(function (c) { FX.petals(c, window.PETALS || {}); });
    FX.open();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.FX = FX;
})();
