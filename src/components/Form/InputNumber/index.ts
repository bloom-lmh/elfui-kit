import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";
import { useFormControl } from "../../../composables";
import type { InputNumberControlsPosition, InputNumberProps, InputNumberSize } from "./types";

export type { InputNumberControlsPosition, InputNumberProps, InputNumberSize } from "./types";

const props = defineProps<InputNumberProps>({
  modelValue: { type: Number, default: undefined },
  min: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  step: { type: Number, default: 1 },
  stepStrictly: { type: Boolean, default: false },
  precision: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  controlsPosition: { type: String, default: "" },
  size: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  name: { type: String, default: "" },
  valueOnClear: { type: Number, default: null },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur"]);
const host = useHost();
const ctl = useFormControl<number | null>(props, emit, {
  triggers: props.validateEvent === false ? { input: false, change: false, blur: false } : undefined
});

const current = useRef<number | null>(null);
const lastModel = useRef<string>("");

const numberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
};

const min = (): number => {
  const value = Number(props.min);
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
};

const max = (): number => {
  const value = Number(props.max);
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
};

const step = (): number => {
  const value = Math.abs(Number(props.step));
  return Number.isFinite(value) && value > 0 ? value : 1;
};

const precision = (): number | null => {
  const value = Number(props.precision);
  if (Number.isInteger(value) && value >= 0) return value;
  const stepText = String(props.step ?? "");
  const dot = stepText.indexOf(".");
  return dot >= 0 ? stepText.length - dot - 1 : null;
};

const applyPrecision = (value: number): number => {
  const p = precision();
  return p === null ? value : Number(value.toFixed(p));
};

const clamp = (value: number): number => Math.min(max(), Math.max(min(), value));

const normalize = (value: number | null): number | null => {
  if (value === null) return null;
  let next = value;
  if (props.stepStrictly) {
    const base = Number.isFinite(min()) ? min() : 0;
    next = base + Math.round((next - base) / step()) * step();
  }
  return applyPrecision(clamp(next));
};

watchEffect(() => {
  const raw = numberOrNull(props.modelValue);
  const key = raw === null ? "" : String(raw);
  if (lastModel.peek() === key) return;
  lastModel.set(key);
  current.set(normalize(raw));
});

const displayValue = (): string => {
  const value = current.value;
  return value === null ? "" : String(value);
};

const canDecrease = (): boolean => {
  const value = current.value;
  return value !== null && value <= min();
};

const canIncrease = (): boolean => {
  const value = current.value;
  return value !== null && value >= max();
};

const commit = (value: number | null, eventName: "input" | "change"): void => {
  if (props.disabled || props.readonly) return;
  const next = normalize(value);
  current.set(next);
  lastModel.set(next === null ? "" : String(next));
  if (eventName === "input") ctl.dispatchInput(next);
  else {
    ctl.setValue(next);
    ctl.dispatchChange(next);
  }
};

const onInput = (event: Event): void => {
  const value = numberOrNull((event.target as HTMLInputElement).value);
  commit(value === null ? numberOrNull(props.valueOnClear) : value, "input");
};

const onChange = (event: Event): void => {
  const value = numberOrNull((event.target as HTMLInputElement).value);
  commit(value === null ? numberOrNull(props.valueOnClear) : value, "change");
};

const inputElement = (): HTMLInputElement | null => host.shadowRoot?.querySelector("input") ?? null;
const focus = (): void => inputElement()?.focus();
const blur = (): void => inputElement()?.blur();

const decrease = (): void => {
  const base = current.value ?? 0;
  commit(base - step(), "change");
};

const increase = (): void => {
  const base = current.value ?? 0;
  commit(base + step(), "change");
};

const normalizedSize = (): InputNumberSize => {
  const value = String(props.size || "") as InputNumberSize;
  return value === "sm" || value === "lg" ? value : "";
};

const normalizedControlsPosition = (): InputNumberControlsPosition =>
  props.controlsPosition === "right" ? "right" : "";

useHostAttr("size", normalizedSize);
useHostAttr("controls-position", normalizedControlsPosition);
useHostFlag("disabled", () => Boolean(props.disabled));

defineExpose({ focus, blur });

defineStyle(styles);

const InputNumber = defineHtml<InputNumberProps>(html`
  <div class="input-number" part="wrapper">
    <button
      v-if=${props.controls}
      class="control decrease"
      part="decrease"
      type="button"
      :disabled=${props.disabled || props.readonly || canDecrease()}
      aria-label="Decrease"
      @click=${decrease}
    >
      -
    </button>
    <input
      part="input"
      type="number"
      :name=${props.name || null}
      :placeholder=${props.placeholder}
      :disabled=${props.disabled}
      :readonly=${props.readonly}
      :min=${Number.isFinite(min()) ? min() : null}
      :max=${Number.isFinite(max()) ? max() : null}
      :step=${step()}
      :value.prop=${displayValue()}
      role="spinbutton"
      :aria-valuemin=${Number.isFinite(min()) ? String(min()) : null}
      :aria-valuemax=${Number.isFinite(max()) ? String(max()) : null}
      :aria-valuenow=${current.value === null ? null : String(current.value)}
      @input=${onInput}
      @change=${onChange}
      @focus=${(event: Event) => ctl.dispatchFocus(event)}
      @blur=${(event: Event) => ctl.dispatchBlur(event)}
    />
    <button
      v-if=${props.controls}
      class="control increase"
      part="increase"
      type="button"
      :disabled=${props.disabled || props.readonly || canIncrease()}
      aria-label="Increase"
      @click=${increase}
    >
      +
    </button>
  </div>
`);

export { InputNumber };
