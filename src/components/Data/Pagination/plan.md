# Pagination alignment plan

## Completed

- [x] Controlled `current-page` and `page-size` paths, with distinct one-time `default-current-page` and `default-page-size` initialization.
- [x] `page-count` precedence over `total`, including page clamping when the available range changes.
- [x] `size` (`small`, `default`, `large`) while retaining the existing `small` compatibility alias.
- [x] `prev-text`, `next-text`, semantic navigation markup, named controls, active-page state, and Enter-to-jump support.
- [x] Page, size, jump, single-page, default-state, explicit-count, and customized-navigation tests.
- [x] API documentation and an interactive default-state / explicit-count example.

## Follow-up

- [x] P1 Replace the native size select with an accessible anchored listbox; support `append-size-to`, popper class/style, and teleported top-layer rendering.
- [x] P1 Support previous/next icon strings plus named SVG slots after establishing the component icon rendering contract.
- [x] P2 Add browser visual regression coverage for compact, large, and wrapped layouts.

## 2026-07-15 visual acceptance

- [x] Repaired controlled demo bindings and moved live state into the Playground header; added Script views and a dedicated 360px wrapped-layout example.
- [x] Passed 8 focused tests and the production build; compact, large, and three-row wrapped layouts were screenshot-reviewed with no browser console errors.

## 2026-07-15 parity completion

- [x] Added the teleported size listbox, keyboard selection, outside/Escape closing, popper customization, and overlay lifecycle cleanup.
- [x] Added previous/next icon props and SVG slots, public emits/slots/expose types, a dedicated overlay case, and expanded focused tests from 8 to 14.
