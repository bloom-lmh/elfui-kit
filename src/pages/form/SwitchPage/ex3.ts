import { defineHtml, html } from "elfui";

const variantCode = `<elf-switch inset color="success" label="Inset" />
<elf-switch flat color="warning" label="Flat" />
<elf-switch color="#7c3aed" label="Custom color" />`;

const labelCode = `<elf-switch label-position="start">默认 slot 标签</elf-switch>`;

const PageSwitchEx3 = defineHtml(html`
  <h2>外观</h2>
  <elf-playground title="inset / flat / color" :code="variantCode">
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <elf-switch inset color="success" label="Inset"></elf-switch>
      <elf-switch flat color="warning" label="Flat"></elf-switch>
      <elf-switch color="#7c3aed" label="自定义颜色"></elf-switch>
      <elf-switch active-color="#00897b" inactive-color="#cfd8dc" label="双色"></elf-switch>
    </div>
  </elf-playground>

  <h2>标签 slot</h2>
  <elf-playground title="default slot" :code="labelCode">
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <elf-switch label-position="start">默认 slot 标签</elf-switch>
      <elf-switch label="属性标签"></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx3 };
