// elf-textarea — 多行文本
//
// 对标 Element Plus Input type="textarea"：
// - useFormControl 封装 v-model + form-item 校验联动
// - useFormItem + useDisabled 统一上下文
// - 支持 autosize / show-word-limit / resize

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useEffect,
  useHostAttr,
  useHostFlag,
  useTemplateRef,
  defineHtml
} from "elfui";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";

export type { TextareaProps, TextareaSize } from "./types";

const props = defineProps({
  modelValue: { type: String, default: "" },
  size: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  maxlength: { type: Number, default: undefined },
  showCount: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  autosize: { type: [Boolean, Object], default: false },
  resize: { type: String, default: "vertical" }
});

const emit = defineEmits(["update:modelValue", "input", "change", "focus", "blur"]);

const ctl = useFormControl<string>(props, emit);

const fi = useFormItem(() => props.size as string);

const isDisabled = useDisabled(() => Boolean(props.disabled));

const textareaRef = useTemplateRef<HTMLTextAreaElement>("ta");

useHostAttr("data-state", () => fi.state);

useHostAttr("size", () => fi.formSize);

useHostAttr("resize", () => props.resize as string);
const autosizeEnabled = (): boolean => props.autosize === "" || Boolean(props.autosize);

useHostFlag("autosize", autosizeEnabled);

const adjustHeight = (ta: HTMLTextAreaElement): void => {
  if (!autosizeEnabled()) return;
  ta.style.height = "auto";
  const opts = props.autosize as { minRows?: number; maxRows?: number } | boolean;
  const minRows = typeof opts === "object" ? (opts.minRows ?? 1) : 1;
  const maxRows = typeof opts === "object" ? opts.maxRows : undefined;
  const lineH = parseInt(getComputedStyle(ta).lineHeight, 10) || 20;
  const padding = 16;
  const minH = minRows * lineH + padding;
  const maxH = maxRows ? maxRows * lineH + padding : Infinity;
  ta.style.height = `${Math.min(Math.max(ta.scrollHeight, minH), maxH)}px`;
};

useEffect(() => {
  // Track both inputs so controlled value changes and autosize option changes
  // recalculate after the textarea has rendered.
  void ctl.model.value;
  void props.autosize;
  queueMicrotask(() => {
    const ta = textareaRef.value;
    if (ta) adjustHeight(ta);
  });
});

const getValue = (e: Event): string => (e.target as HTMLTextAreaElement).value;

const onInput = (e: Event): void => {
  ctl.dispatchInput(getValue(e));
  const ta = e.currentTarget as HTMLTextAreaElement;
  queueMicrotask(() => adjustHeight(ta));
};

const onChange = (e: Event): void => ctl.dispatchChange(getValue(e));

const onFocus = (e: Event): void => ctl.dispatchFocus(e);

const onBlur = (e: Event): void => ctl.dispatchBlur(e);

const charCount = (): number => (ctl.model.value ?? "").length;

const countText = (): string =>
  props.maxlength ? `${charCount()}/${props.maxlength}` : String(charCount());

const showCount = (): boolean => {
  return Boolean(props.showCount);
};

defineStyle(styles);

const Textarea = defineHtml(html`
  <div class="wrapper" part="wrapper">
    <textarea
      ref="ta"
      part="textarea"
      :value.prop=${ctl.model.value}
      :placeholder=${props.placeholder}
      :disabled=${isDisabled()}
      :readonly=${props.readonly}
      :maxlength=${props.maxlength}
      :rows=${props.rows}
      @input=${onInput}
      @change=${onChange}
      @focus=${onFocus}
      @blur=${onBlur}
    ></textarea>
    <span class="count" v-if=${showCount()} part="count">${countText()}</span>
  </div>
`);

export { Textarea };
