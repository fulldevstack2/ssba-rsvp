/* =============================================================================
   The concept sheet.
   -----------------------------------------------------------------------------
   Four complete designs for one invitation. The words, the photographs, the
   running order and the RSVP are identical in all four — only the design
   changes. Each is named for the physical object it is imitating.

   All four are daylight. The couple's stated theme is all-white with Arab and
   Islamic elements, so none of these is a dark site; what varies is which kind
   of white, and what the white is made of.
   ============================================================================= */

const concepts = [
  {
    id: 'nur', ordinal: '01',
    name: 'Nur', tagline: 'Gilded daylight',
    object: 'A gilded ivory card, held up to a window.',
    structure: 'Full-screen panels, one idea per screen, that dissolve into one another.',
    premise:
      'A ceremony in twelve tableaux. Nothing scrolls past — each screen holds one thing, ' +
      'composed edge to edge, and gives way to the next through light rather than motion. ' +
      'Gilt on ivory, and the eight-point khatam is constructed on arrival.',
    display: 'Cinzel', body: 'Cormorant Garamond', util: 'Manrope', arabic: 'Amiri',
    fonts: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400..700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Manrope:wght@300;400;500&family=Amiri:wght@400;700&display=swap',
    themeColor: '#F7F2E9',
    swatches: [
      { name: 'Ivory',     value: '#F7F2E9' },
      { name: 'Gilt',      value: '#7E6733' },
      { name: 'Champagne', value: '#E4D3AE' },
      { name: 'Ink',       value: '#191410' }
    ],
    arabicClass: 'ar-naskh',
    layers: { light: true, petals: true, spot: false, shadow: false, nacre: false },
    runtime: {
      LIGHT_OPTS: { warm: 'rgba(255,244,214,0.58)', cool: 'rgba(214,180,110,0.30)', fade: 'rgba(247,242,233,0)' },
      PETALS: { dir: -1, count: 20, colors: ['#FFFDFA', '#F7EDE9', '#EFDCD8', '#FAF3EC'] },
      GRAIN_ALPHA: 26
    }
  },
  {
    id: 'kertas', ordinal: '02',
    name: 'Kertas', tagline: 'Ink on paper',
    object: 'A broadsheet folded once, and a seal stamped in red.',
    structure: 'A printed broadsheet: masthead, columns, drop caps, marginalia, a colophon.',
    premise:
      'Set as a newspaper rather than a website. A masthead and dateline, the names as a ' +
      'banner headline, then real multi-column text with drop caps, notes in the outer ' +
      'margin and an order of service ruled with leader dots. Nothing is full-screen; ' +
      'the craft is in the typesetting.',
    display: 'Playfair', body: 'Newsreader', util: 'Instrument Sans', arabic: 'Aref Ruqaa',
    fonts: 'https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wdth,wght@0,5..1200,87.5..112.5,300..900;1,5..1200,87.5..112.5,300..900&family=Newsreader:ital,opsz,wght@0,6..72,200..700;1,6..72,200..500&family=Instrument+Sans:wdth,wght@75..100,400..700&family=Aref+Ruqaa:wght@400;700&family=Amiri:wght@400&display=swap',
    themeColor: '#F1ECDE',
    swatches: [
      { name: 'Paper',   value: '#F1ECDE' },
      { name: 'Ink',     value: '#2B3530' },
      { name: 'Lacquer', value: '#A62A23' },
      { name: 'Mute',    value: '#6A6153' }
    ],
    arabicClass: 'ar-ruqaa',
    layers: { light: true, petals: true, spot: true, shadow: false, nacre: false },
    runtime: {
      LIGHT_OPTS: { warm: 'rgba(232,225,211,0.30)', cool: 'rgba(196,186,168,0.20)', fade: 'rgba(241,236,222,0)', filamentAlpha: 0 },
      PETALS: { dir: -1, count: 12, colors: ['#C9BFAC', '#B04A2F', '#8E8578'] },
      GRAIN_ALPHA: 20
    }
  },
  {
    id: 'kapur', ordinal: '03',
    name: 'Kapur', tagline: 'Plaster and shadow',
    object: 'A whitewashed courtyard at midday, and the arch that shades it.',
    structure: 'Horizontal. You move sideways through a building, room by room.',
    premise:
      'A whitewashed courtyard you walk through rather than a page you scroll. The site ' +
      'travels sideways, each room framed by an arch, with the far wall drifting slower ' +
      'than the near one. No metal anywhere — the only ornament is the shadow the arches ' +
      'throw, and it moves as you go.',
    display: 'Italiana', body: 'Cormorant Garamond', util: 'Jost', arabic: 'Reem Kufi',
    fonts: 'https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&family=Reem+Kufi:wght@400..600&family=Amiri:wght@400&display=swap',
    themeColor: '#F4F2ED',
    swatches: [
      { name: 'Plaster', value: '#F4F2ED' },
      { name: 'Shadow',  value: '#8A90A0' },
      { name: 'Sun',     value: '#EDE6D6' },
      { name: 'Ink',     value: '#23262B' }
    ],
    arabicClass: 'ar-kufi',
    layers: { light: false, petals: false, spot: false, shadow: true, nacre: false },
    runtime: { GRAIN_ALPHA: 16 }
  },
  {
    id: 'mutiara', ordinal: '04',
    name: 'Mutiara', tagline: 'Mother-of-pearl',
    object: 'A pearl-inlaid box, and a length of white silk.',
    structure: 'An object: a lacquer box that opens, and cards that fan out of it.',
    premise:
      'The invitation as a thing you hold. It opens, and the cards inside fan, stack and ' +
      'tilt under the cursor, each one catching the light off the shell. Pearl rather than ' +
      'ivory, with the nacre’s own iridescence instead of gold. The least like a website ' +
      'of the four.',
    display: 'Bodoni Moda', body: 'Cormorant Garamond', util: 'Jost', arabic: 'Amiri',
    fonts: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&family=Amiri:wght@400&display=swap',
    themeColor: '#F6F4F1',
    swatches: [
      { name: 'Pearl',  value: '#F6F4F1' },
      { name: 'Nacre',  value: '#DCE6EA' },
      { name: 'Shell',  value: '#EFDCE0' },
      { name: 'Ink',    value: '#201C1A' }
    ],
    arabicClass: 'ar-naskh',
    layers: { light: true, petals: true, spot: false, shadow: false, nacre: true },
    runtime: {
      LIGHT_OPTS: { warm: 'rgba(244,246,248,0.55)', cool: 'rgba(226,214,220,0.32)', fade: 'rgba(246,244,241,0)', filamentAlpha: 0.05 },
      PETALS: { dir: -1, count: 16, colors: ['#EFDCE0', '#DCE6EA', '#E4E8DF', '#F2EAE0'] },
      GRAIN_ALPHA: 14
    }
  }
];

module.exports = { concepts, byId: (id) => concepts.find((c) => c.id === id) };
