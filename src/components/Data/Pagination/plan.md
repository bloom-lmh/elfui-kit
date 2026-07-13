# Pagination alignment plan

## Completed

- [x] Controlled `current-page` and `page-size` paths, with distinct one-time `default-current-page` and `default-page-size` initialization.
- [x] `page-count` precedence over `total`, including page clamping when the available range changes.
- [x] `size` (`small`, `default`, `large`) while retaining the existing `small` compatibility alias.
- [x] `prev-text`, `next-text`, semantic navigation markup, named controls, active-page state, and Enter-to-jump support.
- [x] Page, size, jump, single-page, default-state, explicit-count, and customized-navigation tests.
- [x] API documentation and an interactive default-state / explicit-count example.

## Follow-up

- [ ] P1 `append-size-to`, popper styling, and `teleported` require a shared anchored-overlay primitive; native select intentionally remains in-tree.
- [ ] P1 Support custom previous/next icon nodes after establishing the component icon rendering contract.
- [ ] P2 Add browser visual regression coverage for compact, large, and wrapped layouts.
