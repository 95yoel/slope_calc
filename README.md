
# 🧮 SlopeCalc

[![CI](https://github.com/95yoel/slope_calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/95yoel/slope_calc/actions/workflows/deploy.yml)
![minzipped size](https://img.shields.io/badge/minzipped%20size-~5KB-blue)
![typescript](https://img.shields.io/badge/typescript-100%25-blue)
![last commit](https://img.shields.io/github/last-commit/95yoel/slope_calc?color=limegreen)

> A mobile-friendly slope gradient calculator for runners and hikers, built with **vanilla TypeScript** and **Web Components**, featuring export to PDF and offline persistence.

## 🌐 Live Demo

🔗 [95yoel.github.io/slope_calc](https://95yoel.github.io/slope_calc/)

---

### 💡 Why Web Components?

SlopeCalc is built entirely with **native Web Components** — no framework, no build-time abstractions, just browser-native capabilities.

By using **Custom Elements**, **Shadow DOM**, and **vanilla TypeScript**, this approach offers:

- ✅ **No framework lock-in** – reusable in any tech stack (React, Angular, etc.)
- 🚀 **Lightweight bundle** – minimal JavaScript, no runtime overhead
- ♻️ **Truly reusable components** – encapsulated logic and styles
- 🛠️ **Long-term browser support** – backed by open web standards

This architecture makes SlopeCalc easy to maintain, easy to extend, and ideal for performance-critical or embedded environments.

---

## ⚙️ Features

- 📏 Add segments with start/end length & elevation
- 📉 Calculates total distance, elevation gain, and average slope
- 🧠 Smart validation using custom `<custom-input>` elements
- 💾 **IndexedDB** storage for offline data persistence
- 🧾 **PDF Export**: fully styled, compatible with mobile
- 🧩 Modular architecture: each UI element is a separate component
- 📦 CI/CD with GitHub Actions

---

## 📁 Technologies

- **TypeScript**
- **Vite** + `vite.config.ts`
- **IndexedDB** (no third-party wrapper)
- **pdf-lib** for generating styled PDF reports
- ESLint + `@typescript-eslint`, strict rules
- GitHub Pages for deployment

