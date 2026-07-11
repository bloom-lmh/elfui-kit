import { defineHtml, defineProps, defineStyle, html } from "elfui";

import styles from "./style.scss?inline";
import type { StatisticProps, StatisticSlots } from "./types";

export type { StatisticProps, StatisticSlots } from "./types";

const props = defineProps<StatisticProps>({
  value: { type: Number, default: 0 },
  title: { type: String, default: "" },
  prefix: { type: String, default: "" },
  suffix: { type: String, default: "" },
  precision: { type: Number, default: undefined },
  groupSeparator: { type: String, default: "," },
  decimalSeparator: { type: String, default: "." }
});

const formatted = (): string => {
  const value = Number(props.value) || 0;
  const precision = Number.isInteger(Number(props.precision)) ? Number(props.precision) : undefined;
  const raw = precision === undefined ? String(value) : value.toFixed(precision);
  const [int, decimal] = raw.split(".");
  const grouped = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator || ",");
  return decimal ? `${grouped}${props.decimalSeparator || "."}${decimal}` : grouped;
};

defineStyle(styles);

const Statistic = defineHtml<StatisticProps, Record<string, never>, StatisticSlots>(html`
  <div class="statistic" part="statistic">
    <div v-if=${props.title} class="title" part="title">
      <slot name="title">${props.title}</slot>
    </div>
    <div class="value" part="value">
      <span v-if=${props.prefix} class="prefix"><slot name="prefix">${props.prefix}</slot></span>
      <span class="number">${formatted()}</span>
      <span v-if=${props.suffix} class="suffix"><slot name="suffix">${props.suffix}</slot></span>
    </div>
  </div>
`);

export { Statistic };
