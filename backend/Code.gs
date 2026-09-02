/**
 * Syed Saddiq & Bella Astillah — Wedding RSVP backend (Google Apps Script)
 * ---------------------------------------------------------------------------
 * Deploy:
 *  1. Create a Google Sheet. Rename the first tab to "RSVP" (optional: the script creates it).
 *  2. Extensions → Apps Script → paste this file → Save.
 *  3. Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone.
 *  4. Copy the Web app URL into CONFIG.endpoint in each design's index.html.
 *
 * The page POSTs JSON with Content-Type text/plain (avoids a CORS preflight, which
 * Apps Script cannot answer). Every submission is appended as one row; re-submissions
 * from the same phone number are appended too, and the latest row wins (see summary()).
 */
const SHEET_NAME = 'RSVP';
const WISHES_SHEET = 'Wishes';
const NOTIFY_EMAIL = '';          // e.g. 'planner@example.com' to get an email per RSVP (leave '' to disable)
const SEND_GUEST_CONFIRMATION = false; // set true to email guests who leave an email address

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.type === 'wish') return json_(appendWish_(data));
    return json_(appendRsvp_(data));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// GET ?type=wishes returns the latest approved wishes for the guestbook.
function doGet(e) {
  const type = (e.parameter && e.parameter.type) || 'ping';
  if (type === 'wishes') return json_({ ok: true, wishes: readWishes_(50) });
  return json_({ ok: true, service: 'ssba-rsvp', time: new Date().toISOString() });
}

function appendRsvp_(d) {
  const sh = sheet_(SHEET_NAME, [
    'Timestamp', 'Name', 'Phone', 'Email', 'Attending', 'Events', 'Adults', 'Children',
    'Dietary', 'Message', 'Language', 'Design', 'UserAgent'
  ]);
  const events = Array.isArray(d.events) ? d.events.join(', ') : (d.events || '');
  sh.appendRow([
    new Date(), s_(d.name), s_(d.phone), s_(d.email), s_(d.attending), events,
    Number(d.adults || 0), Number(d.children || 0), s_(d.dietary), s_(d.message),
    s_(d.lang), s_(d.design), s_(d.ua)
  ]);
  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, `RSVP: ${s_(d.name)} — ${s_(d.attending)}`,
      `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nAttending: ${d.attending}\nEvents: ${events}\nAdults: ${d.adults}\nChildren: ${d.children}\nDietary: ${d.dietary}\nMessage: ${d.message}`);
  }
  if (SEND_GUEST_CONFIRMATION && d.email && /.+@.+\..+/.test(d.email)) {
    MailApp.sendEmail(d.email, 'Your RSVP — Syed Saddiq & Bella Astillah',
      `Assalamualaikum ${d.name},\n\nThank you — your RSVP has been received.\n\nAttending: ${d.attending}\nEvents: ${events}\nGuests: ${d.adults} adult(s), ${d.children} child(ren)\n\nSaturday, 10 October 2026 · Level 118, Merdeka 118, Kuala Lumpur\n\nWith love,\nSyed Saddiq & Bella`);
  }
  return { ok: true };
}

function appendWish_(d) {
  const sh = sheet_(WISHES_SHEET, ['Timestamp', 'Name', 'Wish', 'Approved']);
  sh.appendRow([new Date(), s_(d.name), s_(d.wish), 'YES']); // set to NO in the sheet to hide a wish
  return { ok: true };
}

function readWishes_(limit) {
  const sh = sheet_(WISHES_SHEET, ['Timestamp', 'Name', 'Wish', 'Approved']);
  const rows = sh.getDataRange().getValues().slice(1).filter(r => String(r[3]).toUpperCase() !== 'NO');
  return rows.slice(-limit).reverse().map(r => ({ t: r[0], name: r[1], wish: r[2] }));
}

/** Build a headcount summary in a "Summary" tab: latest row per phone number wins. */
function summary() {
  const sh = sheet_(SHEET_NAME, []);
  const rows = sh.getDataRange().getValues().slice(1);
  const latest = {};
  rows.forEach(r => { latest[(r[2] || r[1] || '').toString().trim().toLowerCase()] = r; });
  const per = {};
  let yes = 0, no = 0, adults = 0, children = 0;
  Object.values(latest).forEach(r => {
    const attending = String(r[4]).toLowerCase().startsWith('y');
    if (attending) { yes++; adults += Number(r[6] || 0); children += Number(r[7] || 0);
      String(r[5]).split(',').map(x => x.trim()).filter(Boolean).forEach(ev => { per[ev] = (per[ev] || 0) + Number(r[6] || 0) + Number(r[7] || 0); });
    } else no++;
  });
  const out = sheet_('Summary', []);
  out.clear();
  out.appendRow(['Households attending', yes]); out.appendRow(['Households declined', no]);
  out.appendRow(['Adults', adults]); out.appendRow(['Children', children]); out.appendRow(['Total guests', adults + children]);
  out.appendRow([]); out.appendRow(['Per event', 'Guests']);
  Object.entries(per).forEach(([k, v]) => out.appendRow([k, v]));
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); if (headers.length) sh.appendRow(headers); sh.setFrozenRows(1); }
  return sh;
}
function s_(v) { return v == null ? '' : String(v).slice(0, 2000); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
