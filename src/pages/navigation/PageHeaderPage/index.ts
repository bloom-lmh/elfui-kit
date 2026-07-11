import { defineHtml, html, useRef } from "elfui";

const message = useRef("等待返回操作");

const code1 = `<elf-page-header
  title="返回"
  content="订单详情"
  @back=\${onBack}
>
  <elf-button slot="extra" size="sm">编辑</elf-button>
</elf-page-header>`;

const script1 = `const message = useRef("等待返回操作");

const onBack = () => {
  message.set("触发 back 事件");
};`;

const code2 = `<elf-page-header content="自定义插槽">
  <span slot="breadcrumb">Home / Product / Detail</span>
  <span slot="icon">←</span>
  <span slot="title">回到列表</span>
  <span slot="content">发布配置</span>
  <div slot="extra">
    <elf-button size="sm" variant="outlined">预览</elf-button>
    <elf-button size="sm">保存</elf-button>
  </div>
</elf-page-header>`;

const propsRows = [
  { name: "title", type: "string", default: "Back", desc: "返回区域文本" },
  { name: "content", type: "string", default: "''", desc: "标题内容" },
  { name: "icon", type: "string", default: "‹", desc: "默认返回图标文本" }
];

const eventsRows = [{ name: "back", type: "() => void", desc: "点击返回按钮时触发" }];

const slotsRows = [
  { name: "breadcrumb", desc: "面包屑区域" },
  { name: "icon", desc: "返回图标" },
  { name: "title", desc: "返回文本" },
  { name: "content", desc: "标题内容" },
  { name: "extra", desc: "右侧扩展操作" }
];

const onBack = (): void => {
  message.set("触发 back 事件");
};

const PagePageHeader = defineHtml(html`
  <elf-container>
    <h1>PageHeader 页头</h1>
    <p>用于详情页顶部返回区域，支持 back 事件和 icon/title/content/extra 插槽。</p>

    <elf-playground title="基础页头 / back" :code=${code1} :script=${script1}>
      <elf-page-header title="返回" content="订单详情" @back=${onBack}>
        <elf-button slot="extra" size="sm">编辑</elf-button>
      </elf-page-header>
      <span class="demo-state">${message}</span>
    </elf-playground>

    <elf-playground title="slots" :code=${code2}>
      <elf-page-header content="自定义插槽">
        <span slot="breadcrumb">Home / Product / Detail</span>
        <span slot="icon">←</span>
        <span slot="title">回到列表</span>
        <span slot="content">发布配置</span>
        <div slot="extra" style="display:flex;gap:8px">
          <elf-button size="sm" variant="outlined">预览</elf-button>
          <elf-button size="sm">保存</elf-button>
        </div>
      </elf-page-header>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  </elf-container>
`);

export { PagePageHeader };
