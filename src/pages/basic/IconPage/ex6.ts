import { defineHtml, html } from "@elfui/core";

import {
  configureIcons,
  createClassIconSet,
  createSvgIconSet
} from "../../../components/Basic/Icon";

configureIcons({
  aliases: { account: "demo-mdi:account" },
  sets: {
    "demo-mdi": createSvgIconSet({
      account: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    }),
    fa: createClassIconSet({ baseClass: "fa-solid", prefix: "fa-" })
  }
});

const code = `<elf-icon name="$account" size="28" aria-label="账户" />
<elf-icon set="fa" name="github" size="28" aria-label="GitHub" />`;

const script = `import { configureIcons, createClassIconSet, createSvgIconSet } from "@elfui/kit";
import { mdiAccount } from "@mdi/js";

configureIcons({
  defaultSet: "mdi",
  aliases: { account: "mdi:account" },
  sets: {
    mdi: createSvgIconSet({ account: mdiAccount }),
    fa: createClassIconSet({ baseClass: "fa-solid", prefix: "fa-" })
  }
});

// 第三方包由应用按需安装；ElfUI 核心包不会打包 MDI 或 Font Awesome。`;

const PageIconEx6 = defineHtml(html`
  <elf-playground title="外部图标集合与语义别名" :code=${code} :script=${script}>
    <div style="display:flex;align-items:center;gap:20px">
      <elf-icon name="$account" size="28" color="var(--elf-primary)" aria-label="账户"></elf-icon>
      <span style="color:var(--elf-text-secondary);font-size:13px">CSS class 集合按相同方式配置</span>
    </div>
  </elf-playground>
`);

export { PageIconEx6 };
