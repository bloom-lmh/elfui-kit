# Transfer alignment plan

## 2026-07-20 responsive action direction

- [x] Replace ordinary arrow characters with accessible inline SVG action icons.
- [x] Point actions right/left in the horizontal layout and down/up after the container switches to a vertical stack.
- [x] Preserve custom button text and cover both default icons and text overrides with tests.

## 2026-07-19 窄容器回归
- [x] 验证长标签、Panel Footer 与纵向窄容器布局完整显示
- [x] 修复纵向容器查询中 `flex-basis: 0` 导致的固有高度坍缩，面板内容与 footer 均参与宿主高度计算

## 2026-07-17 regression completion

- [x] Prevent panel flex-basis collapse with a full-width host, stable desktop panel minimums, and a zero-minimum narrow layout.
- [x] Repair the basic controlled examples and API tables to use explicit macro property bindings.

## Completed

- [x] Source/target controlled data flow, selectable disabled records, panel headers, filters, and transfer controls.
- [x] `filter-method`, `target-order`, `button-texts`, count `format`, and left/right default checked keys.
- [x] `change`, `left-check-change`, and `right-check-change` payloads alongside `update:modelValue`.
- [x] Named `left-footer`, `right-footer`, `left-empty`, and `right-empty` slots plus `clearQuery`, `leftPanel`, and `rightPanel` exposes.
- [x] Filter, disabled, default-check, ordering, migration-event, and public-control tests plus documentation examples.

## Follow-up

- [ ] P1 Add virtual scrolling and `item-size` together with a measured-list primitive; simple DOM truncation would break keyboard and checkbox behavior.
- [ ] P1 Add a typed render-content contract after scoped-slot behavior across repeated macro templates is established.
- [x] P2 Add browser visual regression coverage for long labels, custom panel footers, and narrow layouts.

## 2026-07-15 visual acceptance

- [x] Added a 520px container-query example with long labels and both panel footers; fixed zero-width shrinkage in the demo and added a vertical narrow-layout contract.
- [x] Passed 8 focused tests and the production build; browser measured 520px with `flex-direction: column`, screenshot reviewed, console error count 0.
