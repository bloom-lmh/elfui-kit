import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageSegmentedProps } from "./props";

useComponents({ "page-segmented-props": PageSegmentedProps });

const period = useRef("day");
const density = useRef("md");
const periodOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "全年", value: "year", disabled: true }
];
const code1 = `<elf-segmented
  name="period"
  aria-label="数据周期"
  :options.prop="periodOptions"
  :modelValue.prop="period"
  @update:modelValue="onPeriodUpdate"
/>`;
const script1 = `const period = useRef("day");
const periodOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "全年", value: "year", disabled: true }
];`;
const code2 = `<elf-segmented block size="lg" :options.prop="['紧凑', '默认', '宽松']" :modelValue.prop="density" />`;

const onPeriodUpdate = (event: CustomEvent): void => period.set(String(event.detail || ""));
const onDensityUpdate = (event: CustomEvent): void => density.set(String(event.detail || ""));

const PageSegmented = defineHtml(html`
  <elf-container>
    <h1>Segmented 分段控制器</h1>
    <p>在少量互斥选项中切换状态，支持受控值、禁用项、尺寸、block 布局及键盘导航。</p>
    <elf-playground title="受控值、标签与禁用项" :code=${code1} :script=${script1}>
      <elf-segmented name="period" aria-label="数据周期" :options.prop=${periodOptions} :modelValue=${period} @update:modelValue=${onPeriodUpdate}></elf-segmented>
      <span class="demo-state">当前：{{ period.value }}</span>
    </elf-playground>
    <elf-playground title="block / size" :code=${code2}>
      <div style="width:360px"><elf-segmented block size="lg" :options.prop=${["紧凑", "默认", "宽松"]} :modelValue=${density} @update:modelValue=${onDensityUpdate}></elf-segmented></div>
    </elf-playground>
    <p>聚焦任一选项后，使用 ←/↑、→/↓、Home 和 End 在可用项之间切换。</p>
    <page-segmented-props></page-segmented-props>
  </elf-container>
`);
export { PageSegmented };
