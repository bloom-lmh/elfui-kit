import { defineHtml, html } from "elfui";

const palette = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f43f5e, #f59e0b)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #f97316, #ef4444)"
];

const roles = ["前端工程师", "后端工程师", "产品经理", "设计师", "测试工程师", "运维工程师"];
const statuses: Array<"online" | "busy" | "away"> = ["online", "busy", "away"];
const statusText: Record<string, string> = { online: "在线", busy: "忙碌", away: "离开" };
const bios = [
  "负责核心业务模块设计与开发，主导性能与体验优化。",
  "关注系统稳定性，推进服务端架构演进与可观测性建设。",
  "推动产品迭代，平衡用户价值与工程成本。",
  "沉淀设计规范，把控视觉一致性与品牌质感。",
  "建设质量门禁，守护发布链路的安全底线。",
  "保障基础设施高可用，优化资源调度与成本。"
];

const abbr24 = ["ZM","LS","WW","ZL","TQ","YY","WX","QH","RY","PL","ZB","YX","GH","MO","BK","SL","FN","DT","KA","HB","JN","VX","QP","LM"];

function member(i: number, abbr: string[]) {
  return {
    id: i + 1,
    name: "专家 " + (i + 1),
    role: roles[i % 6],
    initials: abbr[i],
    status: statuses[i % 3],
    statusText: statusText[statuses[i % 3]],
    bio: bios[i % 6],
    styleBg: "background:" + palette[i % 6]
  };
}

const listB = Array.from({ length: 24 }, (_, i) => member(i, abbr24));

const code = '<elf-scrollbar max-height="360px">\n'
  + '  <ul class="card-list wide">\n'
  + '    <li v-for="m in listB" :key="m.id" class="card-item">\n'
  + '      <span class="avatar" :style="m.styleBg">\n'
  + '        {{ m.initials }}\n'
  + '        <i class="dot" :class="m.status" aria-hidden="true"></i>\n'
  + '      </span>\n'
  + '      <div class="card-meta">\n'
  + '        <span class="card-name">{{ m.name }} <em>{{ m.role }}</em></span>\n'
  + '        <span class="card-desc">{{ m.bio }}</span>\n'
  + '      </div>\n'
  + '      <span class="card-status">{{ m.statusText }}</span>\n'
  + '    </li>\n'
  + '  </ul>\n'
  + '</elf-scrollbar>';

const PageScrollbarEx2 = defineHtml(html`
  <h2>最大高度 + 状态点</h2>
  <elf-playground title="max-height — 在线专家" :code=${code}>
    <elf-scrollbar max-height="360px">
      <ul class="card-list wide">
        <li v-for="m in listB" :key="m.id" class="card-item">
          <span class="avatar" :style="m.styleBg">
            {{ m.initials }}
            <i class="dot" :class="m.status" aria-hidden="true"></i>
          </span>
          <div class="card-meta">
            <span class="card-name">{{ m.name }} <em>{{ m.role }}</em></span>
            <span class="card-desc">{{ m.bio }}</span>
          </div>
          <span class="card-status">{{ m.statusText }}</span>
        </li>
      </ul>
    </elf-scrollbar>
  </elf-playground>
`);

export { PageScrollbarEx2 };
