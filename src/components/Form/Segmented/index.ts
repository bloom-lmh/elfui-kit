import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostFlag
} from "elfui";

import styles from "./style.scss?inline";
import type {
  SegmentedFieldNames,
  SegmentedOption,
  SegmentedProps,
  SegmentedSize,
  SegmentedValue
} from "./types";

export type {
  SegmentedFieldNames,
  SegmentedOption,
  SegmentedOptionObject,
  SegmentedProps,
  SegmentedSize,
  SegmentedValue
} from "./types";

interface ViewOption {
  key: string;
  label: string;
  value: SegmentedValue;
  disabled: boolean;
}

const props = defineProps<SegmentedProps>({
  modelValue: { type: [String, Number, Boolean], default: undefined },
  options: { type: Array, default: () => [] },
  size: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  props: {
    type: Object,
    default: () => ({ label: "label", value: "value", disabled: "disabled" })
  }
});

const emit = defineEmits(["update:modelValue", "change"]);

const fields = (): Required<SegmentedFieldNames> => {
  const value = props.props || {};
  return {
    label: value.label || "label",
    value: value.value || "value",
    disabled: value.disabled || "disabled"
  };
};

const options = (): ViewOption[] => {
  const names = fields();
  const source = Array.isArray(props.options) ? props.options : [];
  return source.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      return {
        key: String(index),
        label: String(entry),
        value: entry as SegmentedValue,
        disabled: false
      };
    }
    const record = entry as Record<string, unknown>;
    const value = (record[names.value] ?? record[names.label] ?? "") as SegmentedValue;
    return {
      key: String(index),
      label: String(record[names.label] ?? value),
      value,
      disabled: Boolean(record[names.disabled])
    };
  });
};

const isActive = (option: ViewOption): boolean => String(option.value) === String(props.modelValue);

const select = (option: ViewOption): void => {
  if (props.disabled || option.disabled || isActive(option)) return;
  emit("update:modelValue", option.value);
  emit("change", option.value);
};

const onContainerClick = (event: Event): void => {
  const button = (event.target as HTMLElement | null)?.closest(".option") as HTMLElement | null;
  const index = Number(button?.dataset.index);
  const option = Number.isInteger(index) ? options()[index] : undefined;
  if (option) select(option);
};

const normalizedSize = (): SegmentedSize => {
  const value = String(props.size || "") as SegmentedSize;
  return value === "sm" || value === "lg" ? value : "";
};

useHostAttr("size", normalizedSize);
useHostFlag("block", () => Boolean(props.block));
useHostFlag("disabled", () => Boolean(props.disabled));

defineStyle(styles);

const Segmented = defineHtml<SegmentedProps>(html`
  <div class="segmented" role="group" part="segmented" @click=${onContainerClick}>
    <button
      v-for="option in options()"
      :key="option.key"
      type="button"
      :class="['option', { 'is-active': isActive(option) }]"
      :data-index="option.key"
      :disabled="props.disabled || option.disabled"
      :aria-pressed="isActive(option) ? 'true' : 'false'"
    >
      {{ option.label }}
    </button>
  </div>
`);

export { Segmented };
