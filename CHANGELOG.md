# Changelog

All notable changes to `@elfui/kit` are recorded here. Dates use the Asia/Shanghai release date.

## [0.0.2-beta.9] - 2026-09-07

### Fixed

- Centre route-loading feedback across the full documentation viewport instead of only the main content region.
- Correct outlined field geometry so the visible top stroke is not lowered by the floating-label legend.
- Vertically align Autocomplete placeholders and clear icons in resting and focused states.
- Vertically align Select placeholders, values, clear actions, and arrows with symmetric control padding.

### Quality

- Add regression coverage for fullscreen route loading and outlined Input, Autocomplete, and Select alignment.
- Require every release version to have a changelog entry before publishing.

## [0.0.2-beta.8] - 2026-09-06

### Changed

- Make release verification independent from the package-manager cache used by the publishing runner.
- Publish the integration and native-form changes prepared in `0.0.2-beta.7` to the npm `beta` channel.

## [0.0.2-beta.7] - 2026-09-06

### Added

- Add the native form-control protocol and release contract gates.
- Add repository baselines and dependency-graph checks for architecture ownership.

### Fixed

- Complete Button, Menu, Form, Input, and Textarea integration fixes and strengthen their regression coverage.

> This version was tagged in Git but was not published to npm; its changes were included in `0.0.2-beta.8`.

## [0.0.2-beta.6] - 2026-09-06

### Fixed

- Harden Form, Router, and package integration behavior.
- Restore reactive locale switching in the production documentation site.
- Align Kit with the Router beta used by the documentation application.

## [0.0.2-beta.5] - 2026-08-11

### Changed

- Refresh the Kit prerelease baseline after the documentation locale fixes.

## [0.0.2-beta.4] - 2026-08-10

### Fixed

- Publish from the package directory so npm lifecycle checks run against the correct package.
- Align repository metadata for npm provenance and surface publishing errors in the release log.

## [0.0.2-beta.3] - 2026-08-09

### Added

- Unify local, on-demand, and full component registration behind the root package contract.
- Include the global token and utility layer when all components are registered.

### Fixed

- Preserve production component registration and Core runtime coherence in the documentation site.

## [0.0.2-beta.2] - 2026-08-07

### Changed

- Remove the retired DocSync component, page, and tests from the Kit documentation application.

## [0.0.2-beta.1] - 2026-08-07

### Added

- Publish the initial split Kit package and documentation workspace.
- Add the component system, AI and Labs suites, package checks, and refreshed getting-started documentation.

[0.0.2-beta.9]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.8...v0.0.2-beta.9
[0.0.2-beta.8]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.7...v0.0.2-beta.8
[0.0.2-beta.7]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.6...v0.0.2-beta.7
[0.0.2-beta.6]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.5...v0.0.2-beta.6
[0.0.2-beta.5]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.4...v0.0.2-beta.5
[0.0.2-beta.4]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.3...v0.0.2-beta.4
[0.0.2-beta.3]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.2...v0.0.2-beta.3
[0.0.2-beta.2]: https://github.com/bloom-lmh/ElfUI-Kit/compare/v0.0.2-beta.1...v0.0.2-beta.2
[0.0.2-beta.1]: https://github.com/bloom-lmh/ElfUI-Kit/releases/tag/v0.0.2-beta.1
