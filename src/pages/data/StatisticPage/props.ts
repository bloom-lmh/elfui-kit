import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "value", type: "number", default: "0", desc: "统计值" },
  { name: "title", type: "string", default: "''", desc: "标题" },
  { name: "prefix", type: "string", default: "''", desc: "数字前缀" },
  { name: "suffix", type: "string", default: "''", desc: "数字后缀" },
  { name: "precision", type: "number", default: "-", desc: "小数位数" },
  { name: "group-separator", type: "string", default: "','", desc: "千分位分隔符" },
  { name: "decimal-separator", type: "string", default: "'.'", desc: "小数点分隔符" },
  { name: "formatter", type: "(value: number) => string", default: "-", desc: "自定义格式化函数" },
  { name: "value-style", type: "object", default: "{}", desc: "数值区内联样式" }
];

const slotsRows = [
  { name: "title", desc: "替换标题" },
  { name: "prefix", desc: "替换前缀" },
  { name: "suffix", desc: "替换后缀" }
];

const PageStatisticProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageStatisticProps };
