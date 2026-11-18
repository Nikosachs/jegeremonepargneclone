# JeGereMonEpargne

Site statique (déployable tel quel sur Cloudflare Pages) :

- `index.html` : simulateurs + boîte à outils + mentions légales
- `blog.html`, `cas-*.html` (études de cas #1 à #40), `qu-est-ce-que-l-inflation.html` : blog et études de cas
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

## Barre de navigation mobile
`bottomnav.js` (chargé par toutes les pages) ajoute en bas de l'écran, sous 1024 px uniquement, une barre : Épargne · SCPI · Immo · Outils · Guides.
- Sur l'accueil : elle pilote les onglets existants (sans rechargement) et suit l'onglet actif (`body.dataset.tab`).
- Sur le blog et les études de cas : elle renvoie vers `index.html?tab=…` (déjà géré) ; « Guides » est actif sur `blog`, `cas-*` et `qu-est-ce-que-l-inflation`.
- Styles : bloc « Barre de navigation mobile » à la fin de `theme.css` (aucun rebuild Tailwind nécessaire).
- Nouvelle page `.html` : ajouter `<script defer src="bottomnav.js"></script>` avant `</head>`.

## Cohérence des chiffres
Les études de cas utilisent la même formule que le simulateur d'épargne :
taux mensuel équivalent i = (1 + r)^(1/12) − 1, versements en début de mois.
