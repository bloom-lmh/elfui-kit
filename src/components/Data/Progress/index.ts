import {
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type { ProgressProps, ProgressStatus, ProgressVariant } from "./types";

export type { ProgressProps, ProgressStatus, ProgressVariant } from "./types";

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  variant: { type: String, default: "line" },
  status: { type: String, default: "" },
  color: { type: String, default: "" },
  trackColor: { type: String, default: "" },
  height: { type: String, default: "8px" },
  size: { type: Number, default: 96 },
  strokeWidth: { type: Number, default: 8 },
  showText: { type: Boolean, default: true },
  textInside: { type: Boolean, default: false },
  striped: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  format: { type: Function, default: undefined }
}) as unknown as Readonly<ProgressProps>;

const max = (): number => Math.max(1, Number(props.max) || 100);

const value = (): number => Math.min(Math.max(0, Number(props.value) || 0), max());

const percent = (): number => Math.round((value() / max()) * 100);

const variant = (): ProgressVariant => (props.variant === "circle" ? "circle" : "line");

const normalizedStatus = (): ProgressStatus => {
  const status = String(props.status || "") as ProgressStatus;
  if (status) return status;
  return percent() >= 100 ? "success" : "primary";
};

const tokenColor = (): string => {
  if (props.color) return String(props.color);
  switch (normalizedStatus()) {
    case "success":
      return "var(--elf-success)";
    case "warning":
      return "var(--elf-warning)";
    case "danger":
      return "var(--elf-danger)";
    case "info":
      return "var(--elf-info)";
    default:
      return "var(--elf-primary)";
  }
};

const label = (): string => {
  const formatter = props.format;
  if (typeof formatter === "function") return formatter(percent(), value());
  return props.indeterminate ? "进行中" : `${percent()}%`;
};

const circleSize = (): string => `${Math.max(40, Number(props.size) || 96)}px`;

const stroke = (): number => Math.min(Math.max(2, Number(props.strokeWidth) || 8), 24);

const radius = (): number => 50 - stroke() / 2;

const dashOffset = (): number => (props.indeterminate ? 72 : 100 - percent());

useHostAttr("variant", variant);
useHostAttr("status", normalizedStatus);
useHostFlag("data-indeterminate", () => Boolean(props.indeterminate));
useHostFlag("data-striped", () => Boolean(props.striped));
useHostFlag("data-text-inside", () => Boolean(props.textInside));
useHostCssVar("--_progress-percent", () => `${props.indeterminate ? 42 : percent()}%`);
useHostCssVar("--_progress-color", tokenColor);
useHostCssVar("--_progress-track", () => props.trackColor || "var(--elf-bg-overlay)");
useHostCssVar("--_progress-height", () => props.height || "8px");
useHostCssVar("--_progress-size", circleSize);
useHostCssVar("--_progress-stroke", () => String(stroke()));

defineStyle(styles);

const Progress = defineHtml(html`
  <div
    class="progress"
    role="progressbar"
    :aria-valuemin=${0}
    :aria-valuemax=${max()}
    :aria-valuenow=${props.indeterminate ? null : value()}
    :aria-valuetext=${label()}
  >
    <div v-if=${variant() === "line"} class="line">
      <div class="line-track">
        <div class="line-value"></div>
        <span v-if=${props.showText && props.textInside} class="line-text inside">${label()}</span>
      </div>
      <span v-if=${props.showText && !props.textInside} class="line-text">${label()}</span>
    </div>

    <div v-else class="circle">
      <svg class="circle-svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="circle-track" cx="50" cy="50" :r=${radius()} pathLength="100" fill="none" />
        <circle
          class="circle-value"
          cx="50"
          cy="50"
          :r=${radius()}
          pathLength="100"
          fill="none"
          :stroke-dashoffset=${dashOffset()}
        />
      </svg>
      <span v-if=${props.showText} class="circle-text">${label()}</span>
    </div>
  </div>
`);

export { Progress };
