/* Codice comune a indice e mazzi: lingua, note, dimensioni, setup di reveal. */
(function () {
  'use strict';
  var KB = window.KB = { lang: 'it', listeners: [] };
  var root = document.documentElement;

  function readLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'it') return q;
    try { var s = localStorage.getItem('kb-lang'); if (s === 'en' || s === 'it') return s; } catch (e) {}
    return 'it';
  }
  function saveLang(l) { try { localStorage.setItem('kb-lang', l); } catch (e) {} }

  var notesEls = [], notesBy = [];
  function collectNotes() {
    notesEls = Array.prototype.slice.call(document.querySelectorAll('aside.notes'));
    notesBy = notesEls.map(function (a) {
      var it = a.querySelector('[lang="it"]'), en = a.querySelector('[lang="en"]');
      return { it: it ? it.innerHTML : '', en: en ? en.innerHTML : '' };
    });
  }
  function applyNotes() { notesEls.forEach(function (a, i) { a.innerHTML = notesBy[i][KB.lang]; }); }

  function updateLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('a[data-kb]'), function (a) {
      var base = a.getAttribute('data-kb');
      a.setAttribute('href', base + (KB.lang === 'en' ? '?lang=en' : ''));
    });
  }

  KB.setLang = function (l, push) {
    KB.lang = l;
    root.setAttribute('lang', l);
    var t = root.getAttribute('data-title-' + l);
    if (t) document.title = t;
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l));
    });
    Array.prototype.forEach.call(document.querySelectorAll('svg[data-label-it]'), function (s) {
      s.setAttribute('aria-label', s.getAttribute('data-label-' + l));
    });
    applyNotes();
    updateLinks();
    saveLang(l);
    if (push) {
      try {
        var u = new URL(location.href);
        if (l === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      } catch (e) {}
    }
    KB.listeners.forEach(function (fn) { fn(l); });
  };
  KB.onLang = function (fn) { KB.listeners.push(fn); };
  KB.toggleLang = function () { KB.setLang(KB.lang === 'it' ? 'en' : 'it', true); };

  function ensureSwitch() {
    if (document.querySelector('.lang')) return;
    var d = document.createElement('div');
    d.className = 'lang';
    d.setAttribute('role', 'group');
    d.setAttribute('aria-label', 'Lingua / Language');
    d.innerHTML = '<button type="button" data-set-lang="it" aria-pressed="true" title="Italiano">IT</button>' +
                  '<button type="button" data-set-lang="en" aria-pressed="false" title="English">EN</button>';
    document.body.appendChild(d);
  }
  function wireSwitch() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
      b.addEventListener('click', function () { KB.setLang(b.getAttribute('data-set-lang'), true); b.blur(); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); });
    });
  }

  function common() {
    KB.lang = readLang();
    ensureSwitch();
    wireSwitch();
    collectNotes();
    KB.setLang(KB.lang, false);
  }

  /* ----- pagina indice ----- */
  KB.initIndex = function () {
    document.body.classList.add('index'); root.classList.add('index');
    common();
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === 'l' || k === 'L') { KB.toggleLang(); return; }
      if (k === '1' || k === '2' || k === '3') {
        var a = document.querySelector('a[data-key="' + k + '"]');
        if (a) location.href = a.getAttribute('href');
      }
    });
  };

  /* ----- mazzi reveal ----- */
  KB.initDeck = function (opts) {
    opts = opts || {};
    var isPrint = /print-pdf/.test(location.search);
    var mq = window.matchMedia('(orientation: portrait) and (max-width: 820px)');
    common();
    function size() {
      if (isPrint || !mq.matches) return { w: 1280, h: 720, p: false };
      return { w: 480, h: 900, p: true };
    }
    var s0 = size();
    root.classList.toggle('portrait', s0.p);
    var plugins = [RevealNotes];
    if (window.RevealHighlight) plugins.push(RevealHighlight);
    Reveal.initialize({
      width: s0.w, height: s0.h, margin: 0.02, minScale: 0.2, maxScale: 2.5,
      center: false, display: 'flex', scrollActivationWidth: null,
      hash: true, history: false,
      controls: true, controlsTutorial: false, controlsLayout: 'bottom-right',
      progress: true, slideNumber: 'c/t', showSlideNumber: 'all',
      overview: true, touch: true, keyboard: true, navigationMode: 'linear',
      transition: 'fade', transitionSpeed: 'fast', backgroundTransition: 'none',
      fragments: true, help: true, pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1,
      plugins: plugins
    });
    function relayout() {
      var s = size();
      root.classList.toggle('portrait', s.p);
      Reveal.configure({ width: s.w, height: s.h });
      Reveal.layout();
    }
    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', function () { setTimeout(relayout, 150); });
    Reveal.addKeyBinding({ keyCode: 76, key: 'L', description: 'Lingua IT/EN · Language' }, function () { KB.toggleLang(); });
    Reveal.addKeyBinding({ keyCode: 73, key: 'I', description: 'Indice · Index' }, function () {
      location.href = 'index.html' + (KB.lang === 'en' ? '?lang=en' : '');
    });
    if (opts.onReady) opts.onReady();
  };
})();
