# Repository Guidelines

## Project Overview

This is a Vite + React + TypeScript single-page landing site for 読路 / Yomiji, an offline-first WaniKani study client. The page is primarily a polished marketing/showcase experience built from full-screen sections, GSAP/ScrollTrigger motion, Lenis smooth scrolling, Tailwind styling, and static media from `public/`.

## Architecture & Data Flow

- `src/main.tsx` mounts `<App />` inside `BrowserRouter`; the app is currently a single route-less page.
- `src/App.tsx` owns the preload gate (`isLoaded`) and renders the active section order under `<main>`:
  `HeroSection` → `TransitionSection` → `ProductIntro` → `PhoneShowcase` → `Lessons` → `Reviews` → `SelfStudy` → `Privacy` → `Footer`.
- `src/sections/Preloader.tsx` blocks the page for a timed progress animation, then calls `onComplete` so `App` can reveal navigation/content.
- `src/hooks/useLenis.ts` creates the global Lenis smooth-scroll instance, forwards Lenis scroll updates to `ScrollTrigger.update`, and drives Lenis through `gsap.ticker`.
- Section animation pattern: local refs + `useEffect` + `gsap.context()` or `gsap.matchMedia()`, with cleanup via `ctx.revert()` or `mm.revert()`.
- Static asset URLs should use `import.meta.env.BASE_URL` when referenced from source so relative deployment (`vite.config.ts` has `base: './'`) keeps working.

## Key Directories

- `src/sections/` — page sections and most GSAP/ScrollTrigger behavior.
- `src/components/` — shared site components such as `Navigation` and `CustomCursor`.
- `src/components/ui/` — shadcn/Radix-style reusable primitives. Prefer existing primitives over adding parallel UI abstractions.
- `src/hooks/` — Lenis, cursor, and media-query hooks.
- `src/lib/` — small shared utilities; `src/lib/utils.ts` exports `cn()`.
- `public/images/yomiji/` — Yomiji screenshots used by phone/product sections.
- `public/videos/` — hero video media.

## Development Commands

Use npm; the repo has `package-lock.json` and no alternate package-manager config.

```bash
npm run dev      # Vite dev server
npm run build    # TypeScript build mode, then Vite production build
npm run lint     # ESLint over the repo
npm run preview  # Preview production build
```

There is no `test` script, coverage command, or formatter script configured.

## Code Conventions & Common Patterns

- Use TypeScript + React function components. Keep component-local animation state in refs unless React state is needed for rendering.
- Use Tailwind utilities and existing theme tokens from `tailwind.config.js`: `charcoal`, `off-white`, `dim-grey`, `vermilion`, `font-display`, `font-body`.
- Use `cn()` from `src/lib/utils.ts` when composing conditional class names.
- Use the `@/*` alias for imports from `src`.
- Animation code should:
  - register/use GSAP plugins explicitly where needed,
  - scope selectors with `gsap.context()` or `gsap.matchMedia()` cleanup,
  - include `prefers-reduced-motion` behavior for pinned/scrubbed animations,
  - avoid layout-heavy animated properties when transforms work.
- Navigation anchors are manual. Keep section ids aligned with `src/components/Navigation.tsx` (`about`, `lessons`, `contact`).
- Custom cursor hover affordances use `data-cursor-hover`; links and buttons are also handled by `useCustomCursor`.
- The UI library files under `src/components/ui/` are generated-style primitives. Make minimal, targeted edits there and preserve exports expected by shadcn/Radix patterns.

## Important Files

- `src/App.tsx` — active page composition and preload state.
- `src/main.tsx` — React bootstrap and router wrapper.
- `src/index.css` — global Tailwind layers, base styles, CSS variables.
- `src/hooks/useLenis.ts` — smooth-scroll and ScrollTrigger integration.
- `src/sections/HeroSection.tsx` — pinned video scrub sequence.
- `src/sections/PhoneShowcase.tsx` — pinned phone screenshot timeline.
- `src/sections/Privacy.tsx` — desktop horizontal and mobile vertical pinned trust-panel animation.
- `src/sections/Preloader.tsx` — branded loading gate.
- `vite.config.ts` — Vite plugins, `base: './'`, dev port, and `@` alias.
- `tailwind.config.js` — visual tokens, fonts, colors, and custom animations.
- `eslint.config.js` — flat ESLint setup.
- `components.json` — shadcn/ui aliases and style settings.

## Runtime/Tooling Preferences

- Runtime/tooling target is Node + npm. `info.md` notes Node 20; `package.json` does not declare `engines`.
- Package mode is ESM (`"type": "module"`).
- Vite uses `@vitejs/plugin-react`; dev-only `kimi-plugin-inspect-react` is enabled in `vite.config.ts` when serving.
- TypeScript is strict and split by project references (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`). `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are enabled.
- Tailwind is v3-style config with PostCSS (`tailwindcss`, `autoprefixer`).
- Deployment paths should remain relative-safe because `vite.config.ts` sets `base: './'`.

## Testing & QA

- No test framework or test files are currently configured.
- Primary verification is:
  - `npm run build` for TypeScript + production bundle correctness.
  - `npm run lint` for ESLint. For focused changes, lint directly affected files with `npx eslint <paths>`.
- For animation/layout changes, browser-check the affected viewport(s): desktop, mobile, and `prefers-reduced-motion` where relevant.
- High-risk QA areas:
  - hero video readiness and scroll scrubbing in `HeroSection`,
  - Lenis/ScrollTrigger synchronization after changing scroll behavior,
  - pinned animations in `PhoneShowcase` and `Privacy`,
  - asset paths under relative deployment,
  - navigation anchor ids after section changes.
