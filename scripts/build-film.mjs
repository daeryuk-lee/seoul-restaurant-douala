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

const video = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const replace = process.argv.includes('--remplacer');
if (!video) {
  console.error('Usage : npm run film -- chemin/vers/video.mp4');
  process.exit(1);
}

const CONFIG = 'src/data/film.json';
const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const { version, step, landscape, portrait, shots } = config;

const out = join('public/film', version);
if (existsSync(out) && !replace) {
  console.error(`Le dossier ${out} existe déjà : changez « version » dans ${CONFIG} (par exemple "v2").`);
  process.exit(1);
}

// Images retenues dans chaque plan : une sur « step », la dernière toujours
const picksByShot = shots.map((shot) => {
  const picks = [];
  for (let n = shot.from; n <= shot.to; n += step) picks.push(n);
  if (picks.at(-1) !== shot.to) picks.push(shot.to);
  return picks;
});
const needed = [...new Set(picksByShot.flat())].sort((a, b) => a - b);

const tmp = mkdtempSync(join(tmpdir(), 'seoul-film-'));
try {
  // 1. Extraction des seules images retenues, réduites à la hauteur utile (PNG sans perte).
  //    ffmpeg les numérote dans l'ordre : le fichier k correspond à needed[k].
  const height = Math.max(landscape.height, portrait.height);
  try {
    execFileSync(
      'ffmpeg',
      [
        '-v', 'error',
        '-i', video,
        '-vf', `select='${needed.map((n) => `eq(n,${n})`).join('+')}',scale=w=-2:h='min(ih,${height})'`,
        '-vsync', '0',
        '-start_number', '0',
        join(tmp, '%04d.png'),
      ],
      { stdio: 'inherit' },
    );
  } catch {
    throw new Error('ffmpeg est introuvable ou la vidéo est illisible.');
  }
  const extracted = readdirSync(tmp).length;
  if (extracted < needed.length) {
    throw new Error(`La vidéo est trop courte : film.json demande des images jusqu'à la n° ${needed.at(-1)}, seules ${extracted} des ${needed.length} images retenues existent.`);
  }
  const fileOf = new Map(needed.map((n, k) => [n, join(tmp, `${String(k).padStart(4, '0')}.png`)]));

  // 2. Encodage, plan par plan (les anciennes versions sont retirées : plus aucune page n'y renvoie)
  rmSync('public/film', { recursive: true, force: true });
  await mkdir(join(out, 'd'), { recursive: true });
  await mkdir(join(out, 'm'), { recursive: true });

  const meta = await sharp(fileOf.get(needed[0])).metadata();
  const ranges = [];
  const bytes = { d: 0, m: 0 };
  let index = 0;

  for (const [s, shot] of shots.entries()) {
    const picks = picksByShot[s];
    const first = index;

    for (const [k, n] of picks.entries()) {
      const source = fileOf.get(n);
      const name = `${String(index).padStart(3, '0')}.webp`;

      // Paysage : léger renfort de netteté
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

  // 3. Plages recalculées dans film.json
  writeFileSync(
    CONFIG,
    JSON.stringify({ ...config, frames: index, ranges }, null, 2).replace(/\[\n\s+([\d.]+),\n\s+([\d.]+)\n\s+\]/g, '[$1, $2]') + '\n',
  );

  const mb = (n) => (n / 1048576).toFixed(1).replace('.', ',');
  console.log(`Film « ${version} » : ${index} images — paysage ${mb(bytes.d)} Mo, portrait ${mb(bytes.m)} Mo.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
