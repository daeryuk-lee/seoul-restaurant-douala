/**
 * Film défilant de la page d'accueil (voir src/components/HomeFilm.astro).
 *
 * La vidéo des plats est découpée en images WebP (npm run film) : le défilement choisit l'image
 * à dessiner dans le <canvas>, avec un fondu enchaîné entre deux plans et un léger amorti.
 * Les images arrivent progressivement pour ménager les forfaits mobiles : une par plan d'abord,
 * puis, dès que le visiteur fait défiler, celles qui entourent la position de lecture.
 * L'affiche fixe reste en place sans JavaScript, en mode « animations réduites » ou
 * « économie de données ».
 */

type Shot = { range: [number, number]; scroll: number; chapter: number; focus: [number, number] };
type FilmData = { base: string; frames: number; sizes: Record<'d' | 'm', [number, number]>; shots: Shot[] };
type SetName = 'd' | 'm';
type Connection = { saveData?: boolean; effectiveType?: string; downlink?: number };

/** Part de chaque plan consacrée au fondu vers le suivant. */
const FADE = 0.22;
const PARALLEL = 4;

const root = document.documentElement;
const film = document.querySelector<HTMLElement>('section[data-film]');
const connection = (navigator as Navigator & { connection?: Connection }).connection;
const lowData = Boolean(connection?.saveData) || /2g$/.test(connection?.effectiveType ?? '');

if (film && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Économie de données, ou fenêtre trop basse pour tenir une légende (fort zoom) : affiche fixe
  // (la hauteur du film, prévue par la feuille de style, est retirée)
  if (lowData || innerHeight < 320) film.dataset.mode = 'still';
  else start(film);
}

function start(film: HTMLElement) {
  // Navigateur sans WebP (il a choisi l'affiche JPEG) : le film ne pourrait pas s'afficher
  const poster = film.querySelector<HTMLImageElement>('.film__poster img');
  if (poster?.currentSrc.endsWith('.jpg')) {
    film.dataset.mode = 'still';
    return;
  }
  const data = JSON.parse(film.dataset.film ?? '{}') as FilmData;
  const stage = film.querySelector<HTMLElement>('.film__stage');
  const canvas = film.querySelector<HTMLCanvasElement>('.film__canvas');
  const ctx = canvas?.getContext('2d', { alpha: false });
  const bar = film.querySelector<HTMLElement>('.film__progress i');
  const shots = data.shots;
  if (!stage || !canvas || !ctx || !bar || !shots?.length) return;

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const smooth = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const pad = (i: number) => String(i).padStart(3, '0');
  const coarse = matchMedia('(pointer: coarse)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  /* ── Frise : position de chaque plan et de chaque rubrique, en hauteurs d'écran ── */
  const starts: number[] = [];
  let total = 0;
  for (const shot of shots) {
    starts.push(total);
    total += shot.scroll;
  }
  const chapterCount = Math.max(...shots.map((s) => s.chapter)) + 1;
  const chapters = Array.from({ length: chapterCount }, (_, c) => {
    const ks = shots.flatMap((s, k) => (s.chapter === c ? [k] : []));
    const a = starts[ks[0] ?? 0] ?? 0;
    const lastK = ks[ks.length - 1] ?? 0;
    const b = (starts[lastK] ?? 0) + (shots[lastK]?.scroll ?? 0);
    return { a, b, len: b - a };
  });
  const lastChapter = chapterCount - 1;

  /* ── Légendes : fenêtres d'apparition et de disparition sur la frise ── */
  type Card = { el: HTMLElement; w: [number, number, number | null, number | null]; o: number };
  const cards: Card[] = [...film.querySelectorAll<HTMLElement>('[data-card]')].map((el) => {
    const intro = el.dataset.card === 'intro';
    const c = intro ? 0 : Number(el.dataset.card);
    const { a, b, len } = chapters[c] ?? { a: 0, b: 0, len: 1 };
    let w: Card['w'];
    if (intro) w = [-2, -1, a + 0.16 * len, a + 0.32 * len];
    else if (c === 0) w = [a + 0.48 * len, a + 0.62 * len, b - 0.24 * len, b - 0.1 * len];
    else if (c === lastChapter) w = [a + 0.2 * len, a + 0.45 * len, null, null];
    else w = [a + 0.12 * len, a + 0.3 * len, b - 0.3 * len, b - 0.12 * len];
    el.hidden = false;
    return { el, w, o: -1 };
  });

  const navButtons = [...film.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  film.querySelectorAll<HTMLElement>('.film__chapters, .film__skip, .film__progress').forEach((el) => (el.hidden = false));
  film.dataset.mode = 'film';

  /* ── Chargement progressif des images ── */
  const pickSet = (): SetName => (innerWidth / innerHeight <= 1 ? 'm' : 'd');
  let set = pickSet();
  const cache: Record<SetName, (HTMLImageElement | undefined)[]> = { d: [], m: [] };
  const requested: Record<SetName, Set<number>> = { d: new Set(), m: new Set() };
  const keyframes = shots.map((s) => s.range[0]);
  const isKeyframe = (i: number) => keyframes.includes(i);
  const AHEAD = coarse ? 28 : 40;
  const BEHIND = 8;
  // Images gardées en mémoire (une image portrait décodée pèse environ 1,6 Mo) : toujours plus
  // que la fenêtre de chargement, pour ne jamais libérer une image qui vient d'être demandée
  const KEEP = coarse || memory <= 4 ? AHEAD + BEHIND + 16 : data.frames;
  // Tout le film d'avance seulement sur ordinateur réellement bien connecté (10 Mbit/s annoncés)
  // et s'il peut le garder entièrement en mémoire
  const eager = !coarse && (connection?.downlink ?? 0) >= 10 && KEEP >= data.frames;
  const inWindow = (i: number) => i >= frameNow - BEHIND && i <= frameNow + AHEAD;
  let loading = 0;
  let failures = 0;
  let started = false;
  let engaged = false;
  let onScreen = true;
  let frameNow = 0;
  let shotNow = 0;
  let target = 0;
  let shown = 0;

  const next = (): number | undefined => {
    const done = requested[set];
    const free = (i: number) => i >= 0 && i < data.frames && !done.has(i);
    // 1. le plan en cours et le suivant, puis une image par plan
    for (const k of [shotNow, shotNow + 1]) {
      const i = keyframes[k];
      if (i !== undefined && free(i)) return i;
    }
    for (const i of keyframes) if (free(i)) return i;
    // 2. autour de la position de lecture, une fois que le visiteur fait défiler, tant que le film
    //    est à l'écran (pas pendant un saut rapide : ces images ne seraient jamais vues)
    if (!engaged || !onScreen || Math.abs(target - shown) > 0.6) return undefined;
    for (let d = 0; d <= AHEAD; d++) {
      if (free(frameNow + d)) return frameNow + d;
      if (d <= BEHIND && free(frameNow - d)) return frameNow - d;
    }
    // 3. le reste, si la connexion le permet
    if (eager) {
      for (const step of [8, 4, 2, 1]) for (let i = 0; i < data.frames; i += step) if (free(i)) return i;
    }
    return undefined;
  };

  /** Libère les images les plus éloignées de la fenêtre de lecture (téléphones modestes). */
  const evict = (name: SetName) => {
    const list = cache[name];
    const held = list.flatMap((img, i) => (img && !isKeyframe(i) ? [i] : []));
    if (held.length <= KEEP) return;
    const outside = held.filter((i) => !inWindow(i));
    const gap = (i: number) => (i < frameNow ? frameNow - BEHIND - i : i - frameNow - AHEAD);
    outside.sort((a, b) => gap(b) - gap(a));
    for (const i of outside.slice(0, held.length - KEEP)) {
      list[i] = undefined;
      requested[name].delete(i); // redemandée (depuis le cache du navigateur) si la lecture y revient
    }
  };

  const pump = () => {
    if (!started) return;
    while (loading < PARALLEL) {
      const i = next();
      if (i === undefined) return;
      const name = set;
      requested[name].add(i);
      loading++;
      const img = new Image();
      img.decoding = 'async';
      img.src = `${data.base}/${name}/${pad(i)}.webp`;
      const done = (ok: boolean) => {
        loading--;
        if (ok) {
          cache[name][i] = img;
          evict(name);
          if (name === set) request();
          pump();
        } else {
          // Erreur réseau passagère : l'image pourra être redemandée un peu plus tard
          failures++;
          if (failures <= 20) setTimeout(() => requested[name].delete(i), 4000);
          setTimeout(pump, 4000);
        }
      };
      img.addEventListener('load', () => img.decode().then(() => done(true), () => done(true)), { once: true });
      img.addEventListener('error', () => done(false), { once: true });
    }
  };

  // Après l'affichage de la page (ou dès le premier geste), pour ne pas retarder l'affiche
  const triggers = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
  const begin = () => {
    if (started) return;
    started = true;
    triggers.forEach((type) => removeEventListener(type, begin));
    pump();
  };
  triggers.forEach((type) => addEventListener(type, begin, { once: true, passive: true }));
  if (document.readyState === 'complete') setTimeout(begin, 300);
  else addEventListener('load', () => setTimeout(begin, 300), { once: true });

  /** Image la plus proche déjà chargée dans le même plan, au besoin dans l'autre format. */
  const nearest = (i: number, k: number, name: SetName) => {
    const [a, b] = shots[k]?.range ?? [0, 0];
    const list = cache[name];
    for (let d = 0; d <= b - a; d++) {
      if (i - d >= a && list[i - d]) return list[i - d];
      if (i + d <= b && list[i + d]) return list[i + d];
    }
    return undefined;
  };

  /* ── Dessin ── */
  let W = 0;
  let H = 0;
  const resize = () => {
    // Sur téléphone, la toile n'occupe qu'une fenêtre sous l'en-tête (voir HomeFilm.astro)
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    // Pas plus de détail que les images n'en contiennent : la toile reste proche de leur résolution
    const [sw, sh] = data.sizes[set];
    const density = 1 / Math.max(w / sw, h / sh);
    const dpr = Math.min(devicePixelRatio || 1, 2, Math.max(1, density * 1.5));
    W = Math.round(w * dpr);
    H = Math.round(h * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    ctx.imageSmoothingQuality = 'medium';
  };

  const switchSet = () => {
    const fresh = pickSet();
    if (fresh === set) return;
    const old = set;
    set = fresh;
    // L'ancien format ne garde que ses images clés, qui servent de relais le temps du chargement
    cache[old].forEach((img, i) => {
      if (img && !isKeyframe(i)) {
        cache[old][i] = undefined;
        requested[old].delete(i);
      }
    });
    pump();
  };

  const paint = (img: HTMLImageElement, alpha: number, focus: number) => {
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (W - w) * focus, (H - h) / 2, w, h);
  };

  /** Dessine le plan k à l'avancement u (0 → 1), en mêlant les deux images voisines. */
  const drawShot = (k: number, u: number, alpha: number) => {
    const shot = shots[k];
    if (!shot) return false;
    const [a, b] = shot.range;
    const f = u * (b - a);
    const i0 = a + Math.floor(f);
    const mix = f - Math.floor(f);
    const own = cache[set][i0] ?? nearest(i0, k, set);
    const img0 = own ?? nearest(i0, k, set === 'm' ? 'd' : 'm');
    if (!img0) return false;
    // Les images pour téléphones (carrées) sont déjà recadrées sur le plat
    const cropped = img0.naturalWidth <= img0.naturalHeight;
    const focus = cropped ? 0.5 : shot.focus[0] + (shot.focus[1] - shot.focus[0]) * u;
    paint(img0, alpha, focus);
    const img1 = own && i0 < b ? cache[set][i0 + 1] : undefined;
    if (img1 && mix > 0.02) paint(img1, alpha * mix, focus);
    return true;
  };

  let drawn = false;
  const draw = (T: number) => {
    let k = 0;
    while (k < shots.length - 1 && T >= (starts[k] ?? 0) + (shots[k]?.scroll ?? 0)) k++;
    const shot = shots[k];
    if (!shot) return;
    const u = clamp((T - (starts[k] ?? 0)) / shot.scroll, 0, 1);
    shotNow = k;
    frameNow = shot.range[0] + Math.round(u * (shot.range[1] - shot.range[0]));
    if (!drawShot(k, u, 1)) return;
    if (k < shots.length - 1 && u > 1 - FADE) drawShot(k + 1, 0, smooth(1 - FADE, 1, u));
    ctx.globalAlpha = 1;
    if (!drawn) {
      drawn = true;
      film.dataset.ready = '';
    }
  };

  /* ── Légendes et repères de chapitres ── */
  let current = -1;
  const render = (T: number) => {
    draw(T);
    pump();
    bar.style.transform = `scaleX(${(T / total).toFixed(4)})`;

    for (const card of cards) {
      const [a0, a1, b0, b1] = card.w;
      const fadeOut = b0 === null || b1 === null ? 0 : smooth(b0, b1, T);
      const o = Math.round(smooth(a0, a1, T) * (1 - fadeOut) * 100) / 100;
      if (o === card.o) continue;
      card.o = o;
      const legible = o > 0.5;
      card.el.style.opacity = String(o);
      card.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
      card.el.toggleAttribute('data-on', legible);
      if (card.el.dataset.card === 'intro') {
        // L'ouverture porte le titre principal de la page : elle reste lisible par les lecteurs
        // d'écran, mais ses boutons estompés sortent de l'ordre de tabulation
        card.el.querySelectorAll<HTMLElement>('a, button').forEach((el) => (legible ? el.removeAttribute('tabindex') : (el.tabIndex = -1)));
      } else {
        // Légende à peine visible : ni focus clavier invisible, ni lecture hors contexte
        card.el.style.visibility = legible ? 'visible' : 'hidden';
      }
    }

    let c = 0;
    while (c < lastChapter && T >= (chapters[c]?.b ?? 0) - 0.15 * (chapters[c]?.len ?? 0)) c++;
    if (c !== current) {
      current = c;
      navButtons.forEach((btn) => (Number(btn.dataset.goto) === c ? btn.setAttribute('aria-current', 'step') : btn.removeAttribute('aria-current')));
    }
  };

  /* ── Boucle : la position affichée rejoint en douceur la position de défilement ── */
  let raf = 0;
  let last = 0;

  const read = () => {
    const rect = film.getBoundingClientRect();
    const distance = rect.height - stage.offsetHeight;
    onScreen = rect.bottom > 0 && rect.top < innerHeight;
    // En-tête transparent seulement tant que le film est épinglé et occupe tout l'écran
    root.toggleAttribute('data-film-active', rect.top <= 1 && rect.bottom >= innerHeight - 1);
    return distance > 0 ? clamp(-rect.top / distance, 0, 1) * total : 0;
  };

  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    shown += (target - shown) * (1 - Math.exp(-dt / 0.085));
    if (Math.abs(target - shown) < 0.0006) shown = target;
    render(shown);
    if (shown !== target) raf = requestAnimationFrame(tick);
  };

  function request() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  const jump = (T: number) => {
    if (T > 0) engaged = true; // page rouverte ou rechargée au milieu du film
    target = shown = T;
    render(T);
  };

  addEventListener(
    'scroll',
    () => {
      const T = read();
      if (T > 0) engaged = true;
      if (T === target && T === shown) return; // film déjà dépassé ou immobile : rien à redessiner
      target = T;
      request();
    },
    { passive: true },
  );
  const observer = new ResizeObserver(() => {
    switchSet();
    resize();
    jump(read());
  });
  observer.observe(stage);
  observer.observe(canvas);
  // Retour arrière depuis une autre page (cache de navigation), onglet réaffiché, toile réinitialisée
  addEventListener('pageshow', (event) => event.persisted && jump(read()));
  document.addEventListener('visibilitychange', () => !document.hidden && jump(read()));
  canvas.addEventListener('contextrestored', () => jump(shown));

  navButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const c = Number(btn.dataset.goto);
      const chapter = chapters[c];
      if (!chapter) return;
      const T = c === 0 ? 0 : chapter.a + 0.42 * chapter.len;
      const distance = film.offsetHeight - stage.offsetHeight;
      scrollTo({ top: film.getBoundingClientRect().top + scrollY + (T / total) * distance, behavior: 'smooth' });
    }),
  );

  resize();
  jump(read());
}
