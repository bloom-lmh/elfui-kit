// elf-pagination - table-friendly pagination control

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";

export type { PaginationLayoutPart, PaginationProps } from "./types";

const props = defineProps({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
  pagerCount: { type: Number, default: 7 },
  layout: { type: String, default: "total, sizes, prev, pager, next, jumper" },
  background: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  hideOnSinglePage: { type: Boolean, default: false }
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

const page = useRef(1);

const size = useRef(10);

const jumpValue = useRef("1");

const total = (): number => Math.max(0, Number(props.total) || 0);

const pageSize = (): number => Math.max(1, Number(size.value) || 10);

const pageCount = (): number => Math.max(1, Math.ceil(total() / pageSize()));

const clampPage = (value: number): number =>
  Math.min(Math.max(1, Math.trunc(Number(value) || 1)), pageCount());

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
  size.set(normalized);
  const nextPage = clampPage(page.value);
  page.set(nextPage);
  jumpValue.set(String(nextPage));
  emit("update:pageSize", normalized);
  emit("size-change", normalized);
  emit("update:currentPage", nextPage);
  emit("current-change", nextPage);
  emit("change", nextPage, normalized);
};

watchEffect(() => {
  const nextSize = Math.max(1, Number(props.pageSize) || 10);
  if (nextSize !== size.peek()) size.set(nextSize);
});

watchEffect(() => {
  const next = clampPage(Number(props.currentPage) || 1);
  if (next !== page.peek()) {
    page.set(next);
    jumpValue.set(String(next));
  }
});

watchEffect(() => {
  const next = clampPage(page.value);
  if (next !== page.value) {
    page.set(next);
    jumpValue.set(String(next));
  }
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

const pageItems = (): PagerItem[] => {
  const count = pageCount();
  const current = page.value;
  const rawPagerCount = Math.max(5, Number(props.pagerCount) || 7);
  const pagerCount = rawPagerCount % 2 === 0 ? rawPagerCount + 1 : rawPagerCount;

  if (count <= pagerCount) {
    return Array.from({ length: count }, (_, index) => {
      const pageNo = index + 1;
      return {
        key: String(pageNo),
        label: String(pageNo),
        page: pageNo,
        ellipsis: false
      };
    });
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

  const out: PagerItem[] = [{ key: "1", label: "1", page: 1, ellipsis: false }];

  if (start > 2) {
    out.push({
      key: "prev-more",
      label: "...",
      page: Math.max(1, start - 1),
      ellipsis: true
    });
  }

  for (let pageNo = start; pageNo <= end; pageNo++) {
    out.push({
      key: String(pageNo),
      label: String(pageNo),
      page: pageNo,
      ellipsis: false
    });
  }

  if (end < count - 1) {
    out.push({
      key: "next-more",
      label: "...",
      page: Math.min(count, end + 1),
      ellipsis: true
    });
  }

  out.push({
    key: String(count),
    label: String(count),
    page: count,
    ellipsis: false
  });
  return out;
};

const go = (next: number): void => {
  if (props.disabled) return;
  emitPage(next);
};

const isPageActive = (item: PagerItem): boolean => !item.ellipsis && item.page === page.value;

const prev = (): void => {
  if (props.disabled || isFirst()) return;
  const next = page.value - 1;
  emit("prev-click", next);
  emitPage(next);
};

const next = (): void => {
  if (props.disabled || isLast()) return;
  const nextPage = page.value + 1;
  emit("next-click", nextPage);
  emitPage(nextPage);
};

const onSizeChange = (event: Event): void => {
  if (props.disabled) return;
  emitSize(Number((event.target as HTMLSelectElement).value));
};

const onJumpInput = (event: Event): void => {
  jumpValue.set((event.target as HTMLInputElement).value);
};

const commitJump = (): void => {
  if (props.disabled) return;
  emitPage(Number(jumpValue.value));
};

defineStyle(styles);

const Pagination = defineHtml(html`
  <div
    v-if=${!isHidden()}
    class="pagination"
    :class=${{
      "is-background": props.background,
      "is-small": props.small,
      "is-disabled": props.disabled
    }}
  >
    <span v-if=${hasPart("total")} class="total">${totalText()}</span>

    <label v-if=${hasPart("sizes")} class="sizes">
      <select :value=${size} :disabled=${props.disabled} @change="onSizeChange($event)">
        <option v-for="item in props.pageSizes" :key="item" :value="item">{{ item }} 条/页</option>
      </select>
    </label>

    <button
      v-if=${hasPart("prev")}
      class="nav"
      type="button"
      :disabled=${props.disabled || isFirst()}
      title="上一页"
      @click=${prev()}
    >
      <span class="chevron chevron-left"></span>
    </button>

    <div v-if=${hasPart("pager")} class="pager" role="list">
      <button
        v-for="item in pageItems()"
        :key="item.key"
        type="button"
        class="page"
        :class="{ 'is-active': isPageActive(item), 'is-ellipsis': item.ellipsis }"
        :disabled=${props.disabled}
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
      title="下一页"
      @click=${next()}
    >
      <span class="chevron chevron-right"></span>
    </button>

    <label v-if=${hasPart("jumper")} class="jumper">
      前往
      <input
        :value=${jumpValue}
        :disabled=${props.disabled}
        @input="onJumpInput($event)"
        @change=${commitJump()}
      />
      页
    </label>
  </div>
`);

type PagerItem = {
  key: string;
  label: string;
  page: number;
  ellipsis: boolean;
};

export { Pagination };
