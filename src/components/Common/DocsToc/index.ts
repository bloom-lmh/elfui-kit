import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useEffect,
  useHost,
  useRef
} from "elfui";

import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";
import type { DocsTocEmits, DocsTocProps } from "./types";

export type { DocsTocElement, DocsTocEmits, DocsTocExpose, DocsTocProps } from "./types";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

const props = defineProps<DocsTocProps>({
  routeKey: { type: String, default: "" },
  target: { type: String, default: "elf-main" },
  minLevel: { type: Number, default: 2 },
  maxLevel: { type: Number, default: 3 }
});

const emit = defineEmits<DocsTocEmits>();
const host = useHost();
const locale = useLocaleProvider();

const items = useRef<readonly TocItem[]>([]);
const activeId = useRef("");
let headingElements = new Map<string, HTMLElement>();
let observedRoots: Array<Document | ShadowRoot | HTMLElement> = [];
let observers: MutationObserver[] = [];
let refreshTimers: Array<ReturnType<typeof setTimeout>> = [];
let intersectionObserver: IntersectionObserver | undefined;
let frame = 0;
let removeRootClickListener = (): void => {};

const tocLabel = (): string => locale.name.toLowerCase().startsWith("en") ? "On this page" : "本页目录";
const tocItems = (): readonly TocItem[] => items.value;
const hasItems = (): boolean => items.value.length > 0;
const itemClass = (item: TocItem): Record<string, boolean> => ({
  item: true,
  active: activeId.value === item.id,
  [`level-${item.level}`]: true
});
const ariaCurrent = (item: TocItem): "location" | undefined =>
  activeId.value === item.id ? "location" : undefined;

const normalizeLevel = (tagName: string): number => Number(tagName.slice(1)) || 2;
const itemLevel = (element: HTMLElement): number =>
  element.tagName === "ELF-PLAYGROUND" ? Math.max(3, props.minLevel) : normalizeLevel(element.tagName);
const itemLabel = (element: HTMLElement): string =>
  element.tagName === "ELF-PLAYGROUND"
    ? String((element as HTMLElement & { title?: string }).title || element.getAttribute("title") || "").trim()
    : (element.textContent || "").replace(/\s+/g, " ").trim();

const slugify = (label: string, index: number): string => {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return `docs-${slug || "section"}-${index + 1}`;
};

const queryAcrossRoots = (
  root: Document | ShadowRoot | HTMLElement,
  selector: string
): HTMLElement | null => {
  const direct = root.querySelector<HTMLElement>(selector);
  if (direct) return direct;

  for (const element of Array.from(root.querySelectorAll<HTMLElement>("*"))) {
    if (!element.shadowRoot || element === host) continue;
    const nested = queryAcrossRoots(element.shadowRoot, selector);
    if (nested) return nested;
  }
  return null;
};

const disconnect = (): void => {
  observedRoots.forEach((root) => root.removeEventListener("scroll", scheduleActive, true));
  observedRoots = [];
  observers.forEach((observer) => observer.disconnect());
  observers = [];
  intersectionObserver?.disconnect();
  intersectionObserver = undefined;
};

const scheduleActive = (): void => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const ordered = Array.from(headingElements.entries());
    if (ordered.length === 0) return;

    const threshold = 112;
    let next = ordered[0]![0];
    for (const [id, element] of ordered) {
      if (element.getBoundingClientRect().top <= threshold) next = id;
      else break;
    }
    activeId.set(next);
  });
};

const collectRootsAndHeadings = (root: Document | ShadowRoot | HTMLElement): HTMLElement[] => {
  const headings: HTMLElement[] = [];
  if (!observedRoots.includes(root)) {
    observedRoots.push(root);
    root.addEventListener("scroll", scheduleActive, true);
  }

  const elements = Array.from(root.querySelectorAll<HTMLElement>("*"));
  for (const element of elements) {
    const insidePlayground = Boolean(element.parentElement?.closest("elf-playground"));
    if (element.tagName === "ELF-PLAYGROUND" && !insidePlayground && itemLabel(element)) {
      headings.push(element);
    }
    if (/^H[1-6]$/.test(element.tagName)) {
      const level = normalizeLevel(element.tagName);
      if (
        !insidePlayground &&
        level >= props.minLevel &&
        level <= props.maxLevel &&
        !element.closest("[data-docs-toc-ignore]")
      ) {
        headings.push(element);
      }
    }
    // Demo internals may contain headings (for example a step panel title), but
    // they are not documentation sections and must never pollute the page TOC.
    if (element.shadowRoot && element !== host && !insidePlayground) {
      headings.push(...collectRootsAndHeadings(element.shadowRoot));
    }
  }
  return headings;
};

const refresh = (): void => {
  disconnect();
  const shellRoot = host.getRootNode() as Document | ShadowRoot;
  const target = queryAcrossRoots(shellRoot, props.target)
    || (host.ownerDocument && shellRoot !== host.ownerDocument
      ? queryAcrossRoots(host.ownerDocument, props.target)
      : null);
  if (!target) {
    items.set([]);
    headingElements = new Map();
    return;
  }

  const headings = collectRootsAndHeadings(target);
  const nextItems: TocItem[] = [];
  const nextElements = new Map<string, HTMLElement>();
  headings.forEach((heading, index) => {
    const label = itemLabel(heading);
    if (!label) return;
    const id = heading.dataset.docsTocId || slugify(label, index);
    heading.dataset.docsTocId = id;
    nextItems.push({ id, label, level: itemLevel(heading) });
    nextElements.set(id, heading);
  });

  items.set(nextItems);
  headingElements = nextElements;
  activeId.set(nextItems[0]?.id || "");

  if (typeof IntersectionObserver !== "undefined") {
    intersectionObserver = new IntersectionObserver(scheduleActive, {
      root: null,
      rootMargin: "-96px 0px -70% 0px",
      threshold: [0, 1]
    });
    headings.forEach((heading) => intersectionObserver?.observe(heading));
  }

  observedRoots.forEach((root) => {
    const observer = new MutationObserver(() => scheduleRefresh(40));
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    observers.push(observer);
  });
  scheduleActive();
};

const scheduleRefresh = (delay = 0): void => {
  const timer = setTimeout(refresh, delay);
  refreshTimers.push(timer);
};

const composedParent = (element: HTMLElement): HTMLElement | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host as HTMLElement : null;
};

const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
  let current = composedParent(element);
  while (current && current !== document.documentElement) {
    const overflowY = getComputedStyle(current).overflowY;
    if (/(auto|scroll|overlay)/.test(overflowY) && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = composedParent(current);
  }
  return null;
};

const navigate = (id: string): void => {
  const heading = headingElements.get(id);
  if (!heading) return;
  activeId.set(id);
  const container = findScrollContainer(heading);
  if (container && typeof container.scrollTo === "function") {
    const containerRect = container.getBoundingClientRect();
    const headingRect = heading.getBoundingClientRect();
    container.scrollTo({
      top: Math.max(0, container.scrollTop + headingRect.top - containerRect.top - 24),
      behavior: "smooth"
    });
  } else {
    heading.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  emit("navigate", id);
};

const onRootClick = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>("button[data-toc-id]");
  if (button?.dataset.tocId) navigate(button.dataset.tocId);
};

useEffect(() => {
  void props.routeKey;
  scheduleRefresh();
  scheduleRefresh(60);
});

onMount(() => {
  host.shadowRoot?.addEventListener("click", onRootClick);
  removeRootClickListener = () => host.shadowRoot?.removeEventListener("click", onRootClick);
  scheduleRefresh();
  scheduleRefresh(100);
});

onUnmount(() => {
  removeRootClickListener();
  removeRootClickListener = () => {};
  disconnect();
  refreshTimers.forEach((timer) => clearTimeout(timer));
  refreshTimers = [];
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
});

defineExpose({ refresh });
defineStyle(styles);

const DocsToc = defineHtml<DocsTocProps, DocsTocEmits>(html`
  <nav class="toc" :aria-label=${tocLabel()} v-if="hasItems()">
    <strong class="label">${tocLabel()}</strong>
    <div class="items">
      <button
        v-for="item in tocItems()"
        :key="item.id"
        type="button"
        :class="itemClass(item)"
        :aria-current="ariaCurrent(item)"
        :data-toc-id="item.id"
      >{{ item.label }}</button>
    </div>
  </nav>
`);

export { DocsToc };
