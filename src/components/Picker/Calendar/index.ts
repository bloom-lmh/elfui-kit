import { defineEmits, defineHtml, defineProps, defineStyle, html, useHost, useRef, watchEffect } from "elfui";

import styles from "./style.scss?inline";
import type { CalendarProps } from "./types";

export type { CalendarProps } from "./types";

interface DayCell {
    iso: string;
    label: number;
    muted: boolean;
    current: boolean;
    disabled: boolean;
    rangeStart: boolean;
    rangeEnd: boolean;
    inRange: boolean;
}

const props = defineProps<CalendarProps>({
    modelValue: { type: null, default: "" },
    firstDayOfWeek: { type: Number, default: 1 },
    range: { type: Boolean, default: false },
    disabledDate: { type: Function, default: undefined },
    locale: { type: String, default: "" },
    ariaLabel: { type: String, default: "Calendar" },
});

const emit = defineEmits(["update:modelValue", "change"]);
const host = useHost();

const pad = (value: number): string => String(value).padStart(2, "0");
const toIso = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDate = (source: unknown): Date => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(source || ""));
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const value = source ? new Date(String(source)) : new Date();
    return Number.isNaN(value.getTime()) ? new Date() : value;
};

const selectedDate = (): Date => {
    const source = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue;
    return parseDate(source);
};

const viewedDate = useRef(selectedDate());
const selectedIso = useRef(toIso(selectedDate()));
const rangeStart = useRef<string | null>(null);
let syncedModelValue = "__elf-calendar-unset__";

const syncSelectedDom = (iso: string): void => {
    host.shadowRoot?.querySelectorAll<HTMLElement>(".day").forEach((element) => {
        const selected = element.dataset.date === iso;
        element.classList.toggle("is-current", selected);
        element.setAttribute("aria-selected", selected ? "true" : "false");
    });
};

watchEffect(() => {
    const signature = JSON.stringify(props.modelValue ?? "");
    if (signature === syncedModelValue) return;
    syncedModelValue = signature;
    const selected = selectedDate();
    selectedIso.set(toIso(selected));
    viewedDate.set(selected);
    queueMicrotask(() => syncSelectedDom(selectedIso.peek()));
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
        const value = Array.isArray(props.modelValue) ? [...props.modelValue].sort() : [];
        const rangeStartValue = rangeStart.value || value[0] || "";
        const rangeEndValue = value[1] || "";
        return {
            iso,
            label: date.getDate(),
            muted: date.getMonth() !== current.getMonth(),
            current: iso === selectedIso.value,
            disabled: typeof props.disabledDate === "function" && Boolean(props.disabledDate(date)),
            rangeStart: Boolean(rangeStartValue) && iso === rangeStartValue,
            rangeEnd: Boolean(rangeEndValue) && iso === rangeEndValue,
            inRange: Boolean(rangeStartValue && rangeEndValue) && iso > rangeStartValue && iso < rangeEndValue,
        };
    });
};

const select = (event: Event): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (!iso) return;
    if (days().find((day) => day.iso === iso)?.disabled) return;
    if (props.range) {
        const start = rangeStart.value;
        if (!start || start === iso) {
            rangeStart.set(iso);
            return;
        }
        const value = start < iso ? [start, iso] : [iso, start];
        rangeStart.set(null);
        emit("update:modelValue", value);
        emit("change", value);
        return;
    }
    selectedIso.set(iso);
    syncSelectedDom(iso);
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
            <button class="nav" type="button" aria-label="上个月" @click=${() => shiftMonth(-1)}>‹</button>
            <slot name="header">${monthTitle()}</slot>
            <button class="nav" type="button" aria-label="下个月" @click=${() => shiftMonth(1)}>›</button>
        </header>
        <div class="week">
            <span v-for="name in weekDays()" :key="name">{{ name }}</span>
        </div>
        <div class="days" role="grid" :aria-label=${props.ariaLabel || "Calendar"}>
            <button
                v-for="day in days()"
                :key="day.iso"
                type="button"
                :class="['day', { 'is-muted': day.muted, 'is-current': day.current, 'is-disabled': day.disabled, 'is-range-start': day.rangeStart, 'is-range-end': day.rangeEnd, 'is-in-range': day.inRange }]"
                :data-date="day.iso"
                :disabled="day.disabled"
                :aria-label="day.iso"
                :aria-selected="day.current ? 'true' : 'false'"
                @click=${select}
            >
                {{ day.label }}
            </button>
        </div>
    </section>
`);

export { Calendar };
