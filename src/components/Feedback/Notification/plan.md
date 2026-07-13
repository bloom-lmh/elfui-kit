# Notification alignment plan

## Completed

- [x] Typed service API, four positions, timed/manual close, stacking and `closeAll`.
- [x] `appendTo` selector/element resolution with a safe body fallback.
- [x] `customClass`, `zIndex`, `offset`, `showClose`, `closeIcon`, custom icon glyph, `onClick`, and once-only `onClose` support.
- [x] Per-position stack reflow honors the first notification's configured offset.
- [x] Accessible status announcement and a labeled keyboard-focusable close button.
- [x] Documentation example and target tests for service options and lifecycle behavior.

## Follow-up

- [ ] P1 Add a safe rich-content renderer only after defining a trusted-content policy; `dangerouslyUseHTMLString` will not be added as an unbounded HTML injection path.
- [ ] P2 Add browser visual regression coverage for all four corners and large close labels.
