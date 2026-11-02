/* Avenham Media: connects the website to Supabase (free database and sign-in) and Web3Forms (free form emails).
   You never need to edit this file. Your settings live in config.js. */
(function () {
  var C = window.AVENHAM_CONFIG || {};
  if (!C.supabaseUrl || !C.supabaseAnonKey || !window.supabase || /PASTE/.test(C.supabaseUrl + C.supabaseAnonKey)) {
    console.warn('Avenham Media: config.js is not filled in yet, so the site is showing its built-in content and the admin panel is off.');
    return;
  }
  var sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'am-auth' } });
  var owner = String(C.adminEmail || '').trim().toLowerCase();
  var PUBLIC = { site: 1, services: 1, projects: 1, packages: 1, shopitems: 1, faqs: 1 };

  async function session() { try { var r = await sb.auth.getSession(); return r.data.session; } catch (e) { return null; } }
  var anonP = null;
  async function ensureUser() {
    var s = await session(); if (s && s.user) return s.user;
    if (!anonP) anonP = sb.auth.signInAnonymously().then(function (r) { anonP = null; if (r.error) throw r.error; return r.data.user; }, function (e) { anonP = null; throw e; });
    return anonP;
  }
  async function isOwner() { var s = await session(); var u = s && s.user; return !!(u && !u.is_anonymous && String(u.email || '').toLowerCase() === owner); }
  function colOf(path) { return path.split('/').slice(0, -1).join('/'); }
  function snap(row, id) { return { id: id, exists: !!row, data: function () { return row ? row.data : undefined; } }; }
  function fail(r) { if (r.error) { var e = new Error(r.error.message || 'Database error'); e.code = r.error.code; throw e; } return r; }

  function ref(path) {
    var id = path.split('/').pop(), col = colOf(path);
    var self = {
      id: id, path: path,
      get: async function () {
        if (!PUBLIC[col]) { if (!(await session())) return snap(null, id); }
        var r = fail(await sb.from('docs').select('data').eq('path', path).maybeSingle());
        return snap(r.data, id);
      },
      set: async function (data) {
        await ensureUser();
        fail(await sb.from('docs').upsert({ path: path, col: col, doc_id: id, data: data || {}, updated_at: new Date().toISOString() }));
      },
      update: async function (data) {
        var cur = await self.get(); return self.set(Object.assign({}, cur.exists ? cur.data() : {}, data));
      },
      'delete': async function () { fail(await sb.from('docs').delete().eq('path', path)); }
    };
    return self;
  }
  function collection(name) {
    return {
      doc: function (id) { return ref(name + '/' + id); },
      get: async function () {
        var r = fail(await sb.from('docs').select('doc_id,data').eq('col', name));
        var docs = (r.data || []).map(function (row) { return snap(row, row.doc_id); });
        return { docs: docs, empty: !docs.length, size: docs.length };
      }
    };
  }
  var db = { collection: collection, doc: ref };
  var user = {
    id: async function () { return (await ensureUser()).id; },
    canEdit: isOwner, isOwner: isOwner,
    me: async function () { var s = await session(); var u = s && s.user; return u ? { id: u.id, name: u.email || 'Visitor' } : null; }
  };
  window.claude = window.claude || { use: async function (n) { return n === 'db' ? db : n === 'user' ? user : null; } };

  // used by the admin page and the contact questions
  window.AM = {
    config: C,
    signIn: async function (email, password) { var r = await sb.auth.signInWithPassword({ email: email, password: password }); if (r.error) throw r.error; return r.data.user; },
    signOut: async function () { try { await sb.auth.signOut(); } catch (e) { } },
    isOwner: isOwner,
    // sends the contact answers to your email inbox (free, through Web3Forms)
    notify: async function (fields) {
      if (!C.web3formsKey || /PASTE/.test(C.web3formsKey)) return false;
      var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ access_key: C.web3formsKey, from_name: 'Avenham Media website' }, fields)) });
      var j = {}; try { j = await res.json(); } catch (e) { }
      return !!(res.ok && j.success !== false);
    }
  };
})();
