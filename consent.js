/* Consentement Google Analytics pour les pages statiques (même clé que index.html : le choix est partagé). */
(function () {
  var GA = 'G-MJKVQ6Z0ZM', KEY = 'jgme_consent_v1', MAX = 182 * 24 * 3600 * 1000;
  function read() { try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && v.ts && Date.now() - v.ts < MAX) return v; } catch (e) {} return null; }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify({ analytics: a, ts: Date.now() })); } catch (e) {} }
  function loadGA() {
    window['ga-disable-' + GA] = false;
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    var sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA);
  }
  function clearGA() {
    window['ga-disable-' + GA] = true;
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid') {
        ['', '.' + location.hostname, '.' + location.hostname.split('.').slice(-2).join('.')].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }
  function init() {
    var b = document.createElement('div');
    b.id = 'consent-banner'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-labelledby', 'consent-title');
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:90;display:none;background:#0f172a;border-top:1px solid #334155;box-shadow:0 -10px 30px rgba(0,0,0,.5);font-family:inherit';
    var btn = 'padding:8px 18px;border-radius:12px;border:1px solid #475569;background:#1e293b;color:#fff;font:700 .75rem inherit;font-family:inherit;cursor:pointer';
    b.innerHTML = '<div style="max-width:760px;margin:0 auto;padding:14px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center">' +
      '<p id="consent-title" style="flex:1 1 320px;margin:0;font-size:.75rem;line-height:1.6;color:#CBD5E1">Nous utilisons Google Analytics pour mesurer l\'audience du site, uniquement avec votre accord. Vous pouvez refuser aussi simplement qu\'accepter et changer d\'avis à tout moment. <a href="index.html?legal=cookies" style="color:#CBD5E1;text-decoration:underline">En savoir plus</a></p>' +
      '<div style="display:flex;gap:10px"><button type="button" id="consent-deny" style="' + btn + '">Tout refuser</button><button type="button" id="consent-accept" style="' + btn + '">Tout accepter</button></div></div>';
    document.body.appendChild(b);
    function show() { b.style.display = 'block'; }
    function hide() { b.style.display = 'none'; }
    document.getElementById('consent-accept').addEventListener('click', function () { write('granted'); loadGA(); hide(); });
    document.getElementById('consent-deny').addEventListener('click', function () { write('denied'); clearGA(); hide(); });
    document.addEventListener('click', function (e) { if (e.target.closest('[data-consent-open]')) { e.preventDefault(); show(); } });
    var c = read();
    if (!c) show(); else if (c.analytics === 'granted') loadGA(); else clearGA();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
