import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef(36);

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  :showInputControls.prop="false"
  input-size="large"
  label="Volume"
  placement="right"
  tooltip-class="volume-tooltip"
  :modelValue.prop="value"
  @update:modelValue="onChange"
/>`;

const PageSliderEx7 = defineHtml(html`
  <h2>输入控件与辅助标签</h2>
  <elf-playground title="输入按钮、输入尺寸与标签" :code="code">
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        :showInputControls.prop="false"
        input-size="large"
        label="Volume"
        placement="right"
        tooltip-class="volume-tooltip"
        :modelValue.prop="value"
        @update:modelValue="onChange"
      ></elf-slider>
      <p class="demo-state">当前音量：{{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx7 };
