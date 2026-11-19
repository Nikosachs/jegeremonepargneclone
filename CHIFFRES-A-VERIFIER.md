# Chiffres à vérifier chaque année

Ce fichier liste les chiffres réglementaires utilisés dans le site, les pages concernées et leur état de vérification. À relire **chaque janvier** (loi de finances, loi de financement de la Sécurité sociale) et **chaque 1er février et 1er août** (taux du Livret A et du LEP). Après toute modification : mettre à jour `dateModified` (JSON-LD) et `<lastmod>` du `sitemap.xml`.

Les hypothèses des études de cas (rendement de 4 % ou 6 %, inflation de 1,5 %, taux de crédit, prix des biens) ne sont pas des chiffres réglementaires : elles sont données comme illustrations et n’ont pas à suivre l’actualité.

## Tableau de suivi

### PFU (flat tax) 31,4 % = 12,8 % d’impôt + 18,6 % de prélèvements sociaux

- **État :** Confirmé le 19/11/2026 (LFSS 2026, en vigueur depuis le 1er janvier 2026)
- **Pages (7) :** `comparateur-pea-assurance-vie-cto.html`, `cas-choisir-courtier-bourse.html`, `cas-etf-capitalisant-distribuant.html`, `cas-fiscalite-bourse-pea-cto.html`, `cas-million-2000-euros.html`, `cas-per-plan-epargne-retraite.html`, `index.html`

### Prélèvements sociaux 18,6 % (PEA, CTO, épargne salariale, LMNP)

- **État :** Confirmé le 19/11/2026. Dernière vérification à refaire en janvier
- **Pages (15) :** `comparateur-pea-assurance-vie-cto.html`, `cas-acheter-residence-principale-ou-louer.html`, `cas-assurance-vie-vs-pea-etf.html`, `cas-choisir-courtier-bourse.html`, `cas-etf-capitalisant-distribuant.html`, `cas-fiscalite-bourse-pea-cto.html`, `cas-immo-locatif-pertinent.html`, `cas-lep-livret-epargne-populaire.html`, `cas-location-nue-ou-lmnp.html`, `cas-million-2000-euros.html`, `cas-pee-abondement-employeur.html`, `cas-per-plan-epargne-retraite.html`, `cas-rembourser-credit-ou-investir.html`, `cas-salaire-immobilier.html`, `index.html`

### Prélèvements sociaux 17,2 % (assurance-vie, revenus fonciers/SCPI)

- **État :** Confirmé le 19/11/2026 pour l’assurance-vie et les revenus fonciers. Voir point d’attention PER ci-dessous
- **Pages (14) :** `comparateur-pea-assurance-vie-cto.html`, `cas-assurance-vie-vs-pea-etf.html`, `cas-choisir-courtier-bourse.html`, `cas-diversification-scpi.html`, `cas-fiscalite-bourse-pea-cto.html`, `cas-fiscalite-scpi.html`, `cas-immo-100k.html`, `cas-location-nue-ou-lmnp.html`, `cas-pee-abondement-employeur.html`, `cas-retraite-scpi.html`, `cas-salaire-immobilier.html`, `cas-scpi-a-credit-effet-de-levier.html`, `cas-scpi-frais-souscription-point-mort.html`, `index.html`

### Part d’impôt du PFU : 12,8 %

- **État :** Confirmé le 19/11/2026
- **Pages (6) :** `comparateur-pea-assurance-vie-cto.html`, `cas-choisir-courtier-bourse.html`, `cas-etf-capitalisant-distribuant.html`, `cas-fiscalite-bourse-pea-cto.html`, `cas-per-plan-epargne-retraite.html`, `index.html`

### Plafond de versements du PEA : 150 000 €

- **État :** Confirmé le 19/11/2026 (service-public.gouv.fr : 150 000 €, PEA-PME 225 000 €). Retrait avant 5 ans : 12,8 % d’impôt + prélèvements sociaux. Un PEA ancien (avant 2018) peut avoir un taux de PS plus faible sur une partie des gains
- **Pages (8) :** `comparateur-pea-assurance-vie-cto.html`, `cas-assurance-vie-vs-pea-etf.html`, `cas-choisir-courtier-bourse.html`, `cas-diversification-scpi.html`, `cas-fiscalite-bourse-pea-cto.html`, `cas-fiscalite-scpi.html`, `cas-immo-locatif-pertinent.html`, `cas-lep-livret-epargne-populaire.html`

### Livret A : taux net (1,7 % depuis le 1er août 2026) et plafond 22 950 €

- **État :** Confirmé le 19/11/2026 (service-public.gouv.fr : 1,7 %, plafond 22 950 €). Taux révisé chaque 1er février et 1er août : prochaine échéance 1er février 2027
- **Pages (2) :** `cas-matelas-securite.html`, `index.html`

### LDDS : plafond 12 000 €

- **État :** Confirmé le 19/11/2026 (Meilleurtaux, août 2026 : 12 000 €, taux 1,7 %)
- **Pages (5) :** `blog.html`, `cas-100-euros-25-ans.html`, `cas-choisir-courtier-bourse.html`, `cas-immo-locatif-pertinent.html`, `cas-matelas-securite.html`

### LEP : taux 2,5 %, plafond de dépôts 10 000 €, plafond de revenus (≈ 23 000 €)

- **État :** Confirmé le 19/11/2026 (service-public.gouv.fr : 2,5 %, plafond de dépôts 10 000 €, revenu fiscal de référence 23 028 € pour une part). Taux révisé chaque 1er février et 1er août
- **Pages (2) :** `blog.html`, `cas-lep-livret-epargne-populaire.html`

### Micro-foncier : seuil de loyers 15 000 € et abattement 30 %

- **État :** Confirmé le 19/11/2026 (service-public.gouv.fr : seuil 15 000 €, abattement 30 %, prélèvements sociaux 17,2 %)
- **Pages (3) :** `cas-fiscalite-scpi.html`, `cas-location-nue-ou-lmnp.html`, `index.html`

### Assurance-vie : impôt de 7,5 % après 8 ans (primes ≤ 150 000 €) et 12,8 % avant 8 ans

- **État :** Confirmé le 19/11/2026 (Selectra, 29/08/2026 : 7,5 % jusqu’à 150 000 € de primes, 12,8 % au-delà). À recouper avec service-public.gouv.fr
- **Pages (2) :** `comparateur-pea-assurance-vie-cto.html`, `cas-assurance-vie-vs-pea-etf.html`

### Assurance-vie : abattement annuel 4 600 € / 9 200 € (couple) après 8 ans

- **État :** Confirmé le 19/11/2026 (Selectra, 29/08/2026). À recouper avec service-public.gouv.fr
- **Pages (4) :** `comparateur-pea-assurance-vie-cto.html`, `cas-assurance-vie-vs-pea-etf.html`, `cas-cout-credit-consommation.html`, `cas-fiscalite-scpi.html`

### Épargne salariale : abondement et CSG/CRDS de 9,7 % sur l’abondement

- **État :** Confirmé le 19/11/2026. PASS 2026 = 48 060 € ; plafond d’abondement PEE = 8 % du PASS = 3 844,80 € ; PER collectif = 16 % du PASS = 7 689,60 € (non cité dans la page) ; abondement limité à 300 % du versement ; versements volontaires limités à 25 % de la rémunération brute annuelle ; CSG/CRDS 9,7 % sur l’abondement et exonération d’impôt (Malakoff Humanis, guide fiscal et social 2026 ; La Finance pour tous pour le PASS). À recalculer chaque janvier avec le nouveau PASS
- **Pages (1) :** `cas-pee-abondement-employeur.html`

### Frais de notaire (taux utilisés dans les cas immobiliers)

- **État :** Confirmé le 19/11/2026 (notaires.fr : droit départemental à 5 % dans la plupart des départements depuis le 1er avril 2025 et jusqu’au 31 mars 2028, soit environ 6,3 % de droits ; total ≈ 7,5 à 8 % dans l’ancien, 2 à 3 % dans le neuf). Le simulateur retient 7,5 % (ancien) et 2,5 % (neuf), cohérent. Les primo-accédants peuvent rester à 4,5 % de droit départemental. Les départements peuvent revenir à 4,5 % après mars 2028 : à revoir en 2028
- **Pages (7) :** `cas-acheter-residence-principale-ou-louer.html`, `cas-capacite-emprunt.html`, `cas-immo-100k.html`, `cas-immo-locatif-pertinent.html`, `cas-immo-vs-scpi.html`, `cas-scpi-100-euros-mois.html`, `index.html`

### PER : abattement/déduction, plafond de déduction, fiscalité à la sortie

- **État :** Confirmé le 19/11/2026 pour les prélèvements sociaux à 18,6 % depuis le 1er janvier 2026 (Previssima, Selectra, Legifiscal), le report des plafonds sur 5 ans et la fin de la déduction après 70 ans. Plafond de déduction 2026 confirmé : 10 % des revenus 2025, minimum 4 710 €, maximum 37 680 € (PASS 2025 de 47 100 € ; Meilleurtaux, MoneyVox). Report sur 5 ans et fin de la déduction après 70 ans confirmés par service-public.gouv.fr (actualité A18841, loi n° 2026-103 du 19/02/2026). Nuance : le report à 5 ans ne vaut que pour les plafonds générés à compter de 2026, les plafonds antérieurs restent reportables 3 ans. À refaire en janvier avec le nouveau PASS
- **Pages (1) :** `cas-per-plan-epargne-retraite.html`

## Sources utilisées le 19/11/2026

- Officielles (service-public.gouv.fr) : actualité PER A18841, notaires.fr (frais d’acquisition), fiches PEA (F2385, F22449), LEP (F2367), Livret A (F2365), micro-foncier (F1991), prélèvements sociaux (F2329).
- Presse spécialisée : Moneyvox et Meilleurtaux (taux des livrets au 1er août 2026), Selectra (assurance-vie, hausse de CSG), Previssima et Legifiscal (PER).

- Prélèvements sociaux, PFU, PEA, assurance-vie : articles de presse spécialisée (MoneyVox, Selectra, Boursorama, Que Choisir) sur la loi de financement de la Sécurité sociale pour 2026.
- Toujours privilégier la source officielle (impots.gouv.fr, service-public.fr, Légifrance) pour une mise à jour.
