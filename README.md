# Syed Saddiq & Bella Astillah — Wedding RSVP

Two complete, self-contained wedding invitation sites for **Saturday, 10 October 2026**,
akad nikah at **Level 118, Menara Merdeka Maybank (Merdeka 118), Kuala Lumpur**,
with receptions to follow in Kuala Lumpur, Muar and Sabah.

Each design is one HTML file. No build server, no framework, no tracking. Drop
`design-a/index.html` or `design-b/index.html` on any host and it works.

---

## Four designs, one invitation

Open `index.html` — that is the chooser, and the only page that is not part of
the invitation. It shows all four side by side, each painted in its own colours.

The words, the running order, the bilingual copy and the RSVP are **identical in
all four**. Only the design changes. All four are daylight: the couple's stated
theme is all white with Arab and Islamic elements, so what varies is which kind
of white and what the white is made of. Each is named for the object it imitates.

| | Direction | Object | Display face |
|---|---|---|---|
| **01** | **Nur** · Gilded daylight | A gilded ivory card held up to a window | Cinzel |
| **02** | **Kertas** · Ink on paper | A broadsheet folded once, and a seal stamped in red | Playfair |
| **03** | **Kapur** · Plaster and shadow | A whitewashed courtyard at midday, and the arch that shades it | Italiana |
| **04** | **Mutiara** · Mother-of-pearl | A pearl-inlaid box, and a length of white silk | Bodoni Moda |

**Nur** is the brief read literally: ivory under a slow caustic light, one weight
of gilt, petals rising, the khatam behind the invitation as a watermark.

**Kertas** is the boldest and the furthest from convention — warm paper,
green-black ink, one lacquer red, no gold at all, left-aligned with the sections
numbering themselves in the margin.

**Kapur** is white on white with no metal anywhere. The groom's Hadhrami family
built in lime plaster, and the only ornament is the shadow a pointed arch throws
across the wall. It travels as you scroll.

**Mutiara** is the couture reading: pearl rather than ivory, with the nacre's own
iridescence moving across the names instead of gold.

### How a concept is built

`src/page.html` is the one template. `src/concepts/_base.css` holds every
component and reads only semantic tokens. A concept is therefore short — a
palette, four typefaces and its own personality — and lives in
`src/concepts/<id>.css`, registered in `src/concepts.cjs`.

Adding a fifth direction means writing one stylesheet and one registry entry.

## What guests can do

| | |
|---|---|
| Read in **Bahasa Melayu or English** | Full parity, not machine translation. The choice is remembered. |
| Open a **personalised invitation** | `?to=Keluarga%20Ahmad` greets them by name and starts their reply for them. |
| **Reply in four steps** | Who you are → attendance and which gatherings → guest count, dietary needs, a message → check your answers. Decliners skip the guest-count step entirely. |
| **Change their reply** | The same link reopens their answers until the deadline. |
| **Save the date** | An `.ics` download per event, with a Google Calendar link as a fallback. |
| **Find the venue** | Google Maps and Waze, plus MRT, tunnel-parking and arrival guidance. |
| **Leave a wish** | A guestbook, seeded with clearly-labelled examples until real ones arrive. |

Accessibility: every small-text colour clears **4.5:1** on every ground it sits on,
all controls are at least 44 px, errors are announced through `aria-live`, focus is
always visible, and `prefers-reduced-motion` is honoured in both CSS and JavaScript.

---

## Going live

### 1. Connect the RSVP form

1. Create a Google Sheet.
2. **Extensions → Apps Script**, paste `backend/Code.gs`, save.
3. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**.
4. Copy the Web App URL into `endpoint` in the `window.CONFIG` block near the bottom
   of `src/a/index.html` and `src/b/index.html`, then rebuild.

Leave `endpoint` empty and the form runs in **demo mode** — it validates, shows the
confirmation and remembers the reply locally, but sends nothing. Good for showing the
family. Run `summary()` in Apps Script any time for a headcount; the latest reply per
phone number wins, so edits do not double-count.

### 2. Edit the words

Everything guests read lives in `src/content.js`, in both languages side by side.
Change it there and rebuild — both designs update together.

### 3. Rebuild

```bash
node tools/build.cjs          # src/ -> design-a/index.html and design-b/index.html
node tools/test.cjs           # end-to-end check of both (needs playwright)
```

The build inlines the CSS, content and behaviour, and generates the Islamic geometry,
the arch, the contour map and the two silhouettes as SVG. Nothing is loaded at runtime
except Google Fonts.

### 4. Publish

Upload the chosen `design/<id>/index.html` as `index.html`. Netlify, Cloudflare Pages,
Vercel and GitHub Pages all work with no configuration. Both files carry
`noindex, nofollow` so the invitation stays off search engines — remove that meta tag
only if the couple wants it public.

---

## Before you launch — items to confirm

These are marked `← CONFIRM` in `src/content.js`. They are not yet public, so the
sites currently say so honestly rather than inventing detail.

1. **Akad nikah time.** Currently "waktu akan dimaklumkan". The countdown assumes
   10:00 (+08:00) — set `countdownTo` once the hour is fixed.
2. **The running order.** `schedule` uses em-dashes instead of times, under a visible
   "provisional" label. Fill in the real times.
3. **Reception dates and venues** for Kuala Lumpur, Muar and Sabah. Each card is in a
   "details to follow" state; the RSVP treats those three as registering interest.
   Remove `tbc: true` and fill in `time`, `venue`, `maps`, `waze`, `start` and `end`
   to turn a card into a full listing.
4. **Whether guests should wear white.** The guest guide currently invites them to.
   Note that some guests traditionally avoid white at a Malay wedding, so this
   should be the couple's explicit call.
5. **RSVP deadline.** Set to 12 September 2026 in `rsvp.deadline` and `rsvp.lead`.
   Set it earlier than the caterer's final headcount date.
6. **WhatsApp contacts.** Both footers carry a placeholder `wa.me/60000000000`.
7. **Guest capacity on Level 118**, which may cap what the RSVP should accept.
8. **A livestream link**, if the ceremony is broadcast, for guests who cannot attend.
9. **Photography.** This is the one thing that will lift both designs further. Every
   image bay is an arch-masked `.plate`, and until a photograph is dropped in it
   shows a lit ground with the constructed khatam inside, so the composition still
   reads as art-directed. To add photographs, set the custom properties on
   `.plate__img` — `--img-1` through `--img-4` for the four story bays — for example
   `:root{--img-1:url(assets/story-1.jpg)}`. Portrait crops at 3:4 suit the tall bays
   and 4:3 the wide one. Also add `assets/og.jpg` (1200×630) for the WhatsApp preview.

### Optional, currently off

* **Background music.** Set `audio` in `window.CONFIG` to an audio file. It is
  tap-to-play only, never autoplay.
* **Salam kaut / digital money gift.** Deliberately not included. Both sites say
  instead that presence and prayers are gift enough. If the family wants a DuitNow QR,
  add it to the `gift` section.

---

## Files

```
src/content.js       every word, in Bahasa Melayu and English
src/app.js           shared behaviour: language, RSVP, calendar, wishes, countdown
src/fx.js            motion and material: opening sequence, split type, grain,
                     caustic light, petals, parallax, the pinned rail
src/page.html        the one page template every concept is built from
src/concepts.cjs     the registry: names, premises, palettes, typefaces
src/concepts/        _base.css plus one short sheet per direction
src/chooser.html     the front door
backend/Code.gs      Google Apps Script RSVP endpoint
tools/build.cjs      inlines everything into design-a/ and design-b/
tools/patterns.cjs   generates the geometry, arch, contour map and silhouettes
tools/test.cjs       end-to-end check of both designs
tools/shot.cjs       screenshot helper
index.html           the chooser
design/<id>/         four ready-to-publish invitations
research/            sourced dossiers behind every fact on the sites
```

## A note on the facts

Every date, name and place on these sites is drawn from published reporting, collected
in `research/`. Family names, the Hijri date, the venue address, the MRT entrance and
the two elevations were all checked. Where something is not yet public it is shown as
not yet public. Nothing about politics, court proceedings or either family's past
appears anywhere on either site — this is a wedding invitation.
