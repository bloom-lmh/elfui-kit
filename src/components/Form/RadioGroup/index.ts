import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  provide,
  useEventListener,
  useHost,
  useHostCssVar
} from "elfui";

import { useDisabled, useFormControl } from "../../../composables";
import { RADIO_GROUP_KEY } from "../context";
import type { RadioGroupContext } from "../context";
import styles from "./style.scss?inline";
import type { RadioGroupProps } from "./types";

export type { RadioGroupProps } from "./types";

const props = defineProps<RadioGroupProps>({
  modelValue: { type: null, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  variant: { type: String, default: "default" },
  fill: { type: String, default: "" },
  textColor: { type: String, default: "" },
  id: { type: String, default: "" },
  name: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  label: { type: String, default: "" },
  validateEvent: { type: Boolean, default: true }
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
  change: [value: unknown];
}>();
const ctl = useFormControl<unknown>(props, emit, {
  triggers: props.validateEvent === false ? { input: false, change: false, blur: false } : { input: false, blur: false }
});
const isDisabled = useDisabled(() => Boolean(props.disabled));
const host = useHost();

useHostCssVar("--_radio-fill", () => props.fill || "var(--elf-primary)");
useHostCssVar("--_radio-text-color", () => props.textColor || "inherit");

const changeEvent = (value: unknown): void => {
  if (Object.is(ctl.model.value, value) || isDisabled()) return;
  ctl.setValue(value);
  ctl.dispatchChange(value);
};

provide<RadioGroupContext>(RADIO_GROUP_KEY, {
  get modelValue() { return ctl.model.value; },
  get disabled() { return isDisabled(); },
  get size() { return props.size as "sm" | "md" | "lg"; },
  get name() { return props.name || undefined; },
  changeEvent
});

const radioElements = (): HTMLElement[] => Array.from(host.querySelectorAll("elf-radio"))
  .filter((radio) => !radio.hasAttribute("disabled"));

const focusRadio = (offset: number): void => {
  const radios = radioElements();
  if (!radios.length) return;
  const selected = radios.findIndex((radio) => radio.hasAttribute("data-checked"));
  const next = radios[(selected + offset + radios.length) % radios.length];
  const control = next.shadowRoot?.querySelector<HTMLButtonElement>(".control");
  control?.focus();
  control?.click();
};

useEventListener(host, "elf-radio-select", (event) => {
  event.stopPropagation();
  changeEvent((event as CustomEvent).detail);
});

useEventListener(host, "elf-radio-navigate", (event) => {
  event.stopPropagation();
  focusRadio(Number((event as CustomEvent).detail) || 1);
});

defineStyle(styles);

const RadioGroup = defineHtml<RadioGroupProps>(html`
  <div
    class="group"
    role="radiogroup"
    :id=${props.id || null}
    :aria-label=${props.ariaLabel || props.label || null}
    :class=${[`variant-${props.variant}`]}
  ><slot></slot></div>
`);

export { RadioGroup };
