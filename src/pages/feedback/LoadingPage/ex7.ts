import { defineHtml, html } from "elfui";

import { ElfLoading } from "../../../components/Feedback/Loading/service";

const code = `<elf-button @click=\${openFullscreen}>启动全屏 Loading service</elf-button>`;

const script = `import { ElfLoading } from "@elfui/kit";

const openFullscreen = () => {
  const loading = ElfLoading({
    text: "正在同步工作区",
    variant: "bars",
    lock: true
  });

  window.setTimeout(() => loading.close(), 8000);
};`;

const openFullscreen = (): void => {
  const loading = ElfLoading({
    text: "正在同步工作区",
    variant: "bars",
    lock: true
  });
  window.setTimeout(() => loading.close(), 8000);
};

const PageLoadingEx7 = defineHtml(html`
  <h2>Loading service</h2>
  <elf-playground title="命令式全屏加载会自动锁定页面滚动" :code=${code} :script=${script}>
    <elf-button @click=${openFullscreen}>启动全屏 Loading service</elf-button>
  </elf-playground>
`);

export { PageLoadingEx7 };
