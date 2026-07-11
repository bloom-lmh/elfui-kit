import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

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

const start = useRef("");
const end = useRef("");
const selected = useRef<string[]>([]);

const readModelValue = (): DatePickerValue => props.modelValue as DatePickerValue;

const toValues = (value: DatePickerValue): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return [];
  return String(value)
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
    end.set("");
    return;
  }
  start.set(String(value || ""));
  end.set(String(props.endValue || ""));
  selected.set([]);
};

watchEffect(resetDraft);

const inputType = (): DatePickerType => {
  const t = props.type as DatePickerType;
  return t === "datetime-local" || t === "month" || t === "week" ? t : "date";
};

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
  if (props.multiple) {
    emit("update:modelValue", value);
  } else {
    emit("update:modelValue", start.value);
    if (props.range) emit("update:endValue", end.value);
  }
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
  const exists = selected.value.includes(value);
  const next = exists
    ? selected.value.filter((item) => item !== value)
    : [...selected.value, value];
  selected.set(next);
  start.set(value);
  commitIfNeeded();
};

const onStart = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value;
  if (props.multiple) toggleMultiple(value);
  else setStart(value);
};

const onEnd = (event: Event): void => setEnd((event.target as HTMLInputElement).value);

const applyShortcut = (shortcut: DateShortcut): void => {
  if (props.disabled) return;
  const nextStart = shortcutValue(shortcut.value);
  const nextEnd = shortcut.endValue ? shortcutValue(shortcut.endValue) : nextStart;
  if (!inRange(nextStart) || (props.range && !inRange(nextEnd))) return;
  if (props.multiple) {
    const next = selected.value.includes(nextStart)
      ? selected.value.filter((item) => item !== nextStart)
      : [...selected.value, nextStart];
    selected.set(next);
    start.set(nextStart);
  } else {
    start.set(nextStart);
    end.set(nextEnd);
  }
  commitIfNeeded();
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
};

const cancel = (): void => {
  if (props.disabled) return;
  resetDraft();
  emit("cancel");
};

const removeValue = (value: string): void => {
  if (props.disabled) return;
  selected.set(selected.value.filter((item) => item !== value));
  commitIfNeeded();
};

const hasValue = (): boolean => Boolean(start.value || end.value || selected.value.length);

const selectedValues = (): string[] => selected.value;

const headerText = (): string => {
  if (props.header) return String(props.header);
  if (props.multiple)
    return selected.value.length ? `已选择 ${selected.value.length} 项` : "多日期选择";
  if (props.range) return start.value && end.value ? `${start.value} 至 ${end.value}` : "日期范围";
  return start.value || (inputType() === "month" ? "月份选择" : "日期选择");
};

defineStyle(styles);

const DatePicker = defineHtml(html`
  <div
    :class=${[
      "date-picker",
      {
        "is-disabled": props.disabled,
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
      <input
        class="field"
        :type=${inputType()}
        :value.prop=${start}
        :min=${props.min}
        :max=${props.max}
        :placeholder=${props.placeholder}
        :disabled=${props.disabled}
        @change=${onStart}
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
        @change=${onEnd}
      />
      <button
        v-if=${props.clearable && hasValue() && !props.actions}
        type="button"
        class="clear"
        @click=${clear()}
      >
        ${props.clearText}
      </button>
    </div>

    <div v-if=${props.multiple && selectedValues().length > 0} class="chips">
      <button
        v-for="value in selectedValues()"
        :key="value"
        type="button"
        class="chip"
        @click="removeValue(value)"
      >
        <span>{{ value }}</span>
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div v-if=${shortcutItems().length > 0} class="shortcuts">
      <button
        v-for="item in shortcutItems()"
        :key="item.label"
        type="button"
        class="shortcut"
        @click="applyShortcut(item)"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if=${props.actions} class="actions">
      <button v-if=${props.clearable} type="button" class="text-action" @click=${clear()}>
        ${props.clearText}
      </button>
      <span class="actions-spacer"></span>
      <button type="button" class="text-action" @click=${cancel()}>${props.cancelText}</button>
      <button type="button" class="primary-action" @click=${confirm()}>${props.confirmText}</button>
    </div>
  </div>
`);

export { DatePicker };
