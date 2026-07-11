import {
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag
} from "elfui";

import styles from "./style.scss?inline";
import type { TextProps, TextSize, TextSlots, TextType } from "./types";

export type { TextProps, TextSize, TextSlots, TextType } from "./types";

const props = defineProps<TextProps>({
  type: { type: String, default: "" },
  size: { type: String, default: "" },
  truncated: { type: Boolean, default: false },
  lineClamp: { type: Number, default: undefined },
  tag: { type: String, default: "span" },
  mark: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  inserted: { type: Boolean, default: false },
  strong: { type: Boolean, default: false },
  italic: { type: Boolean, default: false }
});

const host = useHost();

const normalizedType = (): TextType => {
  const value = String(props.type || "") as TextType;
  return ["primary", "success", "warning", "danger", "info"].includes(value) ? value : "";
};

const normalizedSize = (): TextSize => {
  const value = String(props.size || "") as TextSize;
  return value === "sm" || value === "md" || value === "lg" ? value : "";
};

useHostAttr("type", normalizedType);
useHostAttr("size", normalizedSize);
useHostFlag("truncated", () => Boolean(props.truncated));
const lineClampValue = (): number =>
  Math.max(1, Number(props.lineClamp || host.getAttribute("line-clamp") || 1));

useHostFlag("data-line-clamp", () => Boolean(props.lineClamp || host.getAttribute("line-clamp")));
useHostFlag("mark", () => Boolean(props.mark));
useHostFlag("deleted", () => Boolean(props.deleted));
useHostFlag("inserted", () => Boolean(props.inserted));
useHostFlag("strong", () => Boolean(props.strong));
useHostFlag("italic", () => Boolean(props.italic));
useHostCssVar("--_line-clamp", () => String(lineClampValue()));

defineStyle(styles);

const Text = defineHtml<TextProps, Record<string, never>, TextSlots>(html`
  <span class="text" part="text">
    <slot></slot>
  </span>
`);

export { Text };
