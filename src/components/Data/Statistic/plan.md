# Statistic / Countdown 对齐计划

更新时间：2026-07-13

- [x] Statistic：数值、标题、前后缀、精度、分隔符、formatter、value-style 与命名 slots。
- [x] 新增独立 `elf-countdown`：目标时间、DD/HH/mm/ss/SSS 格式、字面量、change 与单次 finish 事件。
- [x] Countdown 提供 `role="timer"` 无障碍语义，且清理定时器生命周期。
- [x] 文档案例覆盖统计格式化和倒计时，PropsTable 同步。
- [x] 单测覆盖 Statistic 格式化/slots 和 Countdown 格式边界、事件与 timer 语义。

## 验收记录

- [x] `pnpm test src/components/Data/Statistic/Statistic.test.ts src/components/Data/Countdown/Countdown.test.ts` 通过。
- [x] `pnpm build` 通过。
