/* Menu latéral : tiroir sur mobile, repliable sur ordinateur (pages blog / études de cas). */
(function () {
  var body = document.body, sb = document.getElementById('sidebar'),
      tg = document.getElementById('sb-toggle'), ov = document.getElementById('sb-overlay'),
      cl = document.getElementById('sb-close');
  if (!sb || !tg) return;
  var mq = window.matchMedia('(min-width: 1024px)');
  function isDesktop() { return mq.matches; }
  function sync() {
    var open = isDesktop() ? !body.classList.contains('sb-collapsed') : body.classList.contains('sb-open');
    tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    if ('inert' in sb) sb.inert = !open;
  }
  function closeMobile() { body.classList.remove('sb-open'); sync(); }
  tg.addEventListener('click', function () {
    if (isDesktop()) {
      body.classList.toggle('sb-collapsed');
      try { localStorage.setItem('jgme_sb', body.classList.contains('sb-collapsed') ? '0' : '1'); } catch (e) {}
    } else { body.classList.toggle('sb-open'); }
    sync();
  });
  if (ov) ov.addEventListener('click', closeMobile);
  if (cl) cl.addEventListener('click', closeMobile);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('sb-open')) { closeMobile(); tg.focus(); } });
  try { if (isDesktop() && localStorage.getItem('jgme_sb') === '0') body.classList.add('sb-collapsed'); } catch (e) {}
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { body.classList.remove('sb-open'); sync(); });
  sync();
})();
