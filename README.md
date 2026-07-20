# BLUE TICK ICE - Daily Task Management

A simple React + TypeScript application for managing todos, inventory (stok opname), and meeting notes.

## Features
- Demo login (username: admin, password: admin) – **client‑side only, not for production**
- Todo list: add, toggle completion, delete
- Inventory (Stok Opname): add items, increase/decrease quantity, delete
- Meeting notes: add title + content (timestamped), delete
- All state kept in memory (no localStorage)
- Strict TypeScript typing – every `useState` has an explicit generic

## How to run locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at <http://localhost:3000>.

3. **Production build**
   ```bash
   npm run build
   ```
   The optimized build will be in the `build/` folder. Serve it with any static server (e.g., `serve -s build`).

## Project structure
- `src/App.tsx` – main application component
- `src/index.tsx` – entry point
- `public/index.html` – HTML template
- `package.json`, `tsconfig.json` – standard CRA config

## Notes
- The login is purely for demonstration; credentials are hard‑coded.
- No data persistence – refresh the page to clear all state.
- Styling is inline for simplicity; feel free to move to CSS/Sass or a UI library.

Enjoy managing your daily tasks with BLUE TICK ICE!