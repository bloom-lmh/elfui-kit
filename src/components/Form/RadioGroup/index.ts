// elf-radio-group

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  inject,
  provide,
  useEffect,
  useEventListener,
  useHost,
  useRef,
  defineHtml
} from "elfui";

import { FORM_KEY, RADIO_GROUP_KEY } from "../context";
import type { RadioGroupContext } from "../context";
import styles from "./style.scss?inline";

const props = defineProps({
  modelValue: { type: null, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  variant: { type: String, default: "default" },
  fill: { type: String, default: "" },
  textColor: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "change"]);

const form = inject(FORM_KEY);

const host = useHost();

const inner = useRef<unknown>(props.modelValue);

useEffect(() => {
  const pv = props.modelValue;
  if (pv !== inner.peek()) inner.set(pv);
});

const changeEvent = (v: unknown): void => {
  if (Object.is(inner.peek(), v)) return;
  inner.set(v);
  emit("update:modelValue", v);
  emit("change", v);
};

provide<RadioGroupContext>(RADIO_GROUP_KEY, {
  get modelValue() {
    return inner.value;
  },
  get disabled() {
    return Boolean(props.disabled) || (form?.disabled ?? false);
  },
  get size() {
    return props.size as "sm" | "md" | "lg";
  },
  changeEvent
});

useEventListener(host, "elf-radio-select", (event) => {
  event.stopPropagation();
  changeEvent((event as CustomEvent).detail);
});

defineStyle(styles);

const RadioGroup = defineHtml(html`<div class="group" role="radiogroup"><slot></slot></div>`);

export { RadioGroup };
