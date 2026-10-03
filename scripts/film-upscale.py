"""
Film de l'accueil — agrandissement des images par IA (facultatif), avant « npm run film ».

Extrait de la vidéo les seules images retenues par src/data/film.json, les agrandit ×4 avec
Real-ESRGAN (modèle « general x4v3 », licence BSD-3), puis les ramène à 2 × la taille d'origine.
Le résultat est bien plus net qu'un simple agrandissement, surtout pour une vidéo en 720p.

Prérequis : Python 3.10+, ffmpeg, puis :  pip install torch pillow numpy
Les poids du modèle (≈ 5 Mo) sont téléchargés depuis GitHub au premier lancement.

Usage :
    python3 scripts/film-upscale.py chemin/vers/video.mp4 dossier-images/
    npm run film -- dossier-images/

Compter une dizaine de secondes par image sur le processeur d'un ordinateur portable.
"""

import json
import pathlib
import subprocess
import sys
import tempfile
import time
import urllib.request

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image

RELEASE = 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/'
WEIGHTS = ['realesr-general-x4v3.pth', 'realesr-general-wdn-x4v3.pth']
# Part du modèle débruiteur : 0 = détails maximum, 1 = image lissée
DENOISE = 0.3
CACHE = pathlib.Path.home() / '.cache' / 'seoul-film'


class SRVGGNetCompact(nn.Module):
    """Réseau compact de Real-ESRGAN (realesr-general-x4v3)."""

    def __init__(self, num_feat=64, num_conv=32, upscale=4):
        super().__init__()
        self.upscale = upscale
        body = [nn.Conv2d(3, num_feat, 3, 1, 1), nn.PReLU(num_parameters=num_feat)]
        for _ in range(num_conv):
            body += [nn.Conv2d(num_feat, num_feat, 3, 1, 1), nn.PReLU(num_parameters=num_feat)]
        body.append(nn.Conv2d(num_feat, 3 * upscale * upscale, 3, 1, 1))
        self.body = nn.ModuleList(body)
        self.upsampler = nn.PixelShuffle(upscale)

    def forward(self, x):
        out = x
        for layer in self.body:
            out = layer(out)
        return self.upsampler(out) + F.interpolate(x, scale_factor=self.upscale, mode='nearest')


def load_model():
    CACHE.mkdir(parents=True, exist_ok=True)
    states = []
    for name in WEIGHTS:
        path = CACHE / name
        if not path.exists():
            print(f'Téléchargement de {name}…')
            urllib.request.urlretrieve(RELEASE + name, path)
        checkpoint = torch.load(path, map_location='cpu', weights_only=True)
        states.append(checkpoint.get('params', checkpoint.get('params_ema')))
    # Mélange des deux modèles (détail / débruitage)
    state = {k: (1 - DENOISE) * states[0][k] + DENOISE * states[1][k] for k in states[0]}
    net = SRVGGNetCompact()
    net.load_state_dict(state)
    return net.eval()


@torch.inference_mode()
def upscale(net, image, tile=360, pad=10):
    """Agrandissement ×4 par tuiles (mémoire limitée), sans raccord visible."""
    x = torch.from_numpy(np.asarray(image.convert('RGB'), dtype=np.float32) / 255).permute(2, 0, 1)[None]
    _, _, h, w = x.shape
    out = torch.zeros(1, 3, h * 4, w * 4)
    for y0 in range(0, h, tile):
        for x0 in range(0, w, tile):
            y1, x1 = min(y0 + tile, h), min(x0 + tile, w)
            ya, xa, yb, xb = max(y0 - pad, 0), max(x0 - pad, 0), min(y1 + pad, h), min(x1 + pad, w)
            o = net(x[:, :, ya:yb, xa:xb])
            out[:, :, y0 * 4:y1 * 4, x0 * 4:x1 * 4] = o[:, :, (y0 - ya) * 4:(y1 - ya) * 4, (x0 - xa) * 4:(x1 - xa) * 4]
    pixels = (out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255).round().astype(np.uint8)
    return Image.fromarray(pixels)


def needed_frames(config):
    """Mêmes images que scripts/build-film.mjs : une sur « step » par plan, la dernière toujours."""
    frames = set()
    for shot in config['shots']:
        picks = list(range(shot['from'], shot['to'] + 1, config['step']))
        if picks[-1] != shot['to']:
            picks.append(shot['to'])
        frames.update(picks)
    return sorted(frames)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    video, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    needed = needed_frames(json.loads(pathlib.Path('src/data/film.json').read_text(encoding='utf-8')))
    net = load_model()
    torch.set_num_threads(max(1, torch.get_num_threads()))

    with tempfile.TemporaryDirectory() as tmp:
        select = '+'.join(f'eq(n,{n})' for n in needed)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(video), '-vf', f"select='{select}'", '-vsync', '0',
                        '-start_number', '0', f'{tmp}/%04d.png'], check=True)
        start = time.time()
        for k, n in enumerate(needed):
            target = out / f'{n:04d}.png'
            if target.exists():  # reprise possible après une interruption
                continue
            source = Image.open(f'{tmp}/{k:04d}.png')
            big = upscale(net, source)
            big.resize((source.width * 2, source.height * 2), Image.LANCZOS).save(target)
            print(f'{k + 1}/{len(needed)} image {n} ({time.time() - start:.0f} s)', flush=True)
    print(f'Terminé : {out}. Lancer ensuite : npm run film -- {out}/')


if __name__ == '__main__':
    main()
