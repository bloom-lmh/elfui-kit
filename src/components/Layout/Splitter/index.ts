import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef
} from "elfui";

import styles from "./style.scss?inline";
import type { SplitterProps, SplitterSlots } from "./types";

export type { SplitterProps, SplitterSlots } from "./types";

const props = defineProps<SplitterProps>({
  modelValue: { type: Number, default: 50 },
  min: { type: Number, default: 10 },
  max: { type: Number, default: 90 },
  vertical: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue", "change", "resize-start", "resize-end"]);
const dragging = useRef(false);
const size = useRef(50);

const clamp = (value: number): number =>
  Math.min(Number(props.max) || 90, Math.max(Number(props.min) || 10, value));

const currentSize = (): number => clamp(Number(props.modelValue || size.value || 50));

const onPointerMove = (event: PointerEvent): void => {
  if (!dragging.value) return;
  const container = (event.currentTarget as HTMLElement | null)?.querySelector(
    ".splitter"
  ) as HTMLElement | null;
  const rect = container?.getBoundingClientRect();
  if (!rect) return;
  const raw = props.vertical
    ? ((event.clientY - rect.top) / rect.height) * 100
    : ((event.clientX - rect.left) / rect.width) * 100;
  const next = clamp(raw);
  size.set(next);
  emit("update:modelValue", next);
  emit("change", next);
};

const onPointerUp = (): void => {
  if (!dragging.value) return;
  dragging.set(false);
  emit("resize-end", currentSize());
};

const onPointerDown = (event: PointerEvent): void => {
  if (props.disabled) return;
  event.preventDefault();
  dragging.set(true);
  emit("resize-start", currentSize());
};

useHostAttr("vertical", () => (props.vertical ? "" : null));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostCssVar("--_splitter-size", () => `${currentSize()}%`);

defineStyle(styles);

const Splitter = defineHtml<SplitterProps, Record<string, unknown>, SplitterSlots>(html`
  <div class="splitter" part="splitter" @pointermove=${onPointerMove} @pointerup=${onPointerUp}>
    <section class="pane first" part="first"><slot name="first"></slot></section>
    <div class="bar" part="bar" role="separator" tabindex="0" @pointerdown=${onPointerDown}></div>
    <section class="pane second" part="second"><slot name="second"></slot></section>
  </div>
`);

export { Splitter };
