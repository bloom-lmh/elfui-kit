// elf-input — 单行文本输入

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
  useTemplateRef
} from "elfui";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";

import type { InputNativeValue, InputProps, InputSize } from "./types";

export type {
  InputFormatter,
  InputGraphemeCounter,
  InputModelModifiers,
  InputNativeValue,
  InputParser,
  InputProps,
  InputSize,
  InputType,
  InputWordLimitPosition
} from "./types";

const normalizeSize = (size: string | undefined): "" | "sm" | "md" | "lg" => {
  if (!size) return "";
  if (size === "small") return "sm";
  if (size === "default") return "md";
  if (size === "large") return "lg";
  return size === "sm" || size === "md" || size === "lg" ? size : "";
};

const props = defineProps<InputProps>({
  modelValue: { type: null, default: "" },
  modelModifiers: { type: Object, default: () => ({}) },
  type: { type: String, default: "text" },
  size: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false },
  maxlength: { type: Number, default: undefined },
  minlength: { type: Number, default: undefined },
  showWordLimit: { type: Boolean, default: false },
  wordLimitPosition: { type: String, default: "inside" },
  clearIcon: { type: String, default: "x" },
  prefixIcon: { type: String, default: "" },
  suffixIcon: { type: String, default: "" },
  formatter: { type: Function, default: undefined },
  parser: { type: Function, default: undefined },
  autocomplete: { type: String, default: "off" },
  max: { type: null, default: undefined },
  min: { type: null, default: undefined },
  step: { type: null, default: undefined },
  autofocus: { type: Boolean, default: false },
  form: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  tabindex: { type: null, default: undefined },
  validateEvent: { type: Boolean, default: true },
  inputStyle: { type: null, default: "" },
  label: { type: String, default: "" },
  inputmode: { type: String, default: "" },
  countGraphemes: { type: Function, default: undefined },
  id: { type: String, default: "" },
  name: { type: String, default: "" }
});

const emit = defineEmits<{
  "update:modelValue": [value: InputNativeValue];
  input: [value: InputNativeValue];
  change: [value: InputNativeValue];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
  keydown: [event: KeyboardEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
  compositionstart: [event: CompositionEvent];
  compositionupdate: [event: CompositionEvent];
  compositionend: [event: CompositionEvent];
}>();

const ctl = useFormControl<InputNativeValue>(props, emit, {
  triggers: props.validateEvent === false ? { input: false, change: false, blur: false } : undefined
});

const fi = useFormItem(() => normalizeSize(props.size as InputSize));
const isDisabled = useDisabled(() => Boolean(props.disabled));
const inputRef = useTemplateRef<HTMLInputElement>("inputEl");
const host = useHost();
const pwdVisible = useRef(false);
const isComposing = useRef(false);
const slotVersion = useRef(0);

useHostAttr("data-state", () => fi.state);
useHostAttr("size", () => fi.formSize);
useHostFlag("disabled", isDisabled);

const touchSlots = (): void => {
  slotVersion.set(slotVersion.value + 1);
};

const hasNamedSlot = (name: string): boolean => {
  const version = slotVersion.value;
  return version >= 0 && Boolean(host.querySelector(`[slot="${name}"]`));
};

const nullable = (value: unknown): unknown | null =>
  value === undefined || value === null || value === "" ? null : value;

const toText = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

const modelText = (): string => toText(ctl.model.value);

const getInputEl = (): HTMLInputElement | null =>
  inputRef.value ?? host.shadowRoot?.querySelector<HTMLInputElement>("input") ?? null;

const formatText = (value: string): string => {
  const formatter = props.formatter;
  return typeof formatter === "function" ? String(formatter(value)) : value;
};

const parseText = (value: string): InputNativeValue => {
  const parser = props.parser;
  let next = typeof parser === "function" ? String(parser(value)) : value;
  const modifiers = props.modelModifiers || {};
  if (modifiers.trim) next = next.trim();
  if (modifiers.number) {
    const num = Number(next);
    return Number.isNaN(num) ? next : num;
  }
  return next;
};

const displayValue = (): string => formatText(modelText());

const syncDisplayValue = (): void => {
  const el = getInputEl();
  if (el) el.value = displayValue();
};

const getValue = (e: Event): string => (e.target as HTMLInputElement).value;

const shouldLazyUpdate = (): boolean => Boolean(props.modelModifiers?.lazy);

const commitInputValue = (rawValue: string): void => {
  const value = parseText(rawValue);
  if (shouldLazyUpdate()) {
    emit("input", value);
  } else {
    ctl.dispatchInput(value);
  }
  queueMicrotask(syncDisplayValue);
};

const onInput = (e: Event): void => {
  if (isComposing.value) return;
  commitInputValue(getValue(e));
};

const onChange = (e: Event): void => {
  const value = parseText(getValue(e));
  if (shouldLazyUpdate()) ctl.dispatchInput(value);
  ctl.dispatchChange(value);
  queueMicrotask(syncDisplayValue);
};

const onFocus = (e: FocusEvent): void => ctl.dispatchFocus(e);

const onBlur = (e: FocusEvent): void => ctl.dispatchBlur(e);

const onKeydown = (e: KeyboardEvent): void => emit("keydown", e);

const onMouseenter = (e: MouseEvent): void => emit("mouseenter", e);

const onMouseleave = (e: MouseEvent): void => emit("mouseleave", e);

const onCompositionStart = (e: CompositionEvent): void => {
  isComposing.set(true);
  emit("compositionstart", e);
};

const onCompositionUpdate = (e: CompositionEvent): void => emit("compositionupdate", e);

const onCompositionEnd = (e: CompositionEvent): void => {
  const value = getValue(e as unknown as Event);
  isComposing.set(false);
  emit("compositionend", e);
  commitInputValue(value);
};

const focus = (): void => getInputEl()?.focus();

const blur = (): void => getInputEl()?.blur();

const clear = (): void => {
  ctl.setValue("");
  const el = getInputEl();
  if (el) el.value = "";
  emit("clear");
};

const select = (): void => getInputEl()?.select();

const input = (): HTMLInputElement | null => getInputEl();

const ref = (): HTMLInputElement | null => input();

const resizeTextarea = (): void => undefined;

const textarea = (): null => null;

const textareaStyle = (): Record<string, never> => ({});

const inputType = (): string => {
  if (props.type !== "password") return props.type as string;
  if (!props.showPassword) return "password";
  return pwdVisible.value ? "text" : "password";
};

const togglePassword = (): void => {
  pwdVisible.set(!pwdVisible.value);
};

const showPasswordToggle = (): boolean =>
  props.type === "password" && Boolean(props.showPassword) && !isDisabled();

const showClear = (): boolean =>
  Boolean(props.clearable && modelText().length > 0 && !isDisabled() && !props.readonly);

const hasPrefix = (): boolean => Boolean(props.prefixIcon || hasNamedSlot("prefix"));

const hasSuffix = (): boolean =>
  Boolean(
    props.suffixIcon ||
    hasNamedSlot("suffix") ||
    showClear() ||
    showPasswordToggle() ||
    showInsideWordLimit()
  );

const hasPrepend = (): boolean => hasNamedSlot("prepend");

const hasAppend = (): boolean => hasNamedSlot("append");

const countValue = (): number => {
  const counter = props.countGraphemes;
  if (typeof counter === "function") return Number(counter(modelText())) || 0;
  return Array.from(modelText()).length;
};

const showWordLimit = (): boolean => Boolean(props.showWordLimit && props.maxlength !== undefined);

const showInsideWordLimit = (): boolean => showWordLimit() && props.wordLimitPosition !== "outside";

const showOutsideWordLimit = (): boolean =>
  showWordLimit() && props.wordLimitPosition === "outside";

const wordLimitText = (): string => `${countValue()} / ${Number(props.maxlength) || 0}`;

const ariaText = (): string | null => props.ariaLabel || props.label || props.placeholder || null;

const passwordToggleText = (): string => (pwdVisible.value ? "Hide" : "Show");

defineExpose({
  blur,
  clear,
  focus,
  input,
  ref,
  resizeTextarea,
  select,
  textarea,
  textareaStyle,
  isComposing,
  passwordVisible: pwdVisible
});

defineStyle(styles);

const Input = defineHtml(html`
  <div
    :class=${[
      "group",
      {
        "has-prepend": hasPrepend(),
        "has-append": hasAppend(),
        "has-outside-count": showOutsideWordLimit()
      }
    ]}
    @mouseenter=${onMouseenter}
    @mouseleave=${onMouseleave}
  >
    <span v-if=${hasPrepend()} class="prepend" part="prepend">
      <slot name="prepend" @slotchange=${touchSlots}></slot>
    </span>

    <div class="wrapper" part="wrapper">
      <span v-if=${hasPrefix()} class="prefix" part="prefix">
        <slot name="prefix" @slotchange=${touchSlots}>${props.prefixIcon}</slot>
      </span>
      <input
        ref="inputEl"
        part="input"
        :id=${nullable(props.id)}
        :name=${nullable(props.name)}
        :type=${inputType()}
        :placeholder=${props.placeholder}
        :disabled=${isDisabled()}
        :readonly=${props.readonly}
        :maxlength=${nullable(props.maxlength)}
        :minlength=${nullable(props.minlength)}
        :autocomplete=${nullable(props.autocomplete)}
        :max=${nullable(props.max)}
        :min=${nullable(props.min)}
        :step=${nullable(props.step)}
        :autofocus=${props.autofocus}
        :form=${nullable(props.form)}
        :aria-label=${ariaText()}
        :tabindex=${nullable(props.tabindex)}
        :inputmode=${nullable(props.inputmode)}
        :style=${nullable(props.inputStyle)}
        :value.prop=${displayValue()}
        @input=${onInput}
        @change=${onChange}
        @focus=${onFocus}
        @blur=${onBlur}
        @keydown=${onKeydown}
        @compositionstart=${onCompositionStart}
        @compositionupdate=${onCompositionUpdate}
        @compositionend=${onCompositionEnd}
      />
      <span v-if=${hasSuffix()} class="suffix" part="suffix">
        <span v-if=${showInsideWordLimit()} class="count" part="count">${wordLimitText()}</span>
        <button
          v-if=${showPasswordToggle()}
          class="pwd-toggle"
          type="button"
          tabindex="-1"
          @click=${togglePassword}
          aria-label="toggle password visibility"
        >
          <slot name="password-icon" @slotchange=${touchSlots}>${passwordToggleText()}</slot>
        </button>
        <button
          v-if=${showClear()}
          class="clear"
          type="button"
          tabindex="-1"
          @click=${clear}
          aria-label="clear input"
        >
          ${props.clearIcon}
        </button>
        <slot name="suffix" @slotchange=${touchSlots}>${props.suffixIcon}</slot>
      </span>
    </div>

    <span v-if=${hasAppend()} class="append" part="append">
      <slot name="append" @slotchange=${touchSlots}></slot>
    </span>
    <span v-if=${showOutsideWordLimit()} class="count outside" part="count">
      ${wordLimitText()}
    </span>
  </div>
`);

export { Input };
