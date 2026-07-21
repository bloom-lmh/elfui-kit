import { defineHtml, html } from "@elfui/core";

const sizeCode = `<elf-icon name="A" size="16" />
<elf-icon name="B" size="24" />
<elf-icon name="C" size="32px" />
<elf-icon name="D" size="2.5em" />`;

const PageIconEx2 = defineHtml(html`
<elf-playground title="size 尺寸" :code=${sizeCode}>
            <elf-icon name="A" size="16"></elf-icon>
            <elf-icon name="B" size="24"></elf-icon>
            <elf-icon name="C" size="32px"></elf-icon>
            <elf-icon name="D" size="2.5em"></elf-icon>
        </elf-playground>
`);

export { PageIconEx2 };
