/* Export PDF des simulations — JeGereMonEpargne
 * ------------------------------------------------------------------
 * PDF vectoriel généré dans le navigateur (jsPDF, hébergé sur le site, chargé
 * uniquement au premier clic). Aucune donnée n'est envoyée à un serveur.
 * Le module lit l'état affiché (champs, cartes de résultats, données du
 * graphique Chart.js) : il reste donc cohérent avec les calculs du simulateur.
 *
 * Pour ajouter un simulateur : ajouter une entrée dans SIMS ci-dessous.
 */
(function () {
  'use strict';

  var JSPDF_SRC = 'jspdf.umd.min.js';
  var LOGO_SRC = 'logo.png';
  var SITE = 'jegeremonepargne.com';
  var DISCLAIMER =
    "Simulation à caractère indicatif et pédagogique, fondée sur des hypothèses simplifiées " +
    "(rendements, inflation et fiscalité constants). Elle ne constitue ni un conseil en investissement " +
    "ou en crédit, ni une offre, et ne préjuge pas des performances futures. Tout investissement comporte " +
    "un risque de perte en capital. Document généré dans votre navigateur.";

  /* ------------------------------------------------------------------ */
  /* Configuration des simulateurs                                       */
  /* ------------------------------------------------------------------ */
  // hero  : 2 grandes cartes ; kpis : cartes secondaires (3 par ligne)
  // label : texte, ou { from: 'id' } pour lire un titre dynamique
  // sub   : id de l'élément de sous-texte (par défaut id + '-sub')
  var SIMS = {
    epargne: {
      share: 'epargne-share-btn', panel: 'panel-epargne', chart: 'patrimoineChart', file: 'epargne',
      title: "Simulation d'épargne et d'intérêts composés",
      subtitle: function () { return 'Projection patrimoniale à ' + txt('horizon-echo') + ' ans'; },
      hero: [
        { id: 'capital-brut', label: 'Capital brut accumulé', sub: 'Valeur nominale totale à terme' },
        { id: 'capital-reel', label: "Pouvoir d'achat réel", sub: "Équivalent en euros d'aujourd'hui" }
      ],
      kpis: [
        { id: 'capacite-epargne', label: 'Épargne mensuelle', sub: 'Capacité nette disponible' },
        { id: 'matelas', label: 'Matelas de sécurité', sub: '4 mois de charges fixes' },
        { id: 'interets-totaux', label: 'Intérêts générés', sub: 'Gains composés nets' }
      ],
      bar: function () {
        var w = parseFloat((document.getElementById('bar-reel') || {}).style && document.getElementById('bar-reel').style.width);
        if (!isFinite(w)) return null;
        var er = txt('erosion-pct');
        return { label: "Pouvoir d'achat conservé", pct: w, text: /\d/.test(er) ? fmtPct(w) + ' conservés \u2014 ' + er : fmtPct(w) };
      },
      notes: ['alert-box', 'info-capital-seul'],
      extras: [
        ['Profil de rendement', function () { return txt('rendement-label').split(/\s+[\u2014-]\s+/)[0]; }],
        ['Inflation prise en compte', function () { return yesNo('inflation-toggle'); }],
        ['Flat tax (PFU 31,4 %) appliquée', function () { return yesNo('flat-tax'); }]
      ]
    },

    scpi: {
      share: 'scpi-share-btn', panel: 'panel-scpi', chart: 'scpiChart', file: 'scpi', inlineBtn: true,
      title: "Simulation d'investissement en SCPI",
      subtitle: function () { return 'Projection à ' + txt('scpi-horizon-echo') + ' ans'; },
      hero: [
        { id: 'scpi-patrimoine', label: "Patrimoine à l'échéance" },
        { id: 'scpi-gain', label: 'Gain net total' }
      ],
      kpis: [
        { id: 'scpi-div-mensuel', label: 'Dividende brut mensuel', sub: function () { return txt('scpi-div-trim') + ' / trimestre \u00b7 ' + txt('scpi-div-an') + ' / an (année 1, avant impôt)'; } },
        { id: 'scpi-card2-val', label: { from: 'scpi-card2-title' }, sub: 'scpi-card2-sub' }
      ],
      notes: ['scpi-micro-alert'],
      extras: [
        ['Mode de financement', function () { return activeText('[data-scpi-mode]'); }],
        ['Emprunt', function () { return visibleTxt('scpi-emprunt-info').replace(/^Montant emprunt\S* ?: ?/i, '').replace(/\s*\u00b7\s*mensualit\S* ?: ?/i, ' (mensualité ') .replace(/$/, function (m, o, str) { return /\(mensualit/.test(str) ? ')' : ''; }); }],
        ['Durée du prêt', function () { return visibleTxt('scpi-credit-controls') ? activeText('[data-scpi-duree]') : ''; }],
        ['Tranche marginale (TMI)', function () { var a = activeText('[data-scpi-tmi]'); return a && (/%/.test(a) ? a : a + ' %'); }],
        ['Régime fiscal', function () { return activeText('[data-scpi-regime]'); }],
        ['Prélèvements sociaux (17,2 %)', function () { return yesNo('scpi-ps'); }]
      ],
      table: { wrap: 'scpi-table-wrap', title: 'Détail année par année' }
    },

    immo: {
      share: 'immo-share-btn', panel: 'panel-immo', chart: 'immoChart', file: 'immobilier',
      title: "Simulation d'investissement locatif",
      subtitle: function () { return 'Projection à ' + txt('immo-duree-echo') + ' ans'; },
      hero: [
        { id: 'immo-cashflow', label: 'Cash-flow mensuel', sub: 'Hors impact fiscal' },
        { id: 'immo-patrimoine-final', label: 'Patrimoine net final', sub: 'Valeur du bien moins capital restant dû' }
      ],
      kpis: [
        { id: 'immo-rendement-brut', label: 'Rendement brut' },
        { id: 'immo-rendement-net', label: 'Rendement net' },
        { id: 'immo-effort', label: "Effort d'épargne mensuel" },
        { id: 'immo-cout-total', label: 'Coût total du projet' },
        { id: 'immo-mensualite', label: 'Mensualité de crédit' },
        { id: 'immo-cout-credit', label: 'Total des intérêts payés' },
        { id: 'immo-valeur-finale', label: 'Valeur du bien estimée' }
      ],
      extras: [
        ['Type de bien', function () { return activeText('.immo-market-btn'); }],
        ['Frais de notaire (montant)', function () { return inputWithUnit('immo-notaire-montant', '€'); }],
        ['Montant emprunté', function () { return inputWithUnit('immo-emprunt', '€'); }],
        ['Durée du prêt', function () { return activeText('.immo-duree-btn'); }],
        ['Gestion locative déléguée', function () { return yesNo('immo-gestion-toggle'); }]
      ]
    },

    matelas: {
      share: 'tool-share-matelas', panel: 'tool-matelas', file: 'matelas-securite',
      title: "Épargne de précaution : matelas de sécurité",
      subtitle: function () { return 'Objectif, délai pour l\'atteindre et couverture actuelle'; },
      banner: 'mat-reco',
      hero: [
        { id: 'mat-cible', label: 'Objectif de sécurité' },
        { id: 'mat-delai', label: 'Objectif atteint dans' }
      ],
      kpis: [
        { id: 'mat-couv', label: 'Couverture actuelle', sub: 'des charges fixes couvertes' }
      ],
      bar: function () {
        var p = parseFloat(txt('mat-pct').replace(',', '.'));
        if (!isFinite(p)) return null;
        return { label: "Progression vers l'objectif", pct: p, text: fmtPct(p) };
      },
      notes: ['mat-alert', 'mat-note'],
      extras: [
        ['Mois de charges à couvrir (manuel)', function () { return yesNo('mat-mois-manuel') === 'Oui' ? txt('mat-mois-val') : ''; }]
      ]
    },

    inflation: {
      share: 'tool-share-inflation', panel: 'tool-inflation', chart: 'inf-chart', file: 'inflation',
      title: "Impact de l'inflation sur votre épargne",
      subtitle: function () { return 'Projection à ' + txt('inf-horizon-echo') + ' ans'; },
      banner: 'inf-verdict',
      hero: [
        { id: 'inf-nominal', label: 'Valeur nominale' },
        { id: 'inf-reel', label: "Pouvoir d'achat réel" }
      ],
      kpis: [
        { id: 'inf-taux-reel', label: 'Taux réel annuel' },
        { id: 'inf-repos', label: 'Si laissé à 0 %' },
        { id: 'inf-panier', label: 'Panier de 100 €' }
      ],
      bar: function () {
        var p = parseFloat(txt('inf-pct').replace(',', '.'));
        if (!isFinite(p)) return null;
        return { label: "Pouvoir d'achat conservé", pct: p, text: fmtPct(p) };
      },
      notes: ['inf-alert']
    },

    emprunt: {
      share: 'tool-share-emprunt', panel: 'tool-emprunt', file: 'capacite-emprunt',
      title: "Capacité d'emprunt et reste à vivre",
      subtitle: function () { return txt('emp-endettement-eff'); },
      hero: [
        { id: 'emp-capital', label: "Vous pouvez emprunter jusqu'à" },
        { id: 'emp-prix', label: 'Prix du bien visé' }
      ],
      kpis: [
        { id: 'emp-mensualite', label: 'Mensualité maximale' },
        { id: 'emp-cout', label: 'Coût total du crédit' },
        { id: 'emp-rav', label: 'Reste à vivre' }
      ],
      notes: ['emp-alert'],
      tables: [
        {
          title: 'Capital empruntable selon la durée',
          head: ['Durée', 'Capital empruntable', 'Coût du crédit'],
          rows: function () {
            return [15, 20, 25].map(function (n) {
              return [n + ' ans', txt('emp-card-cap-' + n), txt('emp-card-cout-' + n)];
            });
          }
        },
        {
          title: 'Répartition de vos revenus mensuels',
          head: ['Poste', 'Montant par mois'],
          rows: function () {
            return [
              ['Crédits en cours', txt('emp-leg-credits')],
              ['Nouvelle mensualité', txt('emp-leg-nouveau')],
              ['Charges annexes du logement', txt('emp-leg-charges')],
              ['Reste à vivre', txt('emp-leg-rav')]
            ];
          }
        }
      ]
    },

    rente: {
      share: 'tool-share-rente', panel: 'tool-rente', chart: 'rent-chart', file: 'liberte-financiere',
      title: 'Liberté financière : capital pour une rente',
      subtitle: function () { return 'Capital à constituer et effort d\'épargne mensuel'; },
      banner: 'rent-banner',
      hero: [
        { id: 'rent-cible', label: 'Capital à constituer' },
        { id: 'rent-pmt', label: 'Épargne mensuelle à prévoir' }
      ],
      kpis: [
        { id: 'rent-cible-nom', label: 'Capital visé, euros courants' },
        { id: 'rent-verse', label: 'Total versé' },
        { id: 'rent-interets', label: 'Intérêts générés' }
      ],
      notes: ['rent-note'],
      extras: [
        ['Flat tax (PFU 31,4 %) appliquée', function () { return yesNo('rent-flat-tax'); }]
      ]
    }
  };

  /* ------------------------------------------------------------------ */
  /* Utilitaires DOM / texte                                             */
  /* ------------------------------------------------------------------ */
  function $(id) { return document.getElementById(id); }

  function isVisible(el) { return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length)); }

  // jsPDF (polices standard) ne gère que WinAnsi : on normalise les espaces
  // insécables fines de Intl, le signe moins typographique, etc.
  var WIN_ANSI_EXTRA = '€‘’“”•–—…œŒšŠžŽƒˆ˜†‡‰‹›™Ÿ';
  function clean(s) {
    s = String(s == null ? '' : s)
      .replace(/[      ]/g, ' ')
      .replace(/[−‐‑‒]/g, '-')
      .replace(/≈/g, '~')
      .replace(/→/g, '->')
      .replace(/←/g, '<-')
      .replace(/≤/g, '<=').replace(/≥/g, '>=')
      .replace(/[⁰-₟]/g, '')
      .replace(/\s+/g, ' ');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), n = s.charCodeAt(i);
      if (n <= 0xff || WIN_ANSI_EXTRA.indexOf(c) !== -1) out += c;
    }
    return out.trim();
  }

  function txt(id) {
    var el = $(id);
    return el ? clean(el.innerText || el.textContent) : '';
  }
  // Texte d'un bloc en conservant les retours à la ligne (joints par « · »)
  function multiTxt(id) {
    var el = $(id);
    if (!el) return '';
    return (el.innerText || el.textContent || '').split(/\n+/).map(clean).filter(Boolean).join(' \u00b7 ');
  }
  function visibleTxt(id) { var el = $(id); return isVisible(el) ? txt(id) : ''; }

  // Texte direct d'un élément (sans les info-bulles « ? » imbriquées)
  function ownText(el) {
    var s = '';
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) s += n.nodeValue;
    return clean(s);
  }
  function yesNo(id) { var el = $(id); return el ? (el.checked ? 'Oui' : 'Non') : ''; }
  function activeText(sel) {
    var els = document.querySelectorAll(sel), i;
    for (i = 0; i < els.length; i++) {
      if (els[i].classList.contains('active') || els[i].getAttribute('aria-pressed') === 'true' ||
          els[i].getAttribute('aria-checked') === 'true') return clean(els[i].textContent);
    }
    return '';
  }
  function groupInt(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function inputWithUnit(id, unit) {
    var el = $(id);
    if (!el || !isVisible(el)) return '';
    var v = clean(el.value);
    if (/^-?\d+$/.test(v)) v = groupInt(v);
    else if (/^-?\d+[.,]\d+$/.test(v)) v = v.replace('.', ',');
    return v ? v + (unit ? ' ' + unit : '') : '';
  }
  function fmtPct(n) { return (Math.round(n * 10) / 10).toString().replace('.', ',') + ' %'; }

  // Valeur lisible d'un champ de saisie (curseur, texte ou case à cocher)
  function inputValue(el) {
    if (el.type === 'checkbox') return el.checked ? 'Oui' : 'Non';
    var val = $(el.id + '-val') || $(el.id.replace(/-/g, '') + '-val');
    if (val && el.type === 'range') return clean(val.innerText || val.textContent);
    var unitEl = el.parentElement && el.parentElement.querySelector('span');
    var unit = unitEl ? clean(unitEl.textContent) : '';
    if (unit.length > 10 || /[a-z]{4,}.*[a-z]{4,}/i.test(unit)) unit = '';
    return inputWithUnit(el.id, unit);
  }

  // Champs de saisie visibles du panneau, avec leur <label for>
  function collectInputs(cfg) {
    var root = $(cfg.panel), rows = [], seen = {};
    if (!root) return rows;
    var labels = root.querySelectorAll('label[for]');
    for (var i = 0; i < labels.length; i++) {
      var l = labels[i], el = $(l.htmlFor);
      if (!el || seen[el.id] || !isVisible(l)) continue;
      seen[el.id] = 1;
      var name = ownText(l) || clean(l.textContent).replace(/\s*\?.*$/, '');
      var v = inputValue(el);
      if (name && v) rows.push([name.replace(/\s*[:?]\s*$/, ''), v]);
    }
    (cfg.extras || []).forEach(function (e) {
      var v;
      try { v = e[1](); } catch (err) { v = ''; }
      if (v) rows.push([e[0], clean(v)]);
    });
    return rows;
  }

  function resultCards(list) {
    var out = [];
    (list || []).forEach(function (r) {
      var el = $(r.id);
      if (!el || !isVisible(el)) return;
      var value = clean(el.innerText || el.textContent);
      if (!value) return;
      var label = r.label;
      if (label && typeof label === 'object') label = ownText($(label.from) || document.createElement('i')) || txt(label.from);
      var sub = r.sub;
      if (typeof sub === 'function') { try { sub = sub(); } catch (e) { sub = ''; } }
      else if (sub && !$(sub)) { /* texte littéral */ }
      else if (sub) sub = multiTxt(sub);
      else sub = multiTxt(r.id + '-sub');
      out.push({ label: clean(label || ''), value: value, sub: sub || '' });
    });
    return out;
  }

  function tableFromDom(wrapId) {
    var wrap = $(wrapId);
    if (!wrap) return null;
    var head = [].map.call(wrap.querySelectorAll('thead th'), function (th) { return clean(th.textContent); });
    var rows = [].map.call(wrap.querySelectorAll('tbody tr'), function (tr) {
      return [].map.call(tr.children, function (td) { return clean(td.textContent); });
    });
    return head.length && rows.length ? { head: head, rows: rows } : null;
  }

  function chartOf(id) {
    return id && window.Chart && Chart.getChart ? Chart.getChart(id) : null;
  }

  function chartSeries(chart) {
    var out = [];
    chart.data.datasets.forEach(function (d, i) {
      if (chart.isDatasetVisible && !chart.isDatasetVisible(i)) return;
      var data = (d.data || []).map(function (p) {
        if (p && typeof p === 'object') p = p.y;
        return typeof p === 'number' && isFinite(p) ? p : null;
      });
      if (!data.length) return;
      out.push({ label: clean(d.label || ''), data: data, color: parseColor(d.borderColor || d.backgroundColor, out.length), dash: d.borderDash });
    });
    return out;
  }

  var PALETTE = [[79, 70, 229], [217, 119, 6], [5, 150, 105], [225, 29, 72], [14, 116, 144]];
  function parseColor(c, idx) {
    if (typeof c === 'string') {
      var m = c.match(/^#([0-9a-f]{6})$/i);
      if (m) return [parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16)];
      m = c.match(/^#([0-9a-f]{3})$/i);
      if (m) return [parseInt(m[1][0] + m[1][0], 16), parseInt(m[1][1] + m[1][1], 16), parseInt(m[1][2] + m[1][2], 16)];
      m = c.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
      if (m) return [+m[1], +m[2], +m[3]];
    }
    return PALETTE[idx % PALETTE.length];
  }

  /* ------------------------------------------------------------------ */
  /* Chargement paresseux de jsPDF et du logo                            */
  /* ------------------------------------------------------------------ */
  var libPromise = null;
  function loadLib() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve();
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = JSPDF_SRC;
      s.onload = function () { window.jspdf && window.jspdf.jsPDF ? resolve() : reject(new Error('jsPDF indisponible')); };
      s.onerror = function () { libPromise = null; reject(new Error('Chargement de jsPDF impossible')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  var logoPromise = null;
  function loadLogo() {
    if (logoPromise) return logoPromise;
    logoPromise = fetch(LOGO_SRC).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) {
      return new Promise(function (res, rej) {
        var fr = new FileReader();
        fr.onload = function () { res(fr.result); };
        fr.onerror = rej;
        fr.readAsDataURL(b);
      });
    }).catch(function () { return null; });
    return logoPromise;
  }

  /* ------------------------------------------------------------------ */
  /* Génération du PDF                                                   */
  /* ------------------------------------------------------------------ */
  var C = {
    indigo: [79, 70, 229], indigoDark: [49, 46, 129], indigoSoft: [238, 242, 255],
    amber: [180, 83, 9], amberSoft: [255, 251, 235],
    ink: [15, 23, 42], text: [51, 65, 85], muted: [100, 116, 139],
    line: [226, 232, 240], zebra: [248, 250, 252], rose: [190, 18, 60], green: [4, 120, 87]
  };
  var PAGE_W = 210, PAGE_H = 297, MX = 16, CW = PAGE_W - 2 * MX, TOP = 16, FOOT = 22;

  function buildPdf(key, logo) {
    var cfg = SIMS[key];
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    var y = TOP;
    var now = new Date();
    var dateLong = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    var title = cfg.title, subtitle = '';
    try { subtitle = clean(cfg.subtitle ? cfg.subtitle() : ''); } catch (e) { /* facultatif */ }

    function setFill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function setDraw(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function setText(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function font(style, size) { doc.setFont('helvetica', style); doc.setFontSize(size); }
    function lines(s, w) { return doc.splitTextToSize(clean(s), w); }

    function pageHeader(first) {
      y = TOP;
      var logoH = first ? 11 : 7;
      if (logo) { try { doc.addImage(logo, 'PNG', MX, y - 1, logoH, logoH); } catch (e) { logo = null; } }
      var tx = MX + (logo ? logoH + 2.5 : 0);
      font('bold', first ? 13 : 10); setText(C.ink);
      doc.text('JeGereMonEpargne', tx, y + (first ? 5 : 3.5));
      font('normal', 8); setText(C.muted);
      doc.text(SITE, tx, y + (first ? 9.5 : 7));
      doc.text(first ? 'Simulation du ' + dateLong : cfg.title, PAGE_W - MX, y + (first ? 5 : 3.5), { align: 'right' });
      y += logoH + 3;
      setDraw(C.indigo); doc.setLineWidth(0.7); doc.line(MX, y, PAGE_W - MX, y);
      y += first ? 8 : 6;
    }

    function ensure(h) {
      if (y + h > PAGE_H - FOOT) { doc.addPage(); pageHeader(false); }
    }

    function sectionTitle(t, follow) {
      if (y > TOP + 30) y += 3;
      ensure(14 + (follow || 0));
      font('bold', 10.5); setText(C.indigoDark);
      doc.text(clean(t).toUpperCase(), MX, y);
      y += 2.2;
      setDraw(C.line); doc.setLineWidth(0.3); doc.line(MX, y, PAGE_W - MX, y);
      y += 5;
    }

    function valueColor(v, fallback) { return /^[-−]\s?\d/.test(v) ? C.rose : fallback; }

    function drawCards(cards, cols, hero) {
      if (!cards.length) return;
      var gap = 4, w = (CW - gap * (cols - 1)) / cols;
      for (var r = 0; r < cards.length; r += cols) {
        var row = cards.slice(r, r + cols);
        var vSize = hero ? 19 : 14, pad = 4;
        var subL = row.map(function (c) { return c.sub ? lines(c.sub, w - 2 * pad).slice(0, 4) : []; });
        var maxSub = Math.max.apply(null, subL.map(function (s) { return s.length; }));
        var h = pad + 3.5 + (hero ? 9.5 : 7) + (maxSub ? maxSub * 3.3 + 1.5 : 0) + pad - 1;
        ensure(h + 4);
        row.forEach(function (c, i) {
          var x = MX + i * (w + gap), idx = r + i;
          var soft = hero ? (idx === 0 ? C.indigoSoft : C.amberSoft) : C.zebra;
          var accent = hero ? (idx === 0 ? C.indigo : C.amber) : C.ink;
          setFill(soft); setDraw(hero ? accent : C.line); doc.setLineWidth(hero ? 0.35 : 0.25);
          doc.roundedRect(x, y, w, h, 2.2, 2.2, 'FD');
          font('bold', 7.2); setText(hero ? accent : C.muted);
          doc.text(clean(c.label).toUpperCase(), x + pad, y + pad + 2);
          font('bold', vSize); setText(valueColor(c.value, hero ? accent : C.ink));
          doc.text(c.value, x + pad, y + pad + 3.5 + (hero ? 8 : 6));
          font('normal', 7.4); setText(C.muted);
          subL[i].forEach(function (ln, k) {
            doc.text(ln, x + pad, y + pad + 3.5 + (hero ? 8 : 6) + 4.2 + k * 3.3);
          });
        });
        y += h + gap;
      }
    }

    function drawNotice(text, tone) {
      if (!text) return;
      var ls = lines(text, CW - 10), h = ls.length * 4.2 + 6;
      ensure(h + 3);
      var warn = tone === 'warn';
      setFill(warn ? C.amberSoft : C.indigoSoft); setDraw(warn ? [253, 230, 138] : [199, 210, 254]); doc.setLineWidth(0.3);
      doc.roundedRect(MX, y, CW, h, 2, 2, 'FD');
      setFill(warn ? C.amber : C.indigo); doc.rect(MX, y + 1.5, 1.1, h - 3, 'F');
      font('normal', 9); setText(C.ink);
      ls.forEach(function (ln, i) { doc.text(ln, MX + 5, y + 5.4 + i * 4.2); });
      y += h + 4;
    }

    function drawBar(b) {
      if (!b) return;
      ensure(16);
      font('bold', 8.5); setText(C.text);
      doc.text(clean(b.label), MX, y + 3);
      font('normal', 8.5); setText(C.muted);
      doc.text(clean(b.text), PAGE_W - MX, y + 3, { align: 'right' });
      var p = Math.max(0, Math.min(100, b.pct));
      setFill([226, 232, 240]); doc.roundedRect(MX, y + 5.5, CW, 3.2, 1.6, 1.6, 'F');
      if (p > 0) { setFill(C.green); doc.roundedRect(MX, y + 5.5, Math.max(3.2, CW * p / 100), 3.2, 1.6, 1.6, 'F'); }
      y += 18;
    }

    function drawHypotheses(rows) {
      if (!rows.length) return;
      sectionTitle('Hypothèses de la simulation', 14);
      var colW = (CW - 8) / 2;
      var half = Math.ceil(rows.length / 2);
      var left = rows.slice(0, half), right = rows.slice(half);
      var total = Math.max(left.length, right.length);
      function cell(r, x) {
        font('bold', 8.6);
        var vs = clean(r[1]), vw = Math.min(doc.getTextWidth(vs), colW * 0.6);
        font('normal', 8.6);
        return { r: r, x: x, vs: vs, vw: vw, ls: lines(r[0], colW - vw - 4) };
      }
      for (var i = 0; i < total; i++) {
        var cells = [];
        if (left[i]) cells.push(cell(left[i], MX));
        if (right[i]) cells.push(cell(right[i], MX + colW + 8));
        var nl = Math.max.apply(null, cells.map(function (c) { return c.ls.length; }));
        var rowH = nl * 3.7 + 2.9;
        ensure(rowH + 1);
        cells.forEach(function (c) {
          font('normal', 8.6); setText(C.muted);
          c.ls.forEach(function (ln, k) { doc.text(ln, c.x, y + 4 + k * 3.7); });
          font('bold', 8.6); setText(C.ink);
          var vs = c.vs;
          while (vs.length > 3 && doc.getTextWidth(vs) > colW * 0.6) vs = vs.slice(0, -2);
          doc.text(vs === c.vs ? vs : vs + '\u2026', c.x + colW, y + 4, { align: 'right' });
          setDraw(C.line); doc.setLineWidth(0.2); doc.line(c.x, y + rowH - 0.6, c.x + colW, y + rowH - 0.6);
        });
        y += rowH;
      }
      y += 5;
    }

    function niceStep(raw) {
      var e = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / e;
      return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e;
    }
    function compact(v) {
      var a = Math.abs(v), s = v < 0 ? '-' : '';
      if (a >= 1e6) return s + (Math.round(a / 1e5) / 10).toString().replace('.', ',') + ' M€';
      if (a >= 1e3) return s + Math.round(a / 1e3) + ' k€';
      return s + Math.round(a) + ' €';
    }

    function drawChart(chart) {
      var series = chartSeries(chart);
      if (!series.length) return null;
      var labels = (chart.data.labels || []).map(function (l) { return clean(l).replace(/^Ann[ée]e\s*/i, ''); });
      var n = Math.max.apply(null, series.map(function (s) { return s.data.length; }));
      var min = Infinity, max = -Infinity;
      series.forEach(function (s) { s.data.forEach(function (v) { if (v != null) { if (v < min) min = v; if (v > max) max = v; } }); });
      if (!isFinite(min)) return null;
      if (min > 0) min = 0;
      if (max <= min) max = min + 1;
      var step = niceStep((max - min) / 4);
      var lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;

      var H = 66, legendH = 6;
      sectionTitle('Évolution dans le temps');
      ensure(H + legendH + 14);

      // Légende
      var lx = MX;
      font('normal', 8);
      series.forEach(function (s) {
        var w = doc.getTextWidth(s.label) + 9;
        if (lx + w > PAGE_W - MX) return;
        setDraw(s.color); doc.setLineWidth(0.9);
        if (s.dash && s.dash.length) doc.setLineDashPattern([1.6, 1.2], 0);
        doc.line(lx, y + 1.6, lx + 5, y + 1.6);
        doc.setLineDashPattern([], 0);
        setText(C.text); doc.text(s.label, lx + 6.5, y + 2.6);
        lx += w + 3;
      });
      y += legendH;

      var px = MX + 17, pw = CW - 17 - 14, py = y + 2, ph = H - 12;
      function X(i) { return px + (n <= 1 ? 0 : (pw * i) / (n - 1)); }
      function Y(v) { return py + ph - ((v - lo) / (hi - lo)) * ph; }

      // Grille + axe Y
      var ticks = Math.round((hi - lo) / step);
      font('normal', 7.2);
      for (var t = 0; t <= ticks; t++) {
        var tv = lo + t * step, ty = Y(tv);
        setDraw(tv === 0 ? [148, 163, 184] : C.line); doc.setLineWidth(tv === 0 ? 0.35 : 0.2);
        doc.line(px, ty, px + pw, ty);
        setText(C.muted); doc.text(compact(tv), px - 2, ty + 1, { align: 'right' });
      }
      // Axe X
      var every = Math.max(1, Math.ceil((n - 1) / 7));
      for (var i = 0; i < n; i += every) {
        var lab = labels[i] != null ? labels[i] : String(i);
        setText(C.muted); doc.text(lab, X(i), py + ph + 4.5, { align: 'center' });
      }
      if ((n - 1) % every !== 0) doc.text(labels[n - 1] != null ? labels[n - 1] : String(n - 1), X(n - 1), py + ph + 4.5, { align: 'center' });
      setText(C.muted); font('normal', 7);
      doc.text('Années', px + pw / 2, py + ph + 8.6, { align: 'center' });

      // Courbes
      var endLabels = [];
      series.forEach(function (s) {
        setDraw(s.color); doc.setLineWidth(0.75);
        if (s.dash && s.dash.length) doc.setLineDashPattern([1.8, 1.4], 0);
        var prev = null;
        s.data.forEach(function (v, i) {
          if (v == null) { prev = null; return; }
          var cx = X(i), cy = Y(v);
          if (prev) doc.line(prev[0], prev[1], cx, cy);
          prev = [cx, cy];
        });
        doc.setLineDashPattern([], 0);
        for (var k = s.data.length - 1; k >= 0; k--) if (s.data[k] != null) { endLabels.push({ y: Y(s.data[k]), v: s.data[k], c: s.color }); break; }
      });
      // Valeurs finales (sans chevauchement)
      endLabels.sort(function (a, b) { return a.y - b.y; });
      var lastY = -99;
      font('bold', 7.2);
      endLabels.forEach(function (e) {
        if (e.y - lastY < 3.4) return;
        setFill(e.c); doc.circle(px + pw, e.y, 0.9, 'F');
        setText(e.c); doc.text(compact(e.v), px + pw + 2, e.y + 1);
        lastY = e.y;
      });
      y = py + ph + 13;
      return { labels: labels, series: series };
    }

    // Tableau générique avec en-tête répété sur chaque page
    function drawTable(tbl, opts) {
      opts = opts || {};
      var cols = tbl.head.length;
      var fs = cols > 6 ? 7.2 : 8.4;
      var firstW = opts.firstW || (cols > 6 ? 16 : cols > 3 ? 24 : 38);
      var otherW = (CW - firstW) / (cols - 1);
      var widths = tbl.head.map(function (_, i) { return i === 0 ? firstW : otherW; });
      var rowH = cols > 6 ? 5.6 : 6;

      function header() {
        font('bold', fs - 0.4);
        var hl = tbl.head.map(function (h, i) { return lines(h, widths[i] - 2.5); });
        var hh = Math.max.apply(null, hl.map(function (l) { return l.length; })) * 3.4 + 3.2;
        ensure(hh + rowH * 2);
        setFill(C.indigoSoft); doc.rect(MX, y, CW, hh, 'F');
        setText(C.indigoDark);
        var x = MX;
        hl.forEach(function (l, i) {
          l.forEach(function (ln, k) {
            if (i === 0) doc.text(ln, x + 1.5, y + 4.4 + k * 3.4);
            else doc.text(ln, x + widths[i] - 1.5, y + 4.4 + k * 3.4, { align: 'right' });
          });
          x += widths[i];
        });
        y += hh;
      }
      header();
      tbl.rows.forEach(function (r, ri) {
        if (y + rowH > PAGE_H - FOOT) { doc.addPage(); pageHeader(false); header(); }
        if (ri % 2 === 1) { setFill(C.zebra); doc.rect(MX, y, CW, rowH, 'F'); }
        var x = MX, last = ri === tbl.rows.length - 1 && opts.boldLast;
        font(last ? 'bold' : 'normal', fs);
        r.forEach(function (c, i) {
          c = clean(c);
          setText(i === 0 ? C.ink : valueColor(c, C.text));
          if (i === 0) doc.text(c, x + 1.5, y + rowH * 0.68);
          else doc.text(c, x + widths[i] - 1.5, y + rowH * 0.68, { align: 'right' });
          x += widths[i];
        });
        y += rowH;
      });
      setDraw(C.line); doc.setLineWidth(0.3); doc.line(MX, y, PAGE_W - MX, y);
      y += 6;
    }

    /* ---------- Composition du document ---------- */
    pageHeader(true);

    font('bold', 17); setText(C.ink);
    var tl = lines(title, CW);
    tl.forEach(function (ln) { doc.text(ln, MX, y + 5); y += 7.4; });
    if (subtitle) { font('normal', 10); setText(C.muted); doc.text(subtitle, MX, y + 2); y += 6; }
    y += 4;

    // Avertissements éventuels (budget négatif, plafond micro-foncier…)
    (cfg.notes || []).forEach(function (id) { var t = visibleTxt(id); if (t) drawNotice(t, 'warn'); });
    if (cfg.banner) drawNotice(visibleTxt(cfg.banner), 'info');

    sectionTitle('Résultats clés');
    drawCards(resultCards(cfg.hero), 2, true);
    drawCards(resultCards(cfg.kpis), 3, false);
    if (cfg.bar) { var b; try { b = cfg.bar(); } catch (e) { b = null; } drawBar(b); }

    var chart = chartOf(cfg.chart), chartInfo = null;
    if (chart) chartInfo = drawChart(chart);

    drawHypotheses(collectInputs(cfg));

    (cfg.tables || []).forEach(function (t) {
      sectionTitle(t.title, 22);
      drawTable({ head: t.head, rows: t.rows() }, { boldLast: false });
    });

    var tbl = null;
    if (cfg.table) tbl = tableFromDom(cfg.table.wrap);
    if (!tbl && chartInfo && chartInfo.series.length) {
      var ser = chartInfo.series.slice(0, 4);
      tbl = {
        head: ['Année'].concat(ser.map(function (s) { return s.label; })),
        rows: chartInfo.labels.map(function (lab, i) {
          return [lab].concat(ser.map(function (s) { return s.data[i] == null ? '' : fmtEur(s.data[i]); }));
        })
      };
    }
    if (tbl) {
      sectionTitle((cfg.table && cfg.table.title) || 'Détail année par année', 22);
      drawTable(tbl);
    }

    /* ---------- Pieds de page + métadonnées ---------- */
    var pages = doc.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      setDraw(C.line); doc.setLineWidth(0.3); doc.line(MX, PAGE_H - FOOT + 3, PAGE_W - MX, PAGE_H - FOOT + 3);
      font('normal', 6.8); setText(C.muted);
      var dl = lines(DISCLAIMER, CW);
      dl.forEach(function (ln, i) { doc.text(ln, MX, PAGE_H - FOOT + 7 + i * 3); });
      font('bold', 7.2); setText(C.indigo);
      doc.text(SITE, MX, PAGE_H - 6);
      font('normal', 7.2); setText(C.muted);
      doc.text('Page ' + p + ' / ' + pages, PAGE_W - MX, PAGE_H - 6, { align: 'right' });
    }
    doc.setProperties({
      title: title + ' - JeGereMonEpargne',
      subject: subtitle || title,
      author: 'JeGereMonEpargne',
      creator: SITE,
      keywords: 'simulation, épargne, patrimoine'
    });

    var iso = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
    return { doc: doc, filename: 'jegeremonepargne-' + cfg.file + '-' + iso + '.pdf' };
  }

  function fmtEur(v) {
    return clean(new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(v))) + ' €';
  }

  /* ------------------------------------------------------------------ */
  /* Boutons                                                             */
  /* ------------------------------------------------------------------ */
  var ICON = '<svg class="ic ic-gap" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
  var LABEL = 'Télécharger le PDF';

  function injectStyle() {
    if ($('pdf-export-style')) return;
    var st = document.createElement('style');
    st.id = 'pdf-export-style';
    st.textContent =
      '.pdf-export-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;margin-top:.75rem;' +
      'padding:.75rem 1rem;border-radius:.75rem;background:#1e293b;border:1px solid #334155;color:#e2e8f0;' +
      'font-weight:700;font-size:.875rem;line-height:1.25rem;cursor:pointer;transition:background .15s,border-color .15s}' +
      '.pdf-export-btn:hover{background:#334155;border-color:#475569}' +
      '.pdf-export-btn:focus-visible{outline:2px solid #818cf8;outline-offset:2px}' +
      '.pdf-export-btn[disabled]{opacity:.65;cursor:progress}' +
      '.pdf-export-btn--row{flex:1 1 0%;width:auto;margin-top:0}';
    document.head.appendChild(st);
  }

  function setBtn(btn, html, disabled) { btn.innerHTML = html; btn.disabled = !!disabled; }

  function onExport(key, btn) {
    if (btn.disabled) return;
    setBtn(btn, ICON + 'Génération du PDF…', true);
    Promise.all([loadLib(), loadLogo()]).then(function (r) {
      var res = buildPdf(key, r[1]);
      res.doc.save(res.filename);
      if (typeof window.gtag === 'function') { try { window.gtag('event', 'pdf_export', { simulator: key }); } catch (e) { /* ignore */ } }
      setBtn(btn, ICON + 'PDF téléchargé', false);
    }).catch(function (e) {
      if (window.console) console.error('Export PDF :', e);
      setBtn(btn, ICON + 'Erreur, réessayer', false);
    }).then(function () {
      setTimeout(function () { setBtn(btn, ICON + LABEL, false); }, 2200);
    });
  }

  function init() {
    injectStyle();
    Object.keys(SIMS).forEach(function (key) {
      var cfg = SIMS[key], share = $(cfg.share);
      if (!share || share.parentNode.querySelector('[data-pdf-export="' + key + '"]')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pdf-export-btn' + (cfg.inlineBtn ? ' pdf-export-btn--row' : '');
      btn.setAttribute('data-pdf-export', key);
      btn.innerHTML = ICON + LABEL;
      btn.addEventListener('click', function () { onExport(key, btn); });
      // Préchauffe jsPDF dès que l'intention est claire (survol, focus, toucher)
      ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) {
        btn.addEventListener(ev, function () { loadLib().catch(function () {}); }, { once: true, passive: true });
      });
      share.insertAdjacentElement('afterend', btn);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // Exposé pour les tests et l'intégration éventuelle d'une capture d'e-mail
  window.JGMEPdf = { build: function (key) { return Promise.all([loadLib(), loadLogo()]).then(function (r) { return buildPdf(key, r[1]); }); } };
})();
