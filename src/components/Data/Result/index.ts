import { defineHtml, defineProps, defineStyle, html, useHostAttr } from "elfui";

import styles from "./style.scss?inline";
import type { ResultIcon, ResultProps, ResultSlots } from "./types";

export type { ResultIcon, ResultProps, ResultSlots } from "./types";

const props = defineProps<ResultProps>({
  icon: { type: String, default: "info" },
  title: { type: String, default: "" },
  subTitle: { type: String, default: "" }
});

const normalizedIcon = (): ResultIcon => {
  const value = String(props.icon || "info") as ResultIcon;
  return ["success", "warning", "error"].includes(value) ? value : "info";
};

const iconText = (): string => {
  switch (normalizedIcon()) {
    case "success":
      return "OK";
    case "warning":
      return "!";
    case "error":
      return "X";
    default:
      return "i";
  }
};

useHostAttr("icon", normalizedIcon);

defineStyle(styles);

const Result = defineHtml<ResultProps, Record<string, never>, ResultSlots>(html`
  <div class="result" part="result" role="status" aria-live="polite">
    <div class="icon" part="icon">
      <slot name="icon">${iconText()}</slot>
    </div>
    <div class="title" part="title">
      <slot name="title">${props.title}</slot>
    </div>
    <div class="subtitle" part="sub-title">
      <slot name="sub-title">${props.subTitle}</slot>
    </div>
    <div class="extra" part="extra">
      <slot name="extra"></slot>
    </div>
  </div>
`);

export { Result };
