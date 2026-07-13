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

- [ ] P1 Add the `card` type only together with a dedicated CarouselItem layout contract; scaling arbitrary slotted nodes would be an unreliable imitation.
- [ ] P1 Add a CarouselItem component so `label` is typed and can supply a11y metadata rather than relying on an optional child attribute.
- [ ] P2 Add browser-level visual regression coverage for vertical and outside-indicator layouts.
