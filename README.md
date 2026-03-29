# Smart Study Planner

A fully serverless, browser-based Smart Study Planner built with React + Vite. Plan your study sessions, track streaks, and visualize progress — all powered by `localStorage`.

## Features
- 🗓️ Day / Week / Month schedule views
- 🔥 Streak tracking with max streak history
- 📊 GitHub-style historical heatmap (Month view → Prev Month)
- ✅ Block-level task completion with Undo support
- ➕ Bonus Hours — pull tomorrow's tasks into today on demand
- 🌙 Light / Dark mode
- 👤 First-time user onboarding (stored in browser)
- 🔗 Resource links per task
- 🎨 Dynamic pastel task color-coding by subject

## Tech Stack
- **React 19 + Vite** — fast dev server & build
- **localStorage** — all data stored client-side, no backend needed
- **CSS Variables** — dual-theme (light/dark) design system

## Local Development

```bash
cd smart-study-planner
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
cd smart-study-planner
npm install gh-pages --save-dev
npm run deploy
```

This will build and push the `dist/` folder to the `gh-pages` branch automatically.
Ensure `vite.config.js` has `base: './'` (already configured).

## Data & Privacy
All user data (tasks, streaks, profile) is stored **exclusively in the user's browser** via `localStorage`. No data is ever sent to any server.
