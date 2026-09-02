/* =============================================================================
   SSBA — shared behaviour for both designs.
   Requires window.CONTENT (content.js) and window.CONFIG (set per page).
   Everything degrades gracefully: with no backend it runs in demo mode, and
   with JavaScript disabled the page is still a readable invitation.
   ============================================================================= */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFG = window.CONFIG || {};
  var C   = window.CONTENT || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------------------------------------------------------- language */
  var LANGS = ['ms', 'en'];
  var qs = new URLSearchParams(location.search);
  var lang = qs.get('lang') || store.get('ssba.lang') || (/^ms|^id/i.test(navigator.language || '') ? 'ms' : 'ms');
  if (LANGS.indexOf(lang) < 0) lang = 'ms';

  function t(key) {
    function dig(root) {
      return String(key).split('.').reduce(function (o, k) { return (o == null ? undefined : o[k]); }, root);
    }
    var v = dig(C[lang]);
    if (v === undefined) v = dig(C.en);
    return v === undefined ? '' : v;
  }
  function pick(obj) { // {ms,en} → string for current language
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] != null ? obj[lang] : (obj.en != null ? obj.en : '');
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0) return;
    lang = l; store.set('ssba.lang', l); apply();
  }

  function apply() {
    document.documentElement.setAttribute('lang', lang);
    $$('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v === '' || typeof v === 'object') return;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, v);
      else if (el.hasAttribute('data-i18n-html')) el.innerHTML = v;
      else el.textContent = v;
    });
    $$('[data-lang-btn]').forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-on', on);
    });
    var mt = t('meta.title'); if (mt) document.title = mt;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.desc'));

    renderSacred(); renderHosts(); renderStory(); renderEvents(); renderSchedule();
    renderTravel(); renderFaq(); renderRsvpEvents(); renderWishes(); tickCountdown();
    document.dispatchEvent(new CustomEvent('ssba:lang', { detail: { lang: lang } }));
  }

  /* ------------------------------------------------------------ sacred texts */
  function renderSacred() {
    var s = C.sacred || {};
    $$('[data-sacred]').forEach(function (host) {
      var which = host.getAttribute('data-sacred');
      var d = s[which]; if (!d) return;
      var parts = [];
      if (d.ar) parts.push('<p class="sacred__ar" dir="rtl" lang="ar">' + esc(d.ar) + '</p>');
      if (host.hasAttribute('data-sacred-tr') && d.tr) parts.push('<p class="sacred__tr">' + esc(d.tr) + '</p>');
      if (!host.hasAttribute('data-sacred-ar-only')) {
        var meaning = pick({ ms: d.ms, en: d.en });
        if (meaning) parts.push('<p class="sacred__meaning">' + esc(meaning) + '</p>');
      }
      var ref = d.ref ? pick(d.ref) : (d.src ? pick(d.src) : '');
      if (ref && !host.hasAttribute('data-sacred-noref')) parts.push('<p class="sacred__ref">' + esc(ref) + '</p>');
      host.innerHTML = parts.join('');
    });
  }

  /* -------------------------------------------------------------------- hosts */
  function renderHosts() {
    var host = $('[data-hosts]'); if (!host) return;
    var H = C.hosts || {}, side = function (names) { return names.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join(''); };
    host.innerHTML =
      '<div class="hosts__side">' +
        '<p class="hosts__label">' + esc(t('hostsBlock.groomSide')) + '</p>' +
        '<ul class="hosts__names">' + side(H.groom || []) + '</ul>' +
      '</div>' +
      '<span class="hosts__div" aria-hidden="true"></span>' +
      '<div class="hosts__side">' +
        '<p class="hosts__label">' + esc(t('hostsBlock.brideSide')) + '</p>' +
        '<ul class="hosts__names">' + side(H.bride || []) + '</ul>' +
      '</div>';
  }

  /* -------------------------------------------------------------------- story */
  var _kh = null;
  function khatamMarkup() {
    if (_kh === null) { var tpl = $('template[data-khatam]'); _kh = tpl ? tpl.innerHTML : ''; }
    return _kh;
  }

  function renderStory() {
    var host = $('[data-story-beats]'); if (!host) return;
    var beats = t('story.beats') || [];
    host.innerHTML = beats.map(function (b, i) {
      return '<article class="beat" data-seq>' +
        '<div class="beat__art">' +
          // PHOTO SLOT — set --img on .plate__img to a photograph and the
          // constructed geometry behind it simply stops showing through.
          '<div class="plate' + (i % 2 ? ' plate--wide' : '') + '" data-open>' +
            '<div class="plate__img" data-parallax="0.18" style="background-image:var(--img-' + (i + 1) + ',none)"></div>' +
            '<div class="plate__kh" aria-hidden="true">' + khatamMarkup() + '</div>' +
            '<p class="plate__cap">' + esc(b.k) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="beat__body">' +
          '<p class="beat__kick"><em>' + esc(b.k) + '</em><i>' + esc(b.y) + '</i></p>' +
          '<h3 class="beat__title">' + esc(b.t) + '</h3>' +
          '<p class="beat__text">' + esc(b.b) + '</p>' +
          (b.q ? '<blockquote class="beat__quote"><p>' + esc(b.q) + '</p><cite>' + esc(b.qa || '') + '</cite></blockquote>' : '') +
        '</div>' +
      '</article>';
    }).join('');
    if (window.FX) { $$('[data-rise]', host).forEach(function (el) { el.classList.add('in'); }); }
  }

  /* ------------------------------------------------------------------- events */
  function renderEvents() {
    var host = $('[data-events]'); if (!host) return;
    var all = C.events || [];
    host.innerHTML = all.map(function (ev, i) {
      var rows = [[t('labels.date'), esc(pick(ev.dateLong)), '']];
      if (!ev.tbc) {
        rows.push([t('labels.time'), esc(pick(ev.time)), '']);
        rows.push([t('labels.venue'), esc(pick(ev.venue)), ev.address ? esc(ev.address) : '']);
        if (ev.dress) rows.push([t('labels.dress'), esc(pick(ev.dress)), '']);
      }
      var acts = [];
      if (ev.maps) acts.push('<a class="btn btn--quiet" href="' + ev.maps + '" target="_blank" rel="noopener">' + esc(t('labels.googleMaps')) + '</a>');
      if (ev.waze) acts.push('<a class="btn btn--quiet" href="' + ev.waze + '" target="_blank" rel="noopener">' + esc(t('labels.waze')) + '</a>');
      if (ev.start) acts.push('<button class="btn btn--quiet" type="button" data-ics="' + ev.id + '">' + esc(t('labels.addToCalendar')) + '</button>');
      var tag = ev.invitationOnly ? t('labels.invitationOnly') : (ev.tbc ? t('labels.detailsToFollow') : '');

      return '<article class="card' + (ev.kind === 'primary' ? ' card--hero' : '') + (ev.tbc ? ' card--tbc' : '') + '" data-ev="' + ev.id + '" data-seq>' +
        '<header><p class="card__eyebrow">' + esc(pick(ev.eyebrow)) + '</p>' +
        '<h3 class="card__title">' + esc(pick(ev.title)) + '</h3></header>' +
        '<div class="card__body">' +
          (tag ? '<p class="card__tag">' + esc(tag) + '</p>' : '') +
          '<dl class="card__meta">' + rows.map(function (r) {
            return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + (r[2] ? '<small>' + r[2] + '</small>' : '') + '</dd></div>';
          }).join('') + '</dl>' +
          (ev.note ? '<p class="card__note">' + esc(pick(ev.note)) + '</p>' : '') +
          (acts.length ? '<div class="card__acts">' + acts.join('') + '</div>' : '') +
        '</div>' +
      '</article>';
    }).join('');
    var dots = $('[data-rail-dots]');
    if (dots) dots.innerHTML = all.map(function (_, i) {
      return '<i data-rail-dot class="' + (i === 0 ? 'on' : '') + '"></i>';
    }).join('');
  }

  function renderSchedule() {
    var host = $('[data-schedule]'); if (!host) return;
    host.innerHTML = (C.schedule || []).map(function (x) {
      return '<li class="run" data-seq><span class="run__t">' + esc(x.time) + '</span>' +
        '<span class="run__b"><b>' + esc(pick(x.title)) + '</b>' +
        (x.desc ? '<span>' + esc(pick(x.desc)) + '</span>' : '') + '</span></li>';
    }).join('');
  }

  function renderTravel() {
    var host = $('[data-travel]'); if (!host) return;
    host.innerHTML = (t('travel.items') || []).map(function (i) {
      return '<div class="tip" data-seq><h3>' + esc(i.t) + '</h3><p>' + esc(i.b) + '</p></div>';
    }).join('');
  }

  function renderFaq() {
    var host = $('[data-faq]'); if (!host) return;
    host.innerHTML = (t('faq.items') || []).map(function (i) {
      return '<details class="faq" data-seq><summary>' + esc(i.q) + '<span class="mk" aria-hidden="true"></span></summary><div><p>' + esc(i.a) + '</p></div></details>';
    }).join('');
  }

  /* ---------------------------------------------------------------- countdown */
  /* Built once, then only the digits are patched. Re-rendering the markup every
     second was restarting every entrance animation in the section once a
     second, which is what made it flicker. */
  var cdBuilt = false;
  function tickCountdown() {
    var host = $('[data-countdown]'); if (!host) return;
    var target = new Date(CFG.countdownTo || '2026-10-10T10:00:00+08:00').getTime();
    var diff = Math.max(0, target - Date.now());
    var units = [
      [Math.floor(diff / 864e5), 'days'],
      [Math.floor(diff / 36e5) % 24, 'hours'],
      [Math.floor(diff / 6e4) % 60, 'minutes'],
      [Math.floor(diff / 1e3) % 60, 'seconds']
    ];
    if (!cdBuilt || host.children.length !== units.length) {
      host.innerHTML = units.map(function (u) {
        return '<div class="cd__unit" data-seq><span class="cd__num foil"></span>' +
               '<span class="cd__label"></span></div>';
      }).join('');
      cdBuilt = true;
    }
    units.forEach(function (u, i) {
      var unit = host.children[i]; if (!unit) return;
      var num = String(u[0]).padStart(2, '0');
      var numEl = unit.firstChild, labEl = unit.lastChild;
      if (numEl.textContent !== num) numEl.textContent = num;
      var lab = t('countdown.' + u[1]);
      if (labEl.textContent !== lab) labEl.textContent = lab;
    });
    if (diff === 0) { var d = $('[data-countdown-done]'); if (d) d.hidden = false; }
  }
  /* a language change relabels without rebuilding */
  setInterval(tickCountdown, 1000);

  /* ----------------------------------------------------------------- calendar */
  function icsFor(ev) {
    var stamp = function (d) { return new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
    var txt = function (s) { return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;'); };
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SSBA//Wedding//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + ev.id + '@ssba-wedding', 'DTSTAMP:' + stamp(Date.now()),
      'DTSTART:' + stamp(ev.start), 'DTEND:' + stamp(ev.end || (new Date(ev.start).getTime() + 3 * 36e5)),
      'SUMMARY:' + txt(t('calendar.summary') + ' — ' + pick(ev.title)),
      'LOCATION:' + txt(pick(ev.venue) + (ev.address ? ', ' + ev.address : '')),
      'DESCRIPTION:' + txt(t('calendar.description')), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ics]'); if (!b) return;
    var ev = (C.events || []).filter(function (x) { return x.id === b.getAttribute('data-ics'); })[0];
    if (!ev || !ev.start) return;
    var ics = icsFor(ev);
    try {
      var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = 'ssba-' + ev.id + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
    } catch (err) {}
    var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(t('calendar.summary') + ' — ' + pick(ev.title)) +
      '&dates=' + ics.match(/DTSTART:(\w+)/)[1] + '/' + ics.match(/DTEND:(\w+)/)[1] +
      '&location=' + encodeURIComponent(pick(ev.venue)) +
      '&details=' + encodeURIComponent(t('calendar.description'));
    toast(t('toast.calendar'), { href: g, label: t('labels.googleCalendar') });
  });

  /* -------------------------------------------------------------------- toast */
  var toastTimer;
  function toast(msg, link) {
    var el = $('#toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'toast'; el.className = 'toast';
      el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = esc(msg) + (link ? ' <a href="' + link.href + '" target="_blank" rel="noopener">' + esc(link.label) + '</a>' : '');
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, link ? 8000 : 3400);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var text = b.getAttribute('data-copy');
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(function () { toast(t('toast.copied')); })
      .catch(function () { toast(t('toast.copyFail')); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-btn]'); if (b) setLang(b.getAttribute('data-lang-btn'));
  });

  /* -------------------------------------------------------- personalised link */
  var guest = (qs.get('to') || '').trim().slice(0, 80);
  if (guest) {
    $$('[data-guest-name]').forEach(function (el) { el.textContent = guest; });
    $$('[data-guest-wrap]').forEach(function (el) { el.hidden = false; });
  }

  /* The opening sequence lives in fx.js (the preloader). */

  /* -------------------------------------------------------------------- music */
  var musicBtn = $('[data-music]');
  if (musicBtn) {
    if (!CFG.audio) { musicBtn.hidden = true; }
    else {
      var audio = new Audio(CFG.audio); audio.loop = true; audio.volume = 0.35; audio.preload = 'none';
      var setState = function (on) { musicBtn.classList.toggle('is-on', on); musicBtn.setAttribute('aria-pressed', String(on)); };
      musicBtn.addEventListener('click', function () {
        if (audio.paused) audio.play().then(function () { setState(true); }).catch(function () { setState(false); });
        else { audio.pause(); setState(false); }
      });
      document.addEventListener('ssba:open', function () {
        if (CFG.audioOnOpen) audio.play().then(function () { setState(true); }).catch(function () {});
      });
    }
  }

  /* ------------------------------------------------------------------- reveal */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) {
      // Anything already on screen stays visible: never hide content at rest.
      if (el.getBoundingClientRect().top < window.innerHeight * 1.05) { el.classList.add('is-in'); return; }
      el.classList.add('will-reveal'); io.observe(el);
    });
    setTimeout(function () { $$('.will-reveal:not(.is-in)').forEach(function (el) { el.classList.add('is-in'); }); }, 8000);
  }

  /* ---------------------------------------------------------------- active nav */
  function initNav() {
    var links = $$('[data-nav] a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (a && en.isIntersecting) { links.forEach(function (x) { x.classList.remove('is-active'); }); a.classList.add('is-active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* --------------------------------------------------------------------- RSVP */
  var form = $('#rsvp-form');

  function renderRsvpEvents() {
    var box = $('[data-rsvp-events]'); if (!box) return;
    var chosen = ($$('input[name="events"]:checked', box) || []).map(function (i) { return i.value; });
    box.innerHTML = (C.events || []).filter(function (e) { return e.rsvp !== false; }).map(function (ev) {
      var sub = ev.tbc ? t('labels.detailsToFollow') : pick(ev.dateShort || ev.dateLong);
      return '<label class="choice">' +
        '<input type="checkbox" name="events" value="' + ev.id + '"' + (chosen.indexOf(ev.id) >= 0 ? ' checked' : '') + '>' +
        '<span class="choice__box" aria-hidden="true"></span>' +
        '<span class="choice__text"><span class="choice__title">' + esc(pick(ev.title)) + '</span>' +
        '<span class="choice__sub">' + esc(pick(ev.eyebrow)) + ' · ' + esc(sub) + '</span></span>' +
      '</label>';
    }).join('');
  }

  if (form) {
    // A personalised link (?to=) should also start the guest's reply for them.
    if (guest && form.name && !form.name.value) form.name.value = guest;

    var steps = $$('[data-step]', form);
    var step = 0;
    var progress = $('[data-progress]', form);
    var live = $('[data-step-live]', form);

    function declining() { var r = form.querySelector('input[name="attending"]:checked'); return r && r.value === 'no'; }
    function visible(i) { return !(declining() && steps[i] && steps[i].getAttribute('data-step') === 'detail'); }

    function paint() {
      steps.forEach(function (s, i) { s.hidden = i !== step; });
      if (progress) {
        progress.innerHTML = steps.map(function (s, i) {
          return '<li class="' + (i === step ? 'is-now' : '') + (i < step ? ' is-done' : '') + '">' +
                 '<i aria-hidden="true"></i><b>' + esc(t('rsvp.steps.' + s.getAttribute('data-step'))) + '</b></li>';
        }).join('');
      }
      if (live) live.textContent = String(t('rsvp.stepOf')).replace('{n}', step + 1).replace('{total}', steps.length);
      var card = $('.rsvp__card', form) || form;
      if (step > 0) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
    function go(dir) {
      var n = step + dir;
      while (steps[n] && !visible(n)) n += dir;
      step = Math.max(0, Math.min(steps.length - 1, n));
      if (steps[step].getAttribute('data-step') === 'review') buildReview();
      paint();
    }
    function fieldError(el, msg) {
      var field = el.closest('.field') || el.parentElement;
      var box = field ? field.querySelector('.field__error') : null;
      if (box) { box.textContent = msg || ''; box.hidden = !msg; }
      if (el.setAttribute) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    function groupError(name, msg) {
      var box = form.querySelector('[data-error-for="' + name + '"]');
      if (box) { box.textContent = msg || ''; box.hidden = !msg; }
    }
    function validate() {
      var cur = steps[step], ok = true, firstBad = null;
      $$('input[required], textarea[required]', cur).forEach(function (inp) {
        if (inp.type === 'radio' || inp.type === 'checkbox') return;
        var v = inp.value.trim(), msg = '';
        if (!v) msg = t('rsvp.errors.required');
        else if (inp.getAttribute('data-validate') === 'phone' && !/^[+\d][\d\s\-().]{6,}$/.test(v)) msg = t('rsvp.errors.phone');
        else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = t('rsvp.errors.email');
        fieldError(inp, msg);
        if (msg && !firstBad) firstBad = inp;
        if (msg) ok = false;
      });
      // optional email, validated only when filled
      var em = cur.querySelector('input[type="email"]:not([required])');
      if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
        fieldError(em, t('rsvp.errors.email')); ok = false; if (!firstBad) firstBad = em;
      } else if (em) fieldError(em, '');

      if (cur.getAttribute('data-step') === 'attend') {
        if (!form.querySelector('input[name="attending"]:checked')) { groupError('attending', t('rsvp.errors.required')); ok = false; }
        else {
          groupError('attending', '');
          if (!declining() && !$$('input[name="events"]:checked', form).length) { groupError('events', t('rsvp.errors.events')); ok = false; }
          else groupError('events', '');
        }
      }
      if (cur.getAttribute('data-step') === 'detail') {
        var total = (+form.adults.value || 0) + (+form.children.value || 0);
        if (total < 1) { groupError('pax', t('rsvp.errors.pax')); ok = false; } else groupError('pax', '');
      }
      if (!ok && firstBad) firstBad.focus({ preventScroll: false });
      return ok;
    }
    function collect() {
      var fd = new FormData(form), d = {};
      fd.forEach(function (v, k) { if (k !== 'events') d[k] = v; });
      d.events = fd.getAll('events');
      if (declining()) { d.adults = 0; d.children = 0; d.events = []; }
      d.lang = lang; d.design = CFG.design || ''; d.page = location.pathname;
      return d;
    }
    function buildReview() {
      var host = $('[data-review]', form); if (!host) return;
      var d = collect();
      var evNames = (C.events || []).filter(function (e) { return d.events.indexOf(e.id) >= 0; })
                                    .map(function (e) { return pick(e.title); }).join(' · ');
      var rows = [
        [t('rsvp.name'), d.name, 'who'],
        [t('rsvp.phone'), d.phone, 'who'],
        [t('rsvp.attending'), d.attending === 'yes' ? t('rsvp.yes') : t('rsvp.no'), 'attend']
      ];
      if (d.attending === 'yes') {
        rows.push([t('rsvp.whichEvents'), evNames, 'attend']);
        rows.push([t('rsvp.pax'), (+d.adults || 0) + ' ' + t('rsvp.adults').toLowerCase() +
                   ((+d.children || 0) ? ', ' + d.children + ' ' + t('rsvp.children').toLowerCase() : ''), 'detail']);
        if (d.dietary) rows.push([t('rsvp.dietary'), d.dietary, 'detail']);
      }
      if (d.message) rows.push([t('rsvp.message'), d.message, 'detail']);
      host.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
        return '<div class="review__row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) +
               '<button type="button" class="review__edit" data-goto="' + r[2] + '">' + esc(t('rsvp.edit')) + '</button></dd></div>';
      }).join('');
    }

    form.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { if (validate()) go(1); return; }
      if (e.target.closest('[data-prev]')) { go(-1); return; }
      var jump = e.target.closest('[data-goto]');
      if (jump) {
        var name = jump.getAttribute('data-goto');
        steps.forEach(function (s, i) { if (s.getAttribute('data-step') === name) { step = i; paint(); } });
        return;
      }
      var stepper = e.target.closest('[data-stepper]');
      if (stepper) {
        var inp = form.querySelector('input[name="' + stepper.getAttribute('data-stepper') + '"]');
        var min = +inp.min || 0, max = +inp.max || 20;
        inp.value = Math.max(min, Math.min(max, (+inp.value || 0) + (+stepper.getAttribute('data-delta'))));
        groupError('pax', '');
      }
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'attending') {
        form.classList.toggle('is-declining', declining());
        groupError('attending', '');
      }
      if (e.target.name === 'events') groupError('events', '');
    });
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') fieldError(e.target, '');
    });

    var saved = store.get('ssba.rsvp', null);
    if (saved && saved.name) {
      var note = $('[data-rsvp-saved]');
      if (note) {
        note.hidden = false;
        var slot = $('[data-rsvp-saved-text]', note);
        if (slot) slot.textContent = String(t('rsvp.savedNote')).replace('{name}', saved.name);
      }
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-rsvp-edit]')) return;
      var d = store.get('ssba.rsvp', {}) || {};
      Object.keys(d).forEach(function (k) {
        $$('[name="' + k + '"]', form).forEach(function (el) {
          if (el.type === 'radio') el.checked = el.value === d[k];
          else if (el.type === 'checkbox') el.checked = Array.isArray(d[k]) && d[k].indexOf(el.value) >= 0;
          else el.value = d[k];
        });
      });
      form.classList.toggle('is-declining', d.attending === 'no');
      var box = $('#rsvp-success'); if (box) box.hidden = true;
      var note2 = $('[data-rsvp-saved]'); if (note2) note2.hidden = true;
      form.hidden = false; step = 0; paint();
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var d = collect();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true; btn.classList.add('is-busy');
      var done = function () { btn.disabled = false; btn.classList.remove('is-busy'); };
      var ok = function () {
        store.set('ssba.rsvp', d);
        if (d.message && form.querySelector('input[name="shareWish"]:checked')) {
          addWish({ name: d.name, wish: d.message });
        }
        success(d); done();
      };
      if (!CFG.endpoint) { setTimeout(ok, 700); return; }   // demo mode
      fetch(CFG.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(d), redirect: 'follow'
      }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(ok)
        .catch(function (err) { console.warn('RSVP failed', err); toast(t('rsvp.errors.network')); done(); });
    });

    function success(d) {
      var box = $('#rsvp-success'); if (!box) return;
      form.hidden = true; box.hidden = false;
      var yes = d.attending === 'yes';
      var count = (+d.adults || 0) + (+d.children || 0);
      var ttl = $('[data-success-title]', box), body = $('[data-success-body]', box);
      if (ttl) ttl.textContent = yes ? t('rsvp.success.titleYes') : t('rsvp.success.titleNo');
      if (body) body.textContent = (yes ? t('rsvp.success.bodyYes') : t('rsvp.success.bodyNo'))
        .replace('{name}', d.name).replace('{count}', count);
      box.setAttribute('tabindex', '-1');
      box.focus({ preventScroll: true });
      box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    paint();
  }

  /* ------------------------------------------------------------------- wishes */
  var wishes = store.get('ssba.wishes', []);
  function addWish(w) {
    wishes.unshift({ name: w.name, wish: w.wish, t: Date.now() });
    store.set('ssba.wishes', wishes.slice(0, 60));
    renderWishes();
    if (CFG.endpoint) {
      fetch(CFG.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'wish', name: w.name, wish: w.wish }) }).catch(function () {});
    }
  }
  function renderWishes() {
    var host = $('[data-wishes]'); if (!host) return;
    var seeds = (C.seedWishes || []).map(function (w) { return { name: w.name, wish: pick(w.wish), seed: true }; });
    var all = wishes.concat(seeds).slice(0, 12);
    host.innerHTML = all.map(function (w) {
      return '<li class="wish' + (w.seed ? ' wish--seed' : '') + '" data-seq>' +
        '<p class="wish__text">' + esc(w.wish) + '</p>' +
        '<p class="wish__by">' + esc(w.name) + (w.seed ? ' <span class="wish__tag">' + esc(t('wishes.example')) + '</span>' : '') + '</p>' +
      '</li>';
    }).join('');
  }
  var wishForm = $('#wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = wishForm.wname.value.trim(), w = wishForm.wish.value.trim();
      if (!n || !w) { toast(t('rsvp.errors.required')); return; }
      addWish({ name: n, wish: w });
      wishForm.reset();
      toast(t('toast.wish'));
    });
    if (CFG.endpoint) {
      fetch(CFG.endpoint + '?type=wishes').then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok && j.wishes && j.wishes.length) { wishes = j.wishes; renderWishes(); } })
        .catch(function () {});
    }
  }

  /* --------------------------------------------------------------------- boot */
  apply();
  initReveal();
  initNav();
  window.SSBA = { t: t, pick: pick, setLang: setLang, toast: toast, get lang() { return lang; } };
})();
