import { defineHtml, html } from "elfui";

const stateCode = `<elf-link type="primary" .underline=\${false} href="#">无下划线</elf-link>
<elf-link disabled href="#">禁用链接</elf-link>
<elf-link icon="↗" href="https://github.com" target="_blank">打开 GitHub</elf-link>`;

const script1 = `// Link 是纯展示组件，直接使用 props 即可
// 动态控制可用 defineHtml + useRef 配合 v-if`;

const PageLinkEx2 = defineHtml(html`
<elf-playground title="下划线 / 禁用 / 外链" :code=${stateCode} :script=${script1}>
            <elf-link type="primary" .underline=${false} href="#">无下划线</elf-link>
            <elf-link disabled href="#">禁用链接</elf-link>
            <elf-link icon="↗" href="https://github.com" target="_blank">打开 GitHub</elf-link>
        </elf-playground>
`);

export { PageLinkEx2 };
