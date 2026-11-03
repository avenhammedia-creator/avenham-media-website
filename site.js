/* Avenham Media shared script: layout, motion, admin-controlled content, and the owner's in-page editor */
(function () {
  var ST = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M0 120 V90 H30 V60 H60 V30 H90 V0 H120 V120 Z" fill="currentColor"/></svg>';
  var LL = '<svg class="cl" viewBox="0 0 404 730" aria-hidden="true"><path d="M80 0 H241 V565 Q241 605 281 605 H330 V730 H193 Q80 730 80 617 Z" fill="currentColor"/></svg>';
  var TICK = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var ICONS = {
    web: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    design: '<path d="M12 3l2.6 5.6L20 9.5l-4 4 1 6-5-2.8-5 2.8 1-6-4-4 5.4-.9z"/>',
    social: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-3h3L15 7"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    shop: '<path d="M4 7h16l-1.5 12h-13zM9 7a3 3 0 0 1 6 0"/>',
    stairs: '<path d="M3 21V16H8V11H13V6H18V3H21V21Z"/>'
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var safeUrl = function (u) { u = String(u || '').trim(); return /^(https?:\/\/|[a-z0-9-]+\.html(#[\w-]*)?$|#[\w-]+$)/i.test(u) ? u : ''; };
  var safeImg = function (u) { u = String(u || '').trim(); return /^(https:\/\/[^\s"'<>]+|img\/[\w.-]+\.(webp|png|jpe?g|gif)|data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+\/=]+)$/i.test(u) ? u : ''; };
  var safeColor = function (c, f) { return /^#[0-9a-f]{3,8}$/i.test(String(c || '')) ? c : f; };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  window.LL = { ST: ST, TICK: TICK, ICONS: ICONS, esc: esc, safeUrl: safeUrl, safeColor: safeColor };

  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { }
  if (!location.hash || location.hash === '#edit') { window.scrollTo(0, 0); addEventListener('load', function () { window.scrollTo(0, 0); }); }
  addEventListener('pageshow', function (e) { if (e.persisted) window.scrollTo(0, 0); });
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var here = document.body.getAttribute('data-page') || 'index.html';
  var pageKey = here.replace('.html', '');

  // ---------- defaults (the admin panel overrides any of these) ----------
  var D = {
    settings: {
      email: 'avenham.media@gmail.com', whatsapp: 'avenham.media', instagram: 'https://www.instagram.com/avenham.media/', tiktok: '', facebook: 'https://www.facebook.com/avenham.media', linkedin: '',
      heroLead: 'We build websites, design brands and run social media for businesses and brands across the UK. One team, one plan, and a clear next step at every stage.',
      aboutTitle: 'A small studio that takes the work seriously.',
      aboutText: 'Avenham Media is a creative studio for websites, design and social media. We work with start-ups, shops, services and growing brands, wherever they are.',
      aboutText2: 'Our logo is a staircase because that is how we work: one clear step at a time, so you always know where your project is and what happens next.',
      marquee: 'Websites, Design, Social, Built step by step', footerText: 'Websites, design and social media for businesses and brands of every size.', copyright: '© 2026 Avenham Media',
      navCta: 'Start a project', navCtaLink: 'contact.html',
      annOn: false, annText: 'Now booking new website projects', annLabel: 'Book a free chat', annLink: 'contact.html',
      fabText: 'Free chat', fabLink: 'contact.html', themeDefault: 'device', cookieBanner: true,
      seoDescription: 'Avenham Media designs websites, builds brands and runs social media for small businesses across the UK. Phone-first websites from £450 at a fixed price.'
    },
    design: {
      accent: '#F05A28', accent2: '#FF7A4D', bg: '#09121F', bg2: '#0F1B2D', fg: '#F4F6FA', muted: '#A9B6C9',
      fontDisplay: 'Sora', fontBody: 'Manrope', baseSize: 16, radius: 22, headingScale: 100, navTexture: 'leather',
      stairs: true, stairsAnim: true, stairsOpacity: 16, stairsSpeed: 9, blobs: true, tri: false, bigstairs: false, contours: false, drift: false, grid: false, grain: true, marquee: true,
      heroAnim: true, reveal: true, transitions: true, motion: true, marqueeSpeed: 34,
      progress: true, totop: true, fab: true, spotlight: true, compact: true, coverFloat: true, themeToggle: true
    },
    pages: {
      index: { title: 'Avenham Media | Website Design, Branding & Social Media for UK Businesses', nav: 'Home', show: true, order: 0 },
      services: { title: 'Web Design, Branding & Social Media Services UK | Avenham Media', nav: 'Services', show: true, order: 1 },
      work: { title: 'Our Work: Website Design Portfolio | Avenham Media', nav: 'Work', show: true, order: 2 },
      packages: { title: 'Website Design Prices UK: Packages from £450 | Avenham Media', nav: 'Packages', show: true, order: 3 },
      shop: { title: 'Google Review Cards & NFC Business Cards UK | Avenham Media', nav: 'Shop', show: true, order: 4 },
      contact: { title: 'Contact Avenham Media | Free Website Design Consultation', nav: 'Contact', show: true, order: 5 }
    },
    services: [
      { id: 's1', title: 'Websites', blurb: 'Fast, good-looking websites that turn visitors into customers.', items: 'Designed for phones first\nContact forms, bookings and shops\nAn admin panel so you can update it yourself\nSet up to be found on Google\nOptional extra: we can photograph your menu or products for it', icon: 'web', order: 1 },
      { id: 's2', title: 'Design', blurb: 'A look people remember, used the same way everywhere.', items: 'Logos and brand kits\nColours, fonts and guidelines\nFlyers, menus, signs and print\nBusiness cards', icon: 'design', order: 2 },
      { id: 's3', title: 'Social', blurb: 'Content that keeps you in front of the right people.', items: 'Instagram, TikTok and Facebook set-up\nBranded post and story templates\nContent planned for you every two weeks\nProfile photos and banners', icon: 'social', order: 3 },
    ],
    projects: [
      { id: 'dadwoven', category: 'website', name: 'Dadwoven', url: 'https://dadwoven.co.uk', image: 'img/dadwoven.webp', bg: '#F1E4D6', ink: '#2A1C14', accent: '#8A4A30', headline: 'Prepared. Present. Together.', button: 'Get the free ebook', desc: 'A support brand for dads. A full website with printable guides, a free ebook, forums with accounts, a shop and a private admin panel.', tags: 'Website, Forums & accounts, Shop, Admin panel', features: 'Online shop with Apple Pay and Google Pay — sell day and night, and customers pay in seconds\nCustomer accounts — visitors sign up and become regulars who keep coming back\nOne-tap sign-in with Google or Apple — no long forms, so fewer people give up\nFree downloads for an email — turn visitors into people you can contact again\nBuilt-in newsletter — send news and offers straight to your customers\u2019 inbox\nCommunity forums — customers talk, help each other and stay on your site longer\nYour own admin panel — change text, products and prices yourself, no developer needed\nContact form — enquiries land in your inbox straight away\nBuilt for phones first — looks perfect where most customers will find you\nSet up for Google — so people searching for what you do can find you\nLight and dark mode — looks great day or night\nTwo-step sign-in and spam protection — customer accounts stay safe', reviewText: 'Genuinely super impressed with the initiative taken by Avenham Media! I gave them a clear, simple brief and shared what I had in mind, and they brought my imagination to life!\n\nI was also incredibly impressed with the quick turnaround time. They went above and beyond, even providing a full video walkthrough of my website and all its features, which was a really nice touch!\n\nAbsolutely fantastic service and well worth every penny! I couldn\u2019t recommend them enough!', reviewName: 'Founder of Dadwoven', reviewRole: '', rating: '5', order: 1, show: true },
      { id: 'jawahir', category: 'website', name: 'Jaw\u0101hir al-Man\u1e6diq', url: 'https://jawahir-mantiq.vercel.app/', image: 'img/jawahir.webp', bg: '#F3E6CF', ink: '#1E1640', accent: '#3F2C8F', headline: 'The whole book, explained.', button: 'Start Chapter I', desc: 'A study app for the classical logic book Jaw\u0101hir al-Man\u1e6diq, made for TheSunniWay. The whole book explained chapter by chapter, with quizzes, flashcards, short video reels, exam papers and a class leaderboard.', tags: 'Web app, Student accounts, Quizzes & flashcards, Leaderboard', features: 'Student accounts with Google sign-in — everyone\u2019s progress is saved on any device\nClass leaderboard — friendly competition that keeps students coming back every day\nQuizzes and full exam papers — instant scores, so students know where they stand\n355 flashcards — learn the key terms in a few minutes a day\nProgress tracking — see exactly how far through the book you are\nShort video-style reels — bite-size lessons people actually want to watch\nSearch the whole book — find any topic in a second\nClear explanations in English and Arabic — all 26 chapters, easy to follow\nPersonal notes and a glossary — everything students need in one place\nWorks on phones, tablets and computers — study anywhere, any time', order: 2, show: true },
      { id: 'maxcabs', category: 'website', name: 'Max Cabs', url: '', soon: true, bg: '#14161A', ink: '#FFFFFF', accent: '#F5C518', headline: 'Your ride, on time.', button: 'Book a taxi', desc: 'A website for a taxi company, built to get customers booking quickly from their phones.', tags: 'Website, Bookings, Phone-first', order: 3, show: false }
    ],
    packages: [
      { id: 'starter', name: 'Starter', price: '450', unit: 'one-off', blurb: 'A clean, professional site to get you online.', features: 'Up to 4 pages\nContact form\nPhone-friendly design\nGoogle set-up', popular: false, button: 'Choose Starter', order: 1, show: true },
      { id: 'business', name: 'Business', price: '750', unit: 'one-off', blurb: 'Website plus a brand that ties it all together.', features: 'Everything in Starter\nUp to 8 pages\nLogo and brand kit\nAdmin panel to edit your site\nSocial media set-up', popular: true, button: 'Choose Business', order: 2, show: true },
      { id: 'growth', name: 'Growth', price: '50', unit: '', blurb: 'Ongoing social media and updates.', features: 'Fresh social media posts bi-weekly\nWebsite updates and hosting help\nA check-in every two weeks', popular: false, button: 'Choose Growth', order: 3, show: true },
      { id: 'custom', name: 'Custom', price: '', unit: '', blurb: 'Need something different? Tell us what you want and we\u2019ll give you a quote.', features: 'Built around your needs and requirements\nPick only the parts you want\nA clear, fixed quote before any work\nFree, no-pressure chat first', popular: false, button: 'Get a quote', order: 4, show: true }
    ],
    shopitems: [
      { id: 'reviewcard', name: 'Google tap-to-review card', kind: 'review', blurb: 'Customers tap their phone on the card and land straight on your Google review page. More reviews, with no searching.', features: 'Works with almost every modern phone\nA QR code on the back for older phones\nYour logo and colours on the card\nWe link it to your Google profile and test it', price: '35', unit: 'each', button: 'Order review cards', need: 'Review cards', order: 1, show: true },
      { id: 'nfccard', name: 'NFC business card', kind: 'nfc', blurb: 'A smart business card. One tap opens your website, menu, booking page or contact details on their phone.', socials: 'Instagram\nTikTok\nWhatsApp\nYour website\nOr everything at once, on one page', features: 'Tap to open your website or menu\nSave your contact details in one tap\nWe design it and set it up for you', price: '100', unit: 'for 100 cards (\u00a31 each)', deal: '200 cards for \u00a3180 (90p each), save \u00a320', button: 'Order NFC cards', need: 'NFC cards', order: 2, show: true }
    ],
    faqs: [
      { id: 'f1', q: 'How long does a website take?', a: 'Most websites take two to four weeks from our first chat to going live. Bigger sites with shops or accounts take longer, and we give you a date before we start.', order: 1, show: true },
      { id: 'f2', q: 'Will I be able to update it myself?', a: 'Yes. Our websites can come with a simple admin panel, and we show you how to use it before launch.', order: 2, show: true },
      { id: 'f3', q: 'Do I own my website?', a: 'Yes. Once it is paid for, the website, the design files and your logo are yours.', order: 3, show: true },
      { id: 'f4', q: 'Do you work with businesses across the UK?', a: 'Yes. We work with businesses all over the UK, from local shops and trades to growing brands, over video calls, email and WhatsApp.', order: 4, show: true },
      { id: 'f5', q: 'Can you just do my social media?', a: 'Of course. You can pick any one of our services on its own.', order: 5, show: true },
      { id: 'f6', q: 'Can you take photos for my website?', a: 'Yes, as an optional extra. If you\u2019d like, we can come to you and take professional photos of your menu, food, products or premises for your website.', order: 6, show: true },
      { id: 'f8', q: 'Will I be waiting long?', a: 'No. We reply within one working day, keep you updated as we go, and turn changes around quickly, so your project keeps moving.', order: 3, show: true },
      { id: 'f7', q: 'Do you set up the review and NFC cards?', a: 'Yes. We design the cards, link them to your Google review page or website, and test them before they reach you.', order: 7, show: true }
    ],
    text: {},
    // wording of the step-by-step contact questions (editable in Admin, Contact questions)
    quiz: {"need": {"q": "What can we help you with?", "sub": "Pick as many as you like."}, "field": {"q": "What kind of business are you?", "sub": "", "opts": ["Restaurant, caf\u00e9 or takeaway", "Shop or online store", "Hair, beauty or barber", "Trades and home services", "Health, fitness or wellbeing", "Taxi or transport", "Tutoring or education", "Charity, mosque or community group", "Professional services", "Something else"]}, "stage": {"q": "Do you have a website right now?", "sub": "", "opts": ["No, this would be my first", "Yes, but it needs a refresh", "Yes, and I want something new"]}, "goals": {"q": "What should your website do for you?", "sub": "Pick everything that matters.", "opts": ["Bring in more enquiries", "Take bookings or appointments", "Sell products online", "Let customers order food or products", "Show my menu or prices", "Customer accounts and logins", "Show up on Google", "Look more professional"]}, "design": {"q": "What design work do you need?", "sub": "Pick as many as you like.", "opts": ["A new logo", "A full brand look", "Menus or price lists", "Flyers, posters or signs", "Social media templates"]}, "social": {"q": "What do you want from social media?", "sub": "Pick as many as you like.", "opts": ["More followers", "More customers from social media", "Regular posts made for me", "A fresh look for my pages", "Help getting started"]}, "cards": {"q": "Which cards are you interested in?", "sub": "Pick as many as you like."}, "when": {"q": "When would you like it ready?", "sub": "", "opts": ["As soon as possible", "Within a month", "In 1 to 3 months", "Just looking for now"]}, "budget": {"q": "Roughly what budget do you have in mind?", "sub": "This just helps us suggest the right package.", "opts": ["Under \u00a3450", "\u00a3450 to \u00a3750", "\u00a3750 or more", "\u00a350 every two weeks (social media)", "Not sure yet"]}, "more": {"q": "Anything else we should know?", "sub": "Optional. Your ideas, websites you like, anything at all."}, "you": {"q": "Last step. Where should we reply?", "sub": "We\u2019ll get back to you within one working day."}}
  };
  window.LL.DEFAULTS = D;
  var C = clone(D);
  window.LL.content = C;

  // ---------- fixed chrome ----------
  var bg = document.createElement('div'); bg.className = 'bgfx'; bg.setAttribute('aria-hidden', 'true');
  bg.innerHTML = '<div class="tri"></div><div class="bigstairs"></div><div class="contour"></div><div class="drift"><svg viewBox="-4 -4 128 128" style="--x:6%;--d:0s;--w:90px;--o:1.0;--t:42s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:18%;--d:-14s;--w:60px;--o:0.7;--t:52s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:31%;--d:-30s;--w:110px;--o:0.9;--t:47s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:47%;--d:-6s;--w:70px;--o:1.2;--t:58s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:63%;--d:-22s;--w:95px;--o:0.8;--t:44s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:78%;--d:-36s;--w:64px;--o:1.0;--t:55s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg><svg viewBox="-4 -4 128 128" style="--x:91%;--d:-11s;--w:80px;--o:0.75;--t:49s"><path d="M0 120V90H30V60H60V30H90V0H120V120Z"/></svg></div><div class="grid-bg"></div><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>' +
    '<svg class="bgstairs" viewBox="0 0 400 400"><rect class="f" x="0" y="300" width="100" height="100"/><rect class="f" x="100" y="200" width="100" height="200"/><rect class="f" x="200" y="100" width="100" height="300"/><rect class="f" x="300" y="0" width="100" height="400"/>' +
    '<path class="o" d="M0 400 V300 H100 V200 H200 V100 H300 V0 H400 V400 Z"/><path class="run" d="M0 400 V300 H100 V200 H200 V100 H300 V0 H400"/></svg><div class="grain"></div>';
  document.body.prepend(bg);
  var STEPS = '<svg viewBox="0 0 120 120" aria-hidden="true" style="overflow:visible"><g fill="currentColor"><rect class="s1" x="0" y="90" width="30.4" height="30"/><rect class="s2" x="30" y="60" width="30.4" height="60"/><rect class="s3" x="60" y="30" width="30.4" height="90"/><rect class="s4" x="90" y="0" width="30" height="120"/></g></svg>';
  var WM = '<svg class="wm" viewBox="0 0 3152 304" aria-hidden="true"><g class="steps"><rect class="s1" x="7.0" y="223.5" width="71.5" height="63.0"/><rect class="s2" x="77.9" y="151.5" width="71.5" height="135.0"/><rect class="s3" x="148.8" y="79.5" width="71.5" height="207.0"/><rect class="s4" x="219.6" y="9.0" width="71.5" height="277.5"/></g><path d="M541.3369863013698 297.0V259.74657534246575Q538.8534246575342 267.1972602739726 535.6602739726027 273.2287671232877Q527.5 287.06575342465754 513.4856164383561 294.5164383561644Q499.4712328767123 301.96712328767126 479.2479452054795 301.96712328767126Q458.3150684931507 301.96712328767126 442.52671232876713 294.5164383561644Q426.73835616438356 287.06575342465754 417.8684931506849 273.05136986301375Q408.9986301369863 259.0369863013699 408.9986301369863 239.52328767123288Q408.9986301369863 218.23561643835615 419.99726027397264 204.57602739726028Q430.9958904109589 190.9164383561644 450.8643835616439 184.3527397260274Q470.7328767123288 177.7890410958904 496.63287671232877 177.7890410958904H531.7575342465753V177.07945205479453Q531.7575342465753 162.17808219178082 524.6616438356164 154.72739726027396Q517.5657534246575 147.27671232876713 501.9547945205479 147.27671232876713Q494.14931506849314 147.27671232876713 481.3767123287671 147.6315068493151Q468.60410958904106 147.986301369863 455.12191780821917 148.6958904109589Q441.6397260273973 149.4054794520548 430.64109589041095 150.1150684931507V102.2178082191781Q438.8013698630137 101.50821917808219 449.79999999999995 100.7986301369863Q460.7986301369863 100.08904109589042 472.5068493150685 99.73424657534248Q484.2150684931507 99.37945205479454 494.5041095890411 99.37945205479454Q524.3068493150685 99.37945205479454 544.7075342465753 107.89452054794522Q565.1082191780822 116.4095890410959 575.7520547945205 133.61712328767123Q586.3958904109588 150.82465753424657 586.3958904109588 177.7890410958904V297.0ZM531.7575342465753 209.36575342465756H496.2780821917808Q481.3767123287671 209.36575342465756 473.3938356164383 216.63904109589043Q465.4109589041096 223.91232876712328 465.4109589041096 236.33013698630137Q465.4109589041096 248.03835616438357 473.3938356164383 255.31164383561645Q481.3767123287671 262.58493150684933 496.2780821917808 262.58493150684933Q505.85753424657537 262.58493150684933 513.4856164383561 259.21438356164384Q521.1136986301369 255.84383561643835 526.0808219178082 247.68356164383562Q531.0479452054794 239.52328767123288 531.7575342465753 224.97671232876712ZM656.2904109589041 297.0 598.1041095890411 102.57260273972602H656.645205479452L698.1561643835616 249.8123287671233H706.3164383561643L742.1506849315068 102.57260273972602H796.7890410958904L746.4082191780822 297.0ZM903.5821917808219 303.741095890411Q878.7465753424657 303.741095890411 859.7650684931507 295.2260273972603Q840.7835616438356 286.7109589041096 828.1883561643835 272.34178082191784Q815.5931506849314 257.972602739726 809.0294520547944 240.05547945205478Q802.4657534246575 222.13835616438357 802.4657534246575 203.3342465753425V196.23835616438356Q802.4657534246575 176.72465753424657 809.0294520547944 158.80753424657536Q815.5931506849314 140.8904109589041 828.0109589041094 126.69863013698631Q840.4287671232876 112.50684931506851 859.0554794520547 104.16917808219179Q877.6821917808219 95.83150684931508 901.4534246575342 95.83150684931508Q932.6753424657534 95.83150684931508 954.1404109589041 109.84589041095892Q975.6054794520547 123.86027397260276 986.958904109589 146.38972602739727Q998.3123287671233 168.9191780821918 998.3123287671233 195.52876712328768V214.6876712328767H856.3945205479451Q857.458904109589 223.2027397260274 860.2972602739726 230.2986301369863Q865.2643835616437 243.42602739726027 875.9082191780822 250.52191780821917Q886.5520547945205 257.6178082191781 903.5821917808219 257.6178082191781Q919.1931506849314 257.6178082191781 929.1273972602739 251.586301369863Q939.0616438356163 245.55479452054794 942.6095890410959 236.68493150684932H994.7643835616437Q990.5068493150684 256.1986301369863 978.0890410958903 271.4547945205479Q965.6712328767122 286.7109589041096 946.8671232876711 295.2260273972603Q928.0630136986301 303.741095890411 903.5821917808219 303.741095890411ZM856.749315068493 182.4013698630137H944.3835616438355Q943.3191780821917 174.24109589041097 940.4808219178082 167.5Q935.5136986301369 155.08219178082192 925.7568493150684 148.51849315068495Q916.0 141.95479452054795 901.4534246575342 141.95479452054795Q886.5520547945205 141.95479452054795 876.2630136986301 148.6958904109589Q865.9739726027397 155.43698630136987 860.6520547945205 168.20958904109588Q858.1684931506849 174.59589041095893 856.749315068493 182.4013698630137ZM1019.9547945205479 297.0V102.57260273972602H1065.013698630137V151.53424657534248Q1066.7876712328766 143.37397260273974 1069.6260273972603 136.27808219178084Q1077.0767123287671 116.4095890410959 1092.6876712328767 106.47534246575343Q1108.2986301369863 96.54109589041096 1130.650684931507 96.54109589041096H1133.1342465753423Q1167.194520547945 96.54109589041096 1185.1116438356164 118.71575342465754Q1203.0287671232877 140.8904109589041 1203.0287671232877 185.94931506849315V297.0H1146.2616438356165V182.75616438356167Q1146.2616438356165 167.14520547945207 1137.0369863013698 157.2109589041096Q1127.8123287671233 147.27671232876713 1112.2013698630137 147.27671232876713Q1096.2356164383561 147.27671232876713 1086.4787671232875 157.38835616438357Q1076.7219178082191 167.5 1076.7219178082191 183.82054794520548V297.0ZM1235.3150684931506 297.0V38.0H1292.0821917808219V134.85890410958905Q1299.5328767123287 116.76438356164385 1313.0150684931505 106.83013698630137Q1327.5616438356162 96.54109589041096 1349.5589041095889 96.54109589041096H1352.0424657534245Q1384.3287671232874 96.54109589041096 1401.3589041095888 119.42534246575343Q1418.3890410958902 142.3095890410959 1418.3890410958902 186.3041095890411V297.0H1361.621917808219V182.75616438356167Q1361.621917808219 166.79041095890412 1352.2198630136986 157.03356164383564Q1342.817808219178 147.27671232876713 1327.5616438356162 147.27671232876713Q1311.5958904109589 147.27671232876713 1301.8390410958905 157.56575342465754Q1292.0821917808219 167.85479452054796 1292.0821917808219 184.8849315068493V297.0ZM1568.112328767123 297.0V259.74657534246575Q1565.6287671232876 267.1972602739726 1562.435616438356 273.2287671232877Q1554.2753424657533 287.06575342465754 1540.2609589041094 294.5164383561644Q1526.2465753424656 301.96712328767126 1506.0232876712328 301.96712328767126Q1485.090410958904 301.96712328767126 1469.3020547945202 294.5164383561644Q1453.5136986301368 287.06575342465754 1444.643835616438 273.05136986301375Q1435.7739726027396 259.0369863013699 1435.7739726027396 239.52328767123288Q1435.7739726027396 218.23561643835615 1446.772602739726 204.57602739726028Q1457.7712328767122 190.9164383561644 1477.639726027397 184.3527397260274Q1497.508219178082 177.7890410958904 1523.4082191780822 177.7890410958904H1558.5328767123287V177.07945205479453Q1558.5328767123287 162.17808219178082 1551.4369863013699 154.72739726027396Q1544.3410958904108 147.27671232876713 1528.7301369863012 147.27671232876713Q1520.9246575342465 147.27671232876713 1508.1520547945206 147.6315068493151Q1495.3794520547945 147.986301369863 1481.8972602739725 148.6958904109589Q1468.4150684931506 149.4054794520548 1457.4164383561642 150.1150684931507V102.2178082191781Q1465.576712328767 101.50821917808219 1476.5753424657532 100.7986301369863Q1487.5739726027396 100.08904109589042 1499.282191780822 99.73424657534248Q1510.990410958904 99.37945205479454 1521.2794520547943 99.37945205479454Q1551.0821917808219 99.37945205479454 1571.4828767123286 107.89452054794522Q1591.8835616438355 116.4095890410959 1602.5273972602738 133.61712328767123Q1613.171232876712 150.82465753424657 1613.171232876712 177.7890410958904V297.0ZM1558.5328767123287 209.36575342465756H1523.0534246575342Q1508.1520547945204 209.36575342465756 1500.1691780821916 216.63904109589043Q1492.1863013698628 223.91232876712328 1492.1863013698628 236.33013698630137Q1492.1863013698628 248.03835616438357 1500.1691780821916 255.31164383561645Q1508.1520547945204 262.58493150684933 1523.0534246575342 262.58493150684933Q1532.6328767123287 262.58493150684933 1540.2609589041094 259.21438356164384Q1547.8890410958902 255.84383561643835 1552.8561643835615 247.68356164383562Q1557.8232876712327 239.52328767123288 1558.5328767123287 224.97671232876712ZM1645.4575342465753 297.0V102.57260273972602H1690.5164383561641V151.53424657534248Q1692.290410958904 143.37397260273974 1694.7739726027396 136.63287671232877Q1702.2246575342465 116.76438356164385 1717.1260273972603 106.6527397260274Q1732.0273972602738 96.54109589041096 1753.6698630136984 96.54109589041096H1756.153424657534Q1778.1506849315067 96.54109589041096 1792.8746575342466 106.6527397260274Q1807.5986301369862 116.76438356164385 1815.404109589041 136.63287671232877Q1815.758904109589 137.6972602739726 1816.1136986301367 138.4068493150685Q1816.1136986301367 137.6972602739726 1816.8232876712327 136.63287671232877Q1824.2739726027396 116.76438356164385 1839.1753424657531 106.6527397260274Q1854.076712328767 96.54109589041096 1875.7191780821915 96.54109589041096H1878.2027397260272Q1900.1999999999998 96.54109589041096 1915.2787671232875 106.6527397260274Q1930.3575342465751 116.76438356164385 1938.16301369863 136.63287671232877Q1945.9684931506847 156.5013698630137 1945.9684931506847 186.3041095890411V297.0H1889.2013698630135V183.1109589041096Q1889.2013698630135 167.14520547945207 1880.8636986301367 157.2109589041096Q1872.5260273972601 147.27671232876713 1857.2698630136983 147.27671232876713Q1842.0136986301368 147.27671232876713 1833.143835616438 157.38835616438357Q1824.2739726027396 167.5 1824.2739726027396 184.17534246575343V297.0H1767.1520547945204V183.1109589041096Q1767.1520547945204 167.14520547945207 1758.8143835616438 157.2109589041096Q1750.476712328767 147.27671232876713 1735.5753424657532 147.27671232876713Q1719.9643835616437 147.27671232876713 1711.0945205479452 157.38835616438357Q1702.2246575342465 167.5 1702.2246575342465 184.17534246575343V297.0ZM2036.7958904109587 297.0V102.57260273972602H2081.854794520548V151.53424657534248Q2083.628767123287 143.37397260273974 2086.112328767123 136.63287671232877Q2093.5630136986297 116.76438356164385 2108.4643835616434 106.6527397260274Q2123.365753424657 96.54109589041096 2145.008219178082 96.54109589041096H2147.4917808219175Q2169.48904109589 96.54109589041096 2184.2130136986298 106.6527397260274Q2198.9369863013694 116.76438356164385 2206.7424657534243 136.63287671232877Q2207.097260273972 137.6972602739726 2207.4520547945203 138.4068493150685Q2207.4520547945203 137.6972602739726 2208.161643835616 136.63287671232877Q2215.612328767123 116.76438356164385 2230.513698630137 106.6527397260274Q2245.4150684931506 96.54109589041096 2267.057534246575 96.54109589041096H2269.541095890411Q2291.538356164383 96.54109589041096 2306.617123287671 106.6527397260274Q2321.695890410959 116.76438356164385 2329.5013698630137 136.63287671232877Q2337.306849315068 156.5013698630137 2337.306849315068 186.3041095890411V297.0H2280.539726027397V183.1109589041096Q2280.539726027397 167.14520547945207 2272.2020547945203 157.2109589041096Q2263.8643835616435 147.27671232876713 2248.608219178082 147.27671232876713Q2233.3520547945204 147.27671232876713 2224.4821917808217 157.38835616438357Q2215.612328767123 167.5 2215.612328767123 184.17534246575343V297.0H2158.490410958904V183.1109589041096Q2158.490410958904 167.14520547945207 2150.152739726027 157.2109589041096Q2141.81506849315 147.27671232876713 2126.913698630137 147.27671232876713Q2111.302739726027 147.27671232876713 2102.4328767123284 157.38835616438357Q2093.5630136986297 167.5 2093.5630136986297 184.17534246575343V297.0ZM2458.6465753424654 303.741095890411Q2433.8109589041096 303.741095890411 2414.8294520547943 295.2260273972603Q2395.8479452054794 286.7109589041096 2383.2527397260274 272.34178082191784Q2370.6575342465753 257.972602739726 2364.0938356164384 240.05547945205478Q2357.5301369863014 222.13835616438357 2357.5301369863014 203.3342465753425V196.23835616438356Q2357.5301369863014 176.72465753424657 2364.0938356164384 158.80753424657536Q2370.6575342465753 140.8904109589041 2383.0753424657532 126.69863013698631Q2395.4931506849316 112.50684931506851 2414.1198630136987 104.16917808219179Q2432.746575342466 95.83150684931508 2456.517808219178 95.83150684931508Q2487.7397260273974 95.83150684931508 2509.2047945205477 109.84589041095892Q2530.6698630136984 123.86027397260276 2542.0232876712325 146.38972602739727Q2553.376712328767 168.9191780821918 2553.376712328767 195.52876712328768V214.6876712328767H2411.4589041095887Q2412.523287671233 223.2027397260274 2415.361643835616 230.2986301369863Q2420.3287671232874 243.42602739726027 2430.972602739726 250.52191780821917Q2441.6164383561645 257.6178082191781 2458.6465753424654 257.6178082191781Q2474.2575342465752 257.6178082191781 2484.1917808219177 251.586301369863Q2494.1260273972603 245.55479452054794 2497.6739726027395 236.68493150684932H2549.8287671232874Q2545.571232876712 256.1986301369863 2533.153424657534 271.4547945205479Q2520.735616438356 286.7109589041096 2501.931506849315 295.2260273972603Q2483.127397260274 303.741095890411 2458.6465753424654 303.741095890411ZM2411.813698630137 182.4013698630137H2499.4479452054793Q2498.3835616438355 174.24109589041097 2495.545205479452 167.5Q2490.5780821917806 155.08219178082192 2480.821232876712 148.51849315068495Q2471.064383561644 141.95479452054795 2456.517808219178 141.95479452054795Q2441.6164383561645 141.95479452054795 2431.3273972602738 148.6958904109589Q2421.0383561643835 155.43698630136987 2415.7164383561644 168.20958904109588Q2413.2328767123286 174.59589041095893 2411.813698630137 182.4013698630137ZM2655.202739726027 303.386301369863Q2634.624657534246 303.386301369863 2617.771917808219 295.9356164383562Q2600.9191780821916 288.4849315068493 2588.5013698630137 275.18013698630136Q2576.0835616438353 261.8753424657534 2569.5198630136983 243.78082191780823Q2562.9561643835614 225.68630136986303 2562.9561643835614 204.75342465753425V196.59315068493152Q2562.9561643835614 175.66027397260274 2569.16506849315 157.56575342465754Q2575.3739726027393 139.47123287671232 2587.2595890410958 125.81164383561644Q2599.1452054794518 112.15205479452055 2615.8205479452054 104.52397260273973Q2632.4958904109585 96.89589041095891 2653.0739726027396 96.89589041095891Q2676.490410958904 96.89589041095891 2693.520547945205 106.83013698630137Q2707.002739726027 114.9904109589041 2715.8726027397256 129.18219178082194V38.0H2772.994520547945V297.0H2727.9356164383557V255.84383561643835Q2726.161643835616 259.74657534246575 2724.3876712328765 263.64931506849314Q2713.743835616438 283.16301369863015 2696.004109589041 293.27465753424656Q2678.2643835616436 303.386301369863 2655.202739726027 303.386301369863ZM2669.394520547945 255.84383561643835Q2682.521917808219 255.84383561643835 2693.343150684931 249.98972602739727Q2704.1643835616433 244.13561643835618 2710.7280821917802 232.78219178082193Q2717.291780821917 221.42876712328768 2717.291780821917 205.46301369863014V192.33561643835617Q2717.291780821917 176.72465753424657 2710.550684931506 166.08082191780824Q2703.8095890410955 155.43698630136987 2692.810958904109 149.76027397260276Q2681.812328767123 144.08356164383562 2669.0397260273967 144.08356164383562Q2654.847945205479 144.08356164383562 2643.6719178082185 151.3568493150685Q2632.4958904109585 158.63013698630138 2626.109589041095 171.22534246575344Q2619.7232876712324 183.82054794520548 2619.7232876712324 200.4958904109589Q2619.7232876712324 217.5260273972603 2626.109589041095 229.94383561643838Q2632.4958904109585 242.36164383561643 2643.8493150684926 249.10273972602738Q2655.202739726027 255.84383561643835 2669.394520547945 255.84383561643835ZM2817.698630136986 297.0V144.43835616438358H2791.798630136986V102.57260273972602H2874.4657534246576V297.0ZM2839.695890410959 83.41369863013699Q2823.730136986301 83.41369863013699 2816.1020547945204 75.07602739726028Q2808.4739726027397 66.73835616438356 2808.4739726027397 53.96575342465755Q2808.4739726027397 40.83835616438358 2816.1020547945204 32.50068493150687Q2823.730136986301 24.163013698630152 2839.695890410959 24.163013698630152Q2855.6616438356164 24.163013698630152 2863.289726027397 32.50068493150687Q2870.917808219178 40.83835616438358 2870.917808219178 53.96575342465755Q2870.917808219178 66.73835616438356 2863.289726027397 75.07602739726028Q2855.6616438356164 83.41369863013699 2839.695890410959 83.41369863013699ZM3028.4465753424656 297.0V259.74657534246575Q3025.9630136986298 267.1972602739726 3022.7698630136983 273.2287671232877Q3014.6095890410957 287.06575342465754 3000.5952054794516 294.5164383561644Q2986.580821917808 301.96712328767126 2966.357534246575 301.96712328767126Q2945.4246575342463 301.96712328767126 2929.636301369863 294.5164383561644Q2913.8479452054794 287.06575342465754 2904.9780821917807 273.05136986301375Q2896.108219178082 259.0369863013699 2896.108219178082 239.52328767123288Q2896.108219178082 218.23561643835615 2907.1068493150683 204.57602739726028Q2918.1054794520546 190.9164383561644 2937.973972602739 184.3527397260274Q2957.842465753424 177.7890410958904 2983.7424657534243 177.7890410958904H3018.867123287671V177.07945205479453Q3018.867123287671 162.17808219178082 3011.771232876712 154.72739726027396Q3004.675342465753 147.27671232876713 2989.064383561644 147.27671232876713Q2981.258904109589 147.27671232876713 2968.4863013698628 147.6315068493151Q2955.7136986301366 147.986301369863 2942.2315068493144 148.6958904109589Q2928.7493150684927 149.4054794520548 2917.750684931507 150.1150684931507V102.2178082191781Q2925.9109589041095 101.50821917808219 2936.909589041096 100.7986301369863Q2947.908219178082 100.08904109589042 2959.6164383561645 99.73424657534248Q2971.3246575342464 99.37945205479454 2981.6136986301367 99.37945205479454Q3011.4164383561642 99.37945205479454 3031.817123287671 107.89452054794522Q3052.2178082191776 116.4095890410959 3062.861643835616 133.61712328767123Q3073.5054794520547 150.82465753424657 3073.5054794520547 177.7890410958904V297.0ZM3018.867123287671 209.36575342465756H2983.3876712328765Q2968.4863013698628 209.36575342465756 2960.503424657534 216.63904109589043Q2952.520547945205 223.91232876712328 2952.520547945205 236.33013698630137Q2952.520547945205 248.03835616438357 2960.503424657534 255.31164383561645Q2968.4863013698628 262.58493150684933 2983.3876712328765 262.58493150684933Q2992.967123287671 262.58493150684933 3000.5952054794516 259.21438356164384Q3008.223287671233 255.84383561643835 3013.190410958904 247.68356164383562Q3018.157534246575 239.52328767123288 3018.867123287671 224.97671232876712Z"/><path class="wdot" d="M3091.5 235h49a6 6 0 0 1 6 6v50a6 6 0 0 1 -6 6h-49a6 6 0 0 1 -6 -6v-50a6 6 0 0 1 6 -6z"/></svg>';
  var logo = '<a class="logo" href="index.html" aria-label="Avenham Media home">' + WM + '</a>';
  var head = document.createElement('header'); head.className = 'nav'; bg.after(head);
  var foot = document.createElement('footer'); document.body.appendChild(foot);
  var tab = document.createElement('nav'); tab.className = 'tabbar'; tab.setAttribute('aria-label', 'Pages'); document.body.appendChild(tab);
  var veil = document.createElement('div'); veil.className = 'veil'; document.body.appendChild(veil);

  // ---------- Dadwoven extras: skip link, progress bar, frost, floating buttons, notices ----------
  var store = {
    get: function (k, f) { try { var v = localStorage.getItem(k); return v == null ? f : JSON.parse(v); } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  window.LL.store = store;
  if (!document.documentElement.lang) document.documentElement.lang = 'en-GB';
  var mainEl = document.querySelector('main'); if (mainEl && !mainEl.id) mainEl.id = 'main';
  var skip = document.createElement('a'); skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Skip to content'; document.body.prepend(skip);
  var prog = document.createElement('div'); prog.className = 'progress'; prog.setAttribute('aria-hidden', 'true'); document.body.appendChild(prog);
  var frost = document.createElement('div'); frost.id = 'frost'; frost.setAttribute('aria-hidden', 'true'); document.body.appendChild(frost);
  var fabs = document.createElement('div'); fabs.className = 'fabs'; document.body.appendChild(fabs);
  function toast(t) {
    [].forEach.call(document.querySelectorAll('.toast'), function (x) { x.remove(); });
    var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = t; document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2400);
  }
  window.LL.toast = toast;
  // arriving from another page: start frosted, then clear
  var arrivedFrosted = false;
  try { arrivedFrosted = sessionStorage.getItem('ll-frost') === '1'; sessionStorage.removeItem('ll-frost'); } catch (e) { }

  var drawer = document.createElement('div'); drawer.className = 'drawer'; document.body.appendChild(drawer);
  var search = document.createElement('div'); search.className = 'search'; search.hidden = true;
  search.innerHTML = '<div class="search-in" role="dialog" aria-label="Search"><div class="search-bar"><input id="q" type="search" placeholder="Search Avenham Media" autocomplete="off"><button class="nbtn" type="button" id="close-search" aria-label="Close search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div id="results" class="results"></div></div>';
  document.body.appendChild(search);
  function openSearch() { search.hidden = false; var q = document.getElementById('q'); q.value = ''; runSearch(''); setTimeout(function () { q.focus(); }, 30); }
  function closeSearch() { search.hidden = true; }
  search.addEventListener('click', function (e) { if (e.target === search || e.target.closest('#close-search')) closeSearch(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSearch(); drawer.classList.remove('open'); } });
  function runSearch(q) {
    q = q.toLowerCase().trim();
    var items = [];
    Object.keys(C.pages).forEach(function (k) { if (C.pages[k].show !== false) items.push([C.pages[k].nav, 'Page', k + '.html']); });
    vis(C.services).forEach(function (s) { items.push([s.title, s.blurb, 'services.html', s.items]); });
    vis(C.projects).forEach(function (p) { items.push([p.name, p.desc, /^https?:/.test(p.url || '') ? p.url : 'work.html', p.tags]); });
    vis(C.packages).forEach(function (p) { items.push([p.name + ' package', p.blurb, 'packages.html', p.features]); });
    vis(C.faqs).forEach(function (f) { items.push([f.q, f.a, 'packages.html']); });
    vis(C.shopitems || []).forEach(function (p) { items.push([p.name, p.blurb, 'shop.html', p.features]); });
    var hits = items.filter(function (it) { return !q || it.join(' ').toLowerCase().indexOf(q) > -1; }).slice(0, 8);
    document.getElementById('results').innerHTML = hits.length ? hits.map(function (h) { var ext = /^https?:/.test(h[2]); return '<a href="' + esc(h[2]) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><b>' + esc(h[0]) + '</b><span>' + esc(String(h[1] || '').slice(0, 90)) + '</span></a>'; }).join('') : '<p class="muted" style="padding:14px">Nothing found. Try “website” or “packages”.</p>';
  }
  search.addEventListener('input', function (e) { if (e.target.id === 'q') runSearch(e.target.value); });
  var TABICON = { index: '<path d="M4 11l8-7 8 7v9H4z"/>', services: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>', work: ICONS.stairs, packages: '<path d="M4 7h16M4 12h16M4 17h10"/>', shop: ICONS.shop, contact: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>' };

  function buildChrome() {
    var s = C.settings, pages = Object.keys(C.pages).map(function (k) { return Object.assign({ key: k }, C.pages[k]); }).filter(function (p) { return p.show !== false; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var cta = safeUrl(s.navCtaLink) || 'contact.html';
    var SRCH = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    var SUN = '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
    var MOON = '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
    var MENU = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
    head.innerHTML = '<div class="wrap"><div class="nav-in">' + logo + '<nav class="links" id="links" aria-label="Main"><span class="pillbg" id="pill"></span>' +
      pages.map(function (p) { return '<a href="' + p.key + '.html"' + (p.key === pageKey ? ' class="on" aria-current="page"' : '') + '>' + esc(p.nav) + '</a>'; }).join('') +
      '</nav><div class="nav-r"><button class="nbtn theme-btn" type="button" id="theme-btn" aria-label="Switch light or dark mode">' + SUN + MOON + '</button><button class="nbtn" type="button" id="open-search" aria-label="Search the site (press /)">' + SRCH + '</button>' +
      '<a class="npill dark" href="contact.html">' + esc(s.navCta2 || 'Get in touch') + '</a><a class="npill hot" href="' + esc(cta) + '">' + esc(s.navCta) + '</a>' +
      '<button class="nbtn sq" type="button" id="open-menu" aria-label="Open menu" aria-expanded="false">' + MENU + '</button></div></div><div class="announce" id="announce"></div></div>';
    drawer.innerHTML = '<div class="drawer-in"><div class="item-h">' + logo + '<button class="nbtn" type="button" id="close-menu" aria-label="Close menu"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="dsearch"><label class="sr" for="qm" style="position:absolute;left:-9999px">Search</label><input id="qm" type="search" placeholder="Search Avenham Media" autocomplete="off"></div><nav class="dlinks" aria-label="Menu">' +
      pages.map(function (p) { return '<a href="' + p.key + '.html"' + (p.key === pageKey ? ' class="on" aria-current="page"' : '') + '>' + esc(p.nav) + '</a>'; }).join('') +
      '</nav><a class="npill hot" href="' + esc(cta) + '" style="justify-content:center">' + esc(s.navCta) + '</a></div>';
    document.getElementById('open-menu').onclick = function () { openMenu(); };
    document.getElementById('close-menu').onclick = function () { closeMenu(); };
    drawer.onclick = function (e) { if (e.target === drawer) closeMenu(); };
    document.getElementById('open-search').onclick = openSearch;
    document.getElementById('theme-btn').onclick = toggleTheme;
    document.getElementById('qm').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var v = this.value; closeMenu(); openSearch(); var q = document.getElementById('q'); q.value = v; runSearch(v); } });
    paintAnnounce(); paintFabs();
    tab.innerHTML = pages.map(function (p) {
      return '<a href="' + p.key + '.html"' + (p.key === pageKey ? ' class="on" aria-current="page"' : '') + '><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (TABICON[p.key] || TABICON.index) + '</svg><span>' + esc(p.nav) + '</span></a>';
    }).join('') + '<span class="tpill" id="tpill"></span>';
    var soc = [['Instagram', s.instagram], ['TikTok', s.tiktok], ['Facebook', s.facebook], ['LinkedIn', s.linkedin]].filter(function (x) { return /^https?:\/\//.test(x[1] || ''); });
    var li = function (href, label, ext) { return '<li><a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(label) + '</a></li>'; };
    var follow = soc.map(function (x) { return li(x[1], x[0], true); }).join('') + li('contact.html', 'Email us');
    foot.innerHTML = '<div class="wrap"><div class="fgrid"><div class="fbrand">' + logo + '<p>' + esc(s.footerText) + '</p></div>' +
      '<div><h4>Services</h4><ul>' + li('services.html', 'Websites') + li('services.html', 'Design') + li('services.html', 'Social') + li('shop.html', 'Review & NFC cards') + '</ul></div>' +
      '<div><h4>Studio</h4><ul>' + li('work.html', 'Our work') + li('packages.html', 'Packages') + li('contact.html', 'Book a free chat') + li('contact.html', 'Contact') + '</ul></div>' +
      '<div><h4>Follow</h4><ul>' + follow + '</ul></div></div>' +
      '<div class="fbottom"><span>' + esc(s.copyright) + ' · <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <button type="button" id="cookie-settings">Cookie settings</button>' + (window.AM ? '' : ' · <a href="admin.html">Admin</a>') + '</span><span>Websites<span class="dot">.</span> Design<span class="dot">.</span> Social<span class="dot">.</span></span></div></div>';
    document.getElementById('cookie-settings').onclick = function () { cookieBanner(true); };
    var pill = document.getElementById('pill'), cur = document.querySelector('#links a.on');
    var tpill = document.getElementById('tpill'), tcur = tab.querySelector('a.on');
    function put(p, a, anim) { if (!a || !a.offsetWidth) { p.style.opacity = '0'; return; } if (!anim) p.style.transition = 'none'; p.style.opacity = '1'; p.style.left = a.offsetLeft + 'px'; p.style.width = a.offsetWidth + 'px'; if (!anim) { p.offsetWidth; p.style.transition = ''; } }
    function place() { cur = document.querySelector('#links a.on'); tcur = tab.querySelector('a.on'); put(pill, cur, false); put(tpill, tcur, false); }
    window.LL.slideTo = function (a) {
      var p = a.closest('#links') ? pill : a.closest('.tabbar') ? tpill : null; if (!p) return false;
      var moved = p.style.left && p.style.left !== a.offsetLeft + 'px' && p.style.opacity === '1';
      put(p, a, true);
      if (moved && !reduce && p.animate) p.animate([{ transform: 'none' }, { transform: 'scale(1.04,.96)', offset: .4 }, { transform: 'none' }], { duration: 500, easing: 'ease-out' }); [].forEach.call(a.parentNode.querySelectorAll('a'), function (x) { x.classList.toggle('on', x === a); });
      try { sessionStorage.setItem('ll-pill', JSON.stringify({ k: p.id, l: p.style.left, w: p.style.width })); } catch (e) { }
      return true;
    };
    // arrive: start the pill where it was on the last page, then slide to this page
    var prev = null; try { prev = JSON.parse(sessionStorage.getItem('ll-pill') || 'null'); sessionStorage.removeItem('ll-pill'); } catch (e) { }
    function arrive() {
      place();
      if (prev && C.design.motion && !reduce) { var p = document.getElementById(prev.k), a = p === pill ? cur : tcur; if (p && a) { p.style.transition = 'none'; p.style.left = prev.l; p.style.width = prev.w; p.offsetWidth; p.style.transition = ''; requestAnimationFrame(function () { put(p, a, true); }); } prev = null; }
    }
    arrive(); setTimeout(place, 400); if (document.fonts) document.fonts.ready.then(function () { if (!prev) setTimeout(place, 420); }); window.onresize = place;
    if (C.pages[pageKey] && C.pages[pageKey].title && here !== 'admin.html') document.title = C.pages[pageKey].title;
  }

  // ---------- design tokens + toggles ----------
  var loadedFonts = {};
  function loadFont(f) { if (!f || loadedFonts[f] || /^(Sora|Manrope)$/.test(f)) return; loadedFonts[f] = 1; var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(f).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap'; document.head.appendChild(l); }
  function applyDesign() {
    var d = C.design, r = document.documentElement.style;
    var theme = currentTheme(), light = theme === 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var pal = light ? { bg: '#F3F5F9', bg2: '#FFFFFF', fg: '#0B1626', muted: '#4D5B70' } : { bg: d.bg, bg2: d.bg2, fg: d.fg, muted: d.muted };
    [['--accent', d.accent], ['--accent-2', d.accent2], ['--bg', pal.bg], ['--bg2', pal.bg2], ['--fg', pal.fg], ['--muted', pal.muted]].forEach(function (p) { r.setProperty(p[0], safeColor(p[1], '')); });
    var tc = document.querySelector('meta[name="theme-color"]'); if (!tc) { tc = document.createElement('meta'); tc.name = 'theme-color'; document.head.appendChild(tc); } tc.content = pal.bg;
    loadFont(d.fontDisplay); loadFont(d.fontBody);
    r.setProperty('--display', '"' + d.fontDisplay + '",Sora,Arial,sans-serif'); r.setProperty('--body', '"' + d.fontBody + '",Manrope,Arial,sans-serif');
    r.setProperty('--r', (+d.radius || 0) + 'px'); r.setProperty('--stairs-op', (+d.stairsOpacity || 0) / 100); r.setProperty('--stairs-speed', (+d.stairsSpeed || 9) + 's');
    document.body.style.fontSize = (+d.baseSize || 16) + 'px';
    r.setProperty('--hscale', (+d.headingScale || 100) / 100);
    var b = document.body.classList;
    ['leather', 'circuit', 'carbon', 'grid', 'frost'].forEach(function (t) { b.toggle('tex-' + t, d.navTexture === t); });
    b.toggle('no-stairs', !d.stairs); b.toggle('anim-stairs', !!d.stairsAnim); b.toggle('no-blobs', !d.blobs); b.toggle('no-tri', !d.tri); b.toggle('no-bigstairs', !d.bigstairs); b.toggle('no-contours', !d.contours); b.toggle('no-drift', !d.drift); b.toggle('no-grid', !d.grid); b.toggle('no-grain', !d.grain);
    b.toggle('no-marquee', !d.marquee); b.toggle('no-heroanim', !d.heroAnim); b.toggle('no-motion', !d.motion);
    b.toggle('no-progress', d.progress === false); b.toggle('no-totop', d.totop === false); b.toggle('no-fab', d.fab === false); b.toggle('no-spotlight', d.spotlight === false);
    b.toggle('no-compact', d.compact === false); b.toggle('no-float', d.coverFloat === false); b.toggle('no-themetoggle', d.themeToggle === false);
    var tr = document.querySelector('.track'); if (tr) tr.style.animationDuration = (+d.marqueeSpeed || 34) + 's';
  }

  // ---------- theme ----------
  function currentTheme() {
    var t = C.design.themeToggle === false ? null : store.get('ll-theme', null);
    if (t === 'light' || t === 'dark') return t;
    var d = C.settings.themeDefault;
    if (d === 'light' || d === 'dark') return d;
    // match the visitor's own phone or computer setting
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  // if they change their device setting while the site is open, follow it (unless they picked a mode with the button)
  try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (!store.get('ll-theme', null)) applyDesign(); }); } catch (e) { }
  function toggleTheme(e) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    var flip = function () { store.set('ll-theme', next); applyDesign(); };
    var still = reduce || document.body.classList.contains('no-motion');
    if (!still && document.startViewTransition) {
      // the whole page gently fades from one mode into the other
      document.documentElement.classList.add('theme-vt');
      var t = document.startViewTransition(flip);
      t.finished.then(function () { document.documentElement.classList.remove('theme-vt'); }, function () { document.documentElement.classList.remove('theme-vt'); });
    } else if (!still) {
      // older browsers: colours fade across instead
      var h = document.documentElement; h.classList.add('theme-fade'); flip();
      setTimeout(function () { h.classList.remove('theme-fade'); }, 800);
    } else flip();
    toast(next === 'dark' ? 'Dark mode on' : 'Light mode on');
  }
  // question boxes (FAQ) open and close smoothly
  document.addEventListener('click', function (e) {
    var sm = e.target.closest && e.target.closest('details.glass > summary'); if (!sm) return;
    var d = sm.parentNode, body = d.querySelector('.ans'); if (!body || reduce || document.body.classList.contains('no-motion') || !body.animate) return;
    e.preventDefault();
    if (d._anim) { d._anim.cancel(); d._anim = null; }
    var ease = 'cubic-bezier(.2,.8,.2,1)';
    if (!d.open || d.classList.contains('closing')) {
      d.classList.remove('closing'); d.open = true;
      var h = body.getBoundingClientRect().height;
      d._anim = body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 420, easing: ease });
      d._anim.onfinish = function () { d._anim = null; };
    } else {
      var h2 = body.offsetHeight; d.classList.add('closing');
      d._anim = body.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: ease });
      d._anim.onfinish = function () { d.open = false; d.classList.remove('closing'); d._anim = null; };
    }
  });

  // ---------- menu ----------
  function openMenu() { drawer.classList.add('open'); var b = document.getElementById('open-menu'); if (b) b.setAttribute('aria-expanded', 'true'); setTimeout(function () { var q = document.getElementById('qm'); if (q && innerWidth > 600) q.focus(); }, 300); }
  function closeMenu() { if (!drawer.classList.contains('open')) return; drawer.classList.remove('open'); var b = document.getElementById('open-menu'); if (b) b.setAttribute('aria-expanded', 'false'); }

  // ---------- announcement bar (set in the admin panel, visitors can close it) ----------
  function annKey(s) { var t = String(s.annText || '') + '|' + String(s.annLink || ''), h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return 'll-ann-' + h; }
  function paintAnnounce() {
    var el = document.getElementById('announce'); if (!el) return; var s = C.settings;
    if (!s.annOn || !s.annText || store.get(annKey(s), false) || here === 'admin.html') { el.innerHTML = ''; return; }
    var link = safeUrl(s.annLink);
    el.innerHTML = '<div class="ann" role="region" aria-label="Announcement"><span class="pulse" aria-hidden="true"></span><p>' + esc(s.annText) + '</p>' +
      (link ? '<a href="' + esc(link) + '"' + (/^https?:/.test(link) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(s.annLabel || 'Find out more') + ' →</a>' : '') +
      '<button type="button" id="ann-x" aria-label="Close announcement"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    document.getElementById('ann-x').onclick = function () { store.set(annKey(s), true); el.innerHTML = ''; };
  }

  // ---------- floating buttons ----------
  function paintFabs() {
    var s = C.settings, link = safeUrl(s.fabLink) || 'contact.html', onContact = /contact\.html/.test(link) && here === 'contact.html';
    fabs.innerHTML = '<button class="totop" id="totop" type="button" aria-label="Back to the top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>' +
      (onContact || here === 'admin.html' ? '' : '<a class="fab" href="' + esc(link) + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.social + '</svg>' + esc(s.fabText || 'Free chat') + '</a>');
    document.getElementById('totop').onclick = function () {
      // our own eased scroll, so it always lands exactly at the top
      var y0 = scrollY, t0 = performance.now(), dur = Math.min(900, 380 + y0 / 8);
      if (reduce || !y0) window.scrollTo(0, 0);
      else (function step(now) { var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); window.scrollTo(0, Math.round(y0 * (1 - e))); if (k < 1) requestAnimationFrame(step); })(t0); var m = document.getElementById('main'); if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: true }); } };
    onScroll();
  }

  // ---------- scroll: progress bar, back to top, compact top bar ----------
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    var tt = document.getElementById('totop'); if (tt) tt.classList.toggle('show', scrollY > 600);
    document.documentElement.classList.toggle('scrolled', scrollY > 24);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  // ---------- light follows the pointer across glass ----------
  var specRaf = 0, specEv = null;
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    specEv = e; if (specRaf) return;
    specRaf = requestAnimationFrame(function () {
      specRaf = 0; var ev = specEv, g = ev.target.closest && ev.target.closest('.glass,.btn-g');
      if (!g) return; var r = g.getBoundingClientRect();
      g.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); g.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
  }, { passive: true });

  // ---------- keyboard: "/" opens search ----------
  addEventListener('keydown', function (e) {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '') && !document.body.classList.contains('editing')) { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeMenu();
  });

  // ---------- cookies: page views and "how you found us" only with permission ----------
  function cookieBanner(force) {
    [].forEach.call(document.querySelectorAll('.cookie'), function (c) { c.remove(); });
    if (!force && (store.get('ll-cookie', null) || C.settings.cookieBanner === false || here === 'admin.html')) return;
    var c = document.createElement('div'); c.className = 'cookie'; c.setAttribute('role', 'region'); c.setAttribute('aria-label', 'Cookie choices');
    c.innerHTML = '<b>Cookies, kept simple</b><p>We use essential storage to remember your settings. With your OK we also count page visits and note how you found us, so we know what helps. <a href="privacy.html">Details</a></p>' +
      '<div class="crow"><button class="btn btn-p btn-sm" type="button" data-ck="all">Accept all</button><button class="btn btn-g btn-sm" type="button" data-ck="essential">Essential only</button></div>';
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      var v = b.getAttribute('data-ck'); store.set('ll-cookie', { choice: v, at: Date.now() }); c.remove();
      if (v === 'all') { noteArrival(); trackView(); } else { try { localStorage.removeItem('ll-utm'); } catch (x) { } }
      toast(v === 'all' ? 'Thanks. Choice saved.' : 'Only essential storage is on.');
    });
    document.body.appendChild(c);
  }
  window.LL.cookieBanner = cookieBanner;
  function analyticsOK() { return (store.get('ll-cookie', null) || {}).choice === 'all'; }
  function noteArrival() {
    if (!analyticsOK() || store.get('ll-utm', null)) return;
    var p; try { p = new URLSearchParams(location.search); } catch (e) { p = null; }
    var g = function (k) { return p ? (p.get(k) || '') : ''; };
    var ref = ''; try { ref = document.referrer && new URL(document.referrer).hostname; } catch (e) { }
    var rec = { source: g('utm_source'), medium: g('utm_medium'), campaign: g('utm_campaign'), referrer: ref || '', landing: here, at: Date.now() };
    if (!rec.source) rec.source = rec.referrer && rec.referrer !== location.hostname ? rec.referrer : 'direct';
    store.set('ll-utm', rec);
  }
  window.LL.arrival = function () { return analyticsOK() ? store.get('ll-utm', null) : null; };
  var viewed = false;
  async function trackView() {
    if (viewed || !analyticsOK() || here === 'admin.html') return;
    var r = (await window.LL.ready) || {}; if (!r.db) return;
    var u = null; try { u = await window.claude.use('user'); } catch (e) { }
    var id = null; try { id = u && await u.id(); } catch (e) { }
    if (!id) return; viewed = true;
    var day = new Date().toISOString().slice(0, 10), ref = r.db.doc('views/' + id);
    try {
      var d = await ref.get(), v = d.exists ? (d.data() || {}) : {}, days = v.days || {}, today = days[day] || { total: 0 };
      today.total = (today.total || 0) + 1; today[pageKey] = (today[pageKey] || 0) + 1; days[day] = today;
      Object.keys(days).sort().slice(0, -30).forEach(function (k) { delete days[k]; });
      var a = store.get('ll-utm', null);
      await ref.set({ days: days, source: v.source || (a && a.source) || 'direct', last: Date.now() });
    } catch (e) { }
  }

  // ---------- quiet error log the owner can read in the admin panel ----------
  var errCount = 0, errQueue = [];
  async function logError(msg, src) {
    if (errCount >= 5) return; errCount++;
    errQueue.push({ msg: String(msg || 'Unknown error').slice(0, 300), src: String(src || '').slice(0, 160), page: here, at: Date.now(), ua: navigator.userAgent.slice(0, 120) });
    try {
      var r = (await window.LL.ready) || {}; if (!r.db) return;
      var u = await window.claude.use('user'); var id = u && await u.id(); if (!id) return;
      var ref = r.db.doc('errors/' + id), d = await ref.get(), list = (d.exists && d.data().list) || [];
      list = list.concat(errQueue.splice(0)).slice(-10);
      await ref.set({ list: list, last: Date.now() });
    } catch (e) { }
  }
  addEventListener('error', function (e) { if (e.message) logError(e.message, (e.filename || '').split('/').pop() + ':' + (e.lineno || '')); });
  addEventListener('unhandledrejection', function (e) { var r = e.reason; if (r && (r.code === 'not_granted' || r.code === 'timeout')) return; logError(r && (r.message || r.code) || String(r), 'promise'); });
  window.LL.withTimeout = function (p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej({ code: 'timeout' }); }, ms || 15000); })]); };

  // ---------- search engines and link previews ----------
  function seo() {
    var s = C.settings, pg = C.pages[pageKey] || {};
    var desc = document.querySelector('meta[name="description"]');
    var text = (desc && desc.getAttribute('content')) || s.seoDescription;
    var SITE = /(^|\.)avenhammedia\.co\.uk$/.test(location.hostname) ? location.origin + '/' : 'https://avenhammedia.co.uk/';
    var abs = function (p) { return SITE + String(p).replace(/^\/+/, ''); };
    var home = SITE, here_ = here === 'index.html' ? SITE : SITE + here.replace(/\.html$/, '');
    function meta(attr, k, v) { var m = document.querySelector('meta[' + attr + '="' + k + '"]'); if (!m) { m = document.createElement('meta'); m.setAttribute(attr, k); document.head.appendChild(m); } m.setAttribute('content', v); }
    meta('name', 'description', text); meta('property', 'og:title', document.title); meta('property', 'og:description', text);
    meta('property', 'og:type', 'website'); meta('property', 'og:site_name', 'Avenham Media'); meta('property', 'og:locale', 'en_GB');
    meta('property', 'og:url', here_); meta('property', 'og:image', abs('img/og.png')); meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', document.title); meta('name', 'twitter:description', text); meta('name', 'twitter:image', abs('img/og.png'));
    var can = document.querySelector('link[rel="canonical"]'); if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); } can.href = here_;
    var org = { '@type': ['Organization', 'ProfessionalService'], '@id': home + '#org', name: 'Avenham Media', url: home, logo: abs('img/icon.png'), image: abs('img/og.png'),
      description: s.seoDescription, email: s.email, areaServed: { '@type': 'Country', name: 'United Kingdom' }, priceRange: '£450 - £750',
      knowsAbout: ['Website design', 'Web development', 'Small business websites', 'Branding', 'Logo design', 'Social media management'],
      sameAs: [s.instagram, s.tiktok, s.facebook, s.linkedin].filter(function (x) { return /^https?:/.test(x || ''); }),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Website, branding and social media packages', itemListElement: vis(C.packages).map(function (p) {
        var price = String(p.price || '').replace(/[^0-9.]/g, ''); var o = { '@type': 'Offer', name: p.name + ' package', description: p.blurb, priceCurrency: 'GBP', areaServed: { '@type': 'Country', name: 'United Kingdom' } };
        if (price) o.price = price; return o; }) } };
    var graph = [org, { '@type': 'WebSite', '@id': home + '#site', url: home, name: 'Avenham Media', inLanguage: 'en-GB', publisher: { '@id': home + '#org' } },
      { '@type': 'WebPage', '@id': here_ + '#page', url: here_, name: document.title, description: text, inLanguage: 'en-GB', isPartOf: { '@id': home + '#site' }, about: { '@id': home + '#org' } }];
    if (pageKey !== 'index' && pg.nav) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: home }, { '@type': 'ListItem', position: 2, name: pg.nav, item: here_ }] });
    if (document.querySelector('[data-list="services"],[data-list="alts"],[data-list="rows"]')) graph.push({ '@type': 'ItemList', name: 'Services', itemListElement: vis(C.services).map(function (v, i) { return { '@type': 'ListItem', position: i + 1, item: { '@type': 'Service', name: v.title, description: v.blurb, provider: { '@id': home + '#org' }, areaServed: { '@type': 'Country', name: 'United Kingdom' } } }; }) });
    if (document.querySelector('[data-list="faqs"]')) graph.push({ '@type': 'FAQPage', mainEntity: vis(C.faqs).map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) });
    var el = document.getElementById('ld'); if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ld'; document.head.appendChild(el); }
    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }

  // ---------- client reviews under each project ----------
  var STAR = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.75 6.3.78-4.62 4.36 1.18 6.24L12 16.9l-5.61 3.03 1.18-6.24-4.62-4.36 6.3-.78z" fill="currentColor"/></svg>';
  function featuresHTML(p) {
    var f = String(p.features || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); if (!f.length) return '';
    return '<div class="pfeat glass"><span class="label">Features</span><ul>' + f.map(function (x) {
      var i = x.indexOf(' \u2014 '), t = i > 0 ? x.slice(0, i) : x, why = i > 0 ? x.slice(i + 3) : '';
      return '<li>' + TICK + '<span><b>' + esc(t) + '</b>' + (why ? '<em>' + esc(why) + '</em>' : '') + '</span></li>';
    }).join('') + '</ul><a class="pfeat-cta" href="contact.html">Want this for your business? Get a free quote ' + ARR + '</a></div>';
  }
  function reviewHTML(p) {
    var text = String(p.reviewText || '').trim(); if (!text) return '';
    var n = Math.max(0, Math.min(5, Math.round(+p.rating || 0)));
    var stars = n ? '<div class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + [1, 2, 3, 4, 5].map(function (i) { return '<span class="' + (i <= n ? 'on' : '') + '" style="--s:' + i + '">' + STAR + '</span>'; }).join('') + '</div>' : '';
    var who = esc(p.reviewName || 'Client') + (p.reviewRole ? '<span>' + esc(p.reviewRole) + '</span>' : '');
    return '<figure class="review glass">' + stars + '<blockquote>\u201c' + esc(text) + '\u201d</blockquote><figcaption><b>' + who + '</b></figcaption></figure>';
  }

  // ---------- lists ----------
  function vis(list) { return list.filter(function (x) { return x.show !== false; }); }
  var R = {
    shelf: function (el, list) {
      var cat = el.getAttribute('data-cat'), items = vis(list).filter(function (p) { return !cat || (p.category || 'website') === cat; });
      if (cat && !items.length) { var CN = { website: 'website and web app', design: 'design', social: 'social media' }[cat] || cat; el.innerHTML = '<div class="glass shelf-empty"><span class="pulse" aria-hidden="true"></span><div><b>Our ' + esc(CN) + ' work is coming soon<span class="dot">.</span></b><p class="muted">We\u2019re adding projects here. Want to be one of them? <a href="contact.html">Book a free chat</a>.</p></div></div>'; return; }
      el.innerHTML = items.map(function (p) {
        var url = /^https?:\/\//i.test(p.url || '') ? p.url : '', bgc = safeColor(p.bg, '#1B2A42'), ink = safeColor(p.ink, '#FFFFFF'), acc = safeColor(p.accent, '#F05A28');
        var h = esc(p.headline || p.name).replace(/\./g, '<b style="color:' + acc + '">.</b>'), tag = url ? 'a' : 'div';
        var light = parseInt(acc.slice(1, 3), 16) * .3 + parseInt(acc.slice(3, 5), 16) * .59 + parseInt(acc.slice(5, 7), 16) * .11 > 160;
        var img = safeImg(p.image), soon = p.soon || !url;
        var face = img ? '<img class="snap" src="' + esc(img) + '" alt="The ' + esc(p.name) + ' website" loading="lazy" decoding="async">' :
          '<div class="mock" style="background:' + bgc + ';color:' + ink + '" aria-hidden="true">' +
          '<div class="bar" style="background:rgba(255,255,255,.14);color:' + ink + '"><span>' + esc(p.name).toLowerCase() + '</span><span style="width:18px;height:10px;border-block:2px solid currentColor;display:inline-block"></span></div>' +
          '<div class="h">' + h + '</div><div class="pb" style="background:' + acc + ';color:' + (light ? '#111' : '#fff') + '">' + esc(p.button || 'Find out more') + ' →</div></div>';
        return '<div class="proj">' + '<' + tag + ' class="cover"' + (url ? ' href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="Visit ' + esc(p.name) + '"' : '') + '><div class="screen">' + face + (soon ? '<span class="soon"><i></i>Coming soon</span>' : '') + '</div>' +
          '<div class="cap"><b>' + esc(p.name) + '</b>' + (url ? '<span class="visit">Visit ' + EXT + '</span>' : '<span class="muted" style="font-size:14px">Link coming soon</span>') + '</div></' + tag + '>' + reviewHTML(p) + featuresHTML(p) + '</div>';
      }).join('');
    },
    rows: function (el, list) {
      el.innerHTML = vis(list).map(function (s) {
        return '<a class="srow rv" href="services.html"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[s.icon] || ICONS.web) + '</svg></div><h3>' + esc(s.title) + '</h3><p>' + esc(s.blurb) + '</p><span class="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
      }).join('');
    },
    alts: function (el, list) {
      el.innerHTML = vis(list).map(function (s) {
        return '<article class="glass alt rv"><div class="alt-txt"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[s.icon] || ICONS.web) + '</svg></div><h2>' + esc(s.title) + '<span class="dot">.</span></h2><p>' + esc(s.blurb) + '</p><ul>' +
          String(s.items || '').split('\n').filter(Boolean).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div><div class="alt-art" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[s.icon] || ICONS.web) + '</svg></div></article>';
      }).join('');
    },
    socials: function (el) {
      var s = C.settings, h = function (u) { return '@' + String(u).replace(/\/$/, '').split('/').pop().replace('@', ''); };
      var waDigits = String(s.whatsapp || '').replace(/[^0-9]/g, ''), waLink = waDigits.length >= 10 ? 'https://wa.me/' + waDigits.replace(/^0/, '44') : 'contact.html';
      var waText = s.whatsapp ? (/^[+0-9 ()-]+$/.test(s.whatsapp) ? s.whatsapp : h(s.whatsapp)) : '';
      var items = [
        ['Instagram', s.instagram ? h(s.instagram) : '', s.instagram, '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'],
        ['Facebook', s.facebook ? h(s.facebook) : '', s.facebook, '<path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.5-1.5H17V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.3H8.5v3H11V21"/>'],
        ['WhatsApp', waText, waLink, ICONS.social],
        ['Email', s.email ? s.email : '', 'contact.html', '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>']];
      if (/^https?:/.test(s.tiktok || '')) items.push(['TikTok', h(s.tiktok), s.tiktok, '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.4 5 4.6"/>']);
      el.innerHTML = items.map(function (x) {
        var url = /^https?:\/\//.test(x[2] || '') ? x[2] : (x[2] && /\.html$/.test(x[2]) ? x[2] : '');
        var ext = /^https?:/.test(url);
        return '<a class="glass soc rv" href="' + esc(url || 'contact.html') + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><span class="si"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + x[3] + '</svg></span><div><b>' + x[0] + '</b><br><span>' + esc(x[1] || 'Coming soon') + '</span></div></a>';
      }).join('');
    },
    services: function (el, list) {
      el.innerHTML = vis(list).map(function (s) {
        return '<article class="glass card rv"><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[s.icon] || ICONS.web) + '</svg></div><h3>' + esc(s.title) + '</h3><p>' + esc(s.blurb) + '</p><ul>' +
          String(s.items || '').split('\n').filter(Boolean).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></article>';
      }).join('');
    },
    projects: function (el, list) {
      list = vis(list); var lim = +(el.getAttribute('data-limit') || 0); if (lim) list = list.slice(0, lim);
      el.innerHTML = list.map(function (p) {
        var url = /^https?:\/\//i.test(p.url || '') ? p.url : '', bgc = safeColor(p.bg, '#1B2A42'), ink = safeColor(p.ink, '#FFFFFF'), acc = safeColor(p.accent, '#F05A28');
        var h = esc(p.headline || p.name).replace(/\./g, '<b style="color:' + acc + '">.</b>'), tag = url ? 'a' : 'div';
        var light = parseInt(acc.slice(1, 3), 16) * .3 + parseInt(acc.slice(3, 5), 16) * .59 + parseInt(acc.slice(5, 7), 16) * .11 > 160;
        return '<' + tag + ' class="glass case rv"' + (url ? ' href="' + esc(url) + '" target="_blank" rel="noopener"' : '') + '>' +
          '<div class="mock" style="background:' + bgc + ';color:' + ink + '" aria-hidden="true"><div class="mock-in" style="display:flex;flex-direction:column;gap:14px;height:100%">' +
          '<div class="bar" style="background:rgba(255,255,255,.14);color:' + ink + '"><span>' + esc(p.name).toLowerCase() + '</span><span style="width:18px;height:10px;border-block:2px solid currentColor;display:inline-block"></span></div>' +
          '<div class="h">' + h + '</div><div class="pb" style="background:' + acc + ';color:' + (light ? '#111' : '#fff') + '">' + esc(p.button || 'Find out more') + ' →</div></div></div>' +
          '<div class="info"><h3 style="font-size:26px">' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p><div class="tags">' +
          String(p.tags || '').split(',').filter(function (t) { return t.trim(); }).map(function (t) { return '<span class="tag">' + esc(t.trim()) + '</span>'; }).join('') + '</div>' +
          (url ? '<span class="visit">Visit website ' + EXT + '</span>' : '<span class="muted" style="font-size:14px">Website link coming soon</span>') + '</div></' + tag + '>';
      }).join('');
    },
    packages: function (el, list) {
      el.innerHTML = vis(list).map(function (p) {
        return '<article class="glass card rv' + (p.popular ? ' pop' : '') + '">' + (p.popular ? '<span class="badge">Most popular</span>' : '') +
          '<h2 style="font-size:22px;letter-spacing:-.02em">' + esc(p.name) + '</h2>' + (String(p.price || '').trim() ? '<div class="price">£' + esc(p.price) + ' <small>' + esc(p.unit) + '</small></div>' : '<div class="price quote">Your quote</div>') + '<p>' + esc(p.blurb) + '</p><ul>' +
          String(p.features || '').split('\n').filter(Boolean).map(function (f) { return '<li>' + TICK + esc(f) + '</li>'; }).join('') +
          '</ul><a class="btn ' + (p.popular ? 'btn-p' : 'btn-g') + '" href="contact.html' + (String(p.price || '').trim() ? '?package=' + encodeURIComponent(p.name) : '?need=Custom') + '">' + esc(p.button || ('Choose ' + p.name)) + '</a></article>';
      }).join('');
    },
    shopitems: function (el, list) {
      var NFC = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 0 1 0 9M12 5a10 10 0 0 1 0 14M5 10a2.5 2.5 0 0 1 0 4"/></svg>';
      var STARS5 = '<span class="pc-stars" aria-hidden="true">' + [1, 2, 3, 4, 5].map(function () { return STAR; }).join('') + '</span>';
      el.innerHTML = vis(list).map(function (p) {
        var price = String(p.price || '').trim(), need = encodeURIComponent(p.need || p.name);
        var face = p.kind === 'review'
          ? '<div class="pcard pc-review"><div class="pc-top">' + NFC + '<span>Tap to review us</span></div>' + STARS5 + '<b>Loved your visit?</b><small>Tap your phone here to leave a review</small><i class="pc-qr"></i></div>'
          : '<div class="pcard pc-nfc"><div class="pc-top">' + NFC + '<span>Tap for our website</span></div><span class="pc-logo">' + STEPS + '</span><b>Your business</b><small>Menu · Bookings · Contact</small></div>';
        return '<article class="glass prod rv"><div class="prod-art" aria-hidden="true">' + face + '</div><div class="prod-txt"><h2>' + esc(p.name) + '<span class="dot">.</span></h2><p>' + esc(p.blurb) + '</p><ul>' +
          String(p.features || '').split('\n').filter(Boolean).map(function (f) { return '<li>' + TICK + esc(f) + '</li>'; }).join('') + '</ul>' +
          (String(p.socials || '').trim() ? '<div class="prod-soc"><h3>Socials</h3><p class="muted">One tap can take people to any of these:</p><div class="soc-chips">' + String(p.socials).split('\n').filter(Boolean).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div>' : '') +
          '<div class="prod-buy"><span class="price">' + (price ? '£' + esc(price) + (p.unit ? ' <small>' + esc(p.unit) + '</small>' : '') : '<small style="font-size:16px">Ask for a price</small>') + '</span>' + (p.deal ? '<span class="deal"><b>Better value:</b> ' + esc(p.deal) + '</span>' : '') +
          '<a class="btn btn-p" href="contact.html?need=' + need + '">' + esc(p.button || 'Order now') + ' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div></article>';
      }).join('');
    },
    faqs: function (el, list) {
      var fl = vis(list), lim = +(el.getAttribute('data-limit') || 0); if (lim) fl = fl.slice(0, lim);
      el.innerHTML = fl.map(function (f, i) { return '<details class="glass rv"' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.q) + '<span class="pl" aria-hidden="true">+</span></summary><div class="ans"><p>' + esc(f.a) + '</p></div></details>'; }).join('');
    }
  };

  // ---------- per-element overrides (text, link, colour, size, weight, align, hidden) ----------
  function regionOf(el) { return el.closest('main') ? 'm' : el.closest('header.nav') ? 'h' : el.closest('footer') ? 'f' : null; }
  function rootFor(r) { return r === 'm' ? document.querySelector('main') : r === 'h' ? head : foot; }
  function keyOf(el) {
    var r = regionOf(el); if (!r || el.closest('[data-list]') && !el.hasAttribute('data-list')) return null;
    var root = rootFor(r), path = []; while (el && el !== root) { path.unshift([].indexOf.call(el.parentNode.children, el)); el = el.parentNode; }
    return el ? r + '.' + path.join('.') : null;
  }
  function find(key) {
    var parts = key.split('.'), el = rootFor(parts[0]); if (!el) return null;
    for (var i = 1; i < parts.length; i++) { el = el.children[+parts[i]]; if (!el) return null; }
    return el;
  }
  function ownText(el) { return [].filter.call(el.childNodes, function (n) { return n.nodeType === 3; }); }
  function getText(el) { return ownText(el).map(function (n) { return n.nodeValue; }).join('').trim(); }
  function setText(el, t) { var ns = ownText(el).filter(function (n) { return n.nodeValue.trim(); }); if (!ns.length) { el.insertBefore(document.createTextNode(t), el.firstChild); return; } ns[0].nodeValue = t; for (var i = 1; i < ns.length; i++) ns[i].nodeValue = ''; }
  window.LL.text = { getText: getText, ownText: ownText };
  var originals = {};
  function applyOverride(key, o) {
    var el = find(key); if (!el) return;
    if (!originals[key]) originals[key] = { t: getText(el), href: el.getAttribute('href'), style: el.getAttribute('style') || '' };
    if (o.t != null && o.t !== '' && getText(el) !== o.t) setText(el, o.t);
    if (o.href && el.tagName === 'A' && safeUrl(o.href)) el.setAttribute('href', o.href);
    el.style.color = o.color || ''; el.style.fontSize = o.size ? o.size + 'px' : ''; el.style.fontWeight = o.weight || ''; el.style.textAlign = o.align || '';
    el.style.backgroundColor = o.bgc || ''; el.style.marginTop = o.mt != null && o.mt !== '' ? o.mt + 'px' : '';
    el.classList.toggle('ed-hidden', !!o.hide); el.style.display = o.hide ? 'none' : '';
  }
  function applyText() {
    var all = Object.assign({}, C.text.global || {}, C.text[pageKey] || {});
    Object.keys(all).forEach(function (k) { applyOverride(k, all[k]); });
  }
  window.LL.override = { keyOf: keyOf, find: find, apply: applyOverride, originals: originals, setText: setText };

  function applySettings() {
    var s = C.settings;
    [].slice.call(document.querySelectorAll('[data-s]')).forEach(function (el) { var v = s[el.getAttribute('data-s')]; if (v != null && v !== '') el.textContent = v; });
    [].slice.call(document.querySelectorAll('[data-wa]')).forEach(function (el) { el.hidden = !s.whatsapp; });
    var tr = document.querySelector('.track');
    if (tr) { var words = String(s.marquee || '').split(',').map(function (w) { return w.trim(); }).filter(Boolean); var one = '<span>' + words.map(function (w) { return esc(w) + ' <i></i>'; }).join(' ') + '</span>'; tr.innerHTML = one + one + one + one; }
  }

  // ---------- reveal on scroll ----------
  var io = null;
  if (!reduce && 'IntersectionObserver' in window) io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  function watch() {
    if (!io || !C.design.reveal || !C.design.motion) return;
    [].slice.call(document.querySelectorAll('.rv:not(.seen)')).forEach(function (el, i) {
      el.classList.add('seen');
      if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add('pre'); el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); }
    });
  }

  function render(keepChrome) {
    applyDesign(); if (!keepChrome) buildChrome(); applySettings();
    [].slice.call(document.querySelectorAll('[data-list]')).forEach(function (el) { var k = el.getAttribute('data-list'); if (R[k]) R[k](el, C[{ shelf: 'projects', rows: 'services', alts: 'services', socials: 'settings' }[k] || k]); });
    applyText(); watch(); seo(); setIdx(); workTabs(); shelfNav();
  }
  // projects row: left/right arrows and click-and-drag on computers (phones swipe as normal)
  function shelfNav() {
    [].forEach.call(document.querySelectorAll('.shelf'), function (sh) {
      var wrap = sh.parentNode;
      if (!wrap.classList.contains('shelf-wrap')) {
        wrap = document.createElement('div'); wrap.className = 'shelf-wrap'; sh.parentNode.insertBefore(wrap, sh); wrap.appendChild(sh);
        var AR = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
        wrap.insertAdjacentHTML('beforeend', '<button type="button" class="shelf-arrow prev" aria-label="Previous projects">' + AR('M15 5l-7 7 7 7') + '</button><button type="button" class="shelf-arrow next" aria-label="More projects">' + AR('M9 5l7 7-7 7') + '</button>');
        var prev = wrap.querySelector('.prev'), next = wrap.querySelector('.next');
        var upd = function () { var max = sh.scrollWidth - sh.clientWidth; wrap.classList.toggle('can-scroll', max > 4); prev.disabled = sh.scrollLeft < 12; next.disabled = sh.scrollLeft > max - 12; };
        var step = function (d) { var c = sh.querySelector('.proj'), w = c ? c.getBoundingClientRect().width + 34 : sh.clientWidth * .8; sh.scrollBy({ left: d * w, behavior: reduce ? 'auto' : 'smooth' }); };
        prev.onclick = function () { step(-1); }; next.onclick = function () { step(1); };
        sh.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd);
        var down = null, moved = false;
        sh.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0 || !wrap.classList.contains('can-scroll')) return; down = { x: e.clientX, l: sh.scrollLeft }; moved = false; });
        window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - down.x; if (!moved && Math.abs(dx) > 6) { moved = true; sh.classList.add('dragging'); } if (moved) sh.scrollLeft = down.l - dx; });
        window.addEventListener('pointerup', function () { if (!down) return; down = null; if (moved) { sh.classList.remove('dragging'); var c = sh.querySelector('.proj'), w = c ? c.getBoundingClientRect().width + 34 : 1; sh.scrollTo({ left: Math.round(sh.scrollLeft / w) * w, behavior: reduce ? 'auto' : 'smooth' }); } });
        sh.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
        sh.addEventListener('dragstart', function (e) { e.preventDefault(); });
        wrap._upd = upd;
      }
      if (wrap._upd) { wrap._upd(); setTimeout(wrap._upd, 400); }
    });
  }
  // Our work: Websites / Design / Social tabs with the sliding pill
  function workTabs() {
    var seg = document.getElementById('worktabs'), shelf = document.querySelector('.shelf[data-cat]'); if (!seg || !shelf) return;
    var pill = seg.querySelector('.lpill');
    function place(b, anim) { if (!b) return; if (!anim) pill.style.transition = 'none'; pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; pill.style.opacity = '1'; if (!anim) { pill.offsetWidth; pill.style.transition = ''; } }
    function pick(cat, anim) {
      var b = seg.querySelector('[data-cat="' + cat + '"]') || seg.querySelector('[data-cat]'); cat = b.getAttribute('data-cat');
      [].forEach.call(seg.querySelectorAll('[data-cat]'), function (x) { var on = x === b; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
      place(b, anim); shelf.setAttribute('data-cat', cat); R.shelf(shelf, C.projects); watch(); shelfNav(); shelf.scrollLeft = 0;
      if (anim && !reduce) { [].forEach.call(shelf.children, function (c, i) { c.style.setProperty('--i', i); }); shelf.classList.remove('stg-in'); void shelf.offsetWidth; shelf.classList.add('stg-in'); if (pill.animate) pill.animate([{ transform: 'none' }, { transform: 'scale(1.04,.96)', offset: .4 }, { transform: 'none' }], { duration: 500, easing: 'ease-out' }); }
      try { history.replaceState(history.state, '', location.pathname + location.search + (cat === 'website' ? '' : '#' + cat)); } catch (e) { }
    }
    seg.onclick = function (e) { var b = e.target.closest('[data-cat]'); if (b) pick(b.getAttribute('data-cat'), true); };
    seg.onkeydown = function (e) { if (!/Arrow(Left|Right)/.test(e.key)) return; var bs = [].slice.call(seg.querySelectorAll('[data-cat]')), i = bs.indexOf(document.activeElement); if (i < 0) return; var n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); pick(n.getAttribute('data-cat'), true); };
    var h = (location.hash || '').slice(1); pick(/^(website|design|social)$/.test(h) ? h : (shelf.getAttribute('data-cat') || 'website'), false);
    setTimeout(function () { place(seg.querySelector('[aria-selected="true"]'), false); }, 350);
  }
  function setIdx() { [].forEach.call(document.querySelectorAll('.beliefs,.soccards,.pk,.faq,.incl,.rows,.alts,.shelf,.stairs'), function (g) { [].forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); }); }); }
  window.LL.render = render;
  // cards arrive one after another the first time a page opens (not on live updates)
  function stagger() {
    if (reduce || !C.design.motion) return;
    setIdx(); document.body.classList.add('stg'); setTimeout(function () { document.body.classList.remove('stg'); }, 1400);
  }
  render(); stagger();
  setTimeout(function () { cookieBanner(false); }, 900);
  noteArrival();

  // ---------- switching pages: Dadwoven's exact frost ----------
  // Like Dadwoven, the page is swapped in place: the top bar, background and buttons stay put,
  // the pill slides, a frost washes over everything under the top bar, the page lifts 4px,
  // the new page is swapped in at 200ms, settles up from 8px, and the frost melts away.
  var navTok = 0, frostT = 0, pageCache = {};
  function sameSite(href) { try { var u = new URL(href, location.href); return u.origin === location.origin && /\.html$/.test(u.pathname) && !/admin\.html$/.test(u.pathname); } catch (e) { return false; } }
  function fetchPage(url) {
    if (!pageCache[url]) pageCache[url] = fetch(url, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).catch(function (e) { delete pageCache[url]; throw e; });
    return pageCache[url];
  }
  function runScripts(nodes) {
    nodes.forEach(function (old) {
      if (old.src && /(site|admin)\.js(\?|$)/.test(old.src)) return;
      var n = document.createElement('script'); if (old.src) n.src = old.src; else n.textContent = old.textContent;
      (old.parentNode && document.contains(old) ? old.parentNode.replaceChild(n, old) : document.body.appendChild(n));
    });
  }
  function swapIn(html, url) {
    var doc = new DOMParser().parseFromString(html, 'text/html'), nm = doc.querySelector('main'), cur = document.querySelector('main');
    if (!nm || !cur) return false;
    var name = (doc.body.getAttribute('data-page') || (new URL(url, location.href).pathname.split('/').pop()) || 'index.html');
    here = name; pageKey = here.replace('.html', ''); document.body.setAttribute('data-page', here);
    var t = doc.querySelector('title'); if (t) document.title = t.textContent;
    var d = doc.querySelector('meta[name="description"]'), md = document.querySelector('meta[name="description"]'); if (d && md) md.setAttribute('content', d.getAttribute('content'));
    cur.innerHTML = nm.innerHTML; cur.id = 'main';
    window.scrollTo(0, 0);
    viewed = false; render(true); paintFabs(); stagger();
    var pg = C.pages[pageKey]; if (pg && pg.title) document.title = pg.title;
    [document.getElementById('links'), tab].forEach(function (nav) {
      if (!nav) return; var a = nav.querySelector('a[href="' + here + '"]');
      if (a) window.LL.slideTo(a); else [].forEach.call(nav.querySelectorAll('a'), function (x) { x.classList.remove('on'); x.removeAttribute('aria-current'); });
      [].forEach.call(nav.querySelectorAll('a'), function (x) { if (x === a) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
      if (!a) { var pl = nav.querySelector('.pillbg,.tpill'); if (pl) pl.style.opacity = '0'; }
    });
    [].forEach.call(drawer.querySelectorAll('.dlinks a'), function (x) { var on = x.getAttribute('href') === here; x.classList.toggle('on', on); if (on) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    runScripts([].slice.call(cur.querySelectorAll('script')));
    runScripts([].slice.call(doc.body.querySelectorAll('script')).filter(function (sc) { return !sc.closest('main'); }));
    trackView(); onScroll();
    return true;
  }
  function go(href, push) {
    var url = new URL(href, location.href).href;
    var tok = ++navTok; clearTimeout(frostT); closeMenu(); closeSearch();
    var main = document.querySelector('main');
    main.getAnimations().forEach(function (an) { an.cancel(); });
    frost.classList.add('live'); void frost.offsetWidth; frost.classList.add('on');
    main.animate([{ transform: 'none' }, { transform: 'translateY(-4px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    var page = fetchPage(url), wait = new Promise(function (r) { setTimeout(r, 200); });
    Promise.all([page, wait]).then(function (res) {
      if (tok !== navTok) return;
      if (push) history.pushState({ ll: 1 }, '', url);
      if (!swapIn(res[0], url)) { location.href = url; return; }
      var m = document.querySelector('main');
      m.getAnimations().forEach(function (an) { an.cancel(); });
      m.animate([{ transform: 'translateY(8px)' }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      requestAnimationFrame(function () { frost.classList.remove('on'); frostT = setTimeout(function () { if (tok === navTok) frost.classList.remove('live'); }, 700); });
    }).catch(function () { location.href = url; });
  }
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('editing')) return;
    var a = e.target.closest && e.target.closest('a[href$=".html"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!sameSite(href)) return;
    if (reduce || !C.design.transitions || !window.fetch || !window.DOMParser) return;
    e.preventDefault();
    if (new URL(href, location.href).href === location.href) { closeMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (window.LL.slideTo) window.LL.slideTo(a);
    go(href, true);
  });
  // warm the next page while the pointer is on its link, so the swap is instant
  document.addEventListener('pointerover', function (e) { var a = e.target.closest && e.target.closest('a[href$=".html"]'); if (a && sameSite(a.getAttribute('href'))) fetchPage(new URL(a.getAttribute('href'), location.href).href).catch(function () { }); }, { passive: true });
  try { history.replaceState({ ll: 1 }, '', location.href); } catch (e) { }
  addEventListener('popstate', function () { if (sameSite(location.href)) go(location.href, false); });
  addEventListener('pageshow', function (e) { veil.classList.remove('on'); document.body.classList.remove('leaving'); if (e.persisted) { frost.classList.remove('on', 'live'); } });

  // ---------- load saved content ----------
  window.LL.ready = (async function () {
    var db = null;
    try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
    window.LL.db = db;
    if (!db) return { db: null, content: C };
    try {
      var docs = await db.collection('site').get();
      docs.docs.forEach(function (d) {
        var v = d.data() || {};
        if (d.id === 'settings') Object.assign(C.settings, v);
        else if (d.id === 'design') Object.assign(C.design, v);
        else if (d.id === 'pages') Object.keys(v).forEach(function (k) { C.pages[k] = Object.assign({}, C.pages[k] || {}, v[k]); });
        else if (d.id.indexOf('text_') === 0) C.text[d.id.slice(5)] = v;
        else if (d.id === 'quiz') Object.keys(v).forEach(function (k) { C.quiz[k] = Object.assign({}, C.quiz[k] || {}, v[k]); });
      });
      var keys = ['services', 'projects', 'packages', 'faqs', 'shopitems'], qs = await Promise.all(keys.map(function (k) { return db.collection(k).get(); }));
      qs.forEach(function (q, i) { if (!q.empty) C[keys[i]] = q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); }); });
      render();
    } catch (e) { }
    return { db: db, content: C };
  })();

  trackView();

  // ---------- owner's in-page editor ----------
  window.LL.ready.then(async function (r) {
    if (!r.db || here === 'admin.html') return;
    var user = null; try { user = await window.claude.use('user'); } catch (e) { }
    if (!user || !(await user.canEdit())) return;
    var db = r.db, sel = null, dirty = {};
    var fab = document.createElement('div'); fab.className = 'ed-fab';
    fab.innerHTML = '<button class="btn btn-g btn-sm" id="ed-toggle" type="button">Edit this page</button>';
    document.body.appendChild(fab);
    var panel = document.createElement('div'); panel.className = 'ed-panel'; panel.hidden = true; document.body.appendChild(panel);
    function store(key) { return key[0] === 'm' ? pageKey : 'global'; }
    function cur(key) { var s = store(key); C.text[s] = C.text[s] || {}; return C.text[s][key] = C.text[s][key] || {}; }
    function show() {
      if (!sel) { panel.innerHTML = '<b>Edit mode</b><p class="muted">Tap any text, button, card or section to change it. Use “Select parent” to reach the box around it. Then press Save.</p>' + saveBtns(); return; }
      var key = keyOf(sel), o = cur(key), isA = sel.tagName === 'A', hasText = getText(sel) !== '' || !sel.children.length;
      panel.innerHTML = '<div class="item-h"><b>' + esc(sel.tagName.toLowerCase()) + (sel.className && typeof sel.className === 'string' ? ' · ' + esc(sel.className.split(' ')[0]) : '') + '</b><button class="ed-mini" data-a="close">Done</button></div>' +
        (hasText ? '<div class="f"><label for="ed-t">Text</label><textarea id="ed-t">' + esc(getText(sel)) + '</textarea></div>' : '<p class="muted">This is a box. You can colour, resize, move or hide it.</p>') +
        (isA ? '<div class="f"><label for="ed-h">Link</label><input id="ed-h" value="' + esc(sel.getAttribute('href') || '') + '"></div>' : '') +
        '<div class="ed-row"><div class="f"><label for="ed-c">Text colour</label><div class="swatch"><input type="color" id="ed-c" value="' + esc(o.color || '#ffffff') + '"><button class="ed-mini" data-a="nocolor">Default</button></div></div>' +
        '<div class="f"><label for="ed-b">Background</label><div class="swatch"><input type="color" id="ed-b" value="' + esc(o.bgc || '#0f1b2d') + '"><button class="ed-mini" data-a="nobg">None</button></div></div></div>' +
        '<div class="ed-row"><div class="f"><label for="ed-s">Text size (px)</label><input id="ed-s" type="number" min="8" max="200" value="' + esc(o.size || '') + '" placeholder="auto"></div>' +
        '<div class="f"><label for="ed-w">Weight</label><select id="ed-w"><option value="">Default</option>' + [300, 400, 500, 600, 700, 800].map(function (w) { return '<option' + (String(o.weight) === String(w) ? ' selected' : '') + '>' + w + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="ed-row"><div class="f"><label for="ed-al">Align</label><select id="ed-al"><option value="">Default</option>' + ['left', 'center', 'right'].map(function (a) { return '<option' + (o.align === a ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select></div>' +
        '<div class="f"><label for="ed-mt">Space above (px)</label><input id="ed-mt" type="number" min="-200" max="400" value="' + esc(o.mt == null ? '' : o.mt) + '" placeholder="auto"></div></div>' +
        '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ed-hide" style="width:auto"' + (o.hide ? ' checked' : '') + '> Hide this on the live site</label>' +
        '<div class="ed-btns"><button data-a="parent">Select parent</button><button data-a="reset">Reset this</button></div>' + saveBtns();
    }
    function saveBtns() { return '<div class="ed-btns"><button class="pri" data-a="save">Save page</button><button data-a="exit">Exit edit mode</button></div>'; }
    function pick(el) { if (sel) sel.classList.remove('ed-sel'); sel = el; if (sel) sel.classList.add('ed-sel'); show(); }
    function upd() {
      if (!sel) return; var key = keyOf(sel), o = cur(key), g = function (id) { return document.getElementById(id); };
      if (g('ed-t')) o.t = g('ed-t').value; if (g('ed-h')) o.href = g('ed-h').value.trim();
      o.size = g('ed-s').value; o.weight = g('ed-w').value; o.align = g('ed-al').value; o.mt = g('ed-mt').value; o.hide = g('ed-hide').checked;
      dirty[store(key)] = 1; applyOverride(key, o);
    }
    panel.addEventListener('input', function (e) {
      if (!sel) return; var key = keyOf(sel), o = cur(key);
      if (e.target.id === 'ed-c') { o.color = e.target.value; dirty[store(key)] = 1; applyOverride(key, o); return; }
      if (e.target.id === 'ed-b') { o.bgc = e.target.value; dirty[store(key)] = 1; applyOverride(key, o); return; }
      upd();
    });
    panel.addEventListener('change', upd);
    panel.addEventListener('click', async function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      var key = sel && keyOf(sel);
      if (a === 'close') pick(null);
      if (a === 'nocolor' && sel) { delete cur(key).color; dirty[store(key)] = 1; applyOverride(key, cur(key)); }
      if (a === 'nobg' && sel) { delete cur(key).bgc; dirty[store(key)] = 1; applyOverride(key, cur(key)); }
      if (a === 'parent' && sel) { var p = sel.parentElement; if (p && keyOf(p)) pick(p); }
      if (a === 'reset' && sel) {
        var st = store(key), orig = originals[key]; delete C.text[st][key]; dirty[st] = 1;
        if (orig) { setText(sel, orig.t); if (orig.href) sel.setAttribute('href', orig.href); sel.setAttribute('style', orig.style); sel.classList.remove('ed-hidden'); }
        show();
      }
      if (a === 'save') {
        e.target.textContent = 'Saving…';
        try {
          for (var s in dirty) {
            var clean = {}; Object.keys(C.text[s] || {}).forEach(function (k) { var o = C.text[s][k], c = {}; Object.keys(o).forEach(function (f) { if (o[f] !== '' && o[f] != null && o[f] !== false) c[f] = o[f]; }); if (Object.keys(c).length) clean[k] = c; });
            await db.doc('site/text_' + s).set(clean);
          }
          dirty = {}; e.target.textContent = 'Saved';
        } catch (err) { e.target.textContent = 'Couldn’t save, try again'; }
        setTimeout(function () { e.target.textContent = 'Save page'; }, 1600);
      }
      if (a === 'exit') toggle(false);
    });
    function onClick(e) {
      if (!document.body.classList.contains('editing') || panel.contains(e.target) || fab.contains(e.target)) return;
      var el = e.target.closest('main *, header.nav *, footer *'); if (!el) return;
      while (el && el.namespaceURI === 'http://www.w3.org/2000/svg') el = el.parentElement;
      var k = el && keyOf(el); while (el && !k) { el = el.parentElement; k = el && keyOf(el); }
      e.preventDefault(); e.stopPropagation(); if (el) pick(el);
    }
    document.addEventListener('click', onClick, true);
    function toggle(on) {
      document.body.classList.toggle('editing', on); panel.hidden = !on;
      document.getElementById('ed-toggle').textContent = on ? 'Editing…' : 'Edit this page';
      [].slice.call(document.querySelectorAll('main *, header.nav *, footer *')).forEach(function (el) { if (on) { if (keyOf(el)) el.setAttribute('data-k', ''); } else el.removeAttribute('data-k'); });
      if (!on) pick(null); else show();
    }
    document.getElementById('ed-toggle').addEventListener('click', function () { toggle(!document.body.classList.contains('editing')); });
    if (location.hash === '#edit') toggle(true);
  });
})();

      (function(){var cl=function(u){return String(u).replace(/\/index\.html(?=$|[?#])/,'/').replace(/\.html(?=$|[?#])/,'')},P=history.pushState,R=history.replaceState,last=location.pathname;function w(f){return function(s,t,u){if(u!=null)u=cl(new URL(u,location.href).href);var r=f.call(history,s,t,u);last=location.pathname;return r}}history.pushState=w(P);history.replaceState=w(R);try{history.replaceState(history.state,'',location.href)}catch(e){}addEventListener('popstate',function(){if(location.pathname!==last){last=location.pathname;if(!/\.html$/.test(location.pathname))location.reload()}})})();
