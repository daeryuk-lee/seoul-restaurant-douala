/**
 * Chargeur de la scène 3D : ne télécharge Three.js que si l'appareil s'y prête
 * (WebGL disponible, pas d'économie de données). Si l'utilisateur a demandé de réduire
 * les animations, la scène est rendue en image fixe.
 * et seulement une fois la page affichée. Sinon, la photo reste en place.
 */
const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-scene]');
const hero = canvas?.closest<HTMLElement>('[data-hero]');

const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
const stillScene = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canRender = () => {
  if (connection?.saveData) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
};

if (canvas && hero && canRender()) {
  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    interactions.forEach((type) => window.removeEventListener(type, load));
    import('./hero-scene')
      .then(({ startHeroScene }) => startHeroScene(canvas, () => (hero.dataset.scene = 'ready'), { still: stillScene }))
      .catch(() => {
        /* En cas d'échec, la photo reste affichée */
      });
  };

  // La page s'affiche et devient utilisable d'abord (photo en place) ; la 3D démarre
  // dès la première interaction, sinon quelques secondes après le chargement complet.
  const interactions = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'] as const;
  interactions.forEach((type) => window.addEventListener(type, load, { once: true, passive: true }));
  const whenIdle = () =>
    setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 2000 }) : load()), 5000);
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}
