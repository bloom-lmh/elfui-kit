import { defineHtml, html } from "elfui";

const defaults = {
  "elf-button": {
    variant: "outlined",
    color: "secondary",
    size: "sm"
  },
  "elf-tag": {
    color: "success",
    variant: "light"
  }
};

const overwriteDefaults = {
  Button: {
    color: "success",
    variant: "contained"
  }
};

const basicCode = `<elf-defaults-provider :defaults.prop="defaults">
  <elf-button>继承默认按钮</elf-button>
  <elf-button color="danger">显式属性优先</elf-button>
</elf-defaults-provider>`;

const overwriteCode = `<elf-defaults-provider strategy="overwrite" :defaults.prop="overwriteDefaults">
  <elf-button color="danger">会被覆盖成 success</elf-button>
</elf-defaults-provider>`;

const propsRows = [
  {
    name: "defaults",
    type: "Record<string, object>",
    default: "{}",
    desc: "按组件名匹配默认 props"
  },
  { name: "strategy", type: "missing | overwrite", default: "missing", desc: "默认值写入策略" },
  { name: "deep", type: "boolean", default: "true", desc: "是否递归作用于所有后代" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用默认值下发" }
];

const PageDefaultsProvider = defineHtml(html`
  <elf-container>
    <h1>DefaultsProvider 默认值提供器</h1>
    <p>为一段组件树批量设置默认 props，适合统一按钮、标签、表单控件的默认尺寸和风格。</p>

    <elf-playground title="默认属性下发" :code="basicCode">
      <elf-defaults-provider :defaults.prop="defaults">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button>继承默认按钮</elf-button>
          <elf-button color="danger">显式属性优先</elf-button>
          <elf-tag>继承 Tag 默认值</elf-tag>
        </div>
      </elf-defaults-provider>
    </elf-playground>

    <elf-playground title="overwrite 覆盖策略" :code="overwriteCode">
      <elf-defaults-provider strategy="overwrite" :defaults.prop="overwriteDefaults">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button color="danger">会被覆盖成 success</elf-button>
          <elf-button variant="text">也会统一成 contained</elf-button>
        </div>
      </elf-defaults-provider>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="DefaultsProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageDefaultsProvider };
