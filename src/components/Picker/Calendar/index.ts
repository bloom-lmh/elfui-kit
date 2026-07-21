import { defineEmits, defineHtml, defineProps, defineStyle, html, useHost, useRef, watchEffect } from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
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

type CalendarView = "days" | "months" | "years";

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
const locale = useLocaleProvider();

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
const focusedIso = useRef(toIso(selectedDate()));
const rangeStart = useRef<string | null>(null);
const committedRange = useRef<string[]>(
    Array.isArray(props.modelValue) ? props.modelValue.map(String).filter(Boolean).sort() : [],
);
const view = useRef<CalendarView>("days");
const yearPageStart = useRef(Math.floor(selectedDate().getFullYear() / 12) * 12);
let syncedModelValue = "__elf-calendar-unset__";
let pendingModelValue = "";
let pendingModelToken = 0;

const expectModelValue = (value: string | string[]): void => {
    pendingModelValue = JSON.stringify(value);
    const token = ++pendingModelToken;
    window.setTimeout(() => {
        if (token === pendingModelToken) pendingModelValue = "";
    }, 80);
};

const resolvedLocale = (): string => props.locale || locale.name;

const syncSelectedDom = (iso: string): void => {
    host.shadowRoot?.querySelectorAll<HTMLElement>(".day").forEach((element) => {
        const selected = element.dataset.date === iso;
        element.classList.toggle("is-current", selected);
        element.setAttribute("aria-selected", selected ? "true" : "false");
    });
};

const syncRangeDraftDom = (iso: string): void => {
    host.shadowRoot?.querySelectorAll<HTMLElement>(".day").forEach((element) => {
        const isStart = element.dataset.date === iso;
        element.classList.remove("is-current", "is-range-end", "is-in-range");
        element.classList.toggle("is-range-start", isStart);
        element.setAttribute("aria-selected", isStart ? "true" : "false");
    });
};

watchEffect(() => {
    const signature = JSON.stringify(props.modelValue ?? "");
    if (pendingModelValue && signature !== pendingModelValue) return;
    if (signature === pendingModelValue) pendingModelValue = "";
    if (signature === syncedModelValue) return;
    syncedModelValue = signature;
    const selected = selectedDate();
    selectedIso.set(toIso(selected));
    committedRange.set(Array.isArray(props.modelValue) ? props.modelValue.map(String).filter(Boolean).sort() : []);
    rangeStart.set(null);
    focusedIso.set(toIso(selected));
    viewedDate.set(selected);
    yearPageStart.set(Math.floor(selected.getFullYear() / 12) * 12);
    queueMicrotask(() => {
        if (!props.range) syncSelectedDom(selectedIso.peek());
    });
});

const monthTitle = (): string => {
    const date = viewedDate.value;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

const yearTitle = (): string => locale.t("calendar.year", { year: viewedDate.value.getFullYear() });

const monthLabel = (): string =>
    resolvedLocale().toLowerCase().startsWith("zh")
        ? locale.t("calendar.month", { month: viewedDate.value.getMonth() + 1 })
        : new Intl.DateTimeFormat(resolvedLocale(), { month: "long" }).format(viewedDate.value);

const monthItems = (): Array<{ id: number; label: string; active: boolean }> =>
    Array.from({ length: 12 }, (_, month) => ({
        id: month,
        label: new Intl.DateTimeFormat(resolvedLocale(), { month: "short" }).format(
            new Date(viewedDate.value.getFullYear(), month, 1),
        ),
        active: month === viewedDate.value.getMonth(),
    }));

const yearItems = (): Array<{ id: number; active: boolean }> =>
    Array.from({ length: 12 }, (_, index) => {
        const id = yearPageStart.value + index;
        return { id, active: id === viewedDate.value.getFullYear() };
    });

const yearRangeTitle = (): string => `${yearPageStart.value}–${yearPageStart.value + 11}`;

const weekDays = (): string[] => {
    const formatter = new Intl.DateTimeFormat(resolvedLocale(), { weekday: "short" });
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
        const value = committedRange.value;
        const pendingRangeStart = rangeStart.value;
        const rangeStartValue = pendingRangeStart || value[0] || "";
        // A new first click starts a fresh draft. Keeping the committed end here
        // would visually connect the new start to the previous range.
        const rangeEndValue = pendingRangeStart ? "" : value[1] || "";
        return {
            iso,
            label: date.getDate(),
            muted: date.getMonth() !== current.getMonth(),
            current: !props.range && iso === selectedIso.value,
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
    focusedIso.set(iso);
    if (days().find((day) => day.iso === iso)?.disabled) return;
    if (props.range) {
        const start = rangeStart.value;
        if (!start || start === iso) {
            rangeStart.set(iso);
            syncRangeDraftDom(iso);
            return;
        }
        const value = start < iso ? [start, iso] : [iso, start];
        rangeStart.set(null);
        committedRange.set(value);
        expectModelValue(value);
        emit("update:modelValue", value);
        emit("change", value);
        return;
    }
    selectedIso.set(iso);
    syncSelectedDom(iso);
    expectModelValue(iso);
    emit("update:modelValue", iso);
    emit("change", iso);
};

const focusDay = (date: Date): void => {
    const iso = toIso(date);
    focusedIso.set(iso);
    viewedDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
    queueMicrotask(() => {
        host.shadowRoot?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus();
    });
};

const onDayFocus = (event: Event): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (iso) focusedIso.set(iso);
};

const onDayKeydown = (event: KeyboardEvent): void => {
    const iso = (event.currentTarget as HTMLElement).dataset.date;
    if (!iso) return;
    const current = parseDate(iso);
    const next = new Date(current);
    const firstDay = Math.max(0, Math.min(6, Number(props.firstDayOfWeek) || 0));

    if (event.key === "ArrowLeft") next.setDate(current.getDate() - 1);
    else if (event.key === "ArrowRight") next.setDate(current.getDate() + 1);
    else if (event.key === "ArrowUp") next.setDate(current.getDate() - 7);
    else if (event.key === "ArrowDown") next.setDate(current.getDate() + 7);
    else if (event.key === "Home") next.setDate(current.getDate() - ((current.getDay() - firstDay + 7) % 7));
    else if (event.key === "End") next.setDate(current.getDate() + ((firstDay + 6 - current.getDay() + 7) % 7));
    else if (event.key === "PageUp" || event.key === "PageDown") {
        const monthOffset = event.key === "PageUp" ? -1 : 1;
        const targetMonth = new Date(current.getFullYear(), current.getMonth() + monthOffset, 1);
        const finalDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
        next.setFullYear(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(current.getDate(), finalDay));
    } else return;

    event.preventDefault();
    focusDay(next);
};

const shiftMonth = (offset: number): void => {
    const date = viewedDate.value;
    viewedDate.set(new Date(date.getFullYear(), date.getMonth() + offset, 1));
};

const shiftPeriod = (offset: number): void => {
    const date = viewedDate.value;
    if (view.value === "days") {
        shiftMonth(offset);
        return;
    }
    if (view.value === "months") {
        viewedDate.set(new Date(date.getFullYear() + offset, date.getMonth(), 1));
        return;
    }
    yearPageStart.set(yearPageStart.value + offset * 12);
};

const showDays = (): void => view.set("days");

const showMonths = (): void => view.set(view.value === "months" ? "days" : "months");

const showYears = (): void => {
    yearPageStart.set(Math.floor(viewedDate.value.getFullYear() / 12) * 12);
    view.set(view.value === "years" ? "days" : "years");
};

const selectMonth = (event: Event): void => {
    const month = Number((event.currentTarget as HTMLElement).dataset.month);
    if (!Number.isFinite(month)) return;
    const date = viewedDate.value;
    viewedDate.set(new Date(date.getFullYear(), month, 1));
    showDays();
};

const selectYear = (event: Event): void => {
    const year = Number((event.currentTarget as HTMLElement).dataset.year);
    if (!Number.isFinite(year)) return;
    const date = viewedDate.value;
    viewedDate.set(new Date(year, date.getMonth(), 1));
    view.set("months");
};

defineStyle(styles);

const Calendar = defineHtml<CalendarProps>(html`
    <section class="calendar" part="calendar">
        <header class="header">
            <button class="nav" type="button" :aria-label=${locale.t("calendar.previousPeriod")} @click=${() => shiftPeriod(-1)}>‹</button>
            <div class="header-title">
                <template v-if=${view === "years"}>
                    <span class="period-label">${yearRangeTitle()}</span>
                </template>
                <template v-else>
                    <button class="period-button" type="button" @click=${showYears}>${yearTitle()}</button>
                    <button class="period-button" type="button" @click=${showMonths}>${monthLabel()}</button>
                </template>
            </div>
            <button class="nav" type="button" :aria-label=${locale.t("calendar.nextPeriod")} @click=${() => shiftPeriod(1)}>›</button>
        </header>
        <div v-if=${view === "days"} class="calendar-body">
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
                    :aria-selected="day.current || day.rangeStart || day.rangeEnd ? 'true' : 'false'"
                    :tabindex="day.iso === focusedIso ? 0 : -1"
                    @click=${select}
                    @focus=${onDayFocus}
                    @keydown=${onDayKeydown}
                >
                    {{ day.label }}
                </button>
            </div>
        </div>
        <div v-if=${view === "months"} class="choice-grid month-grid" :aria-label=${locale.t("calendar.selectMonth")}>
            <button
                v-for="option in monthItems()"
                :key="option.id"
                type="button"
                :class="['choice', { 'is-active': option.active }]"
                :data-month="option.id"
                @click=${selectMonth}
            >{{ option.label }}</button>
        </div>
        <div v-if=${view === "years"} class="choice-grid year-grid" :aria-label=${locale.t("calendar.selectYear")}>
            <button
                v-for="option in yearItems()"
                :key="option.id"
                type="button"
                :class="['choice', { 'is-active': option.active }]"
                :data-year="option.id"
                @click=${selectYear}
            >{{ option.id }}</button>
        </div>
        <footer class="calendar-footer">
            <button type="button" class="today-button" @click=${() => { viewedDate.set(new Date()); showDays(); }}>${locale.t("calendar.today")}</button>
            <slot name="header"><span class="month-title">${monthTitle()}</span></slot>
        </footer>
    </section>
`);

export { Calendar };
