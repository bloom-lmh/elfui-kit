import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  useHost,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";

export type { PaginationLayoutPart, PaginationProps, PaginationSize } from "./types";

const props = defineProps({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: undefined },
  defaultCurrentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: undefined },
  defaultPageSize: { type: Number, default: 10 },
  pageCount: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
  pagerCount: { type: Number, default: 7 },
  layout: { type: String, default: "total, sizes, prev, pager, next, jumper" },
  background: { type: Boolean, default: false },
  size: { type: String, default: "" },
  small: { type: Boolean, default: false },
  prevText: { type: String, default: "" },
  nextText: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  hideOnSinglePage: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "Pagination" }
});

const emit = defineEmits([
  "update:currentPage",
  "update:pageSize",
  "current-change",
  "size-change",
  "change",
  "prev-click",
  "next-click"
]);

const host = useHost();
const initialSize = Math.max(1, Math.trunc(Number(props.defaultPageSize) || 10));
const page = useRef(Math.max(1, Math.trunc(Number(props.defaultCurrentPage) || 1)));
const size = useRef(initialSize);
const jumpValue = useRef(String(page.value));

const total = (): number => Math.max(0, Number(props.total) || 0);
const pageSize = (): number => Math.max(1, Math.trunc(Number(size.value) || initialSize));
const pageCount = (): number => {
  const explicit = Math.trunc(Number(props.pageCount) || 0);
  return explicit > 0 ? explicit : Math.max(1, Math.ceil(total() / pageSize()));
};
const clampPage = (value: number): number =>
  Math.min(Math.max(1, Math.trunc(Number(value) || 1)), pageCount());

const syncPage = (next: number): void => {
  const normalized = clampPage(next);
  if (normalized === page.peek()) return;
  page.set(normalized);
  jumpValue.set(String(normalized));
};

const emitPage = (next: number): void => {
  const normalized = clampPage(next);
  if (normalized === page.value) return;
  page.set(normalized);
  jumpValue.set(String(normalized));
  emit("update:currentPage", normalized);
  emit("current-change", normalized);
  emit("change", normalized, pageSize());
};

const emitSize = (next: number): void => {
  const normalized = Math.max(1, Math.trunc(Number(next) || pageSize()));
  if (normalized === size.value) return;
  const previousPage = page.value;
  size.set(normalized);
  const nextPage = clampPage(previousPage);
  page.set(nextPage);
  jumpValue.set(String(nextPage));
  emit("update:pageSize", normalized);
  emit("size-change", normalized);
  if (nextPage !== previousPage) {
    emit("update:currentPage", nextPage);
    emit("current-change", nextPage);
  }
  emit("change", nextPage, normalized);
};

// Defaults establish initial uncontrolled state. A supplied v-model prop takes over afterwards.
watchEffect(() => {
  if (props.pageSize != null) {
    const nextSize = Math.max(1, Math.trunc(Number(props.pageSize) || initialSize));
    if (nextSize !== size.peek()) size.set(nextSize);
  }
});

watchEffect(() => {
  if (props.currentPage != null) syncPage(Number(props.currentPage));
});

watchEffect(() => {
  syncPage(page.value);
});

const hasPart = (part: string): boolean =>
  String(props.layout || "")
    .split(",")
    .map((item) => item.trim())
    .includes(part);

const isHidden = (): boolean => Boolean(props.hideOnSinglePage && pageCount() <= 1);
const isFirst = (): boolean => page.value <= 1;
const isLast = (): boolean => page.value >= pageCount();
const totalText = (): string => `共 ${total()} 条`;
const componentClass = (): Record<string, boolean> => ({
  "is-background": props.background,
  "is-small": props.small || props.size === "small",
  "is-large": props.size === "large",
  "is-disabled": props.disabled
});

const pageItems = (): PagerItem[] => {
  const count = pageCount();
  const current = page.value;
  const rawPagerCount = Math.max(5, Number(props.pagerCount) || 7);
  const pagerCount = rawPagerCount % 2 === 0 ? rawPagerCount + 1 : rawPagerCount;
  if (count <= pagerCount) {
    return Array.from({ length: count }, (_, index) => ({
      key: String(index + 1),
      label: String(index + 1),
      page: index + 1,
      ellipsis: false
    }));
  }

  const side = Math.floor((pagerCount - 3) / 2);
  let start = Math.max(2, current - side);
  let end = Math.min(count - 1, current + side);
  if (current <= side + 2) {
    start = 2;
    end = pagerCount - 2;
  } else if (current >= count - side - 1) {
    start = count - pagerCount + 3;
    end = count - 1;
  }

  const items: PagerItem[] = [{ key: "1", label: "1", page: 1, ellipsis: false }];
  if (start > 2) items.push({ key: "prev-more", label: "...", page: Math.max(1, start - 1), ellipsis: true });
  for (let pageNo = start; pageNo <= end; pageNo++) {
    items.push({ key: String(pageNo), label: String(pageNo), page: pageNo, ellipsis: false });
  }
  if (end < count - 1) items.push({ key: "next-more", label: "...", page: Math.min(count, end + 1), ellipsis: true });
  items.push({ key: String(count), label: String(count), page: count, ellipsis: false });
  return items;
};

const go = (next: number): void => {
  if (!props.disabled) emitPage(next);
};
const isPageActive = (item: PagerItem): boolean => !item.ellipsis && item.page === page.value;
const pageLabel = (item: PagerItem): string =>
  item.ellipsis ? `Jump to page ${item.page}` : `Page ${item.page}`;
const isSizeSelected = (item: unknown): boolean => Number(item) === size.value;
const prevLabel = (): string => props.prevText || "Previous page";
const nextLabel = (): string => props.nextText || "Next page";

const prev = (): void => {
  if (props.disabled || isFirst()) return;
  const nextPage = page.value - 1;
  emit("prev-click", nextPage);
  emitPage(nextPage);
};

const next = (): void => {
  if (props.disabled || isLast()) return;
  const nextPage = page.value + 1;
  emit("next-click", nextPage);
  emitPage(nextPage);
};

const onSizeChange = (event: Event): void => {
  if (!props.disabled) emitSize(Number((event.target as HTMLSelectElement).value));
};
const onJumpInput = (event: Event): void => jumpValue.set((event.target as HTMLInputElement).value);
const commitJump = (): void => {
  if (!props.disabled) emitPage(Number(jumpValue.value));
};
const onJumpKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    event.preventDefault();
    commitJump();
  }
};

const defaultPageSize = (): number => {
  const attribute = host.getAttribute("default-page-size");
  return Math.max(1, Math.trunc(Number(attribute ?? props.defaultPageSize) || initialSize));
};

const defaultCurrentPage = (): number => {
  const attribute = host.getAttribute("default-current-page");
  return Math.max(1, Math.trunc(Number(attribute ?? props.defaultCurrentPage) || 1));
};

// Custom-element properties assigned before connection are finalized by mount time.
// Sample defaults once here without turning them into reactive controlled values.
onMount(() => {
  if (props.pageSize == null) {
    size.set(defaultPageSize());
  }
  if (props.currentPage == null) {
    syncPage(defaultCurrentPage());
  }
});

defineStyle(styles);

const Pagination = defineHtml(html`
  <nav
    v-if=${!isHidden()}
    class="pagination"
    :class=${componentClass()}
    role="navigation"
    :aria-label=${props.ariaLabel}
  >
    <span v-if=${hasPart("total")} class="total">${totalText()}</span>

    <label v-if=${hasPart("sizes")} class="sizes">
      <span class="sr-only">Items per page</span>
      <select :value=${size.value} :disabled=${props.disabled} @change=${onSizeChange}>
        <option v-for="item in props.pageSizes" :key="item" :value="item" :selected="isSizeSelected(item)">
          {{ item }} / page
        </option>
      </select>
    </label>

    <button
      v-if=${hasPart("prev")}
      class="nav"
      type="button"
      :disabled=${props.disabled || isFirst()}
      :aria-label=${prevLabel()}
      @click=${prev}
    >
      <span v-if=${!props.prevText} class="chevron chevron-left"></span>
      <span v-if=${props.prevText}>${props.prevText}</span>
    </button>

    <div v-if=${hasPart("pager")} class="pager" role="list" aria-label="Page list">
      <button
        v-for="item in pageItems()"
        :key="item.key"
        type="button"
        class="page"
        :class="{ 'is-active': isPageActive(item), 'is-ellipsis': item.ellipsis }"
        :disabled=${props.disabled}
        :aria-label="pageLabel(item)"
        :aria-current="isPageActive(item) ? 'page' : undefined"
        @click="go(item.page)"
      >
        {{ item.label }}
      </button>
    </div>

    <button
      v-if=${hasPart("next")}
      class="nav"
      type="button"
      :disabled=${props.disabled || isLast()}
      :aria-label=${nextLabel()}
      @click=${next}
    >
      <span v-if=${!props.nextText} class="chevron chevron-right"></span>
      <span v-if=${props.nextText}>${props.nextText}</span>
    </button>

    <label v-if=${hasPart("jumper")} class="jumper">
      <span>Go to</span>
      <input
        :value=${jumpValue.value}
        :disabled=${props.disabled}
        type="number"
        min="1"
        :max=${pageCount()}
        aria-label="Go to page"
        @input=${onJumpInput}
        @change=${commitJump}
        @keydown=${onJumpKeydown}
      />
      <span>page</span>
    </label>
    <slot></slot>
  </nav>
`);

type PagerItem = { key: string; label: string; page: number; ellipsis: boolean };

export { Pagination };
