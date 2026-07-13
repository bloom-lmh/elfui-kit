import { defineHtml, html, useComponents } from "elfui";
import { PageEmptyProps } from "./props";

useComponents({ "page-empty-props": PageEmptyProps });

const basicCode = `<elf-empty description="暂无数据" />`;
const customCode = `<elf-empty description="筛选条件没有命中" image-size="96">
  <span slot="image">⌕</span>
  <elf-button size="sm">重置筛选</elf-button>
</elf-empty>`;
const imageCode = `<elf-empty image="/empty-illustration.svg" image-size="120" description="还没有上传图片" />`;

const PageEmpty = defineHtml(html`
  <elf-container>
    <h1>Empty 空状态</h1>
    <p>用于列表、表格、搜索结果等空内容场景，支持默认插画、自定义图片、说明和底部操作。</p>
    <elf-playground title="默认空状态" :code=${basicCode}>
      <elf-empty description="暂无数据"></elf-empty>
    </elf-playground>
    <elf-playground title="自定义插槽" :code=${customCode}>
      <elf-empty description="筛选条件没有命中" image-size="96">
        <span slot="image">⌕</span>
        <elf-button size="sm">重置筛选</elf-button>
      </elf-empty>
    </elf-playground>
    <elf-playground title="自定义图片" :code=${imageCode}>
      <elf-empty image="https://picsum.photos/160/120?random=empty" image-size="120" description="还没有上传图片"></elf-empty>
    </elf-playground>
    <page-empty-props></page-empty-props>
  </elf-container>
`);
export { PageEmpty };
