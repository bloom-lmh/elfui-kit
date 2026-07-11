import { defineEmits, defineHtml, defineProps, defineStyle, html, onMount } from "elfui";

import styles from "./style.scss?inline";
import type { InfiniteScrollProps } from "./types";

export type { InfiniteScrollProps } from "./types";

const props = defineProps<InfiniteScrollProps>({
  disabled: { type: Boolean, default: false },
  distance: { type: Number, default: 0 },
  immediate: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["load"]);

const canLoad = (): boolean => !props.disabled && !props.loading;

const load = (): void => {
  if (canLoad()) emit("load");
};

const onScroll = (event: Event): void => {
  const el = event.currentTarget as HTMLElement;
  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
  if (remaining <= Math.max(0, Number(props.distance) || 0)) load();
};

onMount(() => {
  if (props.immediate) queueMicrotask(load);
});

defineStyle(styles);

const InfiniteScroll = defineHtml<InfiniteScrollProps>(html`
  <div class="scroll" part="scroll" @scroll=${onScroll}>
    <slot></slot>
  </div>
`);

export { InfiniteScroll };
