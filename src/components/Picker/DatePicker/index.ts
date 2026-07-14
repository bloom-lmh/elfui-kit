import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useComponents,
  useRef,
  watchEffect
} from "elfui";

import { Calendar } from "../Calendar";
import styles from "./style.scss?inline";
import type { DatePickerType, DatePickerValue, DateShortcut } from "./types";

export type { DatePickerProps, DatePickerType, DatePickerValue, DateShortcut } from "./types";

const props = defineProps({
  modelValue: { type: null, default: "" },
  endValue: { type: String, default: "" },
  type: { type: String, default: "date" },
  range: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  actions: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  header: { type: String, default: "" },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  placeholder: { type: String, default: "选择日期" },
  endPlaceholder: { type: String, default: "结束日期" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  shortcuts: { type: Array, default: () => [] },
  confirmText: { type: String, default: "确定" },
  cancelText: { type: String, default: "取消" },
  clearText: { type: String, default: "清空" }
});

const emit = defineEmits<{
  "update:modelValue": [DatePickerValue];
  "update:endValue": [string];
  change: [DatePickerValue];
  clear: [];
  confirm: [DatePickerValue];
  cancel: [];
}>();

useComponents({ "date-picker-calendar": Calendar });

const start = useRef("");
const end = useRef("");
const selected = useRef<string[]>([]);
const open = useRef(false);
const monthYear = useRef(new Date().getFullYear());

const readModelValue = (): DatePickerValue => props.modelValue as DatePickerValue;

const toValues = (value: DatePickerValue): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const resetDraft = (): void => {
  const value = readModelValue();
  if (props.multiple) {
    const values = toValues(value);
    selected.set(values);
    start.set(values[0] ?? "");
  } else {
    start.set(String(value || ""));
    selected.set([]);
  }
  end.set(String(props.endValue || ""));
  const year = Number(String(start.peek() || "").slice(0, 4));
  if (Number.isFinite(year) && year > 0) monthYear.set(year);
};

watchEffect(resetDraft);

const inputType = (): DatePickerType => {
  const type = props.type as DatePickerType;
  return type === "datetime-local" || type === "month" || type === "week" ? type : "date";
};

const usesNativeField = (): boolean => inputType() === "datetime-local" || inputType() === "week";

const shortcutItems = (): DateShortcut[] =>
  Array.isArray(props.shortcuts) ? (props.shortcuts as DateShortcut[]) : [];

const shortcutValue = (value: string | (() => string)): string =>
  typeof value === "function" ? value() : value;

const inRange = (value: string): boolean => {
  if (!value) return false;
  if (props.min && value < String(props.min)) return false;
  if (props.max && value > String(props.max)) return false;
  return true;
};

const currentValue = (): DatePickerValue => {
  if (props.multiple) return [...selected.value];
  if (props.range) return [start.value, end.value];
  return start.value;
};

const emitCurrent = (): DatePickerValue => {
  const value = currentValue();
  emit("update:modelValue", props.multiple ? value : start.value);
  if (props.range) emit("update:endValue", end.value);
  emit("change", value);
  return value;
};

const commitIfNeeded = (): void => {
  if (!props.actions) emitCurrent();
};

const setStart = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  start.set(value);
  commitIfNeeded();
};

const setEnd = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  end.set(value);
  commitIfNeeded();
};

const toggleMultiple = (value: string): void => {
  if (props.disabled || !inRange(value)) return;
  selected.set(
    selected.value.includes(value)
      ? selected.value.filter((item) => item !== value)
      : [...selected.value, value].sort()
  );
  start.set(value);
  commitIfNeeded();
};

const toggleOpen = (): void => {
  if (props.disabled || usesNativeField()) return;
  open.set(!open.peek());
};

const closePanel = (): void => open.set(false);

const onNativeStart = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value;
  if (props.multiple) toggleMultiple(value);
  else setStart(value);
};

const onNativeEnd = (event: Event): void => setEnd((event.target as HTMLInputElement).value);

const calendarValue = (): DatePickerValue => {
  if (props.range) return [start.value, end.value].filter(Boolean);
  return start.value;
};

const calendarDisabled = (date: Date): boolean => {
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return !inRange(value);
};

const onCalendarUpdate = (event: CustomEvent): void => {
  const detail = event.detail;
  if (props.multiple) {
    toggleMultiple(String(detail || ""));
    return;
  }
  if (props.range && Array.isArray(detail)) {
    start.set(String(detail[0] || ""));
    end.set(String(detail[1] || ""));
    commitIfNeeded();
    if (!props.actions) closePanel();
    return;
  }
  setStart(String(detail || ""));
  if (!props.actions) closePanel();
};

const monthItems = (): Array<{ id: string; label: string; active: boolean }> =>
  Array.from({ length: 12 }, (_, month) => {
    const id = `${monthYear.value}-${String(month + 1).padStart(2, "0")}`;
    return {
      id,
      label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(
        new Date(monthYear.value, month, 1)
      ),
      active: start.value === id
    };
  });

const selectMonth = (event: Event): void => {
  const value = (event.currentTarget as HTMLElement).dataset.month || "";
  setStart(value);
  if (!props.actions) closePanel();
};

const shiftMonthYear = (offset: number): void => monthYear.set(monthYear.value + offset);

const applyShortcut = (shortcut: DateShortcut): void => {
  if (props.disabled) return;
  const nextStart = shortcutValue(shortcut.value);
  const nextEnd = shortcut.endValue ? shortcutValue(shortcut.endValue) : nextStart;
  if (!inRange(nextStart) || (props.range && !inRange(nextEnd))) return;
  if (props.multiple) toggleMultiple(nextStart);
  else {
    start.set(nextStart);
    end.set(nextEnd);
    commitIfNeeded();
  }
};

const clear = (): void => {
  if (props.disabled) return;
  start.set("");
  end.set("");
  selected.set([]);
  emit("update:modelValue", props.multiple ? [] : "");
  emit("update:endValue", "");
  emit("change", props.multiple ? [] : props.range ? ["", ""] : "");
  emit("clear");
};

const confirm = (): void => {
  if (props.disabled) return;
  const value = emitCurrent();
  emit("confirm", value);
  closePanel();
};

const cancel = (): void => {
  if (props.disabled) return;
  resetDraft();
  emit("cancel");
  closePanel();
};

const removeValue = (value: string): void => {
  if (props.disabled) return;
  selected.set(selected.value.filter((item) => item !== value));
  commitIfNeeded();
};

const hasValue = (): boolean => Boolean(start.value || end.value || selected.value.length);

const displayValue = (): string => {
  if (props.multiple)
    return selected.value.length ? `已选择 ${selected.value.length} 个日期` : props.placeholder;
  if (props.range)
    return start.value || end.value
      ? `${start.value || props.placeholder} — ${end.value || props.endPlaceholder}`
      : `${props.placeholder} — ${props.endPlaceholder}`;
  return start.value || props.placeholder;
};

const headerText = (): string => {
  if (props.header) return String(props.header);
  if (props.multiple) return "多日期选择";
  if (props.range) return "日期范围";
  return inputType() === "month" ? "选择月份" : "选择日期";
};

defineStyle(styles);

const DatePicker = defineHtml(html`
  <div
    :class=${[
      "date-picker",
      {
        "is-disabled": props.disabled,
        "is-open": open.value,
        "is-range": props.range && !props.multiple,
        "is-multiple": props.multiple,
        "has-actions": props.actions
      }
    ]}
  >
    <div v-if=${props.showHeader} class="header">
      <span class="header-title">${headerText()}</span>
      <span class="header-type">${inputType()}</span>
    </div>

    <div class="controls">
      <template v-if=${usesNativeField()}>
        <input
          class="field"
          :type=${inputType()}
          :value.prop=${start}
          :min=${props.min}
          :max=${props.max}
          :placeholder=${props.placeholder}
          :disabled=${props.disabled}
          @change=${onNativeStart}
        />
        <span v-if=${props.range && !props.multiple} class="separator">至</span>
        <input
          v-if=${props.range && !props.multiple}
          class="field"
          :type=${inputType()}
          :value.prop=${end}
          :min=${props.min}
          :max=${props.max}
          :placeholder=${props.endPlaceholder}
          :disabled=${props.disabled}
          @change=${onNativeEnd}
        />
      </template>
      <button
        v-else
        type="button"
        class="field-trigger"
        role="combobox"
        :aria-expanded=${open.value ? "true" : "false"}
        :disabled=${props.disabled}
        @click=${toggleOpen}
      >
        <span class="calendar-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !hasValue() }]}>${displayValue()}</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>
      <button v-if=${props.clearable && hasValue()} type="button" class="clear" @click=${clear}>
        ${props.clearText}
      </button>
    </div>

    <div v-if=${props.multiple} class="chips" aria-live="polite">
      <button
        v-for="value in selected.value"
        :key="value"
        type="button"
        class="chip"
        @click="removeValue(value)"
      >
        <span>{{ value }}</span><span aria-hidden="true">×</span>
      </button>
    </div>

    <div v-if=${open.value} class="panel">
      <div v-if=${inputType() === "month"} class="month-panel">
        <div class="month-nav">
          <button type="button" @click=${() => shiftMonthYear(-1)}>‹</button>
          <strong>{{ monthYear }}年</strong>
          <button type="button" @click=${() => shiftMonthYear(1)}>›</button>
        </div>
        <div class="month-grid">
          <button
            v-for="month in monthItems()"
            :key="month.id"
            type="button"
            :class=${["month-option", { "is-active": month.active }]}
            :data-month="month.id"
            @click=${selectMonth}
          >{{ month.label }}</button>
        </div>
      </div>
      <date-picker-calendar
        v-else
        :modelValue.prop=${calendarValue()}
        :range=${props.range}
        :disabledDate.prop=${calendarDisabled}
        @update:modelValue=${onCalendarUpdate}
      ></date-picker-calendar>

      <div v-if=${shortcutItems().length > 0} class="shortcuts">
        <button
          v-for="item in shortcutItems()"
          :key="item.label"
          type="button"
          class="shortcut"
          @click="applyShortcut(item)"
        >{{ item.label }}</button>
      </div>

      <div v-if=${props.actions} class="actions">
        <button v-if=${props.clearable} type="button" class="text-action" @click=${clear}>
          ${props.clearText}
        </button>
        <span class="actions-spacer"></span>
        <button type="button" class="text-action" @click=${cancel}>${props.cancelText}</button>
        <button type="button" class="primary-action" @click=${confirm}>${props.confirmText}</button>
      </div>
    </div>
  </div>
`);

export { DatePicker };
