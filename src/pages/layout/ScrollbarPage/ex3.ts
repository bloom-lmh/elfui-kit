import { defineHtml, html, useTemplateRef } from "elfui";
import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";

const palette = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f43f5e, #f59e0b)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #f97316, #ef4444)"
];

const roles = ["前端工程师", "后端工程师", "产品经理", "设计师", "测试工程师", "运维工程师"];
const abbr10 = ["LF","MK","JZ","YH","XR","BW","CD","PE","QA","DT"];

function member(i: number, abbr: string[]) {
  return {
    id: i + 1,
    name: "频道 " + (i + 1),
    role: roles[i % 6],
    initials: abbr[i],
    styleBg: "background:" + palette[i % 6]
  };
}

const listC = Array.from({ length: 10 }, (_, i) => member(i, abbr10));

const sbRef = useTemplateRef<HTMLElement & ScrollbarExpose>("sbCmd");
const toTop = (): void => sbRef.value?.setScrollTop(0);
const toBottom = (): void => sbRef.value?.setScrollTop(99999);

const code = '<elf-scrollbar ref="sbCmd" :height="220" always>\n'
  + '  <ul class="card-list-h">\n'
  + '    <li v-for="m in listC" :key="m.id" class="card-item-h">\n'
  + '      <span class="avatar lg" :style="m.styleBg">{{ m.initials }}</span>\n'
  + '      <span class="card-name center">{{ m.name }}</span>\n'
  + '      <span class="card-desc center">{{ m.role }}</span>\n'
  + '    </li>\n'
  + '  </ul>\n'
  + '</elf-scrollbar>\n'
  + '<elf-button size="sm" @click="toTop">回顶</elf-button>\n'
  + '<elf-button size="sm" @click="toBottom">滚到底</elf-button>';

const script = 'const sbRef = useTemplateRef("sbCmd");\n'
  + 'const toTop = () => sbRef.value?.setScrollTop(0);\n'
  + 'const toBottom = () => sbRef.value?.setScrollTop(99999);';

const PageScrollbarEx3 = defineHtml(html`
  <h2>横向滚动 + 命令式控制</h2>
  <elf-playground title="横向滚动 / setScrollTop" :code=${code} :script=${script}>
    <elf-scrollbar ref="sbCmd" :height=${220} always>
      <ul class="card-list-h">
        <li v-for="m in listC" :key="m.id" class="card-item-h">
          <span class="avatar lg" :style="m.styleBg">{{ m.initials }}</span>
          <span class="card-name center">{{ m.name }}</span>
          <span class="card-desc center">{{ m.role }}</span>
        </li>
      </ul>
    </elf-scrollbar>
    <span class="cmd-row">
      <elf-button size="sm" variant="outlined" @click=${toTop}>回顶</elf-button>
      <elf-button size="sm" variant="outlined" @click=${toBottom}>滚到底</elf-button>
    </span>
  </elf-playground>
`);

export { PageScrollbarEx3 };
