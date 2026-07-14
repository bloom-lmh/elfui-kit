import { defineHtml, html, useReactive } from "elfui";


const data = useReactive({ picked: "a" });

const code1 = `<elf-radio-group v-model="data.picked" disabled>
  <elf-radio value="a" label="A" />
  <elf-radio value="b" label="B" />
</elf-radio-group>`;

const PageRadioEx3 = defineHtml(html`
  <elf-playground title="禁用" :code="code1">
    <elf-radio-group v-model="data.picked" disabled aria-label="Disabled choices">
      <elf-radio value="a" label="A" />
      <elf-radio value="b" label="B" />
    </elf-radio-group>
  </elf-playground>
`);

export { PageRadioEx3 };
