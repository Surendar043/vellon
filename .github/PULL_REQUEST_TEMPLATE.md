name: Pull request

## What changed

<!-- A short description of the change. -->

## Why

<!-- The problem this solves, or a link to the issue. -->

## Checklist

- [ ] `npm run verify` passes locally
- [ ] The contrast maths still matches the published WCAG reference values
- [ ] New behaviour in `src/lib/` has tests in `tests/contrast.test.ts`
- [ ] New components have tests in `src/App.test.tsx`
- [ ] The page still works with JavaScript disabled (`<noscript>`)
- [ ] Keyboard interaction works and focus is visible
- [ ] `prefers-reduced-motion` is respected
- [ ] Both light and dark themes have been checked
- [ ] Copy changes are made in `src/data/site.ts`, not in a component
