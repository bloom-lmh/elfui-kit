import { defineHtml, html } from "elfui";

const basicCode = `<elf-icon name="?" />
<elf-icon name="✓" color="var(--elf-success)" />
<elf-icon name="!" color="var(--elf-warning)" />
<elf-icon name="×" color="var(--elf-danger)" />`;

const sizeCode = `<elf-icon name="A" size="16" />
<elf-icon name="B" size="24" />
<elf-icon name="C" size="32px" />
<elf-icon name="D" size="2.5em" />`;

const slotCode = `<elf-icon size="28" color="var(--elf-primary)" aria-label="star">
  ★
</elf-icon>`;

const propsRows = [
  { name: "name", type: "string", default: "''" },
  { name: "size", type: "number | string", default: "1em" },
  { name: "color", type: "string", default: "''" },
  { name: "aria-label", type: "string", default: "''" }
];

const slotsRows = [{ name: "default", desc: "custom icon content, including svg" }];

const PageIcon = defineHtml(html`
  <elf-container>
    <h1>Icon 图标</h1>
    <p>轻量图标容器，可以用 name 显示文本符号，也可以通过默认插槽放入自定义 SVG 或图标内容。</p>

    <elf-playground title="name / color" :code=${basicCode}>
      <elf-icon name="?"></elf-icon>
      <elf-icon name="✓" color="var(--elf-success)"></elf-icon>
      <elf-icon name="!" color="var(--elf-warning)"></elf-icon>
      <elf-icon name="×" color="var(--elf-danger)"></elf-icon>
    </elf-playground>

    <elf-playground title="size" :code=${sizeCode}>
      <elf-icon name="A" size="16"></elf-icon>
      <elf-icon name="B" size="24"></elf-icon>
      <elf-icon name="C" size="32px"></elf-icon>
      <elf-icon name="D" size="2.5em"></elf-icon>
    </elf-playground>

    <elf-playground title="slot / aria-label" :code=${slotCode}>
      <elf-icon size="28" color="var(--elf-primary)" aria-label="star">★</elf-icon>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows} />
    <elf-props-table title="Slots" :rows=${slotsRows} />
  </elf-container>
`);

export { PageIcon };
