import { defineEmits, defineHtml, defineProps, defineStyle, html, useRef, watchEffect } from "elfui";

import styles from "./style.scss?inline";
import type { CalendarProps } from "./types";

export type { CalendarProps } from "./types";

interface DayCell {
  iso: string;
  label: number;
  muted: boolean;
  current: boolean;
  disabled: boolean;
}

const props = defineProps<CalendarProps>({
  modelValue: { type: String, default: "" },
  firstDayOfWeek: { type: Number, default: 1 },
  disabledDate: { type: Function, default: undefined },
  locale: { type: String, default: "" },
  ariaLabel: { type: String, default: "Calendar" }
});

const emit = defineEmits(["update:modelValue", "change"]);

const pad = (value: number): string => String(value).padStart(2, "0");
const toIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const selectedDate = (): Date => {
  const value = props.modelValue ? new Date(props.modelValue) : new Date();
  return Number.isNaN(value.getTime()) ? new Date() : value;
};

const viewedDate = useRef(selectedDate());

watchEffect(() => {
  props.modelValue;
  viewedDate.set(selectedDate());
});

const monthTitle = (): string => {
  const date = viewedDate.value;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

const weekDays = (): string[] => {
  const formatter = new Intl.DateTimeFormat(props.locale || undefined, { weekday: "short" });
  const sunday = new Date(2023, 0, 1);
  const names = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    return formatter.format(date);
  });
  const start = Math.max(0, Math.min(6, Number(props.firstDayOfWeek) || 0));
  return [...names.slice(start), ...names.slice(0, start)];
};

const days = (): DayCell[] => {
  const current = viewedDate.value;
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const startOffset = (first.getDay() - (Number(props.firstDayOfWeek) || 0) + 7) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = toIso(date);
    return {
      iso,
      label: date.getDate(),
      muted: date.getMonth() !== current.getMonth(),
      current: iso === toIso(selectedDate()),
      disabled: typeof props.disabledDate === "function" && Boolean(props.disabledDate(date))
    };
  });
};

const select = (event: Event): void => {
  const iso = (event.currentTarget as HTMLElement).dataset.date;
  if (!iso) return;
  if (days().find((day) => day.iso === iso)?.disabled) return;
  emit("update:modelValue", iso);
  emit("change", iso);
};

const shiftMonth = (offset: number): void => {
  const date = viewedDate.value;
  viewedDate.set(new Date(date.getFullYear(), date.getMonth() + offset, 1));
};

defineStyle(styles);

const Calendar = defineHtml<CalendarProps>(html`
  <section class="calendar" part="calendar">
    <header class="header">
      <button class="nav" type="button" aria-label="Previous month" @click=${() => shiftMonth(-1)}>‹</button>
      <slot name="header">${monthTitle()}</slot>
      <button class="nav" type="button" aria-label="Next month" @click=${() => shiftMonth(1)}>›</button>
    </header>
    <div class="week">
      <span v-for="name in weekDays()" :key="name">{{ name }}</span>
    </div>
    <div class="days" role="grid" :aria-label=${props.ariaLabel || "Calendar"}>
      <button
        v-for="day in days()"
        :key="day.iso"
        type="button"
        :class="['day', { 'is-muted': day.muted, 'is-current': day.current, 'is-disabled': day.disabled }]"
        :data-date="day.iso"
        :disabled="day.disabled"
        :aria-label="day.iso"
        @click=${select}
      >
        {{ day.label }}
      </button>
    </div>
  </section>
`);

export { Calendar };
