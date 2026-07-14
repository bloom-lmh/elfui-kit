import {
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useEffect,
  useHostFlag,
  useRef
} from "elfui";

import type { SplitterPanelProps, SplitterPanelSlots } from "./types";

const props = defineProps<SplitterPanelProps>({
  size: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  collapsible: { type: Boolean, default: false },
  resizable: { type: Boolean, default: true },
  lazy: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
});

const activated = useRef(!props.lazy || !props.collapsed);

useEffect(() => {
  if (!props.collapsed && !activated.peek()) activated.set(true);
});

useHostFlag("collapsed", () => props.collapsed);

defineStyle(`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  :host([collapsed]) {
    display: none;
  }
`);

const SplitterPanel = defineHtml<SplitterPanelProps, Record<string, never>, SplitterPanelSlots>(html`
  <slot v-if=${!props.lazy || activated}></slot>
`);

export { SplitterPanel };
