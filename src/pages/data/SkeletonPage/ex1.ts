import { defineHtml, html } from "elfui";

const code1 = `<elf-skeleton />
<elf-skeleton variant="text" count="3" gap="12px" style="margin-top:16px" />
<elf-skeleton variant="text" count="1" width="60%" style="margin-top:8px" />`;

const code2 = `<elf-skeleton variant="circle" width="64px" height="64px" />
<elf-skeleton variant="circle" width="48px" height="48px" />
<elf-skeleton variant="circle" width="32px" height="32px" />

<elf-skeleton variant="rect" width="100%" height="200px" />
<elf-skeleton variant="rect" width="60%" height="40px" />
<elf-skeleton variant="rect" width="40%" height="24px" />`;

const code3 = `<elf-skeleton variant="image" width="100%" height="180px" />
<elf-skeleton variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
<elf-skeleton variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />`;

const PageSkeletonEx1 = defineHtml(html`
  <h2>文字骨架</h2>
  <elf-playground title="单行 + 多行段落" :code="code1">
    <div style="width:360px">
      <elf-skeleton />
      <elf-skeleton variant="text" count="3" gap="12px" style="margin-top:16px" />
      <elf-skeleton variant="text" count="1" width="60%" style="margin-top:8px" />
    </div>
  </elf-playground>

  <h2>圆形 / 矩形 / 图片</h2>
  <elf-playground title="各种形状 + 自定义尺寸" :code="code2">
    <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:360px">
      <div style="display:flex;gap:16px;align-items:flex-end">
        <elf-skeleton variant="circle" width="64px" height="64px" />
        <elf-skeleton variant="circle" width="48px" height="48px" />
        <elf-skeleton variant="circle" width="32px" height="32px" />
      </div>
      <elf-skeleton variant="rect" width="100%" height="200px" />
      <elf-skeleton variant="rect" width="60%" height="40px" />
      <elf-skeleton variant="rect" width="40%" height="24px" />
    </div>
  </elf-playground>

  <h2>图片占位</h2>
  <elf-playground title="image 变体 = rect + 200px 默认高度" :code="code3">
    <div style="width:360px">
      <elf-skeleton variant="image" width="100%" height="180px" />
      <elf-skeleton variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
      <elf-skeleton variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />
    </div>
  </elf-playground>
`);

export { PageSkeletonEx1 };
