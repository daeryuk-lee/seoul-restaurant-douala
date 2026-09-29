# Seoul — Restaurant coréen à Douala

Site officiel de **Seoul Restaurant Coréen** (Rue Chococho, à côté de LGM, Douala) en français, anglais, coréen et chinois.pm

## Technologies

- [Astro](https://astro.build) 7 : site statique, JavaScript chargé uniquement là où il sert
- Scène 3D temps réel sur l'accueil ([Three.js](https://threejs.org) / WebGL, shaders de vapeur et de braises), chargée à la demande, avec repli sur photo
- Cartes en perspective 3D, animations au défilement en CSS natif, transitions entre pages (View Transitions)
- Logo vectoriel généré par script à partir de polices libres (licence OFL, voir `scripts/fonts/`)
- Une URL par langue (`/`, `/en/`, `/ko/`, `/zh/`) avec balises `hreflang` et plan du site multilingue
- Images converties automatiquement en AVIF / WebP responsives
- Polices auto-hébergées (aucune requête vers Google)
- Données structurées schema.org (Restaurant, Menu, fil d'Ariane)
- Accessibilité WCAG 2.2 AA : navigation au clavier, contrastes vérifiés, réduction des animations respectée
- En-têtes de sécurité stricts (CSP, HSTS…) dans `public/_headers` (Cloudflare Pages)

## Modifier le contenu

| Quoi                                                                                                          | Fichier                |
| ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Téléphone, WhatsApp, adresse, réseaux sociaux, **informations légales**, horaires, fermetures exceptionnelles | `src/config/site.ts`   |
| Plats, prix, descriptions, piment, végétarien, « Nouveau »                                                    | `src/data/menu.ts`     |
| Textes de l'interface (4 langues)                                                                             | `src/i18n/ui.ts`       |
| Mentions légales et politique de confidentialité                                                              | `src/content/legal.ts` |
| Photos (déposer les originaux ici, puis lancer `npm run brand`)                                               | `src/assets/images/_originals/` |

Pour régénérer les photos dans la direction artistique du site, voir [docs/prompts-images.md](docs/prompts-images.md).

Les champs entre crochets `[ … ]` de `src/config/site.ts` doivent être complétés (RCCM, NIU, raison sociale, directeur de la publication) : un avertissement s'affiche à chaque compilation tant qu'ils ne le sont pas.

## Commandes

```bash
npm install        # installation
npm run dev        # développement : http://localhost:4321
npm run build      # vérification des types + génération dans dist/
npm run preview    # prévisualiser le site généré
npm run brand      # régénérer logo, icônes, image de partage et étalonnage des photos
```

## Déploiement (Cloudflare Pages)

- Commande de build : `npm run build`
- Dossier de sortie : `dist`
- Version de Node : 22 ou plus
