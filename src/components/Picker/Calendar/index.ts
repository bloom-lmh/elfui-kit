import { defineEmits, defineHtml, defineProps, defineStyle, html } from "elfui";

import styles from "./style.scss?inline";
import type { CalendarProps } from "./types";

export type { CalendarProps } from "./types";

interface DayCell {
  iso: string;
  label: number;
  muted: boolean;
  current: boolean;
}

const props = defineProps<CalendarProps>({
  modelValue: { type: String, default: "" },
  firstDayOfWeek: { type: Number, default: 1 }
});

const emit = defineEmits(["update:modelValue", "change"]);

const pad = (value: number): string => String(value).padStart(2, "0");
const toIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const selectedDate = (): Date => {
  const value = props.modelValue ? new Date(props.modelValue) : new Date();
  return Number.isNaN(value.getTime()) ? new Date() : value;
};

const monthTitle = (): string => {
  const date = selectedDate();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

const weekDays = (): string[] => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const start = Math.max(0, Math.min(6, Number(props.firstDayOfWeek) || 0));
  return [...names.slice(start), ...names.slice(0, start)];
};

const days = (): DayCell[] => {
  const current = selectedDate();
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
      current: iso === toIso(current)
    };
  });
};

const select = (event: Event): void => {
  const iso = (event.currentTarget as HTMLElement).dataset.date;
  if (!iso) return;
  emit("update:modelValue", iso);
  emit("change", iso);
};

defineStyle(styles);

const Calendar = defineHtml<CalendarProps>(html`
  <section class="calendar" part="calendar">
    <header class="header"><slot name="header">${monthTitle()}</slot></header>
    <div class="week">
      <span v-for="name in weekDays()" :key="name">{{ name }}</span>
    </div>
    <div class="days">
      <button
        v-for="day in days()"
        :key="day.iso"
        type="button"
        :class="['day', { 'is-muted': day.muted, 'is-current': day.current }]"
        :data-date="day.iso"
        @click=${select}
      >
        {{ day.label }}
      </button>
    </div>
  </section>
`);

export { Calendar };
