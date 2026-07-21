import { defineHtml, html } from "elfui";

const imageCode = `<elf-avatar src="https://i.pravatar.cc/80?img=1" alt="Jane Doe"></elf-avatar>
<elf-avatar src="https://i.pravatar.cc/80?img=2" alt="John Smith"></elf-avatar>
<elf-avatar src="" alt="Error Fallback"></elf-avatar>`;

const fitCode = `<elf-avatar src="https://i.pravatar.cc/120?img=3" fit="cover"></elf-avatar>
<elf-avatar src="https://i.pravatar.cc/120?img=3" fit="contain"></elf-avatar>
<elf-avatar src-set="https://i.pravatar.cc/80?img=4 1x, https://i.pravatar.cc/160?img=4 2x" src="https://i.pravatar.cc/80?img=4"></elf-avatar>`;

const iconCode = `<elf-avatar icon="★" color="primary"></elf-avatar>
<elf-avatar icon="♥" color="danger"></elf-avatar>
<elf-avatar color="success"><span>VIP</span></elf-avatar>`;

const colorCode = `<elf-avatar alt="Admin" color="#7b1fa2"></elf-avatar>
<elf-avatar alt="User" color="#00838f"></elf-avatar>
<elf-avatar shape="square" alt="VIP" color="#ff6f00"></elf-avatar>`;

const PageAvatarEx2 = defineHtml(html`
  <h2>图片头像</h2>
  <elf-playground title="src / error fallback" :code=${imageCode}>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar src="https://i.pravatar.cc/80?img=1" alt="Jane Doe"></elf-avatar>
      <elf-avatar src="https://i.pravatar.cc/80?img=2" alt="John Smith"></elf-avatar>
      <elf-avatar src="" alt="Error Fallback"></elf-avatar>
    </div>
  </elf-playground>
  <elf-playground title="fit / src-set" :code=${fitCode}>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar src="https://i.pravatar.cc/120?img=3" fit="cover"></elf-avatar>
      <elf-avatar src="https://i.pravatar.cc/120?img=3" fit="contain"></elf-avatar>
      <elf-avatar
        src-set="https://i.pravatar.cc/80?img=4 1x, https://i.pravatar.cc/160?img=4 2x"
        src="https://i.pravatar.cc/80?img=4"
      ></elf-avatar>
    </div>
  </elf-playground>

  <h2>图标头像</h2>
  <elf-playground title="icon prop / slots" :code=${iconCode}>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar icon="★" color="primary"></elf-avatar>
      <elf-avatar icon="♥" color="danger"></elf-avatar>
      <elf-avatar color="success"><span>VIP</span></elf-avatar>
    </div>
  </elf-playground>

  <h2>自定义颜色</h2>
  <elf-playground title="color" :code=${colorCode}>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar alt="Admin" color="#7b1fa2"></elf-avatar>
      <elf-avatar alt="User" color="#00838f"></elf-avatar>
      <elf-avatar shape="square" alt="VIP" color="#ff6f00"></elf-avatar>
    </div>
  </elf-playground>
`);

export { PageAvatarEx2 };
