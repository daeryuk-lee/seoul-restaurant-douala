# Régénérer les photos du site

Toutes les photos actuelles ont été générées par IA. Ce guide permet de les recréer dans une direction artistique cohérente avec le design (noir laqué et or du logo), avec n'importe quel générateur d'images (Midjourney, DALL·E, Imagen, Firefly…).

> **Recommandation :** de vraies photos des plats de la maison, prises au restaurant sous une lumière chaude, restent préférables. Elles rendent le site plus crédible et évitent de montrer des plats différents de ceux qui sont servis.

## Procédure

1. Générer l'image avec le prompt ci-dessous (format paysage **3:2**, au moins **2400 px** de large, sans texte ni logo).
2. L'enregistrer dans `src/assets/images/_originals/` sous **le même nom de fichier** que l'image remplacée.
3. Lancer `npm run brand` : la photo est automatiquement étalonnée (tons chauds, noirs profonds, vignettage, grain) pour s'accorder au reste du site.
4. Lancer `npm run build` pour vérifier le rendu.

## Style commun (à ajouter à chaque prompt)

```
low-key editorial food photography, deep black background, single warm tungsten key light from the upper left,
soft golden rim light, dark charcoal slate or dark walnut surface, subtle brass accents, shallow depth of field,
85mm lens, fine film grain, rich but natural colours, Michelin-level plating, no text, no logo, no people, 3:2
```

## Images

| Fichier | Sujet (à placer avant le style commun) |
| --- | --- |
| `food/bbq.jpg` | Korean table barbecue seen from above at a 45° angle: thick slices of pork belly searing on a round cast-iron grill, surrounded by small celadon bowls of banchan, lettuce leaves, ssamjang, a wisp of smoke |
| `food/sushi.jpg` | An elegant platter of salmon and white-fish nigiri, salmon sashimi and maki on a dark slate, fresh wasabi, pickled ginger |
| `food/kimbap.jpg` | Neatly sliced Korean kimbap rolls showing colourful fillings (spinach, carrot, egg, pickled radish, beef), arranged in a line on a dark board, sesame seeds |
| `food/bibimbap.jpg` | Dolsot bibimbap in a sizzling black stone pot: arranged vegetables, beef, a raw egg yolk in the centre, gochujang, rising steam |
| `food/grillade.jpg` | Bulgogi and spicy stir-fried pork served on a dark stone plate, glossy caramelised sauce, spring onion, sesame |
| `food/fried-chicken.jpg` | Korean fried chicken glazed with sweet and spicy sauce, sesame seeds and sliced spring onion, in a matte black bowl |
| `food/noodles.jpg` | A bowl of spicy seafood jjamppong with noodles, mussels, squid and prawns in a deep red broth, steam rising |
| `food/supplements.jpg` | A composition of Korean side dishes: steamed rice in a small stone pot, kimchi, soft tofu, rolled egg omelette, in small celadon dishes |
| `hero-bg.jpg` | Photo d'ambiance des pages Réservation et Plan, et de la page 404 : wide shot of a dark, elegant Korean dining room at night, warm pendant lights above wooden tables with built-in grills, empty, cinematic — **ou mieux, une vraie photo de la salle** |

## Mention légale

Tant que les photos (et le film de l'accueil) proviennent d'un générateur d'images, laissez la mention « Visuels d'illustration générés par intelligence artificielle, non contractuels », présente en pied de page, sur la carte et dans les mentions légales. Si vous passez à de vraies photos, modifiez ces textes dans `src/i18n/ui.ts` et `src/content/legal.ts`.
