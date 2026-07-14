import { defineHtml, html, useReactive } from "elfui";


const data = useReactive({ cities: ["beijing", "shanghai"] as string[] });

const code1 = `<elf-checkbox-group v-model="cities">
  <elf-checkbox value="beijing" label="北京" />
  <elf-checkbox value="shanghai" label="上海" />
  <elf-checkbox value="guangzhou" label="广州" />
</elf-checkbox-group>`;

const PageCheckboxEx2 = defineHtml(html`
  <elf-playground title="CheckboxGroup" :code="code1">
    <elf-checkbox-group v-model="data.cities">
      <elf-checkbox value="beijing" label="北京" />
      <elf-checkbox value="shanghai" label="上海" />
      <elf-checkbox value="guangzhou" label="广州" />
    </elf-checkbox-group>
    <span style="font-size:12px;color:var(--elf-text-secondary)"
      >选中: {{ data.cities.join(', ') }}</span
    >
  </elf-playground>
`);

export { PageCheckboxEx2 };
