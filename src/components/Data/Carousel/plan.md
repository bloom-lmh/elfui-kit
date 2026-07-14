# Carousel alignment plan

## Completed

- [x] Element-style navigation props: `initial-index`, `trigger`, `arrow`, `indicator-position`, and `direction`.
- [x] Horizontal and vertical slide transitions, outside/hidden indicators, and always/hover/never arrow visibility.
- [x] `change(current, previous)` only for an actual transition; no spurious event at a non-looping boundary.
- [x] Keyboard navigation: Left/Right or Up/Down for the configured direction, plus Home and End.
- [x] Accessible carousel region, named controls, and current indicator state.
- [x] Public `activeIndex`, `setActiveItem`, `prev`, and `next` APIs.
- [x] Timer cleanup on unmount, target tests, API documentation, and a vertical keyboard example.

## Follow-up

- [x] P1 Add the `card` type only together with a dedicated CarouselItem layout contract; ordinary slotted nodes retain the standard layout.
- [x] P1 Add a CarouselItem component so `label` and `name` are typed, can be selected imperatively, and supply slide metadata.
- [ ] P2 Add browser-level visual regression coverage for vertical and outside-indicator layouts.

## 2026-07-14 regression

- [x] Restore card labels, guarantee 100% host width and explicit vertical height, and apply one rounded clipping contract to every layout.
- [x] Verify basic, vertical, keyboard, and card-label cases in a real dark-theme browser session.
