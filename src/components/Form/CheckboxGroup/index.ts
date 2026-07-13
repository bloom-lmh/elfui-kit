// elf-checkbox-group

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  inject,
  provide,
  useEffect,
  useRef,
  defineHtml
} from "elfui";

import { CHECKBOX_GROUP_KEY, FORM_KEY } from "../context";
import type { CheckboxGroupContext } from "../context";
import styles from "./style.scss?inline";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: Infinity },
  ariaLabel: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "change"]);

const form = inject(FORM_KEY);

const inner = useRef<unknown[]>((props.modelValue as unknown[]) ?? []);

useEffect(() => {
  const pv = (props.modelValue as unknown[]) ?? [];
  if (pv !== inner.peek()) inner.set([...pv]);
});

provide<CheckboxGroupContext>(CHECKBOX_GROUP_KEY, {
  get modelValue() {
    return inner.value;
  },
  get disabled() {
    return Boolean(props.disabled) || (form?.disabled ?? false);
  },
  get size() {
    return props.size as "sm" | "md" | "lg";
  },
  get min() {
    return props.min as number;
  },
  get max() {
    return props.max as number;
  },
  changeEvent(v: unknown[]) {
    inner.set(v);
    emit("update:modelValue", v);
    emit("change", v);
  }
});

defineStyle(styles);

const CheckboxGroup = defineHtml(html`<div class="group" role="group" :aria-label=${props.ariaLabel || null}><slot></slot></div>`);

export { CheckboxGroup };
