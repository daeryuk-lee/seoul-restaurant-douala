/**
 * Identité visuelle de Seoul — génère toutes les ressources de marque de façon reproductible.
 *
 *  1. Logo vectoriel (src/assets/brand/*.svg) : sceau coréen (dojang) gravé « 서울 »
 *     + mot-symbole « SEOUL ». Les lettres sont converties en tracés à partir de polices
 *     libres (licence OFL, voir scripts/fonts/) : aucune police n'est nécessaire à l'affichage.
 *  2. Icônes (favicon, Apple, PWA) et image de partage Open Graph (public/).
 *  3. Étalonnage uniforme des photos : src/assets/images/_originals/** → src/assets/images/**
 *     (lumière basse et chaude, noirs profonds, vignettage, grain argentique).
 *
 * Usage : npm run brand
 * Pour remplacer une photo : déposer la nouvelle image dans _originals/ sous le même nom, puis relancer.
 */
import { readFileSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';

const COLORS = {
  ink: '#0b0a09',
  seal: '#a8322a',
  sealInk: '#f4e9d4',
  gold: '#d4b06a',
};

const loadFont = (path) => {
  const buffer = readFileSync(path);
  return opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
};
const hangulFont = loadFont('scripts/fonts/SongMyung-Regular.ttf');
const latinFont = loadFont('scripts/fonts/CormorantGaramond.ttf');

await mkdir('src/assets/brand', { recursive: true });
await mkdir('public/icons', { recursive: true });

/* ───────────────────────────── 1. Logo vectoriel ───────────────────────────── */

/** Tracé d'une chaîne, avec interlettrage, recadré pour tenir dans une boîte (x, y, w, h). */
function fitText(font, text, box, { tracking = 0, align = 'center' } = {}) {
  const size = 1000;
  let x = 0;
  const glyphPaths = [];
  for (const char of text) {
    const glyph = font.charToGlyph(char);
    glyphPaths.push(glyph.getPath(x, 0, size));
    x += (glyph.advanceWidth * size) / font.unitsPerEm + tracking * size;
  }
  const merged = new opentype.Path();
  glyphPaths.forEach((p) => merged.extend(p));
  const bb = merged.getBoundingBox();
  const scale = Math.min(box.w / (bb.x2 - bb.x1), box.h / (bb.y2 - bb.y1));
  const w = (bb.x2 - bb.x1) * scale;
  const h = (bb.y2 - bb.y1) * scale;
  const offsetX = box.x + (align === 'center' ? (box.w - w) / 2 : 0) - bb.x1 * scale;
  const offsetY = box.y + (box.h - h) / 2 - bb.y1 * scale;

  const out = new opentype.Path();
  for (const cmd of merged.commands) {
    const t = { ...cmd };
    for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) {
      if (kx in t) {
        t[kx] = t[kx] * scale + offsetX;
        t[ky] = t[ky] * scale + offsetY;
      }
    }
    out.commands.push(t);
  }
  return { d: out.toPathData(2), width: w, height: h };
}

/** Sceau carré de 100 × 100 : fond vermillon, filet intérieur, « 서 » au-dessus de « 울 ». */
function sealGroup(x, y, size) {
  const s = size / 100;
  const seo = fitText(hangulFont, '서', { x: 18, y: 12, w: 64, h: 36 });
  const ul = fitText(hangulFont, '울', { x: 18, y: 53, w: 64, h: 36 });
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect class="logo-seal" width="100" height="100" rx="7" fill="${COLORS.seal}"/>
    <rect class="logo-seal-ink" x="6" y="6" width="88" height="88" rx="4" fill="none" stroke="${COLORS.sealInk}" stroke-width="1.6"/>
    <path class="logo-seal-ink" fill="${COLORS.sealInk}" d="${seo.d}"/>
    <path class="logo-seal-ink" fill="${COLORS.sealInk}" d="${ul.d}"/>
  </g>`;
}

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${body}</svg>\n`;

// Mot-symbole « SEOUL » : capitales de Cormorant Garamond, largement espacées
const WORD_H = 46;
const word = fitText(latinFont, 'SEOUL', { x: 0, y: 0, w: 1000, h: WORD_H }, { tracking: 0.32, align: 'left' });

// Horizontal : sceau à gauche, mot-symbole à droite (en-tête, pied de page)
{
  const seal = 100;
  const gap = 34;
  const w = Math.ceil(seal + gap + word.width);
  const wordY = (seal - WORD_H) / 2;
  const wordPath = fitText(latinFont, 'SEOUL', { x: seal + gap, y: wordY, w: word.width, h: WORD_H }, { tracking: 0.32, align: 'left' });
  await writeFile(
    'src/assets/brand/logo-horizontal.svg',
    svg(w, seal, `${sealGroup(0, 0, seal)}<path class="logo-word" fill="${COLORS.gold}" d="${wordPath.d}"/>`, 'Seoul'),
  );
}

// Empilé : sceau au-dessus du mot-symbole (page d'accueil, image de partage)
{
  const seal = 120;
  const w = Math.ceil(Math.max(seal, word.width * 1.35));
  const wordW = word.width * 1.35;
  const wordH = WORD_H * 1.35;
  const top = seal + 44;
  const wordPath = fitText(latinFont, 'SEOUL', { x: (w - wordW) / 2, y: top, w: wordW, h: wordH }, { tracking: 0.32 });
  await writeFile(
    'src/assets/brand/logo-stacked.svg',
    svg(w, Math.ceil(top + wordH), `${sealGroup((w - seal) / 2, 0, seal)}<path class="logo-word" fill="${COLORS.gold}" d="${wordPath.d}"/>`, 'Seoul'),
  );
}

// Sceau seul (icônes)
await writeFile('src/assets/brand/seal.svg', svg(100, 100, sealGroup(0, 0, 100), '서울'));

/* ───────────────────────────── 2. Icônes et partage ───────────────────────────── */

const sealSvg = Buffer.from(svg(100, 100, sealGroup(0, 0, 100), ''));

async function icon(size, { padding, background = COLORS.ink, radius = 0 }) {
  const inner = Math.round(size * (1 - padding * 2));
  const glyph = await sharp(sealSvg, { density: 72 * (inner / 100) * 2 }).resize(inner, inner).png().toBuffer();
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

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const icons = {
  'icons/favicon-32.png': await icon(32, { padding: 0.03, background: transparent }),
  'icons/apple-touch-icon.png': await icon(180, { padding: 0.18 }),
  'icons/icon-192.png': await icon(192, { padding: 0.16, radius: 40 }),
  'icons/icon-512.png': await icon(512, { padding: 0.16, radius: 104 }),
  'icons/icon-maskable-512.png': await icon(512, { padding: 0.26 }),
};
for (const [path, buffer] of Object.entries(icons)) await writeFile(`public/${path}`, buffer);
await writeFile('public/icons/favicon.svg', svg(100, 100, sealGroup(0, 0, 100), 'Seoul'));

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
      <stop offset="100%" stop-color="#000" stop-opacity="0.62"/></radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/></svg>`,
  );
  await sharp(source)
    // Tons chauds : on relève légèrement le rouge, on retire du bleu
    .recomb([
      [1.04, 0.04, 0],
      [0.01, 0.98, 0.01],
      [0, 0.03, 0.85],
    ])
    // Contraste plus dense, noirs profonds
    .linear(1.1, -16)
    .modulate({ brightness: 0.86, saturation: 0.9 })
    .composite([
      { input: vignette, blend: 'over' },
      { input: await grain(width, height), blend: 'soft-light' },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(target);
}

for (const source of await listImages(ORIGINALS)) {
  const target = join('src/assets/images', relative(ORIGINALS, source));
  await mkdir(dirname(target), { recursive: true });
  await grade(source, target);
}

// Image de partage 1200 × 630 : photo étalonnée assombrie + logo empilé
{
  const logo = await sharp('src/assets/brand/logo-stacked.svg', { density: 220 }).resize({ height: 300 }).png().toBuffer();
  const shade = Buffer.from(
    `<svg width="1200" height="630"><defs><radialGradient id="g" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${COLORS.ink}" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="${COLORS.ink}" stop-opacity="0.95"/></radialGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/></svg>`,
  );
  await sharp('src/assets/images/food/bbq.jpg')
    .resize(1200, 630, { fit: 'cover' })
    .composite([{ input: shade }, { input: logo, gravity: 'centre' }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/og-image.jpg');
}

console.log('Identité visuelle générée : logo, icônes, image de partage et photos étalonnées.');
