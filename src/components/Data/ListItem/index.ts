import { defineEmits, defineHtml, defineProps, defineStyle, html, useHostAttr, useHostFlag } from "@elfui/core";
import styles from "./style.scss?inline";
import type { ListItemEmits, ListItemProps } from "./types";

export type { ListItemEmits, ListItemProps } from "./types";

const props = defineProps<ListItemProps>({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  lines: { type: String, default: "two" }
});

const emit = defineEmits<ListItemEmits>();
const normalizedLines = (): "one" | "two" | "three" =>
  props.lines === "one" || props.lines === "three" ? props.lines : "two";
const interactive = (): boolean => Boolean(props.clickable && !props.disabled);
const onClick = (event: MouseEvent): void => {
  if (!interactive()) return;
  emit("click", event);
  emit("select", props.value);
};

useHostAttr("role", () => "listitem");
useHostFlag("active", () => props.active);
useHostFlag("disabled", () => props.disabled);
defineStyle(styles);

const ListItem = defineHtml<ListItemProps>(html`
  <button
    v-if=${props.clickable}
    :class=${["item", `lines-${normalizedLines()}`, { "is-clickable": props.clickable, "is-active": props.active }]}
    type="button"
    :disabled=${props.disabled}
    part="item"
    @click=${onClick}
  >
    <span class="leading" part="leading"><slot name="leading"></slot></span>
    <span class="content" part="content">
      <span v-if=${props.title} class="title" part="title">${props.title}</span>
      <slot></slot>
      <span v-if=${props.subtitle && normalizedLines() !== "one"} class="subtitle" part="subtitle">${props.subtitle}</span>
    </span>
    <span class="trailing" part="trailing"><slot name="trailing"></slot></span>
  </button>
  <div v-else :class=${["item", `lines-${normalizedLines()}`, { "is-active": props.active }]} part="item">
    <span class="leading" part="leading"><slot name="leading"></slot></span>
    <span class="content" part="content">
      <span v-if=${props.title} class="title" part="title">${props.title}</span>
      <slot></slot>
      <span v-if=${props.subtitle && normalizedLines() !== "one"} class="subtitle" part="subtitle">${props.subtitle}</span>
    </span>
    <span class="trailing" part="trailing"><slot name="trailing"></slot></span>
  </div>
`);

export { ListItem };
