/**
 * Film défilant de la page d'accueil — découpe une vidéo en images WebP selon src/data/film.json.
 *
 *  - public/film/<version>/d/NNN.webp : format paysage (ordinateurs, tablettes à l'horizontale) ;
 *  - public/film/<version>/m/NNN.webp : recadrage portrait centré sur le plat (téléphones) ;
 *  - poster.jpg dans chaque dossier : première image en JPEG, pour les navigateurs sans WebP.
 *
 * Une image sur « step » est conservée dans chaque plan (la dernière toujours), puis film.json
 * reçoit le nombre d'images et la plage de chaque plan. Nécessite ffmpeg.
 *
 * Usage : npm run film -- chemin/vers/video.mp4
 * Changer « version » dans film.json à chaque nouvelle vidéo : les navigateurs gardent les images
 * d'une version en cache pendant un an, une version publiée ne doit donc jamais être réécrite.
 * (--remplacer : réécrire quand même la version, uniquement si elle n'a jamais été mise en ligne.)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const video = process.argv[2];
if (!video) {
  console.error('Usage : npm run film -- chemin/vers/video.mp4');
  process.exit(1);
}

const CONFIG = 'src/data/film.json';
const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const { version, step, landscape, portrait, shots } = config;

const out = join('public/film', version);
if (existsSync(out) && !process.argv.includes('--remplacer')) {
  console.error(`Le dossier ${out} existe déjà : changez « version » dans ${CONFIG} (par exemple "v2").`);
  process.exit(1);
}

// 1. Toutes les images de la vidéo, en PNG sans perte
const tmp = mkdtempSync(join(tmpdir(), 'seoul-film-'));
try {
  execFileSync('ffmpeg', ['-v', 'error', '-i', video, '-vsync', '0', '-start_number', '0', join(tmp, '%04d.png')], {
    stdio: 'inherit',
  });
} catch {
  console.error('ffmpeg est introuvable ou la vidéo est illisible.');
  process.exit(1);
}
const available = readdirSync(tmp).length;
const last = Math.max(...shots.map((s) => s.to));
if (last >= available) {
  console.error(`La vidéo compte ${available} images, mais film.json en demande jusqu'à la n° ${last}.`);
  process.exit(1);
}

// 2. Images retenues, plan par plan (les anciennes versions sont retirées : plus aucune page n'y renvoie)
rmSync('public/film', { recursive: true, force: true });
await mkdir(join(out, 'd'), { recursive: true });
await mkdir(join(out, 'm'), { recursive: true });

const meta = await sharp(join(tmp, '0000.png')).metadata();
const ranges = [];
let index = 0;
let bytes = { d: 0, m: 0 };

for (const shot of shots) {
  const picks = [];
  for (let n = shot.from; n <= shot.to; n += step) picks.push(n);
  if (picks.at(-1) !== shot.to) picks.push(shot.to);
  const first = index;

  for (const [k, n] of picks.entries()) {
    const source = join(tmp, `${String(n).padStart(4, '0')}.png`);
    const name = `${String(index).padStart(3, '0')}.webp`;

    // Paysage : léger renfort de netteté (la source est en 720p)
    const d = await sharp(source)
      .resize(landscape.width, landscape.height, { fit: 'cover' })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: landscape.quality, effort: 5 })
      .toFile(join(out, 'd', name));

    // Portrait : fenêtre pleine hauteur, centrée sur le plat (point focal interpolé dans le plan)
    const t = picks.length > 1 ? k / (picks.length - 1) : 0;
    const focus = shot.focus[0] + (shot.focus[1] - shot.focus[0]) * t;
    const cropW = Math.round((meta.height * portrait.width) / portrait.height);
    const left = Math.max(0, Math.min(meta.width - cropW, Math.round(focus * meta.width - cropW / 2)));
    const m = await sharp(source)
      .extract({ left, top: 0, width: cropW, height: meta.height })
      .resize(portrait.width, portrait.height)
      .sharpen({ sigma: 0.6 })
      .webp({ quality: portrait.quality, effort: 5 })
      .toFile(join(out, 'm', name));

    // Affiches JPEG de secours (première image)
    if (index === 0) {
      await sharp(join(out, 'd', name)).jpeg({ quality: 78, mozjpeg: true }).toFile(join(out, 'd', 'poster.jpg'));
      await sharp(join(out, 'm', name)).jpeg({ quality: 78, mozjpeg: true }).toFile(join(out, 'm', 'poster.jpg'));
    }

    bytes.d += d.size;
    bytes.m += m.size;
    index++;
  }
  ranges.push([first, index - 1]);
}
rmSync(tmp, { recursive: true, force: true });

// 3. Plages recalculées dans film.json
writeFileSync(CONFIG, JSON.stringify({ ...config, frames: index, ranges }, null, 2).replace(/\[\n\s+([\d.]+),\n\s+([\d.]+)\n\s+\]/g, '[$1, $2]') + '\n');

const mb = (n) => (n / 1048576).toFixed(1).replace('.', ',');
console.log(`Film « ${version} » : ${index} images — paysage ${mb(bytes.d)} Mo, portrait ${mb(bytes.m)} Mo.`);
