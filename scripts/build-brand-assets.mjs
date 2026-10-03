/**
 * Identité visuelle de Seoul — génère toutes les ressources de marque de façon reproductible.
 *
 *  1. Logo vectoriel (src/assets/brand/*.svg), dérivé du vrai logo du restaurant :
 *     - « Seoul » : tracé vectoriel de la couverture du menu (scripts/brand/seoul-trace.svg) ;
 *     - « RESTAURANT CORÉEN » : recomposé en Cormorant Garamond (la police des titres du site,
 *       licence OFL, voir scripts/fonts/), en capitales espacées, et converti en tracés : aucune
 *       police n'est nécessaire à l'affichage.
 *  2. Icônes (favicon, Apple, PWA) tirées du « S » du logo, et image de partage Open Graph (public/).
 *  3. Étalonnage uniforme des photos : src/assets/images/_originals/** → src/assets/images/**
 *     (lumière basse et chaude, noirs profonds, vignettage, grain argentique).
 *
 * Usage : npm run brand              (tout)
 *         npm run brand -- --sans-photos   (logo, icônes et image de partage seulement)
 * Pour remplacer une photo : déposer la nouvelle image dans _originals/ sous le même nom, puis relancer.
 */
import { readFileSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';

const COLORS = {
  ink: '#0b0a09',
  /** Or du site (--brass dans src/styles/global.css). */
  gold: '#d2ae62',
};

/** Élargissement horizontal du mot « Seoul » : 1 = proportions de la couverture du menu. */
const STRETCH = 1;

const withPhotos = !process.argv.includes('--sans-photos');

await mkdir('src/assets/brand', { recursive: true });
await mkdir('public/icons', { recursive: true });

/* ───────────────────────────── 1. Logo vectoriel ───────────────────────────── */

/** Tracé source : coordonnées absolues (commandes M, C, L) en pixels de l'image recadrée. */
const traceD = readFileSync('scripts/brand/seoul-trace.svg', 'utf8').match(/ d="([^"]+)"/)[1];

/** Découpe le tracé en sous-chemins (S, e, o, u, l et les contre-formes), points absolus. */
function parseTrace(d) {
  const tokens = d.match(/[MCL]|-?\d*\.?\d+/g);
  const subpaths = [];
  let cmd = '';
  for (let i = 0; i < tokens.length; ) {
    if (/[MCL]/.test(tokens[i])) {
      cmd = tokens[i++];
      if (cmd === 'M') subpaths.push([]);
      continue;
    }
    const n = cmd === 'C' ? 3 : 1;
    const pts = [];
    for (let k = 0; k < n; k++, i += 2) pts.push([Number(tokens[i]), Number(tokens[i + 1])]);
    subpaths.at(-1).push({ cmd, pts });
  }
  return subpaths;
}
const trace = parseTrace(traceD);

const bounds = (subpaths) => {
  const all = subpaths.flat().flatMap((s) => s.pts);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
};

/** Applique (x, y) → map(x, y), arrondit au dixième et écrit un tracé relatif compact. */
function toPath(subpaths, map) {
  const fmt = (v) => (Math.round(v) / 10).toString().replace(/^(-?)0\./, '$1.');
  let out = '';
  let cx = 0;
  let cy = 0;
  for (const sub of subpaths) {
    let start = null;
    for (const { cmd, pts } of sub) {
      // Travail en dixièmes entiers : aucune dérive d'arrondi d'un segment à l'autre
      const abs = pts.map(([x, y]) => map(x, y).map((v) => Math.round(v * 10)));
      const nums = abs.flatMap(([x, y]) => [x - cx, y - cy]);
      out += { M: 'm', C: 'c', L: 'l' }[cmd] + nums.map(fmt).join(' ').replace(/ -/g, '-');
      [cx, cy] = abs.at(-1);
      if (cmd === 'M') start = abs[0];
    }
    out += 'z';
    [cx, cy] = start;
  }
  return out;
}

/** Tracé opentype.js (M, L, Q, C, Z) → tracé relatif compact, au dixième. */
function compactGlyphs(path) {
  const fmt = (v) => (Math.round(v) / 10).toString().replace(/^(-?)0\./, '$1.');
  let out = '';
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  for (const c of path.commands) {
    if (c.type === 'Z') {
      out += 'z';
      [cx, cy] = [sx, sy];
      continue;
    }
    const pts = (c.type === 'C' ? [[c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] : c.type === 'Q' ? [[c.x1, c.y1], [c.x, c.y]] : [[c.x, c.y]]).map(
      ([x, y]) => [Math.round(x * 10), Math.round(y * 10)],
    );
    out += c.type.toLowerCase() + pts.flatMap(([x, y]) => [x - cx, y - cy]).map(fmt).join(' ').replace(/ -/g, '-');
    [cx, cy] = pts.at(-1);
    if (c.type === 'M') [sx, sy] = [cx, cy];
  }
  return out;
}

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${body}</svg>\n`;

const word = bounds(trace);
const PAD = 2;
/** Repère du logo : origine au coin haut-gauche du mot « Seoul », largeur multipliée par STRETCH. */
const toLogo = (x, y) => [(x - word.x1) * STRETCH + PAD, y - word.y1 + PAD];
// Dimensions entières : elles servent aussi d'attributs width/height des balises <img>
const wordW = Math.ceil((word.x2 - word.x1) * STRETCH + PAD * 2);
const wordH = Math.ceil(word.y2 - word.y1 + PAD * 2);
const wordPath = `<path fill="${COLORS.gold}" fill-rule="evenodd" d="${toPath(trace, toLogo)}"/>`;

// Mot-symbole seul (en-tête)
await writeFile('src/assets/brand/logo-word.svg', svg(wordW, wordH, wordPath, 'Seoul'));

// Logo complet : « RESTAURANT CORÉEN » aligné à droite sous « Seoul », à la place qu'il occupe sur
// le menu (haut des capitales à 168, bord droit à 508, en pixels de l'image recadrée).
{
  const ttf = readFileSync('scripts/fonts/CormorantGaramond-SemiBold.ttf');
  const cormorant = opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
  const TAG = 'RESTAURANT CORÉEN';
  const TRACKING = 0.2; // espacement des capitales, en em
  // Glyphes placés un à un (l'espacement n'est pas géré par opentype.js), à la taille 100
  const place = (size, x0, y0) => {
    const path = new opentype.Path();
    let x = x0;
    for (const char of TAG) {
      const glyph = cormorant.charToGlyph(char);
      path.extend(glyph.getPath(x, y0, size));
      x += (glyph.advanceWidth * size) / cormorant.unitsPerEm + TRACKING * size;
    }
    return path;
  };
  const ref = place(100, 0, 0).getBoundingBox();
  // Largeur : 62 % de celle du mot, comme un sous-titre en capitales espacées
  const size = (100 * 0.62 * (word.x2 - word.x1) * STRETCH) / (ref.x2 - ref.x1);
  const k = size / 100;
  const [right, top] = toLogo(508, 168);
  const tag = place(size, right - ref.x2 * k, top - ref.y1 * k);
  const h = Math.ceil(top + (ref.y2 - ref.y1) * k + PAD);
  await writeFile(
    'src/assets/brand/logo.svg',
    svg(wordW, h, `${wordPath}<path fill="${COLORS.gold}" d="${compactGlyphs(tag)}"/>`, 'Seoul Restaurant Coréen'),
  );
}

/* ───────────────────────────── 2. Icônes et partage ───────────────────────────── */

// Monogramme : le « S » du logo, centré dans un carré de 100
const monogramSvg = (label) => {
  const s = [trace[0]];
  const b = bounds(s);
  const w = (b.x2 - b.x1) * STRETCH;
  const h = b.y2 - b.y1;
  const scale = 84 / Math.max(w, h);
  const ox = (100 - w * scale) / 2;
  const oy = (100 - h * scale) / 2;
  const d = toPath(s, (x, y) => [(x - b.x1) * STRETCH * scale + ox, (y - b.y1) * scale + oy]);
  return svg(100, 100, `<path fill="${COLORS.gold}" d="${d}"/>`, label);
};
const monogram = Buffer.from(monogramSvg(''));

async function icon(size, { padding, background = COLORS.ink, radius = 0 }) {
  const inner = Math.round(size * (1 - padding * 2));
  const glyph = await sharp(monogram, { density: 72 * (inner / 100) * 2 }).resize(inner, inner).png().toBuffer();
  const layers = [{ input: glyph, gravity: 'centre' }];
  if (radius) {
    layers.push({
      input: Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}"/></svg>`),
      blend: 'dest-in',
    });
  }
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const icons = {
  'icons/favicon-32.png': await icon(32, { padding: 0.04, radius: 6 }),
  'icons/apple-touch-icon.png': await icon(180, { padding: 0.16 }),
  'icons/icon-192.png': await icon(192, { padding: 0.16, radius: 40 }),
  'icons/icon-512.png': await icon(512, { padding: 0.16, radius: 104 }),
  'icons/icon-maskable-512.png': await icon(512, { padding: 0.26 }),
};
for (const [path, buffer] of Object.entries(icons)) await writeFile(`public/${path}`, buffer);

// favicon.svg : « S » or sur fond d'encre arrondi (lisible sur les onglets clairs comme sombres)
await writeFile(
  'public/icons/favicon.svg',
  monogramSvg('Seoul').replace('<path', `<rect width="100" height="100" rx="18" fill="${COLORS.ink}"/><path`),
);

// favicon.ico : PNG encapsulé dans un conteneur ICO
{
  const png = icons['icons/favicon-32.png'];
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile('public/favicon.ico', Buffer.concat([header, png]));
}

/* ───────────────────────────── 3. Étalonnage des photos ───────────────────────────── */

const ORIGINALS = 'src/assets/images/_originals';

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? listImages(join(dir, e.name)) : /\.(jpe?g|png|webp)$/i.test(e.name) ? [join(dir, e.name)] : [])),
  );
  return files.flat();
}

/** Grain argentique : bruit gris neutre, appliqué en lumière douce. */
function grain(width, height, amount = 18) {
  const data = Buffer.alloc(width * height);
  for (let i = 0; i < data.length; i++) data[i] = 128 + Math.round((Math.random() - 0.5) * 2 * amount);
  return sharp(data, { raw: { width, height, channels: 1 } }).toColourspace('srgb').png().toBuffer();
}

async function grade(source, target) {
  const { width, height } = await sharp(source).metadata();
  const vignette = Buffer.from(
    `<svg width="${width}" height="${height}"><defs><radialGradient id="v" cx="50%" cy="46%" r="72%">
      <stop offset="45%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/></svg>`,
  );
  await sharp(source)
    // Tons chauds : on relève légèrement le rouge, on retire du bleu
    .recomb([
      [1.04, 0.04, 0],
      [0.01, 0.98, 0.01],
      [0, 0.03, 0.85],
    ])
    // Contraste un peu plus dense, noirs profonds
    .linear(1.05, -8)
    .modulate({ brightness: 0.95, saturation: 0.96 })
    .composite([
      { input: vignette, blend: 'over' },
      { input: await grain(width, height), blend: 'soft-light' },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(target);
}

if (withPhotos) {
  for (const source of await listImages(ORIGINALS)) {
    const target = join('src/assets/images', relative(ORIGINALS, source));
    await mkdir(dirname(target), { recursive: true });
    await grade(source, target);
  }
}

// Image de partage 1200 × 630 : photo étalonnée assombrie + logo complet
{
  const logo = await sharp('src/assets/brand/logo.svg', { density: 300 }).resize({ width: 660 }).png().toBuffer();
  const shade = Buffer.from(
    `<svg width="1200" height="630"><defs><radialGradient id="g" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${COLORS.ink}" stop-opacity="0.74"/>
      <stop offset="100%" stop-color="${COLORS.ink}" stop-opacity="0.95"/></radialGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/></svg>`,
  );
  await sharp('src/assets/images/food/bbq.jpg')
    .resize(1200, 630, { fit: 'cover' })
    .composite([{ input: shade }, { input: logo, gravity: 'centre' }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/og-image.jpg');
}

console.log(
  withPhotos
    ? 'Identité visuelle générée : logo, icônes, image de partage et photos étalonnées.'
    : 'Identité visuelle générée : logo, icônes et image de partage (photos inchangées).',
);
