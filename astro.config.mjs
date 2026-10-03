// @ts-check
import { createRequire } from 'node:module';
import { defineConfig } from 'astro/config';

const require = createRequire(import.meta.url);

const LATIN = [
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
];
const LATIN_EXT = [
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
];

/**
 * Police du logo du restaurant : Calibri (« Restaurant Coréen »).
 * Calibri n'est pas libre de diffusion : elle est utilisée si l'ordinateur du visiteur l'a déjà
 * (Windows, Office), sinon Carlito prend le relais — même dessin et mêmes largeurs de caractères,
 * licence OFL, auto-hébergée depuis node_modules (aucune requête vers Google : conforme RGPD et
 * loi camerounaise n° 2024/017). Astro génère aussi une police de repli calibrée pour éviter tout
 * décalage de mise en page au chargement.
 *
 * Le fournisseur « local » d'Astro ne sait pas écrire local('Calibri') : ce petit fournisseur le fait.
 */
// latin-ext d'abord : pour les caractères communs aux deux plages (comme « œ »), le navigateur
// essaie la dernière police déclarée, ici latin, et ne télécharge pas latin-ext pour rien
const SUBSETS = { 'latin-ext': LATIN_EXT, latin: LATIN };
const FACES = [
  { weight: 400, style: 'normal', local: ['Calibri', 'Carlito Regular', 'Carlito-Regular'] },
  { weight: 700, style: 'normal', local: ['Calibri Bold', 'Calibri-Bold', 'Carlito Bold', 'Carlito-Bold'] },
];

/** @type {import('astro').FontProvider} */
const calibriFirst = {
  name: 'calibri-puis-carlito',
  resolveFont: () => ({
    fonts: FACES.flatMap(({ weight, style, local }) =>
      Object.entries(SUBSETS).map(([subset, unicodeRange]) => ({
        weight,
        style,
        unicodeRange,
        // Indispensable pour que le préchargement filtre par sous-ensemble
        meta: { subset },
        src: [
          ...local.map((name) => ({ name })),
          { url: require.resolve(`@fontsource/carlito/files/carlito-${subset}-${weight}-${style}.woff2`), format: 'woff2' },
        ],
      })),
    ),
  }),
};

export default defineConfig({
  site: 'https://restaurant-seoul-douala.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS intégré à chaque page : aucun aller-retour réseau bloquant avant le premier affichage
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  fonts: [
    {
      provider: calibriFirst,
      name: 'Carlito',
      cssVariable: '--font-carlito',
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  vite: {
    build: {
      // Aucun script ni asset inliné : permet une Content-Security-Policy stricte (script-src 'self')
      assetsInlineLimit: 0,
    },
  },
});
