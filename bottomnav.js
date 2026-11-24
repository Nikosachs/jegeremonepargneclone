/* Barre de navigation mobile (bas de l'écran) : Épargne · SCPI · Immo · Outils · Guides.
   Visible uniquement sous 1024 px (voir theme.css, bloc « .bn »). Sur l'accueil elle pilote les onglets existants sans recharger ;
   sur le blog et les études de cas elle renvoie vers index.html?tab=… (déjà géré par index.html). */
(function () {
  var I = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + d + '</svg>'; };
  var ITEMS = [
    { k: 'epargne', l: 'Épargne', i: I('<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>') },
    { k: 'scpi', l: 'SCPI', i: I('<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>') },
    { k: 'immo', l: 'Immo', i: I('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>') },
    { k: 'outils', l: 'Outils', i: I('<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>') },
    { k: 'blog', l: 'Guides', i: I('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>') }
  ];
  function init() {
    if (document.getElementById('bottom-nav')) return;
    var home = !!document.getElementById('panel-epargne');
    var page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    var inBlog = !home && /^(blog|cas-|qu-est-ce|livret-a)/.test(page);
    var nav = document.createElement('nav');
    nav.id = 'bottom-nav'; nav.className = 'bn'; nav.setAttribute('aria-label', 'Navigation mobile');
    nav.innerHTML = ITEMS.map(function (it) {
      var href = it.k === 'blog' && !home ? 'blog.html' : 'index.html?tab=' + it.k;
      return '<a href="' + href + '" data-bn="' + it.k + '">' + it.i + '<span>' + it.l + '</span></a>';
    }).join('');
    document.body.appendChild(nav);
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    function mark(k) {
      links.forEach(function (a) {
        if (a.getAttribute('data-bn') === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    }
    if (!home) { mark(inBlog ? 'blog' : ''); return; }
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-bn]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var real = document.getElementById('main-tab-' + a.getAttribute('data-bn'));
      if (!real) return;
      e.preventDefault(); real.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    function sync() { mark(document.body.dataset.tab || 'epargne'); }
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['data-tab'] });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
