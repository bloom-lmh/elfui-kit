import { defineHtml, html } from "elfui";

const code1 = `<elf-watermark
  content="ElfUI"
  :width=\${140}
  :height=\${72}
  :gap-x=\${60}
  :gap-y=\${48}
>
  <div class="demo-paper">这里是业务内容区域</div>
</elf-watermark>`;

const code2 = `<elf-watermark
  :content.prop=\${["ElfUI", "内部资料"]}
  font-color="rgba(25, 118, 210, 0.16)"
  :font-size=\${18}
  :rotate=\${-18}
>
  <div class="demo-paper">多行文字水印</div>
</elf-watermark>`;

const lines = ["ElfUI", "内部资料"];

const PageWatermark = defineHtml(html`
  <elf-container>
    <h1>Watermark 水印</h1>
    <p>给内容区域增加文字或图片水印，支持尺寸、间距、旋转角度、颜色和多行文本。</p>

    <elf-playground title="基础水印" :code=${code1}>
      <elf-watermark content="ElfUI" :width=${140} :height=${72} :gap-x=${60} :gap-y=${48}>
        <div
          style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
        >
          这里是业务内容区域，滚动、表格和表单都可以放在水印容器内。
        </div>
      </elf-watermark>
    </elf-playground>

    <elf-playground title="多行文本 / 自定义颜色" :code=${code2}>
      <elf-watermark
        :content.prop=${lines}
        font-color="rgba(25, 118, 210, 0.16)"
        :font-size=${18}
        :rotate=${-18}
      >
        <div
          style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
        >
          多行水印适合“内部资料”“演示环境”等提示。
        </div>
      </elf-watermark>
    </elf-playground>
  </elf-container>
`);

export { PageWatermark };
