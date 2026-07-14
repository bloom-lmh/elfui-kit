import { defineHtml, html } from "elfui";

const code1 = `<elf-container max-width="xs">xs (480px)</elf-container>
<elf-container max-width="sm">sm (600px)</elf-container>
<elf-container max-width="md">md (900px)</elf-container>
<elf-container max-width="lg">lg (1200px)</elf-container>
<elf-container max-width="xl">xl (1536px)</elf-container>`;

const script = `// max-width 使用预设档位，无需额外状态。`;

const PageContainerEx1 = defineHtml(html`
  <h2>不同 max-width</h2>
  <elf-playground title="xs ~ xl" :code=${code1} :script=${script}>
    <elf-container max-width="xs" style="background: var(--elf-bg-overlay); margin: 4px 0"
      >xs (480px)</elf-container
    >
    <elf-container max-width="sm" style="background: var(--elf-bg-overlay); margin: 4px 0"
      >sm (600px)</elf-container
    >
    <elf-container max-width="md" style="background: var(--elf-bg-overlay); margin: 4px 0"
      >md (900px)</elf-container
    >
    <elf-container max-width="lg" style="background: var(--elf-bg-overlay); margin: 4px 0"
      >lg (1200px)</elf-container
    >
    <elf-container max-width="xl" style="background: var(--elf-bg-overlay); margin: 4px 0"
      >xl (1536px)</elf-container
    >
  </elf-playground>
`);

export { PageContainerEx1 };
