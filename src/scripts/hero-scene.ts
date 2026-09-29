/**
 * Scène 3D temps réel de la page d'accueil (Three.js / WebGL) : un barbecue coréen.
 * Grill rond en fonte au-dessus de braises rougeoyantes, poitrine de porc et bœuf mariné
 * qui grillent, fumée et étincelles, banchan dans des coupelles de céladon.
 * Tout est modélisé par le code (aucun fichier 3D à télécharger).
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  type Material,
  Matrix4,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  Scene,
  ShaderMaterial,
  ShadowMaterial,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const GOLD = new Color('#d8b36a');

/** Bruit fractal partagé par les shaders de braises et de fumée. */
const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }`;

/** Rend la main au navigateur entre deux étapes d’initialisation (évite les tâches longues). */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function startHeroScene(canvas: HTMLCanvasElement, onReady: () => void, { still = false } = {}) {
  // Même règle que le CSS : écran vertical = la scène a sa propre zone sous le texte
  const portrait = window.matchMedia('(max-aspect-ratio: 23/20)');
  const host = canvas.parentElement!;
  const isSmall = () => canvas.clientWidth < 700;

  /* ── Rendu ── */
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall() ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !isSmall();
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 60);

  /* ── Lumières : éclairage bas et chaud, lueur des braises par en dessous ── */
  scene.add(new HemisphereLight('#3a2d20', '#050404', 0.5));

  const key = new SpotLight('#ffd9a3', 160, 0, MathUtils.degToRad(34), 0.75, 2);
  key.position.set(-3.2, 7.5, 3.5);
  key.target.position.set(0, 0.3, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.bias = -0.0004;
  key.shadow.radius = 6;
  scene.add(key, key.target);

  const rim = new DirectionalLight('#e8b865', 2.2);
  rim.position.set(4, 3, -5);
  scene.add(rim);

  const glaze = new DirectionalLight('#fff1dc', 1.2);
  glaze.position.set(-2, 4, 6);
  scene.add(glaze);

  const ember = new PointLight('#ff6a1f', 7, 4, 2);
  ember.position.set(0, 0.22, 0);
  scene.add(ember);

  /* ── Composition ── */
  const stage = new Group();
  scene.add(stage);
  const rand = mulberry32(11);
  const standard = (color: string, roughness = 0.45, metalness = 0) =>
    new MeshStandardMaterial({ color, roughness, metalness });

  // Table invisible : seule l'ombre portée apparaît sur la photo
  const table = new Mesh(new CircleGeometry(4.5, 64), new ShadowMaterial({ opacity: 0.55 }));
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  stage.add(table);

  // Grill : plat en fonte (profil de révolution)
  const iron = standard('#1b1917', 0.42, 0.75);
  const panProfile = [
    [0, 0.05], [1.2, 0.05], [1.55, 0.12], [1.72, 0.3], [1.8, 0.37], [1.76, 0.4],
    [1.62, 0.32], [1.28, 0.17], [0, 0.17],
  ].map(([r, y]) => new Vector2(r, y));
  const pan = new Mesh(new LatheGeometry(panProfile, 96), iron);
  pan.castShadow = true;
  pan.receiveShadow = true;
  stage.add(pan);

  // Anses latérales
  for (const side of [-1, 1]) {
    const handle = new Mesh(new TorusGeometry(0.2, 0.04, 10, 24, Math.PI), iron);
    handle.rotation.set(Math.PI / 2, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2);
    handle.position.set(side * 1.83, 0.33, 0);
    stage.add(handle);
  }

  // Braises : shader de bruit animé, rougeoiement vacillant visible à travers la grille
  const coalsMaterial = new ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uTime;
      ${NOISE_GLSL}
      void main() {
        vec2 p = vUv * 7.0;
        float n = fbm(p + vec2(uTime * 0.15, -uTime * 0.1));
        float cracks = smoothstep(0.45, 0.78, n);
        float flicker = 0.75 + 0.25 * sin(uTime * 3.0 + n * 12.0);
        vec3 charcoal = vec3(0.05, 0.03, 0.025);
        vec3 glow = mix(vec3(0.85, 0.12, 0.02), vec3(1.0, 0.55, 0.12), cracks);
        gl_FragColor = vec4(mix(charcoal, glow * 1.6, cracks * flicker), 1.0);
      }`,
  });
  const coals = new Mesh(new CircleGeometry(1.5, 64), coalsMaterial);
  coals.rotation.x = -Math.PI / 2;
  coals.position.y = 0.18;
  stage.add(coals);

  // Grille : barreaux parallèles et deux cercles, fusionnés en une seule géométrie
  const GRATE_Y = 0.33;
  const GRATE_R = 1.56;
  const bars: BufferGeometry[] = [];
  for (let z = -1.47; z <= 1.47; z += 0.135) {
    const length = 2 * Math.sqrt(GRATE_R * GRATE_R - z * z);
    const bar = new CylinderGeometry(0.017, 0.017, length, 6);
    bar.rotateZ(Math.PI / 2);
    bar.translate(0, GRATE_Y, z);
    bars.push(bar);
  }
  for (const [radius, tube] of [
    [GRATE_R, 0.032],
    [0.9, 0.02],
  ] as const) {
    const ring = new TorusGeometry(radius, tube, 8, 96);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, GRATE_Y, 0);
    bars.push(ring);
  }
  const grate = new Mesh(mergeGeometries(bars), standard('#2a2622', 0.35, 0.85));
  grate.castShadow = true;
  stage.add(grate);

  await nextFrame();

  // Poitrine de porc : couches de gras et de viande, marques de grill
  const fat = new MeshPhysicalMaterial({ color: '#c98f5c', roughness: 0.3, clearcoat: 0.7 });
  const lean = standard('#a8603f', 0.45);
  const sear = new MeshStandardMaterial({ color: '#4a2413', roughness: 0.6, transparent: true, opacity: 0.55 });
  const meatOnGrill = new Group();
  const layers = [
    [fat, 0.05],
    [lean, 0.07],
    [fat, 0.03],
    [lean, 0.06],
    [fat, 0.04],
  ] as const;
  const porkPlaces = [
    [-0.9, -0.62, 0.25], [-0.82, -0.12, 0.1], [-0.88, 0.38, -0.05], [-0.7, 0.86, 0.2],
    [-0.25, -0.95, 1.5], [-0.18, -0.3, 1.62], [-0.05, 0.4, 1.5],
  ];
  for (const [x, z, angle] of porkPlaces) {
    const slice = new Group();
    let offset = -0.125;
    for (const [material, width] of layers) {
      const layer = new Mesh(new BoxGeometry(0.82, 0.07, width), material);
      layer.position.z = offset + width / 2;
      offset += width;
      slice.add(layer);
    }
    for (const mark of [-0.2, 0.02, 0.24]) {
      const line = new Mesh(new BoxGeometry(0.05, 0.004, 0.25), sear);
      line.position.set(mark, 0.034, 0);
      slice.add(line);
    }
    slice.position.set(x!, GRATE_Y + 0.05, z!);
    slice.rotation.set((rand() - 0.5) * 0.08, angle!, (rand() - 0.5) * 0.06);
    meatOnGrill.add(slice);
  }

  // Bœuf mariné : tranches fines et ondulées, laquées
  const beef = new MeshPhysicalMaterial({ color: '#3e1a10', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const beefPlaces = [
    [0.7, -0.75, 0.4], [1.05, -0.2, -0.3], [0.95, 0.42, 0.9], [0.45, 0.02, 0.1], [0.45, 0.85, -0.5],
  ];
  for (const [x, z, angle] of beefPlaces) {
    const geometry = new BoxGeometry(0.62, 0.024, 0.36, 10, 1, 4);
    const position = geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      position.setY(i, position.getY(i) + Math.sin(position.getX(i) * 9) * 0.018 + Math.cos(position.getZ(i) * 7) * 0.01);
    }
    geometry.computeVertexNormals();
    const slice = new Mesh(geometry, beef);
    slice.position.set(x!, GRATE_Y + 0.04, z!);
    slice.rotation.y = angle!;
    meatOnGrill.add(slice);
  }

  // Ail et piment vert
  const garlic = standard('#f1e6c8', 0.4);
  const pepper = standard('#4f8a2c', 0.4);
  for (let i = 0; i < 7; i++) {
    const clove = new Mesh(new CylinderGeometry(0.055, 0.055, 0.018, 14), garlic);
    const a = rand() * Math.PI * 2;
    const r = 0.3 + rand() * 1.05;
    clove.position.set(Math.cos(a) * r, GRATE_Y + 0.03, Math.sin(a) * r);
    meatOnGrill.add(clove);
  }
  for (let i = 0; i < 5; i++) {
    const ring = new Mesh(new TorusGeometry(0.05, 0.018, 8, 20), pepper);
    const a = rand() * Math.PI * 2;
    const r = 0.4 + rand() * 0.9;
    ring.rotation.x = Math.PI / 2;
    ring.position.set(Math.cos(a) * r, GRATE_Y + 0.035, Math.sin(a) * r);
    meatOnGrill.add(ring);
  }
  bakeByMaterial(meatOnGrill);
  stage.add(meatOnGrill);

  // Banchan dans des coupelles de céladon
  const celadon = new MeshPhysicalMaterial({ color: '#93b5a0', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 });
  const cupProfile = [
    [0, 0.03], [0.22, 0.03], [0.24, 0], [0.3, 0], [0.32, 0.05], [0.42, 0.16], [0.47, 0.26],
    [0.44, 0.27], [0.4, 0.2], [0.3, 0.1], [0, 0.08],
  ].map(([r, y]) => new Vector2(r, y));
  const cupGeometry = new LatheGeometry(cupProfile, 48);
  const banchanGroup = new Group();
  const banchan = [
    // kimchi : feuilles de chou pimentées
    { x: -2.35, z: -0.95, color: '#9c3317', bits: '#d8663a', shape: () => new BoxGeometry(0.14, 0.02, 0.09) },
    // pousses de soja : tiges fines
    { x: -1.15, z: -2.2, color: '#cdbf8a', bits: '#f2e9c6', shape: () => new CylinderGeometry(0.011, 0.011, 0.2, 5) },
    // épinards assaisonnés
    { x: 1.2, z: -2.2, color: '#1f3f18', bits: '#3c6e2a', shape: () => new BoxGeometry(0.12, 0.015, 0.05) },
    // radis jaune mariné : bâtonnets
    { x: 2.4, z: -0.8, color: '#c9a334', bits: '#f0cf56', shape: () => new BoxGeometry(0.12, 0.05, 0.05) },
  ];
  for (const b of banchan) {
    const cup = new Group();
    const shell = new Mesh(cupGeometry, celadon);
    shell.castShadow = true;
    shell.receiveShadow = true;
    const filling = new Mesh(new SphereGeometry(0.38, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), standard(b.color, 0.55));
    filling.scale.y = 0.32;
    filling.position.y = 0.17;
    cup.add(shell, filling);
    const bitMaterial = standard(b.bits, 0.45);
    for (let i = 0; i < 34; i++) {
      const bit = new Mesh(b.shape(), bitMaterial);
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.33;
      const surface = 0.17 + 0.38 * 0.32 * Math.sqrt(Math.max(0, 1 - (r / 0.38) ** 2));
      bit.position.set(Math.cos(a) * r, surface + 0.012, Math.sin(a) * r);
      bit.scale.setScalar(1.35);
      bit.rotation.set((rand() - 0.5) * 0.6, rand() * Math.PI, (rand() - 0.5) * 0.6);
      cup.add(bit);
    }
    cup.position.set(b.x, 0, b.z);
    banchanGroup.add(cup);
  }
  bakeByMaterial(banchanGroup);
  stage.add(banchanGroup);

  // Feuilles de salade pour le ssam
  const lettuce = standard('#6aa343', 0.5);
  for (let i = 0; i < 3; i++) {
    const leafGeometry = new SphereGeometry(0.55, 32, 16);
    leafGeometry.scale(1, 0.14, 0.72);
    const lp = leafGeometry.attributes.position as BufferAttribute;
    for (let v = 0; v < lp.count; v++) {
      const x = lp.getX(v);
      const z = lp.getZ(v);
      lp.setY(v, lp.getY(v) + Math.sin(x * 16) * 0.035 + Math.cos(z * 13 + x * 6) * 0.03 + (x * x + z * z) * 0.12);
    }
    leafGeometry.computeVertexNormals();
    const leaf = new Mesh(leafGeometry, lettuce);
    leaf.position.set(2.35 + i * 0.12, 0.04 + i * 0.035, 0.75 + i * 0.1);
    leaf.rotation.y = 0.5 + i * 0.35;
    leaf.castShadow = true;
    stage.add(leaf);
  }

  // Baguettes dorées
  const goldMaterial = new MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.22 });
  const chopsticks = new Group();
  for (const offset of [-0.07, 0.07]) {
    const stick = new Mesh(new CylinderGeometry(0.016, 0.03, 2.6, 16), goldMaterial);
    stick.rotation.z = Math.PI / 2;
    stick.position.set(0, 0.03, offset);
    stick.castShadow = true;
    chopsticks.add(stick);
  }
  chopsticks.position.set(1.1, 0, 2.25);
  chopsticks.rotation.y = -0.3;
  stage.add(chopsticks);

  await nextFrame();

  /* ── Fumée : bruit fractal animé sur des plans croisés ── */
  const smokeMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.x += sin(uv.y * 3.0 + uTime * 0.6) * 0.25 * uv.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;
      ${NOISE_GLSL}
      void main() {
        vec2 uv = vUv;
        vec2 q = vec2(uv.x * 2.4, uv.y * 1.5 - uTime * 0.25);
        float n = fbm(q + fbm(q + uTime * 0.05));
        float wisps = smoothstep(0.4, 0.85, n);
        float horizontal = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
        float vertical = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.4, uv.y);
        float alpha = wisps * horizontal * vertical * uOpacity;
        gl_FragColor = vec4(vec3(0.95, 0.9, 0.84) * alpha, alpha);
      }`,
  });
  const smoke = new Group();
  for (let i = 0; i < 3; i++) {
    const plane = new Mesh(new PlaneGeometry(3.2, 3.8, 1, 24), smokeMaterial);
    plane.rotation.y = (i * Math.PI) / 3;
    smoke.add(plane);
  }
  smoke.position.y = GRATE_Y + 1.9;
  stage.add(smoke);

  /* ── Étincelles : particules qui s'élèvent du grill (calculées par la carte graphique) ── */
  const SPARKS = isSmall() ? 110 : 200;
  const seeds = new Float32Array(SPARKS * 4);
  for (let i = 0; i < SPARKS; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 1.5;
    seeds.set([Math.cos(a) * r, Math.sin(a) * r, rand(), rand()], i * 4);
  }
  const sparkGeometry = new BufferGeometry();
  sparkGeometry.setAttribute('position', new BufferAttribute(new Float32Array(SPARKS * 3), 3));
  sparkGeometry.setAttribute('aSeed', new BufferAttribute(seeds, 4));
  const sparkMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute vec4 aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vLife;
      varying float vTwinkle;
      void main() {
        float speed = 0.2 + aSeed.w * 0.4;
        float life = fract(aSeed.z + uTime * speed * 0.16);
        vec3 p = vec3(aSeed.x, 0.35 + life * 4.2, aSeed.y);
        p.x += sin(uTime * 0.9 + aSeed.z * 20.0) * 0.3 * life;
        p.z += cos(uTime * 0.7 + aSeed.w * 20.0) * 0.3 * life;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (10.0 + aSeed.w * 16.0) * uPixelRatio / -mv.z;
        vLife = life;
        vTwinkle = 0.6 + 0.4 * sin(uTime * 7.0 + aSeed.z * 50.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vLife;
      varying float vTwinkle;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = smoothstep(0.5, 0.0, d);
        float fade = smoothstep(0.0, 0.1, vLife) * smoothstep(1.0, 0.4, vLife);
        vec3 color = mix(vec3(1.0, 0.75, 0.35), vec3(1.0, 0.35, 0.1), vLife);
        gl_FragColor = vec4(color * glow, glow * fade * vTwinkle * uOpacity);
      }`,
  });
  const sparks = new Points(sparkGeometry, sparkMaterial);
  sparks.frustumCulled = false;
  stage.add(sparks);

  /* ── Cadrage adaptatif (d'après la taille réelle du canevas) ── */
  const layout = { x: 0, y: 0, scale: 1 };
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (!portrait.matches) {
      // Grand écran : le grill occupe la moitié droite, le texte la gauche
      camera.position.set(0, 6.4, 8.6);
      layout.x = Math.min(2.7, 1.2 * camera.aspect);
      layout.y = -0.2;
      layout.scale = 0.8;
    } else {
      // Téléphone : le canevas a sa propre zone sous le texte, le grill y est centré
      camera.position.set(0, 7.4, 8.2);
      layout.x = -0.25; // la salade et les baguettes alourdissent le côté droit : on recentre
      layout.y = -0.3;
      layout.scale = camera.aspect < 0.9 ? 0.72 : 0.86;
    }
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(() => {
    resize();
    if (still) frame(0);
  }).observe(canvas);

  /* ── Interaction : pointeur et défilement ── */
  const pointer = new Vector2();
  const eased = new Vector2();
  window.addEventListener(
    'pointermove',
    (e) => pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1),
    { passive: true },
  );
  let scroll = 0;
  window.addEventListener('scroll', () => (scroll = Math.min(1, window.scrollY / host.clientHeight)), { passive: true });

  /* ── Boucle d'animation (en pause hors écran ou onglet masqué) ── */
  const start = performance.now();
  let visible = true;
  let ready = false;

  function frame(now: number) {
    // En image fixe : état final de l'introduction, instant figé
    const t = still ? 4 : (now - start) / 1000;
    const intro = still ? 1 : easeOutCubic(Math.min(1, t / 2.2));

    eased.lerp(pointer, 0.05);
    stage.position.set(layout.x, layout.y - (1 - intro) * 0.8 + scroll * 1.2, 0);
    stage.scale.setScalar(layout.scale * (0.9 + intro * 0.1));
    stage.rotation.set(eased.y * 0.06, (portrait.matches ? -0.1 : -0.25) + eased.x * 0.25 + scroll * 0.5 + Math.sin(t * 0.15) * 0.08, 0);

    // La viande « grésille » : infimes frémissements
    meatOnGrill.position.y = Math.sin(t * 40) * 0.0015;
    ember.intensity = 6 + Math.sin(t * 5.3) * 1.2 + Math.sin(t * 13.7) * 0.6;

    coalsMaterial.uniforms.uTime!.value = t;
    smokeMaterial.uniforms.uTime!.value = t;
    smokeMaterial.uniforms.uOpacity!.value = intro * 0.6;
    sparkMaterial.uniforms.uTime!.value = t;
    sparkMaterial.uniforms.uOpacity!.value = intro;
    smoke.quaternion.copy(camera.quaternion);

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady();
    }
  }

  // Compilation des shaders sans bloquer la page (KHR_parallel_shader_compile si disponible)
  await renderer.compileAsync(scene, camera);
  await nextFrame();

  if (still) {
    frame(0);
    return;
  }

  const sync = () => renderer.setAnimationLoop(visible && !document.hidden ? frame : null);
  new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  sync();
}

/**
 * Fusionne tous les maillages d'un groupe qui partagent la même matière :
 * même rendu, mais quelques appels de dessin au lieu de plusieurs centaines.
 */
function bakeByMaterial(group: Group) {
  group.updateMatrixWorld(true);
  const toGroup = group.matrixWorld.clone().invert();
  const buckets = new Map<Material, BufferGeometry[]>();
  group.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const geometry = (object.geometry as BufferGeometry).clone();
    geometry.applyMatrix4(new Matrix4().multiplyMatrices(toGroup, object.matrixWorld));
    const material = object.material as Material;
    buckets.set(material, [...(buckets.get(material) ?? []), geometry]);
  });
  group.clear();
  for (const [material, geometries] of buckets) {
    const merged = new Mesh(mergeGeometries(geometries), material);
    merged.castShadow = true;
    merged.receiveShadow = true;
    group.add(merged);
  }
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/** Générateur pseudo-aléatoire déterministe (même composition à chaque visite). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
