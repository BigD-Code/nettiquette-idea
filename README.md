# Retro 3D Lab · RETROBAY

An interactive e-commerce homepage for **RETROBAY** — a vintage computer shop selling restored classics from the golden age of personal computing (Amiga, Macintosh, C64, Atari, IBM PC, Apple IIGS).

## 🚀 Live demo

👉 https://bigd-code.github.io/retro-3d-lab/

## ✨ Features

- **5 nav tabs** (Home, Shop, About, Reviews, Contact) with smooth scroll
- **Hero section** with 3D WebGL stage: 3 vintage computers (Amiga 500, Mac SE/30, C64) rendered in real-time with React Three Fiber, rotating, with shadows and contact shadows
- **Product catalog** with 8 vintage machines, each with a 3D rotating thumbnail (8 different 3D models: Amiga 500, A1200, C64, C128, Mac SE/30, Atari 1040 ST, Apple IIGS, IBM PS/2)
- **Category filter** (All, Apple, Commodore, Atari, IBM, Parts)
- **Procedural CanvasTexture** for CRT screens, plastic cases, keyboard, circuit boards
- **CRT scanlines** CSS overlay + neon glow effects
- **Cart counter** with toast notifications
- **Reviews section** with star ratings
- **Contact form** with topic dropdown
- **Timeline** of the era we restore
- **Responsive** (mobile, tablet, desktop)
- **Synthwave color palette**: magenta, cyan, amber, lime

## 🧩 Stack

- **React 18** + **Vite 5**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- Procedural textures via `<canvas>` API (no external assets needed)
- **Google Fonts**: Press Start 2P, VT323, Space Grotesk

## 💻 Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 🌐 Deploy

Automatic deploy on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

## 📁 Project structure

```
retro-3d-lab/
├── index.html
├── package.json
├── vite.config.js
├── .github/workflows/deploy.yml
└── src/
    ├── main.jsx          # React entry
    ├── App.jsx           # App shell + navigation state
    ├── style.css         # Global styles (synthwave theme)
    ├── data.js           # Products, categories, reviews, timeline
    ├── Sections.jsx      # Hero, About, Reviews, Contact, Footer
    ├── ProductGrid.jsx   # Product cards + filters
    └── three/
        └── Models.jsx    # 3D vintage computer models + procedural textures
```
