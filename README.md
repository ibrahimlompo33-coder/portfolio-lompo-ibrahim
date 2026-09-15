# Portfolio LOMPO Ibrahim — prêt à héberger

## Contenu du package
```
index.html              → page unique (Accueil / Projets / Expertise / Parcours / Contact)
assets/CV_Lompo_Ibrahim.pdf     → CV réel, branché sur le bouton "Télécharger le CV"
assets/Poster_LOMPO_Ibrahim.pdf → poster scientifique, branché sur "Voir le poster"
```
Aucune dépendance de build : Tailwind est chargé via CDN (comme dans l'export Stitch d'origine),
tout tient dans `index.html` + le dossier `assets/`.

## Déploiement (3 options, aucune n'exige de backend)

**Vercel / Netlify (recommandé)**
1. Glisser-déposer le dossier `portfolio_lompo_ibrahim/` sur vercel.com/new ou app.netlify.com/drop.
2. Domaine généré automatiquement (`*.vercel.app` / `*.netlify.app`), HTTPS inclus.

**GitHub Pages**
1. Pousser ce dossier dans un dépôt (ex. `ibrahimlompo33-coder/portfolio`).
2. Paramètres du dépôt → Pages → Source: branche `main`, dossier `/root`.
3. Le site est servi à `https://ibrahimlompo33-coder.github.io/portfolio/`.

## Mise à jour — recherche

Le paquet `Projet_LOMPO_Ibrahim.zip` contenait en réalité **3 travaux académiques distincts**,
pas seulement le poster initialement traité. Les 3 sont maintenant dans la section
Parcours → Recherche, par ordre de pertinence :

1. **Mémoire de Master** (AFRIGIST, août 2026) — optimisation géospatiale de la localisation
   des centres de collecte de déchets à Ouagadougou. C'est le travail de diplôme actuel
   (correspond au Master en cours sur le CV) — mis en avant en premier. PDF réel joint
   (`assets/Memoire_Master_Optimisation_Collecte_Dechets_Ouagadougou.pdf`).
2. **Poster scientifique** (AFRIGIST, juin 2026) — potentiel de fertilité des sols à Gaoua.
   PDF réel joint.
3. **Rapport de fin de cycle, Licence pro. ADDT** (Ziniaré, 2022–2023) — insécurité foncière
   et sécurité alimentaire à Fada N'Gourma. **Décrit mais sans PDF téléchargeable** : le
   fichier fourni (`...Corr dr Song.doc`) contient des artefacts de relecture non nettoyés
   (fragments de phrases dupliqués issus de corrections partiellement acceptées — visibles
   dès le résumé). Le publier en l'état nuirait à la crédibilité du portfolio. Fournissez la
   version finale nettoyée si vous voulez que j'ajoute le lien de téléchargement.

## À compléter avant publication

1. **Photo de profil** — aucune photo réelle n'a été intégrée. L'export Stitch utilisait un
   visage généré par IA (`Alexandre Laurent`) : le réutiliser pour vous représenter aurait été
   trompeur, il a donc été retiré. Déposez votre photo réelle dans `assets/profil.jpg`
   (format carré, ≥400×400 px) — elle s'affichera automatiquement ; à défaut, un avatar avec vos
   initiales "LI" s'affiche par défaut, sans image cassée.

2. **Captures des projets WebGIS** — les cartes "WebSIG Ouagadougou" et "Doutchi GIS" utilisent
   un fond dégradé + icône (aucune capture d'écran n'a pu être extraite automatiquement, ces
   sites étant des applications JavaScript). Remplacer par une vraie capture améliorerait la
   conversion visuelle — donnez-moi les images si vous voulez que je les intègre.

4. **Liens plugins non encore individuellement vérifiés** — GeoRaster Tools et GEE Extractor
   pointent vers leurs fiches réelles et confirmées sur plugins.qgis.org. KoboToolbox
   FieldBridge, VecCore et LOMPO Machine Learning pointent vers une recherche filtrée sur
   plugins.qgis.org (URL toujours valide) plutôt qu'une fiche individuelle non vérifiée — à
   remplacer par le lien direct si vous l'avez sous la main.

## Limite connue

Tailwind via CDN (`cdn.tailwindcss.com`) est pratique pour un portfolio personnel mais
déconseillé par Tailwind lui-même en production à grande échelle (poids du bundle, pas de
purge CSS). Sans conséquence ici (trafic personnel, page unique) ; si le site grossit,
migrer vers une build Tailwind compilée (CLI ou Vite) est la suite logique.
