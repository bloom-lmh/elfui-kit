import { defineHtml, html } from "elfui";

const typeCode = `<elf-text>默认文本</elf-text>
<elf-text type="primary">主要文本</elf-text>
<elf-text type="success">成功文本</elf-text>
<elf-text type="warning">警告文本</elf-text>
<elf-text type="danger">危险文本</elf-text>
<elf-text type="info">信息文本</elf-text>`;

const styleCode = `<elf-text strong>加粗</elf-text>
<elf-text italic>斜体</elf-text>
<elf-text mark>标记</elf-text>
<elf-text deleted>删除</elf-text>
<elf-text inserted>插入</elf-text>`;

const clampCode = `<div style="width:260px">
  <elf-text truncated>
    这是一段很长很长的单行文本，超出容器时会被截断。
  </elf-text>
</div>
<div style="width:320px;margin-top:12px">
  <elf-text line-clamp="2">
    这里展示两行截断。内容会保持段落阅读感，同时避免在列表或卡片里把布局撑得太高。
  </elf-text>
</div>`;

const PageText = defineHtml(html`
  <elf-container>
    <h1>Text 文本</h1>
    <p>用于语义文本、尺寸和文本装饰，支持单行截断与多行截断。</p>

    <elf-playground title="语义类型" :code=${typeCode}>
      <elf-text>默认文本</elf-text>
      <elf-text type="primary">主要文本</elf-text>
      <elf-text type="success">成功文本</elf-text>
      <elf-text type="warning">警告文本</elf-text>
      <elf-text type="danger">危险文本</elf-text>
      <elf-text type="info">信息文本</elf-text>
    </elf-playground>

    <elf-playground title="文本样式" :code=${styleCode}>
      <elf-text strong>加粗</elf-text>
      <elf-text italic>斜体</elf-text>
      <elf-text mark>标记</elf-text>
      <elf-text deleted>删除</elf-text>
      <elf-text inserted>插入</elf-text>
    </elf-playground>

    <elf-playground title="截断" :code=${clampCode}>
      <div style="width:260px">
        <elf-text truncated>这是一段很长很长的单行文本，超出容器时会被截断。</elf-text>
      </div>
      <div style="width:320px;margin-top:12px">
        <elf-text line-clamp="2">
          这里展示两行截断。内容会保持段落阅读感，同时避免在列表或卡片里把布局撑得太高。
        </elf-text>
      </div>
    </elf-playground>
  </elf-container>
`);

export { PageText };
