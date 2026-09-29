/**
 * Carte : met en évidence la rubrique en cours de lecture dans la navigation collante
 * et fait défiler l'onglet actif dans le champ visible (mobile).
 */
const nav = document.querySelector<HTMLElement>('[data-menu-nav]');
const sections = [...document.querySelectorAll<HTMLElement>('[data-menu-section]')];

if (nav && sections.length) {
  const list = nav.querySelector('ul');
  const links = new Map(
    [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) => [a.hash.slice(1), a]),
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeId: string | null = null;
  let ticking = false;

  const setActive = (id: string | null) => {
    if (id === activeId) return;
    activeId = id;
    links.forEach((link, key) => {
      if (key !== id) {
        link.removeAttribute('aria-current');
        return;
      }
      link.setAttribute('aria-current', 'true');
      if (list) {
        const left = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
        list.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  };

  // Rubrique active : la dernière dont le haut a franchi le tiers supérieur de l'écran
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.35;
    const current = sections.filter((s) => s.getBoundingClientRect().top <= line).pop();
    setActive(current?.id ?? null);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}
