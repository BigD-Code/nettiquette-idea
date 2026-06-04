# Retro 3D Lab

A small interactive WebGL showcase of retro CRT-style computers rendered in the browser with React + Vite + Three.js.

## 🚀 Live demo

👉 https://bigd-code.github.io/retro-3d-lab/

## 🧩 Stack

- **React 18** + **Vite 5**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** (Bloom, ChromaticAberration, Noise, Vignette)
- **maath** for camera easing helpers

## ✨ Features

- 3 stylized retro computers (Amiga, C64, IBM PC) with emissive screens and keyboards
- Reflective synthwave floor with magenta grid
- Particle sparkles floating around the scene
- Custom CRT overlay (scanlines + vignette + chromatic aberration)
- Auto-rotating orbit camera with mouse drag/zoom
- Animated "RETRO 3D LAB" neon sign
- Custom boot loader

## 💻 Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 🌐 Deploy

Automatic deploy on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).
