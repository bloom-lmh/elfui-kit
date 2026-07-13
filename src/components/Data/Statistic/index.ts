import { defineHtml, defineProps, defineStyle, html, useComputed, useRef } from "elfui";

import styles from "./style.scss?inline";
import type { StatisticProps, StatisticSlots } from "./types";

export type { StatisticProps, StatisticSlots } from "./types";

const props = defineProps<StatisticProps>({
  value: { type: Number, default: 0 },
  title: { type: String, default: "" },
  prefix: { type: String, default: "" },
  suffix: { type: String, default: "" },
  precision: { type: Number, default: undefined },
  formatter: { type: Function, default: undefined },
  groupSeparator: { type: String, default: "," },
  decimalSeparator: { type: String, default: "." },
  valueStyle: { type: Object, default: () => ({}) }
});

const formatted = (): string => {
  const value = Number(props.value) || 0;
  if (typeof props.formatter === "function") return props.formatter(value);
  const precision = Number.isInteger(Number(props.precision)) ? Number(props.precision) : undefined;
  const raw = precision === undefined ? String(value) : value.toFixed(precision);
  const [int, decimal] = raw.split(".");
  const grouped = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator || ",");
  return decimal ? `${grouped}${props.decimalSeparator || "."}${decimal}` : grouped;
};

const hasTitleSlot = useRef(false);
const hasPrefixSlot = useRef(false);
const hasSuffixSlot = useRef(false);

const hasContent = (event: Event): boolean => {
  const slot = event.target as HTMLSlotElement;
  return slot.assignedNodes().some((node) => (node.textContent?.trim() ?? "") !== "");
};

const onSlotChange = (target: "title" | "prefix" | "suffix") => (event: Event): void => {
  const value = hasContent(event);
  if (target === "title") hasTitleSlot.set(value);
  if (target === "prefix") hasPrefixSlot.set(value);
  if (target === "suffix") hasSuffixSlot.set(value);
};

const showTitle = useComputed(() => Boolean(props.title || hasTitleSlot.value));
const showPrefix = useComputed(() => Boolean(props.prefix || hasPrefixSlot.value));
const showSuffix = useComputed(() => Boolean(props.suffix || hasSuffixSlot.value));

defineStyle(styles);

const Statistic = defineHtml<StatisticProps, Record<string, never>, StatisticSlots>(html`
  <div class="statistic" part="statistic">
    <div v-show=${showTitle} class="title" part="title">
      <slot name="title" @slotchange=${onSlotChange("title")}>${props.title}</slot>
    </div>
    <div class="value" part="value" :style=${props.valueStyle}>
      <span v-show=${showPrefix} class="prefix"><slot name="prefix" @slotchange=${onSlotChange("prefix")}>${props.prefix}</slot></span>
      <span class="number">${formatted()}</span>
      <span v-show=${showSuffix} class="suffix"><slot name="suffix" @slotchange=${onSlotChange("suffix")}>${props.suffix}</slot></span>
    </div>
  </div>
`);

export { Statistic };
