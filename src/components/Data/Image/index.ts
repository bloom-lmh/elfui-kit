import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  globalStyle,
  html,
  useComputed,
  useEffect,
  useEscapeKey,
  useHostCssVar,
  useRef
} from "elfui";

import styles from "./style.scss?inline";
import previewStyles from "./preview.scss?inline";
import type { ImageFit, ImageProps } from "./types";

export type { ImageFit, ImageProps } from "./types";

const props = defineProps<ImageProps>({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  fit: { type: String, default: "fill" },
  width: { type: [Number, String], default: "auto" },
  height: { type: [Number, String], default: "auto" },
  lazy: { type: Boolean, default: false },
  previewSrcList: { type: Array, default: () => [] },
  initialIndex: { type: Number, default: 0 },
  previewTeleported: { type: Boolean, default: false },
  zoomRate: { type: Number, default: 1.2 },
  toolbar: { type: Boolean, default: true }
});

const emit = defineEmits(["preview-open", "preview-close", "preview-change"]);
const error = useRef(false);
const previewOpen = useRef(false);
const activeIndex = useRef(0);
const scale = useRef(1);

const cssSize = (value: number | string): string =>
  typeof value === "number" ? `${Math.max(0, value)}px` : value || "auto";

const fit = (): ImageFit => {
  const value = String(props.fit || "fill") as ImageFit;
  return ["contain", "cover", "none", "scale-down"].includes(value) ? value : "fill";
};

const onError = (): void => {
  error.set(true);
};

const previewSources = (): string[] =>
  (Array.isArray(props.previewSrcList) ? props.previewSrcList : [])
    .filter((source): source is string => typeof source === "string" && source.trim().length > 0);

const previewable = useComputed(() => previewSources().length > 0);

const normalizedIndex = (index: number): number => {
  const total = previewSources().length;
  if (total === 0) return 0;
  return Math.min(Math.max(0, Math.floor(index)), total - 1);
};

const activeSource = useComputed(() => previewSources()[normalizedIndex(activeIndex.value)] || props.src);
const previewCounter = useComputed(() => `${normalizedIndex(activeIndex.value) + 1} / ${previewSources().length}`);
const zoomStep = (): number => Math.max(1.05, Number(props.zoomRate) || 1.2);
const imageTransform = useComputed(() => `scale(${scale.value})`);
const showNavigation = useComputed(() => previewSources().length > 1);

const openPreview = (): void => {
  if (!previewable.value) return;
  activeIndex.set(normalizedIndex(Number(props.initialIndex) || 0));
  scale.set(1);
  previewOpen.set(true);
  emit("preview-open", activeIndex.value);
};

const closePreview = (): void => {
  if (!previewOpen.peek()) return;
  previewOpen.set(false);
  scale.set(1);
  emit("preview-close", activeIndex.value);
};

const switchPreview = (offset: number): void => {
  const total = previewSources().length;
  if (total < 2) return;
  const next = (normalizedIndex(activeIndex.value) + offset + total) % total;
  activeIndex.set(next);
  scale.set(1);
  emit("preview-change", next);
};

const zoom = (direction: 1 | -1): void => {
  const next = direction > 0 ? scale.value * zoomStep() : scale.value / zoomStep();
  scale.set(Math.min(7, Math.max(0.2, next)));
};

const resetZoom = (): void => scale.set(1);

const onPreviewMaskClick = (event: MouseEvent): void => {
  if (event.target === event.currentTarget) closePreview();
};

useEffect(() => {
  props.src;
  error.set(false);
});

useEscapeKey(closePreview);

useHostCssVar("--_image-width", () => cssSize(props.width));
useHostCssVar("--_image-height", () => cssSize(props.height));
useHostCssVar("--_image-fit", fit);

defineStyle(`${styles}\n${previewStyles}`);
globalStyle(previewStyles);

const Image = defineHtml<ImageProps>(html`
  <div class="image" :class=${{ "is-previewable": previewable }} part="image" @click=${openPreview}>
    <slot v-if=${error.value} name="error">
      <div class="error">Load failed</div>
    </slot>
    <img
      v-else
      part="img"
      :src=${props.src}
      :alt=${props.alt}
      :loading=${props.lazy ? "lazy" : null}
      @error=${onError}
    />
  </div>
  <Teleport to="body">
    <div v-if=${previewOpen && props.previewTeleported} class="elf-image-preview" role="dialog" aria-modal="true" aria-label="Image preview" @click=${onPreviewMaskClick}>
      <img class="elf-image-preview__image" :src=${activeSource} :alt=${props.alt} :style=${{ transform: imageTransform }} />
      <button class="elf-image-preview__close" type="button" aria-label="Close preview" @click=${closePreview}>×</button>
      <button v-if=${showNavigation} class="elf-image-preview__nav elf-image-preview__nav--previous" type="button" aria-label="Previous image" @click=${() => switchPreview(-1)}>‹</button>
      <button v-if=${showNavigation} class="elf-image-preview__nav elf-image-preview__nav--next" type="button" aria-label="Next image" @click=${() => switchPreview(1)}>›</button>
      <span v-if=${showNavigation} class="elf-image-preview__counter" aria-live="polite">${previewCounter}</span>
      <div v-if=${props.toolbar} class="elf-image-preview__toolbar" role="toolbar" aria-label="Preview controls">
        <button type="button" aria-label="Zoom out" @click=${() => zoom(-1)}>−</button>
        <button type="button" aria-label="Reset zoom" @click=${resetZoom}>⟳</button>
        <button type="button" aria-label="Zoom in" @click=${() => zoom(1)}>+</button>
      </div>
    </div>
  </Teleport>
  <div v-if=${previewOpen && !props.previewTeleported} class="elf-image-preview" role="dialog" aria-modal="true" aria-label="Image preview" @click=${onPreviewMaskClick}>
    <img class="elf-image-preview__image" :src=${activeSource} :alt=${props.alt} :style=${{ transform: imageTransform }} />
    <button class="elf-image-preview__close" type="button" aria-label="Close preview" @click=${closePreview}>×</button>
    <button v-if=${showNavigation} class="elf-image-preview__nav elf-image-preview__nav--previous" type="button" aria-label="Previous image" @click=${() => switchPreview(-1)}>‹</button>
    <button v-if=${showNavigation} class="elf-image-preview__nav elf-image-preview__nav--next" type="button" aria-label="Next image" @click=${() => switchPreview(1)}>›</button>
    <span v-if=${showNavigation} class="elf-image-preview__counter" aria-live="polite">${previewCounter}</span>
    <div v-if=${props.toolbar} class="elf-image-preview__toolbar" role="toolbar" aria-label="Preview controls">
      <button type="button" aria-label="Zoom out" @click=${() => zoom(-1)}>−</button>
      <button type="button" aria-label="Reset zoom" @click=${resetZoom}>⟳</button>
      <button type="button" aria-label="Zoom in" @click=${() => zoom(1)}>+</button>
    </div>
  </div>
`);

export { Image };
