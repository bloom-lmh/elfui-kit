import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import { isEventInside, listenForExternalOverlayMotion } from "../../Common/anchored-overlay";
import { useLocaleProvider } from "../../Providers/context";
import type { TimePickerModelValue, TimeShortcut } from "./types";

export type { TimePickerModelValue, TimePickerProps, TimePickerSize, TimePickerVariant, TimeShortcut } from "./types";

type EditingTarget = "start" | "end";
type ClockUnit = "hour" | "minute";

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
  variant: { type: String, default: "filled" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  startPlaceholder: { type: String, default: "" },
  endPlaceholder: { type: String, default: "" },
  rangeSeparator: { type: String, default: "" },
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

const locale = useLocaleProvider();

const start = useRef("");
const end = useRef("");
const open = useRef(false);
const editingTarget = useRef<EditingTarget>("start");
const activeUnit = useRef<ClockUnit>("hour");
const host = useHost();

const placeholderText = (): string => props.placeholder || locale.t("timePicker.placeholder");
const startPlaceholderText = (): string => props.startPlaceholder || locale.t("timePicker.startPlaceholder");
const endPlaceholderText = (): string => props.endPlaceholder || locale.t("timePicker.endPlaceholder");
const rangeSeparatorText = (): string => props.rangeSeparator || locale.t("timePicker.rangeSeparator");

watchEffect(() => {
  if (Array.isArray(props.modelValue)) {
    start.set(String(props.modelValue[0] || ""));
    end.set(String(props.modelValue[1] || ""));
    return;
  }
  start.set(String(props.modelValue || ""));
  end.set(String(props.endValue || ""));
});

const rangeMode = (): boolean => Boolean(props.range || props.isRange || Array.isArray(props.modelValue));

const currentValue = (): TimePickerModelValue =>
  rangeMode() ? [start.value, end.value] : start.value;

const emitChange = (value: TimePickerModelValue = currentValue()): void => emit("change", value);

const normalizeTime = (value: string): string => {
  const match = /^(\d{1,2}):(\d{1,2})/.exec(String(value || ""));
  const hour = Math.max(0, Math.min(23, Number(match?.[1] || 0)));
  const minute = Math.max(0, Math.min(59, Number(match?.[2] || 0)));
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const isAllowed = (value: string): boolean => {
  if (props.min && value < String(props.min)) return false;
  if (props.max && value > String(props.max)) return false;
  return true;
};

const setStart = (value: string): void => {
  if (props.disabled || props.readonly || !isAllowed(value)) return;
  start.set(value);
  const next = currentValue();
  emit("update:modelValue", next);
  emitChange(next);
};

const setEnd = (value: string): void => {
  if (props.disabled || props.readonly || !isAllowed(value)) return;
  end.set(value);
  if (rangeMode()) emit("update:modelValue", currentValue());
  emit("update:endValue", value);
  emitChange();
};

const setEditingValue = (value: string): void => {
  if (editingTarget.value === "end") setEnd(value);
  else setStart(value);
};

const editingValue = (): string =>
  normalizeTime(editingTarget.value === "end" ? end.value || start.value : start.value);

const editingHour = (): number => Number(editingValue().slice(0, 2));
const editingMinute = (): number => Number(editingValue().slice(3, 5));
const period = (): "AM" | "PM" => (editingHour() >= 12 ? "PM" : "AM");

interface ClockItem {
  key: string;
  amount: number;
  label: number | string;
  active: boolean;
  style: Record<string, string>;
}

const hourItems = (): ClockItem[] =>
  Array.from({ length: 12 }, (_, index) => {
    const label = index + 1;
    const normalized = label % 12;
    return {
      key: `hour-${normalized}`,
      amount: normalized,
      label,
      active: editingHour() % 12 === normalized,
      style: {
        "--clock-angle": `${label * 30}deg`,
        "--clock-angle-neg": `${label * -30}deg`
      }
    };
  });

const minuteItems = (): ClockItem[] =>
  Array.from({ length: 12 }, (_, index) => {
    const value = index * 5;
    return {
      key: `minute-${value}`,
      amount: value,
      label: String(value).padStart(2, "0"),
      active: Math.round(editingMinute() / 5) * 5 % 60 === value,
      style: {
        "--clock-angle": `${index * 30}deg`,
        "--clock-angle-neg": `${index * -30}deg`
      }
    };
  });

const clockItems = () => (activeUnit.value === "hour" ? hourItems() : minuteItems());

const selectClockValue = (event: Event): void => {
  const value = Number((event.currentTarget as HTMLElement).dataset.clockValue);
  if (!Number.isFinite(value)) return;
  if (activeUnit.value === "hour") {
    const nextHour = value + (period() === "PM" ? 12 : 0);
    setEditingValue(`${String(nextHour).padStart(2, "0")}:${String(editingMinute()).padStart(2, "0")}`);
    activeUnit.set("minute");
    return;
  }
  setEditingValue(`${String(editingHour()).padStart(2, "0")}:${String(value).padStart(2, "0")}`);
};

const setPeriod = (next: "AM" | "PM"): void => {
  let hour = editingHour();
  if (next === "AM" && hour >= 12) hour -= 12;
  if (next === "PM" && hour < 12) hour += 12;
  setEditingValue(`${String(hour).padStart(2, "0")}:${String(editingMinute()).padStart(2, "0")}`);
};

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

const shortcutItems = (): TimeShortcut[] =>
  Array.isArray(props.shortcuts) ? (props.shortcuts as TimeShortcut[]) : [];

const shortcutEntries = (): Array<{ item: TimeShortcut; index: number; key: string }> =>
  shortcutItems().map((item, index) => ({ item, index, key: `${index}-${item.label}` }));

const onShortcutClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index ?? -1);
  const shortcut = shortcutItems()[index];
  if (shortcut) applyShortcut(shortcut);
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

const handleOpen = (target: EditingTarget = "start"): void => {
  if (props.disabled) return;
  editingTarget.set(target);
  activeUnit.set("hour");
  if (open.peek()) return;
  open.set(true);
  emit("visible-change", true);
};

const handleClose = (): void => {
  if (!open.peek()) return;
  open.set(false);
  emit("visible-change", false);
};

const getPanelEl = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".panel") ?? null;

const onDocumentPointerDown = (event: Event): void => {
  if (!open.peek() || isEventInside(event, [host, getPanelEl()])) return;
  handleClose();
};

let cleanupOverlayMotion = (): void => {};

const onTriggerClick = (event: Event): void => {
  const target = ((event.currentTarget as HTMLElement).dataset.target || "start") as EditingTarget;
  if (open.peek() && editingTarget.peek() === target) handleClose();
  else handleOpen(target);
};

const onFocus = (event: FocusEvent): void => emit("focus", event);
const onBlur = (event: FocusEvent): void => emit("blur", event);

const adjustByKeyboard = (event: KeyboardEvent): void => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  const direction = event.key === "ArrowUp" ? 1 : -1;
  const total = editingHour() * 60 + editingMinute() + direction * 5;
  const normalized = (total + 24 * 60) % (24 * 60);
  setEditingValue(
    `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`
  );
};

useHostAttr("size", () => String(props.size || ""));
useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-open", () => open.value);
useHostFlag("data-dirty", hasValue);
useHostFlag("data-has-label", () => Boolean(props.label));
onMount(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
  cleanupOverlayMotion = listenForExternalOverlayMotion(() => [getPanelEl()], handleClose);
});
onUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
  cleanupOverlayMotion();
});
defineExpose({ handleOpen, handleClose });
defineStyle(styles);

const TimePicker = defineHtml(html`
  <div :class=${["time-picker", { "is-disabled": props.disabled, "is-open": open.value }]}>
    <div class="fields">
      <button
        type="button"
        class="field-trigger"
        :class=${{ "is-active": open.value && editingTarget.value === "start", "has-label": Boolean(props.label) }}
        data-target="start"
        :tabindex=${props.tabindex}
        :disabled=${props.disabled}
        :aria-expanded=${open.value && editingTarget.value === "start" ? "true" : "false"}
        @click=${onTriggerClick}
        @focus=${onFocus}
        @blur=${onBlur}
        @keydown=${adjustByKeyboard}
      >
        <span v-if=${props.label} class="field-label">${props.label}</span>
        <span class="clock-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !start.value }]}>
          ${start.value || (rangeMode() ? startPlaceholderText() : placeholderText())}
        </span>
      </button>
      <span v-if=${rangeMode()} class="separator">${rangeSeparatorText()}</span>
      <button
        v-if=${rangeMode()}
        type="button"
        class="field-trigger"
        :class=${{ "is-active": open.value && editingTarget.value === "end" }}
        data-target="end"
        :tabindex=${props.tabindex}
        :disabled=${props.disabled}
        :aria-expanded=${open.value && editingTarget.value === "end" ? "true" : "false"}
        @click=${onTriggerClick}
        @focus=${onFocus}
        @blur=${onBlur}
        @keydown=${adjustByKeyboard}
      >
        <span class="clock-icon" aria-hidden="true"></span>
        <span :class=${["field-value", { "is-placeholder": !end.value }]}>
          ${end.value || endPlaceholderText()}
        </span>
      </button>
      <button v-if=${props.clearable && hasValue()} type="button" class="clear" @click=${clear}>${locale.t("common.clear")}</button>
    </div>

    <div v-if=${open.value} class="panel">
      <div class="digital-header">
        <button
          type="button"
          :class=${["digital-part", { "is-active": activeUnit.value === "hour" }]}
          @click=${() => activeUnit.set("hour")}
        >{{ String(editingHour()).padStart(2, "0") }}</button>
        <span>:</span>
        <button
          type="button"
          :class=${["digital-part", { "is-active": activeUnit.value === "minute" }]}
          @click=${() => activeUnit.set("minute")}
        >{{ String(editingMinute()).padStart(2, "0") }}</button>
        <div class="period-switch">
          <button type="button" :class=${{ "is-active": period() === "AM" }} @click=${() => setPeriod("AM")}>AM</button>
          <button type="button" :class=${{ "is-active": period() === "PM" }} @click=${() => setPeriod("PM")}>PM</button>
        </div>
      </div>

      <div class="clock-face" :aria-label=${activeUnit.value === "hour" ? locale.t("timePicker.selectHour") : locale.t("timePicker.selectMinute")}>
        <span class="clock-center"></span>
        <button
          v-for="item in clockItems()"
          :key="item.key"
          type="button"
          :class=${["clock-number", { "is-active": item.active }]}
          :style="item.style"
          :data-clock-value="item.amount"
          :aria-pressed="item.active ? 'true' : 'false'"
          @click=${selectClockValue}
        ><span>{{ item.label }}</span></button>
      </div>

      <div v-if=${shortcutItems().length > 0} class="shortcuts">
        <button
          v-for="entry in shortcutEntries()"
          :key="entry.key"
          :data-index="entry.index"
          type="button"
          class="shortcut"
          @click=${onShortcutClick}
        >{{ entry.item.label }}</button>
      </div>

      <div class="panel-actions">
        <span>${editingTarget.value === "start" ? startPlaceholderText() : endPlaceholderText()}</span>
        <button type="button" @click=${handleClose}>${locale.t("common.done")}</button>
      </div>
    </div>
  </div>
`);

export { TimePicker };
