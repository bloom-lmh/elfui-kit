// elf-form-item — 表单项
//
// 对标 Element Plus：
// - inject FORM_KEY 拿 form 配置 + register/unregister 自身
// - rules 来源：form.rules[prop] + 自身 rules prop
// - provide FORM_ITEM_KEY 给子控件（input/select/...）
// - 校验状态反射到 host attribute（data-state），由子控件样式响应

import {
  defineProps,
  defineStyle,
  html,
  inject,
  onBeforeUnmount,
  onMount,
  provide,
  useHost,
  useRef,
  defineHtml
} from "elfui";

import { FORM_ITEM_KEY, FORM_KEY, type FormItemContext } from "../context";
import type { FormRule, RuleTrigger } from "../Form/types";
import { getPath, setPath } from "../../../utils/path";
import { validateFieldAsync } from "../../../utils/validator";
import styles from "./style.scss?inline";

export type { FormItemProps, FormItemSize, FormItemValidateState, ValidateError } from "./types";

const props = defineProps({
  prop: { type: String, default: "" },
  label: { type: String, default: "" },
  labelPosition: { type: String, default: "" },
  labelWidth: { type: String, default: "" },
  rules: { type: Array, default: () => [] as FormRule[] },
  required: { type: Boolean, default: false },
  size: { type: String, default: "" },
  error: { type: String, default: "" },
  for: { type: String, default: "" },
  validateStatus: { type: String, default: "" },
  trigger: { type: String, default: "" },
  inlineMessage: { type: Boolean, default: undefined },
  showMessage: { type: Boolean, default: undefined }
});

const host = useHost();

const form = inject(FORM_KEY);

const state = useRef<"" | "validating" | "success" | "error">("");

const message = useRef("");

let initialValue: unknown;

onMount(() => {
  if (form && props.prop) {
    initialValue = getPath(form.model, props.prop as string);
  }
});

const collectRules = (): FormRule[] => {
  const formRules = form && props.prop ? (form.rules[props.prop as string] ?? []) : [];
  const ownRules = (props.rules as FormRule[]) ?? [];
  const combined = [...formRules, ...ownRules];
  // required 简写
  if (props.required && !combined.some((r) => r.required)) {
    combined.unshift({ required: true });
  }
  return combined;
};

const validate = async (trigger?: RuleTrigger): Promise<boolean> => {
  if (!form || !props.prop) return true;
  const rules = collectRules();
  if (rules.length === 0) return true;

  state.set("validating");
  const value = getPath(form.model, props.prop as string);

  // 手动设置 error 时跳过内部校验
  if (props.error) {
    state.set("error");
    message.set(props.error as string);
    return false;
  }

  const err = await validateFieldAsync(rules, value, form.model, trigger);
  if (err) {
    state.set("error");
    message.set(err);
    return false;
  }
  state.set("success");
  message.set("");
  return true;
};

const validateTrigger = (trigger: RuleTrigger): void => {
  void validate(trigger);
};

const clearValidate = (): void => {
  state.set("");
  message.set("");
};

const resetField = (): void => {
  if (form && props.prop && initialValue !== undefined) {
    setPath(form.model, props.prop as string, initialValue);
  }
  clearValidate();
};

const itemCtx: FormItemContext = {
  get prop() {
    return props.prop as string;
  },
  get initialValue() {
    return initialValue;
  },
  get state() {
    return state.value as "" | "validating" | "success" | "error";
  },
  get message() {
    return props.error ? (props.error as string) : message.value;
  },
  get rules() {
    return collectRules();
  },
  get size() {
    const s = props.size as string;
    return (s && s !== "" ? s : (form?.size ?? "md")) as FormItemContext["size"];
  },
  validateTrigger,
  validate,
  clearValidate,
  resetField
};

provide(FORM_ITEM_KEY, itemCtx);

let unreg: (() => void) | null = null;

onMount(() => {
  if (form) {
    unreg = form.registerItem(itemCtx);
    const labelPosition = props.labelPosition || form.labelPosition;
    const labelWidth = props.labelWidth || form.labelWidth;
    host.setAttribute("data-label-position", labelPosition);
    host.style.setProperty("--_label-width", labelWidth);
    if (form.hideRequiredAsterisk) {
      host.setAttribute("data-hide-asterisk", "");
    }
    if (form.requireAsteriskPosition === "right") host.setAttribute("data-asterisk-right", "");
    if (form.inline) host.setAttribute("data-inline", "");
  }
});

onBeforeUnmount(() => {
  unreg?.();
  if (form) form.unregisterItem(itemCtx);
});

const resolvedState = (): "" | "validating" | "success" | "error" => {
  const override = props.validateStatus as string;
  if (override === "error" || override === "success" || override === "validating") return override;
  return state.value;
};

const hasError = (): boolean => resolvedState() === "error" || Boolean(props.error);

const hasSuccess = (): boolean => resolvedState() === "success";

const hasValidating = (): boolean => resolvedState() === "validating";

const isRequired = (): boolean => {
  return Boolean(props.required) || collectRules().some((rule) => rule.required);
};

const showMessage = (): boolean => {
  return props.showMessage ?? form?.showMessage ?? true;
};

const isInline = (): boolean => {
  return props.inlineMessage ?? form?.inlineMessage ?? false;
};

const showStatusIcon = (): boolean => Boolean(form?.statusIcon && resolvedState());

const labelSuffix = (): string => form?.labelSuffix ?? "";

const feedbackClass = (): string => {
  const classes = ["feedback"];
  if (hasError()) classes.push("error");
  if (hasSuccess()) classes.push("success");
  if (hasValidating()) classes.push("validating");
  return classes.join(" ");
};

defineStyle(styles);

const FormItem = defineHtml(html`
  <div class="row">
    <label v-if=${props.label} :for=${props.for || undefined} :class=${{ required: isRequired() }}>
      <slot name="label">${props.label}</slot><span v-if=${labelSuffix()} class="label-suffix">${labelSuffix()}</span>
    </label>
    <div class="content">
      <div class="control">
        <slot></slot>
        <span v-if=${showStatusIcon()} :class=${"status-icon " + resolvedState()} aria-hidden="true">
          <span v-if=${hasSuccess()}>✓</span><span v-else-if=${hasError()}>!</span><span v-else>…</span>
        </span>
      </div>
      <div v-if=${showMessage() && !isInline()} :class=${feedbackClass()}>
        <span v-if=${hasValidating()}>校验中...</span>
        <slot v-else-if=${hasError()} name="error">${message}</slot>
      </div>
    </div>
    <span v-if=${showMessage() && isInline()} :class=${feedbackClass() + " inline"}>
      <slot v-if=${hasError()} name="error">${message}</slot>
    </span>
  </div>
`);

export { FormItem };
