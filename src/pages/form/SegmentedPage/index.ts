import { defineHtml, html, useRef } from "elfui";

const period = useRef("day");
const density = useRef("md");

const periodOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "全年", value: "year", disabled: true }
];

const code1 = `<elf-segmented
  :options.prop=\${periodOptions}
  :modelValue=\${period}
  @update:modelValue=\${onPeriodUpdate}
/>
<span class="demo-state">当前：{{ period }}</span>`;

const script1 = `const period = useRef("day");

const periodOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "全年", value: "year", disabled: true }
];

const onPeriodUpdate = (event) => {
  period.set(event.detail);
};`;

const code2 = `<elf-segmented
  :options.prop=\${['紧凑', '默认', '宽松']}
  :modelValue=\${density}
  block
  size="lg"
  @update:modelValue=\${onDensityUpdate}
/>`;

const script2 = `const density = useRef("默认");

const onDensityUpdate = (event) => {
  density.set(event.detail);
};`;

const onPeriodUpdate = (event: CustomEvent): void => {
  period.set(String(event.detail || ""));
};

const onDensityUpdate = (event: CustomEvent): void => {
  density.set(String(event.detail || ""));
};

const PageSegmented = defineHtml(html`
  <elf-container>
    <h1>Segmented 分段控制器</h1>
    <p>在少量互斥选项中切换状态，支持受控值、禁用项、block 和尺寸。</p>

    <elf-playground title="受控值 / 禁用项" :code=${code1} :script=${script1}>
      <elf-segmented
        :options.prop=${periodOptions}
        :modelValue=${period}
        @update:modelValue=${onPeriodUpdate}
      ></elf-segmented>
      <span class="demo-state">当前：{{ period }}</span>
    </elf-playground>

    <elf-playground title="block / size" :code=${code2} :script=${script2}>
      <div style="width:360px">
        <elf-segmented
          :options.prop=${["紧凑", "默认", "宽松"]}
          :modelValue=${density}
          block
          size="lg"
          @update:modelValue=${onDensityUpdate}
        ></elf-segmented>
      </div>
    </elf-playground>
  </elf-container>
`);

export { PageSegmented };
