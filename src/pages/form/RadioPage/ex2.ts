import { defineHtml, html } from "elfui";
import { useReactive } from "elfui";

const data = useReactive({ picked: "" });

const code1 = `<elf-radio-group v-model="data.picked">
  <elf-radio border value="x" label="选项 X" />
  <elf-radio border value="y" label="选项 Y" />
  <elf-radio border value="z" label="选项 Z" />
</elf-radio-group>
<span style="font-size:12px;color:var(--elf-text-secondary)">当前: {{ data.picked || '未选' }}</span>`;

const PageRadioEx2 = defineHtml(html`
  <elf-playground title="按钮风格" :code="code1">
    <elf-radio-group v-model="data.picked">
      <elf-radio border value="x" label="选项 X" />
      <elf-radio border value="y" label="选项 Y" />
      <elf-radio border value="z" label="选项 Z" />
    </elf-radio-group>
    <span style="font-size:12px;color:var(--elf-text-secondary)"
      >当前: {{ data.picked || '未选' }}</span
    >
  </elf-playground>
`);

export { PageRadioEx2 };
