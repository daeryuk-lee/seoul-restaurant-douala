# Tourner les vraies images du site

Le film de l'accueil et les photos des plats sont aujourd'hui générés par intelligence artificielle. De vraies images, prises au restaurant avec un téléphone récent, rendront le site plus crédible et permettront de retirer la mention « visuels générés par IA ».

## Réglages du téléphone (vidéo et photo)

- **Vidéo** : 4K (3840 × 2160) à 30 images/s, sinon 1080p à 30 images/s. Pas de 60 images/s (plus lourd, aucun gain ici).
- **Toujours à l'horizontale**, téléphone tenu à deux mains contre le corps.
- **Stabilisation activée** (mode « Action » ou « Super stable » s'il existe).
- **Mise au point et exposition verrouillées** : appui long sur le plat à l'écran avant de lancer l'enregistrement.
- **Pas de zoom** : on s'approche en marchant. Objectif essuyé avant chaque prise.
- **Lumière** : le soir, toutes les lampes de la salle allumées, sans lumière du jour mélangée ; jamais face à une fenêtre.
- **Pas de flash.**

## 1. Le film de l'accueil

Deux possibilités. La première reprend exactement le déroulé actuel du site.

### Option A — un plan par rubrique de la carte (recommandé)

Neuf plans courts, **2 secondes chacun**, en avançant très lentement vers le plat (environ 20 cm en tout). Même hauteur de caméra et même table pour tous les plans. Filmer plus long ne sert à rien : le site ne garde qu'une douzaine d'images par plan, et des plans plus longs alourdiraient le film pour les visiteurs sur téléphone.

Garder le plat **au centre de l'image** : sur téléphone, seul un carré central (un peu plus de la moitié de la largeur) est affiché.

| # | Rubrique | Plat à filmer |
|---|---|---|
| 1 | Barbecue coréen | Table barbecue dressée : grill allumé avec la viande, banchan autour. Commencer à 2 m de la table, finir au-dessus du grill (fumée visible) |
| 2 | Entrées & kimbap | Kimbap tranché, alignés sur une planche ou une ardoise |
| 3 | Sushi & spécialités | Plateau de sushi et sashimi |
| 4 | Grillades & sautés | Porc sauté pimenté ou au kimchi, dans son poêlon |
| 5 | Fritures | Donkkasseu ou poulet frit, avec ses sauces |
| 6 | Riz & ragoûts | Bibimbap en marmite de pierre, puis un ragoût fumant |
| 7 | Nouilles | Jjamppong (fruits de mer, bouillon rouge) |
| 8 | Suppléments | Riz, œufs à la vapeur, banchan |
| 9 | Réserver (fin du film) | Vue d'ensemble d'une table entièrement garnie, en reculant légèrement |

### Option B — un plan-séquence continu

Une seule prise de **10 à 15 secondes, sans coupe** : de l'entrée, avancer au pas (moitié de la vitesse normale, genoux fléchis) entre les tables, jusqu'à une table barbecue garnie, puis finir au-dessus du grill. C'est ce qui donne l'effet de « traversée » le plus immersif. Le site en garde environ 120 images (réglage `step` ≈ 3 à 30 images/s).

### Précautions

- Salle propre et rangée ; pas de bouteille ni d'emballage de marque visible.
- Pas de client reconnaissable sans son accord écrit (le plus simple : filmer avant l'ouverture).
- Garder les fichiers d'origine, sans les envoyer par WhatsApp (qui les compresse) : les transférer par câble, Google Drive ou WeTransfer.

### Mettre la vidéo en ligne

1. Mettre à jour les plans dans `src/data/film.json` : numéros de la première et de la dernière image de chaque plan (`from`, `to`), rubrique (`chapter`, `closing` pour le dernier plan), longueur de défilement (`scroll`), centre du recadrage portrait (`focus`) et `step` (une image gardée sur `step` : viser 12 à 15 images par plan, soit `step` ≈ 4 pour 2 secondes à 30 images/s). Changer `"version"` (`"v2"`).
2. Lancer `npm run film -- chemin/vers/video.mp4` (nécessite ffmpeg) : les images sont générées dans `public/film/<version>/`. Pour une vidéo en 1080p ou moins, les agrandir d'abord par IA, pour des images bien plus nettes : `python3 scripts/film-upscale.py chemin/vers/video.mp4 images/` puis `npm run film -- images/` (voir l'en-tête du script). Le plus simple est de m'envoyer la vidéo : je m'occupe de ces réglages.
3. Vérifier avec `npm run build` puis `npm run preview`.

## 2. Les photos des plats

Une photo par fichier existant de `src/assets/images/_originals/` :

| Fichier | Sujet |
|---|---|
| `food/bbq.jpg` | Table barbecue, vue à 45° : viande sur le grill, banchan autour |
| `food/sushi.jpg` | Plateau de sushi et sashimi |
| `food/kimbap.jpg` | Kimbap tranché, garnitures visibles |
| `food/bibimbap.jpg` | Bibimbap en marmite de pierre, jaune d'œuf au centre |
| `food/grillade.jpg` | Porc sauté au kimchi ou bulgogi, dans son poêlon |
| `food/fried-chicken.jpg` | Donkkasseu et poulet frit |
| `food/noodles.jpg` | Bol de jjamppong |
| `food/supplements.jpg` | Accompagnements : riz, œufs à la vapeur, banchan |
| `hero-bg.jpg` | La salle, le soir, lampes allumées, tables dressées |

- **Format paysage**, photo standard du téléphone (au moins 2400 pixels de large). Cadrer un peu large : le site recadre.
- **Une lumière chaude venant du côté**, fond sombre (bois foncé, ardoise), assiette essuyée sur les bords.
- Déposer chaque photo dans `src/assets/images/_originals/` **sous le même nom de fichier**, puis lancer `npm run brand` (étalonnage automatique) et `npm run build`.
- Mettre à jour la description de la photo (`imageAlt` de la rubrique correspondante dans `src/data/menu.ts`, dans les 4 langues) pour qu'elle décrive bien la nouvelle image.

## 3. Quand toutes les images sont réelles

Retirer la mention « Visuels d'illustration générés par intelligence artificielle » dans `src/i18n/ui.ts` (`footer.photos` et `menu.notes.photos`) et dans `src/content/legal.ts`, dans les 4 langues.
