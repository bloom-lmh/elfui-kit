# Autocomplete Element Plus parity plan

## Baseline

- [x] Core props: `model-value`, `options`, `fetch-suggestions`, `placeholder`, `disabled`, `clearable`, and `trigger-on-focus`.
- [x] Core events: `update:modelValue`, `input`, `change`, `select`, `focus`, `blur`, and `clear`.
- [x] Form validation linkage and focused component tests.

## Delivered in this batch

- [x] Add debounced asynchronous suggestions with last-request-wins protection and a loading state.
- [x] Add `placement`, `highlight-first-item`, accessible combobox/listbox semantics, arrow-key navigation, Escape, Enter selection, and `focus` / `blur` exposes.
- [x] Add default suggestion and `loading` slots, API reference, and a keyboard/top-placement playground example.

## Remaining gap

- [ ] Support a correctly-positioned `teleported` panel. This requires an anchored-positioning primitive so scroll, zoom, and viewport changes remain accurate.
