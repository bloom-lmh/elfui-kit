import { defineHtml, html, useRef } from "elfui";

const palette = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f43f5e, #f59e0b)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #f97316, #ef4444)"
];

const roles = ["前端工程师", "后端工程师", "产品经理", "设计师", "测试工程师", "运维工程师"];
const bios = [
  "负责核心业务模块设计与开发，主导性能与体验优化。",
  "关注系统稳定性，推进服务端架构演进与可观测性建设。",
  "推动产品迭代，平衡用户价值与工程成本。",
  "沉淀设计规范，把控视觉一致性与品牌质感。",
  "建设质量门禁，守护发布链路的安全底线。",
  "保障基础设施高可用，优化资源调度与成本。"
];

const abbr16 = ["ZM","LS","WW","ZL","TQ","YY","WX","QH","RY","PL","ZB","YX","GH","MO","BK","SL"];

function member(i: number, abbr: string[]) {
  return {
    id: i + 1,
    name: "成员 " + (i + 1),
    role: roles[i % 6],
    initials: abbr[i],
    level: (i % 9) + 1,
    bio: bios[i % 6],
    styleBg: "background:" + palette[i % 6]
  };
}

const listA = Array.from({ length: 16 }, (_, i) => member(i, abbr16));

const scrollTop = useRef(0);
const onScroll = (event: CustomEvent): void => {
  const d = (event.detail || {}) as { scrollTop?: number };
  scrollTop.set(Number(d.scrollTop) || 0);
};

const code = '<elf-scrollbar :height="320" always @scroll="onScroll">\n'
  + '  <ul class="card-list">\n'
  + '    <li v-for="m in listA" :key="m.id" class="card-item">\n'
  + '      <span class="avatar" :style="m.styleBg">{{ m.initials }}</span>\n'
  + '      <div class="card-meta">\n'
  + '        <span class="card-name">{{ m.name }} <em>{{ m.role }}</em></span>\n'
  + '        <span class="card-desc">{{ m.bio }}</span>\n'
  + '      </div>\n'
  + '      <span class="card-level">Lv.{{ m.level }}</span>\n'
  + '    </li>\n'
  + '  </ul>\n'
  + '</elf-scrollbar>';

const script = 'const scrollTop = useRef(0);\n'
  + 'const onScroll = (event) => { scrollTop.set(event.detail.scrollTop); };';

const PageScrollbarEx1 = defineHtml(html`
  <h2>固定高度 + 滚动事件</h2>
  <elf-playground title="height / always / scroll — 团队花名册" :code=${code} :script=${script}>
    <elf-scrollbar :height=${320} always @scroll=${onScroll}>
      <ul class="card-list">
        <li v-for="m in listA" :key="m.id" class="card-item">
          <span class="avatar" :style="m.styleBg">{{ m.initials }}</span>
          <div class="card-meta">
            <span class="card-name">{{ m.name }} <em>{{ m.role }}</em></span>
            <span class="card-desc">{{ m.bio }}</span>
          </div>
          <span class="card-level">Lv.{{ m.level }}</span>
        </li>
      </ul>
    </elf-scrollbar>
    <span class="demo-state">scrollTop: ${scrollTop.value}</span>
  </elf-playground>
`);

export { PageScrollbarEx1 };
