# Portfolio LOMPO Ibrahim — Géomaticien & Développeur WebSIG

Portfolio en ligne (page unique) présentant le profil professionnel de **LOMPO Ibrahim**, géomaticien et développeur WebSIG, spécialisé en télédétection, analyse spatiale, SIG, machine learning et développement d'outils géomatiques.

## Sections

- **Accueil** — présentation, bouton de téléchargement du CV, liens de contact
- **Projets** — plugins QGIS publiés sur le dépôt officiel et plateformes WebGIS déployées en production
- **Expertise** — compétences, outils & logiciels, certifications et formations
- **Parcours** — expérience professionnelle, engagement associatif, recherche et formation
- **Contact** — formulaire qui ouvre le client mail avec un message pré-rempli (aucun serveur requis)

## Technologies

- HTML5 sémantique
- CSS3 + Tailwind CSS (via CDN)
- JavaScript vanilla — navigation par onglets, formulaire de contact, état actif de la navigation
- Bilingue **FR/EN** : dictionnaire `i18n.js`, attributs `data-i18n`, sélecteur de langue dans le header, choix mémorisé en `localStorage` (`portfolio_lang`), **anglais par défaut**
- Dates rendues via `Intl.DateTimeFormat` : attributs `data-date="YYYY-MM[-DD]"` / `data-date-start` + `data-date-end` ("present" si en cours)
- Material Symbols et Google Fonts (Montserrat / Inter)

## Structure du projet

```
portfolio_lompo_ibrahim/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── i18n.js
│   │   ├── main.js
│   │   └── tailwind-config.js
│   ├── profil.jpg
│   └── … (CV, mémoire, poster en PDF)
├── robots.txt
├── sitemap.xml
└── vercel.json
```

Le HTML, le CSS et le JavaScript sont séparés dans des fichiers dédiés. `tailwind-config.js` doit être chargé immédiatement après le CDN Tailwind dans le `<head>`.

## Lancer en local

Deux possibilités :

- Ouvrir directement `index.html` dans un navigateur
- Lancer un serveur local (recommandé) :
  - VS Code avec l'extension **Live Server**
  - ou en ligne de commande : `python -m http.server` puis ouvrir `http://localhost:8000`

## Déploiement

Site 100 % statique, compatible **Vercel**, **Netlify** et **GitHub Pages**. Aucun build requis : importez le dépôt dans votre plateforme d'hébergement et déployez. Un fichier `vercel.json` est fourni pour les URL propres (`cleanUrls`).

## Référencement (SEO)

Le site intègre :

- une meta description optimisée
- les balises Open Graph (`og:type=profile`) et Twitter Card
- des données structurées JSON-LD (`Person`)
- `robots.txt` et `sitemap.xml`

> **Information** : le site est déployé sur `https://lompo-ibrahim.vercel.app`. Le SEO est mis à jour : meta description, Open Graph, données structurées JSON-LD, `robots.txt` et `sitemap.xml`.

> **Image de partage** : `og:image` pointe actuellement vers `assets/profil.jpg` (placeholder documenté). Pour un rendu optimal sur les réseaux sociaux, générer une image dédiée `assets/og-image.jpg` en 1200×630 (monogramme "LI" sur fond `#12B7D6`, nom et titre du profil) et mettre à jour le `content` des balises `og:image` / `twitter:image` dans `index.html`.

## Contact

- Email : [Ibrahimlompo33@gmail.com](mailto:Ibrahimlompo33@gmail.com)
- GitHub : [github.com/ibrahimlompo33-coder](https://github.com/ibrahimlompo33-coder)
- LinkedIn : [linkedin.com/in/ibrahim-lompo-438a7421a](https://www.linkedin.com/in/ibrahim-lompo-438a7421a)