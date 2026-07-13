import { defineHtml, html, useComponents } from "elfui";
import { PageWatermarkProps } from "./props";

useComponents({ "page-watermark-props": PageWatermarkProps });

const code1 = `<elf-watermark
  content="ElfUI"
  :width="140"
  :height="72"
  :gap-x="60"
  :gap-y="48"
>
  <div class="demo-paper">这里是业务内容区域</div>
</elf-watermark>`;

const code2 = `<elf-watermark :content.prop="lines" :font.prop="font" :rotate="-18">
  <div class="demo-paper">多行文字水印</div>
</elf-watermark>`;

const lines = ["ElfUI", "内部资料"];
const font = {
  color: "rgba(25, 118, 210, 0.16)",
  fontSize: 18,
  fontWeight: 600,
  fontStyle: "italic",
  fontFamily: "Inter, sans-serif",
  textAlign: "right" as const
};

const PageWatermark = defineHtml(html`
  <elf-container>
    <h1>Watermark 水印</h1>
    <p>给内容区域增加文字或图片水印，支持尺寸、间距、旋转角度、颜色及多行文本。</p>

    <elf-playground title="基础水印" :code=${code1}>
      <elf-watermark content="ElfUI" :width=${140} :height=${72} :gap-x=${60} :gap-y=${48}>
        <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
          这里是业务内容区域，滚动、表格和表单都可以放在水印容器内。
        </div>
      </elf-watermark>
    </elf-playground>

    <elf-playground title="完整字体对象" :code=${code2}>
      <elf-watermark :content.prop=${lines} :font.prop=${font} :rotate=${-18}>
        <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
          字体对象可统一设置颜色、字号、字重、字形、字族与文字对齐方式。
        </div>
      </elf-watermark>
    </elf-playground>
    <page-watermark-props></page-watermark-props>
  </elf-container>
`);

export { PageWatermark };
