# Vellum

A product landing page for a fictional design-token tool, built with **React**, **TypeScript**, hand-written **CSS** and a small **vanilla JavaScript** layer.

The page is not a mock-up. The colour playground in the middle of it really generates a tonal palette, really measures WCAG 2.2 contrast, and really writes the CSS custom properties — all in the browser, with no backend.

> Why a landing page? Because a landing page is the one thing every front-end engineer has to build, and it is the one thing that quietly exposes whether you understand layout, accessibility, performance and progressive enhancement. This one does all four on purpose.

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](https://github.com/your-handle/vellum/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Accessibility](https://img.shields.io/badge/a11y-keyboard%20complete-brightgreen)
![No runtime dependencies](https://img.shields.io/badge/runtime%20deps-0-success)

---

## Contents

- [Live demo](#live-demo)
- [What is on the page](#what-is-on-the-page)
- [The interactive playground](#the-interactive-playground)
- [The four technologies, and where each one lives](#the-four-technologies-and-where-each-one-lives)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Testing](#testing)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Design decisions](#design-decisions)
- [What I would build next](#what-i-would-build-next)
- [License](#license)

---

## Live demo

**[vellum.example.com](https://example.com)** — deployed from the `main` branch.

> Replace the placeholder link with your own deployment. The build uses a relative `base`, so it works from a sub-path on GitHub Pages as well as from a domain root.

---

## What is on the page

| Section            | What it does                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Navigation**     | Sticky, gains a blur and a border once you scroll; full mobile menu                      |
| **Hero**           | Animated gradient mesh, a CSS-drawn mock of the product, and the primary calls to action |
| **Logo strip**     | Text-only, so nothing can ever 404                                                       |
| **Value props**    | Three cards with hand-drawn inline SVG icons                                             |
| **Features**       | Six cards covering palettes, contrast, export formats, Figma sync, aliases and dark mode |
| **Playground**     | The interactive colour playground — see below                                            |
| **Code showcase**  | The same output in HTML/CSS, React and plain JavaScript                                  |
| **Statistics**     | Four animated counters, driven by the vanilla layer                                      |
| **Pricing**        | Three tiers                                                                              |
| **Testimonial**    | A single pull-quote                                                                      |
| **FAQ**            | A six-question accordion                                                                 |
| **Call to action** | Closing band                                                                             |
| **Footer**         | Navigation, and an honest note that the product is fictional                             |

Everything renders on the server-side-free client, with no images, no icon font and no third-party runtime dependency.

---

## The interactive playground

Pick any base colour and the page generates a ten-step tonal palette from it, checks the contrast against a light and a dark surface, grades the result against WCAG 2.2 AA and AAA, and writes the matching CSS custom properties.

The maths is in `src/lib/`, split into three focused modules:

```
src/lib/
├── color.ts      hex ⇄ RGB ⇄ HSL conversion
├── contrast.ts   relative luminance, contrast ratio, WCAG grading
└── palette.ts    tonal scale generation and CSS output
```

Two details worth calling out:

**The contrast maths is the WCAG formula, not an approximation.** Relative luminance uses the sRGB linearisation threshold of `0.04045`, and the ratio is `(lighter + 0.05) / (darker + 0.05)`. It agrees with the published reference values — `#767676` on white comes out at `4.54:1`, black on white at `21:1` — and those are asserted in the test suite rather than eyeballed.

**Every swatch is guaranteed readable.** Picking the text colour for a swatch means choosing between the two extremes of luminance. Pure black and pure white between them always achieve at least `4.58:1` against any background, which is the strongest guarantee available; the test suite asserts it for every generated step.

The palette keeps the hue of the base colour across all ten steps, with the saturation nudged at the extremes — pulled back at the light end so tints do not look chalky, pushed up at the dark end so shades do not look muddy.

---

## The four technologies, and where each one lives

The brief was HTML, CSS, JavaScript and React. Each does a specific job here, and none of them overlaps:

### HTML

Semantic structure throughout: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`, a real `h1`–`h3` hierarchy, `<blockquote>` and `<figcaption>` for the testimonial, `<label>` bound to every input, and `aria-expanded` on the accordion and the mobile menu. The page ships a `<noscript>` block with the pitch and a contact address, so it is still useful without JavaScript.

### CSS

Hand-written, with no framework and no utility classes. The design system is four files:

```
src/styles/
├── tokens.css      colour, type, space, motion — light and dark
├── base.css        reset, document defaults, utilities
├── components.css  buttons, cards, tabs, accordion, form controls
└── sections.css    the page sections themselves
```

Theming uses the `light-dark()` CSS function with a plain-value fallback declared first, so browsers without support keep the light palette:

```css
--bg: #f6f6fb;
--bg: light-dark(#f6f6fb, #07070d);
```

The `data-theme` attribute on `<html>` switches `color-scheme`, which is what `light-dark()` follows — so there is exactly one source of truth for the palette and the toggle is a single attribute change.

### JavaScript

`public/vanilla.js` is a plain, framework-free classic script. It is deliberately **not** bundled and **not** a module. It contains:

1. **`<fd-counter>`** — a custom element that counts a number up the first time it scrolls into view. It needs to work before React mounts, and it owns its own animation frame loop, so a custom element is a better fit than a React component.
2. **`vellumCopy()`** — a clipboard helper with a `execCommand` fallback for browsers that do not expose the async clipboard API in an insecure context.

React renders `<fd-counter>` as an ordinary unknown element and never touches it again. The boundary is real: there is a genuine reason for each thing living where it does, not a token gesture.

### React

React 19 with TypeScript in strict mode. Component state is used where it earns its place — the playground's colour, the surface being checked, the open FAQ entry, the active code tab, the mobile menu — and there is no global state library, because there is no global state.

The `<fd-counter>` element is rendered with `createElement` rather than JSX, with a comment explaining why: React assigns to _properties_ when the prop name exists on the element, and `prefix` is a read-only property on every DOM node. That one detail cost an afternoon and is now a comment in the source.

---

## Accessibility

Accessibility was a requirement rather than a pass at the end.

- **Full keyboard path** — every control is reachable and operable, with visible focus rings and a skip link
- **Semantic HTML** — real landmarks, real headings, real form labels
- **`aria-expanded`** on the accordion and the mobile menu, with the panels wired to their triggers
- **Live feedback** — the contrast verdict is not colour-coded alone; it is labelled `AA`, `AAA` or `FAIL`
- **Reduced motion** — `prefers-reduced-motion` collapses every animation, including the counters in the vanilla layer
- **Accessible colour** — the palette generator guarantees every swatch clears 4.58:1 against its own text colour
- **Theme without a flash** — the stored theme is applied by a tiny inline script before the first paint, because React mounts too late to prevent it
- **Zoom and reflow** — the layout holds at 320 px and at 200% zoom

---

## Performance

| Measure              | Value     |
| -------------------- | --------- |
| Gzipped JavaScript   | ~78 kB    |
| Gzipped CSS          | ~5.6 kB   |
| Runtime dependencies | 1 (React) |
| Images               | 0         |
| Icon fonts           | 0         |
| Third-party scripts  | 0         |

How it stays fast:

- No images and no icon font — every glyph is inline SVG, every illustration is CSS
- The hero's gradient mesh animates with `transform` and `opacity` only, so it stays on the compositor
- The playground recomputes only the palette and the contrast values; nothing else on the page re-renders
- The counters animate in the vanilla layer, outside React's render cycle entirely
- `content-visibility` on the lower sections keeps off-screen work out of the initial layout

---

## Testing

```bash
npm test
```

**39 tests, in two suites.**

`tests/contrast.test.ts` covers the colour maths — 27 tests covering hex/RGB/HSL conversion, relative luminance against the published reference values, contrast ratios, WCAG grading thresholds, and palette generation. These are the tests that matter, because a contrast checker with the wrong formula is worse than no contrast checker.

`src/App.test.tsx` mounts the whole page in a real DOM (jsdom) — 12 tests covering the hero, every section, the playground recalculating when the colour changes, invalid input being rejected, the theme toggling, the FAQ accordion, the code tabs, and the statistics band rendering the vanilla custom element.

There is also a **smoke test** that boots the production build and checks that the page is served, that every referenced asset resolves, that the vanilla layer is served separately and defines `<fd-counter>`, and that the bundle actually contains the application:

```bash
npm run build && npm run smoke
```

And one command for the whole gate:

```bash
npm run verify
```

```
format:check → lint → typecheck → test → build → smoke
```

---

## Getting started

Requires **Node 20.19+** (or 22+).

```bash
git clone https://github.com/your-handle/vellum.git
cd vellum
npm install
npm run dev
```

The site is then at http://localhost:5173.

### Everything else

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Serve the production build          |
| `npm test`           | Run the test suite                  |
| `npm run test:watch` | Run the tests in watch mode         |
| `npm run typecheck`  | Type-check with `tsc --noEmit`      |
| `npm run lint`       | Lint everything                     |
| `npm run format`     | Format everything with Prettier     |
| `npm run smoke`      | Smoke-test the production build     |
| `npm run verify`     | The full gate                       |

### Making it yours

Every string on the page lives in `src/data/site.ts` — the copy, the feature list, the pricing, the FAQ, the statistics. Change it there and the page follows. The colour palette itself is in `src/styles/tokens.css`.

---

## Project structure

```
vellum/
├── index.html                  ← semantic shell + the pre-paint theme script
├── public/
│   ├── favicon.svg
│   └── vanilla.js              ← the vanilla layer: <fd-counter> + clipboard
├── src/
│   ├── main.tsx                ← entry point
│   ├── App.tsx                 ← composition
│   ├── data/site.ts            ← every string on the page
│   ├── lib/
│   │   ├── color.ts            ← hex ⇄ RGB ⇄ HSL
│   │   ├── contrast.ts         ← WCAG relative luminance and grading
│   │   └── palette.ts          ← tonal scale generation, CSS output
│   ├── hooks/                  ← useTheme, useScrolled
│   ├── components/             ← Nav, Hero, Features, Playground, CodeShowcase,
│   │                            Stats, Pricing, Faq, Cta, Footer, Counter, Icons
│   ├── styles/                 ← tokens, base, components, sections
│   ├── test/setup.ts           ← jsdom shims
│   └── App.test.tsx            ← the page, rendered in a real DOM
├── tests/                      ← the colour maths
├── scripts/smoke.mjs           ← the production smoke test
├── vite.config.ts
└── vitest.config.ts
```

---

## Design decisions

**Why a fictional product?** A landing page is only as good as the thing it sells. Inventing Vellum means the copy can talk about something specific, the playground can demonstrate the actual product, and nothing on the page is a placeholder rectangle with a grey line through it.

**Why is the playground real?** A fake one would have been faster, but a page about design tokens with a broken contrast checker would be a joke. The maths is small, it is pure, and it is the part worth showing.

**Why a vanilla layer at all?** Because it is the honest answer to "where does JavaScript fit in a React app". The theme script _cannot_ live in React — React mounts after the first paint. The counters _should not_ live in React — they are a self-contained animation with no reason to re-render a tree. Putting each thing where it belongs is more convincing than putting everything in one place.

**Why hand-written CSS instead of Tailwind?** The page is a portfolio piece, and Tailwind would hide the layout skill rather than show it. A reader can open `sections.css` and see exactly how the hero, the playground and the pricing grid are built.

**Why `light-dark()`?** It lets one custom property hold both themes, with the browser choosing based on `color-scheme`. There is no duplicated dark-mode block to keep in sync, and the fallback declaration means older browsers still get a sensible light theme.

---

## What I would build next

- A real backend, so the pricing form actually posts somewhere
- A theme editor that lets you change the accent and re-derive the whole page
- Screenshots and a short demo recording in the README — the one thing a reviewer would notice missing
- Localisation, including right-to-left layout
- A print stylesheet for the generated token report
- More export formats: Tailwind config, Style Dictionary, Swift, Kotlin

---

## License

MIT © [your name](https://github.com/your-handle)

See [LICENSE](LICENSE).
