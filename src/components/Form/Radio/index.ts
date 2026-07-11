// elf-radio

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  inject,
  useHost,
  useHostFlag,
  defineHtml
} from "elfui";

import { RADIO_GROUP_KEY } from "../context";
import { useDisabled } from "../../../composables";
import styles from "./style.scss?inline";

export type { RadioProps, RadioSize } from "./types";

const props = defineProps({
  modelValue: { type: null, default: "" },
  value: { type: null, default: "" },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "" },
  border: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue", "change"]);

const group = inject(RADIO_GROUP_KEY);

const host = useHost();

const isDisabled = useDisabled(() => Boolean(props.disabled) || (group?.disabled ?? false));

const checked = (): boolean => {
  if (group) return group.modelValue === props.value;
  return props.modelValue === props.value;
};

useHostFlag("data-checked", () => checked());

useHostFlag("disabled", isDisabled);

const select = (e?: Event): void => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isDisabled() || checked()) return;

  host.dispatchEvent(
    new CustomEvent("elf-radio-select", {
      detail: props.value,
      bubbles: true,
      composed: true
    })
  );

  if (group) {
    group.changeEvent(props.value);
  } else {
    emit("update:modelValue", props.value);
    emit("change", props.value);
  }
};

const onKeyDown = (e: KeyboardEvent): void => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    select(e);
  }
};

defineStyle(styles);

const Radio = defineHtml(html`
  <button
    class="control"
    part="control"
    type="button"
    role="radio"
    :aria-checked=${checked()}
    :disabled=${isDisabled()}
    @click.stop.prevent=${select}
    @keydown=${onKeyDown}
  >
    <span class="dot" part="dot"></span>
    <span class="label" part="label">
      <slot>${props.label}</slot>
    </span>
  </button>
`);

export { Radio };
