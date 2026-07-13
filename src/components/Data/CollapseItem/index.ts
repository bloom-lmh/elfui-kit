import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHost,
  useHostFlag
} from "elfui";

import styles from "./style.scss?inline";
import type { CollapseItemProps, CollapseItemSlots } from "../Collapse/types";

export type { CollapseItemProps, CollapseItemSlots } from "../Collapse/types";

const props = defineProps<CollapseItemProps>({
  name: { type: null, default: "" },
  title: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false }
});

const host = useHost();
let idSeed = 0;
const id = `elf-collapse-item-${++idSeed}`;
const panelId = `${id}-panel`;
const headerId = `${id}-header`;

useHostFlag("data-active", () => Boolean(props.active));
useHostFlag("disabled", () => Boolean(props.disabled));

const requestToggle = (): void => {
  if (props.disabled) return;
  host.dispatchEvent(
    new CustomEvent("elf-collapse-toggle", {
      bubbles: true,
      composed: true
    })
  );
};

defineExpose({ toggle: requestToggle });

defineStyle(styles);

const CollapseItem = defineHtml<CollapseItemProps, Record<string, never>, CollapseItemSlots>(html`
  <section class="item" part="item">
    <button
      class="header"
      part="header"
      type="button"
      :id=${headerId}
      :disabled=${props.disabled}
      :aria-expanded=${props.active ? "true" : "false"}
      :aria-controls=${panelId}
      @click=${requestToggle}
    >
      <span class="title" part="title"><slot name="title">${props.title}</slot></span>
      <span class="arrow" part="icon" aria-hidden="true"><slot name="icon">›</slot></span>
    </button>
    <div
      class="body"
      part="body"
      :id=${panelId}
      role="region"
      :aria-labelledby=${headerId}
      :aria-hidden=${props.active ? "false" : "true"}
    >
      <slot></slot>
    </div>
  </section>
`);

export { CollapseItem };
