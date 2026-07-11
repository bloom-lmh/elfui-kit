import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { WatermarkProps, WatermarkSlots } from "./types";

export type { WatermarkProps, WatermarkSlots } from "./types";

const props = defineProps<WatermarkProps>({
  content: { type: [String, Array], default: "" },
  image: { type: String, default: "" },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 64 },
  rotate: { type: Number, default: -22 },
  zIndex: { type: Number, default: 9 },
  gapX: { type: Number, default: 100 },
  gapY: { type: Number, default: 100 },
  offsetX: { type: Number, default: undefined },
  offsetY: { type: Number, default: undefined },
  fontSize: { type: Number, default: 16 },
  fontColor: { type: String, default: "rgba(0,0,0,0.15)" }
});

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const contentLines = (): string[] => {
  const value = props.content;
  const lines = Array.isArray(value) ? value : [value];
  return lines.map((line) => String(line)).filter(Boolean);
};

const tileWidth = (): number => Math.max(24, Number(props.width) || 120);
const tileHeight = (): number => Math.max(24, Number(props.height) || 64);

const svgText = (): string => {
  const width = tileWidth();
  const height = tileHeight();
  const lines = contentLines();
  const lineHeight = Math.max(14, Number(props.fontSize) || 16) + 4;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const body = props.image
    ? `<image href="${escapeXml(props.image)}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" />`
    : lines
        .map(
          (line, index) =>
            `<text x="50%" y="${startY + index * lineHeight}" dominant-baseline="middle" text-anchor="middle" font-size="${Number(props.fontSize) || 16}" fill="${escapeXml(props.fontColor)}">${escapeXml(line)}</text>`
        )
        .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g transform="rotate(${Number(props.rotate) || 0} ${width / 2} ${height / 2})">${body}</g></svg>`;
};

const backgroundImage = (): string => `url("data:image/svg+xml,${encodeURIComponent(svgText())}")`;

useHostCssVar("--_watermark-bg", backgroundImage);
useHostCssVar(
  "--_watermark-size",
  () => `${tileWidth() + Number(props.gapX || 0)}px ${tileHeight() + Number(props.gapY || 0)}px`
);
useHostCssVar("--_watermark-z", () => String(Number(props.zIndex) || 9));
useHostCssVar("--_watermark-offset-x", () => `${Number(props.offsetX ?? props.gapX / 2) || 0}px`);
useHostCssVar("--_watermark-offset-y", () => `${Number(props.offsetY ?? props.gapY / 2) || 0}px`);

defineStyle(styles);

const Watermark = defineHtml<WatermarkProps, Record<string, never>, WatermarkSlots>(html`
  <div class="watermark" part="watermark">
    <div class="content" part="content">
      <slot></slot>
    </div>
  </div>
`);

export { Watermark };
