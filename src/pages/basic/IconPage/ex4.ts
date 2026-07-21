import { defineHtml, html } from "@elfui/core";

const svgCode = `<elf-icon size="18" color="var(--elf-primary)" aria-label="search">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
</elf-icon>`;

const PageIconEx4 = defineHtml(html`
<elf-playground title="SVG 图标" :code=${svgCode}>
            <elf-icon size="18" color="var(--elf-primary)" aria-label="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </elf-icon>
        </elf-playground>
`);

export { PageIconEx4 };
