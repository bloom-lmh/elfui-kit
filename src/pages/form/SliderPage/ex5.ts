import { defineHtml, html } from "elfui";

const code = `<elf-slider disabled :modelValue.prop="70"></elf-slider>`;

const PageSliderEx5 = defineHtml(html`
  <h2>禁用状态</h2>
  <elf-playground title="disabled" :code="code">
    <div style="width:100%;max-width:680px">
      <elf-slider disabled :modelValue.prop="70"></elf-slider>
    </div>
  </elf-playground>
`);

export { PageSliderEx5 };
