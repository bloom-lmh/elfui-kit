import {
  defineExpose,
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useRef,
  useTemplateRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type { TimePickerModelValue, TimeShortcut } from "./types";

export type { TimePickerModelValue, TimePickerProps, TimePickerSize, TimeShortcut } from "./types";

const props = defineProps({
  modelValue: { type: null, default: "" },
  endValue: { type: String, default: "" },
  range: { type: Boolean, default: false },
  isRange: { type: Boolean, default: false },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
  step: { type: Number, default: 60 },
  readonly: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  size: { type: String, default: "" },
  placeholder: { type: String, default: "选择时间" },
  startPlaceholder: { type: String, default: "开始时间" },
  endPlaceholder: { type: String, default: "结束时间" },
  rangeSeparator: { type: String, default: "至" },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  id: { type: null, default: "" },
  name: { type: String, default: "" },
  tabindex: { type: null, default: 0 },
  valueOnClear: { type: null, default: undefined },
  emptyValues: { type: Array, default: () => [undefined, null, ""] },
  saveOnBlur: { type: Boolean, default: true },
  shortcuts: { type: Array, default: () => [] }
});

const emit = defineEmits<{
  "update:modelValue": [value: TimePickerModelValue];
  "update:endValue": [value: string];
  change: [value: TimePickerModelValue];
  clear: [];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  "visible-change": [visible: boolean];
}>();

const start = useRef("");

const end = useRef("");

const open = useRef(false);

const startInput = useTemplateRef<HTMLInputElement>("startInput");

const endInput = useTemplateRef<HTMLInputElement>("endInput");

watchEffect(() => {
  if (Array.isArray(props.modelValue)) {
    start.set(String(props.modelValue[0] || ""));
    end.set(String(props.modelValue[1] || ""));
    return;
  }
  start.set(String(props.modelValue || ""));
  end.set(String(props.endValue || ""));
});

const rangeMode = (): boolean =>
  Boolean(props.range || props.isRange || Array.isArray(props.modelValue));

const currentValue = (): TimePickerModelValue =>
  rangeMode() ? [start.value, end.value] : start.value;

const emitChange = (value: TimePickerModelValue = currentValue()): void => {
  emit("change", value);
};

const setStart = (value: string): void => {
  if (props.disabled) return;
  start.set(value);
  const next = currentValue();
  emit("update:modelValue", next);
  emitChange(next);
};

const setEnd = (value: string): void => {
  if (props.disabled) return;
  end.set(value);
  if (rangeMode()) emit("update:modelValue", currentValue());
  emit("update:endValue", value);
  emitChange();
};

const onStart = (event: Event): void => setStart((event.target as HTMLInputElement).value);

const onEnd = (event: Event): void => setEnd((event.target as HTMLInputElement).value);

const applyShortcut = (shortcut: TimeShortcut): void => {
  const nextStart = shortcut.value;
  const nextEnd = shortcut.endValue || shortcut.value;
  start.set(nextStart);
  end.set(nextEnd);
  const next = rangeMode() ? [nextStart, nextEnd] : nextStart;
  emit("update:modelValue", next);
  if (rangeMode()) emit("update:endValue", nextEnd);
  emitChange(next);
};

const clear = (): void => {
  if (props.disabled) return;
  const configured = props.valueOnClear;
  const next =
    typeof configured === "function"
      ? configured()
      : configured !== undefined
        ? configured
        : rangeMode()
          ? ["", ""]
          : "";
  if (Array.isArray(next)) {
    start.set(String(next[0] || ""));
    end.set(String(next[1] || ""));
  } else {
    start.set(String(next || ""));
    end.set("");
  }
  emit("update:modelValue", next);
  emit("update:endValue", Array.isArray(next) ? String(next[1] || "") : "");
  emit("change", next);
  emit("clear");
};

const hasValue = (): boolean => Boolean(start.value || end.value);

const shortcutItems = (): TimeShortcut[] =>
  Array.isArray(props.shortcuts) ? (props.shortcuts as TimeShortcut[]) : [];

const shortcutEntries = (): Array<{ item: TimeShortcut; index: number; key: string }> =>
  shortcutItems().map((item, index) => ({ item, index, key: `${index}-${item.label}` }));

const onShortcutClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest?.(".shortcut") as HTMLElement | null;
  const index = Number(button?.dataset.index ?? -1);
  const shortcut = shortcutItems()[index];
  if (shortcut) applyShortcut(shortcut);
};

const handleOpen = (): void => {
  if (open.peek()) return;
  open.set(true);
  emit("visible-change", true);
};

const handleClose = (): void => {
  if (!open.peek()) return;
  open.set(false);
  emit("visible-change", false);
};

const onFocus = (event: FocusEvent): void => {
  handleOpen();
  emit("focus", event);
};

const onBlur = (event: FocusEvent): void => {
  handleClose();
  emit("blur", event);
};

const focus = (): void => startInput.peek()?.focus();

const blur = (): void => {
  startInput.peek()?.blur();
  endInput.peek()?.blur();
};

const startId = (): string | null =>
  Array.isArray(props.id) ? props.id[0] || null : props.id || null;

const endId = (): string | null => (Array.isArray(props.id) ? props.id[1] || null : null);

useHostAttr("size", () => String(props.size || ""));
defineExpose({ focus, blur, handleOpen, handleClose });

defineStyle(styles);

const TimePicker = defineHtml(html`
  <div :class=${["time-picker", { "is-disabled": props.disabled, "is-open": open.value }]}>
    <input
      ref="startInput"
      class="field"
      type="time"
      :id=${startId()}
      :name=${props.name || null}
      :tabindex=${props.tabindex}
      :value=${start.value}
      :min=${props.min}
      :max=${props.max}
      :step=${props.step}
      :placeholder=${rangeMode() ? props.startPlaceholder : props.placeholder}
      :readonly=${props.readonly || !props.editable}
      :disabled=${props.disabled}
      @input=${onStart}
      @change=${onStart}
      @focus=${onFocus}
      @blur=${onBlur}
    />
    <span v-if=${rangeMode()} class="separator">${props.rangeSeparator}</span>
    <input
      v-if=${rangeMode()}
      ref="endInput"
      class="field"
      type="time"
      :id=${endId()}
      :name=${props.name ? props.name + "-end" : null}
      :tabindex=${props.tabindex}
      :value=${end.value}
      :min=${props.min}
      :max=${props.max}
      :step=${props.step}
      :placeholder=${props.endPlaceholder}
      :readonly=${props.readonly || !props.editable}
      :disabled=${props.disabled}
      @input=${onEnd}
      @change=${onEnd}
      @focus=${onFocus}
      @blur=${onBlur}
    />
    <button v-if=${props.clearable && hasValue()} type="button" class="clear" @click=${clear}>
      清空
    </button>
    <div v-if=${shortcutItems().length > 0} class="shortcuts">
      <button
        v-for="entry in shortcutEntries()"
        :key="entry.key"
        :data-index="String(entry.index)"
        type="button"
        class="shortcut"
        @click=${onShortcutClick}
      >
        {{ entry.item.label }}
      </button>
    </div>
  </div>
`);

export { TimePicker };
