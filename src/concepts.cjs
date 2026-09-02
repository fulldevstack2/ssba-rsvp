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
    premise:
      'The most ceremonial of the four, and the closest to the all-white brief read literally. ' +
      'Ivory ground lit by a slow caustic light, one weight of gilt, and the names cut in ' +
      'inscriptional capitals. Rose petals rise on the updraft. The eight-point khatam sits ' +
      'behind the invitation as a watermark.',
    display: 'Cinzel', body: 'Cormorant Garamond', util: 'Manrope', arabic: 'Reem Kufi',
    fonts: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400..700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Manrope:wght@300;400;500&family=Reem+Kufi:wght@400..600&family=Amiri:wght@400&display=swap',
    themeColor: '#F7F2E9',
    swatches: [
      { name: 'Ivory',     value: '#F7F2E9' },
      { name: 'Gilt',      value: '#7E6733' },
      { name: 'Champagne', value: '#E4D3AE' },
      { name: 'Ink',       value: '#191410' }
    ],
    arabicClass: 'ar-kufi',
    layers: { light: true, petals: true, spot: false, shadow: false, nacre: false },
    runtime: {
      LIGHT_OPTS: { warm: 'rgba(255,244,214,0.58)', cool: 'rgba(214,180,110,0.30)', fade: 'rgba(247,242,233,0)' },
      PETALS: { dir: -1, count: 20, colors: ['#E8C9C4', '#D9A7A0', '#C9A24A', '#EFE0C6'] },
      GRAIN_ALPHA: 26
    }
  },
  {
    id: 'kertas', ordinal: '02',
    name: 'Kertas', tagline: 'Ink on paper',
    object: 'A broadsheet folded once, and a seal stamped in red.',
    premise:
      'The boldest of the four and the one furthest from convention. Warm paper, green-black ' +
      'ink and a single lacquer red — no gold anywhere. Left-aligned and asymmetric, with the ' +
      'sections numbering themselves in the margin, and the display face set at an optical ' +
      'size where its hairlines almost disappear.',
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
      PETALS: { dir: 1, count: 12, colors: ['#C9BFAC', '#B04A2F', '#8E8578'] },
      GRAIN_ALPHA: 20
    }
  },
  {
    id: 'kapur', ordinal: '03',
    name: 'Kapur', tagline: 'Plaster and shadow',
    object: 'A whitewashed courtyard at midday, and the arch that shades it.',
    premise:
      'White on white, with no metal at all. The groom’s Hadhrami family built in lime ' +
      'plaster, and this design takes the whole page from that: a single wall in full sun, ' +
      'where the only ornament is the shadow a pointed arch throws across it. The shadow ' +
      'travels as you scroll, the way it does over a real morning.',
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
    premise:
      'The couture reading. Pearl white rather than ivory, with the nacre’s own ' +
      'iridescence — pale blue, shell pink, sea green — travelling slowly across the ' +
      'names instead of gold. A high-contrast fashion serif, set enormous, on silk-soft ' +
      'gradients. The least traditional and the most expensive-looking.',
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
