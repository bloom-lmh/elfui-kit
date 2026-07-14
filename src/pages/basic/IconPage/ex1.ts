import { defineHtml, html } from "elfui";

const basicCode = `<elf-icon name="?" />
<elf-icon name="✓" color="var(--elf-success)" />
<elf-icon name="!" color="var(--elf-warning)" />
<elf-icon name="×" color="var(--elf-danger)" />`;

const script1 = `// Icon 是纯展示组件，通过 name/size/color props 或 slot 使用`;

const PageIconEx1 = defineHtml(html`
<elf-playground title="name 和 color" :code=${basicCode} :script=${script1}>
            <elf-icon name="?"></elf-icon>
            <elf-icon name="✓" color="var(--elf-success)"></elf-icon>
            <elf-icon name="!" color="var(--elf-warning)"></elf-icon>
            <elf-icon name="×" color="var(--elf-danger)"></elf-icon>
        </elf-playground>
`);

export { PageIconEx1 };
