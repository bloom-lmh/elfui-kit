import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef<[number, number]>([20, 72]);

const marks = [
  { value: 0, label: "0" },
  { value: 50, label: "50" },
  { value: 100, label: "100" }
];

const onChange = (event: CustomEvent): void => {
  const next = event.detail as [number, number];
  value.set([Number(next[0]), Number(next[1])]);
};

const code = `<elf-slider
  range
  show-stops
  :step.prop="10"
  :marks.prop="marks"
  :modelValue.prop="value"
  @update:modelValue="onChange"
/>`;

const PageSliderEx2 = defineHtml(html`
  <h2>范围选择</h2>
  <elf-playground title="范围、步进、刻度与间断点" :code="code">
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        range
        show-stops
        :step.prop="10"
        :marks.prop="marks"
        :modelValue.prop="value"
        @update:modelValue="onChange"
      ></elf-slider>
      <p class="demo-state">区间：{{ value[0] }} - {{ value[1] }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx2 };
