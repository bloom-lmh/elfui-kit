# Transfer alignment plan

## Completed

- [x] Source/target controlled data flow, selectable disabled records, panel headers, filters, and transfer controls.
- [x] `filter-method`, `target-order`, `button-texts`, count `format`, and left/right default checked keys.
- [x] `change`, `left-check-change`, and `right-check-change` payloads alongside `update:modelValue`.
- [x] Named `left-footer`, `right-footer`, `left-empty`, and `right-empty` slots plus `clearQuery`, `leftPanel`, and `rightPanel` exposes.
- [x] Filter, disabled, default-check, ordering, migration-event, and public-control tests plus documentation examples.

## Follow-up

- [ ] P1 Add virtual scrolling and `item-size` together with a measured-list primitive; simple DOM truncation would break keyboard and checkbox behavior.
- [ ] P1 Add a typed render-content contract after scoped-slot behavior across repeated macro templates is established.
- [ ] P2 Add browser visual regression coverage for long labels, custom panel footers, and narrow layouts.
