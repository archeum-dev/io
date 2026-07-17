
<img width="100%" alt="banner" src="https://github.com/user-attachments/assets/018ae80b-f20f-4608-91c9-f0e5c582534b" />

# archeum.io

The marketing site for [Archeum](https://archeum.io) - decentralized personal
infrastructure that runs on your phone.

A **static, framework-free** site: hand-written HTML, one stylesheet, and a
small vanilla-JS file for scroll-driven motion. No React, no WebGL. Built and
bundled with Vite so it deploys as plain static files.

## Design

Near-black canvas, a single system-font stack, and one accent: the app's
molten-gold gradient (lifted from the Archeum seal). Type does the work.

Two restrained, `prefers-reduced-motion`-aware motion signatures:

- the hero **@handle** that rolls through a large pool of names, and
- a 2px gold **scroll vein** pinned to the top edge that fills left-to-right
  with scroll progress (physically tied to scroll position).

Plus IntersectionObserver fade-up reveals as sections arrive. Content is fully
visible without JavaScript - every bit of motion is a progressive enhancement.

## Structure

```
index.html                 Landing page
privacy/archeum/           Privacy policy - Archeum app
privacy/social/            Privacy policy - Social app
delete-account/            Account deletion guide
delete-data/               App-data deletion guide
ai-help/                   SDK primer (full reference at archeum.dev)
src/styles.css             Design system + all components
src/main.js                Header state, mobile nav, animated @handle, scroll vein, reveals
public/                    Brand assets (submodule), _redirects, robots.txt, sitemap.xml
```

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # → dist/  (static, deployable)
npm run preview    # serve the production build
```

New routes are real HTML files; register them in `vite.config.js` under
`build.rollupOptions.input`.

> **Note:** the legal/support pages describe the current architecture
> (node-on-phone, feeless mesh consensus, Ed25519, AGE - no outside chain, no
> tenant sharing). Review the copy as publisher before relying on it for
> compliance.
