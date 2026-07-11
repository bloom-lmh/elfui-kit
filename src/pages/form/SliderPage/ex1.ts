import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const value = useRef(36);

const onChange = (event: CustomEvent): void => {
  value.set(Number(event.detail));
};

const code = `<elf-slider :modelValue.prop="value" @update:modelValue="onChange"></elf-slider>`;

const PageSliderEx1 = defineHtml(html`
  <h2>基础滑块</h2>
  <elf-playground title="单值、Tooltip 与受控值" :code="code">
    <div style="display:grid;gap:14px;width:100%;max-width:680px">
      <elf-slider :modelValue.prop="value" @update:modelValue="onChange"></elf-slider>
      <p class="demo-state">当前值：{{ value }}</p>
    </div>
  </elf-playground>
`);

export { PageSliderEx1 };
