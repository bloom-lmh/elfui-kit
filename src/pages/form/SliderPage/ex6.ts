import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef(45);

const marks = {
  0: "冷静",
  30: "适中",
  70: "积极",
  100: "冲刺"
};

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  segmented
  :marks.prop="marks"
  :modelValue.prop="value"
  @update:modelValue="onChange"
/>`;

const PageSliderEx6 = defineHtml(html`
  <h2>分段滑块</h2>
  <elf-playground title="分段轨道与刻度" :code="code">
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        segmented
        :marks.prop="marks"
        :modelValue.prop="value"
        @update:modelValue="onChange"
      ></elf-slider>
      <p class="demo-state">强度：{{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx6 };
