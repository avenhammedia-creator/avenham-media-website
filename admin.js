/* Avenham Media admin panel — owner/editors only. Controls design, pages, every list, messages, and per-element overrides. */
(async function () {
  var gate = document.getElementById('gate'), app = document.getElementById('app'), panel = document.getElementById('panel');
  var esc = window.LL.esc, ICONS = window.LL.ICONS, D = window.LL.DEFAULTS;
  var r = await window.LL.ready, db = r.db, C = r.content;
  var user = null; try { user = window.claude && await window.claude.use('user'); } catch (e) { }
  var ok = !!(db && user && await user.canEdit());
  if (!ok && window.AM) {
    // hosted site: sign in with the owner email and password set up in Supabase
    gate.innerHTML = '<form id="amf" class="lockbox" novalidate><h2 style="font-size:28px">Admin sign-in<span class="dot">.</span></h2><p class="muted">For the Avenham Media team only.</p>' +
      '<div class="f"><label for="am-e">Email</label><input id="am-e" type="email" autocomplete="username" value="' + esc(window.AM.config.adminEmail || '') + '"></div>' +
      '<div class="f"><label for="am-p">Password</label><input id="am-p" type="password" autocomplete="current-password"></div>' +
      '<div class="ed-btns"><button class="btn btn-p" type="submit">Sign in</button></div><div class="msg" id="am-out" hidden style="grid-column:auto"></div></form>';
    var amf = document.getElementById('amf'), amo = document.getElementById('am-out');
    amf.onsubmit = async function (e) {
      e.preventDefault(); var b = amf.querySelector('button'); b.disabled = true; b.textContent = 'Signing in\u2026';
      try { await window.AM.signIn(document.getElementById('am-e').value.trim(), document.getElementById('am-p').value);
        if (await window.AM.isOwner()) { location.reload(); return; }
        await window.AM.signOut(); amo.hidden = false; amo.textContent = 'That account isn\u2019t the owner of this site.';
      } catch (x) { amo.hidden = false; amo.textContent = /invalid/i.test(x && x.message || '') ? 'That email or password isn\u2019t right.' : 'Couldn\u2019t sign in. Check your connection and try again.'; }
      b.disabled = false; b.textContent = 'Sign in';
    };
    setTimeout(function () { var p = document.getElementById('am-p'); if (p) p.focus(); }, 50);
    return;
  }
  if (!ok) { gate.innerHTML = '<h2 style="font-size:26px">Owner only<span class="dot">.</span></h2><p class="muted" style="margin-top:10px">This page is for the Avenham Media team. Sign in with the account that owns this site to manage it.</p>'; return; }

  // ---------- second lock: the admin's own username and password (like Dadwoven) ----------
  var store = window.LL.store, uid = null;
  try { uid = await user.id(); } catch (e) { uid = null; }
  var lockRef = uid ? db.doc('data/users/' + uid + '/adminlock') : null;
  var IDLE = 30 * 60 * 1000, MAXTRY = 5, LOCKMS = 5 * 60 * 1000;
  function hex(buf) { return [].map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function unhex(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  async function hashPw(pw, saltHex, iter) {
    var k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(saltHex), iterations: iter }, k, 256));
  }
  function unlocked() { try { return +(sessionStorage.getItem('ll-adm-ok') || 0) > Date.now(); } catch (e) { return false; } }
  function touch() { try { sessionStorage.setItem('ll-adm-ok', String(Date.now() + IDLE)); } catch (e) { } }
  function lockNow() { try { sessionStorage.removeItem('ll-adm-ok'); } catch (e) { } location.reload(); }
  window.LL.adminLock = window.AM ? async function () { await window.AM.signOut(); location.reload(); } : lockNow;
  var gated = false;
  async function gateFlow() {
    if (window.AM) return true; // hosted site: Supabase sign-in already protects the panel
    if (!lockRef || !(window.crypto && crypto.subtle)) return true;
    if (unlocked()) { gated = true; touch(); return true; }
    var snap = null; try { snap = await lockRef.get(); } catch (e) { return true; }
    gated = true;
    var rec = snap && snap.exists ? snap.data() : null;
    return new Promise(function (resolve) {
      function paint(mode, note) {
        var tries = store.get('ll-adm-tries', { n: 0, until: 0 }), wait = tries.until - Date.now();
        gate.innerHTML = '<div class="lockbox"><h2 style="font-size:28px">' + (mode === 'setup' ? 'Set up your admin sign-in' : 'Admin sign-in') + '<span class="dot">.</span></h2>' +
          '<p class="muted">' + (mode === 'setup' ? 'Choose a username and password for this control panel. You’ll enter them each time you open it, on top of your Claude account.' : 'Enter your admin username and password. The panel locks itself after 30 minutes without activity.') + '</p>' +
          (note ? '<div class="msg" style="grid-column:auto">' + esc(note) + '</div>' : '') +
          (wait > 0 ? '<div class="msg" style="grid-column:auto">Too many wrong tries. Try again in ' + Math.ceil(wait / 60000) + ' minute' + (wait > 60000 ? 's' : '') + '.</div>' :
          '<form id="lockf" class="lockbox" novalidate><div class="f"><label for="lk-u">Username</label><input id="lk-u" autocomplete="username" autocapitalize="none" spellcheck="false"></div>' +
          '<div class="f"><label for="lk-p">Password</label><input id="lk-p" type="password" autocomplete="' + (mode === 'setup' ? 'new-password' : 'current-password') + '"></div>' +
          (mode === 'setup' ? '<div class="f"><label for="lk-p2">Password again</label><input id="lk-p2" type="password" autocomplete="new-password"></div><p class="muted" style="font-size:14px">At least 10 characters. A short sentence is easy to remember and hard to guess.</p>' : '') +
          '<div class="ed-btns"><button class="btn btn-p" type="submit">' + (mode === 'setup' ? 'Save and open' : 'Open the control panel') + '</button>' + (mode === 'signin' ? '<button class="btn btn-g btn-sm" type="button" id="lk-forgot">Forgot your password?</button>' : '') + '</div></form>') + '</div>';
        var f = document.getElementById('lockf'); if (!f) return;
        var fg = document.getElementById('lk-forgot');
        if (fg) fg.onclick = async function () {
          if (fg.getAttribute('data-sure') !== '1') { fg.setAttribute('data-sure', '1'); fg.textContent = 'Tap again to choose a new one'; return; }
          try { await lockRef.delete(); } catch (e) { } store.set('ll-adm-tries', { n: 0, until: 0 }); rec = null; paint('setup', 'You’re signed in as the owner, so you can choose a new admin username and password.');
        };
        f.onsubmit = async function (e) {
          e.preventDefault(); var u = document.getElementById('lk-u').value.trim().toLowerCase(), p = document.getElementById('lk-p').value;
          if (mode === 'setup') {
            if (u.length < 3) return paint('setup', 'Choose a username of at least 3 characters.');
            if (p.length < 10) return paint('setup', 'Use a password of at least 10 characters.');
            if (p !== document.getElementById('lk-p2').value) return paint('setup', 'The two passwords don’t match.');
            var salt = hex(crypto.getRandomValues(new Uint8Array(16))), iter = 150000;
            try { await lockRef.set({ user: u, salt: salt, iter: iter, hash: await hashPw(p, salt, iter), at: Date.now() }); } catch (x) { return paint('setup', 'That didn’t save. Try again.'); }
            touch(); resolve(true); return;
          }
          var good = u === rec.user && (await hashPw(p, rec.salt, rec.iter || 150000)) === rec.hash;
          if (good) { store.set('ll-adm-tries', { n: 0, until: 0 }); touch(); resolve(true); return; }
          var t = store.get('ll-adm-tries', { n: 0, until: 0 }); t.n = (t.n || 0) + 1; if (t.n >= MAXTRY) { t.n = 0; t.until = Date.now() + LOCKMS; } store.set('ll-adm-tries', t);
          paint('signin', 'That username or password isn’t right.' + (t.until > Date.now() ? '' : ' ' + (MAXTRY - t.n) + ' tr' + (MAXTRY - t.n === 1 ? 'y' : 'ies') + ' left.'));
        };
        setTimeout(function () { var x = document.getElementById('lk-u'); if (x) x.focus(); }, 50);
      }
      paint(rec ? 'signin' : 'setup');
    });
  }
  await gateFlow();
  ['pointerdown', 'keydown', 'scroll'].forEach(function (ev) { addEventListener(ev, function () { if (unlocked()) touch(); }, { passive: true }); });
  setInterval(function () { if (gated && !unlocked()) lockNow(); }, 30000);
  gate.hidden = true; app.hidden = false;

  var tabsEl = document.querySelector('.atabs');
  tabsEl.innerHTML = [['overview', 'Overview'], ['messages', 'Messages'], ['editor', 'Edit pages'], ['design', 'Design & colours'], ['motion', 'Animations & effects'], ['pages', 'Pages & menu'], ['site', 'Contact & footer'], ['quiz', 'Contact questions'], ['extras', 'Announcement & extras'],
    ['services', 'Services'], ['projects', 'Projects'], ['packages', 'Packages'], ['shopitems', 'Shop'], ['faqs', 'FAQ'], ['backup', 'Backup & reset']]
    .map(function (t, i) { return '<button' + (i === 0 ? ' class="on"' : '') + ' data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '<button type="button" id="adm-lock" style="margin-top:6px">' + (window.AM ? 'Sign out' : 'Lock the panel') + '</button>';
  document.getElementById('adm-lock').addEventListener('click', function (e) { e.stopPropagation(); window.LL.adminLock(); });

  var messages = [];
  async function loadMessages() { try { var q = await db.collection('messages').get(); messages = q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); } catch (e) { messages = []; } }
  await loadMessages();
  var views = [], errors = [];
  async function loadStats() {
    try { var q = await db.collection('views').get(); views = q.docs.map(function (d) { return d.data() || {}; }); } catch (e) { views = []; }
    try { var q2 = await db.collection('errors').get(); errors = []; q2.docs.forEach(function (d) { (d.data().list || []).forEach(function (x) { errors.push(x); }); }); errors.sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); } catch (e) { errors = []; }
  }
  await loadStats();
  function countUp() { [].forEach.call(document.querySelectorAll('[data-count]'), function (el) { var n = +el.getAttribute('data-count'), t0 = performance.now(); if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; (function step(t) { var k = Math.min(1, (t - t0) / 1000); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en-GB'); if (k < 1) requestAnimationFrame(step); })(t0); }); }

  function toast(t) { var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2200); }
  function field(id, lab, val, type, opts) {
    var v = esc(val == null ? '' : val);
    if (type === 'area') return '<div class="f full"><label for="' + id + '">' + lab + '</label><textarea id="' + id + '">' + v + '</textarea></div>';
    if (type === 'check') return '<label class="f" style="flex-direction:row;gap:10px;align-items:center"><input type="checkbox" id="' + id + '" style="width:auto"' + (val ? ' checked' : '') + '> ' + lab + '</label>';
    if (type === 'color') return '<div class="f"><label for="' + id + '">' + lab + '</label><div class="swatch"><input type="color" id="' + id + '" value="' + v + '"><input id="' + id + '-hex" value="' + v + '" aria-label="' + lab + ' hex code" style="font-family:monospace"></div></div>';
    if (type === 'select') return '<div class="f"><label for="' + id + '">' + lab + '</label><select id="' + id + '">' + opts.map(function (o) { var ov = Array.isArray(o) ? o[0] : o, ol = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(ov) + '"' + (String(val) === String(ov) ? ' selected' : '') + '>' + esc(ol) + '</option>'; }).join('') + '</select></div>';
    if (type === 'image') {
      var isData = /^data:/.test(val || '');
      return '<div class="f full"><label for="' + id + '-file">' + lab + '</label><div class="imgf"><div class="imgf-prev">' + (val ? '<img id="' + id + '-prev" src="' + v + '" alt="">' : '<img id="' + id + '-prev" alt="" hidden><span>No picture yet</span>') + '</div>' +
        '<div class="imgf-ctl"><input type="hidden" id="' + id + '" value="' + v + '"><label class="btn btn-g btn-sm imgf-up">Upload a picture<input type="file" accept="image/*" id="' + id + '-file" data-img="' + id + '" hidden></label>' +
        '<input id="' + id + '-link" data-link="' + id + '" value="' + (isData ? '' : v) + '" placeholder="or paste a picture link (https://…)">' +
        '<button type="button" class="btn btn-g btn-sm" data-imgclear="' + id + '">Remove picture</button><small class="muted">Big pictures are shrunk automatically. A screenshot of the home page works best.</small></div></div></div>';
    }
    if (type === 'range') return '<div class="f"><label for="' + id + '">' + lab + ' <span class="muted" id="' + id + '-v">' + v + (opts[3] || '') + '</span></label><input type="range" id="' + id + '" min="' + opts[0] + '" max="' + opts[1] + '" step="' + opts[2] + '" value="' + v + '" style="padding:0"></div>';
    return '<div class="f"><label for="' + id + '">' + lab + '</label><input id="' + id + '" value="' + v + '"' + (type === 'number' ? ' type="number"' : '') + '></div>';
  }
  var val = function (id) { var el = document.getElementById(id); return el ? (el.type === 'checkbox' ? el.checked : el.type === 'range' || el.type === 'number' ? +el.value : el.value.trim()) : undefined; };
  var FONTS = ['Sora', 'Manrope', 'Inter Tight', 'Plus Jakarta Sans', 'Outfit', 'Space Grotesk', 'Urbanist', 'Lexend', 'DM Sans', 'Poppins', 'Montserrat', 'Unbounded', 'Syne', 'Archivo', 'Bricolage Grotesque', 'Fraunces', 'Playfair Display'];

  var LISTS = {
    services: { title: 'Services', one: 'service', fields: [['title', 'Title'], ['icon', 'Icon', 'select', Object.keys(ICONS)], ['blurb', 'Short description'], ['items', 'Bullet points (one per line)', 'area'], ['show', 'Show on the site', 'check']] },
    projects: { title: 'Projects', one: 'project', fields: [['category', 'Shows under', 'select', [['website', 'Websites & web apps'], ['design', 'Design'], ['social', 'Social']]], ['name', 'Name'], ['url', 'Website link (https://…)'], ['image', 'Snapshot picture. Leave empty to show the drawn preview', 'image'], ['soon', 'Show “Coming soon” on the preview', 'check'], ['headline', 'Preview headline'], ['button', 'Preview button text'], ['bg', 'Preview background', 'color'], ['accent', 'Preview accent', 'color'], ['ink', 'Preview text colour', 'color'], ['tags', 'Tags (comma separated)'], ['desc', 'Description', 'area'], ['reviewText', 'Client review (in their own words)', 'area'], ['features', 'Features, one per line. Write the feature, then \u201c \u2014 \u201d, then why it helps a business (e.g. Online shop \u2014 sell day and night)', 'area'], ['reviewName', 'Who gave the review'], ['reviewRole', 'Their role or business (e.g. Owner, Max Cabs)'], ['rating', 'Star rating', 'select', [['', 'No stars'], ['5', '5 stars'], ['4', '4 stars'], ['3', '3 stars'], ['2', '2 stars'], ['1', '1 star']]], ['show', 'Show on the site', 'check']] },
    packages: { title: 'Packages', one: 'package', fields: [['name', 'Name'], ['price', 'Price (shown after £)'], ['unit', 'Price note (e.g. one-off)'], ['button', 'Button text'], ['blurb', 'Short description'], ['features', 'Features (one per line)', 'area'], ['popular', 'Mark as most popular', 'check'], ['show', 'Show on the site', 'check']] },
    shopitems: { title: 'Shop items', one: 'shop item', fields: [['name', 'Name'], ['kind', 'Card picture', 'select', [['review', 'Review card'], ['nfc', 'NFC business card']]], ['price', 'Price (shown after £, leave empty for \u201cAsk for a price\u201d)'], ['unit', 'Price note (e.g. each, or for 5)'], ['socials', 'Socials it can link to (one per line, optional)', 'area'], ['deal', 'Better-value offer (optional, e.g. 200 cards for \u00a3180 (90p each), save \u00a320)'], ['button', 'Button text'], ['need', 'Contact form option it ticks'], ['blurb', 'Short description', 'area'], ['features', 'Features (one per line)', 'area'], ['show', 'Show on the site', 'check']] },
    faqs: { title: 'FAQ', one: 'question', fields: [['q', 'Question'], ['a', 'Answer', 'area'], ['show', 'Show on the site', 'check']] }
  };
  var removed = { services: [], projects: [], packages: [], faqs: [], shopitems: [] };
  var PAGES = ['index', 'services', 'work', 'packages', 'shop', 'contact'];
  var PNAME = { index: 'Home', services: 'Services', work: 'Work', packages: 'Packages', shop: 'Shop', contact: 'Contact' };

  var VIEWS = {
    overview: function () {
      var unread = messages.filter(function (m) { return !m.read; }).length;
      var edits = Object.keys(C.text).reduce(function (n, k) { return n + Object.keys(C.text[k] || {}).length; }, 0);
      var days = [], today = new Date(); for (var i = 13; i >= 0; i--) { var dt = new Date(today.getTime() - i * 864e5), key = dt.toISOString().slice(0, 10); days.push({ k: key, d: dt.getDate(), v: 0 }); }
      var pagesC = {}, srcC = {};
      views.forEach(function (v) { var ds = v.days || {}; days.forEach(function (d) { var x = ds[d.k]; if (x) { d.v += x.total || 0; Object.keys(x).forEach(function (pk) { if (pk !== 'total') pagesC[pk] = (pagesC[pk] || 0) + x[pk]; }); } }); if (v.source) srcC[v.source] = (srcC[v.source] || 0) + 1; });
      var week = days.slice(7).reduce(function (n, d) { return n + d.v; }, 0), max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.v; })));
      var top = function (o) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, 5).map(function (k) { return '<span class="tag">' + esc(PNAME[k] || k) + ' · ' + o[k] + '</span>'; }).join('') || '<span class="muted" style="font-size:14px">Nothing yet</span>'; };
      return '<h2>Overview<span class="dot">.</span></h2><div class="kpis">' +
        [[messages.length, 'Messages'], [unread, 'Unread'], [week, 'Page views, last 7 days'], [views.length, 'Visitors who allowed counting']].map(function (k) { return '<div class="kpi"><b data-count="' + k[0] + '">' + k[0] + '</b><span>' + k[1] + '</span></div>'; }).join('') + '</div>' +
        '<div class="item"><div class="item-h"><b>Page views, last 14 days</b><span class="muted" style="font-size:13px">Only visitors who press \u201cAccept all\u201d are counted</span></div>' +
        '<div class="bars">' + days.map(function (d, i) { return '<div class="col"><em>' + (d.v || '') + '</em><div class="bar-v' + (d.v ? '' : ' zero') + '" style="--i:' + i + ';height:' + Math.max(3, Math.round(d.v / max * 100)) + '%"></div></div>'; }).join('') + '</div>' +
        '<div class="bar-days">' + days.map(function (d) { return '<span>' + d.d + '</span>'; }).join('') + '</div>' +
        '<div class="agrid" style="margin-top:8px"><div><b style="font-size:14px">Most viewed pages</b><div class="tags" style="margin-top:8px">' + top(pagesC) + '</div></div><div><b style="font-size:14px">How people found you</b><div class="tags" style="margin-top:8px">' + top(srcC) + '</div></div></div></div>' +
        '<div class="item"><div class="item-h"><b>Site errors</b>' + (errors.length ? '<button class="del" data-a="clearerr">Clear</button>' : '') + '</div>' +
        (errors.length ? errors.slice(0, 8).map(function (x) { return '<div class="err-row"><b>' + esc(x.msg) + '</b><span class="muted">' + esc(x.page || '') + ' · ' + new Date(x.at || 0).toLocaleString('en-GB') + '</span><code class="muted">' + esc(x.src || '') + '</code></div>'; }).join('') : '<p class="muted" style="font-size:14px">No errors logged. Good.</p>') + '</div>' +
        '<p class="muted">Every part of the site can be changed from here. Use <b>Edit pages</b> to change any single word, button, link, colour or size directly on the page, and the other tabs for colours, fonts, animations, menus and lists.</p>' +
        (messages[0] ? '<div class="mrow' + (messages[0].read ? '' : ' new') + '"><b>Latest message: ' + esc(messages[0].name) + '</b><span class="muted">' + esc((messages[0].message || '').slice(0, 160)) + '</span></div>' : '');
    },
    messages: function () {
      if (!messages.length) return '<h2>Messages<span class="dot">.</span></h2><p class="muted">No messages yet. When someone sends the contact form, it shows up here.</p>';
      return '<h2>Messages<span class="dot">.</span></h2>' + messages.map(function (m) {
        return '<div class="mrow' + (m.read ? '' : ' new') + '"><div class="item-h"><b>' + esc(m.name) + (m.business ? ' · ' + esc(m.business) : '') + '</b><span class="muted" style="font-size:13px">' + new Date(m.at || 0).toLocaleString('en-GB') + '</span></div>' +
          '<span style="overflow-wrap:anywhere">' + esc(m.email) + (m.needs ? ' · <span class="muted">' + esc(m.needs) + '</span>' : '') + (m.source ? ' · <span class="muted">found you via ' + esc(m.source) + '</span>' : '') + '</span><p class="muted" style="white-space:pre-wrap">' + esc(m.message) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-g btn-sm" data-read="' + esc(m.id) + '">' + (m.read ? 'Mark unread' : 'Mark read') + '</button><button class="del" data-delmsg="' + esc(m.id) + '">Delete</button></div></div>';
      }).join('');
    },
    editor: function () {
      return '<h2>Edit pages<span class="dot">.</span></h2><p class="muted">Open a page in edit mode, then tap anything on it: a word, a button, a card or a whole section. You can change its text, link, colour, background, size, weight, alignment and spacing, or hide it. Press <b>Save page</b> when you are done. The top menu and footer can be edited from any page.</p>' +
        '<div class="agrid">' + PAGES.map(function (p) {
          var n = Object.keys(C.text[p] || {}).length;
          return '<div class="item"><div class="item-h"><b>' + PNAME[p] + '</b><span class="muted" style="font-size:13px">' + n + ' edit' + (n === 1 ? '' : 's') + '</span></div><div class="ed-btns"><a class="btn btn-p btn-sm" href="' + p + '.html#edit">Open in edit mode</a>' + (n ? '<button class="del" data-resetpage="' + p + '">Undo all edits</button>' : '') + '</div></div>';
        }).join('') + '<div class="item"><div class="item-h"><b>Top menu & footer</b><span class="muted" style="font-size:13px">' + Object.keys(C.text.global || {}).length + ' edits</span></div>' + (Object.keys(C.text.global || {}).length ? '<button class="del" data-resetpage="global">Undo all edits</button>' : '<span class="muted" style="font-size:13px">Edit these from any page.</span>') + '</div></div>';
    },
    design: function () {
      var d = C.design;
      return '<h2>Design & colours<span class="dot">.</span></h2><div class="agrid">' +
        field('d-accent', 'Main accent (orange)', d.accent, 'color') + field('d-accent2', 'Accent highlight', d.accent2, 'color') +
        field('d-bg', 'Page background', d.bg, 'color') + field('d-bg2', 'Box and input background', d.bg2, 'color') +
        field('d-fg', 'Main text', d.fg, 'color') + field('d-muted', 'Soft text', d.muted, 'color') +
        field('d-fontDisplay', 'Heading font', d.fontDisplay, 'select', FONTS) + field('d-fontBody', 'Body font', d.fontBody, 'select', FONTS) +
        field('d-baseSize', 'Body text size', d.baseSize, 'range', [13, 20, 1, 'px']) + field('d-headingScale', 'Heading size', d.headingScale, 'range', [70, 130, 5, '%']) +
        field('d-radius', 'Corner roundness', d.radius, 'range', [0, 40, 1, 'px']) +
        field('d-navTexture', 'Top bar texture', d.navTexture, 'select', [['leather', 'Leather (like Dadwoven)'], ['circuit', 'Circuit board'], ['carbon', 'Carbon fibre'], ['grid', 'Tech grid'], ['frost', 'Frosted glass'], ['none', 'Plain navy']]) +
        '</div><div class="ed-btns"><button class="btn btn-p" data-save="design">Save design</button><button class="btn btn-g btn-sm" data-defaults="design">Back to original design</button></div>';
    },
    motion: function () {
      var d = C.design;
      return '<h2>Animations & effects<span class="dot">.</span></h2><div class="agrid">' +
        field('d-motion', 'Allow animations at all', d.motion, 'check') + field('d-transitions', 'Fade between pages', d.transitions, 'check') +
        field('d-heroAnim', 'Headline lines rise in when a page opens', d.heroAnim, 'check') + field('d-reveal', 'Sections ease in on scroll', d.reveal, 'check') +
        field('d-stairs', 'Stairs silhouette in the background', d.stairs, 'check') + field('d-stairsAnim', 'Animate the background stairs', d.stairsAnim, 'check') +
        field('d-stairsOpacity', 'Background stairs strength', d.stairsOpacity, 'range', [0, 60, 1, '%']) + field('d-stairsSpeed', 'Background stairs speed (seconds per climb)', d.stairsSpeed, 'range', [3, 30, 1, 's']) +
        field('d-tri', 'Triangle grid', !!d.tri, 'check') + field('d-bigstairs', 'Big stairs in the corner', !!d.bigstairs, 'check') + field('d-contours', 'Stepped lines in the corner', !!d.contours, 'check') + field('d-drift', 'Floating stairs logos', !!d.drift, 'check') + field('d-blobs', 'Moving colour glows', d.blobs, 'check') + field('d-grid', 'Faint grid', d.grid, 'check') + field('d-grain', 'Film grain', d.grain, 'check') +
        field('d-marquee', 'Scrolling word strip', d.marquee, 'check') + field('d-marqueeSpeed', 'Word strip speed (seconds per loop)', d.marqueeSpeed, 'range', [10, 80, 1, 's']) +
        field('d-coverFloat', 'Project covers float and peek', d.coverFloat !== false, 'check') + field('d-spotlight', 'Light follows the pointer on glass', d.spotlight !== false, 'check') +
        field('d-compact', 'Top bar tightens when you scroll', d.compact !== false, 'check') + field('d-progress', 'Reading progress bar at the top', d.progress !== false, 'check') +
        field('d-totop', 'Back-to-top button', d.totop !== false, 'check') + field('d-fab', 'Floating \u201cFree chat\u201d button', d.fab !== false, 'check') +
        field('d-themeToggle', 'Let visitors switch light / dark', d.themeToggle !== false, 'check') +
        '</div><div class="ed-btns"><button class="btn btn-p" data-save="design">Save animations</button></div>';
    },
    pages: function () {
      return '<h2>Pages & menu<span class="dot">.</span></h2><p class="muted">Rename menu items, change browser tab titles, reorder pages or hide them from the menu.</p>' +
        PAGES.map(function (p, i) { var g = C.pages[p] || {}; return '<div class="item"><div class="item-h"><b>' + PNAME[p] + '</b></div><div class="agrid">' + field('p-' + p + '-nav', 'Menu label', g.nav) + field('p-' + p + '-title', 'Browser tab title', g.title) + field('p-' + p + '-order', 'Menu position', g.order == null ? i : g.order, 'number') + field('p-' + p + '-show', 'Show in menu', g.show !== false, 'check') + '</div></div>'; }).join('') +
        '<div class="item"><div class="item-h"><b>Top bar button</b></div><div class="agrid">' + field('s-navCta2', 'Dark button text', C.settings.navCta2 || 'Get in touch') + field('s-navCta', 'Orange button text', C.settings.navCta) + field('s-navCtaLink', 'Button link (e.g. contact.html)', C.settings.navCtaLink) + '</div></div>' +
        '<div><button class="btn btn-p" data-save="pages">Save pages & menu</button></div>';
    },
    site: function () {
      var s = C.settings;
      return '<h2>Contact & footer<span class="dot">.</span></h2><div class="agrid">' +
        field('s-email', 'Contact email', s.email) + field('s-whatsapp', 'WhatsApp number', s.whatsapp) +
        field('s-instagram', 'Instagram link', s.instagram) + field('s-tiktok', 'TikTok link', s.tiktok) + field('s-facebook', 'Facebook link', s.facebook) + field('s-linkedin', 'LinkedIn link', s.linkedin) +
        field('s-heroLead', 'Home page intro', s.heroLead, 'area') + field('s-aboutTitle', 'About us heading', s.aboutTitle) +
        field('s-aboutText', 'About us paragraph 1', s.aboutText, 'area') + field('s-aboutText2', 'About us paragraph 2', s.aboutText2, 'area') +
        field('s-marquee', 'Scrolling words (comma separated)', s.marquee) + field('s-footerText', 'Footer text', s.footerText) + field('s-copyright', 'Copyright line', s.copyright) +
        '</div><div><button class="btn btn-p" data-save="site">Save changes</button></div>';
    },
    extras: function () {
      var s = C.settings;
      return '<h2>Announcement & extras<span class="dot">.</span></h2>' +
        '<div class="item"><div class="item-h"><b>Announcement bar</b></div><p class="muted" style="font-size:14px">A line under the top bar on every page, with a pulsing dot. Visitors can close it, and it comes back if you change the text.</p><div class="agrid">' +
        field('s-annOn', 'Show the announcement', !!s.annOn, 'check') + field('s-annText', 'Announcement text', s.annText) + field('s-annLabel', 'Link text', s.annLabel) + field('s-annLink', 'Link (e.g. contact.html or https://…)', s.annLink) + '</div></div>' +
        '<div class="item"><div class="item-h"><b>Floating button</b></div><div class="agrid">' + field('s-fabText', 'Button text', s.fabText) + field('s-fabLink', 'Button link', s.fabLink) + '</div></div>' +
        '<div class="item"><div class="item-h"><b>Look and privacy</b></div><div class="agrid">' +
        field('s-themeDefault', 'Theme new visitors see', s.themeDefault || 'device', 'select', [['device', 'Match their phone or computer'], ['dark', 'Always dark (Avenham navy)'], ['light', 'Always light']]) + field('s-cookieBanner', 'Show the cookie choice banner', s.cookieBanner !== false, 'check') + '</div></div>' +
        '<div class="item"><div class="item-h"><b>Google and link previews</b></div>' + field('s-seoDescription', 'Short description of Avenham Media', s.seoDescription, 'area') + '</div>' +
        '<div><button class="btn btn-p" data-save="site">Save changes</button></div>';
    },
    quiz: function () {
      var Q = C.quiz || {}, DQ = D.quiz, NAMES = { need: 'Question 1: what they need', field: 'Type of business', stage: 'Do they have a website?', goals: 'What the website should do', design: 'Design work', social: 'Social media', cards: 'Which cards (prices come from the Shop)', when: 'When they want it ready', budget: 'Budget', more: 'Anything else', you: 'Last step: their details' };
      return '<h2>Contact questions<span class="dot">.</span></h2><p class="muted">Change the wording of the step-by-step questions on the Contact page. Some questions only show when they apply, for example the website questions only show if someone picks Website.</p>' +
        Object.keys(DQ).map(function (k) { var q = Q[k] || DQ[k];
          return '<div class="item"><div class="item-h"><b>' + esc(NAMES[k] || k) + '</b></div><div class="agrid">' + field('q-' + k + '-q', 'Question', q.q) + field('q-' + k + '-sub', 'Small text under it (optional)', q.sub || '') + '</div>' +
            (DQ[k].opts ? field('q-' + k + '-opts', 'Answers to choose from, one per line' + (k === 'field' ? ' (keep \u201cSomething else\u201d as the last one so people can type their own)' : ''), (q.opts || DQ[k].opts).join('\n'), 'area') : '') + '</div>'; }).join('') +
        '<div class="ed-btns"><button class="btn btn-p" data-save="quiz">Save questions</button><button class="btn btn-g btn-sm" data-defaults="quiz">Back to the original wording</button></div>';
    },
    backup: function () {
      var all = { settings: C.settings, design: C.design, pages: C.pages, text: C.text, services: C.services, projects: C.projects, packages: C.packages, shopitems: C.shopitems, faqs: C.faqs };
      return '<h2>Backup & reset<span class="dot">.</span></h2><p class="muted">Copy this to keep a backup of every setting. Paste a backup back in and press Restore to bring it back.</p>' +
        '<div class="f full"><label for="bk">Site backup</label><textarea id="bk" style="min-height:240px;font-family:monospace;font-size:12.5px">' + esc(JSON.stringify(all, null, 1)) + '</textarea></div>' +
        '<div class="ed-btns"><button class="btn btn-g btn-sm" data-a="copy">Copy backup</button><button class="btn btn-p btn-sm" data-a="restore">Restore from box</button><button class="del" data-a="factory">Reset whole site to original</button></div>';
    }
  };
  Object.keys(LISTS).forEach(function (k) {
    VIEWS[k] = function () {
      var L = LISTS[k];
      return '<h2>' + L.title + '<span class="dot">.</span></h2>' + C[k].map(function (it, i) {
        return '<div class="item"><div class="item-h"><b>' + esc(it.name || it.title || it.q || ('New ' + L.one)) + '</b><span style="display:flex;gap:6px">' +
          '<button class="btn btn-g btn-sm" data-up="' + i + '" aria-label="Move up">↑</button><button class="btn btn-g btn-sm" data-down="' + i + '" aria-label="Move down">↓</button><button class="btn btn-g btn-sm" data-dup="' + i + '">Copy</button><button class="del" data-del="' + i + '">Remove</button></span></div><div class="agrid">' +
          L.fields.map(function (f) { var v = it[f[0]]; if (f[0] === 'show' && v == null) v = true; return field(k + '-' + i + '-' + f[0], f[1], v, f[2], f[3]); }).join('') + '</div></div>';
      }).join('') + '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-g" id="add">Add ' + L.one + '</button><button class="btn btn-p" id="save">Save ' + L.title.toLowerCase() + '</button></div>';
    };
  });

  var tab = 'overview';
  function collect(k) { var L = LISTS[k]; C[k] = C[k].map(function (it, i) { var o = Object.assign({}, it); L.fields.forEach(function (f) { var v = val(k + '-' + i + '-' + f[0]); if (v !== undefined) o[f[0]] = v; }); return o; }); }
  function show(t) { tab = t; panel.innerHTML = VIEWS[t](); if (t === 'overview') countUp(); [].slice.call(tabsEl.querySelectorAll('button')).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === t); }); }
  tabsEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(b.getAttribute('data-t')); });

  // snapshot pictures: upload from your device, shrink, and keep them with the site
  function setImg(id, src) { var h = document.getElementById(id), pv = document.getElementById(id + '-prev'); if (h) h.value = src; if (pv) { pv.src = src; pv.hidden = !src; var sp = pv.parentNode.querySelector('span'); if (sp) sp.hidden = !!src; } }
  function shrink(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader(); r.onerror = rej;
      r.onload = function () {
        var im = new Image(); im.onerror = rej;
        im.onload = function () {
          var w = Math.min(1200, im.naturalWidth), h = Math.round(im.naturalHeight * w / im.naturalWidth);
          if (h > 1400) { h = 1400; w = Math.round(im.naturalWidth * h / im.naturalHeight); }
          var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
          var q = .82, out = c.toDataURL('image/webp', q);
          if (!/^data:image\/webp/.test(out)) out = c.toDataURL('image/jpeg', q);
          while (out.length > 600000 && q > .4) { q -= .12; out = c.toDataURL(/webp/.test(out) ? 'image/webp' : 'image/jpeg', q); }
          res(out);
        };
        im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  panel.addEventListener('change', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-img'); if (!id || !e.target.files || !e.target.files[0]) return;
    toast('Getting your picture ready…');
    shrink(e.target.files[0]).then(function (src) { setImg(id, src); var l = document.getElementById(id + '-link'); if (l) l.value = ''; toast('Picture added. Press Save to keep it.'); },
      function () { toast('That picture could not be opened. Try a PNG or JPG.'); });
  });
  panel.addEventListener('input', function (e) { var id = e.target.getAttribute && e.target.getAttribute('data-link'); if (id) setImg(id, e.target.value.trim()); });
  panel.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-imgclear]'); if (!b) return; var id = b.getAttribute('data-imgclear'); setImg(id, ''); var l = document.getElementById(id + '-link'); if (l) l.value = ''; });

  // live preview of design changes
  panel.addEventListener('input', function (e) {
    var id = e.target.id || '';
    if (/-hex$/.test(id)) { var c = document.getElementById(id.replace(/-hex$/, '')); if (c && /^#[0-9a-f]{6}$/i.test(e.target.value)) c.value = e.target.value; }
    else if (e.target.type === 'color') { var h = document.getElementById(id + '-hex'); if (h) h.value = e.target.value; }
    var vv = document.getElementById(id + '-v'); if (vv) vv.textContent = e.target.value + (vv.textContent.replace(/[0-9.]/g, ''));
    if (id.indexOf('d-') === 0) { readDesign(); window.LL.render(); }
  });
  function readDesign() {
    Object.keys(D.design).forEach(function (k) { var v = val('d-' + k); if (v !== undefined) C.design[k] = (document.getElementById('d-' + k + '-hex') ? document.getElementById('d-' + k + '-hex').value : v); });
  }

  async function saveList(k, b) {
    for (var n = 0; n < C[k].length; n++) { var it = C[k][n]; it.order = n + 1; var d = Object.assign({}, it); delete d.id; await db.collection(k).doc(it.id).set(d); }
    for (var rid of removed[k]) await db.collection(k).doc(rid).delete();
    removed[k] = [];
  }

  panel.addEventListener('click', async function (e) {
    var b = e.target.closest('button'); if (!b) return;
    try {
      var sv = b.getAttribute('data-save');
      if (sv === 'quiz') { C.quiz = C.quiz || {}; Object.keys(D.quiz).forEach(function (k) { var o = { q: val('q-' + k + '-q') || D.quiz[k].q, sub: val('q-' + k + '-sub') || '' }; if (D.quiz[k].opts) o.opts = String(val('q-' + k + '-opts') || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); if (o.opts && !o.opts.length) o.opts = D.quiz[k].opts.slice(); C.quiz[k] = o; }); await db.doc('site/quiz').set(C.quiz); toast('Saved'); return; }
      if (sv === 'design') { readDesign(); await db.doc('site/design').set(C.design); window.LL.render(); toast('Saved'); return; }
      if (b.getAttribute('data-defaults') === 'quiz') { C.quiz = JSON.parse(JSON.stringify(D.quiz)); show('quiz'); toast('Original wording loaded. Press Save to keep it.'); return; }
      if (b.getAttribute('data-defaults') === 'design') { ['accent', 'accent2', 'bg', 'bg2', 'fg', 'muted', 'fontDisplay', 'fontBody', 'baseSize', 'headingScale', 'radius', 'navTexture'].forEach(function (k) { C.design[k] = D.design[k]; }); window.LL.render(); show('design'); toast('Original design loaded. Press Save to keep it.'); return; }
      if (sv === 'site') { Object.keys(D.settings).forEach(function (k) { var v = val('s-' + k); if (v !== undefined) C.settings[k] = v; }); await db.doc('site/settings').set(C.settings); window.LL.render(); toast('Saved'); return; }
      if (sv === 'pages') {
        PAGES.forEach(function (p) { C.pages[p] = { nav: val('p-' + p + '-nav'), title: val('p-' + p + '-title'), order: val('p-' + p + '-order'), show: val('p-' + p + '-show') }; });
        C.settings.navCta = val('s-navCta'); C.settings.navCta2 = val('s-navCta2'); C.settings.navCtaLink = val('s-navCtaLink');
        await db.doc('site/pages').set(C.pages); await db.doc('site/settings').set(C.settings); window.LL.render(); toast('Saved'); return;
      }
      if (b.hasAttribute('data-resetpage')) {
        if (b.getAttribute('data-sure') !== '1') { b.setAttribute('data-sure', '1'); b.textContent = 'Tap again to undo all'; return; }
        var pg = b.getAttribute('data-resetpage'); await db.doc('site/text_' + pg).delete(); C.text[pg] = {}; show('editor'); toast('Edits removed'); return;
      }
      if (b.hasAttribute('data-read')) { var m = messages.find(function (x) { return x.id === b.getAttribute('data-read'); }); m.read = !m.read; await db.collection('messages').doc(m.id).update({ read: m.read }); show('messages'); return; }
      if (b.hasAttribute('data-delmsg')) {
        if (b.getAttribute('data-sure') !== '1') { b.setAttribute('data-sure', '1'); b.textContent = 'Tap again to delete'; return; }
        var id = b.getAttribute('data-delmsg'); await db.collection('messages').doc(id).delete(); messages = messages.filter(function (x) { return x.id !== id; }); show('messages'); toast('Deleted'); return;
      }
      var a = b.getAttribute('data-a');
      if (a === 'clearerr') { var qe = await db.collection('errors').get(); for (var de of qe.docs) await db.collection('errors').doc(de.id).delete(); errors = []; show('overview'); toast('Errors cleared'); return; }
      if (a === 'copy') { var t = document.getElementById('bk'); navigator.clipboard.writeText(t.value).then(function () { toast('Copied'); }, function () { t.select(); toast('Selected. Copy it with your keyboard.'); }); return; }
      if (a === 'restore') {
        var data; try { data = JSON.parse(document.getElementById('bk').value); } catch (x) { toast('That backup text isn’t valid.'); return; }
        if (b.getAttribute('data-sure') !== '1') { b.setAttribute('data-sure', '1'); b.textContent = 'Tap again to restore'; return; }
        ['settings', 'design', 'pages'].forEach(function (k) { if (data[k]) C[k] = data[k]; });
        await db.doc('site/settings').set(C.settings); await db.doc('site/design').set(C.design); await db.doc('site/pages').set(C.pages);
        for (var tk in (data.text || {})) { C.text[tk] = data.text[tk]; await db.doc('site/text_' + tk).set(data.text[tk]); }
        for (var lk of Object.keys(LISTS)) if (Array.isArray(data[lk])) { removed[lk] = C[lk].map(function (x) { return x.id; }).filter(function (id) { return !data[lk].some(function (y) { return y.id === id; }); }); C[lk] = data[lk]; await saveList(lk); }
        window.LL.render(); toast('Restored'); show('backup'); return;
      }
      if (a === 'factory') {
        if (b.getAttribute('data-sure') !== '1') { b.setAttribute('data-sure', '1'); b.textContent = 'Tap again: this removes every change'; return; }
        var site = await db.collection('site').get(); for (var dd of site.docs) await db.collection('site').doc(dd.id).delete();
        for (var lk2 of Object.keys(LISTS)) { var q = await db.collection(lk2).get(); for (var d2 of q.docs) await db.collection(lk2).doc(d2.id).delete(); }
        toast('Site reset. Reloading…'); setTimeout(function () { location.reload(); }, 900); return;
      }
      if (!LISTS[tab]) return;
      collect(tab);
      if (b.id === 'add') { C[tab].push({ id: tab.slice(0, 3) + Date.now().toString(36), show: true }); show(tab); return; }
      if (b.hasAttribute('data-dup')) { var di = +b.getAttribute('data-dup'); var cp = Object.assign({}, C[tab][di], { id: tab.slice(0, 3) + Date.now().toString(36) }); C[tab].splice(di + 1, 0, cp); show(tab); return; }
      if (b.hasAttribute('data-del')) { var i = +b.getAttribute('data-del'); removed[tab].push(C[tab][i].id); C[tab].splice(i, 1); show(tab); return; }
      if (b.hasAttribute('data-up') || b.hasAttribute('data-down')) { var j = +(b.getAttribute('data-up') || b.getAttribute('data-down')), to = b.hasAttribute('data-up') ? j - 1 : j + 1; if (to >= 0 && to < C[tab].length) { var tt = C[tab][j]; C[tab][j] = C[tab][to]; C[tab][to] = tt; } show(tab); return; }
      if (b.id === 'save') { b.disabled = true; await saveList(tab); b.disabled = false; toast('Saved'); show(tab); }
    } catch (err) { b.disabled = false; toast('That didn’t save. Check you are signed in as the owner.'); }
  });
  show('overview');
})();
