import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef(64);

const format = (next: number): string => `${next}%`;

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider
  show-input
  color="#006a6a"
  :formatTooltip.prop="format"
  :modelValue.prop="value"
  @update:modelValue="onChange"
/>`;

const PageSliderEx3 = defineHtml(html`
  <h2>输入框联动</h2>
  <elf-playground title="show-input / color / formatTooltip" :code="code">
    <div style="display:grid;gap:14px;width:100%;max-width:720px">
      <elf-slider
        show-input
        color="#006a6a"
        :formatTooltip.prop="format"
        :modelValue.prop="value"
        @update:modelValue="onChange"
      ></elf-slider>
      <p class="demo-state">比例：{{ value }}%</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx3 };
