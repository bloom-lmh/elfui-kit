import { defineHtml, html } from "elfui";

const slotCode = `<elf-icon size="28" color="var(--elf-primary)" aria-label="star">
  ★
</elf-icon>`;

const PageIconEx3 = defineHtml(html`
<elf-playground title="slot 插槽 + aria-label" :code=${slotCode}>
            <elf-icon size="28" color="var(--elf-primary)" aria-label="star">★</elf-icon>
        </elf-playground>
`);

export { PageIconEx3 };
