# JeGereMonEpargne

Site statique (déployable tel quel sur Cloudflare Pages) :

- `index.html` : simulateurs + boîte à outils + mentions légales
- `blog.html`, `cas-*.html` (39 études de cas), `qu-est-ce-que-l-inflation.html` (Guide #13) et `livret-a-structurer-son-epargne.html` (Guide #41) : blog et études de cas. La numérotation #1 à #41 est commune aux cas et aux guides, sans trou. Un nouvel article doit être ajouté dans `blog.html` (carte + JSON-LD), dans le tableau `ARTICLES` de `index.html` (sans champ `body` : le texte vit uniquement dans la page de l'article) et dans `sitemap.xml`. Espaces insécables : mettre une espace insécable avant `€`, `%`, `:` et entre les milliers.
- `` : logos, favicon, image de partage, `tailwind.css` (CSS compilé)
- `robots.txt`, `sitemap.xml`

## Mettre à jour le CSS (uniquement si vous ajoutez des classes Tailwind dans `index.html`)
```
npm install
npm run build:css
```
`index.html` charge déjà `tailwind.css` (plus de Tailwind CDN).

## Export PDF des simulations
`pdf-export.js` ajoute un bouton « Télécharger le PDF » sous le bouton de partage de chacun des 7 simulateurs
(épargne, SCPI, immobilier, matelas, inflation, capacité d'emprunt, liberté financière).
- PDF **vectoriel** (texte sélectionnable, ~90 Ko) généré dans le navigateur avec jsPDF 2.5.2 (`jspdf.umd.min.js`, hébergé ici).
- jsPDF n'est chargé qu'au survol/clic du bouton : aucun poids ajouté au chargement de la page.
- Le contenu est lu depuis l'état affiché (champs, cartes de résultats, données Chart.js) : pas de formule dupliquée.
- Nouveau simulateur : ajouter une entrée dans l'objet `SIMS` en haut de `pdf-export.js`.
- Événement GA `pdf_export` envoyé uniquement si l'utilisateur a accepté les cookies (gtag n'existe qu'alors).

## Simulateur d'intérêts composés
`simulateur-interets-composes.html` : page autonome (capital, versement mensuel, rendement, durée ; graphique versé vs intérêts ; lien partageable via `?c=&m=&r=&d=`). Même formule que le simulateur d'épargne. Lien ajouté dans le menu latéral de toutes les pages et dans `sitemap.xml`.

## Comparateur PEA / assurance-vie / CTO
`comparateur-pea-assurance-vie-cto.html` : page autonome (capital, versement mensuel, rendement brut, durée, frais du fonds et de chaque enveloppe, situation seul/couple). Calcule le net après frais et impôts pour un retrait total, année par année (graphique en lignes, tableau comparatif). Lien partageable via paramètres d'URL (`c, m, r, d, f, fp, fa, fc, s`).
- Même formule de capitalisation que le simulateur d'épargne (taux mensuel équivalent, versements en début de mois, rendement net = brut − frais).
- Constantes fiscales en tête du script (`PS_PEA`, `PS_AV`, `IR_PFU`, `IR_AV8`, `ABAT`, `CAP_PEA`) : à mettre à jour avec `CHIFFRES-A-VERIFIER.md`.
- Recoupe l'étude de cas #20 (7 %, 200 €/mois, 20 ans : ≈ 90 100 € PEA, ≈ 80 800 € assurance-vie). Si une règle change, vérifier aussi ce cas.
- Lien ajouté dans le menu latéral de toutes les pages, la page 404, le sitemap et cinq études de cas liées.

## Barre de navigation mobile
`bottomnav.js` (chargé par toutes les pages) ajoute en bas de l'écran, sous 1024 px uniquement, une barre : Épargne · SCPI · Immo · Outils · Guides.
- Sur l'accueil : elle pilote les onglets existants (sans rechargement) et suit l'onglet actif (`body.dataset.tab`).
- Sur le blog et les études de cas : elle renvoie vers `index.html?tab=…` (déjà géré) ; « Guides » est actif sur `blog`, `cas-*` et `qu-est-ce-que-l-inflation`.
- Styles : bloc « Barre de navigation mobile » à la fin de `theme.css` (aucun rebuild Tailwind nécessaire).
- Nouvelle page `.html` : ajouter `<script defer src="bottomnav.js"></script>` avant `</head>`.

## Cohérence des chiffres
Les études de cas utilisent la même formule que le simulateur d'épargne :
taux mensuel équivalent i = (1 + r)^(1/12) − 1, versements en début de mois.

## Page 404
`404.html` (noindex, chemins absolus) est servie automatiquement par Cloudflare Pages pour toute URL inconnue. Elle renvoie vers les simulateurs et le blog. Elle n'est volontairement pas dans `sitemap.xml`.

## Titres et dates
- `<title>` : 65 caractères maximum, marque « | JeGereMonEpargne » comprise (les `og:title` et `headline` gardent la version longue).
- Toute modification d'une page : mettre à jour `dateModified` (JSON-LD) et `<lastmod>` du sitemap avec la même date.

## Pages d'orientation
- `par-ou-commencer.html` : feuille de route débutant en 4 étapes (épargne de précaution, PEA/assurance-vie, DCA, immobilier/SCPI), avec liens vers les outils et cas.
- `lexique.html` : 20 définitions (TMI, PFU, PEA, CTO, SCPI, PNO, GLI, DCA…), avec ancres par terme.
- Les deux sont dans le menu (groupe « Contenus »), le pied de page, le sitemap et la page 404.
- `CHIFFRES-A-VERIFIER.md` : liste des chiffres réglementaires utilisés et des pages concernées, à relire chaque janvier, février et août.


## URL sans extension (important pour Google)
Cloudflare Pages redirige `/page.html` vers `/page` (308). Toutes les URL publiques (liens internes, canonical, `og:url`, JSON-LD, `sitemap.xml`) sont donc écrites **sans `.html`** : `/blog`, `/cas-krach-boursier`, et `/` pour l'accueil. Ne jamais remettre `.html` dans un lien ou le sitemap, sous peine de réapparition du statut « Page avec redirection » dans la Search Console. Les fichiers restent nommés `*.html` sur le disque.
