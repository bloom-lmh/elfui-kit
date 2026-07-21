# Autocomplete Element Plus parity plan

## 2026-07-19 overlay alignment
- [x] Remove the default panel gap and join the popup to the field surface
- [x] Give the top-layer option panel explicit theme-token text colors so dark mode cannot inherit light-page text
- [x] Remove the redundant standalone appearance gallery and keep field variants in the shared interactive field contract

## Baseline

- [x] Core props: `model-value`, `options`, `fetch-suggestions`, `placeholder`, `disabled`, `clearable`, and `trigger-on-focus`.
- [x] Core events: `update:modelValue`, `input`, `change`, `select`, `focus`, `blur`, and `clear`.
- [x] Form validation linkage and focused component tests.

## Delivered in this batch

- [x] Add debounced asynchronous suggestions with last-request-wins protection and a loading state.
- [x] Add `placement`, `highlight-first-item`, accessible combobox/listbox semantics, arrow-key navigation, Escape, Enter selection, and `focus` / `blur` exposes.
- [x] Add default suggestion and `loading` slots, API reference, and a keyboard/top-placement playground example.

## Remaining gap

- [x] Support a correctly-positioned `teleported` panel with `append-to`, popper customization, collision handling, external-scroll closing, visual viewport support, and optional input-width fitting.
- [x] Share the `filled / outlined` field surface, floating label, dark/error/disabled states, and preserve scrolling inside the suggestion panel.
