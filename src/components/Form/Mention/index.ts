import { defineEmits, defineHtml, defineProps, defineStyle, html, useRef } from "elfui";

import styles from "./style.scss?inline";
import type { MentionOption, MentionProps } from "./types";

export type { MentionOption, MentionProps } from "./types";

interface ViewOption {
  label: string;
  insertText: string;
  disabled: boolean;
  index: number;
}

const props = defineProps<MentionProps>({
  modelValue: { type: String, default: "" },
  options: { type: Array, default: () => [] },
  prefix: { type: String, default: "@" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  rows: { type: Number, default: 3 }
});

const emit = defineEmits(["update:modelValue", "input", "select", "focus", "blur"]);
const open = useRef(false);
const query = useRef("");

const options = (): ViewOption[] => {
  const q = query.value.toLowerCase();
  return (props.options || [])
    .map((item, index) => ({
      label: String(item.label ?? item.value ?? ""),
      insertText: String(item.value ?? item.label ?? ""),
      disabled: Boolean(item.disabled),
      index
    }))
    .filter((item) => !q || item.label.toLowerCase().includes(q));
};

const parseQuery = (value: string): void => {
  const prefix = props.prefix || "@";
  const index = value.lastIndexOf(prefix);
  if (index < 0) {
    open.set(false);
    query.set("");
    return;
  }
  const tail = value.slice(index + prefix.length);
  if (/\s/.test(tail)) {
    open.set(false);
    return;
  }
  query.set(tail);
  open.set(true);
};

const onInput = (event: Event): void => {
  const value = (event.target as HTMLTextAreaElement).value;
  emit("update:modelValue", value);
  emit("input", value);
  parseQuery(value);
};

const selectAt = (index: number): void => {
  const option = options()[index];
  if (!option || option.disabled) return;
  const prefix = props.prefix || "@";
  const base = props.modelValue || "";
  const start = base.lastIndexOf(prefix);
  const next = start >= 0 ? `${base.slice(0, start)}${prefix}${option.insertText} ` : base;
  emit("update:modelValue", next);
  emit("select", props.options?.[index]);
  open.set(false);
};

const onOptionClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  if (Number.isInteger(index)) selectAt(index);
};

defineStyle(styles);

const Mention = defineHtml<MentionProps>(html`
  <div class="mention" part="mention">
    <textarea
      part="textarea"
      :value.prop=${props.modelValue}
      :rows.prop=${props.rows}
      :placeholder=${props.placeholder}
      :disabled=${props.disabled}
      @input=${onInput}
      @focus=${(event: Event) => emit("focus", event)}
      @blur=${(event: Event) => emit("blur", event)}
    ></textarea>
    <div v-if=${open.value && options().length} class="panel">
      <button
        v-for="item in options()"
        :key="item.index"
        class="option"
        type="button"
        :data-index="item.index"
        :disabled="item.disabled"
        @mousedown=${onOptionClick}
      >
        {{ item.label }}
      </button>
    </div>
  </div>
`);

export { Mention };
