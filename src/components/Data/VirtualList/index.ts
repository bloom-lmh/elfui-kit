import { defineExpose, defineHtml, defineProps, defineStyle, html, onUnmount, useRef, useTemplateRef, watchEffect } from "@elfui/core";
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
  overscan: { type: Number, default: 10 },
  bordered: { type: Boolean, default: false },
  divided: { type: Boolean, default: true },
  emptyText: { type: String, default: "" },
  listItemClass: { type: String, default: "" },
  listItemStyle: { type: null, default: "" }
});

const locale = useLocaleProvider();

const viewportRef = useTemplateRef<HTMLElement>("viewport");
const scrollOffset = useRef(0);
const viewportSize = useRef(320);
let cachedWindowKey = "";
let cachedWindow = computeVirtualWindow({ count: 0, itemSize: 1, viewportSize: 0, scrollOffset: 0 });
let cachedVisibleSource: unknown[] | null = null;
let cachedVisibleStart = -1;
let cachedVisibleEnd = -1;
let cachedVisibleItems: Array<{ item: unknown; index: number; key: string }> = [];
let scrollSyncTimer: ReturnType<typeof setTimeout> | undefined;
const items = (): unknown[] => Array.isArray(props.items) ? props.items : [];
const itemHeight = (): number => Math.max(1, Number(props.itemHeight) || 48);
const effectiveOverscan = (size = viewportSize.value): number => Math.max(
  0,
  Number(props.overscan) || 0,
  Math.ceil(Math.max(0, size) / itemHeight())
);
const cssSize = (value: string | number): string => {
  if (typeof value === "number") return `${value}px`;
  const normalized = String(value).trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};
const windowState = () => {
  const source = items();
  const key = `${source.length}:${itemHeight()}:${viewportSize.value}:${scrollOffset.value}:${effectiveOverscan()}`;
  if (key === cachedWindowKey) return cachedWindow;
  cachedWindowKey = key;
  cachedWindow = computeVirtualWindow({
    count: source.length,
    itemSize: itemHeight(),
    viewportSize: viewportSize.value,
    scrollOffset: scrollOffset.value,
    overscan: effectiveOverscan()
  });
  return cachedWindow;
};
const visibleItems = (): Array<{ item: unknown; index: number; key: string }> => {
  const source = items();
  const state = windowState();
  if (source === cachedVisibleSource && state.start === cachedVisibleStart && state.end === cachedVisibleEnd) {
    return cachedVisibleItems;
  }
  cachedVisibleSource = source;
  cachedVisibleStart = state.start;
  cachedVisibleEnd = state.end;
  cachedVisibleItems = source.slice(state.start, state.end).map((item, offset) => {
    const index = state.start + offset;
    return { item, index, key: keyOf(item, index) };
  });
  return cachedVisibleItems;
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
const itemStyle = (): string | Record<string, string | number> =>
  typeof props.listItemStyle === "string"
    ? `${props.listItemStyle};height:${itemHeight()}px`
    : { ...(props.listItemStyle || {}), height: `${itemHeight()}px` };
const mountContent = (element: HTMLElement, value: unknown): void => {
  element.replaceChildren();
  if (value == null) return;
  if (typeof Node !== "undefined" && value instanceof Node) element.appendChild(value);
  else element.textContent = String(value);
};
const renderWindowImmediately = (
  state: ReturnType<typeof computeVirtualWindow>,
  viewport: HTMLElement | null = viewportRef.value
): void => {
  const windowElement = viewport?.querySelector<HTMLElement>(".window");
  if (!windowElement) return;
  const existing = new Map(
    Array.from(windowElement.querySelectorAll<HTMLElement>(".item[data-virtual-key]"))
      .map((element) => [String(element.dataset.virtualKey), element] as const)
  );
  const source = items();
  const nextElements: HTMLElement[] = [];
  for (let index = state.start; index < state.end; index += 1) {
    const item = source[index];
    const key = keyOf(item, index);
    const element = existing.get(key) ?? document.createElement("div");
    element.className = `item ${String(props.listItemClass || "")}`.trim();
    element.setAttribute("part", "item list-item");
    element.setAttribute("role", "listitem");
    element.dataset.virtualKey = key;
    element.dataset.virtualIndex = String(index);
    mountContent(element, render(item, index));
    element.style.cssText = typeof props.listItemStyle === "string" ? props.listItemStyle : "";
    if (props.listItemStyle && typeof props.listItemStyle === "object") {
      Object.entries(props.listItemStyle).forEach(([name, value]) => {
        const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        element.style.setProperty(cssName, String(value));
      });
    }
    element.style.height = `${itemHeight()}px`;
    nextElements.push(element);
  }
  windowElement.style.top = "0px";
  windowElement.style.transform = `translate3d(0, ${state.offset}px, 0)`;
  windowElement.replaceChildren(...nextElements);
};

const synchronizeDeclarativeWindow = (offset: number, size: number): void => {
  if (scrollOffset.peek() !== offset) scrollOffset.set(offset);
  if (viewportSize.peek() !== size) viewportSize.set(size);
};

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const normalizedOffset = Math.max(0, target.scrollTop);
  const nextViewportSize = Math.max(0, target.clientHeight);
  // Native scrollbar thumb dragging can advance the compositor viewport
  // before a batched reactive render is committed. Recycle and position the
  // bounded row window synchronously in the scroll handler, then synchronize
  // the declarative state for subsequent prop-driven renders.
  const nextWindow = computeVirtualWindow({
    count: items().length,
    itemSize: itemHeight(),
    viewportSize: nextViewportSize,
    scrollOffset: normalizedOffset,
    overscan: effectiveOverscan(nextViewportSize)
  });
  renderWindowImmediately(nextWindow, target);

  // Keep the compositor-facing window synchronous while a scrollbar thumb is
  // moving. Reconciling the keyed template on every scroll event can briefly
  // clear that window in Chromium; commit once scrolling settles instead.
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = setTimeout(
    () => synchronizeDeclarativeWindow(normalizedOffset, nextViewportSize),
    96
  );
};
const scrollToOffset = (offset: number, behavior: ScrollBehavior = "auto"): void => viewportRef.value?.scrollTo({ top: Math.max(0, offset), behavior });
const scrollToIndex = (index: number, behavior: ScrollBehavior = "auto"): void => scrollToOffset(Math.max(0, Math.floor(index)) * itemHeight(), behavior);

watchEffect(() => {
  const maximum = Math.max(0, windowState().totalSize - viewportSize.value);
  if (scrollOffset.value <= maximum) return;
  scrollToOffset(maximum);
});

onUnmount(() => {
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = undefined;
});

defineExpose({ scrollToIndex, scrollToOffset });
defineStyle(styles);

const VirtualList = defineHtml<VirtualListProps>(html`
  <div ref="viewport" class="viewport" :class=${{ "is-bordered": props.bordered }} :style=${{ height: cssSize(props.height) }} role="list" @scroll=${onScroll}>
    <div v-if=${items().length > 0} class="spacer" :style=${{ height: `${windowState().totalSize}px` }}>
      <div
        class="window"
        :class=${{ "is-divided": props.divided }}
        :style=${{ transform: `translate3d(0, ${windowState().offset}px, 0)` }}
      >
        <div
          v-for="entry in visibleItems()"
          :key="entry.key"
          :class=${["item", props.listItemClass]}
          part="item list-item"
          :data-virtual-key=${entry.key}
          :data-virtual-index=${entry.index}
          :style=${itemStyle()}
          role="listitem"
          v-elf-list-content=${render(entry.item, entry.index)}
        ></div>
      </div>
    </div>
    <div v-else class="empty">${props.emptyText || locale.t("table.empty")}</div>
  </div>
`);

export { VirtualList };
