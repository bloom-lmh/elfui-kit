import { defineHtml, html } from "elfui";

const code1 = `<elf-container padding="0" max-width="md">padding=0</elf-container>
<elf-container padding="sm" max-width="md">padding=sm</elf-container>
<elf-container padding="md" max-width="md">padding=md</elf-container>
<elf-container padding="lg" max-width="md">padding=lg</elf-container>`;

const PageContainerEx2 = defineHtml(html`
  <h2>不同 padding</h2>
  <elf-playground title="0 / sm / md / lg" :code="code1">
    <elf-container
      padding="0"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=0</elf-container
    >
    <elf-container
      padding="sm"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=sm</elf-container
    >
    <elf-container
      padding="md"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=md</elf-container
    >
    <elf-container
      padding="lg"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=lg</elf-container
    >
  </elf-playground>
`);

export { PageContainerEx2 };
