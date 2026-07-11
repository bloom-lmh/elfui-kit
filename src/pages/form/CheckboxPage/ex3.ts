import { defineHtml, html } from "elfui";
import { useReactive } from "elfui";

const data = useReactive({ fruits: [] as string[] });

const code1 = `<elf-checkbox-group v-model="fruits" min="1" max="2">
  <elf-checkbox value="apple" label="苹果" />
  <elf-checkbox value="banana" label="香蕉" />
  <elf-checkbox value="orange" label="橙子" />
</elf-checkbox-group>`;

const PageCheckboxEx3 = defineHtml(html`
  <elf-playground title="min=1 max=2" :code="code1">
    <elf-checkbox-group v-model="data.fruits" min="1" max="2">
      <elf-checkbox value="apple" label="苹果" />
      <elf-checkbox value="banana" label="香蕉" />
      <elf-checkbox value="orange" label="橙子" />
    </elf-checkbox-group>
    <span style="font-size:12px;color:var(--elf-text-secondary)"
      >选中: {{ data.fruits.join(', ') || '至少选1个' }}</span
    >
  </elf-playground>
`);

export { PageCheckboxEx3 };
