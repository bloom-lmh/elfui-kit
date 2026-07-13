import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef(3);

const half = useRef(3.5);

const mood = useRef(4);

const palette = ["#ef4444", "#f59e0b", "#22c55e"];
const rateIcons = ["😞", "😐", "😊"];

const basicCode = `<elf-rate v-model="value" show-text></elf-rate>`;

const halfCode = `<elf-rate v-model="half" allow-half show-score score-template="{value} 分"></elf-rate>`;

const customCode = `<elf-rate character="♥" color="#d81b60" void-color="#f8bbd0"></elf-rate>`;

const onValue = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const onHalf = (event: CustomEvent): void => {
  half.set(Number(event.detail));
};

const onMood = (event: CustomEvent): void => {
  mood.set(Number(event.detail));
};

const propsRows = [
  { name: "modelValue", type: "number", default: "0", desc: "当前评分" },
  { name: "max", type: "number", default: "5", desc: "最大评分" },
  { name: "allowHalf", type: "boolean", default: "false", desc: "是否允许半星" },
  { name: "clearable", type: "boolean", default: "true", desc: "再次点击当前分可清空" },
  { name: "showText / showScore", type: "boolean", default: "false", desc: "展示描述或分数" },
  { name: "character", type: "string", default: "★", desc: "自定义评分符号" }
];

const PageRate = defineHtml(html`
  <elf-container>
    <h1>Rate 评分</h1>
    <p>用于主观评分与满意度输入，支持半星、清空、只读、文本、分数、自定义符号和键盘调整。</p>

    <elf-playground title="基础评分与文本" :code="basicCode">
      <div style="display:grid;gap:12px">
        <elf-rate :modelValue.prop="value" show-text @update:modelValue="onValue"></elf-rate>
        <span class="demo-state">当前评分：{{ value }}</span>
      </div>
    </elf-playground>

    <elf-playground title="半星与分数" :code="halfCode">
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop="half"
          allow-half
          show-score
          score-template="{value} 分"
          @update:modelValue="onHalf"
        ></elf-rate>
        <span class="demo-state">半星评分：{{ half }}</span>
      </div>
    </elf-playground>

    <elf-playground title="自定义符号与只读" :code="customCode">
      <div style="display:grid;gap:12px">
        <elf-rate
          :modelValue.prop="mood"
          character="♥"
          void-character="♡"
          color="#d81b60"
          void-color="#f8bbd0"
          @update:modelValue="onMood"
        ></elf-rate>
        <elf-rate model-value="4" readonly show-score score-template="{value} / 5"></elf-rate>
      </div>
    </elf-playground>

    <elf-playground title="分段颜色与图标">
      <div style="display:grid;gap:12px">
        <elf-rate
          model-value="4"
          :colors.prop=${palette}
          :icons.prop=${rateIcons}
          void-icon="0"
          low-threshold="2"
          high-threshold="4"
          aria-label="满意度评分"
        ></elf-rate>
        <elf-rate model-value="2" disabled-void-icon="-" readonly></elf-rate>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="评分属性" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageRate };
