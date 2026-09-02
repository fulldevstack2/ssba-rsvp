/* =============================================================================
   SSBA — Wedding content layer (bilingual: ms = Bahasa Melayu, en = English)
   -----------------------------------------------------------------------------
   Single source of truth for BOTH designs. Edit here, rebuild, and both the
   "Cahaya" and "Dua Puncak" builds update together.

   Anything marked  ← CONFIRM  is not yet public knowledge and must be checked
   with the family before the site goes live. See README.md § "Before you launch".
   ============================================================================= */

window.CONTENT = {

  /* --- Fixed facts, identical in both languages ------------------------------ */
  couple: {
    groom:      { short: 'Syed Saddiq', full: 'Syed Saddiq bin Syed Abdul Rahman', initial: 'S' },
    bride:      { short: 'Bella Astillah', full: 'Dayang Ara Nabellah binti Awang Astillah', initial: 'B' },
    hashtag:    '#BellaSyedYes'
  },

  hosts: {
    groom: ['Syed Abdul Rahman bin Syed Abdullah Al-Sagoff', 'Sharifah Mahani binti Syed Abdul Aziz'],
    bride: ['Awang Astillah bin Dullah', 'Siti Zarina binti Astillah']
  },

  children: ['Ayden Adrean', 'Ara Adreanna'],

  /* Gregorian + Hijri. 10 Oct 2026 = 29 Rabiulakhir 1448H (Umm al-Qura). */
  day: { iso: '2026-10-10', hijri: { ms: '29 Rabiulakhir 1448H', en: '29 Rabiʻ al-Akhir 1448 AH' } },

  /* --- Sacred texts ---------------------------------------------------------- */
  sacred: {
    bismillah: {
      ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      tr: 'Bismillahir-Rahmanir-Rahim',
      ms: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Mengasihani',
      en: 'In the name of God, the Most Gracious, the Most Merciful'
    },
    verse: {
      ref: { ms: 'Surah Ar-Rum, ayat 21', en: 'Surah Ar-Rum, verse 21' },
      ar: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      tr: 'Wa min ayatihi an khalaqa lakum min anfusikum azwajan li-taskunu ilayha wa jaʻala baynakum mawaddatan wa rahmah.',
      ms: 'Dan di antara tanda-tanda yang membuktikan kekuasaan-Nya, Dia menciptakan untuk kamu pasangan dari jenis kamu sendiri, supaya kamu tenteram dan hidup mesra dengannya, dan dijadikan-Nya di antara kamu perasaan kasih sayang dan belas kasihan.',
      en: 'And of His signs is that He created for you mates from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy.'
    },
    dua: {
      ar: 'اللَّهُمَّ بَارِكْ لَهُمَا وَبَارِكْ عَلَيْهِمَا وَاجْمَعْ بَيْنَهُمَا فِي خَيْرٍ',
      tr: 'Allahumma barik lahuma, wa barik ʻalayhima, wa-jmaʻ baynahuma fi khayr.',
      ms: 'Ya Allah, berkatilah mereka berdua, limpahkanlah keberkatan ke atas mereka, dan himpunkanlah mereka dalam kebaikan.',
      en: 'O God, bless them both, send Your blessings upon them, and unite them in goodness.',
      src: { ms: 'Doa Rasulullah SAW bagi pasangan pengantin — riwayat At-Tirmizi', en: 'The Prophetic supplication for newlyweds — narrated by at-Tirmidhi' }
    }
  },

  /* --- Events ---------------------------------------------------------------- */
  /* `tbc: true`  renders the card in its "details to follow" state.
     `elev`       metres above sea level — used by the Dua Puncak build.
     `start/end`  ISO with +08:00; omit for TBC events (no calendar button).   */
  events: [
    {
      id: 'akad',
      kind: 'primary',
      elev: 519,
      eyebrow:  { ms: 'Majlis Pertama', en: 'The Solemnisation' },
      title:    { ms: 'Akad Nikah', en: 'Akad Nikah' },
      dateLong: { ms: 'Sabtu, 10 Oktober 2026', en: 'Saturday, 10 October 2026' },
      dateShort:{ ms: '10.10.2026', en: '10.10.2026' },
      time:     { ms: 'Waktu akan dimaklumkan', en: 'Time to be announced' },   // ← CONFIRM
      venue:    { ms: 'Aras 118, Menara Merdeka Maybank', en: 'Level 118, Menara Merdeka Maybank' },
      address:  'Merdeka 118, Jalan Hang Jebat, Presint Merdeka 118, 50118 Kuala Lumpur',
      dress:    { ms: 'Serba putih · Putih & ivori', en: 'All white · White & ivory' },
      note:     { ms: 'Majlis akad berlangsung secara sederhana bersama keluarga dan sahabat terdekat, atas jemputan khas.',
                  en: 'The solemnisation is an intimate gathering of family and closest friends, by personal invitation.' },
      maps:  'https://maps.google.com/?q=Merdeka+118,+Jalan+Hang+Jebat,+50118+Kuala+Lumpur',
      waze:  'https://waze.com/ul?q=Merdeka%20118%20Kuala%20Lumpur&navigate=yes',
      start: '2026-10-10T10:00:00+08:00',   // ← CONFIRM
      end:   '2026-10-10T13:00:00+08:00',   // ← CONFIRM
      rsvp: true, invitationOnly: true
    },
    {
      id: 'kl',
      kind: 'reception',
      eyebrow:  { ms: 'Majlis Resepsi', en: 'Reception' },
      title:    { ms: 'Kuala Lumpur', en: 'Kuala Lumpur' },
      dateLong: { ms: 'Oktober 2026', en: 'October 2026' },
      dateShort:{ ms: 'Oktober 2026', en: 'October 2026' },
      time:     { ms: 'Akan dimaklumkan', en: 'To be announced' },
      venue:    { ms: 'Butiran menyusul', en: 'Details to follow' },
      note:     { ms: 'Sahkan minat anda sekarang — kami akan menghantar butiran penuh sebaik sahaja disahkan.',
                  en: 'Register your interest now — we will send full details the moment they are confirmed.' },
      tbc: true, rsvp: true
    },
    {
      id: 'muar',
      kind: 'reception',
      eyebrow:  { ms: 'Majlis Resepsi', en: 'Reception' },
      title:    { ms: 'Muar, Johor', en: 'Muar, Johor' },
      dateLong: { ms: 'Oktober 2026', en: 'October 2026' },
      dateShort:{ ms: 'Oktober 2026', en: 'October 2026' },
      time:     { ms: 'Akan dimaklumkan', en: 'To be announced' },
      venue:    { ms: 'Butiran menyusul', en: 'Details to follow' },
      note:     { ms: 'Di Bandar Maharani, tempat yang telah lapan tahun menjadi rumah kedua kepada pengantin lelaki.',
                  en: 'In Bandar Maharani, the town that has been the groom’s second home for eight years.' },
      tbc: true, rsvp: true
    },
    {
      id: 'sabah',
      kind: 'reception',
      eyebrow:  { ms: 'Majlis Resepsi', en: 'Reception' },
      title:    { ms: 'Sabah', en: 'Sabah' },
      dateLong: { ms: 'Oktober 2026', en: 'October 2026' },
      dateShort:{ ms: 'Oktober 2026', en: 'October 2026' },
      time:     { ms: 'Akan dimaklumkan', en: 'To be announced' },
      venue:    { ms: 'Butiran menyusul', en: 'Details to follow' },
      note:     { ms: 'Pulang ke Negeri Di Bawah Bayu, tanah kelahiran pengantin perempuan.',
                  en: 'Home to the Land Below the Wind, where the bride was born.' },
      tbc: true, rsvp: true
    }
  ],

  /* --- Provisional running order for the akad day ---------------------------- */
  /* ← CONFIRM every time. Shown under a visible "provisional" label.        */
  schedule: [
    { time: '—', title: { ms: 'Ketibaan tetamu', en: 'Guests arrive' },
      desc: { ms: 'Pendaftaran di lobi, kemudian naik bersama-sama ke aras 118.', en: 'Registration in the lobby, then the ascent together to level 118.' } },
    { time: '—', title: { ms: 'Ketibaan pengantin', en: 'The couple arrive' }, desc: null },
    { time: '—', title: { ms: 'Akad nikah', en: 'The solemnisation' },
      desc: { ms: 'Bacaan doa, lafaz akad, dan sarung cincin.', en: 'Prayers, the vow, and the exchange of rings.' } },
    { time: '—', title: { ms: 'Jamuan & makan beradab', en: 'The wedding feast' }, desc: null },
    { time: '—', title: { ms: 'Sesi bergambar & bersalaman', en: 'Photographs & greetings' }, desc: null },
    { time: '—', title: { ms: 'Majlis bersurai dengan doa selamat', en: 'A closing prayer' }, desc: null }
  ],

  /* --- Seed wishes (clearly labelled as examples until real ones arrive) ------ */
  seedWishes: [
    { name: 'Nenek & Atuk', wish: { ms: 'Barakallahu lakuma. Semoga bahagia hingga ke syurga.', en: 'Barakallahu lakuma. May your happiness reach all the way to paradise.' } },
    { name: 'Keluarga Muar', wish: { ms: 'Dari Bandar Maharani, doa kami mengiringi kalian berdua.', en: 'From Bandar Maharani, our prayers travel with you both.' } },
    { name: 'Kota Kinabalu', wish: { ms: 'Selamat pengantin baru! Nanti balik Sabah ya.', en: 'Congratulations! Come home to Sabah soon.' } }
  ],

  /* ========================================================================== */
  ms: {
    meta: {
      title: 'Syed Saddiq & Bella Astillah — 10.10.2026',
      desc: 'Dengan penuh kesyukuran, kami menjemput tuan/puan ke majlis perkahwinan kami. Sabtu, 10 Oktober 2026 · Aras 118, Menara Merdeka Maybank, Kuala Lumpur.'
    },
    paper: {
      masthead: 'Walimatul Urus',
      kicker: 'Kuala Lumpur · Edisi Khas',
      lede: 'Dengan penuh kesyukuran ke hadrat Ilahi, kedua-dua keluarga dengan segala hormatnya menjemput Dato\' / Datin / Tuan / Puan / Encik / Cik sekeluarga hadir ke majlis perkahwinan anakanda kami, seterusnya memberi restu dan meraikan hari bahagia mereka berdua.',
      cut: 'Potong di sini',
      stamp: 'Diterima',
      letters: 'Ucapan Daripada Pembaca',
      setIn: 'Huruf'
    },
    nav: { invite: 'Jemputan', story: 'Kisah', events: 'Majlis', schedule: 'Atur Cara', travel: 'Panduan', rsvp: 'RSVP', wishes: 'Ucapan' },
    labels: {
      date: 'Tarikh', time: 'Masa', venue: 'Tempat', dress: 'Tema pakaian', place: 'Lokasi',
      googleMaps: 'Google Maps', waze: 'Waze', addToCalendar: 'Simpan ke kalendar',
      googleCalendar: 'Buka Google Calendar', open: 'Buka Jemputan', openHint: 'Ketik untuk membuka',
      music: 'Muzik', to: 'Jemputan khas untuk', and: 'dan', invitationOnly: 'Atas jemputan khas',
      detailsToFollow: 'Butiran menyusul', provisional: 'Atur cara tentatif',
      backToTop: 'Ke atas', copy: 'Salin', copied: 'Disalin'
    },
    hero: {
      eyebrow: 'Walimatul Urus',
      day: 'Sabtu',
      place: 'Aras 118, Menara Merdeka Maybank',
      scroll: 'Tatal',
      salam: 'Assalamualaikum warahmatullahi wabarakatuh',
      invite: 'Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput tuan/puan sekeluarga ke majlis perkahwinan kami',
      joining: 'bersama',
      dateLine: 'Sabtu, 10 Oktober 2026',
      venueLine: 'Aras 118, Menara Merdeka Maybank, Kuala Lumpur'
    },
    invite: { title: 'Dengan Segala Hormatnya' },
    hostsBlock: {
      title: 'Jemputan',
      lead: 'Kedua-dua keluarga dengan penuh kesyukuran mempersilakan tuan/puan ke majlis perkahwinan anakanda kami',
      groomSide: 'Keluarga pengantin lelaki',
      brideSide: 'Keluarga pengantin perempuan',
      withChildren: 'bersama Ayden Adrean dan Ara Adreanna'
    },
    countdown: { title: 'Menghitung hari', days: 'Hari', hours: 'Jam', minutes: 'Minit', seconds: 'Saat', done: 'Hari ini hari bahagia kami. Alhamdulillah.' },
    story: {
      title: 'Kisah Kami',
      lead: 'Bermula dengan satu kerjasama yang sederhana, berakhir dengan satu janji seumur hidup.',
      beats: [
        { k: 'Perkenalan', y: '2024',
          t: 'Dua hati, satu pertemuan',
          b: 'Mereka bertemu kerana kerja — satu kempen raya yang dilakukan bersama demi mengumpul dana untuk orang ramai. Persahabatan itu tumbuh perlahan-lahan, tanpa disedari sesiapa, termasuk mereka berdua.' },
        { k: 'Lamaran', y: 'Januari 2026',
          t: 'Di puncak Gunung Kinabalu',
          b: 'Selepas mendaki sepanjang malam, dalam hujan lebat dan kesejukan puncak, dia melutut dan bertanya. Bella berkata "ya" dalam beberapa saat sahaja.' },
        { k: 'Pertunangan', y: '28 Mac 2026',
          t: 'Bertunang di bulan Syawal',
          b: 'Dua keluarga bertemu buat kali pertama sebagai satu. Cincin disarungkan oleh bonda pengantin lelaki, dan hantaran dibawa dengan tema masa hadapan — termasuk simpanan pendidikan buat Ayden dan Ara.' },
        { k: 'Pernikahan', y: '10 Oktober 2026',
          t: 'Satu permulaan kebahagiaan',
          b: 'Tarikh dipilih kerana susunan nombornya yang cantik, dan kerana bulan kesepuluh menandakan permulaan hidup baharu bagi mereka berdua — bersama Ayden dan Ara.' }
      ],
      pull: {
        q: 'Dua keluarga, satu doa, dan satu hari yang telah lama dinanti.',
        a: 'Sabtu, 10 Oktober 2026',
        q2: 'Sepuluh bulan kesepuluh — permulaan sebuah rumah tangga.',
        a2: '10 . 10 . 2026'
      }
    },
    family: {
      title: 'Berempat',
      headline: 'Sebuah keluarga yang sudah pun terbentuk',
      body: 'Ayden dan Ara telah pun menjadi sebahagian daripada cerita ini sejak awal lagi. Majlis ini bukan sahaja menyatukan dua orang, tetapi meraikan sebuah keluarga yang sudah pun terbentuk.',
      quote: 'Sebuah keluarga yang telah lama terbentuk, kini diikat dengan sebuah nikah.',
      by: 'Berempat'
    },
    events: { title: 'Majlis Kami', lead: 'Empat majlis, satu bulan, tiga kota yang bermakna buat kami.' },
    scheduleBlock: {
      title: 'Atur Cara Majlis',
      lead: 'Atur cara penuh akan dikemas kini di halaman ini sebaik sahaja disahkan.',
      note: 'Waktu di bawah adalah tentatif dan akan dikemas kini.'
    },
    travel: {
      title: 'Panduan Tetamu',
      lead: 'Beberapa perkara kecil yang memudahkan perjalanan tuan/puan pada hari itu.',
      items: [
        { t: 'Dengan MRT', b: 'Stesen Merdeka (Laluan Kajang, KG17) terletak betul-betul di sebelah menara. Gunakan Pintu Masuk B di bahagian selatan — ia paling hampir dengan lobi.' },
        { t: 'Dengan kereta', b: 'Terowong Belfield dari Jalan Syed Putra atau Jalan Damansara membawa terus ke Aras Bawah Tanah 4. Tempat letak kereta disediakan di dalam presint.' },
        { t: 'Ketibaan', b: 'Perjalanan dari lobi ke aras 118 mengambil sedikit masa. Waktu ketibaan yang disyorkan akan dimaklumkan bersama waktu akad.' },
        { t: 'Penginapan', b: 'Park Hyatt Kuala Lumpur terletak di dalam menara yang sama, dengan lobi di aras 75. Terdapat juga beberapa hotel berdekatan di sekitar Chinatown dan Bukit Bintang.' },
        { t: 'Tema pakaian', b: 'Tema majlis ialah serba putih. Kod pakaian untuk tetamu belum dimaklumkan; butirannya akan kami kongsikan sebelum hari tersebut.' },
        { t: 'Kanak-kanak', b: 'Jika anak-anak turut hadir bersama tuan/puan, sila nyatakan bilangan mereka semasa mengesahkan kehadiran.' }
      ]
    },
    rsvp: {
      title: 'Sahkan Kehadiran',
      lead: 'Sila maklumkan kepada kami sebelum 12 September 2026.',
      deadline: 'Tarikh akhir: 12 September 2026',
      stepOf: 'Langkah {n} daripada {total}',
      qWho: 'Boleh kami tahu nama tuan/puan?',
      steps: { who: 'Tuan/Puan', attend: 'Kehadiran', detail: 'Butiran', review: 'Semakan' },
      name: 'Nama penuh', namePh: 'Seperti pada kad jemputan',
      phone: 'Nombor telefon', phonePh: '012-345 6789',
      email: 'E-mel (pilihan)', emailPh: 'nama@contoh.com',
      attending: 'Adakah tuan/puan dapat bersama kami?',
      yes: 'Ya, insya-Allah saya hadir', no: 'Maaf, saya tidak dapat hadir',
      whichEvents: 'Majlis manakah yang akan tuan/puan hadiri?',
      whichHint: 'Pilih semua yang berkenaan. Bagi majlis resepsi yang belum ditetapkan tarikhnya, ini merupakan pendaftaran minat sahaja.',
      pax: 'Bilangan tetamu',
      adults: 'Dewasa', children: 'Kanak-kanak',
      paxHint: 'Termasuk tuan/puan sendiri.',
      dietary: 'Alahan atau keperluan pemakanan (pilihan)', dietaryPh: 'Contoh: alahan kacang',
      message: 'Ucapan & doa untuk pengantin (pilihan)', messagePh: 'Tulis sesuatu yang manis...',
      shareWish: 'Paparkan ucapan ini di dinding ucapan',
      next: 'Seterusnya', prev: 'Kembali', submit: 'Hantar jawapan', sending: 'Menghantar...',
      reviewTitle: 'Semak jawapan tuan/puan',
      edit: 'Ubah',
      errors: {
        required: 'Ruangan ini diperlukan',
        phone: 'Sila masukkan nombor telefon yang sah',
        email: 'Sila masukkan alamat e-mel yang sah',
        events: 'Sila pilih sekurang-kurangnya satu majlis',
        pax: 'Sila masukkan sekurang-kurangnya seorang tetamu',
        network: 'Jawapan tidak dapat dihantar. Sila cuba lagi atau hubungi kami di WhatsApp.'
      },
      success: {
        titleYes: 'Alhamdulillah, terima kasih!',
        bodyYes: 'Kehadiran {name} telah kami rekodkan untuk {count} orang. Kami tidak sabar untuk meraikannya bersama tuan/puan.',
        titleNo: 'Terima kasih atas khabar ini',
        bodyNo: 'Terima kasih {name}. Doa dan restu tuan/puan tetap bermakna buat kami, walaupun dari jauh.',
        again: 'Ubah jawapan saya'
      },
      savedNote: 'Tuan/puan telah menjawab sebagai {name}.', savedEdit: 'Ubah jawapan'
    },
    wishes: {
      title: 'Ucapan & Doa',
      lead: 'Titipkan sepatah dua kata buat pengantin. Setiap ucapan akan kami baca bersama.',
      name: 'Nama tuan/puan', wish: 'Ucapan anda', submit: 'Hantar ucapan',
      example: 'Contoh', empty: 'Jadilah yang pertama menitipkan ucapan.',
      thanks: 'Terima kasih atas doa tuan/puan.'
    },
    dress: { value: 'Serba putih · Putih & ivori' },
    gift: {
      title: 'Doa & Restu',
      body: 'Kehadiran dan doa restu tuan/puan sudah cukup bermakna buat kami. Tiada apa lagi yang kami pinta.'
    },
    faq: {
      title: 'Soalan Lazim',
      items: [
        { q: 'Bolehkah saya membawa tetamu tambahan?', a: 'Jemputan ini adalah untuk nama yang tertera pada kad. Untuk sebarang pertanyaan lain, sila hubungi kami.' },
        { q: 'Bilakah tarikh dan tempat majlis resepsi akan dimaklumkan?', a: 'Kami sedang memuktamadkannya. Sahkan minat tuan/puan melalui borang RSVP dan kami akan menghubungi tuan/puan secara peribadi sebaik sahaja butiran disahkan.' },
        { q: 'Adakah majlis ini disiarkan secara langsung?', a: 'Pautan siaran akan dikongsikan di halaman ini jika ada, buat tuan/puan yang tidak dapat hadir.' },
        { q: 'Bolehkah saya mengubah jawapan saya?', a: 'Boleh. Buka semula pautan yang sama dan pilih "Ubah jawapan" sebelum tarikh akhir.' }
      ]
    },
    footer: {
      thanks: 'Semoga dengan kehadiran dan doa tuan/puan, majlis kami diberkati Allah SWT.',
      sign: 'Wassalam,',
      contactTitle: 'Sebarang pertanyaan',
      contactHint: 'Hubungi kami melalui WhatsApp.',
      credit: 'Dibina dengan penuh kasih sayang.'
    },
    calendar: { summary: 'Perkahwinan Syed Saddiq & Bella Astillah', description: 'Dengan penuh kesyukuran, kami menjemput tuan/puan ke majlis perkahwinan kami. #BellaSyedYes' },
    toast: { copied: 'Disalin ke papan keratan', copyFail: 'Tidak dapat menyalin', calendar: 'Fail kalendar dimuat turun.', wish: 'Terima kasih atas doa tuan/puan.' }
  },

  /* ========================================================================== */
  en: {
    meta: {
      title: 'Syed Saddiq & Bella Astillah — 10.10.2026',
      desc: 'With gratitude, we invite you to our wedding. Saturday, 10 October 2026 · Level 118, Menara Merdeka Maybank, Kuala Lumpur.'
    },
    paper: {
      masthead: 'Walimatul Urus',
      kicker: 'Kuala Lumpur · Special Edition',
      lede: 'With gratitude to God, both families warmly invite you and your family to the marriage of our children, and to share in the blessing of their day.',
      cut: 'Cut along the line',
      stamp: 'Received',
      letters: 'Letters to the Couple',
      setIn: 'Set in'
    },
    nav: { invite: 'Invitation', story: 'Story', events: 'Events', schedule: 'Order of Day', travel: 'Guest Guide', rsvp: 'RSVP', wishes: 'Wishes' },
    labels: {
      date: 'Date', time: 'Time', venue: 'Venue', dress: 'Dress', place: 'Location',
      googleMaps: 'Google Maps', waze: 'Waze', addToCalendar: 'Add to calendar',
      googleCalendar: 'Open Google Calendar', open: 'Open Invitation', openHint: 'Tap to open',
      music: 'Music', to: 'Especially for', and: 'and', invitationOnly: 'By personal invitation',
      detailsToFollow: 'Details to follow', provisional: 'Provisional running order',
      backToTop: 'Back to top', copy: 'Copy', copied: 'Copied'
    },
    hero: {
      eyebrow: 'Walimatul Urus',
      day: 'Saturday',
      place: 'Level 118, Menara Merdeka Maybank',
      scroll: 'Scroll',
      salam: 'Assalamualaikum warahmatullahi wabarakatuh',
      invite: 'With gratitude to God, we invite you and your family to the wedding of',
      joining: 'to',
      dateLine: 'Saturday, 10 October 2026',
      venueLine: 'Level 118, Menara Merdeka Maybank, Kuala Lumpur'
    },
    invite: { title: 'With Every Respect' },
    hostsBlock: {
      title: 'The Invitation',
      lead: 'Both families warmly invite you to celebrate the marriage of our children',
      groomSide: 'Parents of the groom',
      brideSide: 'Parents of the bride',
      withChildren: 'together with Ayden Adrean and Ara Adreanna'
    },
    countdown: { title: 'Counting the days', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', done: 'Today is the day. Alhamdulillah.' },
    story: {
      title: 'Our Story',
      lead: 'It began with a simple collaboration. It ends with a promise for life.',
      beats: [
        { k: 'How it began', y: '2024',
          t: 'Two hearts, one meeting',
          b: 'They met through work — a festive campaign they took on together to raise funds for people who needed it. The friendship grew quietly, unnoticed by everyone, including the two of them.' },
        { k: 'The proposal', y: 'January 2026',
          t: 'At the summit of Mount Kinabalu',
          b: 'After climbing through the night, in heavy rain and the cold of the summit, he knelt and asked. Bella said yes within seconds.' },
        { k: 'The engagement', y: '28 March 2026',
          t: 'Betrothed in the month of Syawal',
          b: 'Two families met for the first time as one. The ring was placed by the groom’s mother, and the gift trays were themed around the future — including education savings for Ayden and Ara.' },
        { k: 'The wedding', y: '10 October 2026',
          t: 'A beginning of happiness',
          b: 'The date was chosen for the beauty of its numbers, and because the tenth month marks the start of a new life for them both — together with Ayden and Ara.' }
      ],
      pull: {
        q: 'Two families, one prayer, and a day long awaited.',
        a: 'Saturday, 10 October 2026',
        q2: 'The tenth day of the tenth month — the beginning of a household.',
        a2: '10 . 10 . 2026'
      }
    },
    family: {
      title: 'All Four of Us',
      headline: 'A family that had already quietly formed',
      body: 'Ayden and Ara have been part of this story from the very beginning. This day does not only join two people — it celebrates a family that has already quietly formed.',
      quote: 'A family that formed long ago, now bound by a marriage.',
      by: 'Berempat'
    },
    events: { title: 'The Celebrations', lead: 'Four gatherings, one month, three cities that mean everything to us.' },
    scheduleBlock: {
      title: 'Order of the Day',
      lead: 'The full running order will appear here as soon as it is confirmed.',
      note: 'The times below are provisional and will be updated.'
    },
    travel: {
      title: 'Guest Guide',
      lead: 'A few small things to make your journey easy on the day.',
      items: [
        { t: 'By MRT', b: 'Merdeka station (Kajang Line, KG17) sits directly beside the tower. Use Entrance B on the south side — it is closest to the lobby.' },
        { t: 'By car', b: 'The Belfield Tunnel from Jalan Syed Putra or Jalan Damansara brings you straight into Basement 4. Parking is available within the precinct.' },
        { t: 'Arrival', b: 'The journey from the lobby up to level 118 takes a little time. A suggested arrival time will be announced together with the akad time.' },
        { t: 'Staying over', b: 'Park Hyatt Kuala Lumpur is inside the same tower, with its lobby on level 75. There are also several hotels a short walk away around Chinatown and Bukit Bintang.' },
        { t: 'What to wear', b: 'The theme of the day is all white. A dress code for guests has not been announced; we will share it before the day.' },
        { t: 'Children', b: 'If children are coming with you, please tell us how many when you reply.' }
      ]
    },
    rsvp: {
      title: 'Kindly Reply',
      lead: 'Please let us know by 12 September 2026.',
      deadline: 'Replies close 12 September 2026',
      stepOf: 'Step {n} of {total}',
      qWho: 'May we have your name?',
      steps: { who: 'You', attend: 'Attendance', detail: 'Details', review: 'Review' },
      name: 'Full name', namePh: 'As it appears on your invitation',
      phone: 'Mobile number', phonePh: '012-345 6789',
      email: 'Email (optional)', emailPh: 'name@example.com',
      attending: 'Will you be joining us?',
      yes: 'Yes, joyfully', no: 'Sadly, I cannot come',
      whichEvents: 'Which celebrations will you attend?',
      whichHint: 'Choose all that apply. For receptions still being finalised, this simply registers your interest.',
      pax: 'How many of you?',
      adults: 'Adults', children: 'Children',
      paxHint: 'Including yourself.',
      dietary: 'Allergies or dietary needs (optional)', dietaryPh: 'For example: nut allergy',
      message: 'A message for the couple (optional)', messagePh: 'Write something lovely...',
      shareWish: 'Show this message on the wishes wall',
      next: 'Continue', prev: 'Back', submit: 'Send reply', sending: 'Sending...',
      reviewTitle: 'Check your answers',
      edit: 'Change',
      errors: {
        required: 'This field is required',
        phone: 'Please enter a valid mobile number',
        email: 'Please enter a valid email address',
        events: 'Please choose at least one celebration',
        pax: 'Please include at least one guest',
        network: 'We could not send your reply. Please try again, or message us on WhatsApp.'
      },
      success: {
        titleYes: 'Alhamdulillah, thank you!',
        bodyYes: 'We have you down, {name}, for {count} guest(s). We cannot wait to celebrate with you.',
        titleNo: 'Thank you for letting us know',
        bodyNo: 'Thank you, {name}. Your prayers and good wishes mean just as much to us from afar.',
        again: 'Change my reply'
      },
      savedNote: 'You have already replied as {name}.', savedEdit: 'Change reply'
    },
    wishes: {
      title: 'Wishes & Prayers',
      lead: 'Leave a few words for the couple. Every one of them will be read together.',
      name: 'Your name', wish: 'Your message', submit: 'Send your wish',
      example: 'Example', empty: 'Be the first to leave a wish.',
      thanks: 'Thank you for your prayers.'
    },
    dress: { value: 'All white · White & ivory' },
    gift: {
      title: 'Prayers & Blessings',
      body: 'Your presence and your prayers are gift enough for us. We ask for nothing more.'
    },
    faq: {
      title: 'Questions',
      items: [
        { q: 'May I bring an extra guest?', a: 'The invitation is for the names printed on your card. For anything else, please message us.' },
        { q: 'When will the reception dates and venues be announced?', a: 'We are finalising them now. Register your interest through the reply form and we will contact you personally the moment details are confirmed.' },
        { q: 'Will the day be broadcast?', a: 'If a livestream link is available, we will share it on this page for those who cannot be with us in person.' },
        { q: 'Can I change my reply?', a: 'Yes. Open the same link again and choose "Change reply" any time before the deadline.' }
      ]
    },
    footer: {
      thanks: 'May your presence and your prayers bring blessings upon our day.',
      sign: 'With love,',
      contactTitle: 'Any questions',
      contactHint: 'Message us on WhatsApp.',
      credit: 'Made with a great deal of love.'
    },
    calendar: { summary: 'Wedding of Syed Saddiq & Bella Astillah', description: 'With gratitude, we invite you to our wedding. #BellaSyedYes' },
    toast: { copied: 'Copied to clipboard', copyFail: 'Could not copy', calendar: 'Calendar file downloaded.', wish: 'Thank you for your prayers.' }
  }
};
