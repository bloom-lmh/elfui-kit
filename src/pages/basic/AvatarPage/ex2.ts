import { defineHtml, html } from "elfui";

const code1 = `<elf-avatar
  src="https://i.pravatar.cc/80?img=1"
  alt="Jane Doe"
></elf-avatar>
<elf-avatar
  src="https://i.pravatar.cc/80?img=2"
  alt="John Smith"
></elf-avatar>`;

const code2 = `<elf-avatar icon="★" color="primary"></elf-avatar>
<elf-avatar icon="♥" color="danger"></elf-avatar>
<elf-avatar icon="☀" color="warning"></elf-avatar>
<elf-avatar icon="✓" color="success"></elf-avatar>`;

const code3 = `<elf-avatar alt="Admin" color="#7b1fa2"></elf-avatar>
<elf-avatar alt="User" color="#00838f"></elf-avatar>
<elf-avatar shape="square" alt="VIP" color="#ff6f00"></elf-avatar>`;

const PageAvatarEx2 = defineHtml(html`
  <h2>图片头像</h2>
  <elf-playground title="src 设置后优先展示图片，加载失败降级为首字母" :code="code1">
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar src="https://i.pravatar.cc/80?img=1" alt="Jane Doe"></elf-avatar>
      <elf-avatar src="https://i.pravatar.cc/80?img=2" alt="John Smith"></elf-avatar>
      <elf-avatar src="https://broken.url/img.jpg" alt="Error Fallback"></elf-avatar>
    </div>
  </elf-playground>

  <h2>图标头像</h2>
  <elf-playground title="icon 属性设置 Unicode 图标" :code="code2">
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar icon="★" color="primary"></elf-avatar>
      <elf-avatar icon="♥" color="danger"></elf-avatar>
      <elf-avatar icon="☀" color="warning"></elf-avatar>
      <elf-avatar icon="✓" color="success"></elf-avatar>
    </div>
  </elf-playground>

  <h2>自定义颜色</h2>
  <elf-playground title="color 属性覆盖自动哈希颜色" :code="code3">
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar alt="Admin" color="#7b1fa2"></elf-avatar>
      <elf-avatar alt="User" color="#00838f"></elf-avatar>
      <elf-avatar shape="square" alt="VIP" color="#ff6f00"></elf-avatar>
    </div>
  </elf-playground>
`);

export { PageAvatarEx2 };
