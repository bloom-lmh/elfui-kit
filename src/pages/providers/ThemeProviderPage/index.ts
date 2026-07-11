import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const customPrimary = useRef("#6750a4");

const darkCode = `<elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
  <elf-button>继承局部主题</elf-button>
</elf-theme-provider>`;

const customCode = `<elf-theme-provider theme="custom" :tokens.prop="tokens">
  ...
</elf-theme-provider>`;

const customTokens = () => ({
  primary: customPrimary.value,
  primaryHover: "#4f378b",
  bgPaper: "#fffbff",
  bgOverlay: "rgba(103, 80, 164, 0.08)",
  textPrimary: "rgba(29, 27, 32, 0.87)",
  border: "rgba(103, 80, 164, 0.28)"
});

const onColor = (event: CustomEvent): void => {
  customPrimary.set(String(event.detail));
};

const propsRows = [
  {
    name: "theme",
    type: "light | dark | custom",
    default: "light",
    desc: "内置主题或自定义主题"
  },
  {
    name: "primary / secondary / surface",
    type: "string",
    default: "",
    desc: "常用 token 快捷覆盖"
  },
  { name: "tokens", type: "ThemeTokens", default: "{}", desc: "完整局部 CSS 变量覆盖" }
];

const PageThemeProvider = defineHtml(html`
  <elf-container>
    <h1>ThemeProvider 主题提供器</h1>
    <p>通过局部 CSS variables 覆盖一段子树的 Material Design token，不会修改全站主题。</p>

    <elf-playground title="局部暗色主题" :code="darkCode">
      <elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
        <div
          style="display:grid;gap:12px;width:100%;max-width:680px;padding:20px;border-radius:8px;background:var(--elf-bg-paper);color:var(--elf-text-primary);border:1px solid var(--elf-border)"
        >
          <strong>局部暗色主题</strong>
          <span style="color:var(--elf-text-secondary)"
            >只影响 provider 子树，不会改全站 data-theme。</span
          >
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <elf-button>继承主题按钮</elf-button>
            <elf-button variant="outlined">描边按钮</elf-button>
            <elf-tag color="info">局部 token</elf-tag>
          </div>
        </div>
      </elf-theme-provider>
    </elf-playground>

    <elf-playground title="自定义主色" :code="customCode">
      <div style="display:grid;gap:16px;width:100%;max-width:720px">
        <elf-color-picker
          :modelValue="customPrimary"
          @update:modelValue="onColor"
        ></elf-color-picker>
        <elf-theme-provider theme="custom" :tokens.prop="customTokens()">
          <div
            style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:20px;border-radius:8px;background:var(--elf-bg-paper);border:1px solid var(--elf-border)"
          >
            <elf-button>动态主色</elf-button>
            <elf-button variant="outlined">描边</elf-button>
            <elf-tag>Token</elf-tag>
          </div>
        </elf-theme-provider>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="ThemeProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageThemeProvider };
