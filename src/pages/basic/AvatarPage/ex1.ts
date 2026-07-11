import { defineHtml, html } from "elfui";

const code1 = `<elf-avatar alt="张三"></elf-avatar>
<elf-avatar alt="李四"></elf-avatar>
<elf-avatar alt="Admin"></elf-avatar>`;

const code2 = `<elf-avatar size="sm" alt="小王"></elf-avatar>
<elf-avatar size="md" alt="小王"></elf-avatar>
<elf-avatar size="lg" alt="小王"></elf-avatar>
<elf-avatar size="xl" alt="小王"></elf-avatar>`;

const code3 = `<elf-avatar shape="circle" alt="AB"></elf-avatar>
<elf-avatar shape="square" alt="AB"></elf-avatar>`;

const PageAvatarEx1 = defineHtml(html`
  <h2>文字头像</h2>
  <elf-playground title="根据 alt 自动生成首字母缩写" :code="code1">
    <elf-avatar alt="张三"></elf-avatar>
    <div style="width: 8px"></div>
    <elf-avatar alt="李四"></elf-avatar>
    <div style="width: 8px"></div>
    <elf-avatar alt="Admin"></elf-avatar>
  </elf-playground>

  <h2>尺寸</h2>
  <elf-playground title="sm (24px) / md (40px) / lg (56px) / xl (80px)" :code="code2">
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar size="sm" alt="小王"></elf-avatar>
      <elf-avatar size="md" alt="小王"></elf-avatar>
      <elf-avatar size="lg" alt="小王"></elf-avatar>
      <elf-avatar size="xl" alt="小王"></elf-avatar>
    </div>
  </elf-playground>

  <h2>形状</h2>
  <elf-playground title="circle / square" :code="code3">
    <elf-avatar shape="circle" alt="AB"></elf-avatar>
    <div style="width: 12px"></div>
    <elf-avatar shape="square" alt="AB"></elf-avatar>
  </elf-playground>
`);

export { PageAvatarEx1 };
