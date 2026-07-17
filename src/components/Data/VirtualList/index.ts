import { defineExpose, defineHtml, defineProps, defineStyle, html, useRef, useTemplateRef, watchEffect } from "elfui";
import "../list-content";
import { computeVirtualWindow } from "../virtual-window";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { ListItemRenderer } from "../List/types";
import type { VirtualListProps } from "./types";

export type { VirtualListExpose, VirtualListProps } from "./types";

const props = defineProps<VirtualListProps>({
  items: { type: Array, default: () => [] },
  itemKey: { type: [String, Function], default: "id" },
  renderItem: { type: Function },
  height: { type: [String, Number], default: 320 },
  itemHeight: { type: Number, default: 48 },
  overscan: { type: Number, default: 4 },
  bordered: { type: Boolean, default: false },
  divided: { type: Boolean, default: true },
  emptyText: { type: String, default: "" }
});

const locale = useLocaleProvider();

const viewportRef = useTemplateRef<HTMLElement>("viewport");
const scrollOffset = useRef(0);
const viewportSize = useRef(320);
const items = (): unknown[] => Array.isArray(props.items) ? props.items : [];
const itemHeight = (): number => Math.max(1, Number(props.itemHeight) || 48);
const cssSize = (value: string | number): string => {
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};
const windowState = () => computeVirtualWindow({ count: items().length, itemSize: itemHeight(), viewportSize: viewportSize.value, scrollOffset: scrollOffset.value, overscan: props.overscan });
const visibleItems = (): Array<{ item: unknown; index: number; key: string }> => {
  const state = windowState();
  return items().slice(state.start, state.end).map((item, offset) => {
    const index = state.start + offset;
    return { item, index, key: keyOf(item, index) };
  });
};
const keyOf = (item: unknown, index: number): string => {
  if (typeof props.itemKey === "function") return String(props.itemKey(item, index));
  if (item && typeof item === "object") return String((item as Record<string, unknown>)[String(props.itemKey)] ?? index);
  return String(index);
};
const render = (item: unknown, index: number): unknown => {
  if (typeof props.renderItem === "function") return (props.renderItem as ListItemRenderer)(item, index);
  return item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "");
};
const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  scrollOffset.set(target.scrollTop);
  viewportSize.set(target.clientHeight);
};
const scrollToOffset = (offset: number, behavior: ScrollBehavior = "auto"): void => viewportRef.value?.scrollTo({ top: Math.max(0, offset), behavior });
const scrollToIndex = (index: number, behavior: ScrollBehavior = "auto"): void => scrollToOffset(Math.max(0, Math.floor(index)) * itemHeight(), behavior);

watchEffect(() => {
  if (scrollOffset.value <= windowState().totalSize) return;
  scrollToOffset(windowState().totalSize);
});

defineExpose({ scrollToIndex, scrollToOffset });
defineStyle(styles);

const VirtualList = defineHtml<VirtualListProps>(html`
  <div ref="viewport" class="viewport" :class=${{ "is-bordered": props.bordered }} :style=${{ height: cssSize(props.height) }} role="list" @scroll=${onScroll}>
    <div v-if=${items().length > 0} class="spacer" :style=${{ height: `${windowState().totalSize}px` }}>
      <div class="window" :class=${{ "is-divided": props.divided }} :style=${{ transform: `translateY(${windowState().offset}px)` }}>
        <div v-for="entry in visibleItems()" :key="entry.key" class="item" part="item" :style=${{ height: `${itemHeight()}px` }} role="listitem" v-elf-list-content=${render(entry.item, entry.index)}></div>
      </div>
    </div>
    <div v-else class="empty">${props.emptyText || locale.t("table.empty")}</div>
  </div>
`);

export { VirtualList };
