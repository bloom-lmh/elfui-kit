import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  defineHtml
} from "elfui";

import { useDisabled, useFormControl, useFormItem } from "../../../composables";
import styles from "./style.scss?inline";

export type { SwitchColor, SwitchLabelPosition, SwitchProps, SwitchSize } from "./types";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "md" },
  activeText: { type: String, default: "" },
  inactiveText: { type: String, default: "" },
  label: { type: String, default: "" },
  labelPosition: { type: String, default: "end" },
  beforeChange: { type: Function, default: undefined },
  loading: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  color: { type: String, default: "primary" },
  activeColor: { type: String, default: "" },
  inactiveColor: { type: String, default: "" }
});

const emit = defineEmits<{
  "update:modelValue": [boolean];
  change: [boolean];
}>();

const ctl = useFormControl<boolean>(props, emit, {
  triggers: { input: false, blur: false, change: "change" }
});

const fi = useFormItem(() => props.size as string);

const isDisabled = useDisabled(() => Boolean(props.disabled || props.loading));

const tokenColor = (value: string): string => {
  const color = String(value || "primary");
  const map: Record<string, string> = {
    primary: "var(--elf-primary)",
    success: "var(--elf-success)",
    warning: "var(--elf-warning)",
    danger: "var(--elf-danger)",
    info: "var(--elf-info)"
  };
  return map[color] ?? color;
};

useHostFlag("data-checked", () => ctl.model.value);
useHostFlag("data-loading", () => Boolean(props.loading));
useHostFlag("data-inset", () => Boolean(props.inset));
useHostFlag("data-flat", () => Boolean(props.flat));
useHostFlag("disabled", isDisabled);
useHostAttr("data-size", () => fi.formSize);
useHostAttr("data-label-position", () => String(props.labelPosition || "end"));
useHostCssVar("--_switch-active", () =>
  props.activeColor ? String(props.activeColor) : tokenColor(String(props.color))
);
useHostCssVar("--_switch-inactive", () =>
  props.inactiveColor ? String(props.inactiveColor) : "var(--elf-border-strong)"
);

const toggle = async (): Promise<void> => {
  if (isDisabled()) return;
  const next = !ctl.model.value;
  const guard = props.beforeChange as ((v: boolean) => boolean | Promise<boolean>) | undefined;
  if (guard) {
    const ok = await guard(next);
    if (ok === false) return;
  }
  ctl.setValue(next);
  emit("change", next);
};

const onClick = (): void => {
  void toggle();
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    void toggle();
  }
};

const ariaLabel = (): string => String(props.label || props.activeText || "Switch");

defineStyle(styles);

const Switch = defineHtml(html`
  <span
    v-if=${props.inactiveText}
    class="state-label"
    :class=${{ active: !ctl.model.value }}
    @click=${onClick}
  >
    ${props.inactiveText}
  </span>
  <span class="body">
    <span
      class="track"
      part="track"
      role="switch"
      tabindex="0"
      :aria-label=${ariaLabel()}
      :aria-checked=${ctl.model.value}
      :aria-disabled=${isDisabled()}
      @click=${onClick}
      @keydown=${onKeyDown}
    >
      <span class="thumb">
        <span v-if=${props.loading} class="spinner" aria-hidden="true"></span>
      </span>
    </span>
    <span class="main-label" part="label" @click=${onClick}><slot>${props.label}</slot></span>
  </span>
  <span
    v-if=${props.activeText}
    class="state-label"
    :class=${{ active: ctl.model.value }}
    @click=${onClick}
  >
    ${props.activeText}
  </span>
`);

export { Switch };
