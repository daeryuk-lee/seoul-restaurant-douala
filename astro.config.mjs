// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

const LATIN = [
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
];
const LATIN_EXT = [
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
];

/**
 * Polices auto-hébergées depuis node_modules (aucune requête vers Google : conforme RGPD
 * et loi camerounaise n° 2024/017). Astro génère aussi des polices de repli calibrées
 * pour éviter tout décalage de mise en page au chargement.
 * @param {string} pkg @param {string} file @param {Array<'normal'|'italic'>} styles
 */
const variants = (pkg, file, styles) =>
  styles.flatMap((style) => [
    { src: [`${pkg}/files/${file}-latin-wght-${style}.woff2`], style, unicodeRange: LATIN },
    { src: [`${pkg}/files/${file}-latin-ext-wght-${style}.woff2`], style, unicodeRange: LATIN_EXT },
  ]);

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
      provider: fontProviders.local(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      fallbacks: ['Georgia', 'serif'],
      weights: ['300 700'],
      options: {
        // @ts-ignore — tuple non vide garanti par la construction
        variants: variants('@fontsource-variable/cormorant-garamond', 'cormorant-garamond', ['normal', 'italic']),
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Jost',
      cssVariable: '--font-jost',
      fallbacks: ['Arial', 'sans-serif'],
      weights: ['300 600'],
      options: {
        // @ts-ignore — tuple non vide garanti par la construction
        variants: variants('@fontsource-variable/jost', 'jost', ['normal']),
      },
    },
  ],
  vite: {
    build: {
      // Aucun script ni asset inliné : permet une Content-Security-Policy stricte (script-src 'self')
      assetsInlineLimit: 0,
    },
  },
});
