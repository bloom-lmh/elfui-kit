import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHost,
  useHostAttr
} from "elfui";

import styles from "./style.scss?inline";
import type { InputOtpProps, InputOtpSize, InputOtpType } from "./types";

export type { InputOtpProps, InputOtpSize, InputOtpType } from "./types";

interface OtpCell {
  index: number;
  char: string;
}

const props = defineProps<InputOtpProps>({
  modelValue: { type: String, default: "" },
  length: { type: Number, default: 6 },
  type: { type: String, default: "text" },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  separator: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "input", "change", "focus", "blur"]);
const host = useHost();

const length = (): number => Math.min(12, Math.max(1, Number(props.length) || 6));
const chars = (): string[] =>
  String(props.modelValue || "")
    .split("")
    .slice(0, length());
const cells = (): OtpCell[] =>
  Array.from({ length: length() }, (_, index) => ({ index, char: chars()[index] || "" }));

const normalizeChar = (value: string): string => {
  const char = value.slice(-1);
  if (props.type === "number") return char.replace(/\D/g, "");
  return char;
};

const updateAt = (index: number, value: string, eventName: "input" | "change"): void => {
  if (props.disabled || props.readonly) return;
  const next = chars();
  next[index] = normalizeChar(value);
  const output = next.join("").slice(0, length());
  emit("update:modelValue", output);
  emit(eventName, output);
};

const inputAt = (index: number): HTMLInputElement | null =>
  host.shadowRoot?.querySelector(`input[data-index="${index}"]`) as HTMLInputElement | null;

const focusAt = (index: number): void =>
  inputAt(Math.min(length() - 1, Math.max(0, index)))?.focus();

const onInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  const index = Number(input.dataset.index);
  updateAt(index, input.value, "input");
  if (input.value) focusAt(index + 1);
};

const onChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  updateAt(Number(input.dataset.index), input.value, "change");
};

const onKeydown = (event: KeyboardEvent): void => {
  const input = event.target as HTMLInputElement;
  const index = Number(input.dataset.index);
  if (event.key === "Backspace" && !input.value && index > 0) focusAt(index - 1);
};

const onPaste = (event: ClipboardEvent): void => {
  if (props.disabled || props.readonly) return;
  event.preventDefault();
  const text = event.clipboardData?.getData("text") || "";
  const output = text.split("").map(normalizeChar).join("").slice(0, length());
  emit("update:modelValue", output);
  emit("input", output);
  emit("change", output);
};

const inputType = (): string => (props.type === "password" ? "password" : "text");
const inputMode = (): string | null => (props.type === "number" ? "numeric" : null);

const normalizedSize = (): InputOtpSize => {
  const value = String(props.size || "") as InputOtpSize;
  return value === "sm" || value === "lg" ? value : "";
};

useHostAttr("size", normalizedSize);
defineStyle(styles);

const InputOtp = defineHtml<InputOtpProps>(html`
  <div class="otp" part="otp" @paste=${onPaste}>
    <template v-for="cell in cells()" :key="cell.index">
      <input
        class="cell"
        part="input"
        maxlength="1"
        :data-index="cell.index"
        :type=${inputType()}
        :inputmode=${inputMode()}
        :value.prop="cell.char"
        :placeholder=${props.placeholder}
        :disabled=${props.disabled}
        :readonly=${props.readonly}
        @input=${onInput}
        @change=${onChange}
        @keydown=${onKeydown}
        @focus=${(event: Event) => emit("focus", event)}
        @blur=${(event: Event) => emit("blur", event)}
      />
      <span v-if="props.separator && cell.index < length() - 1" class="separator"
        >${props.separator}</span
      >
    </template>
  </div>
`);

export { InputOtp };
