# Letting Go — Project Context

## What This App Is
A meditation and breathing web app called "Letting Go". Users can choose between a free meditation session or a guided 4-7-8 breathing exercise. Built as a web app (runs in any browser).

## Stack
- React 19 + TypeScript
- Vite 8 (build tool)
- Tailwind CSS v4
- Framer Motion v12 (animations)
- Howler v2 (audio)

## Deployment
- **Platform**: Netlify
- **URL**: `lettingo.netlify.app`
- **Production branch**: `main` — Netlify deploys from this branch automatically on every push

## Local Development
```bash
npm install   # only needed once
npm run dev   # starts dev server at http://localhost:5173
```

## Key Decisions
- `vite.config.ts` has NO `base` path set — Netlify serves from root `/`
- Sound files use `import.meta.env.BASE_URL` so paths work in any environment:
  - `${import.meta.env.BASE_URL}sounds/rain.mp3`
  - `${import.meta.env.BASE_URL}sounds/chime.mp3`
- `netlify.toml` configures build command (`npm run build`) and publish dir (`dist`)
- `src/main.tsx` has an error boundary that shows a visible error instead of a blank page
- `src/index.css` sets `background: #06060c` on `body` to prevent white flash while JS loads

## Project Structure
```
src/
  screens/      # HomeScreen, TimeDialScreen, MeditateScreen, BreatheScreen, EndScreen
  components/   # MandalaSVG, BackButton, SoundToggle, TimeDial
  hooks/        # useAmbientSound, useBreathingCycle, useSessionTimer
  types/        # app.ts
public/
  sounds/       # rain.mp3, chime.mp3
```
