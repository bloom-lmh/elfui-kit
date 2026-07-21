# Carousel alignment plan

## 2026-07-21 image fill regression

- [x] Keep the host transparent when indicators are outside the viewport so the reserved area does not render as a gray band.
- [x] Make slotted images, pictures, and videos fill CarouselItem cards with `object-fit: cover`.

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
- [x] P2 Add browser-level visual regression coverage for vertical and outside-indicator layouts.

## 2026-07-14 regression

- [x] Restore card labels, guarantee 100% host width and explicit vertical height, and apply one rounded clipping contract to every layout.
- [x] Verify basic, vertical, keyboard, and card-label cases in a real dark-theme browser session.
- [x] 2026-07-15: added a dedicated outside-indicator example, fixed indicators being clipped by the carousel viewport, passed 10 focused tests, and verified vertical/outside screenshots with no browser console errors.

## 2026-07-21 detail-quality regression

- [x] Use inert leading/trailing clones for a seamless loop transition, then reset the visual index after `transitionend` without animation.
- [x] Support horizontal and vertical pointer swipes while preserving click/tap interactions.
- [x] Unify every demo at the same responsive 1000 × 400 maximum viewport and use real, lazy-decoded images in every variant.
- [x] Verify desktop loop boundaries, vertical/card sizing, native lazy-loading attributes, and 390 px mobile overflow in a real browser.
