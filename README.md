# Marco Su — Portfolio

A cinematic, data-driven personal portfolio built with Next.js, TypeScript, Tailwind CSS, GSAP, ScrollTrigger and Lenis.

The visual structure follows a continuous sequence: terminal intro, retro CRT hero, screen-dive transition, manifesto, horizontal projects rail, typographic interlude, personal story and contact.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production checks:

```bash
npm run typecheck
npm run build
npm run start
```

## Edit the content

All public profile, education, language, project and story content lives in:

```text
data/site.ts
```

- Change the name, role, email, location and GitHub URL at the top of `site`.
- Edit `site.projects` to change project order, copy, links or status.
- Replace project artwork in `public/projects/` while keeping the same filenames, or update each `cover` path.
- Update the education, languages and `story` arrays without touching the page components.

The current project artwork is local SVG, so there are no remote-image failures or third-party image dependencies.

## Visual and motion settings

- Accent colour: change `--accent` in `app/globals.css` and `accentColor` in `data/site.ts`.
- Intro copy and timing: `components/IntroSequence.tsx`.
- Hero screen-dive scale and scroll range: `components/HeroTerminal.tsx` and `.hero-section` in `app/globals.css`.
- Projects rail scroll behaviour: `components/ProjectsRail.tsx`.
- Intro session state uses `sessionStorage` under `marco-intro-played`.
- Theme and sound preferences use `localStorage` under `marco-theme` and `marco-sound`.
- Remove `IntroSequence` from `components/PortfolioExperience.tsx` to disable the intro entirely.
- The site automatically disables pinned and complex motion for `prefers-reduced-motion` users.

## Deployment

Deploy the repository to Vercel with the standard Next.js preset. Set the public deployment URL so social images resolve correctly:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

No private environment variables or external APIs are required.
