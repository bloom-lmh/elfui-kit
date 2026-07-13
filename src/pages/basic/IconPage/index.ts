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

const svgCode = `<elf-icon size="18" color="var(--elf-primary)" aria-label="search">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
</elf-icon>`;

const propsRows = [
  { name: "name", type: "string", default: "''" },
  { name: "size", type: "number | string", default: "1em" },
  { name: "color", type: "string", default: "''" },
  { name: "aria-label", type: "string", default: "''" }
];

const script1 = `// Icon 是纯展示组件，通过 name/size/color props 或 slot 使用`;

const slotsRows = [{ name: "default", desc: "自定义图标内容（文本/SVG/组件）" }];

const PageIcon = defineHtml(html`
    <elf-container>
        <h1>Icon 图标</h1>
        <p>轻量图标容器，通过 name 显示文本符号，或默认插槽放入自定义 SVG。</p>

        <elf-playground title="name 和 color" :code=${basicCode} :script=${script1}>
            <elf-icon name="?"></elf-icon>
            <elf-icon name="✓" color="var(--elf-success)"></elf-icon>
            <elf-icon name="!" color="var(--elf-warning)"></elf-icon>
            <elf-icon name="×" color="var(--elf-danger)"></elf-icon>
        </elf-playground>

        <elf-playground title="size 尺寸" :code=${sizeCode}>
            <elf-icon name="A" size="16"></elf-icon>
            <elf-icon name="B" size="24"></elf-icon>
            <elf-icon name="C" size="32px"></elf-icon>
            <elf-icon name="D" size="2.5em"></elf-icon>
        </elf-playground>

        <elf-playground title="slot 插槽 + aria-label" :code=${slotCode}>
            <elf-icon size="28" color="var(--elf-primary)" aria-label="star">★</elf-icon>
        </elf-playground>

        <elf-playground title="SVG 图标" :code=${svgCode}>
            <elf-icon size="18" color="var(--elf-primary)" aria-label="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </elf-icon>
        </elf-playground>

        <h2>API</h2>
        <elf-props-table title="Props" :rows=${propsRows} />
        <elf-props-table title="Slots" :rows=${slotsRows} />
    </elf-container>
`);

export { PageIcon };
